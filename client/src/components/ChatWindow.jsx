import { useState, useRef, useEffect } from "react";
import dayjs from "dayjs";
import MessageBubble from "./MessageBubble";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

export default function ChatWindow({
  messages = [],
  onSend,
  typingUsers = [],
  setTyping,
  username,
  onLoadMore,
  onMarkRead,
  onReact,
  socket,
}) {
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef();
  const typingTimeoutRef = useRef(null);

   useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, []);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  function handleTypingChange(val) {
  setText(val);

  const isTyping = val.length > 0;
  setTyping(isTyping);

  if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(() => {
    setTyping(false);
  }, 1500);
}

  async function handleUpload() {
    if (!file) return [];
    const form = new FormData();
    form.append("file", file);
    const urlBase = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
    const res = await fetch(urlBase + "/api/upload", { method: "POST", body: form });
    const data = await res.json();

    if (data.success) return [{ url: urlBase + data.url }];
    return [];
  }

  const send = async () => {
    if (!text.trim() && !file) return;

    const attachments = await handleUpload();
    onSend(text.trim(), { attachments });
    
    setText("");
    setFile(null);
    setTyping(false);

    socket.emit("typing", { username, typing: false });
  };

  return (
    <div className="flex-1 flex flex-col bg-chatBg">
      <div className="p-2 border-b">
        <button onClick={onLoadMore}>Load older messages</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id}>
            <MessageBubble
              msg={msg}
              me={msg.username === username}
              onSeen={() => onMarkRead?.(msg.id)}
              onReact={(r) => onReact?.(msg.id, r)}
            />
          </div>
        ))}

        {typingUsers.length > 0 && (
          <div className="text-sm italic text-gray-500">
            {typingUsers.join(", ")} typing...
          </div>
        )}

        <div ref={bottomRef}></div>
      </div>

      <div className="p-4 bg-white border-t flex gap-2 items-center">
        <input
          value={text}
          onChange={(e) => handleTypingChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="flex-1 border rounded p-2"
          placeholder="Type a message..."
        />
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={send} className="bg-blue-600 text-white px-4 py-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
}
