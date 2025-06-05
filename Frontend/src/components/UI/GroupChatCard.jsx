import { useChatContext } from "../../context/chatContext"

export const GroupChatCard = ({ group }) => {
    const { setCurrentChat } = useChatContext();

    const { groupAvatar, groupName } = group
    const handleOnclick = () => {
        setCurrentChat(group)
    }

    return (
        <>
            <div onClick={handleOnclick} className="card flex gap-2 p-3 rounded dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer bg-gray-100">
                <div className='relative'>
                    <div className='w-10 h-10 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2'>
                        <img className='w-full h-full object-cover' src={groupAvatar} alt={groupName} />
                    </div>

                </div>
                <div>
                    <p className='text-md font-semibold dark:text-gray-50'>{groupName}</p>
                    {/* {
            isTyping && <p className='align-middle text-xs font-mono text-green-400'> typing...</p>
          } */}
                </div>
            </div>
        </>
    )
}