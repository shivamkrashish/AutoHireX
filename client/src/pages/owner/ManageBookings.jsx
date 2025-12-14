// client/src/pages/owner/ManageBookings.jsx

import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets'; 

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true); 

  // Fetch bookings for owner
  const fetchOwnerBookings = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
            setBookings(data.bookings || []);
      } else {
            toast.error(data.message);
            setBookings([]);
      }
    } catch (error) {
      toast.error("Failed to load owner bookings. Server might be down or unauthorized.");
      setBookings([]);
    } finally {
        setLoading(false);
    }
  };

  // Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      // Optimistic UI update
      setBookings(prev => 
          prev.map(b => b._id === bookingId ? { ...b, status: status } : b)
      );

      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
        // यदि API विफल होता है, तो पुराना status वापस लाएँ
        fetchOwnerBookings(); 
      }
    } catch (error) {
      toast.error("Failed to update status.");
      // यदि API विफल होता है, तो पुराना status वापस लाएँ
      fetchOwnerBookings(); 
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, [axios]); // dependency array में axios होना आवश्यक है

  // डेट को फॉर्मेट करने के लिए हेल्पर फंक्शन
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  };

  if (loading) {
      return (
          <div className='px-4 pt-10 md:px-10 w-full text-center'>
              <p className='text-gray-500 mt-20'>Loading bookings...</p>
          </div>
      )
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title
        title="Manage Bookings"
        subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses."
      />

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Date Range</th>
              <th className='p-3 font-medium'>Total</th>
              <th className='p-3 font-medium'>Payment</th> 
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(bookings) && bookings.length > 0 ? ( 
              bookings.map((booking, index) => (
              <tr key={booking._id || index} className='border-t border-borderColor text-gray-500'>
                {/* Car Info */}
                <td className='p-3 flex items-center gap-3'>
                  <img
                    src={booking.car?.image || assets.default_car_image} 
                    alt=""
                    className='h-12 w-12 aspect-square rounded-md object-cover'
                  />
                  <p className='font-medium text-gray-800'>
                    {booking.car?.brand || 'N/A'} {booking.car?.model || 'Car Missing'}
                  </p>
                </td>

                {/* Date Range */}
                <td className='p-3 max-md:hidden'>
                  {formatDate(booking.pickupDate)} to {formatDate(booking.returnDate)}
                </td>

                {/* Total Price */}
                <td className='p-3 font-semibold'>{currency}{booking.price || 0}</td>

                {/* Payment */}
                <td className='p-3'>
                  <span className='px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium'>
                    {booking.paymentMethod || 'offline'} 
                  </span>
                </td>

                {/* Actions: Dropdown */}
                <td className='p-3'>
                  <select
                    value={booking.status}
                    onChange={(e) => changeBookingStatus(booking._id, e.target.value)}
                    className={`px-2 py-1.5 mt-1 border rounded-md outline-none appearance-none cursor-pointer ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-700 border-green-300'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-300'
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
            ) : (
                <tr>
                    <td colSpan="5" className='p-4 text-center text-gray-400'>No bookings found.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageBookings;