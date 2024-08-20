import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react'
import { DataCard } from './_components/DataCard';
import Chart from './_components/Chart';
import { getAnalytics } from '@/actions/getAnalytics';

const AnalyticsPage = async () => {
  const {userId} = auth();
  if (!userId) return redirect('/');
  const {data, totalRevenue, totalSales} = await getAnalytics(userId);


  return (
    <div className='p-6 '>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
        <DataCard label='total revenue' value={totalRevenue} shouldFormat />
        <DataCard label='total sales' value={totalSales} />

      </div>
      <Chart data={data}  />

      
    </div>
  )
}

export default AnalyticsPage
