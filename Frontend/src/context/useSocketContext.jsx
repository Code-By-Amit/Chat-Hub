import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'
import { authUser } from "./authUser";

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
    const [typingStatus, setTypingStatus] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [socket, setSocket] = useState(null)
    const { user } = authUser()
    const Backend_Url = import.meta.env.VITE_BACKEND_URL;

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

    return <SocketContext.Provider value={{ socket, onlineUsers, typingStatus }}  >
        {children}
    </SocketContext.Provider >
}

export const useSocketContext = () => useContext(SocketContext)