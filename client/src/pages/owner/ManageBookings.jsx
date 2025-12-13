import React, { useEffect, useState } from 'react';
import Title from '../../components/owner/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../../assets/assets'; 

const ManageBookings = () => {
  const { axios, currency } = useAppContext();
  
  const [bookings, setBookings] = useState([]);

  // Fetch bookings for owner
  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner');
      if (data.success) {
            setBookings(data.bookings || []);
      } else {
            toast.error(data.message);
            setBookings([]);
      }
    } catch (error) {
      toast.error("Failed to load owner bookings.");
      setBookings([]);
    }
  };

  // Change booking status
  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status });
      if (data.success) {
        toast.success(data.message);
        fetchOwnerBookings(); // refresh table
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  useEffect(() => {
    fetchOwnerBookings();
  }, []);

  // डेट को YYYY-MM-DD फॉर्मेट में बदलने के लिए हेल्पर फंक्शन
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    // UTC डेट को Local Date में बदलना
    return new Date(dateString).toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  };

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
              <th className='p-3 font-medium'>Payment</th> {/* FIX: Customer की जगह Payment */}
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

                {/* Date Range (Fixed Formatting) */}
                <td className='p-3 max-md:hidden'>
                  {formatDate(booking.pickupDate)} to {formatDate(booking.returnDate)}
                </td>

                {/* Total Price */}
                <td className='p-3 font-semibold'>{currency}{booking.price}</td>

                {/* Payment (FIXED: Added Payment Column) */}
                <td className='p-3'>
                  <span className='px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600 font-medium'>
                    offline 
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