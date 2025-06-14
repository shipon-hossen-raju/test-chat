import { useEffect, useState } from "react";
import socket from "../services/socket";

const ChatWindow = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.on("receiveMessage", (msg: string) => {
      console.log("Message received: ", msg);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    // get all messages from backend on page load
    fetch("http://localhost:3000/messages")
      .then((res) => res.json())
      .then((data) => setMessages(data));
  }, []);
  

  console.log("messages: ", messages);

  const sendMessage = () => {
    if (!input.trim()) return;
    console.log("input Message sent: ", input);
    socket.emit("sendMessage", input);
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white shadow-md rounded">
      <div className="h-64 overflow-y-scroll border p-2 mb-2">
        {messages.map((msg, i) => (
          <div key={i} className="mb-1">
            {msg}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
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
    </div>
  );
};

export default ChatWindow;
