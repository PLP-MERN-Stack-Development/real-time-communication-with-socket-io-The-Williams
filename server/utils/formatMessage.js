/**
 * Format message for both public and private chats
 * @param {string} sender - Username of the message sender
 * @param {string} senderId - Socket ID of the sender
 * @param {string} message - Message text
 * @param {boolean} isPrivate - Whether the message is private
 */

export const formatMessage = (sender, senderId, message, isPrivate = false) => {
  return {
    id: Date.now(),
    sender,
    senderId,
    message,
    timestamp: new Date().toISOString(),
    isPrivate,
  };
};
