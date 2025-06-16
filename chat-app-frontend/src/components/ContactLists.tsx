import React from "react";
import "./ContactList.css"; // Import the CSS file

interface User {
  id: string;
  name: string;
  avatarUrl?: string;
}

interface Props {
  contacts: User[];
  selectedId: string;
  onSelect: (userId: string) => void;
}

const ContactList: React.FC<Props> = ({ contacts, selectedId, onSelect }) => {
  return (
    <div className="contact-list">
      <h2 className="title">Contacts</h2>
      <ul>
        {contacts.map((user) => (
          <li
            key={user.id}
            onClick={() => onSelect(user.id)}
            className={`contact-item ${
              selectedId === user.id ? "active" : ""
            }`}
           >
              <span className="avatar">{ user.name.charAt(0) }</span>
            <span>{user.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContactList;
