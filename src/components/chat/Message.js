import React, { useState, useEffect, useRef, useContext } from "react";
import avatarUserDefault from "../../assets/images/user.png"
import avatarAdmin from "../../assets/images/admin.png"
import { formatRelative } from 'date-fns/esm';
import { ChatContext } from "../../context/ChatContext";

// format date relative AnhNT282
function formatDate(seconds) {
  let formattedDate = '';

  if (seconds) {
    formattedDate = formatRelative(new Date(seconds * 1000), new Date());
    // Capitalize first letter AnhNT282
    formattedDate =
      formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  }
  return formattedDate;
}


const Message = ({ message }) => {

  const [hasError, setHasError] = useState(false);

  const { selectedUser } = useContext(ChatContext)

  const handleImageError = () => {
    setHasError(true);
  };


  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderId === 'admin' && "owner"}`}
    >
      <div className="messageInfo">
        {hasError ? (
          <img src={avatarUserDefault} alt="Default Image" />
        ) : (
          <img
            src={
              message.senderId === 'admin'
                ? avatarAdmin
                : selectedUser.avatar
            }
            alt="" onError={handleImageError}
          />
        )}

      </div>
      <div className="messageContent">
        <span style={{color: '#673AB7', fontSize: 13}}>{formatDate(message.createAt?.seconds)}</span>
        <p>{message.content}</p>
        {/* {message.img && <img src={message.img} alt="" />} */}
      </div>
    </div>
  );
};

export default Message;
