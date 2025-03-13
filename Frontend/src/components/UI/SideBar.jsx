import { NavLink, useNavigate } from "react-router-dom";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { PiUserListBold } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { FiLogOut, FiMoon } from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import { authUser } from "../../context/authUser";
import { FiSun } from "react-icons/fi";

export const SideBar = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark')
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
        console.log(isDarkMode)
    }, [isDarkMode]);

    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setScreenWidth(window.innerWidth)
    //     }
    //     window.addEventListener("resize", handleResize);
    //     return () => window.removeEventListener("resize", handleResize);
    // }, [])

    return (
        <>
            <div className="md:w-19 md:h-screen flex flex-col items-center md:p-4 shadow-lg relative dark:bg-gray-800">

                <nav className="flex md:flex-col justify-evenly w-full md:gap-6  my-3 md:mt-6">
                    <NavigationLink icon={<IoChatboxEllipsesOutline size={24} />} to="/chat" tooltip="Chat" end screenWidth={screenWidth} />
                    <NavigationLink icon={<PiUserListBold size={24} />} to="/chat/friendrequest" tooltip="Friend Requests" screenWidth={screenWidth} />
                    <NavigationLink icon={<FaUser size={24} />} to="/chat/profile" tooltip="Profile" screenWidth={screenWidth} />

                    {/* Light/Dark Toggle  */}
                    <div className="relative flex justify-center items-center w-12 h-12 rounded-lg 
                                  hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 transition-all text-gray-500 duration-300 cursor-pointer overflow-hidden"
                        onClick={() => setIsDarkMode((prev) => !prev)} data-tooltip-id="theme">

                        <FiSun className={`absolute transition-all duration-300 ease-in-out 
                                         ${isDarkMode ? "opacity-0 rotate-180 scale-75" : "opacity-100 rotate-0 scale-100"}`} size={24} />

                        <FiMoon className={`absolute transition-all duration-300 ease-in-out
                                           ${isDarkMode ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-180 scale-75"}`} size={24} />
                    </div>
                    <Tooltip id="theme" className="z-50" place="right">Light/Dark Mode</Tooltip>

                    <button
                        onClick={() => setShowLogoutModal(true)}
                        className="flex justify-center items-center hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg w-12 h-12 text-red-500 hover:text-red-600 transition-all"
                        data-tooltip-id="logout"
                    >
                        <FiLogOut size={24} />
                        <Tooltip id="logout" className="z-50" place="right" >Logout</Tooltip>
                    </button>
                </nav>
            </div>
            {showLogoutModal && <LogoutModal onClose={() => setShowLogoutModal(false)} />}
        </>
    );
};

const NavigationLink = ({ icon, to, tooltip, end, screenWidth }) => {

    return (
        <NavLink
            end={end}
            to={to}
            className={({ isActive }) => `flex md:static justify-center items-center w-12 h-12 rounded-lg transition-all ${isActive ? "bg-orange-400 text-white" : "text-gray-500 dark:text-gray-300 dark:hover:bg-gray-600 hover:bg-gray-100"}`}
            data-tooltip-id={tooltip}
        >
            {icon}
            <Tooltip id={tooltip} className="z-50 " place="right">{tooltip}</Tooltip>
        </NavLink>
    );
};

const LogoutModal = ({ onClose }) => {
    const { logoutMutation } = authUser()
    const navigate = useNavigate()

    const handleLogout = () => {
        logoutMutation.mutate(undefined, {
            onSuccess: () => {
                navigate('/')
            }
        })
        onClose();
    };

    return (
        <div className="fixed inset-0 flex justify-center items-center dark:bg-white/15 bg-black/15 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Are you sure?</h2>
                <p className="text-gray-600 mt-2">Do you really want to logout?</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                        Yes, Logout
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};
