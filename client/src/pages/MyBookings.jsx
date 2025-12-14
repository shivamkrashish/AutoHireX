import React, { useEffect, useState } from 'react'
// FIX 1: axios को import करना आवश्यक है
import axios from "axios" 
import { toast } from "react-hot-toast"
import { assets } from '../assets/assets'
import Title from '../components/Title'
// FIX 2: यदि token context से आ रहा है, तो उसे import करें
// import { useAppContext } from '../context/AppContext' 

const MyBookings = () => {
  // const { token } = useAppContext(); // यदि आप Context का उपयोग कर रहे हैं
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); // FIX 3: Loading State
  const currency = import.meta.env.VITE_CURRENCY || 'USD'; // Default currency

  // 👉 Fetch User Bookings From Backend
  const fetchMyBookings = async () => {
    // FIX 4: setLoading(true) को Fetch शुरू होने से ठीक पहले सेट करें
    setLoading(true); 
    
    // FIX 5: टोकन को सुरक्षित रूप से लें
    const token = localStorage.getItem("token") 
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/bookings/user", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (res.data.success) {
        // सुनिश्चित करें कि bookings हमेशा Array हो
        setBookings(res.data.bookings || []);
      } else {
        setBookings([]);
        toast.error(res.data.message || "Failed to load bookings");
      }
    } catch (error) {
      toast.error("Failed to load bookings");
      console.error("Booking fetch error:", error);
      setBookings([]); 
    } finally {
      setLoading(false); // FIX 6: Fetch खत्म होने पर लोडिंग खत्म करें
    }
  }

  useEffect(() => {
    fetchMyBookings()
  }, []) // खाली Dependency Array ठीक है, क्योंकि fetchMyBookings अंदर ही token ले रहा है

  
  // FIX 7: Loading होने पर एक लोडर दिखाएँ (Page Blank नहीं रहेगा)
  if (loading) {
    return (
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-center'>
        <p className='text-gray-600'>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'>
      
      <Title 
        title='My Bookings' 
        subTitle='View and manage your all car bookings' 
        align="left"
      />

      <div>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div 
              key={booking._id} 
              className='grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12'
            >
              {/* Car Image + Info (Optional Chaining के साथ) */}
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img 
                    src={booking.car?.image || assets.default_car_image} 
                    alt="" 
                    className='w-full h-auto aspect-video object-cover'
                  />
                </div>

                <p className='text-lg font-medium mt-2'>
                  {booking.car?.brand || 'N/A'} {booking.car?.model || 'Car Details Missing'}
                </p>

                <p className='text-gray-500'>
                  {booking.car?.year} • {booking.car?.category} • {booking.car?.location}
                </p>
              </div>

              {/* Booking Info */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2'>
                  <p className='px-3 py-1.5 bg-light rounded'>
                    Booking #{index + 1}
                  </p>

                  <p 
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-400/15 text-green-600' 
                        : booking.status === 'pending'
                        ? 'bg-yellow-400/15 text-yellow-600'
                        : 'bg-red-400/15 text-red-600'
                    }`}
                  >
                    {booking.status}
                  </p>
                </div>

                {/* Rental Period */}
                <div className="flex items-start gap-2 mt-3">
                  <img 
                    src={assets.calendar_icon_colored} 
                    alt="calendar icon" 
                    className='w-4 h-4'
                  />

                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    {/* FIX 8: Date को Local Timezone के हिसाब से format करें */}
                    <p>
                      {new Date(booking.pickupDate).toLocaleDateString()} To {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Pick-up Location */}
                <div className="flex items-start gap-2 mt-3">
                  <img 
                    src={assets.location_icon_colored}
                    alt="location icon" 
                    className='w-4 h-4'
                  />

                  <div>
                    <p className='text-gray-500'>Pick-up Location</p>
                    <p>{booking.car?.location || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className='md:col-span-1 flex flex-col justify-between gap-6'>
                <div className='text-sm text-gray-500 text-right'>
                  <p>Total Price</p>

                  <h1 className='text-2xl font-semibold text-primary'>
                    {currency}{booking.price}
                  </h1>

                  <p>Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className='p-10 text-center text-gray-500'>
            {/* FIX 9: यह मैसेज तब दिखेगा जब लोडिंग खत्म हो जाए और कोई बुकिंग न मिले। */}
            No bookings found yet. Book your first car from the Cars page!
          </div>
        )}
      </div>

    </div>
  )
}

export default MyBookings