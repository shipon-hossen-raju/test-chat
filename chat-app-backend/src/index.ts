import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { setupSocket } from "./socket";
import authRouter from "./modules/auth/auth.routes";
import prisma from "./prisma";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// app.use("/api/messages", messageRoutes);
app.use("/api/auth", authRouter);

app.get("/contacts", async (req, res) => {
  const findUsers = await prisma.user.findMany();
  res.json(findUsers);
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // adjust for Flutter client
  },
});

// Socket.IO logic
setupSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
