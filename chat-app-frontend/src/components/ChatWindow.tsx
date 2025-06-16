import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { connectSocket, getSocket } from "../lib/socket";

type TMessage = {
  createdAt?: string;
  id?: string;
  message?: string;
  receiverId?: string;
  roomId?: string;
  senderId?: string;
};

const ChatWindow = ({ receiverId }: { receiverId: string }) => {
  const [messages, setMessages] = useState<TMessage[]>([]);
  const [input, setInput] = useState("");
  const { user } = useUser();

  useEffect(() => {
    const socket = connectSocket(user?.id || "");

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("receiveMessage", (msg: TMessage) => {
      console.log("Message received: ", msg);

      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  console.log("messages: ", messages);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("sendMessage", { input, to: receiverId });
    // const newMessage: TMessage = {
    //   message: input,
    //   senderId: user?.id,
    //   receiverId,
    //   createdAt: new Date().toISOString(),
    // };
    // setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <div className="h-64 overflow-y-scroll border p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        {receiverId && (
          <div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border px-2 py-1 rounded"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
