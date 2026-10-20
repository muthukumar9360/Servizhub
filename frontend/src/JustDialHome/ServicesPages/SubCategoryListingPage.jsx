import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BusinessHeaderSection from "../BusinessHeaderSection";

const Breadcrumb = ({ subTitle }) => {
  const navigate = useNavigate();

  return (
    <p className="text-lg text-gray-500 pt-2 flex flex-wrap gap-1">
      <span
        onClick={() => navigate(-1)}
        className="cursor-pointer flex text-blue-800 hover:text-black hover:underline transform hover:scale-105">Home</span>
      <span>&gt;</span>
      <span className="text-black">{subTitle || "Subcategory"}</span>
    </p>
  );
};

const FilterButton = ({ label, icon, isSelected = false }) => (
  <button
    className={`flex items-center px-3 py-1.5 text-sm rounded-lg border transition duration-150 ${isSelected
      ? "bg-blue-600 text-white border-blue-600 font-semibold"
      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
  >
    {icon && <span className="mr-1">{icon}</span>}
    {label}
    {(!isSelected &&
      (label.includes("Sort") ||
        label.includes("Occasion") ||
        label.includes("Type") ||
        label.includes("Ratings") ||
        label.includes("Deals"))) && <span className="ml-1 text-xs">▼</span>}
  </button>
);

// ListingCard: adapted to new schema but fallback to old fields
const ListingCard = ({
  _id,
  name,
  ratings,
  status,
  claimed,
  extraInfo,
  locationDetails,
  media,
  tags,
  contactDetails,
  imageUrl,
  userId,
  isLiked,
  isSaved,
  onUpdateLists
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(!!isLiked);
  const [saved, setSaved] = useState(!!isSaved);
  console.log("status:", status, "claimed:", claimed);

  const api = import.meta.env.VITE_SERVER_URL;

  // normalize id (string)
  const listingId = _id?.$oid || _id;

  // support new schema (ratings.overall, ratings.total) but fallback to old rating/numRatings
  const overall = ratings?.overall ?? 0;
  const total = ratings?.total ?? 0;

  const image =
    media?.mainImages?.[0]?.url ||
    imageUrl ||
    "/placeholder.jpg";

  const locationText =
    locationDetails?.area && locationDetails?.city
      ? `${locationDetails.area}, ${locationDetails.city}`
      : "";

  // contact fallback
  const phone = contactDetails?.phone || "";
  const wa = contactDetails?.whatsapp || "";

  const handleClick = () => {
    navigate(`/SubcategoryDetails/${listingId}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    const newLiked = !liked;
    setLiked(newLiked);
    try {
      const url = `${api}/favourites/${newLiked ? "add" : "remove"}`;
      const method = newLiked ? "POST" : "DELETE";
      await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, businessId: listingId }),
      });
      onUpdateLists?.();
    } catch (err) {
      console.error("Error updating like:", err);
      setLiked(!newLiked); // rollback
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    const newSaved = !saved;
    setSaved(newSaved);
    try {
      const url = `${api}/saved/${newSaved ? "add" : "remove"}`;
      const method = newSaved ? "POST" : "DELETE";
      await fetch(url, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, businessId: listingId }),
      });
      onUpdateLists?.();
    } catch (err) {
      console.error("Error updating save:", err);
      setSaved(!newSaved);
    }
  };

  return (
    <div
      className="relative flex border p-4 border-gray-200 rounded-lg bg-white mb-6 cursor-pointer hover:shadow-2xl hover:scale-105 transition-all duration-300"
      onClick={handleClick}
    >
      <div className="w-96 h-56 flex-shrink-0 relative overflow-hidden rounded-md">
        <img src={image} alt={name} className="w-full h-full object-fill" />
      </div>

      <div className="flex-grow flex flex-col gap-3 ml-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{name}</h3>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 text-white text-sm font-semibold rounded ${overall >= 4 ? "bg-green-600" : "bg-yellow-500"
              }`}
          >
            {overall}★
          </span>
          <span className="text-sm text-gray-600">{total} Ratings</span>
          {status === "Verified" && (
            <span className="text-xs text-blue-600 font-medium">Verified</span>
          )}
          {claimed === true && (
            <span className="text-xs text-red-600 font-medium">Trending</span>
          )}
        </div>

        <div className="text-sm text-gray-700 mb-2">
          📍 <p className="inline">{locationText}</p>
          {extraInfo && (
            <p className="text-xs text-orange-500 font-medium inline ml-3">{extraInfo}</p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags?.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs text-gray-600 bg-gray-100 border border-gray-300 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button className="flex items-center px-3 py-1 text-sm rounded-md bg-green-700 text-white font-medium hover:bg-green-800">
            📞 {phone}
          </button>
          {wa && (
            <button className="flex items-center px-3 py-1 text-sm rounded-md bg-green-500 text-white font-medium hover:bg-green-600">
              💬 WhatsApp
            </button>
          )}
          <button className="flex items-center px-3 py-1 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">
            Get Best Deal
          </button>
        </div>
      </div>

      <div className="absolute top-5 right-5 flex space-x-2">
        <button
          onClick={handleSave}
          className={`px-5 py-1 rounded-full shadow-md transition-all duration-200 ${saved
            ? "bg-blue-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          title={saved ? "Saved" : "Save"}
        >
          <i className={`fa${saved ? "s" : "r"} fa-bookmark text-lg`} />
        </button>

        <button
          onClick={handleLike}
          className={`px-4 py-3 rounded-full shadow-md transition-all duration-200 ${liked
            ? "bg-red-600 text-white"
            : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          title={liked ? "Liked" : "Like"}
        >
          <i className={`fa${liked ? "s" : "r"} fa-heart text-lg`} />
        </button>
      </div>
    </div>
  );
};

const SubcategoryListingPage = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [subInfo, setSubInfo] = useState(null);
  const [otherSubcategories, setOtherSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [likedItems, setLikedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [username, setUsername] = useState("");
  // 🔐 OTP flow states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const api = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user._id);
          setUsername(data.user.username);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
  }, [api]);

  useEffect(() => {
    if (!id) return;
    fetch(`${api}/business/subcategory/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubInfo(data.subcategory);
        setListings(data.listings || []);
        setOtherSubcategories(data.otherSubcategories || []);
      })
      .catch((err) => console.error("Error fetching subcategory:", err));
  }, [id, api]);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      fetch(`${api}/favourites/${userId}`).then((res) => res.json()).catch(() => []),
      fetch(`${api}/saved/${userId}`).then((res) => res.json()).catch(() => [])
    ])
      .then(([favs = [], savedList = []]) => {
        setLikedItems(favs.map((item) => item.businessId));
        setSavedItems(savedList.map((item) => item.businessId));
      })
      .catch((err) => console.error("Error fetching liked/saved:", err));
  }, [userId, api]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // 📩 Send OTP
  const handleSendOtp = async () => {
    if (!name || !email) {
      setErrorMsg("Please enter name and email");
      return;
    }

    try {
      setSendingOtp(true);
      setErrorMsg("");

      const res = await fetch(`${api}/business-email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setShowOtpModal(true);
      setResendTimer(30); // 30 sec cooldown
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSendingOtp(false);
    }
  };

  // ✅ Verify OTP & send PDF
  const handleVerifyOtp = async () => {
    if (!otp) {
      setErrorMsg("Enter OTP");
      return;
    }

    try {
      setVerifyingOtp(true);
      setErrorMsg("");

      const res = await fetch(`${api}/business-email/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          otp,
          subCategoryId: id,
          name,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");

      setShowOtpModal(false);
      setSuccessMsg("✅ Business list sent to your email!");
      setName("");
      setEmail("");
      setOtp("");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setVerifyingOtp(false);
    }
  };

  // 🔁 Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;

    try {
      const res = await fetch(`${api}/business-email/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      await res.json();
      setResendTimer(30);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-blue-400 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-6 border-4 border-blue-200 border-t-transparent rounded-full animate-spin animation-delay-300"></div>
        </div>
        <div className="text-2xl font-extrabold text-black animate-pulse flex items-center">
          Loading Business Details ...
        </div>
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce animation-delay-150"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce animation-delay-300"></div>
        </div>
      </div>
    );

  return (
    <>
      <BusinessHeaderSection />
      <div className="p-4 md:p-6 bg-gray-50 font-sans min-h-screen">
        <Breadcrumb subTitle={subInfo?.title} />

        <div className="flex flex-wrap gap-2 py-2 border-y border-gray-200 mb-2">
          <FilterButton label="Sort by" />
          <FilterButton label="Occasion" />
          <FilterButton label="Type" />
          <FilterButton label="Top Rated" icon="⭐" />
          <FilterButton label="Quick Response" icon="⚡" />
          <FilterButton label="Verified" icon="✅" />
          <FilterButton label="Ratings" />
          <FilterButton label="Deals" icon="🏷️" />
          <FilterButton label="Trust" icon="🛡️" />
          <FilterButton label="All Filters" isSelected={true} icon="⚙️" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-5">
          <span className="underline">{subInfo?.title} </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-3/4 ml-5">
            {listings.length > 0 ? (
              listings.map((listing, index) => {
                const listingId = listing._id?.$oid || listing._id || index;
                return (
                  <ListingCard
                    key={listingId}
                    {...listing}
                    userId={userId}
                    isLiked={likedItems.includes(listingId)}
                    isSaved={savedItems.includes(listingId)}
                    onUpdateLists={() => {
                      fetch(`${api}/favourites/${userId}`)
                        .then((r) => r.json())
                        .then((data) => setLikedItems(data.map((d) => d.businessId)))
                        .catch(() => { });
                      fetch(`${api}/saved/${userId}`)
                        .then((r) => r.json())
                        .then((data) => setSavedItems(data.map((d) => d.businessId)))
                        .catch(() => { });
                    }}
                  />
                );
              })
            ) : (
              <p className="text-gray-500">No listings found for this category.</p>
            )}
          </div>

          <div className="ml-5 w-full lg:w-1/4 sticky top-4 self-start space-y-6">

            <div className="p-4 bg-white rounded shadow">
              <p className="font-semibold mb-3">
                Get list of {subInfo?.title} on email
              </p>

              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded mb-3"
              />

              {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}
              {successMsg && <p className="text-green-600 text-sm mb-2">{successMsg}</p>}

              <button
                onClick={handleSendOtp}
                disabled={sendingOtp}
                className="w-full py-2 bg-blue-600 text-white rounded"
              >
                {sendingOtp ? "Sending OTP..." : "Get Business List"}
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-4">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                People Also Search For
              </h2>

              <div className="space-y-3">
                {otherSubcategories.length > 0 ? (
                  otherSubcategories.map((sub, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0 overflow-hidden rounded-md mr-3">
                          <img
                            src={sub.image}
                            alt={sub.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800 leading-tight">
                            {sub.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            Explore
                          </p>
                        </div>
                      </div>
                      <button className="text-xs py-1 px-2 bg-blue-100 text-blue-600 border border-blue-600 rounded-md font-semibold hover:bg-blue-200 transition duration-150">
                        Get Best Deal
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-sm">No recommendations available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🔐 OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="text-xl font-bold text-center mb-2">Verify OTP</h2>
            <p className="text-sm text-center mb-3">
              OTP sent to <b>{email}</b>
            </p>

            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full border p-2 rounded mb-3 text-center"
            />

            {errorMsg && <p className="text-red-500 text-sm mb-2">{errorMsg}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp}
              className="w-full py-2 bg-green-600 text-white rounded"
            >
              {verifyingOtp ? "Verifying..." : "Verify & Send"}
            </button>

            <button
              onClick={handleResendOtp}
              disabled={resendTimer > 0}
              className="w-full mt-2 text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              {resendTimer > 0
                ? `Resend OTP in ${resendTimer}s`
                : "Resend OTP"}
            </button>

            <button
              onClick={() => setShowOtpModal(false)}
              className="w-full mt-2 text-sm text-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SubcategoryListingPage;
