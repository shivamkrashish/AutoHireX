import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import { motion } from "motion/react";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = import.meta.env.VITE_CURRENCY || "USD";

  // 🔹 Fetch Bookings
  const fetchMyBookings = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setBookings(res.data.bookings || []);
      } else {
        setBookings([]);
        toast.error(res.data.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  // 🔹 Loading State
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-center"
      >
        <p className="text-gray-600">Loading your bookings...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16 text-sm max-w-7xl mx-auto"
    >
      <Title
        title="My Bookings"
        subTitle="View and manage your all car bookings"
        align="left"
      />

      <div>
        {Array.isArray(bookings) && bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <motion.div
              key={booking._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.01 }}
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12 bg-white"
            >
              {/* CAR INFO */}
              <div className="md:col-span-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-md overflow-hidden mb-3"
                >
                  <img
                    src={booking.car?.image || assets.default_car_image}
                    alt=""
                    className="w-full aspect-video object-cover"
                  />
                </motion.div>

                <p className="text-lg font-medium mt-2">
                  {booking.car?.brand || "N/A"}{" "}
                  {booking.car?.model || "Car Details Missing"}
                </p>

                <p className="text-gray-500">
                  {booking.car?.year} • {booking.car?.category} •{" "}
                  {booking.car?.location}
                </p>
              </div>

              {/* BOOKING DETAILS */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2">
                  <p className="px-3 py-1.5 bg-light rounded">
                    Booking #{index + 1}
                  </p>

                  <span
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status === "confirmed"
                        ? "bg-green-400/15 text-green-600"
                        : booking.status === "pending"
                        ? "bg-yellow-400/15 text-yellow-600"
                        : "bg-red-400/15 text-red-600"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* RENTAL PERIOD */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.calendar_icon_colored}
                    className="w-4 h-4"
                    alt=""
                  />
                  <div>
                    <p className="text-gray-500">Rental Period</p>
                    <p>
                      {new Date(booking.pickupDate).toLocaleDateString()} To{" "}
                      {new Date(booking.returnDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* LOCATION */}
                <div className="flex items-start gap-2 mt-3">
                  <img
                    src={assets.location_icon_colored}
                    className="w-4 h-4"
                    alt=""
                  />
                  <div>
                    <p className="text-gray-500">Pick-up Location</p>
                    <p>{booking.car?.location || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* PRICE */}
              <div className="md:col-span-1 flex flex-col justify-between">
                <div className="text-right">
                  <p className="text-gray-500">Total Price</p>
                  <motion.h1
                    whileHover={{ scale: 1.05 }}
                    className="text-2xl font-semibold text-primary"
                  >
                    {currency}
                    {booking.price}
                  </motion.h1>
                  <p className="text-sm">
                    Booked on{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-10 text-center text-gray-500"
          >
            No bookings found yet. Book your first car from the Cars page!
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyBookings;
