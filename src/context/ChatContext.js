import React, { createContext, useState, useEffect } from 'react';
import { firestore } from '../firebase/config';

export const ChatContext = createContext();

export default function ChatProvider({ children }) {

    const [userList, setUserList] = useState([]);
    const [listMessage, setListMessage] = useState([]);

    console.log('test');

    useEffect(() => {
        const unsubscribe = firestore
          .collection('chats')
          .onSnapshot((snapshot) => {
            const updatedUserList = snapshot.docs.map((doc) => {
              const chatData = doc.data();
              const messages = chatData.messages;
              const lastMessage = messages[messages.length - 1];
              return {
                username: doc.id,
                // lastMessage: lastMessage ? lastMessage.message : '',
                // timestamp: lastMessage ? lastMessage.timestamp : ''
              };
            });
            setUserList(updatedUserList);
          });
    
        return () => unsubscribe();
      }, []);

      useEffect(() => {
        const user1AdminRef = firestore.collection('chats');
      
        // Lắng nghe sự thay đổi trong danh sách tin nhắn
        const unsubscribe = user1AdminRef.onSnapshot((querySnapshot) => {
          const data = [];
          querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            console.log(messageData);
            data.push(messageData);
          });
          setListMessage(data);
        });
      
        // Hủy lắng nghe khi component unmount
        return () => unsubscribe();
      }, []);

    return (
        <ChatContext.Provider value={{ userList, listMessage }}>
            {children}
        </ChatContext.Provider>
    );
}
