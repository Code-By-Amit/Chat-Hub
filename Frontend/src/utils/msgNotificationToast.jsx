import toast from "react-hot-toast"
import { useChatContext } from "../context/chatContext"

export const msgNotification = (newMessage, message, handleReplyClick, isGroupChat = false) => {
    const avatar = isGroupChat ? newMessage.chatId.groupAvatar : newMessage.sender.avatar 
    const senderName = isGroupChat ? newMessage.chatId.groupName : newMessage.sender.fullName 
    const msg = newMessage.image ? "Image" : message
    toast.custom((t) => (
        <div
            className={`${t.visible ? 'animate-enter' : 'animate-leave'
                } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-300 ring-opacity-5`}
        >
            <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                        <img
                            className="h-10 w-10 rounded-full"
                            src={avatar}
                            alt=""
                        />
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {senderName}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                            {msg}
                        </p>
                    </div>
                </div>
            </div>
            <div className="flex border-l border-gray-200">
                <button
                    onClick={() => {
                        toast.dismiss(t.id);
                        handleReplyClick()
                    }}
                    className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer "
                >
                    Reply
                </button>
            </div>
        </div>
    ))
}
