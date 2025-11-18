// typingController.js
// Manages typing status for users in the chat

const typingUsers = {};

/**
 * Set or remove a user from the typing list.
 * @param {string} socketId - The socket ID of the user
 * @param {string} username - The username of the user
 * @param {boolean} isTyping - Whether the user is typing or not
 * @returns {Array} - List of usernames currently typing
 */
export const setTyping = (socketId, username, isTyping) => {
  if (isTyping) {
    typingUsers[socketId] = username;
  } else {
    delete typingUsers[socketId];
  }
  return Object.values(typingUsers);
};

/**
 * Get the list of users currently typing
 * @returns {Array} - List of usernames typing
 */
export const getTypingUsers = () => Object.values(typingUsers);
