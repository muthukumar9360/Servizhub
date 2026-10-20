import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Briefcase, Loader2, PlusCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MyBusinessPage = () => {
    const { userId } = useParams();
    const navigate = useNavigate();

    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBusiness, setSelectedBusiness] = useState(null);
    const api = import.meta.env.VITE_SERVER_URL || "http://localhost:5000";

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await fetch(`${api}/business/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch business data");
                const data = await res.json();
                setBusinesses(data);
            } catch (err) {
                console.error("Error fetching businesses:", err);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchBusinesses();
    }, [userId, api]);

    const cardVariant = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
    };

    const handleAddBusiness = () => {
        navigate(`/addbusiness/${userId}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 mt-10">
            <h1 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <Briefcase className="text-indigo-600" /> My Businesses
            </h1>

            {/* ➕ Add Business */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={handleAddBusiness}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                    <PlusCircle size={18} /> Add New Business
                </button>
            </div>

            {/* Loading or Business List */}
            {loading ? (
                <div className="flex justify-center mt-20">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                </div>
            ) : businesses.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                    No businesses added yet.
                </div>
            ) : (
                <motion.div
                    className="grid gap-6 sm:grid-cols-2 md:grid-cols-3"
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                    {businesses.map((biz) => (
                        <motion.div
                            key={biz._id}
                            variants={cardVariant}
                            onClick={() => setSelectedBusiness(biz)}
                            className="bg-white border rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer overflow-hidden"
                        >
                            {/* Image */}
                            {biz.media?.mainImages?.[0]?.url && (
                                <div className="relative h-40 w-full overflow-hidden">
                                    <img
                                        src={biz.media.mainImages[0].url}
                                        alt={biz.media.mainImages[0].alt}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                    {biz.status && (
                                        <span className="absolute top-2 left-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                                            {biz.status}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                                    {biz.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-1 line-clamp-1">
                                    📍 {biz.locationDetails?.city || biz.address}
                                </p>
                                <p className="text-yellow-500 font-medium mb-2">
                                    ⭐ {biz.rating || "N/A"} ({biz.numRatings || 0})
                                </p>
                                <p className="text-gray-600 text-sm line-clamp-2">
                                    {biz.overview?.description || "No description available."}
                                </p>

                                {/* Claim / Verified */}
                                <div className="mt-2 flex items-center gap-2">
                                    {biz.claimed && (
                                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                            Claimed
                                        </span>
                                    )}
                                    {biz.status === "Verified" && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                            Verified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

            )}

            {/* 🪟 Popup Modal */}
            <AnimatePresence>
                {selectedBusiness && (
                    <motion.div
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                        >
                            {/* Close Button */}
                            <button
                                className="absolute top-4 right-4 text-gray-600 hover:text-black"
                                onClick={() => setSelectedBusiness(null)}
                            >
                                <X size={24} />
                            </button>

                            {/* Title */}
                            <h2 className="text-2xl font-semibold text-indigo-700 mb-3">
                                {selectedBusiness.name}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {selectedBusiness.overview?.description || "No description available."}
                            </p>

                            {/* Overview */}
                            <div className="border-t pt-3 mb-5">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Overview</h3>
                                <p><strong>Established:</strong> {selectedBusiness.overview?.establishedYear || "N/A"}</p>
                                <p><strong>Capacity:</strong> {selectedBusiness.overview?.capacity?.minGuests} - {selectedBusiness.overview?.capacity?.maxGuests} guests</p>
                                <p><strong>Price Range:</strong> {selectedBusiness.overview?.priceRange || "N/A"}</p>
                                <p><strong>Facilities:</strong> {selectedBusiness.overview?.facilities?.join(", ")}</p>
                                <p><strong>Available For:</strong> {selectedBusiness.overview?.availableFor?.join(", ")}</p>
                                <p><strong>Opening Hours:</strong> {selectedBusiness.overview?.openingHours}</p>
                                <p><strong>Closed Days:</strong> {selectedBusiness.overview?.closedDays}</p>
                                <p><strong>Website:</strong> <a href={selectedBusiness.overview?.website} className="text-blue-600 underline" target="_blank">Visit Site</a></p>
                                <p><strong>Email:</strong> {selectedBusiness.overview?.email}</p>
                                <p><strong>Occasions:</strong> {selectedBusiness.overview?.occasion?.join(", ")}</p>
                                <p><strong>Banquet Type:</strong> {selectedBusiness.overview?.banquetType?.join(", ")}</p>
                            </div>

                            {/* Contact Details */}
                            <div className="border-t pt-3 mb-5">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Contact Details</h3>
                                <p><strong>Owner:</strong> {selectedBusiness.contactDetails?.ownerName}</p>
                                <p><strong>Phone:</strong> {selectedBusiness.contactDetails?.phone}</p>
                                <p><strong>WhatsApp:</strong> {selectedBusiness.contactDetails?.whatsapp}</p>
                                <p><strong>Email:</strong> {selectedBusiness.contactDetails?.email}</p>
                                <p><strong>GSTIN:</strong> {selectedBusiness.contactDetails?.gstin}</p>
                                <p><strong>Verified:</strong> {selectedBusiness.contactDetails?.verified ? "Yes ✅" : "No ❌"}</p>
                            </div>

                            {/* Location Details */}
                            <div className="border-t pt-3 mb-5">
                                <h3 className="text-lg font-semibold mb-2 text-gray-800">Location Details</h3>
                                <p><strong>Address:</strong> {selectedBusiness.locationDetails?.address}</p>
                                <p><strong>Area:</strong> {selectedBusiness.locationDetails?.area}</p>
                                <p><strong>City:</strong> {selectedBusiness.locationDetails?.city}</p>
                                <p><strong>Pincode:</strong> {selectedBusiness.locationDetails?.pincode}</p>
                                <p><strong>Landmark:</strong> {selectedBusiness.locationDetails?.landmark}</p>
                                {selectedBusiness.locationDetails?.mapLink && (
                                    <a
                                        href={selectedBusiness.locationDetails.mapLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 underline"
                                    >
                                        View on Map
                                    </a>
                                )}
                            </div>

                            {/* Highlights */}
                            {selectedBusiness.highlights?.length > 0 && (
                                <div className="border-t pt-3 mb-5">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Highlights</h3>
                                    <ul className="list-disc list-inside text-gray-700">
                                        {selectedBusiness.highlights.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Reviews */}
                            {selectedBusiness.reviews?.userReviews && (
                                <div className="border-t pt-3 mb-5">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">User Reviews</h3>
                                    {selectedBusiness.reviews.userReviews.map((rev, i) => (
                                        <div key={i} className="border rounded-lg p-3 mb-3">
                                            <p className="font-semibold">{rev.name} ({rev.date})</p>
                                            <p className="text-gray-700">{rev.text}</p>
                                            <p className="text-sm text-gray-500">Highlights: {rev.highlight}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Gallery */}
                            {selectedBusiness.media?.mainImages?.length > 0 && (
                                <div className="border-t pt-3 mb-5">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Gallery</h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                        {selectedBusiness.media.mainImages.map((img, i) => (
                                            <img
                                                key={i}
                                                src={img.url}
                                                alt={img.alt}
                                                className="rounded-lg w-full h-32 object-cover"
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Meta Info */}
                            {selectedBusiness.meta && (
                                <div className="border-t pt-3 mb-5">
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Info</h3>
                                    <p><strong>Status:</strong> {selectedBusiness.meta.status}</p>
                                    <p><strong>Verified Listing:</strong> {selectedBusiness.meta.verifiedListing ? "Yes ✅" : "No ❌"}</p>
                                    <p><strong>Last Updated:</strong> {new Date(selectedBusiness.meta.lastUpdated).toLocaleString()}</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyBusinessPage;
