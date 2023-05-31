import React, { createContext, useState, useEffect } from 'react';
import { firestore } from '../firebase/config';
import axios from 'axios';

export const ChatContext = createContext();

export default function ChatProvider({ children }) {

  const [usersFireBase, setUsersFireBase] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);

  const messageCollection = firestore.collection('messages');


  // Lấy danh sách người dùng đã nhắn tin tới admin
  useEffect(() => {
    messageCollection
      .orderBy('createAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const userList = [];
        querySnapshot.forEach((doc) => {
          const messageData = doc.data();
          const senderId = messageData.senderId == 'admin' ? messageData.receiverId : messageData.senderId;

          // Kiểm tra xem người dùng đã tồn tại trong danh sách chưa
          const existingUser = userList.find((user) => user.id === senderId);

          // Nếu người dùng không tồn tại, thêm vào danh sách
          if (!existingUser) {
            userList.push({
              id: senderId,
              lastMessage: {
                senderId: messageData.senderId,
                content: messageData.content
              },
            });
          }
        });
        setUsersFireBase(userList);
      });
  }, []);

  useEffect(() => {

    axios.get('https://localhost:7113/api/users?page=1&pageSize=10000&sortBy=id',
      {
        headers: {
          "Authorization": `Bearer ${sessionStorage.getItem('token')}`
        }
      }
    ).then((response) => {
      var usesDatabase = response?.data.data
      const userList = [];
      console.log('ufb', usersFireBase);
      console.log('udb', usesDatabase);
      usersFireBase.forEach(userFB => {
        var user = usesDatabase.find(u => u.id == userFB.id);
        user && userList.push({ ...user, ...userFB });
      })
      setUsers(userList);
    }).catch((e) => {
      console.log(e.messages);
    })

  }, [usersFireBase])

  // Lấy tin nhắn giữa admin và người dùng đã chọn
  useEffect(() => {
    if (selectedUser) {
      messageCollection
        .where('senderId', 'in', ['admin', selectedUser.id])
        .where('receiverId', 'in', ['admin', selectedUser.id])
        .orderBy('createAt')
        .onSnapshot((querySnapshot) => {
          const messageList = [];
          querySnapshot.forEach((doc) => {
            const messageData = doc.data();
            messageList.push(messageData);
          });
          setMessages(messageList);
        });
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  return (
    <ChatContext.Provider value={{ users, setUsers, selectedUser, setSelectedUser, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
