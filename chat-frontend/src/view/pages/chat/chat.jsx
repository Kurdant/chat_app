import React, { useEffect, useState } from "react";
import axios from "axios";
import "../chat/chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [friendRequest, setFriendRequest] = useState("");
  const [inputFriend, setInputFriend] = useState("");
  const [username, setUsername] = useState("");
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [friends, setFriends] = useState([]);


  const token = localStorage.getItem("token");
  const receiverId = 25; // À remplacer dynamiquement

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); // <- Ajout du tableau de dépendances

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const setNewMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const pendingMsg = { text: inputText, status: "pending" };
    setNewMessage(pendingMsg);

    try {
      const response = await fetch("http://localhost:3000/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiver_id: receiverId,
          content: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de l'envoi");
      }

      const data = await response.json();
      const sentMsg = {
        text: inputText,
        status: "sent",
        id: data.id,
      };

      setMessages((prev) =>
        prev.map((m) => (m === pendingMsg ? sentMsg : m))
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setMessages((prev) =>
        prev.map((m) =>
          m === pendingMsg ? { ...m, status: "failed" } : m
        )
      );
    }

    setInputText("");
  };

  return (
   
    <div>
      <form onSubmit={sendMessage}>
        <div className="card-footer">
          <p>Username : {username}</p>
          <div className="messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={
                  msg.status === "pending"
                    ? "pending"
                    : msg.status === "sent"
                    ? "sent"
                    : "failed"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <input
            id="text"
            type="text"
            placeholder="Your message"
            className="form-control"
            value={inputText}
            onChange={handleInputChange}
          />
          <br />
          <button type="submit" className="btn btn-primary form-control">
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
