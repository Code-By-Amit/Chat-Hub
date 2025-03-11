import React, { useState } from 'react'
import { SlidingButton } from '../components/UI/SlidingButton'
import { MdOutlineTimer } from "react-icons/md";
import { BsFillSendPlusFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authUser } from '../context/authUser';
import { acceptRequest, declineRequest, fetchIncommingRequest } from '../apis/chatApis';
import toast from 'react-hot-toast';

export const FriendRequest = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [active, setActive] = useState('Incomming')
  const [search, setSearch] = useState('')
  const { user } = authUser()
  const queryClient = useQueryClient()

  const { data: incommingRequests, isLoading } = useQuery({
    queryKey: ['IncommingRequest', user?._id],
    queryFn: () => fetchIncommingRequest(token),
    enabled: !!token && !!user?._id
  })

  const acceptRequestMutation = useMutation({
    mutationKey: ['acceptRequest'],
    mutationFn: (reqId) => acceptRequest(reqId, token),
    onMutate: () => {
      const toastId = toast.loading("Processing Action....")
      return { toastId }
    },
    onSuccess: (data, variable, context) => {
      toast.dismiss(context.toastId);
      toast.success(data.message);
      queryClient.invalidateQueries(['userFriends'])
    },
    onError: (error, _, context) => {
      toast.dismiss(context.toastId)
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message)
      }
    }
  })

  const declineRequestMutation = useMutation({
    mutationKey: ['declineRequest'],
    mutationFn: (reqId) => declineRequest(reqId, token),
    onMutate: () => {
      const toastId = toast.loading("Processing Action....")
      return { toastId }
    },
    onSuccess: (data, variable, context) => {
      toast.dismiss(context.toastId);
      toast.success(data.message);
      queryClient.invalidateQueries(['userFriends'])
    },
    onError: (error, _, context) => {
      toast.dismiss(context.toastId)
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message)
      }
    }
  })

  if (isLoading) return <div>Loaing requests...</div>
  console.log(incommingRequests)

  return (
    <div className='bg-white h-full w-full dark:bg-gray-900 p-8'>
      <div className='relative w-full'>
        <div className="serarch flex h-12  overflow-hidden rounded-lg items-center">
          <input type="text" className='w-full h-full px-4 py-3 border-none outline-none dark:bg-gray-600 dark:text-gray-100 bg-gray-100' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Find a Friend....' />
          <button className=' px-5 py-1 h-full text-white font-semibold bg-orange-400'>Search</button>
        </div>
        {
          search.length !== 0 &&
          <div className='flex flex-col w-full mt-2  space-y-1.5 left-0'>
            <h4 className='text-2xl font-semibold mt-4 my-3 dark:text-gray-100'>Search Results...</h4>
            <div className='w-full border border-gray-300 mb-8'></div>
            <ProfileBars name="Amit Saini" avatar="https://avatar.iran.liara.run/public/boy?username=Amit" card="SendRequest" />
            <ProfileBars name="Amit Saini" avatar="https://avatar.iran.liara.run/public/boy?username=Amit" card="SendRequest" />
            <ProfileBars name="Amit Saini" avatar="https://avatar.iran.liara.run/public/boy?username=Amit" card="SendRequest" />
          </div>
        }
      </div>
      {search.length === 0 &&
        <>
          <SlidingButton setActive={setActive} active={active} buttons={["Incomming", "Outgoing"]} />
          <div className='w-full border border-gray-300 my-5'></div>
          <div className="cards p-2">
            {
              incommingRequests?.message ?
                <div className='dark:text-gray-50 text-2xl text-gray-700 font-semibold'>{incommingRequests.message}</div>
                :
                incommingRequests?.map(request => {
                  return <ProfileBars
                    id={request._id}
                    name={request.from.fullName}
                    declineRequestMutation={declineRequestMutation}
                    acceptRequestMutation={acceptRequestMutation}
                    avatar={request.from.avatar}
                    card="Incomming" />
                })
            }
          </div>
        </>
      }

    </div>
  )
}

const ProfileBars = ({ id, name, avatar, card, acceptRequestMutation, declineRequestMutation }) => {
  return (
    <div key={id} className="card bg-gray-50 dark:bg-gray-600 rounded-md p-4 flex items-center justify-between">
      <div className="flex gap-3">
        <div className="w-10 h-10 ring-2 ring-orange-400 ring-offset-2 overflow-hidden rounded-full">
          <img className="w-full h-full object-contain" src={avatar} alt={name} />
        </div>
        <div>
          <h5 className="font-semibold dark:text-gray-50">{name}</h5>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {card === "Incomming" ? (
          <>
            <button onClick={() => {
              acceptRequestMutation.mutate(id)
            }} className="px-4 py-1 border-none outline-none bg-orange-400 text-white rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
              Accept
            </button>
            <button onClick={() => {
              declineRequestMutation.mutate(id)
            }} className="px-4 py-1 border-none outline-none bg-gray-200 text-gray-600 rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
              Reject
            </button>
          </>
        ) : card === "Outgoing" ? (
          <div className='p-2 bg-orange-400 font-semibold text-white rounded flex items-center gap-2 leading-none'>
            Pending
            <MdOutlineTimer size={26} />
          </div>
        ) : card === "SendRequest" ? (
          <button className="px-4 flex items-center gap-2 leading-none py-2 font-semibold border-none outline-none bg-orange-400 text-white rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
            Send <BsFillSendPlusFill />
          </button>
        ) : null}
      </div>
    </div>
  );
};

