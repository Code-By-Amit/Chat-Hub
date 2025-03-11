import { createContext, useContext, useEffect, useState } from "react";
import { io } from 'socket.io-client'
import { authUser } from "./authUser";

const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
    const [onlineUsers, setOnlineUsers] = useState()
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
            }
        }
    }, [user])


    return <SocketContext.Provider value={{ socket, onlineUsers }}  >
        {children}
    </SocketContext.Provider >
}

export const useSocketContext = () => useContext(SocketContext)