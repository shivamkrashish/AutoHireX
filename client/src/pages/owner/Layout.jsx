import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/owner/Sidebar";
import NavbarOwner from "../../components/owner/NavbarOwner";
import { useAppContext } from "../../context/AppContext";

const Layout = () => {
  const { isOwner, user, navigate } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
      if (!isOwner) {
        navigate("/"); // redirect if not owner
      }
    }
  }, [user, isOwner, navigate]);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarOwner />
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex-1 p-6 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
