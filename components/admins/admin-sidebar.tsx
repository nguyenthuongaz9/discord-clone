
"use client"

import Link from 'next/link'
import React from 'react'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'
import { LayoutDashboard, Server, Users } from 'lucide-react'


const AdminSidebar = () => {


  const pathname = usePathname()
  console.log(pathname)



  return (
    <div className='dark:bg-[#2B2D31] bg-[#F2F3F5] flex flex-col items-center border-r'>
      <div className='flex items-center justify-center font-semibold text-2xl p-4'>
        Admin
      </div>
      <ul className='mt-4 space-y-4'>
        <li className={cn('dark:hover:bg-zinc-700/50 hover:bg-zinc-700/10', pathname === '/admins' && 'dark:bg-zinc-700/50 bg-zinc-700/10')}>
          <Link href='/admins' className='flex justify-between items-center gap-2  px-4 py-2 text-sm font-medium dark:text-white hover:text-gray-900'>
            Dashboard <LayoutDashboard size={20}/>
          </Link>
        </li>
        <li className={cn('dark:hover:bg-zinc-700/50 hover:bg-zinc-700/10', pathname === '/admins/profiles' && 'dark:bg-zinc-700/50 bg-zinc-700/10')}>
          <Link href='/admins/profiles' className='flex justify-between items-center gap-2  px-4 py-2 text-sm font-medium dark:text-white text-gray-700 hover:text-gray-900'>
            Profiles <Users size={20} />
          </Link>
        </li>
        <li className={cn('dark:hover:bg-zinc-700/50 hover:bg-zinc-700/10', pathname === '/admins/servers' && 'dark:bg-zinc-700/50 bg-zinc-700/10')}>
          <Link href='/admins/servers' className='flex justify-between items-center gap-2  px-4 py-2 text-sm font-medium dark:text-white text-gray-700 hover:text-gray-900'>
            Servers <Server size={20}/>
          </Link>
        </li>
        </ul>

    
    </div>
  )
}

export default AdminSidebar