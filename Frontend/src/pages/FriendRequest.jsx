import React, { useState } from 'react'
import { SlidingButton } from '../components/UI/SlidingButton'
import { MdOutlineTimer } from "react-icons/md";
import { BsFillSendPlusFill } from "react-icons/bs";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authUser } from '../context/authUser';
import { acceptGroupInvitation, acceptRequest, declineRequest, fetchIncommingRequest, fetchOutgoingRequest, sendFriendRequest } from '../apis/chatApis';
import toast from 'react-hot-toast';
import { searchUserApi } from '../apis/user';
import { useDebounce } from '../hooks/debounce';

export const FriendRequest = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || null)
  const [active, setActive] = useState('Incomming')
  const [search, setSearch] = useState('')
  const { user } = authUser()
  const queryClient = useQueryClient()
  const debouncedSearch = useDebounce(search, 500)

  const { data: incommingRequests, isLoading: isLoadingIncommingRequest } = useQuery({
    queryKey: ['IncommingRequest', user?._id],
    queryFn: () => fetchIncommingRequest(token),
    enabled: !!token && !!user?._id
  })

  const { data: outgoingRequests, isLoading: isLoadingOutgoingRequest } = useQuery({
    queryKey: ["outgoingRequest", user?._id],
    queryFn: () => fetchOutgoingRequest(token),
    enabled: !!token && !!user?._id
  })

  const { data: searchedUsers, isLoading: isLoadingSearchUsers } = useQuery({
    queryKey: ['searchUser', debouncedSearch],
    queryFn: () => searchUserApi(debouncedSearch, token),
    enabled: !!token && (debouncedSearch.trim() !== "")
  })

  const acceptRequestMutation = useMutation({
    mutationKey: ['acceptRequest'],
    mutationFn: ({reqId,isForGroup}) =>{
      if(isForGroup) return acceptGroupInvitation(reqId,token)
      else return acceptRequest(reqId, token)
    },
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

  const sendFriendRequestMutation = useMutation({
    mutationKey: ['sendRequest'],
    mutationFn: (reqId) => sendFriendRequest(reqId, token),
    onMutate: () => {
      const toastId = toast.loading("Sending Friend Request....")
      return { toastId }
    },
    onSuccess: (data, variable, context) => {
      toast.dismiss(context.toastId);
      toast.success(data.message);
      queryClient.invalidateQueries(['outgoingRequest'])
    },
    onError: (error, _, context) => {
      toast.dismiss(context.toastId)
      if (error.response?.data?.message) {
        toast.error(error.response?.data?.message)
      }
    }
  })

  return (
    <div className='bg-white h-full w-full dark:bg-gray-900 p-8'>
      <div className='relative w-full'>
        <div className="serarch flex h-12 outline-3 outline-orange-400  overflow-hidden rounded-lg items-center">
          <input type="text" className='w-full h-full px-4 py-3 outline-none border-none dark:bg-gray-600 dark:text-gray-100 bg-gray-100' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Find a Friend....' />
          <button className=' px-5 py-1 h-full text-white font-semibold bg-orange-400'>Search</button>
        </div>
        {
          search.length !== 0 &&
          <div className='flex flex-col w-full mt-2  space-y-1.5 left-0'>
            <h4 className='text-2xl font-semibold mt-4 my-3 dark:text-gray-100'>Search Results...</h4>
            <div className='w-full border border-gray-300 mb-8'></div>
            <div className='flex flex-col gap-3'>
              {
                isLoadingSearchUsers ?
                  (<>
                    <ProfileBarSkeleton card="SendRequest" />
                    <ProfileBarSkeleton card="SendRequest" />
                    <ProfileBarSkeleton card="SendRequest" />
                  </>)
                  :
                  (
                    searchedUsers?.map(searchUser => {
                      return <ProfileBars key={searchUser._id} id={searchUser._id} sendFriendRequestMutation={sendFriendRequestMutation} name={searchUser?.fullName} avatar={searchUser?.avatar} card="SendRequest" />
                    })
                  )
              }
            </div>
          </div>
        }
      </div>
      {search.length === 0 && (
        <>
          {/* Tabs to switch between Incoming & Outgoing */}
          <SlidingButton setActive={setActive} active={active} buttons={["Incomming", "Outgoing"]} />
          <div className='w-full border border-gray-300 my-5'></div>

          <div className="cards p-2 flex flex-col gap-3">
            {active === "Incomming" ? (
              isLoadingIncommingRequest ? (
                <>
                  <ProfileBarSkeleton card="Incomming" />
                  <ProfileBarSkeleton card="Incomming" />
                  <ProfileBarSkeleton card="Incomming" />
                  <ProfileBarSkeleton card="Incomming" />
                </>
              ) : incommingRequests?.message ? (
                <div className='dark:text-gray-50 text-2xl text-gray-700 font-semibold'>
                  {incommingRequests.message}
                </div>
              ) : (
                incommingRequests?.map((request) => (
                  <ProfileBars
                    key={request?._id}
                    id={request?._id}
                    name={request.isForGroup ? request.group.groupName : request?.from.fullName}
                    declineRequestMutation={declineRequestMutation}
                    acceptRequestMutation={acceptRequestMutation}
                    avatar={request?.isForGroup ? request?.group?.groupAvatar: request?.from?.avatar}
                    invitedBy={request?.from?.fullName}
                    isForGroup={request?.isForGroup}
                    card="Incomming"
                  />
                ))
              )
            ) : active === "Outgoing" ? (
              isLoadingOutgoingRequest ? (
                <>
                  <ProfileBarSkeleton card="Outgoing" />
                  <ProfileBarSkeleton card="Outgoing" />
                  <ProfileBarSkeleton card="Outgoing" />
                  <ProfileBarSkeleton card="Outgoing" />
                </>
              ) : outgoingRequests?.message ? (
                <div className='dark:text-gray-50 text-2xl text-gray-700 font-semibold'>
                  {outgoingRequests.message}
                </div>
              ) : (
                outgoingRequests?.map((request) => (
                  < ProfileBars
                    key={request?._id}
                    id={request?._id}
                    name={request?.to?.fullName}
                    avatar={request?.to?.avatar}
                    card="Outgoing"
                  />
                ))
              )
            ) : null}
          </div>
        </>
      )}
    </div>
  )
}

const ProfileBars = ({ id, name, avatar, card, acceptRequestMutation, declineRequestMutation, sendFriendRequestMutation, invitedBy ,isForGroup}) => {
  return (
    <div key={id} className="card bg-gray-50 dark:bg-gray-600 rounded-md p-4 flex items-center justify-between">
      <div className="flex gap-4">
        <div className="w-10 h-10 ring-2 ring-orange-400 ring-offset-2 overflow-hidden rounded-full">
          <img className="w-full h-full object-cover" src={avatar} alt={name} />
        </div>
        <div className='leading-5'>
          <h5 className="font-semibold dark:text-gray-50">{name}</h5>
          { isForGroup && <span className='text-sm text-gray-800 dark:text-gray-200'>- Invited by {invitedBy}</span>}
          {(card === "Incomming" && !isForGroup) &&  <span className='text-sm text-gray-800 dark:text-gray-200'>- sent you a friend request</span>}
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {card === "Incomming" ? (
          <>
            <button onClick={() => {
              acceptRequestMutation.mutate({reqId:id,isForGroup})
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
          <button onClick={() => sendFriendRequestMutation.mutate(id)} className="px-4 flex items-center gap-2 leading-none py-2 font-semibold border-none outline-none bg-orange-400 text-white rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
            Send <BsFillSendPlusFill />
          </button>
        ) : null}
      </div>
    </div>
  );
};

const ProfileBarSkeleton = ({ card }) => {
  return (
    <div className="card bg-gray-200 dark:bg-gray-700 rounded-md p-4 flex items-center justify-between animate-pulse">
      <div className="flex gap-3">

        <div className="w-10 h-10 rounded-full dark:bg-gray-500 bg-gray-300"></div>

        <div className="w-24 h-4 bg-gray-300 dark:bg-gray-500 rounded"></div>
      </div>

      {/* Buttons Skeleton */}
      <div className="flex gap-2 items-center">
        {card === "Incomming" ? (
          <>
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-500 rounded-2xl"></div>
            <div className="w-20 h-8 bg-gray-300 dark:bg-gray-500 rounded-2xl"></div>
          </>
        ) : card === "Outgoing" ? (
          <div className="w-9 h-9 bg-gray-300 dark:bg-gray-500 rounded-lg"></div>
        ) : card === "SendRequest" ? (
          <div className="w-20 h-8 bg-gray-300 dark:bg-gray-500 rounded-2xl"></div>
        ) : null}
      </div>
    </div>
  );
};
