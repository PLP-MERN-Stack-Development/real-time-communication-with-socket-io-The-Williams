import React, { useState } from "react";

export default function Login({ onLogin }) {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("general");

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 px-4">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md">
        
        <h2 className="text-2xl font-semibold text-center text-white mb-6">
          Welcome to Real-Time Chat
        </h2>

        <div className="flex flex-col space-y-4">

          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Room (e.g., general)"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />

          <button
            disabled={!name.trim()}
            onClick={() => onLogin(name.trim(), room)}
            className={`w-full py-2 rounded-lg text-white font-medium transition ${
              name.trim()
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Join Chat
          </button>

        </div>

        <p className="text-gray-400 text-xs text-center mt-4">
          Enter a username and room to get started.
        </p>
      </div>
    </div>
  );
}
