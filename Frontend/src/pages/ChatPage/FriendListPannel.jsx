import React, { use, useState } from 'react'
import { SlidingButton } from '../../components/UI/SlidingButton';
import { ChatUserCard } from '../../components/UI/ChatUserCard';
import { useQuery } from '@tanstack/react-query';
import { fetchUserFriends } from '../../apis/user';

export const FriendListPannel = ({ setCurrentChatUser }) => {
    const [active, setActive] = useState('Personals')
    const [token, setToken] = useState(localStorage.getItem('token') || null)

    const { data, error, isLoading } = useQuery({
        queryKey: ['userFriends'],
        queryFn: () => fetchUserFriends(token),
        enabled: !!token
    })

    if (isLoading) return <div>Loading......</div>
    if (error) return <div>Error While Fetching Data....</div>

    return (
        <>
            <div className='w-full md:w-96 my-2 ml-2 bg-white dark:bg-gray-800 rounded'>
                <div className='p-4'>
                    <h1 className='text-3xl mt-5 font-bold dark:text-white'>Chats</h1>
                    <SlidingButton setActive={setActive} active={active} buttons={["Personals", "Groups"]} />
                    <div className='w-full border border-gray-200 my-4'></div>

                    <div className="profileCard flex flex-col gap-2 p-2 max-h-144 overflow-y-auto custom-scrollbar ">
                        {/* <ChatUserCard avatar="https://avatar.iran.liara.run/public/boy?username=amit" name="Amit Saini" isOnline /> */}
                        {
                            data?.friends?.map((friend, i) => {
                                return <ChatUserCard key={i} setCurrentChatUser={setCurrentChatUser} friend={friend} />
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
