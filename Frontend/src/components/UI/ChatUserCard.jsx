import { useChatContext } from "../../context/chatContext"

export const ChatUserCard = ({ friend, isOnline, isTyping }) => {
  const {setCurrentChat} = useChatContext();
  const handleOnclick = () => {
    setCurrentChat(friend)
  }

  return (
    <>
      <div onClick={handleOnclick} className="card flex gap-2 p-3 rounded dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer bg-gray-100">
        <div className='relative'>
          <div className='w-10 h-10 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2'>
            <img className='w-full h-full object-cover' src={friend.avatar} alt={friend.fullName} />
          </div>
          {isOnline && <div className='absolute w-2 h-2 ring-2 ring-white bg-green-400 rounded-full bottom-0.5 right-0'></div>}
        </div>
        <div>
          <p className='text-md font-semibold dark:text-gray-50'>{friend.fullName}</p>
          {
            isTyping && <p className='align-middle text-xs font-mono text-green-400'> typing...</p>
          }
        </div>
      </div>
    </>
  )
}