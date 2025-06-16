import { Server } from "socket.io";
import prisma from "./prisma";

export function setupSocket(io: Server) {

  io.on("connection",  async (socket) => {
    console.log("socket connected", socket.handshake.query);
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

    console.log("user ", user);

    socket.on("sendMessage", async (data) => {
      const { input, to } = data;

      console.log("Message received: data ", data);
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
            }
          ]
        }
      });
      if (!room) {
        console.log("created room")
        room = await prisma.room.create({
          data: {
            receiverId: to,
            senderId: userId,
            updatedAt: new Date(),
          }
        })
      }

      console.log("room ", room);
      console.log("text ", input);

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

    socket.on("disconnect", () => {
      console.log(`❌ User ${userId} disconnected`);
    });
  });
}
