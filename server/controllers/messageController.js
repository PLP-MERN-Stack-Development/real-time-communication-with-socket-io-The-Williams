import Message from "../models/Message.js";
import { formatMessage } from "../utils/formatMessage.js";

let messages = []; // In-memory store, replace with DB later

export const handleNewMessage = (user, text) => {
  const message = new Message(user, text);
  messages.push(message);
  return message;
};

export const getChatHistory = () => messages;
