import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatarUserDefault from "../../assets/images/user.png"



const Chats = () => {

  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };


  const { users, selectedUser, setSelectedUser } = useContext(ChatContext);


  return (
    <div className="chats">
      {users && users.map((user) => (
        <div
          key={user.id}
          className={selectedUser ? (selectedUser.id == user.id ? "userChat userChat-selected" : "userChat") : "userChat"}
          onClick={() => setSelectedUser(user)}
          style={{ paddingLeft: 20 }}
        >
          <div>
            {hasError ? (
              <img src={avatarUserDefault} alt="Default Image" style={{ border: "1px solid #000" }} />
            ) : (
              <img src={user.avatar} alt="Image" onError={handleImageError} style={{ border: "1px solid #000" }} />
            )}
          </div>
          <div className="userChatInfo">
            <span style={{ color: "#2196F3" }}>{user.name}</span>
            {user.lastMessage?.senderId == 'admin' ? <p style={{ color: "#000" }}>You: {user.lastMessage?.content}</p> : <p>{user.lastMessage?.content}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
