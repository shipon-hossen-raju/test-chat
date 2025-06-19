import axios from "axios";
import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import ChatWindow from "./ChatWindow";
import ContactList from "./ContactLists";

export default function ChatPage() {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [users, setUsers] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    const contactLists = async () => {
      const response = await axios("http://localhost:5000/contacts", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = response.data;
      const filteredData = data.filter((us: any) => us.id !== user?.id);
      setUsers(filteredData);
    };

    contactLists();
  }, [user, selectedUserId]);

  return (
    <div style={{ display: "flex", gap: "24px", padding: "24px" }}>
      <ContactList
        contacts={users}
        selectedId={selectedUserId}
        onSelect={setSelectedUserId}
      />
      <ChatWindow receiverId={selectedUserId} />
    </div>
  );
}
