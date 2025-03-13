import React, { useEffect, useState } from 'react'
import { BiSolidCheckShield } from 'react-icons/bi'
import { CiEdit } from 'react-icons/ci'
import { LuEye, LuEyeClosed } from 'react-icons/lu'
import { MdOutlinePassword } from 'react-icons/md'
import { authUser } from '../context/authUser'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { editUserProfileApi } from '../apis/user'
import toast from 'react-hot-toast'
import { IoArrowBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'

export const ProfileEdit = () => {
    const [isPassVisible, setIsPassVisible] = useState(false)
    const [isConfPassVisible, setIsConfPassVisible] = useState(false)
    const [formData, setFormData] = useState({ username: "", currentPassword: "", fullName: "", newPassword: "", bio: "" })
    const { user } = authUser()
    const [token, setToken] = useState(localStorage.getItem('token') || null)
    const queryClient = useQueryClient()
    const navigate = useNavigate()

    const [errors, setErrors] = useState([])

    const [avatar, setAvatar] = useState()
    const [previewAvatar, setPreviewAvatar] = useState('')

    useEffect(() => {
        if (user) {
            setFormData(prev => ({
                ...prev,
                username: user?.username || "",
                fullName: user?.fullName || "",
                bio: user?.bio || "",
            }))
            setAvatar(user?.avatar)
        }
    }, [user])

    const handleChange = (e) => {
        const { value, name } = e.target;

        setFormData((prev) => (
            {
                ...prev,
                [name]: value
            }
        ))
    }

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const UrlObj = URL.createObjectURL(file)
            if (previewAvatar) {
                URL.revokeObjectURL(previewAvatar)
                setPreviewAvatar(null)
            }
            setPreviewAvatar(UrlObj)
            setAvatar(file)
        }
    };

    const handleCanceleUpload = () => {
        if (previewAvatar) {
            URL.revokeObjectURL(previewAvatar)
            setPreviewAvatar(null)
            setAvatar(user?.avatar)
        }
    }

    const profileEditMutation = useMutation({
        mutationKey: ['profileUpdate'],
        mutationFn: (data) => editUserProfileApi(data, token),
        onMutate: () => {
            const toastId = toast.loading("Updating Profile....")
            return { toastId }
        },
        onSuccess: (data, variable, context) => {
            toast.dismiss(context.toastId);
            toast.success(data.message);
            queryClient.invalidateQueries(['authUser'])
        },
        onError: (error, _, context) => {
            toast.dismiss(context.toastId)
            if (error.response?.data?.message) {
                toast.error(error.response?.data?.message)
            }
            if (Array.isArray(error.response.data.errors)) {
                error.response.data.errors.map(error => {
                    toast.error(error.message)
                })
            }
        }
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()

        const profileData = new FormData()

        profileData.append('fullName', user.fullName !== formData.fullName ? formData.fullName : "")
        profileData.append('username', user.username !== formData.username ? formData.username : "")
        profileData.append('bio', user.bio !== formData.bio ? formData.bio : "")
        profileData.append('currentPassword', formData.currentPassword || "")
        profileData.append('newPassword', formData.newPassword || "")
        if (avatar instanceof File) {
            profileData.append('avatar', avatar)
        }
        profileEditMutation.mutate(profileData)
    }

    return (
        <div className='w-full relative bg-gray-100 flex dark:bg-gray-900 justify-center items-center h-full'>
            <div onClick={()=>navigate(-1)} className='absolute top-10 text-gray-800 dark:text-gray-100 bg-gray-300 dark:bg-gray-500 hover:opacity-70 p-2 rounded-full left-10'>
                <IoArrowBackOutline size={30} />
                </div>
            <div className=''>
                <h1 className='text-2xl text-gray-800 font-semibold dark:text-gray-50 text-center mb-3'>Edit Profile</h1>
                <div className='bg-white p-5 flex dark:bg-gray-700 '>
                    <div className='m-4 w-40 flex justify-start items-center flex-col'>
                        <img className='h-25 w-25 rounded-full mb-2 shadow-2xl' src={previewAvatar ? previewAvatar : avatar} alt="Profile" />
                        {previewAvatar ? <button onClick={handleCanceleUpload} className="cursor-pointer bg-slate-200 font-semibold px-4 py-2 my-4 rounded-lg w-full text-center" > Cancel </button>
                            : <label htmlFor="file-upload" className="cursor-pointer bg-slate-200 font-semibold px-3 py-1 my-4 rounded-lg w-full text-center" > Upload </label>}
                        <input id='file-upload' type="file" className="hidden" name="avatar" onChange={handleFileChange} />
                    </div>

                    <div className='w-96'>
                        <form onSubmit={handleFormSubmit} >
                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <CiEdit />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder='Full Name' />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <CiEdit />
                                <input className='w-full bg-gray-100 rounded outline-none' type="text" name="username" value={formData.username} onChange={handleChange} placeholder="Username" />
                            </div>

                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <MdOutlinePassword />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isPassVisible ? "text" : "password"} name='currentPassword' value={formData.currentPassword} onChange={handleChange} placeholder='Current Password' />
                                <div onClick={() => setIsPassVisible(!isPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>
                            <div className='mb-2 flex justify-center gap-2 rounded px-3 py-2 items-center bg-gray-100'>
                                <BiSolidCheckShield />
                                <input className='w-full bg-gray-100 rounded outline-none' type={isConfPassVisible ? "text" : "password"} value={formData.newPassword} onChange={handleChange} name='newPassword' placeholder='New Password' />
                                <div onClick={() => setIsConfPassVisible(!isConfPassVisible)} className='transition duration-300 ease-in-out cursor-pointer'>
                                    {isConfPassVisible ? <LuEye /> : <LuEyeClosed />}
                                </div>
                            </div>

                            <div className=' flex gap-2 rounded p-3 items-start bg-gray-100'>
                                <CiEdit />
                                <textarea className='w-full min-h-24 bg-gray-100 rounded outline-none' name='bio' value={formData.bio} onChange={handleChange} placeholder='Start Writing Bio....'></textarea>
                            </div>


                            <button className=' w-full mx-auto block bg-orange-400 cursor-pointer hover:opacity-85 text-white font-semibold py-1 mt-5 rounded'>Edit</button>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    )
}
