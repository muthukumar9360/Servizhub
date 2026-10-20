import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Star, ShieldCheck, MapPin, Calendar, Wrench, CheckCircle, AlertTriangle, QrCode, Activity, Heart } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../Components/common/Button";
import Badge from "../../Components/common/Badge";
import QRCodeModal from "../../Components/common/QRCodeModal";
import TrustScoreBadge from "../../Components/common/TrustScoreBadge";

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // Booking Form State
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availabilityResult, setAvailabilityResult] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [pickupDetails, setPickupDetails] = useState("Depot Pickup Location");

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const [equipRes, reviewRes] = await Promise.all([
          axiosInstance.get(`/equipments/${id}`),
          axiosInstance.get(`/interactions/reviews/${id}`),
        ]);
        setEquipment(equipRes.data.data);
        setReviews(reviewRes.data.data || []);
      } catch (e) {
        console.error("Failed to load details", e);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  const handleCheckAvailability = async () => {
    if (!startDate || !endDate) return;
    setCheckingAvailability(true);
    setAvailabilityResult(null);

    try {
      const response = await axiosInstance.get(
        `/bookings/check-availability?equipmentId=${id}&startDate=${startDate}&endDate=${endDate}`
      );
      setAvailabilityResult(response.data.data);
    } catch (err) {
      setAvailabilityResult({ available: false, message: err.response?.data?.message || "Unavailable" });
    } finally {
      setCheckingAvailability(false);
    }
  };

  const calcDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const days = calcDays();
  const dailyRate = equipment?.rentalPrice || 0;
  const rentalTotal = dailyRate * days;
  const deposit = equipment?.securityDeposit || 0;
  const delivery = equipment?.deliveryAvailable ? equipment.deliveryCharge || 0 : 0;
  const grandTotal = rentalTotal + deposit + delivery;

  const handleCreateBooking = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select start and end rental dates");
      return;
    }

    setBookingLoading(true);
    try {
      const response = await axiosInstance.post("/bookings", {
        equipmentId: id,
        startDate,
        endDate,
        pickupDetails,
      });

      alert(`Booking Confirmed! Booking Number: ${response.data.data.bookingNumber}`);
      navigate("/my-bookings");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create booking.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center text-gray-500">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3" />
        Loading equipment specs & asset health...
      </div>
    );
  }

  if (!equipment) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 text-center">
        <h2 className="text-xl font-bold text-gray-800">Equipment Listing Not Found</h2>
        <Button onClick={() => navigate("/browse")} className="mt-4">
          Return to Marketplace
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header info */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge status={equipment.approvalStatus} />
              <Badge status={equipment.availabilityStatus} />
              <button
                onClick={() => setQrModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-900 text-indigo-400 hover:bg-slate-800 rounded-lg text-xs font-extrabold border border-slate-700 transition"
              >
                <QrCode className="h-3.5 w-3.5" /> View QR Asset Tag
              </button>
            </div>
            <h1 className="text-3xl font-black text-gray-900">{equipment.name}</h1>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="h-4 w-4 text-indigo-600" /> {equipment.location?.address}, {equipment.location?.city},{" "}
              {equipment.location?.state}
            </p>
          </div>

          <div className="text-right">
            <span className="text-3xl font-black text-indigo-600">₹{equipment.rentalPrice}</span>
            <span className="text-xs text-gray-500"> / {equipment.pricingType?.toLowerCase() || "day"}</span>
            <p className="text-xs text-gray-400">Refundable Deposit: ₹{equipment.securityDeposit}</p>
          </div>
        </div>

        {/* Gallery & Booking Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image Gallery & Specs */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
              <div className="relative h-96 rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={equipment.images[selectedImage]?.url || equipment.images[0]?.url}
                  alt={equipment.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Thumbnails */}
              {equipment.images?.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {equipment.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                        selectedImage === idx ? "border-indigo-600 scale-95" : "border-gray-200"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Health Score & Condition Bar */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600/20 text-indigo-400 rounded-2xl border border-indigo-500/30">
                  <Activity className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Equipment Health Score</h4>
                  <p className="text-xs text-slate-400">Tested and calibrated prior to rental</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">{equipment.healthScore || 95}%</span>
                <span className="text-[10px] text-slate-400 block">PEAK OPERATIONAL</span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Equipment Overview</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{equipment.description}</p>

              {/* Technical Specifications Table */}
              {equipment.specifications?.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-bold text-sm text-gray-900 mb-3">Technical Specifications</h4>
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {equipment.specifications.map((s, i) => (
                        <div key={i} className="flex justify-between py-1 border-b border-gray-200/50">
                          <span className="text-gray-500 font-medium">{s.key}</span>
                          <span className="font-bold text-gray-900">{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Owner & Trust Profile */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={equipment.owner?.profileImage?.url || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"}
                  alt={equipment.owner?.fullName}
                  className="w-14 h-14 rounded-full object-cover border"
                />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">{equipment.owner?.fullName}</h4>
                  <p className="text-xs text-gray-500">Verified Equipment Owner</p>
                  <div className="mt-1">
                    <TrustScoreBadge trustScore={equipment.owner?.trustProfile?.trustScore || 95} trustTier="TOP_RATED" />
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                <span>Renter Reviews ({reviews.length})</span>
                <span className="flex items-center gap-1 text-sm text-amber-500 font-bold">
                  <Star className="h-4 w-4 fill-amber-400" /> {equipment.averageRating || 4.8} / 5.0
                </span>
              </h3>

              {reviews.length === 0 ? (
                <p className="text-xs text-gray-500">No reviews yet for this equipment listing.</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-xs text-gray-900">{rev.user?.fullName}</span>
                        <span className="flex items-center text-xs font-bold text-amber-500">
                          <Star className="h-3 w-3 fill-amber-400" /> {rev.rating}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Booking Availability Calendar & Price Calculator */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-indigo-100 shadow-xl sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" /> Select Rental Dates
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    min={startDate || new Date().toISOString().split("T")[0]}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <Button
                  onClick={handleCheckAvailability}
                  variant="secondary"
                  loading={checkingAvailability}
                  disabled={!startDate || !endDate}
                  className="w-full text-xs font-bold py-2.5"
                >
                  Verify Real-Time Availability
                </Button>

                {availabilityResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                      availabilityResult.available
                        ? "bg-green-50 text-green-800 border border-green-200"
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}
                  >
                    {availabilityResult.available ? (
                      <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    )}
                    <span>{availabilityResult.message}</span>
                  </div>
                )}

                {/* Pricing Summary Table */}
                {days > 0 && (
                  <div className="mt-6 pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-600">
                      <span>₹{dailyRate} x {days} rental days</span>
                      <span className="font-semibold text-gray-900">₹{rentalTotal}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Refundable Security Deposit</span>
                      <span className="font-semibold text-gray-900">₹{deposit}</span>
                    </div>
                    {delivery > 0 && (
                      <div className="flex justify-between text-gray-600">
                        <span>Site Transport Delivery</span>
                        <span className="font-semibold text-gray-900">₹{delivery}</span>
                      </div>
                    )}

                    <div className="pt-3 border-t border-gray-200 flex justify-between text-sm font-black text-gray-900">
                      <span>Grand Total</span>
                      <span className="text-indigo-600">₹{grandTotal}</span>
                    </div>
                  </div>
                )}

                <Button
                  onClick={handleCreateBooking}
                  variant="primary"
                  loading={bookingLoading}
                  disabled={days === 0 || (availabilityResult && !availabilityResult.available)}
                  className="w-full py-3.5 text-sm font-bold shadow-lg"
                >
                  Confirm Rental Booking
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      <QRCodeModal isOpen={qrModalOpen} onClose={() => setQrModalOpen(false)} equipment={equipment} />
    </div>
  );
};

export default EquipmentDetails;
