import React, { useEffect, useState } from "react";
import Title from "../components/Title";
import CarCard from "../components/CarCard";
import { assets } from "../assets/assets";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { motion } from "motion/react";

const Cars = () => {
  const { axios } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);

  // Fetch cars
  useEffect(() => {
    const fetchCars = async () => {
      const res = await axios.get("/api/user/cars");
      setCars(res.data.cars);
      setFilteredCars(res.data.cars);
    };
    fetchCars();
  }, []);

  // Filter on every keystroke
  useEffect(() => {
    if (!search.trim()) {
      setFilteredCars(cars);
      return;
    }

    const text = search.toLowerCase();
    setFilteredCars(
      cars.filter(
        (car) =>
          car.brand?.toLowerCase().includes(text) ||
          car.model?.toLowerCase().includes(text) ||
          car.category?.toLowerCase().includes(text) ||
          car.transmission?.toLowerCase().includes(text)
      )
    );
  }, [search, cars]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center py-20 bg-light"
      >
        <Title title="Available Cars" />

        {/* Search */}
        <div className="flex items-center bg-white mt-6 w-full max-w-xl h-12 rounded-full shadow px-4">
          <img src={assets.search_icon} className="w-5 mr-2" />
          <input
            type="text"
            value={search}
            onChange={(e) =>
              e.target.value
                ? setSearchParams({ search: e.target.value })
                : setSearchParams({})
            }
            placeholder="Search by brand, model"
            className="w-full outline-none"
          />
        </div>
      </motion.div>

      {/* Cars Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
        className="px-20 mt-10"
      >
        <p className="mb-4">Showing {filteredCars.length} Cars</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCars.map((car, index) => (
            <motion.div
              key={car._id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
              className="cursor-pointer bg-white rounded-lg overflow-hidden"
            >
              <CarCard car={car} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Cars;
