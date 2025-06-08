import React, { useEffect, useMemo, useRef, useState } from 'react'
import { ProfileBar } from '../../components/UI/ProfileBar';
import { MessageInputBox } from '../../components/UI/MessageInputBox';
import { useQuery } from '@tanstack/react-query';
import { useSocketContext } from '../../context/useSocketContext';
import { getMessagesApi } from '../../apis/chatApis';
import { authUser } from '../../context/authUser';
import { decryptAESKey } from '../../Encryption/rsa';
import { decryptMessage } from '../../Encryption/aes';
import { Message } from '../../components/UI/Message';
import { TypingDots } from '../../components/UI/TypingDots';
import { useChatContext } from '../../context/chatContext';
import { ChatInfoModal } from '../../components/UI/ChatInfoModal';

export const ChatArea = ({ setIsChatInfoModalOpen, isChatInfoModalOpen }) => {
    const { currentChat, setCurrentChat } = useChatContext();
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const { user, privateKey } = authUser()
    const { socket, onlineUsers, typingStatus } = useSocketContext();

    const chatEndRef = useRef()

    const { data: conversationData = {}, isLoading: isLoadingMessage } = useQuery({
        queryKey: ['getMessages', currentChat?._id],
        queryFn: () => getMessagesApi(currentChat?._id, currentChat?.isGroupChat, token),
        enabled: !!token && !!currentChat,
    })

    useEffect(() => {
        if (!socket) return;
        if (currentChat) {
            socket.emit('activeChat', { chatWith: currentChat._id, isChatWithGroup: currentChat?.isForGroup });
        } else {
            socket.emit('activeChat', { chatWith: null });
        }
    }, [currentChat, socket])

    const [messages, setMessages] = useState([])

    useEffect(() => {
        if (!socket || !messages.length || !currentChat) return;

        const unreadMessages = messages.filter(
            msg => msg.status !== 'read' && msg.status !== 'pending'
        );

        if (unreadMessages.length) {
            const messageIds = unreadMessages.map(m => m._id);
            socket.emit('messageRead', {
                chatId: currentChat._id,
                isGroupChat:currentChat?.isGroupChat,
                messageIds
            });
        }
    }, [messages, currentChat]);

    useEffect(() => {
        if (currentChat) {
            setMessages([]); // Clear messages before loading new ones
        }
    }, [currentChat])

    useEffect(() => {
        if (!socket) return;

        socket.on('message-read', ({ messageId }) => {
            setMessages(prevMessages =>
                prevMessages.map(msg => {
                    return msg?._id.toString() === messageId.toString() ? { ...msg, status: 'read' } : msg
                })
            );
        });
        return () => socket.off('message-read');
    }, [socket, currentChat]);


    useEffect(() => {
        if (conversationData?.length > 0) {
            const msgData = conversationData.map((msg) => {
                const aesKey = decryptAESKey(msg?.encryptedAESKeys[user?._id], privateKey);   // Decrypt AES Key
                const message = decryptMessage(msg.encryptedMessage, aesKey);     // Decrypt Message
                const decryptedMessage = {
                    image: msg.image,
                    sender: msg.sender,
                    message,
                    createdAt: msg.createdAt,
                    _id: msg._id,
                    status: msg.status
                }
                return decryptedMessage;
            })
            setMessages(msgData);
        }
    }, [conversationData])


    useEffect(() => {
        if (!socket || !privateKey) return;

        const handleNewMessage = (newMessage) => {
            const aesKey = decryptAESKey(newMessage?.encryptedAESKeys[user?._id], privateKey);   // Decrypt AES Key
            const message = decryptMessage(newMessage.encryptedMessage, aesKey);     // Decrypt Message

            setMessages(prevMsg => ([...prevMsg, {
                image: newMessage.image,
                sender: newMessage.sender,
                message: message,
                createdAt: newMessage.createdAt,
                _id: newMessage._id,
                status: newMessage.status
            }]))
        }
        socket.on('newMessage', handleNewMessage)

        return () => {
            socket.off("newMessage", handleNewMessage);
        }
    }, [socket])


    const groupedMessages = useMemo(() => {
        if (!messages.length || !privateKey) return {};

        const finalMsg = {};
        messages.forEach(msg => {
            const msgDate = new Date(msg.createdAt).toLocaleDateString('en-GB', {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric"
            });
            if (!finalMsg[msgDate]) finalMsg[msgDate] = [];
            finalMsg[msgDate].push(msg);
        });
        return finalMsg;
    }, [messages, privateKey]);

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages])

    return (
        <>
            {/* Right Message Area  */}
            <div className={`md:m-2 max-w-full  absolute md:static min-h-lvh z-10  flex  dark:bg-gray-700  flex-col  bg-white  box-border  flex-1  rounded w-full md:w-auto md:min-h-[98vh]  transition-all duration-500 ease-in-out ${currentChat ? "right-0" : "right-full"}`}>

                {
                    currentChat ?
                        <>
                            <ProfileBar setIsChatInfoModalOpen={setIsChatInfoModalOpen} avatar={currentChat?.avatar || currentChat?.groupAvatar} name={currentChat?.fullName || currentChat?.groupName} isOnline={onlineUsers?.includes(currentChat?._id)} isTyping={typingStatus.includes(currentChat._id)} />

                            {/* Message Area */}
                            <div id="scrollableDiv" className='w-full flex-1 overflow-y-auto custom-scrollbar'>
                                <div className='w-full py-4 px-7 overflow-y-auto flex flex-col gap-1 justify-end '>

                                    {isLoadingMessage ?
                                        (<div className='w-full h-full flex justify-center items-center'>
                                            <div className="loader"></div>
                                        </div>) :
                                        messages?.length === 0 ?
                                            (
                                                <p className='text-base font-semibold text-center dark:text-gray-100 text-gray-800'>No messages yet. Start a conversation<span className='text-orange-400'>!</span></p>
                                            )
                                            : (
                                                Object.entries(groupedMessages).map(([dateOfMsg, messages]) => (
                                                    <div key={dateOfMsg} className='space-y-4'>
                                                        <p className='text-sm text-center text-gray-900 my-4 dark:text-gray-300 font-thin'>{dateOfMsg}</p>
                                                        {messages?.map((msg) => <Message key={msg?._id} msg={msg} />)}
                                                    </div>
                                                ))
                                            )}
                                    {
                                        typingStatus.includes(currentChat._id) && <TypingDots avatar={currentChat.avatar} />
                                    }
                                    <div ref={chatEndRef} />
                                </div>
                            </div>

                            <MessageInputBox setMessages={setMessages} />
                        </>
                        :
                        <div className=' hidden w-full h-full md:flex flex-col gap-3 justify-center items-center'>
                            <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100'>Welcome, <span className='text-orange-400'>{user?.fullName}</span> </h1>
                            <p className='text-lg font-semibold text-gray-800 dark:text-gray-100'>Select User To Start Chat.</p>
                        </div>
                }
                {isChatInfoModalOpen && <ChatInfoModal setIsChatInfoModalOpen={setIsChatInfoModalOpen} isChatInfoModalOpen={isChatInfoModalOpen} />}
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
