import React from 'react'

export const SlidingButton = ({ buttons,setActive,active }) => {
    return (
        <div className="flex relative bg-gray-100 w-fit mt-8 mb-5 rounded overflow-hidden">
            {/* Sliding Box */}
            <div className={`bg-orange-400 text-white flex justify-center py-1  items-center rounded absolute top-0 h-full w-1/2 transition-all duration-300 ease-in-out ${active === buttons[0] ? "left-0" : "left-[50%]"}`} >
            </div>
            {/* Buttons */}

            {
                buttons.map(button => {
                    return <div onClick={() => setActive(button)} className={`py-1 px-9 cursor-pointer transition-all duration-300 ease-in-out text-gray-900 relative z-10 ${active === button ? "text-white" : ""}`} >
                        {button}
                    </div>
                })
            }
             {/* <div onClick={() => setActive("Personals")} className={`py-1 px-9 cursor-pointer transition-all duration-300 ease-in-out text-gray-900 relative z-10 ${active === "Personals" ? "text-white" : ""}`} >
                Personals
            </div>

            <div onClick={() => setActive("Groups")} className={`py-1 px-9 cursor-pointer transition-all duration-200 ease-in-out text-gray-900 relative z-10 ${active === "Groups" ? "text-white" : ""}`} >
                Groups
            </div> */}
        </div>
    )
}
