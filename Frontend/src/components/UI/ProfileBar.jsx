import React, { use, useState } from 'react'
import { MdOutlineKeyboardArrowLeft } from "react-icons/md";
import { useChatContext } from '../../context/chatContext';
import { GrContactInfo } from "react-icons/gr";

export const ProfileBar = ({ avatar, name, isOnline, isTyping, setIsChatInfoModalOpen }) => {
    const { currentChat, setCurrentChat } = useChatContext();
    return (
        <>

            <div className="card flex justify-between items-center pr-5 md:pr-13 p-3 pt-5 top-0 sticky dark:text-gray-100 dark:bg-gray-800 border-gray-300 border-b w-full h-fit rounded bg-gray-50">

                <div className='leading-3 flex gap-4'>
                    <div className='flex items-center gap-2'>
                        <MdOutlineKeyboardArrowLeft onClick={() => { setCurrentChat(null) }} size={34} className='hover:bg-gray-300 dark:text-gray-100 text-gray-600 cursor-pointer rounded-full' />
                        <div className='w-10 h-10 ring-2 overflow-clip rounded-full ring-orange-400 ring-offset-2'>
                            <img className='w-full h-full object-cover' src={avatar} alt={name} />
                        </div>
                    </div>

                    <div>
                        <p className='text-md my-1 font-semibold'>{name}</p>
                        <div className='flex items-baseline gap-0.5 leading-none'>

                            {
                                isTyping ? (
                                    <>
                                        <p className='align-middle text-xs font-mono text-green-400'> typing...</p>
                                    </>
                                ) :
                                    isOnline ? (
                                        <>
                                            <div className='w-2 h-2 ring-white bg-green-400 rounded-full bottom-0.5 right-0'></div>
                                            <p className='align-middle text-xs dark:text-gray-100'> online</p>
                                        </>
                                    ) : null
                            }
                        </div>
                    </div>
                </div>
                {
                    currentChat.isGroupChat &&
                    <button onClick={() => setIsChatInfoModalOpen(true)} className='dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 text-gray-500 bg-gray-200 hover:bg-gray-300 cursor-pointer px-4.5 py-1.5 flex  rounded-4xl'>
                        <GrContactInfo className='text-xl ' />
                    </button>
                }
            </div>
        </>
    )
}
