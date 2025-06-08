import React, { useEffect, useState } from 'react'
import { useChatContext } from '../../context/chatContext'
import { FiUserPlus } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { useDebounce } from '../../hooks/debounce';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { searchUserApi, unFriendfriendApi } from '../../apis/user';
import { inviteToGroup, leaveGroupApi } from '../../apis/chatApis';
import { authUser } from '../../context/authUser';
import { useSocketContext } from '../../context/useSocketContext';

export const ChatInfoModal = ({ setIsChatInfoModalOpen }) => {
  const { currentChat } = useChatContext();
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)
  const debouncedSearch = useDebounce(search, 500)
  let isGroupChat = currentChat?.isGroupChat
  const token = localStorage.getItem('token')
  const {onlineUsers} = useSocketContext()
  const {user} = authUser();
  useEffect(() => {
    setSearch("")
    setIsOpen(false)
    setIsInviteOpen(false)
  }, [])

  const { data: searchedUsers, isLoading: isLoadingSearchUsers } = useQuery({
    queryKey: ['searchUser', debouncedSearch],
    queryFn: () => searchUserApi(debouncedSearch, token),
    enabled: !!token && (debouncedSearch.trim() !== "")
  })

  return (
    <>
      <div className={`h-full z-50 w-[75%] md:w-[38%] absolute right-0 md:right-2 rounded-sm max-h-[98vh] bg-gray-100 dark:bg-gray-700 shadow-2xl `}>
        <div onClick={() => setIsChatInfoModalOpen(false)

        } className='absolute right-3 top-4 dark:bg-gray-800 dark:hover:bg-gray-600 rounded-full dark:text-white cursor-pointer items-center p-1.5'>
          <RxCross2 size={34} />
        </div>
        <div className='w-full flex flex-col justify-center px-7 items-center mt-20'>

          {/* Avatar Image  */}
          <div className='rounded-full overflow-clip hover:scale-105 transition-all duration-300 shadow-2xl w-33 h-33 ring-4 ring-orange-400 ring-offset-4'>
            <img className='w-full h-full object-cover' src={currentChat?.avatar || currentChat?.groupAvatar} alt="" />
          </div>


          {/* Name & bio */}
          <div className='text-center px-10 '>
            <p className='text-gray-900 dark:text-gray-100 text-2xl font-semibold mt-2 underline underline-offset-3'>{currentChat?.groupName || currentChat?.fullName}</p>
          </div>

          {/* Button  */}
          <div className='dark:text-white flex gap-4 mt-4 mb-8'>
            {( currentChat?.groupAdmin == user?._id || currentChat?.isMembersCanInvite) && <button onClick={() => setIsInviteOpen(!isInviteOpen)} className='dark:bg-gray-800 dark:text-white dark:hover:bg-gray-600 text-gray-600 bg-gray-200 hover:bg-gray-300 cursor-pointer px-6 py-2 flex  rounded-4xl'>
              {isInviteOpen ? <RxCross2 size={25} /> : <FiUserPlus size={25} />}
            </button>}
            <button onClick={() => setIsOpen(true)} className='dark:bg-gray-800 flex  justify-center items-center gap-2 dark:text-white dark:hover:bg-gray-600 text-black bg-gray-200 hover:bg-gray-300 cursor-pointer px-6 py-2 rounded-4xl'>
              <LuLogOut size={25} className='text-red-500' />
            </button>
          </div>
          {
            isInviteOpen &&
            <div className="serarch flex h-10 mb-4 w-full outline-3 outline-orange-400  overflow-hidden rounded-lg items-center">
              <input type="text" className='w-full h-full px-4 py-1 outline-none border-none dark:bg-gray-600 dark:text-gray-100 bg-gray-100' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Invite a Friend....' />
              <button className=' px-5 h-full text-white font-semibold bg-orange-400'>Search</button>
            </div>
          }


          <div className='flex flex-col w-full h-72 p-2 gap-2 overflow-y-auto custom-scrollbar'>
            {!isInviteOpen && isGroupChat &&
              currentChat.members.map(member => <Member key={member?._id} member={member} adminId={currentChat.groupAdmin} isOnline={onlineUsers.includes(member._id)} />)
            }
            {
              isInviteOpen && searchedUsers && searchedUsers.map(user => {
                return <Member key={user?._id} member={user} isforInvitaition={true} />
              })
            }

          </div>
        </div>
      </div>
      {isOpen && <LeaveRemoveModal onClose={() => setIsOpen(false)} setIsChatInfoModalOpen={setIsChatInfoModalOpen} />}
    </>
  )
}


const LeaveRemoveModal = ({ onClose,setIsChatInfoModalOpen }) => {
  const { currentChat, setCurrentChat } = useChatContext();
  const token = localStorage.getItem('token')
  const queryClient = useQueryClient()

  const leaveGroupMutation = useMutation({
    mutationKey: ['leaveGroup'],
    mutationFn: () => leaveGroupApi(currentChat?._id, token),
    onMutate: () => {
      const toastId = toast.loading('Processing...');
      return { toastId };
    },
    onSuccess: (data, _, context) => {
      toast.success(data.message, { id: context.toastId })
      setCurrentChat(null)
      onClose()
      queryClient.invalidateQueries(['userGroups'])
      setIsChatInfoModalOpen(false)
    },
    onError: (error, _, context) => {
      console.log(error)
      toast.error(error?.response?.data?.message || 'Something went wrong', { id: context.toastId });
    }
  })

  return (
    <div className="fixed inset-0 flex justify-center items-center dark:bg-white/15 bg-black/15 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-fit text-center">
        <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
        <p className="text-gray-600 mt-2">Do you really want to Leave this Group</p>
        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => {
              leaveGroupMutation.mutate()
            }}
            className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-red-600" >
            Yes, Leave
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 cursor-pointer text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400" >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const Member = ({ member, adminId, isforInvitaition , isOnline}) => {
  const { currentChat } = useChatContext()
  let token = localStorage.getItem('token')
  const inviteMemberMutation = useMutation({
    mutationKey: ['inviteMember'],
    mutationFn: (data) => inviteToGroup(data, token),
    onSuccess: (data) => {
      toast.success(data.message)
    }
  })


  return (
    <div className="card w-full flex p-3 pr-6 justify-between items-center rounded dark:bg-gray-600 dark:hover:bg-gray-500 bg-gray-200">
      <div className='flex gap-2'>
        <div className='relative'>
          <div className='w-10 h-10 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2'>
            <img className='w-full h-full object-cover' src={member.avatar} alt={member.fullName} />
          </div>
           {isOnline && (<span className="absolute w-2 h-2 bg-green-500 ring-2 ring-white bottom-0.5 right-0 rounded-full" />)}
        </div>
        <div>
          <p className='text-md font-semibold dark:text-gray-50'>{member.fullName}</p>
          {adminId == member._id && <p className='text-green-400 text-xs font-mono'>*Admin</p>}
        </div>
      </div>

      {
        isforInvitaition &&
        <div>
          <button onClick={() => inviteMemberMutation.mutate({ userId: member._id, groupId: currentChat._id })} className="px-4 flex items-center gap-2 leading-none py-1 font-semibold border-none outline-none bg-orange-400 text-white rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
            <FiUserPlus size={25} />
          </button>
        </div>
      }
    </div>
  )
}