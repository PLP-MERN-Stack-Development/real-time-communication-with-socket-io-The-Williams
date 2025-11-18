import { useSocket } from "../socket/socket";
import { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatPage({ username }) {
  const {
    socket,
    connect,
    messages,
    users,
    sendMessage,
    typingUsers,
    setTyping,
    currentRoom,
    joinRoom,
    rooms,
    unreadCounts,
    loadOlderMessages,
  } = useSocket();

  useEffect(() => {
  const s = connect(username);
  // Automatically join global room
  setTimeout(() => {
    s.emit("user_joined", { username, room: "global" });
  }, 300);
}, []);
  return (
    <div className="h-screen flex">
      <Sidebar users={users} />
      <ChatWindow
        messages={messages}
        onSend={sendMessage}
        typingUsers={typingUsers}
        setTyping={setTyping}
        username={username}
      />
    </div>
  );
}
