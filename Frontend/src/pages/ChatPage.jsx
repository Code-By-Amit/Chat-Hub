import React, { useEffect, useRef, useState } from 'react'
import { IoSend } from "react-icons/io5";
import { LuSend } from "react-icons/lu";
import { ProfileBar } from '../components/UI/ProfileBar';
import { MessageInputBox } from '../components/UI/MessageInputBox';
import { div } from 'framer-motion/client';
import { SlidingButton } from '../components/UI/SlidingButton';

const users = [
  {
    name: "Amit Sharma",
    isOnline: true,
    avatar: "https://avatar.iran.liara.run/public/boy?username=Amit"
  },
  {
    name: "Neha Verma",
    isOnline: false,
    avatar: "https://avatar.iran.liara.run/public/girl?username=Neha"
  },
  {
    name: "Rohan Mehta",
    isOnline: true,
    avatar: "https://avatar.iran.liara.run/public/boy?username=Rohan"
  },
  {
    name: "Priya Singh",
    isOnline: false,
    avatar: "https://avatar.iran.liara.run/public/girl?username=Priya"
  },
  {
    name: "Vikram Patel",
    isOnline: true,
    avatar: "https://avatar.iran.liara.run/public/boy?username=Vikram"
  }
];

export const ChatPage = () => {
  const [active, setActive] = useState('Personals')
  const [friends, setFriends] = useState(users)
  const [currentChatUser, setCurrentChatUser] = useState(null)
  const [messages, setMessages] = useState([])

  const chatEndRef = useRef()

  useEffect(() => {
    chatEndRef?.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const handleSendMessage = (message) => {
    if (message.trim() === "") return
    setMessages(prev => ([...prev, { sender: "You ", message, reciverId: currentChatUser.name }]))
  }

  return (
    <div className='w-full h-dvh flex bg-gray-100'>
      <div className='w-full md:w-96 my-2 ml-2 bg-white rounded'>
        <div className='p-4'>
          <h1 className='text-3xl mt-5 font-bold'>Chats</h1>
          <SlidingButton setActive={setActive} active={active} buttons={["Personals", "Groups"]} />
          <div className='w-full border border-gray-200 my-4'></div>

          <div className="profileCard flex flex-col gap-2 p-2 max-h-144 overflow-y-auto custom-scrollbar ">
            {/* <ChatUserCard avatar="https://avatar.iran.liara.run/public/boy?username=amit" name="Amit Saini" isOnline /> */}
            {
              friends?.map((friend, i) => {
                return <ChatUserCard key={i} setCurrentChatUser={setCurrentChatUser} friend={friend} />
              })
            }
          </div>
        </div>
      </div>


      {/* Right Message Area  */}
      <div className='m-2 hidden overflow-clip md:flex flex-col bg-white relative box-border flex-1 rounded'>

        {
          currentChatUser ?
            <>
              <ProfileBar avatar={currentChatUser.avatar} name={currentChatUser.name} isOnline={currentChatUser.isOnline} />

              {/* Message Area */}
              <div className='w-full flex-1 overflow-auto custom-scrollbar'>
                <ul className='w-full py-4 px-7 flex flex-col gap-1 justify-end '>
                  {
                    messages.length === 0 ?

                      (
                        <p className='text-base font-semibold text-center text-gray-800'>No messages yet. Start a conversation<span className='text-orange-400'>!</span></p>
                      )
                      :
                      (messages.map((msg) => {
                        return (
                          <>
                            < li className={` px-4 py-2  text-base rounded-t-lg  ${msg.sender == 'You' ? "rounded-l-lg self-end bg-orange-400 text-white" : "self-start rounded-r-lg bg-gray-200 text-gray-800"}  max-w-1/3 w-fit`}>
                              <span>{msg.message}</span>
                            </li>
                            <p className={`text-xs leading-none mb-4 text-gray-500 ${msg.sender == 'You' ? "text-right" : "text-left"}`}>3:13 pm</p>
                          </>
                        )
                      }))
                  }
                  <div ref={chatEndRef} />
                </ul>
              </div>

              <MessageInputBox handleSendMessage={handleSendMessage} />
            </>
            :
            <div className=' w-full h-full flex flex-col justify-center items-center'>
              <h1 className='text-4xl font-bold text-gray-800'>Welcome,<span className='text-orange-400'> Amit Saini</span> </h1>
              <p className='text-base font-semibold text-gray-800'>Select User To Start Chat.</p>
            </div>
        }

      </div>

    </div >
  )
}



export const ChatUserCard = ({ friend, setCurrentChatUser }) => {

  const handleOnclick = () => {
    setCurrentChatUser(friend)
  }

  return (
    <>
      <div onClick={handleOnclick} className="card flex gap-2 p-3 rounded hover:bg-gray-100 bg-gray-50">
        <div className='relative'>
          <div className='w-10 h-10 ring-2 rounded-full ring-orange-400 ring-offset-2'>
            <img className='w-full h-full object-cover' src={friend.avatar} alt={friend.name} />
          </div>
          {friend.isOnline && <div className='absolute w-2 h-2 ring-2 ring-white bg-green-400 rounded-full bottom-0.5 right-0'></div>}
        </div>
        <p className='text-md font-semibold'>{friend.name}</p>
      </div>
    </>
  )
}
