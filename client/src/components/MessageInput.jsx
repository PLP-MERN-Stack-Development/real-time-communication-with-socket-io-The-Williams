import React from "react";

export default function MessageInput({ text, setText, sendMessage, socket, username }) {
  const handleTyping = (e) => {
    setText(e.target.value);

    socket.emit("typing", {
      username,
      typing: e.target.value.length > 0,
    });
  };

  return (
    <div className="message-input">
      <input
        placeholder="Type a message..."
        value={text}
        onChange={handleTyping}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

