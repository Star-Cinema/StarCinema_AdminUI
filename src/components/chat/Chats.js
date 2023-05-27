import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import avatarUserDefault from "../../assets/images/user.png"



const Chats = () => {

  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };


  const { users, setSelectedUser } = useContext(ChatContext);


  return (
    <div className="chats">
      {users && users.map((user) => (
        <div
          className="userChat"
          key={user.id}
          onClick={() => setSelectedUser(user)}
          style={{marginLeft: 10}}
        >
          <div>
            {hasError ? (
              <img src={avatarUserDefault} alt="Default Image" />
            ) : (
              <img src={user.avatar} alt="Image" onError={handleImageError} />
            )}
          </div>
          <div className="userChatInfo">
            <span>{user.name}</span>
            {user.lastMessage?.senderId == 'admin' ? <p>You: {user.lastMessage?.content}</p> : <p>{user.lastMessage?.content}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Chats;
