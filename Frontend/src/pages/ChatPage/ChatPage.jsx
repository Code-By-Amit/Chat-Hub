import React, { useState } from 'react'
import { ChatArea } from './ChatArea';
import { FriendListPannel } from './FriendListPannel';


export const ChatPage = () => {
  const [currentChatUser, setCurrentChatUser] = useState(null)

  return (
    <div className='w-full h-screen flex bg-gray-200 dark:bg-gray-900'>
      <FriendListPannel setCurrentChatUser={setCurrentChatUser} />
      <ChatArea currentChatUser={currentChatUser} setCurrentChatUser={setCurrentChatUser} />
    </div >
  )
}




