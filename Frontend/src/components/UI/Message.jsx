import React from 'react'
import { authUser } from '../../context/authUser'
import { VscCheckAll, VscCheck } from "react-icons/vsc";
import { FaRegClock } from "react-icons/fa6";
export const Message = ({ msg }) => {
    const { user } = authUser();
    const msgTime = new Date(msg.createdAt).toLocaleTimeString('en-Us', { hour: '2-digit', minute: '2-digit', hour12: true })
    return (
        <div >
            <div className={`flex gap-2 ${msg?.sender?._id === user?._id && "flex-row-reverse"}`}>
                <div className='w-7 h-7 mt-1 ring-1 ring-orange-400 ring-offset-2 overflow-clip rounded-full'>
                    <img className='w-full h-full object-cover' src={msg?.sender?.avatar} alt="" />
                </div>



                <div className={`text-sm md:text-base px-3 pb-1.5 break-words relative rounded-t-lg  ${msg?.sender?._id === user?._id ? "rounded-l-lg justify-self-end pr-6.5 bg-orange-400 text-white" : "justify-self-start rounded-r-lg bg-gray-300 dark:bg-gray-500 dark:text-gray-200 text-gray-900"} max-w-8/12 md:max-w-1/3 `}>
                    <p className={`text-left ${msg?.sender?._id === user?._id ? "" : "text-orange-400"}  font-semibold text-xs`}>~{msg?.sender?.fullName}~</p>
                   
                    {msg?.image && <img src={msg?.image} className=' w-auto h-auto md:h-35' alt='image' />}
                    <p>{msg.message}</p>
                    
                    <div className={`text-sm absolute bottom-1 right-2 ${!(msg?.sender?._id === user?._id) && "hidden"}`}>
                        {msg.status == 'pending' ? <FaRegClock size={12} /> : (msg.status == 'sent' ? <VscCheck /> : <VscCheckAll />)}

                    </div>
                </div>


            </div>
            <p className={`text-xs leading-none mb-2 mt-0.5 font-mono dark:text-gray-100 tracking-tighter text-gray-500 ${msg?.sender._id === user?._id ? "text-right" : "text-left"}`}>{msgTime}</p>
        </div>
    )
}
