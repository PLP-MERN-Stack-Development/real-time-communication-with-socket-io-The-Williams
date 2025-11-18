import User from "../models/User.js";

// Store users by socketId
const users = {};

/**
 * Add user to store
 * @param {string} socketId
 * @param {string} username
 * @param {string} room
 */
export const addUser = (socketId, username, room) => {
  users[socketId] = new User(socketId, username, room);
  return users[socketId];
};

/**
 * Remove user from store
 */
export const removeUser = (socketId) => {
  const user = users[socketId];
  delete users[socketId];
  return user;
};

/**
 * Get single user
 */
export const getUser = (socketId) => users[socketId];

/**
 * Get all users
 */
export const getAllUsers = () => Object.values(users);

/**
 * Get all users inside a specific room
 */
export const getAllUsersInRoom = (room) => {
  return Object.values(users).filter((u) => u.room === room);
};

/**
 * Export raw store (optional)
 */
export const usersStore = users;
