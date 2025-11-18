export default function Sidebar({ users = [], unreadCounts = {}, onStartDM }) {
  return (
    <div className="w-64 bg-white shadow-lg p-4 border-r">
      <h2 className="text-xl font-bold mb-4">Users Online</h2>
      <ul className="space-y-2">
        {users.map((u) => (
          <li key={u.id} className="p-2 bg-gray-100 rounded flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <span>{u.username}</span>
            </div>
            <div>
              <span className="text-sm">{unreadCounts[u.id] || 0}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
