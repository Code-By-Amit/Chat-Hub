import React, { useState } from 'react'
import { LuSend } from 'react-icons/lu'

export const MessageInputBox = ({handleSendMessage}) => {
    const [message,setMessage] = useState()

    return (
        <div className='relative bottom-0 left-0 w-full border-gray-300 border-t  bg-white  p-2'>
            <div className='w-full h-15 flex items-center  p-2 rounded-lg'>
                <input type="text" className='flex-1 h-full py-2 px-3 bg-gray-100 rounded outline-none' value={message}
                 onChange={(e)=>setMessage(e.target.value)} 
                 onKeyDown={(e)=>{
                    if(e.key === 'Enter'){
                        handleSendMessage(message)
                        setMessage('')
                    }
                 }}
                 placeholder='Type a message...' />
                <div className='bg-orange-600 cursor-pointer text-white px-6 mx-2 rounded flex items-center justify-center h-full gap-2'>
                    <p onClick={()=>{
                        handleSendMessage(message)
                        setMessage('')
                    }} className='text-sm font-medium leading-none'>Send</p>
                    {/* <IoSend size={23} /> */}
                    <LuSend />
                </div>
            </div>
        </div>
    )
}
