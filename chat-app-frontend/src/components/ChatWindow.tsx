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

type TAIMessage = {
  query?: string;
  response?: string;
  createdAt?: string;
  id?: string;
  userId?: string;
};

const ChatWindow = ({ receiverId }: { receiverId: string }) => {
  const [messages, setMessages] = useState<TMessage[] | TAIMessage[]>([]);
  const [input, setInput] = useState("");
  const { user } = useUser();

  console.log("ChatWindow messages: ", messages);

  useEffect(() => {
    const socket = connectSocket(user?.id || "");

    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("receiveMessage", (msg: TMessage) => {
      console.log("Received message: ", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (receiverId !== "ai-chat") return;
    const socket = getSocket();
    if (!socket) return;
    socket.emit("joinRoom", { userId: user?.id, senderId: receiverId });
    socket.on("joinRoom", (msgs) => {
      console.log("Joined room messages: ", msgs);
      setMessages(msgs);
    });
  }, [receiverId]);

  // ai chat
  useEffect(() => {
    if (receiverId === "ai-chat") {
      const socket = getSocket();
      if (!socket) return;
      socket.emit("aiJoinRoom", { userId: user?.id, senderId: receiverId });
      socket.on("aiJoinRoom", (msgs) => {
        setMessages(msgs);
      });
    }
  }, [receiverId]);

  const sendMessage = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit("sendMessage", { input, to: receiverId });
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded" style={{ width: "50%" }}>
      <div className="h-64 overflow-y-scroll border p-2 mb-2">
        <div
          style={{ fontWeight: "bold", color: "green", textAlign: "center" }}
        >
          Messages
        </div>
        {receiverId === "ai-chat" ? (
          <div>
            {messages.map((msg, i) => (
              <div key={i} className="">
                {"query" in msg && (
                  <>
                    <div style={{ margin: "10px 4px", textAlign: "left" }}>
                      <strong>AI:</strong> {(msg as TAIMessage).response}
                    </div>
                    <div style={{ margin: "10px 4px", textAlign: "right" }}>
                      <strong>You:</strong> {(msg as TAIMessage).query}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className="mb-1">
              {"message" in msg && msg.message}
            </div>
          ))
        )}
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
