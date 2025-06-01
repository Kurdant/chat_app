import React, { useEffect, useState } from "react";
import axios from "axios";
import "../chat/chat.css";

function Amis() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [friendRequest, setFriendRequest] = useState("");
  const [inputFriend, setInputFriend] = useState("");
  const [username, setUsername] = useState("");
  const [friendsRequests, setFriendsRequests] = useState([]);
  const [friends, setFriends] = useState([]);


  const token = localStorage.getItem("token");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []); 

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleFriendChange = (e) => {
    setInputFriend(e.target.value);
  };

// ajouter un ami
  const addFriend = (e) => {
    e.preventDefault();
    axios.post(
      "http://localhost:3000/friendrequest",
      { username: inputFriend },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .then((res) => {
      setFriendRequest(res.data.message || "Demande envoyée");
      alert("Demande bien effectuée");
    })
    .catch((error) => {
      if (error.response?.status === 404) {
        alert("Mauvais Username");
      } else if (error.response?.status === 400) {
        alert("Demande d'amis déjà effectuée");
      } else {
        alert("Erreur serveur");
        console.error(error);
      }
    });
  }

// Voire les demandes d'ami
useEffect(() => {
  const fetchFriendRequests = async () => {
    try {
      const res = await axios.get("http://localhost:3000/friendrequest", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriendsRequests(res.data);
    } catch (error) {
      console.error("Erreur de chargement des demandes d'amis :", error);
    }
  };

  // voir les demandes d'ami
  const fetchFriends = async () => {
    try {
      const res = await axios.get("http://localhost:3000/friendrequest/friends", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFriends(res.data);
    } catch (error) {
      console.error("Erreur de chargement des amis :", error);
    }
  };

  fetchFriendRequests();
  fetchFriends();
}, [token]);

// Accepter/Refuser demande d'ami
const respondToRequest = async (requestId, action) => {
  try {
    const res = await axios.post(
      "http://localhost:3000/friendrequest/respond",
      {
        requestId,
        action, // "accept" ou "decline"
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert(res.data.message);

    
    setFriendsRequests((prev) =>
      prev.filter((req) => req.id !== requestId)
    );
  } catch (error) {
    console.error("Erreur lors de la réponse à la demande :", error);
    alert("Erreur lors de la réponse à la demande.");
  }
};

  const setNewMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

 

  return (
    <div className="ChatFriendRequest">
    <div className="ChatSide">
      <div className="title">mes amis</div>
      <hr />

      <br />
      <div className="title">Friend request</div>
      <form onSubmit={addFriend}>
        <p>Add a friend by username</p>
        <input
            id="friend"
            type="text"
            placeholder="add a friend"
            className=""
            value={inputFriend}
            onChange={(e) => setInputFriend(e.target.value)}
          />
        <br />
        <button type="submit" className="btn btn-primary form-control">
          Send Friend Request
        </button>
        {friendRequest && <p>{friendRequest}</p>}
      </form>

    </div>
    <div className="FriendRequestSide">
    <h2>Vos demandes d'ami</h2>
    <ul>
      {friendsRequests.length > 0 ? (
        friendsRequests.map((request) => (
          <li key={request.id} style={{ marginBottom: "1rem" }}>
            <strong>{request.fromUsername}</strong>
            <br />
            <button
              className="btn btn-success"
              onClick={() => respondToRequest(request.id, "accept")}
              style={{ marginRight: "0.5rem" }}
            >
              Accepter
            </button>
            <button
              className="btn btn-danger"
              onClick={() => respondToRequest(request.id, "decline")}
            >
              Refuser
            </button>
          </li>
        ))
      ) : (
        <li>Aucune demande pour le moment.</li>
      )}
    </ul>
  </div>

  <div className="FriendsSide">  
  <h2>Vos amis</h2>
  <ul>
    {friends.length > 0 ? (
      friends.map((friend) => (
        <li key={friend.id}>
          <button>{friend.username}</button>
        </li>
      ))
    ) : (
      <li>Vous n'avez pas encore d'amis.</li>
    )}
  </ul>
</div>


  </div>
  );
}

export default Amis;
