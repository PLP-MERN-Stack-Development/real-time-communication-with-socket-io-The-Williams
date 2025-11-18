import { useState } from "react";

export default function RoomList({ rooms = [], currentRoom, onJoin }) {
  const [newRoom, setNewRoom] = useState("");
  return (
    <div className="p-2 border-b flex items-center gap-4">
      <div>
        {rooms.map((r) => (
          <button key={r} onClick={() => onJoin(r)} className={r === currentRoom ? "px-3 py-1 bg-blue-600 text-white rounded mr-2" : "px-3 py-1 border rounded mr-2"}>
            {r}
          </button>
        ))}
      </div>

      <div>
        <input value={newRoom} onChange={(e) => setNewRoom(e.target.value)} placeholder="New room id" className="border rounded p-1 mr-2" />
        <button onClick={() => { if (newRoom.trim()) { onJoin(newRoom.trim()); setNewRoom(""); } }} className="px-3 py-1 bg-green-600 text-white rounded">Create/Join</button>
      </div>
    </div>
  );
}
