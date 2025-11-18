// controllers/chatController.js

const messages = {};  
// Structure: { roomName: [ { id, userId, username, text, attachments, timestamp, reactions, readBy } ] }

// --- SAVE MESSAGE ---
export const saveMessage = (msg) => {
  const { room } = msg;
  if (!messages[room]) messages[room] = [];

  messages[room].push({
    ...msg,
    reactions: msg.reactions || {},
    readBy: msg.readBy || [],
  });

  // Limit to last 100 messages per room
  if (messages[room].length > 100) messages[room].shift();

  return msg;
};

// --- GET ALL MESSAGES IN A ROOM ---
export const getRoomMessages = (room) => {
  return messages[room] ? [...messages[room]] : [];
};

// --- ADD REACTION TO MESSAGE ---
export const addReaction = (messageId, username, reaction, room) => {
  if (!messages[room]) return null;

  const msg = messages[room].find(m => m.id === messageId);
  if (!msg) return null;

  if (!msg.reactions[reaction]) msg.reactions[reaction] = [];
  if (!msg.reactions[reaction].includes(username)) msg.reactions[reaction].push(username);

  return msg;
};

// --- MARK MESSAGE AS READ ---
export const markMessageRead = (messageId, username, room) => {
  if (!messages[room]) return null;

  const msg = messages[room].find(m => m.id === messageId);
  if (!msg) return null;

  if (!msg.readBy.includes(username)) msg.readBy.push(username);
  return msg;
};

// --- LOAD OLDER MESSAGES ---
export const getOlderMessages = (room, beforeId, limit = 20) => {
  if (!messages[room]) return [];

  const index = messages[room].findIndex(m => m.id === beforeId);
  if (index === -1) return [];

  const start = Math.max(0, index - limit);
  return messages[room].slice(start, index);
};

// --- OPTIONAL: DELETE MESSAGE ---
export const deleteMessage = (room, messageId) => {
  if (!messages[room]) return false;
  const index = messages[room].findIndex(m => m.id === messageId);
  if (index === -1) return false;

  messages[room].splice(index, 1);
  return true;
};

// --- OPTIONAL: CLEAR ROOM MESSAGES ---
export const clearRoomMessages = (room) => {
  if (messages[room]) {
    messages[room] = [];
    return true;
  }
  return false;
};