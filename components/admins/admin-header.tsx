import { UserButton } from '@clerk/nextjs'
import React from 'react'
import { ModeToggle } from '../mode-toggle'

const AdminHeader = () => {
  return (
    <div className='flex p-5 absolute items-center gap-2  justify-end left-0 top-0 h-[50px] dark:bg-[#323438] bg-[#F2F3F5]  w-full border-b shadow-md'>
        <ModeToggle/>
        <UserButton/>
    </div>
  )
}

export default AdminHeader