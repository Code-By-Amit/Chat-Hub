import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { authUser } from '../context/authUser';

export const Login = () => {
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [errors, setErrors] = useState([]);

    const { loginMutation } = authUser()
    const navigate = useNavigate()

    const validate = () => {
        let newErrors = [];

        setErrors([])
        if (credentials.username === "") {
            newErrors.push("Username required")
        }
        if (credentials.password === "") {
            newErrors.push("Password required")
        }
        if (credentials.password.length < 3) {
            newErrors.push("Password length must be at least 3 character long")
        }

        setErrors(newErrors)

        return newErrors.length === 0
    }

    const handleLoginFormOnSubmit = (e) => {
        e.preventDefault()

        if (!validate()) return

        loginMutation.mutate(credentials, {
            onSuccess: () => {
                navigate('/chat')
                setCredentials({ username: "", password: "" })
            }
        });
    }

    return (
        <div className='w-full h-screen flex justify-center relative overflow-clip items-center bg-gray-100'>

            <div className='w-100 h-100 lg:w-150 lg:h-150 bg-orange-400 rounded-full z-0 -left-70 -top-30 lg:-left-100 lg:-top-44 absolute'></div>
            <div className='w-100 h-100 lg:w-150 lg:h-150 bg-orange-400 rounded-full z-0 -right-60 -bottom-20 lg:-right-100 lg:-bottom-44 absolute'></div>

            <div className='lg:w-[60vw] lg:min-h-120 z-10 shadow-2xl rounded-2xl overflow-clip m-auto flex bg-white'>

                <div className="left lg:w-1/2 lg:flex justify-center hidden items-center bg-amber-200">
                    <img className='w-full' src="./illustration-2.png" alt="" />
                </div>
                <div className="right lg:w-1/2 w-80 md:w-96">
                    <div className='w-full h-full p-5 flex flex-col justify-center items-center'>
                        <h1 className='text-2xl font-bold my-9 text-left '>Login</h1>
                        <form onSubmit={handleLoginFormOnSubmit} className='flex flex-col gap-3 w-[90%] lg:w-[70%] text-gray-900'>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <FaUser className='text-sm' />
                                <input className='w-full  outline-none' type="text" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} id="username" placeholder='Username' />
                            </div>
                            <div className=' flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <MdOutlinePassword />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isPassVisible ? "text" : "password"} value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} id='password' placeholder='Password' />
                                <div onClick={() => setIsPassVisible(!isPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <div className='leading-1'>
                                {
                                    (errors && errors.length !== 0) && errors?.map(err => <p className='text-xs text-red-600'>*{err}</p>)
                                }
                            </div>
                            <button className='lg:w-48 px-10 mx-auto block bg-orange-400 cursor-pointer hover:opacity-85 mt-2 text-white font-semibold py-1 my-2 mb-7 rounded-2xl'>Login</button>
                        </form>
                        <p className='text-xs lg:text-sm'>Don't have an Account? <Link to="/signup" className='text-blue-700'>Sign Up</Link></p>
                    </div>
                </div>
            </div>
        </div>
    )
}


