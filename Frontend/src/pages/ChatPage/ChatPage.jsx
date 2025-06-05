import React, { useEffect, useState } from 'react'
import { ChatArea } from './ChatArea';
import { FriendAndGroupListPannel } from './FriendAndGroupListPannel';
import { useChatContext } from '../../context/chatContext';
import { ChatInfoModal } from '../../components/UI/ChatInfoModal';


export const ChatPage = () => {
   const [isChatInfoModalOpen, setIsChatInfoModalOpen] = useState(false)
  return (
    <>
    <div className='w-full h-screen flex bg-gray-200 dark:bg-gray-900'>
      <FriendAndGroupListPannel />
      <ChatArea setIsChatInfoModalOpen={setIsChatInfoModalOpen}  isChatInfoModalOpen={isChatInfoModalOpen}/>
    </div >
      
    </>
  )
}




