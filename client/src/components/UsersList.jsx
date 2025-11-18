import React from 'react';

export default function UsersList({ users = [], onSelectUser }) {
  return (
    <div className="users-list card">
      <h4>Users</h4>
      <ul>
        {users.map(u => (
          <li key={u.id}>
            <button onClick={() => onSelectUser(u)}>{u.username}</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
