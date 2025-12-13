import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import { motion } from "motion/react";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  // Change role
  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success(data.message);
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Live search
  const handleLiveSearch = (value) => {
    if (!value.trim()) {
      setSearchParams({});
      navigate("/cars");
    } else {
      setSearchParams({ search: value });
      navigate(`/cars?search=${value}`);
    }
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative
      ${location.pathname === "/" ? "bg-light" : "bg-white"}`}
    >
      {/* Logo */}
      <Link to="/" className="cursor-pointer">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={assets.logo}
          alt="logo"
          className="h-8"
        />
      </Link>

      {/* Menu */}
      <div
        className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:border-t border-borderColor right-0 flex flex-col sm:flex-row
        items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50
        ${location.pathname === "/" ? "bg-light" : "bg-white"} ${open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"}`}
      >
        {menuLinks.map((link, index) => (
          <Link key={index} to={link.path} className="cursor-pointer">
            {link.name}
          </Link>
        ))}

        {/* Search */}
        <div className="hidden lg:flex items-center gap-2 border px-3 rounded-full max-w-56">
          <input
            type="text"
            value={search}
            onChange={(e) => handleLiveSearch(e.target.value)}
            placeholder="Search cars"
            className="py-1.5 w-full bg-transparent outline-none"
          />
          <img src={assets.search_icon} className="cursor-pointer" />
        </div>

        {/* Buttons */}
        <div className="flex gap-6">
          <button
            onClick={() => (isOwner ? navigate("/owner") : changeRole())}
            className="cursor-pointer"
          >
            {isOwner ? "Dashboard" : "List cars"}
          </button>
          <button
            onClick={() => (user ? logout() : setShowLogin(true))}
            className="px-8 py-2 bg-primary text-white rounded-lg cursor-pointer"
          >
            {user ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <button className="sm:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        <img src={open ? assets.close_icon : assets.menu_icon} />
      </button>
    </motion.div>
  );
};

export default Navbar;
