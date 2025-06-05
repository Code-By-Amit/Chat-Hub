import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FaShuffle } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { createGroupApi } from "../apis/chatApis";
import toast from "react-hot-toast";

export const CreateGroupModal = ({ setIsCreateGroupOpen }) => {
    const [groupName, setGroupName] = useState("")
    const [avatar, setAvatar] = useState()
    const [previewAvatar, setPreviewAvatar] = useState('')
    const [membersCanInvite, setMembersCanInvite] = useState(false);
    const queryClient = useQueryClient();

    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length < 3 ? prev + '.' : ''));
        }, 500); // Adjust speed here (500ms for each dot)

        return () => clearInterval(interval);
    }, []);

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

    useEffect(() => {
        handleRandomAvatar();
    }, [])

    const handleRandomAvatar = () => {
        const randomAvatar = [
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506772/people-group-avatar-character-vector-illustration-design_24877-18925_wvfr3y.avif",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/people-group-avatar-character-vector-illustration-design_24877-18939_jz3ux6.avif",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/f3d8e3c4d4f20ca166a57df60258e04e_iqfb5f.jpg",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/learning-concept-illustration_114360-3896_r2veki.avif",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/group-bussiness-people-cartoon-avatar-flat-vector-66290567_qg1ebs.webp",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/guy-happy-with-great-idea-vector-illustration-smart-man_132971-632_l76mx7.avif",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748506773/flat-creativity-concept-illustration_52683-64279_e84e8u.avif",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748507720/group-of-business-people-showing-teamwork-free-vector_ciqnh1.jpg",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748507720/images_lwtywk.jpg",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748507720/b612344115214be72736121878dc90a7_ej6jmm.jpg",
            "https://res.cloudinary.com/dqelb5apq/image/upload/v1748507729/istockphoto-1223631367-612x612_gqv6y6.jpg"
        ]
        const idx = Math.floor(Math.random() * randomAvatar.length);
        console.log(idx)
        setAvatar(randomAvatar[idx]);
    };

    const handleCanceleUpload = () => {
        if (previewAvatar) {
            URL.revokeObjectURL(previewAvatar)
            setPreviewAvatar(null)
            setAvatar(user?.avatar)
            handleRandomAvatar()
        }
    }

    const token = localStorage.getItem('token')
    const createGroupMutation = useMutation({
        mutationKey: ['createGroup'],
        mutationFn: (data) => createGroupApi(data, token),
        onSuccess: (createdGroup) => {
            toast.success("Group Created Sucssfully")
            setIsCreateGroupOpen(false)
            queryClient.setQueryData(["userGroups"], old => [...(old || []), createdGroup])
        }
    })

    const handleFormSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append("groupName", groupName.trim())
        formData.append("groupAvatar", avatar)
        formData.append("membersCanInvite", membersCanInvite)

        createGroupMutation.mutate(formData)
    }
    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/15 dark:bg-white/15">
            <div className="relative max-w-full w-[28rem] z-50 rounded-lg bg-white p-6 pt-4 shadow-lg text-center">

                {/* Close Button */}
                <div className="flex justify-end">
                    <button aria-label="Close Modal" onClick={() => setIsCreateGroupOpen(false)} className="rounded-full p-1 hover:bg-gray-200 transition" >
                        <RxCross2 size={29} />
                    </button>
                </div>

                <h2 className="mb-4 text-xl font-semibold text-gray-900">Create a Group</h2>

                <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center gap-2">
                        <img src={previewAvatar || avatar} alt="Group Avatar" className="mb-2 h-24 w-24 rounded-full object-cover shadow-2xl" />
                        {previewAvatar ? (<button type="button" onClick={handleCanceleUpload} className="w-full rounded-lg bg-slate-200 px-4 py-2 font-semibold hover:bg-slate-300 transition" > Cancel </button>) : (
                            <>
                                <label htmlFor="file-upload" className="w-full cursor-pointer rounded-lg bg-slate-200 px-4 py-2 font-semibold hover:bg-slate-300 transition text-center">  Upload </label>
                                <input id="file-upload" type="file" name="avatar" className="hidden" onChange={handleFileChange} />
                            </>
                        )}

                        <button type="button" onClick={handleRandomAvatar} className=" cursor-pointer flex items-center justify-center gap-2 text-sm text-gray-700 hover:text-black transition" >
                            <FaShuffle className="h-4 w-4" />
                            Generate Random Avatar
                        </button>
                    </div>

                    {/* Group Name Input */}
                    <div className="text-start">
                        <label htmlFor="groupName" className="block text-sm font-medium text-gray-800 mb-1">  Group Name </label>
                        <input type="text" id="groupName" name="groupName" placeholder="group name" onChange={(e) => setGroupName(e.target.value)} required className="w-full rounded-md bg-gray-100 px-4 py-2 outline-none focus:ring-2 focus:ring-amber-400 transition" />
                    </div>


                    {/* Member Invite Toggle */}
                    <div className="text-start px-1">
                        <p className="block text-sm font-medium text-gray-800 mb-1">
                            Allow Members to Invite Others
                        </p >
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" id="membersCanInvite" checked={membersCanInvite} onChange={(e) => setMembersCanInvite(e.target.checked)} className="sr-only peer" />
                                <div
                                    className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-orange-300 
                                                dark:bg-gray-300 peer-checked:bg-orange-400 after:content-[''] after:absolute 
                                                after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 
                                                after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full 
                                                peer-checked:after:border-white"
                                ></div>
                            </label>
                            <span className="text-sm text-gray-600">
                                Enable this to let group members send invites
                            </span>
                        </div>
                    </div>


                    {/* Submit Button */}
                    <button type="submit" className="w-full rounded-full cursor-pointer mt-2 bg-orange-400 px-4 py-2 font-semibold text-white hover:bg-amber-500 transition" >
                        {createGroupMutation.isPending ? <>Creating<span>{dots}</span></> : "Create"}
                    </button>
                </form>
            </div>
        </div>

    );
};