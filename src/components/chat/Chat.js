import React, { useContext, useState } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../../context/ChatContext";
import avatarUserDefault from "../../assets/images/user.png"
import styled from "styled-components";


const Chat = () => {
  const { selectedUser } = useContext(ChatContext);

  const [hasError, setHasError] = useState(false);

  const imageStyle = {
    width: 40,
    height: 40,
    borderRadius: '50%',
    objectFit: 'cover',
  }

  const handleImageError = () => {
    setHasError(true);
  };

  return (
    <div className="chat">
      <div className="chatInfo" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        {selectedUser &&
          (<>
            {hasError ? (
              <img style={imageStyle} src={avatarUserDefault} alt="Default Image" />
            ) : (
              <img style={imageStyle} src={selectedUser.avatar} alt="Image" onError={handleImageError} />
            )
            }
            <h4 style={{ textAlign: 'center', color: 'white', marginLeft: 10 }}>{selectedUser.name}</h4>
          </>)
        }
      </div>
      <Messages />
      {/* <SendMessageStyle>
        <div className='typing'>
          <div className="input-message">
            <Input
              // value={inputMessage}
              // onChange={(e) => setInputMessage(e.target.value)}
              // onPressEnter={handleSendMessage}
              placeholder='Nhập tin nhắn...'
              bordered={false}
              autoComplete='off'
            />
          </div>
          <div className="button-send" 
          // onClick={handleSendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" xmlSpace="preserve"><path fill={true ? "#0066FF" : "#d7d7d7"} d="M22,11.7V12h-0.1c-0.1,1-17.7,9.5-18.8,9.1c-1.1-0.4,2.4-6.7,3-7.5C6.8,12.9,17.1,12,17.1,12H17c0,0,0-0.2,0-0.2c0,0,0,0,0,0c0-0.4-10.2-1-10.8-1.7c-0.6-0.7-4-7.1-3-7.5C4.3,2.1,22,10.5,22,11.7z" /></svg>
          </div>
        </div>
      </SendMessageStyle> */}
      <Input />
    </div>
  );
};

export default Chat;


const SendMessageStyle = styled.div`
    .typing {
        height: 50px;
        border-top: 1px solid;
        padding-right: 20px;
        background: rgb(255, 255, 255);
        border-top-color: rgb(234, 234, 234);
        width: 100%;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        border-radius: 20px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    .input-message {
        flex: 1 0 0;
        -webkit-box-flex: 1;
        -ms-flex: 1 0 0px;
    }

    .input-message input {
        font-size: 16px;
        line-height: 20px;
        height: 100%;
        padding: 0 20px;
        background: transparent;
        border: 0;
        outline: none;
        font-family: Source Sans Pro,sans-serif;
    }


    .button-send {
        width: 26px;
        height: 26px;
        -webkit-box-flex: 0;
        -ms-flex: 0 0 26px;
        flex: 0 0 26px;
        -webkit-backface-visibility: hidden;
        -webkit-transition: all .3s;
        transition: all .3s;
        cursor: pointer;
    }
`;