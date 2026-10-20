import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Calendar, MapPin, ArrowRight, Eye, ShieldCheck, FileCheck } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Badge from "../../components/common/Badge";
import Button from "../../components/common/Button";
import LifecycleBar from "../../components/common/LifecycleBar";
import InspectionComparisonModal from "../../components/common/InspectionComparisonModal";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Inspection Comparison Modal state
  const [selectedBookingInspections, setSelectedBookingInspections] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/bookings/my-bookings");
      setBookings(res.data.data || []);
    } catch (e) {
      console.error("Error loading user bookings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleRequestReturn = async (bookingId) => {
    if (!confirm("Are you ready to request equipment return for inspection?")) return;
    try {
      await axiosInstance.post(`/returns/${bookingId}/request-return`);
      alert("Return requested! Provider notified for depot inspection.");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to request return");
    }
  };

  const handleViewInspections = async (bookingId) => {
    try {
      const res = await axiosInstance.get(`/inspections/booking/${bookingId}`);
      setSelectedBookingInspections(res.data.data);
      setModalOpen(true);
    } catch (e) {
      alert("No inspection record found yet for this booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">My Equipment Rentals</h1>
          <p className="text-sm text-gray-500 mt-1">Track active rental state timelines, return inspections, and deposit refunds</p>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
            Loading rental bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 shadow-xs">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No active rental bookings</h3>
            <p className="text-xs text-gray-500 mt-1">You haven't rented any equipment yet.</p>
            <Link to="/browse">
              <Button variant="primary" className="mt-4 text-xs font-bold">
                Browse Marketplace <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col space-y-4"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-4 border-b border-gray-100">
                  <div className="flex gap-4">
                    <img
                      src={b.equipment?.images[0]?.url || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"}
                      alt={b.equipment?.name}
                      className="w-20 h-20 rounded-2xl object-cover border shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold text-indigo-600 tracking-wider">
                          {b.bookingNumber}
                        </span>
                        <Badge status={b.bookingStatus} />
                      </div>
                      <h3 className="font-bold text-gray-900 text-base">{b.equipment?.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(b.startDate).toLocaleDateString()} — {new Date(b.endDate).toLocaleDateString()} ({b.rentalDays} Days)
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col md:items-end gap-2 w-full md:w-auto">
                    <div className="text-left md:text-right">
                      <span className="text-xl font-black text-gray-900">₹{b.totalAmount}</span>
                      <p className="text-[10px] text-gray-400">Security Deposit: ₹{b.securityDeposit}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {b.bookingStatus === "ACTIVE" && b.returnStatus === "NOT_RETURNED" && (
                        <Button
                          onClick={() => handleRequestReturn(b._id)}
                          variant="secondary"
                          size="sm"
                          className="text-xs font-bold text-indigo-600"
                        >
                          Request Return
                        </Button>
                      )}

                      <Button
                        onClick={() => handleViewInspections(b._id)}
                        variant="outline"
                        size="sm"
                        className="text-xs font-bold flex items-center gap-1"
                      >
                        <FileCheck className="h-3.5 w-3.5" /> Inspections
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Visual State Timeline */}
                <div className="pt-2">
                  <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block mb-1">
                    Rental Lifecycle Timeline
                  </span>
                  <LifecycleBar currentStatus={b.bookingStatus} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Side-by-side Photo Inspection Modal */}
      {selectedBookingInspections && (
        <InspectionComparisonModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          handover={selectedBookingInspections.handover}
          returnInspection={selectedBookingInspections.returnInspection}
        />
      )}
    </div>
  );
};

export default MyBookings;
