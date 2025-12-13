import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAppContext } from "./context/AppContext";

// Public pages
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Layout from "./pages/owner/Layout.jsx";
import Home from "./pages/Home.jsx";
import CarDetails from "./pages/CarDetails.jsx";
import Cars from "./pages/Cars.jsx";
import MyBookings from "./pages/MyBookings.jsx";

// Owner pages
import Dashboard from "./pages/owner/Dashboard.jsx";
import AddCar from "./pages/owner/AddCar.jsx";
import ManageCars from "./pages/owner/ManageCar.jsx";
import ManageBookings from "./pages/owner/ManageBookings.jsx";

// Login modal
import Login from "./components/Login.jsx";

const App = () => {
  const { showLogin } = useAppContext();
  const isOwnerPath = useLocation().pathname.startsWith("/owner");

  return (
    <>
      <Toaster />
      {showLogin && <Login />}

      {!isOwnerPath && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/my-bookings" element={<MyBookings />} />

        {/* Owner nested routes */}
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
        </Route>
      </Routes>

      {!isOwnerPath && <Footer />}
    </>
  );
};

export default App;
