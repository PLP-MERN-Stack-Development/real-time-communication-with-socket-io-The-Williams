import dayjs from "dayjs";

export default function MessageBubble({ msg, me, onSeen, onReact }) {
  return (
    <div className={`flex ${me ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-md px-4 py-2 rounded-2xl ${me ? "bg-blue-600 text-white" : "bg-gray-100 text-black"}`}>
        {!me && <p className="text-xs font-semibold mb-1">{msg.sender}</p>}

        {msg.attachments && msg.attachments.map((a) => (
          <div key={a.url} className="mb-2">
            <img src={a.url} alt="attachment" style={{ maxWidth: 300 }} />
          </div>
        ))}

        <p>{msg.message}</p>

        <div className="flex items-center gap-2 mt-2 text-[10px] opacity-70">
          <span>{dayjs(msg.timestamp).format("HH:mm")}</span>
          <span>Delivered: { (msg.deliveredTo || []).length }</span>
          <span>Read: { (msg.readBy || []).length }</span>
        </div>

        <div className="mt-1">
          {msg.reactions && Object.entries(msg.reactions).map(([k, users]) => (
            <button key={k} onClick={() => onReact?.(k)} className="mr-2">{k} {users.length}</button>
          ))}
          <button onClick={() => onReact?.("👍")}>👍</button>
          <button onClick={() => onReact?.("❤️")}>❤️</button>
        </div>
      </div>
    </div>
  );
}
