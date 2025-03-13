import React from 'react'
import { Outlet } from 'react-router-dom'
import { SideBar } from '../UI/SideBar'


export const MainLayout = () => {
    return (
        <div className='h-screen flex flex-col-reverse md:flex-row w-full'>
            <SideBar />
            <Outlet />
        </div>
    )
}
