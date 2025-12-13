import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loader from "../components/Loader";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";
import { motion } from "motion/react";

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    cars,
    setCars,
    pickupDate,
    setPickupDate,
    returnDate,
    setReturnDate,
    token,
    currency,
  } = useAppContext();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch cars if not available
  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await axios.get("/api/user/cars");
        if (res.data.success) setCars(res.data.cars);
      } catch {
        toast.error("Failed to load cars");
      }
    };
    if (!cars || cars.length === 0) fetchCars();
  }, [cars, setCars]);

  // 🔹 Find selected car
  useEffect(() => {
    if (cars && cars.length > 0) {
      const selectedCar = cars.find((c) => c._id === id);
      setCar(selectedCar);
    }
  }, [cars, id]);

  // 🔹 Booking
  const handleBooking = async () => {
    if (!pickupDate || !returnDate) {
      toast.error("Please select both dates");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/bookings/create",
        { car: id, pickupDate, returnDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Booking successful!");
        navigate("/my-bookings");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  if (!car) return <Loader />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16"
    >
      {/* BACK BUTTON */}
      <motion.button
        whileHover={{ x: -5 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-500"
      >
        <img src={assets.arrow_icon} alt="" className="rotate-180 opacity-60" />
        Back to all cars
      </motion.button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <motion.img
            src={car.image}
            alt=""
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
            className="w-full rounded-xl mb-6 shadow-md"
          />

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg">
                {car.category} · {car.year}
              </p>
            </div>

            <hr className="border-borderColor" />

            {/* FEATURES */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }, index) => (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center bg-light p-4 rounded-lg cursor-pointer"
                >
                  <img src={icon} alt="" className="h-5 mb-2" />
                  {text}
                </motion.div>
              ))}
            </div>

            {/* DESCRIPTION */}
            <div>
              <h1 className="text-xl font-medium mb-3">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>
          </div>
        </motion.div>

        {/* RIGHT BOOKING CARD */}
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onSubmit={(e) => {
            e.preventDefault();
            handleBooking();
          }}
          className="shadow-lg h-max sticky top-20 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl text-gray-800 font-semibold">
            {currency}
            {car.pricePerDay}
            <span className="text-base text-gray-400 font-normal"> / day</span>
          </p>

          <hr className="border-borderColor" />

          <div className="flex flex-col gap-2">
            <label>Pickup Date</label>
            <input
              type="date"
              value={pickupDate || ""}
              onChange={(e) => setPickupDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label>Return Date</label>
            <input
              type="date"
              value={returnDate || ""}
              onChange={(e) => setReturnDate(e.target.value)}
              min={pickupDate || new Date().toISOString().split("T")[0]}
              className="border px-3 py-2 rounded-lg"
              required
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            type="submit"
            className="w-full bg-primary hover:bg-primary-dull transition-all py-3 font-medium text-white rounded-xl disabled:opacity-60"
          >
            {loading ? "Booking..." : "Book Now"}
          </motion.button>

          <p className="text-center text-sm">No credit card required</p>
        </motion.form>
      </div>
    </motion.div>
  );
};

export default CarDetails;
