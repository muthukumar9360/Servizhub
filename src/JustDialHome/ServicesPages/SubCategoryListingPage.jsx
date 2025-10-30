import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import BusinessHeaderSection from "../BusinessHeaderSection";

const Breadcrumb = ({ subTitle }) => {
  const navigate = useNavigate();

  return (
    <p className="text-lg text-gray-500 pt-2 flex flex-wrap gap-1">
      <span
        onClick={() => navigate(-1)} // navigate to previous page
        className="cursor-pointer fiex text-blue-800 hover:text-black hover:underline transform hover:scale-105"
      >
        Home
      </span>
      <span>&gt;</span>
      <span className="text-black">{subTitle || "Subcategory"}</span>
    </p>
  );
};
// --- Reusable Components ---

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

const ListingCard = ({
  _id,
  name,
  rating,
  numRatings,
  location,
  badges,
  tags,
  contact,
  whatsapp,
  imageUrl,
  extraInfo,
  userId,
  isLiked,
  isSaved,        // ✅ add these
  onUpdateLists
}) => {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);

  const api = import.meta.env.VITE_SERVER_URL;

  const handleClick = () => {
    navigate(`/SubcategoryDetails/${_id}`);
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
        body: JSON.stringify({ userId, businessId: _id }),
      });

      onUpdateLists();
    } catch (err) {
      console.error("Error updating like:", err);
      setLiked(!newLiked); // rollback on error
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
        body: JSON.stringify({ userId, businessId: _id }),
      });

      onUpdateLists();
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
      {/* Image Section with Like/Save Icons */}
      <div className="w-96 h-56 flex-shrink-0 relative overflow-hidden rounded-md">
        <img src={imageUrl} alt={name} className="w-full h-full object-fill" />

      </div>

      {/* Listing Details */}
      <div className="flex-grow flex flex-col gap-3 ml-10">
        <h3 className="text-3xl font-bold text-gray-900 mb-2">{name}</h3>

        <div className="flex items-center space-x-2">
          <span
            className={`px-2 py-0.5 text-white text-sm font-semibold rounded ${rating >= 4 ? "bg-green-600" : "bg-yellow-500"
              }`}
          >
            {rating}★
          </span>
          <span className="text-sm text-gray-600">{numRatings} Ratings</span>
          {badges?.includes("Verified") && (
            <span className="text-xs text-blue-600 font-medium">Verified</span>
          )}
          {badges?.includes("Trending") && (
            <span className="text-xs text-red-600 font-medium">Trending</span>
          )}
        </div>

        <div className="text-sm text-gray-700 mb-2">
          📍 <p className="inline">{location}</p>
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
            📞 {contact}
          </button>
          {whatsapp && (
            <button className="flex items-center px-3 py-1 text-sm rounded-md bg-green-500 text-white font-medium hover:bg-green-600">
              💬 WhatsApp
            </button>
          )}
          <button className="flex items-center px-3 py-1 text-sm rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700">
            Get Best Deal
          </button>
        </div>
      </div>
      {/* Icons on top-right */}
      <div className="absolute top-5 right-5 flex space-x-2">
        {/* Save icon */}
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

        {/* Like icon */}
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


// --- Main Page ---

const SubcategoryListingPage = () => {
  const { id } = useParams();
  const [listings, setListings] = useState([]);
  const [subInfo, setSubInfo] = useState(null);
  const [otherSubcategories, setOtherSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [likedItems, setLikedItems] = useState([]);
  const [savedItems, setSavedItems] = useState([]);

  const api = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    // 1️⃣ Fetch session user
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId(data.user._id);
          setUsername(data.user.username);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
  }, []); // run once


  useEffect(() => {
    // 2️⃣ Fetch subcategory info
    if (!id) return;

    fetch(`${api}/business/subcategory/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setSubInfo(data.subcategory);
        setListings(data.listings || []);
        setOtherSubcategories(data.otherSubcategories || []);
      })
      .catch((err) => console.error("Error fetching subcategory:", err));
  }, [id]);


  // 3️⃣ Separate effect: run only after userId is ready
  useEffect(() => {
    if (!userId) return;

    Promise.all([
      fetch(`${api}/favourites/${userId}`).then((res) => res.json()),
      fetch(`${api}/saved/${userId}`).then((res) => res.json()),
    ])
      .then(([favs, savedList]) => {
        setLikedItems(favs.map((item) => item.businessId));
        setSavedItems(savedList.map((item) => item.businessId));
      })
      .catch((err) => console.error("Error fetching liked/saved:", err));
  }, [userId]);

  setTimeout(() => setLoading(false), 2000); // 1500 milliseconds = 1.5 seconds

  if (loading)
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        {/* Rotating Circles */}
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-blue-400 border-t-transparent rounded-full animate-spin animation-delay-150"></div>
          <div className="absolute inset-6 border-4 border-blue-200 border-t-transparent rounded-full animate-spin animation-delay-300"></div>
        </div>

        {/* Pulsating Text */}
        <div className="text-2xl font-extrabold text-black animate-pulse flex items-center">
          Loading Business Details ...
        </div>

        {/* Bouncing Dots */}
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
        <h1 className="text-2xl font-bold text-gray-900">
          {subInfo?.title} <span className="text-lg text-gray-500">({listings.length}+ Listings)</span>
        </h1>
        <p className="text-base text-gray-700 mb-3">
          Get the list of top {subInfo?.title}
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 py-3 border-y border-gray-200 mb-6">
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

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: Listings */}
          <div className="w-full lg:w-3/4 ml-5">
            {listings.length > 0 ? (
              listings.map((listing, index) => (
                <ListingCard
                  key={index}
                  {...listing}
                  userId={userId}
                  isLiked={likedItems.includes(listing._id)}
                  isSaved={savedItems.includes(listing._id)}
                  onUpdateLists={() => {
                    // after like/unlike, refetch lists
                    fetch(`${api}/favourites/${userId}`)
                      .then((r) => r.json())
                      .then((data) => setLikedItems(data.map((d) => d.businessId)));

                    fetch(`${api}/saved/${userId}`)
                      .then((r) => r.json())
                      .then((data) => setSavedItems(data.map((d) => d.businessId)));
                  }}
                />
              ))
            ) : (
              <p className="text-gray-500">No listings found for this category.</p>
            )}
          </div>

          {/* Right: Sidebar */}
          <div className="ml-5 w-full lg:w-1/4 sticky top-4 self-start space-y-6">
            {/* Get Best Deal Box */}
            <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
              <p className="text-base text-gray-700 mb-3">
                Get the list of top {subInfo?.title}
              </p>
              <p className="text-xs text-gray-500 mb-4">
                We'll send you contact details instantly
              </p>

              <input
                type="text"
                placeholder="Your Name"
                className="w-full p-2 border border-gray-300 rounded-md mb-3 text-sm"
              />
              <input
                type="tel"
                placeholder="Your Phone Number"
                className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm"
              />
              <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition">
                Get Best Deal &gt;&gt;
              </button>
            </div>

            {/* Other Subcategories / Recommended */}
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
                            {sub.listings?.length || 0}+ listings
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
    </>
  );
};


export default SubcategoryListingPage;
