import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ProfileBar } from '../../components/UI/ProfileBar';
import { MessageInputBox } from '../../components/UI/MessageInputBox';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSocketContext } from '../../context/useSocketContext';
import { getMessagesApi, sendMessageApi } from '../../apis/chatApis';
import { authUser } from '../../context/authUser';

export const ChatArea = ({ currentChatUser, setCurrentChatUser }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const { user } = authUser()
    const { socket, onlineUsers, typingStatus } = useSocketContext()
    const [groupedMessages, setGroupedMessages] = useState({});


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
                createdAt: newMessage.createdAt
            }]))
        }
        socket.on('newMessage', handleNewMessage)

        return () => {
            socket.off("newMessage", handleNewMessage);
        }
    }, [socket])


    useEffect(() => {
        chatEndRef?.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages])


    useMemo(() => {
        let finalMsg = {};
        if (messages.length !== 0) {

            messages.forEach(msg => {
                const msgDate = new Date(msg.createdAt).toLocaleDateString('en-GB', { weekday: "long", year: "numeric", month: "long", day: "numeric" });
                if (finalMsg[msgDate]) {
                    finalMsg[msgDate].push(msg)
                } else {
                    finalMsg[msgDate] = [msg]
                }
            })
            setGroupedMessages(finalMsg)
        }
    }, [messages])

    return (
        <>
            {/* Right Message Area  */}
            {/* <div className={`md:m-2 ${currentChatUser ? "right-0" : "-right-full"} max-w-dvh absolute overflow-clip md:static max-h-dvh z-10 flex dark:bg-gray-700 flex-col bg-white box-border flex-1 rounded`}> */}
            <div className={` md:m-2  max-w-full  absolute md:static h-screen max-h-dvh  z-10  flex  dark:bg-gray-700  flex-col  bg-white  box-border  flex-1  rounded w-full h-full md:w-auto md:h-auto  transition-all duration-500 ease-in-out ${currentChatUser ? "right-0" : "right-full"}`}>


                {
                    currentChatUser ?
                        <>
                            <ProfileBar setCurrentChatUser={setCurrentChatUser} avatar={currentChatUser.avatar} name={currentChatUser.fullName} isOnline={onlineUsers?.includes(currentChatUser?._id)} isTyping={typingStatus.includes(currentChatUser._id)} />

                            {/* Message Area */}
                            <div className='w-full flex-1 overflow-auto custom-scrollbar'>
                                <div className='w-full h-full py-4 px-7 flex flex-col gap-1 justify-end '>
                                    {isLoadingMessage ?
                                        (<div className='w-full h-full flex justify-center items-center'>
                                            <div className="loader"></div>
                                        </div>) :
                                        messages?.length === 0 ?

                                            (
                                                <p className='text-base font-semibold text-center dark:text-gray-100 text-gray-800'>No messages yet. Start a conversation<span className='text-orange-400'>!</span></p>
                                            )
                                            : (
                                                Object.keys(groupedMessages).map((dateOfMsg) => {
                                                    return <div>
                                                        <p className='text-sm text-center text-gray-900 my-4 dark:text-gray-300 font-thin'>{dateOfMsg}</p>
                                                        {
                                                            groupedMessages[dateOfMsg].map((msg) => {
                                                                const msgTime = new Date(msg.createdAt).toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit', hour12: true })
                                                                return (
                                                                    <>
                                                                        <div key={msg?._id} >
                                                                            <div className={`flex gap-2 ${msg?.sender?._id === user?._id && "flex-row-reverse"}`}>
                                                                                <div className='w-8 h-8 ring-1 ring-orange-400 ring-offset-2 overflow-clip rounded-full'>
                                                                                    <img className='w-full h-full object-cover' src={msg?.sender?.avatar} alt="" />
                                                                                </div>

                                                                                <div className={`text-sm md:text-base px-3 py-2 break-words rounded-t-lg  ${msg?.sender?._id === user?._id ? "rounded-l-lg justify-self-end bg-orange-400 text-white" : "justify-self-start rounded-r-lg bg-gray-300 dark:bg-gray-500 dark:text-gray-200 text-gray-900"}  max-w-1/2 lg:w-fit`}>
                                                                                    <img src={msg?.image} />
                                                                                    <span >{msg?.message}</span>
                                                                                </div>
                                                                            </div>
                                                                            <p className={`text-xs leading-none mb-2 mt-0.5 font-mono dark:text-gray-100 tracking-tighter text-gray-500 ${msg?.sender._id === user?._id ? "text-right" : "text-left"}`}>{msgTime}</p>
                                                                        </div>
                                                                    </>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                })
                                            )

                                    }
                                    {
                                        typingStatus.includes(currentChatUser._id) &&

                                        <div className={`flex gap-2 transition-all ease-in-out duration-300 `}>
                                            <div className='w-8 h-8 ring-1 ring-orange-400 ring-offset-2 overflow-clip rounded-full'>
                                                <img className='w-full h-full object-cover' src={currentChatUser?.avatar} alt="" />
                                            </div>
                                            < div className={`px-3 py-2.5 rounded-t-lg justify-self-start rounded-r-lg bg-gray-300 dark:bg-gray-500 dark:text-gray-100 max-w-1/2 lg:w-fit`}>
                                                <span >
                                                    <div className='userTyping'></div>
                                                </span>
                                            </div>
                                        </div>

                                    }
                                    <div ref={chatEndRef} />
                                </div>
                            </div>

                            <MessageInputBox currentChatUser={currentChatUser} setMessages={setMessages} />
                        </>
                        :
                        <div className=' hidden w-full h-full md:flex flex-col gap-3 justify-center items-center'>
                            <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100'>Welcome, <span className='text-orange-400'>{user?.fullName}</span> </h1>
                            <p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Select User To Start Chat.</p>
                        </div>
                }

            </div>
        </>
    )
}

// (messages?.map((msg) => {
//     const msgTime = new Date(msg.createdAt).toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit', hour12: true })
// const msgDate = new Date(msg.createdAt).toLocaleDateString('en-Us')

//     return (
//         <>
//             <div key={msg?._id} >
//                 <div className={`flex gap-2 ${msg?.sender?._id === user?._id && "flex-row-reverse"}`}>
//                     <div className='w-8 h-8 ring-1 ring-orange-400 ring-offset-2 overflow-clip rounded-full'>
//                         <img className='w-full h-full object-cover' src={msg?.sender?.avatar} alt="" />
//                     </div>

//                     < div className={`text-sm md:text-base px-3 py-2 break-words rounded-t-lg  ${msg?.sender?._id === user?._id ? "rounded-l-lg justify-self-end bg-orange-400 text-white" : "justify-self-start rounded-r-lg bg-gray-300 dark:bg-gray-500 dark:text-gray-200 text-gray-900"}  max-w-1/2 lg:w-fit`}>
//                         <span >{msg?.message}</span>
//                     </div>
//                 </div>
//                 <p className={`text-xs leading-none mb-2 mt-0.5 font-mono dark:text-gray-100 tracking-tighter text-gray-500 ${msg?.sender._id === user?._id ? "text-right" : "text-left"}`}>{msgDate} {msgTime}</p>
//             </div>
//         </>
//     )
// }))
