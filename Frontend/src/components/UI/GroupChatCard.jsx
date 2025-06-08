import { useChatContext } from "../../context/chatContext"

export const GroupChatCard = ({ group }) => {
    const { setCurrentChat } = useChatContext();

    const { groupAvatar, groupName } = group
    const handleOnclick = () => {
        setCurrentChat(group)
    }

    return (
        <>
            <div onClick={handleOnclick}
                className={`relative card flex gap-3 items-center p-3 rounded-lg cursor-pointer transition-all duration-150 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600`} >
                {/* Group Avatar */}
                <div className="relative">
                    <div className="w-11 h-11 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2">
                        <img className="w-full h-full object-cover" src={groupAvatar} alt={groupName} />
                    </div>
                </div>

                <p className="text-md font-semibold truncate dark:text-gray-50">{groupName}</p>
            </div>
        </>
    )
}