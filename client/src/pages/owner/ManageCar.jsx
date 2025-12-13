import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageCar = () => {
  const { isOwner, axios, currency } = useAppContext()
  const [cars, setCars] = useState([])

  const fetchOwnerCar = async () => {
    try {
      const { data } = await axios.get('/api/owner/cars')
      if (data.success) {
        setCars(data.cars)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const toggleAvailability= async (carId) => {
    try {
      const { data } = await axios.post('/api/owner/toggle-car',{carId})
      if (data.success) {
       toast.success(data.message)
       fetchOwnerCar()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteCar= async (carId) => {
    try {
      const confirm = window.confirm('Are You sure you want to delete this car?')
      if(!confirm) return null
      const { data } = await axios.post('/api/owner/delete-car',{carId})
      if (data.success) {
       toast.success(data.message)
       fetchOwnerCar()
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    isOwner && fetchOwnerCar()
  }, [isOwner])

  // ✅ Currency Formatter
  const formatCurrency = (amount) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency || "USD",
        minimumFractionDigits: 0
      }).format(amount)
    } catch (err) {
      return `$${amount}`
    }
  }

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>
      <Title 
        title="Manage Cars" 
        subTitle="View all listed cars, update their details, or remove them from the booking platform."
      />
      <div className='max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>
        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500'>
            <tr>
              <th className='p-3 font-medium'>Car</th>
              <th className='p-3 font-medium max-md:hidden'>Category</th>
              <th className='p-3 font-medium'>Price</th>
              <th className='p-3 font-medium max-md:hidden'>Status</th>
              <th className='p-3 font-medium'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cars.map((car, index) => {
              // ✅ Default available if not provided
              const available = car.isAvailable ?? true

              return (
                <tr key={index} className='border-t border-borderColor'>
                  <td className='p-3 flex items-center gap-3'>
                    <img 
                      src={car.image} 
                      alt="" 
                      className='h-12 w-12 aspect-square rounded-md object-cover' 
                    />
                    <div className='max-md:hidden'>
                      <p className='font-medium'>
                        {car.brand} {car.model}
                      </p>
                      <p className='text-xs text-gray-500'>
                        {car.seating_capacity} seats • {car.transmission}
                      </p>
                    </div>
                  </td>
                  <td className='p-3 max-md:hidden'>{car.category}</td>
                  <td className='p-3'>
                    {formatCurrency(car.pricePerDay)}/day
                  </td>
                  <td className='p-3 max-md:hidden'>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        available 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {available ? "Available" : "Unavailable"}
                    </span>
                  </td>
                  <td className='flex items-center gap-3 p-3'>
                    <img onClick={()=> toggleAvailability(car._id)} 
                      src={available ? assets.eye_close_icon : assets.eye_icon} 
                      alt="" 
                      className='cursor-pointer' 
                    />

                    <img onClick={()=> deleteCar(car._id)} 
                      src={assets.delete_icon} 
                      alt="" 
                      className='cursor-pointer' 
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageCar
