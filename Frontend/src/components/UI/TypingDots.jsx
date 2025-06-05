import React from 'react'

export const TypingDots = ({avatar}) => {
    return (
        <div className={`flex gap-2 transition-all ease-in-out duration-300 `}>
            <div className='w-8 h-8 ring-1 ring-orange-400 ring-offset-2 overflow-clip rounded-full'>
                <img className='w-full h-full object-cover' src={avatar} alt="" />
            </div>
            < div className={`px-3 py-2.5 rounded-t-lg justify-self-start rounded-r-lg bg-gray-300 dark:bg-gray-500 dark:text-gray-100 max-w-1/2 lg:w-fit`}>
                <span >
                    <div className='userTyping'></div>
                </span>
            </div>
        </div>
    )
}
