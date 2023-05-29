import React from 'react'
import Sidebar from '../components/chat/Sidebar'
import Chat from '../components/chat/Chat'
import '../style.scss'
import { Card } from 'antd'

const ChatPage = () => {
  return (
    <Card style={{padding: "10px 50px"}}>
      <div className='home'>
        <div className="container-chat">
          <Sidebar />
          <Chat />
        </div>
      </div>
    </Card>
  )
}

export default ChatPage