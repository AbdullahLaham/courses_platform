import React from 'react'
import Sidebar from '@/app/(dashboard)/_components/Sidebar';
import Navbar from './_components/Navbar';

const DashboardLayout = ({children}: {children: React.ReactNode}) => {

  return (
    <div className='h-full'>
      <div className='h-[80px] md:pl-56 fixed inset-y-0 z-50 w-full  '>
        <Navbar />
      </div>
      <div className='hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50'>
        <Sidebar />
      </div>
        <div className='md:pl-56 pt-[80px] '>
          {children}
        </div>
        
    </div>

  )
}

export default DashboardLayout ;
