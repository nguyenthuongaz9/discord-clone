import { DashboardChart } from '@/components/admins/dashboard/dashboard-chart'
import currentProfile from '@/lib/current-profile'
import { StatisticChart } from '@/lib/statistic-chart'
import { redirect } from 'next/navigation'
import React from 'react'
import { RedirectToSignIn } from '@clerk/nextjs'


const AdminPage = async () => {


  const profile = await currentProfile()

  if(!profile){
    return <RedirectToSignIn/>
  }

  
  if(profile.role === "GUEST"){
    return redirect('/')
  }

  const chartData = await StatisticChart()

  console.log(chartData)



  
  return (
    <div className='mt-[70px] h-full w-full'>
    
      <DashboardChart chartData={chartData}/>
      
    </div>
  )
}

export default AdminPage