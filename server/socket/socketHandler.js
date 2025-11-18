import {
  addUser,
  removeUser,
  getUser,
  getAllUsersInRoom
} from "../controllers/userController.js";

import {
  saveMessage,
  getRoomMessages,
  addReaction,
  markMessageRead,
  getOlderMessages
} from "../controllers/chatController.js";

import { setTyping } from "../controllers/typingController.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // --- USER JOINS A ROOM ---
    socket.on("user_joined", ({ username, room }) => {
      addUser(socket.id, username, room);
      socket.join(room);

      // Send online users
      io.to(room).emit("user_list", getAllUsersInRoom(room));

      // Send chat history
      socket.emit("chat_history", getRoomMessages(room));

      // Notify the room
      socket.to(room).emit("user_joined_notification", {
        username,
        timestamp: new Date().toLocaleTimeString(),
      });

      console.log(`${username} joined room: ${room}`);
    });

    // --- SEND MESSAGE (with attachments) ---
    socket.on("send_message", ({ text, attachments }) => {
      const user = getUser(socket.id);
      if (!user) return;

      const msg = {
        id: Date.now(),
        userId: socket.id,
        username: user.username,
        room: user.room,
        text,
        attachments: attachments || [],
        timestamp: new Date().toLocaleTimeString(),
        reactions: {},
        readBy: [],
      };

      saveMessage(msg);
      io.to(user.room).emit("receive_message", msg);
    });

    // --- TYPING INDICATOR (FIXED ✓) ---
    socket.on("typing", ({ username, typing }) => {
      const user = getUser(socket.id);
      if (!user) return;

      const typingUsers = setTyping(socket.id, username, typing, user.room);
      io.to(user.room).emit("typing_users", typingUsers);
    });

    // --- MESSAGE REACTION ---
    socket.on("react_message", ({ messageId, reaction }) => {
      const user = getUser(socket.id);
      if (!user) return;

      const updated = addReaction(messageId, user.username, reaction, user.room);
      if (updated) {
        io.to(user.room).emit("message_reacted", updated);
      }
    });

    // --- MARK MESSAGE READ ---
    socket.on("mark_read", ({ messageId }) => {
      const user = getUser(socket.id);
      if (!user) return;

      const updated = markMessageRead(messageId, user.username, user.room);
      if (updated) {
        io.to(user.room).emit("message_read", updated);
      }
    });

    // --- LOAD OLDER MESSAGES ---
    socket.on("load_older_messages", ({ room, before }) => {
      const older = getOlderMessages(room, before);
      socket.emit("older_messages", older);
    });

    // --- PRIVATE MESSAGE ---
    socket.on("private_message", ({ to, text }) => {
      const user = getUser(socket.id);
      if (!user) return;

      const msg = {
        id: Date.now(),
        userId: socket.id,
        username: user.username,
        text,
        private: true,
        timestamp: new Date().toLocaleTimeString(),
      };

      socket.to(to).emit("private_message", msg);
      socket.emit("private_message", msg);
    });

    // --- USER DISCONNECTS ---
    socket.on("disconnect", () => {
      const user = removeUser(socket.id);
      if (user) {
        io.to(user.room).emit("user_left", user);
        io.to(user.room).emit("user_list", getAllUsersInRoom(user.room));
        io.to(user.room).emit("typing_users", []);
      }

      console.log("User disconnected:", socket.id);
    });
  });
};
