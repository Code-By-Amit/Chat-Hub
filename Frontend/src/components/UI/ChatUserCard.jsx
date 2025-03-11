
export const ChatUserCard = ({ friend, setCurrentChatUser }) => {

    const handleOnclick = () => {
      setCurrentChatUser(friend)
    }
  
    return (
      <>
        <div onClick={handleOnclick} className="card flex gap-2 p-3 rounded dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer bg-gray-50">
          <div className='relative'>
            <div className='w-10 h-10 ring-2 rounded-full overflow-hidden ring-orange-400 ring-offset-2'>
              <img className='w-full h-full object-cover' src={friend.avatar} alt={friend.fullName} />
            </div>
            {friend.isOnline && <div className='absolute w-2 h-2 ring-2 ring-white bg-green-400 rounded-full bottom-0.5 right-0'></div>}
          </div>
          <p className='text-md font-semibold dark:text-gray-50'>{friend.fullName}</p>
        </div>
      </>
    )
  }