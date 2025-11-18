import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";

export const useSocket = () => {
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [currentRoom, setCurrentRoom] = useState("");
  const [rooms, setRooms] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});

  const usernameRef = useRef("");

  // --------------------------
  // CONNECT SOCKET
  // --------------------------
  const connect = (username) => {
    usernameRef.current = username;

    const s = io("http://localhost:5000", {
      transports: ["websocket"],
    });

    setSocket(s);

    s.on("connect", () => {
      console.log("Socket connected:", s.id);
    });

    // USER LIST
    s.on("user_list", (list) => {
      setUsers(list);
    });

    // CHAT HISTORY
    s.on("chat_history", (msgs) => {
      setMessages(msgs);
    });

    s.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // USER JOIN
    s.on("user_joined_notification", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          text: `${data.username} joined`,
          timestamp: data.timestamp,
        },
      ]);
    });

    // USER LEFT
    s.on("user_left", (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          text: `${user.username} left`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    // TYPING
    s.on("typing_users", (list) => {
      setTypingUsers(list);
    });

    return s;
  };

  // --------------------------
  // JOIN ROOM
  // --------------------------
  const joinRoom = (room) => {
    if (!socket) return;

    socket.emit("user_joined", {
      username: usernameRef.current,
      room,
    });

    setCurrentRoom(room);

    if (!rooms.includes(room)) {
      setRooms((prev) => [...prev, room]);
    }
  };

  // --------------------------
  // SEND MESSAGE
  // --------------------------
  const sendMessage = (text, { attachments } = {}) => {
    if (!socket || !currentRoom) return;
    socket.emit("send_message", {
      text,
      attachments,
    });
  };

  // --------------------------
  // TYPING
  // --------------------------
  const setTyping = (typing) => {
    if (!socket) return;
    socket.emit("typing", {
      username: usernameRef.current,
      typing,
    });
  };

  // --------------------------
  // OLDER MESSAGES
  // --------------------------
  const loadOlderMessages = () => {
    if (!socket || !currentRoom || messages.length === 0) return;
    const oldest = messages[0].id;
    socket.emit("load_older_messages", { room: currentRoom, before: oldest });
  };

  return {
    socket,
    connect,
    users,
    messages,
    typingUsers,
    sendMessage,
    setTyping,
    currentRoom,
    joinRoom,
    rooms,
    unreadCounts,
    loadOlderMessages,
  };
};
