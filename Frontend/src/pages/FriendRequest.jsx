import React, { useState } from 'react'
import { SlidingButton } from '../components/UI/SlidingButton'
import { MdOutlineTimer } from "react-icons/md";
import { BsFillSendPlusFill } from "react-icons/bs";

export const FriendRequest = () => {
  const [active, setActive] = useState('Incomming')
  const [search, setSearch] = useState('')

  return (
    <div className='bg-white h-full w-full p-8'>
      <div className='relative w-full'>
        <div className="serarch flex h-12  overflow-hidden rounded-lg items-center">
          <input type="text" className='w-full h-full px-4 py-3 border-none outline-none bg-gray-100' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Find a Friend....' />
          <button className=' px-5 py-1 h-full text-white font-semibold bg-orange-400'>Search</button>
        </div>
        {
          search.length !== 0 &&
          <div className='flex flex-col w-full mt-2  space-y-1.5 left-0'>
            <h4 className='text-2xl font-semibold mt-4 my-3'>Search Results...</h4>
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
            <ProfileBars name="Amit Saini" avatar="https://avatar.iran.liara.run/public/boy?username=Amit" card="Incomming" />
          </div>
        </>
      }

    </div>
  )
}

const ProfileBars = ({ name, avatar, card }) => {
  return (
    <div className="card bg-gray-50 rounded-md p-4 flex items-center justify-between">
      <div className="flex gap-3">
        <div className="w-10 h-10 ring-2 ring-orange-400 ring-offset-2 overflow-hidden rounded-full">
          <img className="w-full h-full object-contain" src={avatar} alt={name} />
        </div>
        <div>
          <h5 className="font-semibold">{name}</h5>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        {card === "Incomming" ? (
          <>
            <button className="px-4 py-1 border-none outline-none bg-orange-400 text-white rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
              Accept
            </button>
            <button className="px-4 py-1 border-none outline-none bg-gray-200 text-gray-600 rounded-2xl cursor-pointer transition ease-in-out duration-300 hover:scale-105 hover:shadow-xl">
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

