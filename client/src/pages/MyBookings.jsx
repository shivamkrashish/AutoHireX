import React, { useEffect, useState } from 'react'
import axios from "axios"
import { toast } from "react-hot-toast"
import { assets } from '../assets/assets'
import Title from '../components/Title'
import { motion } from "framer-motion"

const MyBookings = () => {

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const currency = import.meta.env.VITE_CURRENCY || 'USD'

  const fetchMyBookings = async () => {
    setLoading(true)
    const token = localStorage.getItem("token")

    if (!token) {
      setLoading(false)
      return
    }

    try {
      const res = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.data.success) {
        setBookings(res.data.bookings || [])
      } else {
        toast.error(res.data.message || "Failed to load bookings")
        setBookings([])
      }
    } catch (error) {
      toast.error("Failed to load bookings")
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, [])

  if (loading) {
    return (
      <div className='mt-16 text-center text-gray-500'>
        Loading your bookings...
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'
    >

      <Title
        title='My Bookings'
        subTitle='View and manage your all car bookings'
        align="left"
      />

      <div>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-xl mt-5 first:mt-12 shadow-sm hover:shadow-lg'
            >

              {/* Car Info */}
              <div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className='rounded-md overflow-hidden mb-3'
                >
                  <img
                    src={booking.car?.image || assets.default_car_image}
                    alt=""
                    className='w-full aspect-video object-cover'
                  />
                </motion.div>

                <p className='text-lg font-medium'>
                  {booking.car?.brand} {booking.car?.model}
                </p>
                <p className='text-gray-500'>
                  {booking.car?.year} • {booking.car?.category}
                </p>
              </div>

              {/* Booking Details */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <span className='px-3 py-1 bg-light rounded'>
                    Booking #{index + 1}
                  </span>

                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-400/15 text-green-600'
                        : booking.status === 'pending'
                        ? 'bg-yellow-400/15 text-yellow-600'
                        : 'bg-red-400/15 text-red-600'
                    }`}
                  >
                    {booking.status}
                  </motion.span>
                </div>

                <div className='mt-3'>
                  <p className='text-gray-500'>Rental Period</p>
                  <p>
                    {new Date(booking.pickupDate).toLocaleDateString()} –{" "}
                    {new Date(booking.returnDate).toLocaleDateString()}
                  </p>
                </div>

                <div className='mt-3'>
                  <p className='text-gray-500'>Pick-up Location</p>
                  <p>{booking.car?.location}</p>
                </div>
              </div>

              {/* Price */}
              <div className='flex flex-col justify-between text-right'>
                <div>
                  <p className='text-gray-500'>Total Price</p>
                  <h1 className='text-2xl font-semibold text-primary'>
                    {currency}{booking.price}
                  </h1>
                  <p className='text-xs text-gray-400'>
                    Booked on {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

            </motion.div>
          ))
        ) : (
          <div className='p-10 text-center text-gray-500'>
            No bookings found yet. Book your first car from Cars page!
          </div>
        )}
      </div>

    </motion.div>
  )
}

export default MyBookings
