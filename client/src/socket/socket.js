// src/socket.js
import { io } from "socket.io-client";
import { useEffect, useState, useRef, useCallback } from "react";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]); // current room messages
  const [users, setUsers] = useState([]); // online users array {id, username}
  const [typingUsers, setTypingUsers] = useState([]); // usernames typing in room
  const [currentRoom, setCurrentRoom] = useState("global");
  const [rooms, setRooms] = useState(["global"]);
  const [unreadCounts, setUnreadCounts] = useState({}); // { roomId: count }
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/ding.mp3"); // place ding.mp3 in public/
  }, []);

  // helpers
  const playSound = useCallback(() => {
    try { audioRef.current?.play(); } catch (e) {}
  }, []);

  const requestNotifPermission = useCallback(() => {
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }, []);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    const onReceiveMessage = (msg) => {
      // if message's room matches currentRoom (including DMs), append else increase unread
      const roomKey = msg.roomId || "global";
      setMessages((prev) => {
        // if it's for current room => append and play sound/notify
        if (roomKey === currentRoom || (roomKey.startsWith("dm:") && currentRoom === roomKey)) {
          const next = [...prev, msg];
          playSound();
          // browser notification
          if ("Notification" in window && Notification.permission === "granted" && msg.sender !== (localStorage.getItem("username") || null)) {
            new Notification(`${msg.sender}`, { body: msg.message, icon: "/favicon.ico" });
          }
          return next;
        } else {
          // bump unread
          setUnreadCounts((u) => ({ ...u, [roomKey]: (u[roomKey] || 0) + 1 }));
          return prev;
        }
      });
    };

    const onUserList = (list) => setUsers(list);

    const onUserJoined = (data) => {
      setMessages((prev) => [...prev, { id: `sys-${Date.now()}`, system: true, message: `${data.username} joined`, timestamp: new Date().toISOString() }]);
    };

    const onUserLeft = (data) => {
      setMessages((prev) => [...prev, { id: `sys-${Date.now()}`, system: true, message: `${data.username} left`, timestamp: new Date().toISOString() }]);
    };

    const onTypingUsers = ({ username, isTyping, roomId }) => {
      if (roomId !== currentRoom) return;
      setTypingUsers((prev) => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter((u) => u !== username);
        }
      });
    };

    const onMessageUpdated = (msg) => {
      setMessages((prev) => prev.map((m) => (m.id === msg.id ? msg : m)));
    };

    const onRoomMessages = ({ roomId, messages: hist }) => {
      if (roomId === currentRoom) setMessages(hist);
    };

    const onRoomList = (list) => setRooms(list);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReceiveMessage);
    socket.on("user_list", onUserList);
    socket.on("user_joined", onUserJoined);
    socket.on("user_left", onUserLeft);
    socket.on("typing_users", onTypingUsers);
    socket.on("message_updated", onMessageUpdated);
    socket.on("room_messages", onRoomMessages);
    socket.on("room_list", (list) => setRooms(list));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceiveMessage);
      socket.off("user_list", onUserList);
      socket.off("user_joined", onUserJoined);
      socket.off("user_left", onUserLeft);
      socket.off("typing_users", onTypingUsers);
      socket.off("message_updated", onMessageUpdated);
      socket.off("room_messages", onRoomMessages);
      socket.off("room_list", (list) => setRooms(list));
    };
  }, [currentRoom, playSound]);

  // connect
  const connect = (username) => {
    if (!username) return;
    localStorage.setItem("username", username);
    socket.auth = { username };
    socket.connect();
    socket.emit("user_join", username, (res) => {
      // join default
      joinRoom("global");
      requestNotifPermission();
    });
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const joinRoom = (roomId) => {
    socket.emit("join_room", roomId, (res) => {
      if (res?.ok) {
        setCurrentRoom(roomId);
        setUnreadCounts((u) => ({ ...u, [roomId]: 0 }));
      }
    });
  };

  // send message (room or private)
  const sendMessage = (text, { attachments = [], toSocketId = null } = {}) => {
    const sender = localStorage.getItem("username") || "Anonymous";
    const payload = {
      message: text,
      sender,
      roomId: currentRoom,
      toSocketId,
      attachments,
    };
    socket.emit("send_message", payload, (ack) => {
      if (ack?.ok) {
        // optimistic UI: message will arrive via receive_message;
      }
    });
  };

  const setTyping = (isTyping) => {
    socket.emit("typing", { isTyping, roomId: currentRoom });
  };

  const markDelivered = (messageId) => {
    socket.emit("message_delivered", { messageId, roomId: currentRoom });
  };

  const markRead = (messageId) => {
    socket.emit("message_read", { messageId, roomId: currentRoom });
  };

  const addReaction = (messageId, reaction) => {
    socket.emit("add_reaction", { messageId, roomId: currentRoom, reaction });
  };

  const searchMessages = (q) => {
    return new Promise((resolve) => {
      socket.emit("search_messages", { roomId: currentRoom, q }, ({ results }) => resolve(results || []));
    });
  };

  const loadOlderMessages = async () => {
    // demo: server stores limited history and emits them on join. For a real app implement REST pagination.
    // Here we simply request room messages again
    socket.emit("request_room_history", { roomId: currentRoom }, (res) => {
      if (res?.messages) {
        setMessages((prev) => [...res.messages, ...prev]);
      }
    });
  };

  return {
    socket,
    isConnected,
    messages,
    users,
    typingUsers,
    currentRoom,
    rooms,
    unreadCounts,
    connect,
    disconnect,
    joinRoom,
    sendMessage,
    setTyping,
    markDelivered,
    markRead,
    addReaction,
    searchMessages,
    loadOlderMessages,
  };
};
