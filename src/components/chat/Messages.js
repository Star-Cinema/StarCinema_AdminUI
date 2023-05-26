import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import Message from "./Message";

const Messages = () => {
  const { messages } = useContext(ChatContext);

  return (
    <div className="messages">
      {messages.map((m, index) => (
        <div key={index}>
          <Message message={m} />
        </div>    
      ))}
    </div>
  );
};

export default Messages;
