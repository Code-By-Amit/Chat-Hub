import React, { useEffect, useRef, useState } from 'react'
import { ProfileBar } from '../../components/UI/ProfileBar';
import { MessageInputBox } from '../../components/UI/MessageInputBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSocketContext } from '../../context/useSocketContext';
import { getMessagesApi, sendMessageApi } from '../../apis/chatApis';
import { authUser } from '../../context/authUser';

export const ChatArea = ({ currentChatUser }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const [inputMessage, setInputMessage] = useState('')
    const { user } = authUser()
    const { socket } = useSocketContext()

    const chatEndRef = useRef()

    const { data: conversationData = {}, isLoading: isLoadingMessage, refetch } = useQuery({
        queryKey: ['getMessages', currentChatUser?._id],
        queryFn: () => getMessagesApi(currentChatUser._id, token),
        enabled: !!token && !!currentChatUser
    })
    
    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (currentChatUser) {
            setMessages([]); // Clear messages before loading new ones
            refetch()
        }
    }, [currentChatUser])

    useEffect(() => {
        if (conversationData?.messages) {
            setMessages(conversationData.messages);
        }
    }, [conversationData]);

    useEffect(() => {
        if (!socket) return
        const handleNewMessage = (newMessage) => {
            setMessages(prevMsg => ([...prevMsg, {
                sender: newMessage.sender,
                message: newMessage.message,
                createdAt:newMessage.createdAt
            }]))
        }
        socket.on('newMessage', handleNewMessage)

        return () => socket.off("newMessage", handleNewMessage);
    }, [socket])

    useEffect(() => {
        chatEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    const sendMessageMutation = useMutation({
        mutationKey: ['sendMessage'],
        mutationFn: ({ reciverId, message }) => sendMessageApi(reciverId, message, token)
    })

    const handleSendMessage = (message) => {
        if (message.trim() === "") return
        sendMessageMutation.mutate({ reciverId: currentChatUser._id, message })
    }

    if (isLoadingMessage) return <div>Loading Messages...</div>
    console.log("conversationData",conversationData)
    return (    
        <>
            {/* Right Message Area  */}
            <div className='m-2 hidden overflow-clip md:flex dark:bg-gray-700 flex-col bg-white relative box-border flex-1 rounded'>

                {
                    currentChatUser ?
                        <>
                            <ProfileBar avatar={currentChatUser.avatar} name={currentChatUser.fullName} isOnline={currentChatUser.isOnline} />

                            {/* Message Area */}
                            <div className='w-full flex-1 overflow-auto custom-scrollbar'>
                                <div className='w-full py-4 px-7 flex flex-col gap-1 justify-end '>
                                    {
                                        messages?.length === 0 ?

                                            (
                                                <p className='text-base font-semibold text-center dark:text-gray-100 text-gray-800'>No messages yet. Start a conversation<span className='text-orange-400'>!</span></p>
                                            )
                                            :
                                            (messages?.map((msg) => {
                                                const msgTime = new Date(msg.createdAt).toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit', hour12: true })
                                                return (
                                                    <>
                                                        <div key={msg?._id} >
                                                            < div className={`text-base px-3 break-words py-1 rounded-t-lg  ${msg?.sender?._id === user?._id ? "rounded-l-lg justify-self-end bg-orange-400 text-white" : "self-start rounded-r-lg bg-gray-200 dark:bg-gray-500 dark:text-gray-100 text-gray-800"}  max-w-1/3 w-fit`}>
                                                                <span>{msg?.message}</span>
                                                            </div>
                                                            <p className={`text-xs leading-none mb-2 mt-0.5 font-mono dark:text-gray-100 tracking-tighter text-gray-500 ${msg?.sender._id === user?._id ? "text-right" : "text-left"}`}>{msgTime}</p>
                                                        </div>
                                                    </>
                                                )
                                            }))
                                    }
                                    <div ref={chatEndRef} />
                                </div>
                            </div>

                            <MessageInputBox handleSendMessage={handleSendMessage} inputMessage={inputMessage} setInputMessage={setInputMessage} />
                        </>
                        :
                        <div className=' w-full h-full flex flex-col justify-center items-center'>
                            <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100'>Welcome,<span className='text-orange-400'>{user?.fullName}</span> </h1>
                            <p className='text-base font-semibold text-gray-800 dark:text-gray-100'>Select User To Start Chat.</p>
                        </div>
                }

            </div>
        </>
    )
}
