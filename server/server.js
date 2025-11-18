import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";
import { PORT, CLIENT_URL } from "./config/env.js";
import { socketHandler } from "./socket/socketHandler.js";

import { getRoomMessages } from "./controllers/chatController.js";
import { getAllUsers } from "./controllers/userController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Get messages for a specific room
app.get("/api/messages/:room", (req, res) => {
  const { room } = req.params;
  res.json(getRoomMessages(room));
});

// Get all online users
app.get("/api/users", (req, res) => res.json(getAllUsers()));

socketHandler(io);

app.get("/", (req, res) => res.send("Socket.io Chat Server running"));

httpServer.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
