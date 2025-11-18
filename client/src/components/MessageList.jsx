import React from "react";

export default function MessageList({ messages, typingUsers, user }) {
  return (
    <div className="message-list">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.username === user?.username ? "me" : ""}`}
        >
          <strong>{msg.username}:</strong> {msg.text}
          <div className="timestamp">{msg.timestamp}</div>
        </div>
      ))}

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(", ")} typing...
        </div>
      )}
    </div>
  );
}
