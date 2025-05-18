import React, { useEffect, useState } from "react";
import "../chat/chat.css";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  
  // ✅ À adapter : tu peux stocker ça dans Redux ou localStorage dans la vraie app
  const token = localStorage.getItem("token"); 
  const receiverId = 25; // ✅ À remplacer dynamiquement selon l'utilisateur cible

    const [username, setUsername] = useState('');

    useEffect(() => {
      const storedUsername = localStorage.getItem('username')
    if (storedUsername) {
      setUsername(storedUsername)
    } 
    })


  function setNewMessage(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  function handleInputChange(e) {
    setInputText(e.target.value);
  }

  async function sendMessage(e) {
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

      // Met à jour l'état avec le message confirmé
      setMessages((prevMessages) =>
        prevMessages.map((m) => (m === pendingMsg ? sentMsg : m))
      );
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
      setMessages((prevMessages) =>
        prevMessages.map((m) =>
          m === pendingMsg ? { ...m, status: "failed" } : m
        )
      );
    }

    setInputText(""); // Vide le champ
  }

  return (
    <div className="container">
      <div className="card-title">My first chat</div>
      <hr />

      <form onSubmit={sendMessage}>
        <div className="card-footer">
          <p>Username : {username}</p>
          <p>Futur Username</p>
          <br />
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
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat;
