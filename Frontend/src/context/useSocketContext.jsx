import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'
import { authUser } from "./authUser";
import { msgNotification } from "../utils/msgNotificationToast";
import { decryptAESKey } from "../Encryption/rsa";
import { decryptMessage } from "../Encryption/aes";
import { useChatContext } from "./chatContext";

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
    const [typingStatus, setTypingStatus] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)
    const { user, privateKey } = authUser()
    const Backend_Url = import.meta.env.VITE_BACKEND_URL;
    const { currentChat, setCurrentChat } = useChatContext();

    useEffect(() => {
        if (user) {
            const newSocket = io(Backend_Url, {
                query: {
                    userId: user?._id
                }
            })

            setSocket(newSocket)
            newSocket.on('getOnlineUsers', (users) => {
                setOnlineUsers(users)
            })

            return () => newSocket.close()
        }
        else {
            if (socket) {
                socket.close()
                setSocket(null)
                setTypingStatus([]);
            }
        }
    }, [user])

    useEffect(() => {
        if (!socket) return
        const handleTypingStatus = (whosTyping) => {
            setTypingStatus(prev => ([...prev, whosTyping]))
        }

        const handleStopTypingStatus = (whoStopTyping) => {
            setTypingStatus((prevTypingUser) => prevTypingUser.filter((userId) => userId !== whoStopTyping))
        }

        socket.on('typing', handleTypingStatus)
        socket.on('stopTyping', handleStopTypingStatus)

        return () => {
            socket.off("typing", handleTypingStatus);
            socket.off('stopTyping', handleStopTypingStatus)
        }
    }, [socket])

    useEffect(() => {
        if (!socket || !privateKey) return;

        const handleNewMessage = (newMessage) => {
            const aesKey = decryptAESKey(newMessage?.encryptedAESKeys[user?._id], privateKey);   // Decrypt AES Key
            const message = decryptMessage(newMessage.encryptedMessage, aesKey);     // Decrypt Message

            const { fullName, username, avatar, _id, publicKey } = newMessage.sender;
            const handleReplyClick = () => {
                if(currentChat.isGroupChat){
                    setCurrentChat({ _id, fullName, username, avatar, publicKey })
                }else{
                    setCurrentChat(newMessage.chatId)
                }
            }
            console.log("new Message",newMessage)
            if(newMessage?.chatId?._id != currentChat?._id && user?._id !== newMessage?.sender?._id && newMessage?.sender?._id !== currentChat._id ){
                const isGroupChat = currentChat?.isGroupChat
                msgNotification(newMessage, message, handleReplyClick, isGroupChat)
            }
        }

        socket.on('newMessage', handleNewMessage)
        return () => {
            socket.off("newMessage", handleNewMessage);
        }
    }, [socket,currentChat])

    return <SocketContext.Provider value={{ socket, onlineUsers, typingStatus }}  >
        {children}
    </SocketContext.Provider >
}

export const useSocketContext = () => useContext(SocketContext)