import React, { useEffect, useState } from 'react'
import { SlidingButton } from '../../components/UI/SlidingButton';
import { ChatUserCard } from '../../components/UI/ChatUserCard';
import { useQuery } from '@tanstack/react-query';
import { fetchUserFriends } from '../../apis/user';
import { useSocketContext } from '../../context/useSocketContext';
import { Link } from 'react-router-dom';
import { MdLockOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { CreateGroupModal } from '../../components/CreateGroupModal';
import { getUserGroupApi } from '../../apis/chatApis';
import { GroupChatCard } from '../../components/UI/GroupChatCard';




export const FriendAndGroupListPannel = () => {
    const [active, setActive] = useState('Personals')
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const { onlineUsers, typingStatus } = useSocketContext()
    const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);


    const { data:friends, isLoading:isFriendsLoading } = useQuery({
        queryKey: ['userFriends'],
        queryFn: () => fetchUserFriends(token),
        enabled: !!token
    })

    const { data:groups, isLoading:isGroupLoading } = useQuery({
        queryKey: ['userGroups'],
        queryFn: () => getUserGroupApi(token),
        enabled: !!token
    })

    return (
        <>
            <div className='ml-2 my-2 flex-1 md:max-w-96 bg-white relative dark:bg-gray-800 rounded'>
                <div className='p-4 '>
                    <h1 className='text-3xl mt-5 font-bold dark:text-white'>Chats</h1>
                        <SlidingButton setActive={setActive} active={active} buttons={["Personals", "Groups"]} />
                    <div className='w-full border border-gray-200 my-4'></div>

                    <div className="profileCard flex  flex-col gap-2 p-2 max-h-100 md:max-h-144 overflow-y-auto custom-scrollbar ">
                        {/* <ChatUserCard avatar="https://avatar.iran.liara.run/public/boy?username=amit" name="Amit Saini" isOnline /> */}
                        {
                            active === "Personals" ?
                                (isFriendsLoading ? <RenderSkeletons />

                                    : friends?.length === 0 ? (
                                        <div className='w-full'>
                                            <Link to="friendrequest" className='w-full inline-block text-center font-semibold cursor-pointer text-white bg-orange-400 rounded py-2'>New Chat</Link>
                                        </div>
                                    ) :
                                        (
                                            friends?.map((friend) => {
                                                const isOnline = onlineUsers?.includes(friend?._id)
                                                const isTyping = typingStatus.includes(friend?._id)
                                                return <ChatUserCard key={friend._id} friend={friend} isOnline={isOnline} isTyping={isTyping} />
                                            }))
                                )
                                : active === "Groups" ?
                                    (isGroupLoading ? <RenderSkeletons />
                                        : groups?.length === 0 ? (
                                            <div className='w-full text-center mt-5'>
                                                <p className='text-2xl font-bold dark:text-gray-100'> Create or Join Group</p>
                                            </div>)
                                            :
                                            (groups.map((group) => {
                                                return <GroupChatCard key={group._id} group={group} />
                                            }))
                                    )
                                    : null
                        }
                        {active === 'Groups' && <button onClick={() => setIsCreateGroupOpen(true)} className='px-3 py-1.5 cursor-pointer absolute bottom-9 hover:shadow-2xl right-7 gap-1 hover:scale-105 text-white flex justify-center items-center transition-all duration-300 rounded-full bg-orange-400'>
                            <FiPlus className="w-6 h-6 hover:scale-105 " /> <p className='font-semibold pr-1 pt-0.5 pb-0.5'>Create</p>
                        </button>}
                    </div>
                    <div className='text-center flex justify-center dark:text-slate-100 text-slate-600 font-semibold my-4 font-mono text-xs whitespace-break-spaces'>
                        <MdLockOutline />
                        <div>
                            <p>   Your Personal messages are </p>
                            <p className='text-orange-400'>end-to-end encrypted</p>
                        </div>
                    </div>
                </div>
            </div>
            {isCreateGroupOpen && <CreateGroupModal setIsCreateGroupOpen={setIsCreateGroupOpen} />}
        </>                   
    )
}

const RenderSkeletons = () => {
    return (

        <>
            <ChatUserSkeleton />
            <ChatUserSkeleton />
            <ChatUserSkeleton />
            <ChatUserSkeleton />
            <ChatUserSkeleton />
        </>
    )

}

//  <button onClick={() => setIsCreateGroupOpen(true)} className='px-3 py-1.5 cursor-pointer absolute bottom-9 hover:shadow-2xl right-7 gap-1 hover:scale-105 text-white flex justify-center items-center transition-all duration-300 rounded-full bg-orange-400'>
//                                                 <FiPlus className="w-6 h-6 hover:scale-105 " /> <p className='font-semibold pr-1 pt-0.5 pb-0.5'>Create</p>
//                                             </button>


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


