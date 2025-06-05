import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaUser } from "react-icons/fa";
import { MdOutlinePassword } from "react-icons/md";
import { BiSolidCheckShield } from "react-icons/bi";
import { LuEye, LuEyeClosed } from "react-icons/lu";
import { CiEdit } from "react-icons/ci";
import { authUser } from '../context/authUser';
import { encryptPrivateKey, generateRSAKeys } from '../Encryption/rsa';
import { storePrivateKey } from '../utils/indexDb';

export const Signup = () => {
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isConfPassVisible, setIsConfPassVisible] = useState(false)
    const [formData, setFormData] = useState({ username: "", password: "", fullName: "", confPassword: "", gender: "" })
    const [errors, setErrors] = useState([])
    const {setPrivateKey} = authUser();
    const navigate = useNavigate()

    const { signupMutation } = authUser()

    const validate = () => {
        let newErrors = [];

        setErrors([])
        if (formData.fullName.trim() === "") {
            newErrors.push("fullname required")
        }
        if (formData.username.trim() === "") {
            newErrors.push("Username required")
        }
        const usernameRegex = /^[a-z0-9_]{3,15}$/;
        if (!usernameRegex.test(formData.username.trim())) {
            newErrors.push("username should be 3-15 characters, lowercase, and only include a-z, 0-9, and _")
        }
        if (formData.password.trim() === "") {
            newErrors.push("password required")
        }
        if (formData.password.trim().length < 3) {
            newErrors.push("password length must be at least 3 character long")
        }
        if (formData.confPassword.trim() !== formData.password.trim()) {
            newErrors.push("password and confirm password must be same")
        }
        if (formData.gender == "") {
            newErrors.push("Please Select Your Gender")
        }

        setErrors(newErrors)

        return newErrors.length === 0
    }

    const handleSignupFormOnSubmit = (e) => {
        e.preventDefault()

        if (!validate()) return

        const trimmedData = {
            username: formData.username.trim(),
            password: formData.password.trim(),
            fullName: formData.fullName.trim(),
            gender: formData.gender.trim()
        }


        const { publicKey, privateKey } = generateRSAKeys();
        const encryptedPrivateKey = encryptPrivateKey(privateKey, trimmedData.password);
       
        signupMutation.mutate({ ...trimmedData, publicKey, encryptedPrivateKey }, {
            onSuccess: async() => {
                navigate('/chat')
                await storePrivateKey(privateKey);
                setPrivateKey(privateKey);
                setFormData({ username: "", password: "", fullName: "", confPassword: "", gender: "" })
            }
        });
    }

    const handleChange = (e) => {
        const { value, name } = e.target;

        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }


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
                        <form onSubmit={handleSignupFormOnSubmit} className='flex flex-col gap-3 w-[90%] lg:w-[70%]'>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <CiEdit />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" value={formData.fullName} onChange={handleChange} name="fullName" placeholder='Full Name' />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <FaUser className='text-sm' />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" name="username" value={formData.username} onChange={handleChange} placeholder='Username' />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <MdOutlinePassword />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isPassVisible ? "text" : "password"} name='password' value={formData.password} onChange={handleChange} placeholder='Password' />
                                <div onClick={() => setIsPassVisible(!isPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <div className=' flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <BiSolidCheckShield />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isConfPassVisible ? "text" : "password"} value={formData.confPassword} onChange={handleChange} name='confPassword' placeholder='Confirm Password' />
                                <div onClick={() => setIsConfPassVisible(!isConfPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isConfPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <div className=' flex justify-around rounded px-5 py-2 items-center bg-gray-100'>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" name='gender' id='male' value="male" checked={formData.gender == "male"} onChange={handleChange} className='h-4 w-4' />
                                    <label htmlFor="male" className=' text-sm font-medium text-gray-800'>Male</label>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <input type="radio" name='gender' id='female' value="female" checked={formData.gender == "female"} onChange={handleChange} className='h-4 w-4' />
                                    <label htmlFor="female" className='text-sm font-medium text-gray-800'>Female</label>
                                </div>
                            </div>
                            <div className='leading-1'>
                                {
                                    (errors && errors.length !== 0) && errors?.map((err, i) => <p key={i} className='text-xs text-red-600'>*{err}</p>)
                                }
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
