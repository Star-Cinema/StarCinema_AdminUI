import React, { useContext, useState } from "react";
import { ChatContext } from "../../context/ChatContext";
import firebase, { firestore } from "../../firebase/config";
import { SendOutlined } from "@ant-design/icons";


const Input = () => {
  const [text, setText] = useState("");

  const { selectedUser } = useContext(ChatContext);

  const handleSend = async () => {
    if (!text) return;
    // Add message from user to admin AnhNT282
    const userAdminRef = firestore.collection('messages');

    const chatData = {
      senderId: 'admin',
      receiverId: selectedUser.id,
      content: text,
      createAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    // Make adding messages to Firestore AnhNT282
    userAdminRef.add(chatData)
      .then(() => {
        console.log('Success!');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setText('');
  };
  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
        />
        {/* <button onClick={handleSend}>
          Sen */}
        <SendOutlined className="icon-send" onClick={handleSend}
          style={{
            fontSize: '32px',
            marginLeft:"10px",
            marginRight:"20px",
            color:"#007aec"
          }}
        />
        {/* </button> */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlSpace="preserve"><path fill={true ? "#0066FF" : "#d7d7d7"} d="M22,11.7V12h-0.1c-0.1,1-17.7,9.5-18.8,9.1c-1.1-0.4,2.4-6.7,3-7.5C6.8,12.9,17.1,12,17.1,12H17c0,0,0-0.2,0-0.2c0,0,0,0,0,0c0-0.4-10.2-1-10.8-1.7c-0.6-0.7-4-7.1-3-7.5C4.3,2.1,22,10.5,22,11.7z" /></svg> */}
      </div>
    </div>
  );
};

export default Input;
