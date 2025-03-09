import React from 'react'
import { Outlet } from 'react-router-dom'
import { SideBar } from '../UI/SideBar'

export const MainLayout = () => {
    return (
        <div className='h-screen flex w-full'>
            <SideBar />
            <Outlet />
        </div>
    )
}
