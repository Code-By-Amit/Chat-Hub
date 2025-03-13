import React, { useRef, useState } from 'react'
import { LuSend } from 'react-icons/lu'
import { useSocketContext } from '../../context/useSocketContext';
import { authUser } from '../../context/authUser';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmileWink } from "react-icons/fa";


export const MessageInputBox = ({ handleSendMessage, inputMessage, setInputMessage, currentChatUser, sendMessageMutation }) => {
    const { socket } = useSocketContext()
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [isEmojiOpen, setIsEmojieOpen] = useState(false)
    const { user } = authUser()

    const handleTyping = (e) => {
        if (!socket) {
            console.error("Socket is not connected");
            return;
        }
        setInputMessage(e.target.value);
        const payload = {
            to: currentChatUser?._id,
            from: user?._id
        }

        if (!isTyping) {
            setIsTyping(true);
            socket.emit("typing", payload); // Emit typing event
        }

        // Clear previous timeout before setting a new one
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

        // Stop typing after delay
        typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            socket.emit("stopTyping", payload); // Emit stop typing event
        }, 2000);
    };
    
    const handleEmojiClick = (e) => {
        setInputMessage(prev => prev + e.emoji)
    }
    
    return (
        <div className='relative bottom-0 left-0 w-full border-gray-300 border-t dark:bg-gray-800 bg-gray-100  p-2'>
            <div className='w-full h-15 flex items-center  p-2 rounded-lg'>
                <div className={`absolute bottom-20 transition ease-in-out duration-300 left-5 ${isEmojiOpen ? "block" : "hidden"}`}>
                    <EmojiPicker open={true} lazyLoadEmojis={true} emojiStyle='apple' onEmojiClick={handleEmojiClick} width={460} height={400} />
                </div>
                <div className='flex-1 flex items-center px-4 h-full  dark:bg-gray-500 dark:text-gray-100 bg-white rounded-lg outline-orange-300'>
                    <FaRegSmileWink onClick={() => setIsEmojieOpen(!isEmojiOpen)} size={50} className='dark:bg-gray-50/20 bg-gray-500/20 text-gray-600 dark:text-gray-200 cursor-pointer hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1.5' />
                    <input type="text" className='h-full w-full py-2 px-3 outline-none' value={inputMessage}
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(inputMessage)
                                setInputMessage('')
                            }
                        }}
                        placeholder='Type a message...' />
                </div>
                <div className='bg-orange-400 cursor-pointer text-white px-6 mx-2 rounded flex items-center justify-center h-full gap-2'>
                    <p onClick={() => {
                        handleSendMessage(inputMessage)
                        setInputMessage('')
                    }} className='text-sm font-medium leading-none'>{sendMessageMutation.isPending ? "Sending..." : "Send"}</p>
                    {/* <IoSend size={23} /> */}
                    <LuSend />
                </div>
            </div>
        </div>
    )
}
