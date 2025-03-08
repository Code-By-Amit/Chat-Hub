import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { BiSolidCheckShield } from "react-icons/bi";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";

export const Signup = () => {
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isConfPassVisible, setIsConfPassVisible] = useState(false)

    return (
        <div className='w-full h-screen flex justify-center items-center relative overflow-clip bg-gray-100'>


            <div className='w-100 h-100 lg:w-150 lg:h-150 bg-orange-400 rounded-full z-0 -left-70 -top-30 lg:-left-100 lg:-top-44 absolute'></div>
            <div className='w-100 h-100 lg:w-150 lg:h-150 bg-orange-400 rounded-full z-0 -right-60 -bottom-20 lg:-right-100 lg:-bottom-44 absolute'></div>

            <div className='lg:w-[60vw] lg:min-h-120 z-10 shadow-2xl rounded-2xl overflow-clip m-auto flex bg-white'>
                <div className="left lg:w-1/2 hidden lg:flex justify-center items-center bg-amber-200">
                    <img className='w-[95%]' src="./illustration-6.png" alt="" />
                </div>
                <div className="right lg:w-1/2 w-80 md:w-96">
                    <div className='w-full h-full p-5 text-gray-900 flex flex-col justify-center items-center'>
                        <h1 className='text-2xl my-3 font-bold mb-11 text-left text-gray-900'>Signup</h1>
                        <form className='flex flex-col gap-3 lg:w-[70%]'>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <CiEdit />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" id="username" placeholder='Full Name' />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <FaUser className='text-sm' />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" id="username" placeholder='Username' />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <MdOutlinePassword />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isPassVisible ? "text" : "password"} id='password' placeholder='Password' />
                                <div onClick={() => setIsPassVisible(!isPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <div className=' flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <BiSolidCheckShield />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isConfPassVisible ? "text" : "password"} id='confPassword' placeholder='Confirm Password' />
                                <div onClick={() => setIsConfPassVisible(!isConfPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isConfPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <button className='w-48 mx-auto block bg-orange-400 cursor-pointer hover:opacity-85 text-white font-semibold py-1 my-5  rounded-2xl'>Sign Up</button>
                        </form>
                        <p className='text-sm'>Already have an Account? <Link to="/" className='text-blue-700'>Log in</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}
