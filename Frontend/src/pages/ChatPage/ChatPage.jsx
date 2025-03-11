import React, { useEffect, useRef, useState } from 'react'
import { ChatArea } from './ChatArea';
import { FriendListPannel } from './FriendListPannel';


export const ChatPage = () => {
  const [currentChatUser, setCurrentChatUser] = useState(null)

  return (
    <div className='w-full h-dvh flex bg-gray-100 dark:bg-gray-900'>
      <FriendListPannel setCurrentChatUser={setCurrentChatUser} />
      <ChatArea currentChatUser={currentChatUser} />
    </div >
  )
}




