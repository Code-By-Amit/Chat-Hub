import { createContext, useContext, useState } from "react"

// ChatContext.js
const ChatContext = createContext()

export const ChatProvider = ({ children }) => {
  const [currentChat, setCurrentChat] = useState(null)

  return (
    <ChatContext.Provider value={{ currentChat, setCurrentChat }}>
      {children}
    </ChatContext.Provider>
  )
}


export const useChatContext = () => useContext(ChatContext)