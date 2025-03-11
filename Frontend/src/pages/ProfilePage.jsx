import React from 'react'
import { FaRegEdit } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { authUser } from '../context/authUser';

export const ProfilePage = () => {
  const {user} = authUser()

  return (
    <div className='w-full bg-gray-100 flex dark:bg-gray-900 justify-center items-center h-full'>

    <div>
      <div className='bg-white rounded-md dark:bg-gray-600 p-4 flex flex-col dark:shadow-black shadow-2xl justify-center pt-15 items-center  min-w-97 relative'>
        <div className='w-30 h-30 absolute -top-18 overflow-hidden right-33 ring-3 ring-orange-400 ring-offset-2 rounded-full'>
          <img className='w-full h-full object-cover' src={user?.avatar} alt="" />
        </div>
        <div className='text-center'>
          <h1 className='text-xl font-semibold dark:text-gray-50 text-gray-800'>{user?.fullName}</h1>
          <h5 className='text-gray-500 dark:text-gray-100'>@{user?.username}</h5>
          <p className='text-gray-700 my-4 px-4 dark:text-gray-100'>{user?.bio}</p>
        </div>
      </div>
      <div className='w-full flex justify-end px-2'>
      <Link to="edit" className='outline-none border-none cursor-pointer self-end px-4.5 py-1 bg-orange-500 flex justify-center items-center gap-2 text-white rounded my-3'>
        <FaRegEdit /> Edit
        </Link>
      </div>
    </div>


    </div>
  )
}
