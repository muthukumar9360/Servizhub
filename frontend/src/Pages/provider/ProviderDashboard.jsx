import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Wrench, Package, DollarSign, PlusCircle, Clock, TrendingUp, BarChart3 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axiosInstance from "../../api/axiosInstance";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";

const chartData = [
  { month: "Jan", revenue: 12000, bookings: 4 },
  { month: "Feb", revenue: 18500, bookings: 7 },
  { month: "Mar", revenue: 24000, bookings: 9 },
  { month: "Apr", revenue: 31000, bookings: 12 },
  { month: "May", revenue: 42000, bookings: 15 },
  { month: "Jun", revenue: 58000, bookings: 21 },
];

const ProviderDashboard = () => {
  const [equipments, setEquipments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eqRes, bkRes] = await Promise.all([
        axiosInstance.get("/equipments/my/listings"),
        axiosInstance.get("/bookings/provider-bookings"),
      ]);
      setEquipments(eqRes.data.data || []);
      setBookings(bkRes.data.data || []);
    } catch (e) {
      console.error("Error loading provider dashboard", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Equipment Provider Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage listings, approve rental handovers, and track depot revenue</p>
          </div>
          <Link to="/provider/add-equipment">
            <Button variant="primary" className="text-xs font-bold py-2.5">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Equipment
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Wrench className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Listings</p>
              <h3 className="text-2xl font-black text-gray-900">{equipments.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <Package className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Bookings</p>
              <h3 className="text-2xl font-black text-gray-900">{bookings.length}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Total Rental Revenue</p>
              <h3 className="text-2xl font-black text-gray-900">₹{totalRevenue || 58000}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-semibold">Pending Approvals</p>
              <h3 className="text-2xl font-black text-gray-900">
                {equipments.filter((e) => e.approvalStatus === "PENDING_APPROVAL").length}
              </h3>
            </div>
          </div>
        </div>

        {/* Analytics Chart Box */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" /> Revenue & Booking Analytics
            </h3>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              10% Platform Commission Deducted
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Listings & Bookings Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Equipment Listings */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 mb-4">My Equipment Listings</h3>
            {equipments.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">No equipment listings added yet.</p>
            ) : (
              <div className="space-y-3">
                {equipments.map((eq) => (
                  <div key={eq._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={eq.images[0]?.url || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"}
                        alt={eq.name}
                        className="w-12 h-12 rounded-xl object-cover border"
                      />
                      <div>
                        <h4 className="font-bold text-xs text-gray-900 line-clamp-1">{eq.name}</h4>
                        <p className="text-[10px] text-gray-500">Rate: ₹{eq.rentalPrice}/day | Health: {eq.healthScore || 95}%</p>
                      </div>
                    </div>
                    <Badge status={eq.approvalStatus} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Booking Requests */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Incoming Booking Requests</h3>
            {bookings.length === 0 ? (
              <p className="text-xs text-gray-500 py-4">No booking requests received yet.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold text-indigo-600">{b.bookingNumber}</span>
                        <Badge status={b.bookingStatus} />
                      </div>
                      <h4 className="font-bold text-xs text-gray-900">{b.equipment?.name}</h4>
                      <p className="text-[10px] text-gray-500">Renter: {b.renter?.fullName}</p>
                    </div>
                    <span className="text-sm font-black text-gray-900">₹{b.totalAmount}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
