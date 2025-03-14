import React, { useEffect, useRef, useState } from 'react'
import { LuSend } from 'react-icons/lu'
import { useSocketContext } from '../../context/useSocketContext';
import { authUser } from '../../context/authUser';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmileWink } from "react-icons/fa";
import { LuImagePlus } from "react-icons/lu";
import { GrFormClose } from "react-icons/gr";
import { useMutation } from '@tanstack/react-query';
import { sendMessageApi } from '../../apis/chatApis';


export const MessageInputBox = ({ currentChatUser, setMessages }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const { socket } = useSocketContext()
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeoutRef = useRef(null);
    const [isEmojiOpen, setIsEmojieOpen] = useState(false)
    const [previewInputImage, setPreviewInputImage] = useState(null)
    const [inputMessage, setInputMessage] = useState('')
    const [inputImage, setInputImage] = useState(null)
    const { user } = authUser()

    const sendMessageMutation = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: (formdata) => sendMessageApi(formdata, token),
        onSuccess: () => {
            URL.revokeObjectURL(previewInputImage)
            setInputMessage('')
            setPreviewInputImage(null)
            setInputImage(null)
        }
    })

    const handleSendMessage = (message) => {
        if (message.trim() === "") return
        socket.emit("stopTyping", currentChatUser._id)

        const messageFormData = new FormData()

        messageFormData.append('reciverId', currentChatUser._id)
        messageFormData.append('message', message)

        if (inputImage) {
            messageFormData.append('image', inputImage)
        }
        sendMessageMutation.mutate(messageFormData)
    }

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
        }, 1500);
    };

    const handleEmojiClick = (e) => {
        setInputMessage(prev => prev + e.emoji)
    }

    const handleInputFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            const UrlObj = URL.createObjectURL(file)
            if (previewInputImage) {
                URL.revokeObjectURL(previewInputImage)
                setInputImage(null)
                setPreviewInputImage(null)
            }
            setPreviewInputImage(UrlObj)
            setInputImage(file)
        }
    }

    const cancleInputFile = () => {
        if (previewInputImage) {
            URL.revokeObjectURL(previewInputImage)
            setPreviewInputImage(null)
            setInputImage(null)
        }
    }

    const [loadingDots, setLoadingDots] = useState('.')
    useEffect(() => {
        
        let a = setInterval(() => {
            setLoadingDots((prev) => prev.length >= 3 ? '.' : prev + ".")
        }, 500);

        return () => clearInterval(a)
    }, [])

    return (
        <div className='sticky bottom-0 left-0 w-full border-gray-300 border-t dark:bg-gray-800 bg-gray-100  p-2'>
            <div className='w-full h-15 flex items-center  p-2 rounded-lg'>
                <div className={`absolute bottom-20 transition ease-in-out duration-300 left-5 ${isEmojiOpen ? "block" : "hidden"}`}>
                    <EmojiPicker open={true} lazyLoadEmojis={true} emojiStyle='apple' className='z-50' onEmojiClick={handleEmojiClick} height={400} />
                </div>

                <div className='flex-1 flex items-center px-2 h-full  dark:bg-gray-500 dark:text-gray-100 bg-white rounded-lg outline-orange-300'>


                    <div className='flex justify-center border-r-2 px-1 pr-3 gap-2 items-center'>
                        <FaRegSmileWink onClick={() => setIsEmojieOpen(!isEmojiOpen)} className='dark:bg-gray-50/20 text-3xl bg-gray-500/20 text-gray-600 dark:text-gray-200 cursor-pointer hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1.5' />
                        <label htmlFor="imageInput">
                            <LuImagePlus className='dark:bg-gray-50/20 text-3xl bg-gray-500/20 text-gray-600 dark:text-gray-200 cursor-pointer hover:text-gray-500 dark:hover:text-gray-300 rounded-full p-1.5' />
                        </label>
                        <input type="file" id='imageInput' name='inputImage' onChange={handleInputFile} className='hidden' accept='image/*' />
                    </div>
                    {
                        previewInputImage &&
                        <div className='absolute bottom-13 left-30'>
                            <GrFormClose onClick={cancleInputFile} className='absolute right-0 hover:opacity-80 top-0 rounded bg-gray-700/55' />
                            <div className='w-15 h-15 overflow-clip rounded  ring-1 dark:ring-white ring-gray-500 ring-offset-2'>
                                {/* <img className='w-full h-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtpk191SnwRO64Mp3rtucL_UBDrxFfRF77jw&s" alt="" /> */}
                                <img className='w-full h-full object-cover' src={previewInputImage} alt="" />
                            </div>
                        </div>
                    }


                    <input type="text" className='h-full w-full text-lg py-2 px-2 outline-none dark:bg-gray-500 dark:text-gray-100 bg-white rounded-lg outline-orange-300' value={inputMessage}
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage(inputMessage)
                            }
                        }}
                        placeholder='Type a message...' />
                </div>
                <div className='bg-orange-400 cursor-pointer text-white px-6 mx-2 rounded flex items-center justify-center h-full gap-2'>
                    <p onClick={() => {
                        handleSendMessage(inputMessage)
                    }} className='text-sm font-medium leading-none'>{sendMessageMutation.isPending ? Sending+loadingDots : "Send" }</p>
                    {/* <IoSend size={23} /> */}
                    <LuSend />
                </div>
            </div>
        </div>
    )
}
