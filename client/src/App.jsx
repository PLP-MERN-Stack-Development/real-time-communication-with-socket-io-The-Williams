import React, { useState, useEffect } from "react";
import { useSocket } from "./socket/socket";
import Sidebar from "./components/Sidebar";
import RoomList from "./RoomList";
import ChatWindow from "./components/ChatWindow";
import Login from "./pages/Login";

localStorage.removeItem("username");

export default function App() {
  const socketHook = useSocket();
  const {
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
  } = socketHook;

  const [usernameInput, setUsernameInput] = useState("");
  const [username, setUsername] = useState(localStorage.getItem("username") || "");

  useEffect(() => {
    if (username) connect(username);
  }, [username]);

  if (!username) {
    return (
      <Login
        onLogin={(name, room) => {
          setUsername(name);
          localStorage.setItem("username", name);

          // ensure socket is initialized before joining
          setTimeout(() => {
            joinRoom(room);
          }, 200);
        }}
      />
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar users={users} unreadCounts={unreadCounts} />
      <div className="flex flex-col flex-1">
        <RoomList rooms={rooms} currentRoom={currentRoom} onJoin={(r) => joinRoom(r)} />
        <ChatWindow
          socket={socket}
          messages={messages}
          onSend={(text, opts) => sendMessage(text, opts)}
          typingUsers={typingUsers}
          setTyping={setTyping}
          username={username}
          onLoadMore={() => socketHook.loadOlderMessages()}
          onMarkRead={(id) => socketHook.markRead(id)}
          onReact={(id, r) => socketHook.addReaction(id, r)}
        />
      </div>
    </div>
  );
}
