import React, { use, useState } from 'react'
import { SlidingButton } from '../../components/UI/SlidingButton';
import { ChatUserCard } from '../../components/UI/ChatUserCard';
import { useQuery } from '@tanstack/react-query';
import { fetchUserFriends } from '../../apis/user';
import { useSocketContext } from '../../context/useSocketContext';
import { Link } from 'react-router-dom';

export const FriendListPannel = ({ setCurrentChatUser }) => {
    const [active, setActive] = useState('Personals')
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const { onlineUsers,typingStatus } = useSocketContext()

    const { data, error, isLoading } = useQuery({
        queryKey: ['userFriends'],
        queryFn: () => fetchUserFriends(token),
        enabled: !!token
    })


    return (
        <>
            <div className='flex-1 md:max-w-96 my-2 ml-2 bg-white relative dark:bg-gray-800 rounded'>
                <div className='p-4 '>
                    <h1 className='text-3xl mt-5 font-bold dark:text-white'>Chats</h1>
                    <SlidingButton setActive={setActive} active={active} buttons={["Personals", "Groups"]} />
                    <div className='w-full border border-gray-200 my-4'></div>

                    <div className="profileCard flex  flex-col gap-2 p-2 max-h-100 md:max-h-144 overflow-y-auto custom-scrollbar ">
                        {/* <ChatUserCard avatar="https://avatar.iran.liara.run/public/boy?username=amit" name="Amit Saini" isOnline /> */}
                        {
                            active === "Personals" ?
                                (isLoading ?
                                    <>
                                        <ChatUserSkeleton />
                                        <ChatUserSkeleton />
                                        <ChatUserSkeleton />
                                        <ChatUserSkeleton />
                                        <ChatUserSkeleton />
                                    </>
                                    : data?.friends?.length === 0 ? (
                                        <div className='w-full'>
                                            <Link to="friendrequest" className='w-full inline-block text-center font-semibold cursor-pointer text-white bg-orange-400 rounded py-2'>New Chat</Link>
                                        </div>
                                    ) :
                                    (
                                    data?.friends?.map((friend, i) => {
                                        const isOnline = onlineUsers?.includes(friend?._id)
                                        const isTyping = typingStatus.includes(friend?._id)
                                        return <ChatUserCard key={i} setCurrentChatUser={setCurrentChatUser} friend={friend} isOnline={isOnline} isTyping={isTyping} />
                                    }))
                                )
                                : active === "Groups" ?
                                    (
                                        <div className='w-full h-full flex justify-center items-center'>
                                          <p className='text-2xl font-bold dark:text-gray-100'> Comming Soon</p> 
                                        </div>
                                    )
                                    : null
                        }
                    </div>
                </div>
            </div>
        </>
    )
}


const ChatUserSkeleton = () => {
    return (
        <div className="card flex gap-2 p-3 rounded dark:bg-gray-700 bg-gray-200 animate-pulse">
            {/* Profile Picture Skeleton */}
            <div className='relative'>
                <div className='w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-500'></div>
            </div>

            {/* User Info Skeleton */}
            <div className='flex flex-col justify-center'>
                <div className='w-32 h-4 bg-gray-300 dark:bg-gray-500 rounded'></div>
            </div>
        </div>
    );
};
