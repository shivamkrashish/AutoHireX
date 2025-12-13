import React, { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import Title from "../../components/owner/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { axios, isOwner, currency } = useAppContext();
  const [data, setData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const res = await axios.get("/api/owner/dashboard");
      if (res.data.success) setData(res.data.dashboardData);
      else toast.error(res.data.message || "Unauthorized");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    if (isOwner) fetchDashboardData();
  }, [isOwner]);

  if (!data) return <p className="text-center mt-20">Loading dashboard...</p>;

  const dashboardCards = [
    { title: "Total Cars", value: data.totalCars, icon: assets.carIcon },
    { title: "Total Bookings", value: data.totalBookings, icon: assets.listIcon },
    { title: "Pending Bookings", value: data.pendingBookings, icon: assets.cautionIconColored },
    { title: "Completed Bookings", value: data.completedBookings, icon: assets.tick_icon },
  ];

  return (
    <div className="px-4 pt-10 md:px-10 flex-1">
      <Title title="Owner Dashboard" subTitle="Monitor total cars, bookings, revenue & recent activities" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 max-w-6xl">
        {dashboardCards.map((card, i) => (
          <div key={i} className="flex items-center justify-between p-5 bg-white rounded-md border border-gray-200 shadow-sm">
            <div>
              <p className="text-sm text-gray-500">{card.title}</p>
              <h3 className="text-xl font-semibold text-gray-900">{card.value}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <img src={card.icon} alt="icon" className="h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-start gap-6 mb-8 w-full mt-8">
        <div className="p-4 md:p-6 border border-gray-200 rounded-md max-w-lg w-full bg-white">
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest customer bookings</p>

          {data.recentBookings.length > 0 ? (
            data.recentBookings.map((booking, i) => (
              <div key={i} className="mt-4 flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                    <img src={assets.listIconColored} alt="" className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium">{booking.car?.brand} {booking.car?.model}</p>
                    <p className="text-sm text-gray-500">{booking.createdAt.split("T")[0]}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(booking.price)}
                  </p>
                  <p className={`px-3 py-0.5 border rounded-full text-sm ${booking.status === "confirmed" ? "border-green-500 text-green-600" : "border-yellow-500 text-yellow-600"}`}>
                    {booking.status}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="mt-4 text-gray-500">No recent bookings</p>
          )}
        </div>

        <div className="p-4 md:p-6 border border-gray-200 rounded-md w-full md:max-w-xs bg-white">
          <h1 className="text-lg font-medium">Monthly Revenue</h1>
          <p className="text-gray-500">Revenue this month</p>
          <p className="text-3xl mt-6 font-semibold text-blue-600">
            {new Intl.NumberFormat("en-US", { style: "currency", currency }).format(data.monthlyRevenue)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
