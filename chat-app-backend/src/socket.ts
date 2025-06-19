import { Server } from "socket.io";
import prisma from "./prisma";

export function setupSocket(io: Server) {
  io.on("connection", async (socket) => {
    console.log("socket connected");

    if (socket.handshake.query.userId === undefined) {
      console.log("⚠️ Connection rejected: no userId");
      socket.disconnect();
      return;
    }

    const rawUserId = socket.handshake.query.userId as string;
    const userId =
      typeof rawUserId === "string" && /^[a-f\d]{24}$/i.test(rawUserId)
        ? rawUserId
        : null;

    if (!userId) {
      console.log("⚠️ Connection rejected: no userId");
      socket.disconnect();
      return;
    }

    console.log(`✅ User ${userId} connected`);

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    socket.on("sendMessage", async (data) => {
      const { input, to } = data;

      if (!input || !to) {
        console.log("⚠️ Invalid message data");
        return;
      }

      // ai chat logic
      if (to === "ai-chat") {

        const res = await fetch(
          "https://nfl-sportsradar-api-smt.onrender.com/nfl/query",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // "x-api-key": process.env.AI_API_KEY,     // uncomment if provider needs it
            body: JSON.stringify({ query: input }),
          }
        );

        const data = await res.json();
        const aiMessage = await prisma.aiChat.create({
          data: {
            userId: userId,
            query: input,
            response: data.answer,
          },
        });
        io.emit("receiveMessage", aiMessage);
        return;
      }

      // find room and check or create roomId for 2 users
      let room = null;
      room = await prisma.room.findFirst({
        where: {
          OR: [
            {
              receiverId: userId,
              senderId: to,
            },
            {
              receiverId: to,
              senderId: userId,
            },
          ],
        },
      });
      if (!room) {
        console.log("created room");
        room = await prisma.room.create({
          data: {
            receiverId: to,
            senderId: userId,
            updatedAt: new Date(),
          },
        });
      }

      // Save message to DB
      const newMessage = await prisma.message.create({
        data: {
          senderId: userId,
          receiverId: to,
          message: input,
          roomId: room?.id || "",
        },
      });

      // Send to receiver (if connected)
      io.emit("receiveMessage", newMessage); // You can customize to specific socket
    });

    socket.on("joinRoom", async (data) => {
      console.log(`User joined room with `, data);
      if (data.userId === undefined || data.senderId === undefined) {
        socket.disconnect();
        return;
      }

      const rawUserId = data.userId as string;
      const userId =
        typeof rawUserId === "string" && /^[a-f\d]{24}$/i.test(rawUserId)
          ? rawUserId
          : null;

      if (!userId) {
        console.log("⚠️ Connection rejected: no userId");
        socket.disconnect();
        return;
      }

      if (data.senderId === "ai-chat") {
        // Handle AI chat room joining
        console.log("AI chat room joined");
        const aiMessages = await prisma.aiChat.findMany({
          where: {
            userId: userId,
          },
        });

        return socket.emit("joinRoom", aiMessages);
      }

      const rawSenderId = data.senderId as string;
      const senderId =
        typeof rawSenderId === "string" && /^[a-f\d]{24}$/i.test(rawSenderId)
          ? rawSenderId
          : null;

      if (!senderId) {
        console.log("⚠️ Connection rejected: no senderId");
        socket.disconnect();
        return;
      }

      let room = null;
      room = await prisma.room.findFirst({
        where: {
          OR: [
            {
              receiverId: userId,
              senderId: senderId,
            },
            {
              receiverId: senderId,
              senderId: userId,
            },
          ],
        },
        select: {
          id: true,
        },
      });

      if (!room) {
        room = await prisma.room.create({
          data: {
            receiverId: senderId,
            senderId: userId,
            updatedAt: new Date(),
          },
        });
      }

      const messages = await prisma.message.findMany({
        where: {
          roomId: room.id,
        },
      });

      socket.emit("joinRoom", messages);
    });

    // AI chat
    // socket.on("aiJoinRoom", async (data) => {
    //   console.log(`AI joined room with `, data);
    // });

    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });
}
