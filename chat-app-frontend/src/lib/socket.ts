import { io, type Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = (userId: string) => {
   console.log("userId", userId);
   if (socket) return socket;
  socket = io("http://localhost:5000", {
    query: { userId },
   //  transports: ["websocket"],
  });

  return socket;
};

export const getSocket = () => socket;
