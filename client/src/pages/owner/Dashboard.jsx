import React, { useEffect, useState } from 'react'
import { assets, dummyDashboardData } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Dashboard = () => {

  const {axios, isOwner, currency} =useAppContext()

  const [data, setData] = useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0,
  })

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIconColored },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored },
    { title: "Pending Bookings", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored },
  ]

  const fetchDashboardData = async ()=>{
    try{
      const {data} = await axios.get('/api/owner/dashboard')
      if(data.success){
        setData(data.dashboardData)
      }
      else{
        toast.error(data.message)
      }
    } catch(error){
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if(isOwner){
      fetchDashboardData()

    }
  }, [isOwner])

  return (
    <div className='px-4 pt-10 md:px-10 flex-1'>
      <Title
        title="Admin Dashboard"
        subTitle="Monitor overall platform performance including total cars, bookings, and revenue."
      />

      {/* Dashboard Cards */}
      <div className="flex flex-wrap gap-2 my-6">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            className='flex gap-2 items-center p-3 rounded-md border border-borderColor bg-white shadow-sm w-[200px]'
          >
            <div className='flex items-center justify-center w-9 h-9 rounded-full bg-primary/10'>
              <img src={card.icon} alt="" className='h-5 w-5' />
            </div>
            <div className='flex-1'>
              <h3 className='text-xs text-gray-500'>{card.title}</h3>
              <p className='text-base font-semibold'>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Lists */}
      <div className='flex flex-wrap items-start gap-6 mb-8 w-full'>
        {/* Recent Bookings */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md max-w-lg w-full'>
          <h1 className='text-lg font-medium'>Recent Bookings</h1>
          <p className='text-gray-500'>Latest customer bookings</p>

          {data.recentBookings.length === 0 ? (
            <p className="mt-4 text-sm text-gray-500">No recent bookings found.</p>
          ) : (
            data.recentBookings.map((booking, index) => (
              <div key={index} className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                  <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                  <div>
                    <p>
                      {booking?.car?.brand || 'Unknown'} {booking?.car?.model || ''}
                    </p>
                    <p className='text-sm text-gray-500'>
                      {booking?.createAt?.split('T')[0] || 'N/A'}
                    </p>
                  </div>
                </div>
                <div className='flex items-center gap-2 font-medium'>
                  <p className='text-sm text-gray-500'>
                    {currency}{booking?.price || '0'}
                  </p>
                  <p className='px-3 py-0.5 border border-borderColor rounded-full text-sm'>
                    {booking?.status || 'Pending'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Monthly Booking Revenue (placeholder) */}
        <div className='p-4 md:p-6 border border-borderColor rounded-md w-full md:max-w-xs'>
          <h1 className='text-lg font-medium'>Monthly Revenue</h1>
          <p className='text-gray-500'>Revenue for current month</p>
          <p className='text-3xl mt-6 font-semibold text-primary'>{currency}{data.monthlyRevenue }</p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
