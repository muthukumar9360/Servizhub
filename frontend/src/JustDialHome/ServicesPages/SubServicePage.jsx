import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import BusinessHeaderSection from '../BusinessHeaderSection';

const Breadcrumb = ({ subTitle }) => {
    const navigate = useNavigate();

    return (
        <p className="text-lg mx-8 my-3 text-black flex flex-wrap gap-1">
            <span
                onClick={() => navigate(-1)}
                className="cursor-pointer fiex text-blue-800 hover:text-black hover:underline transform hover:scale-105"
            >
                Home
            </span>
            <span>&gt;</span>
            <span className="text-black">{subTitle || "Subcategory"}</span>
        </p>
    );
};

const fetchBusinessData = async (businessId) => {
    const api = import.meta.env.VITE_SERVER_URL;
    const response = await fetch(`${api}/businesslist/${businessId}`);
    const data = await response.json();
    // small delay to keep UX consistent with previous behavior
    await new Promise(resolve => setTimeout(resolve, 300));
    return data;
};

const ImageGallery = ({ images = [], totalPhotos = 0 }) => {
    const mainImage = images[0] || { url: '/placeholder/default_hall.jpg', alt: '' };
    const sideImages = images.slice(1, 4);
    const remaining = Math.max(0, totalPhotos - 4);

    return (
        <div className="flex space-x-2 h-80 mb-4">
            <div className="w-2/4 h-full overflow-hidden rounded-lg">
                <img src={mainImage.url} alt={mainImage.alt} className="w-full h-full object-cover" />
            </div>

            <div className="w-1/2 h-full grid grid-cols-2 grid-rows-2 gap-2 relative">
                {sideImages.map((img, index) => (
                    <div key={index} className="overflow-hidden rounded-lg">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                ))}
                <div className="relative overflow-hidden rounded-lg">
                    <img src={images[4]?.url || '/placeholder/default_hall.jpg'} alt="More" className="w-full h-full object-cover opacity-60" />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg bg-black bg-opacity-30">
                        {remaining > 0 ? `+${remaining} More` : 'Add More Photo'}
                    </div>
                </div>

                <span className="absolute bottom-2 right-2 text-white text-2xl cursor-pointer">
                    <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                        <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

const NavigationTabs = ({ activeTab, onTabChange }) => {
    const tabs = ['Overview', 'Services', 'Photos', 'Explore', 'Reviews'];
    return (
        <div className="flex space-x-6 border-b border-gray-200 mt-4 overflow-x-auto whitespace-nowrap">
            {tabs.map((tab) => (
                <button
                    key={tab}
                    onClick={() => onTabChange(tab)}
                    className={`pb-2 text-md font-semibold transition duration-150 ${tab === activeTab
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-gray-800'
                        }`}
                >
                    {tab}
                </button>
            ))}
        </div>
    );
};

const UserReviewCard = ({ review }) => {
    return (
        <div className="p-4 border-b border-gray-500 last:border-b-0">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${review.userImage?.length === 1 ? 'bg-gray-300 text-gray-700 font-bold' : 'bg-gray-200'}`}>
                        {review.userImage?.length === 1 ? review.userImage : <img src={review.userImage} alt={review.name} className="w-full h-full object-cover rounded-full" />}
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">{review.name}</p>
                        <p className="text-xs text-gray-500">{review.reviewsCount} reviews</p>
                    </div>
                </div>
                <span className="text-xs text-gray-500">{review.date}</span>
            </div>

            <div className="text-red-500 text-lg mb-2">★★★★★ <span className="text-sm font-semibold text-gray-800 ml-1">1</span></div>

            {review.highlight && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {review.highlight.split(',').map((h, i) => (
                        <span key={i} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-300">{h.trim()}</span>
                    ))}
                </div>
            )}

            <p className="text-sm text-gray-700 mb-3 line-clamp-4">{review.text}</p>

            <div className="flex space-x-4 text-sm text-gray-600">
                <button className="flex items-center hover:text-blue-600"><span className="mr-1">👍</span>Helpful</button>
                <button className="flex items-center hover:text-blue-600"><span className="mr-1">💬</span>Comment</button>
                <button className="flex items-center hover:text-blue-600"><span className="mr-1">🔗</span>Share</button>
            </div>
        </div>
    )
};

const FloatingFooterBar = ({ business }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 600) {
                setShow(true);
            } else {
                setShow(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // defensive reads
    const bName = business?.name ?? "";
    const overall = business?.ratings?.overall ?? business?.rating ?? 0;
    const total = business?.ratings?.total ?? business?.numRatings ?? 0;
    const phone = business?.contactDetails?.phone ?? business?.contactNumber ?? "";

    return (
        <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-2xl z-50 transition-transform duration-300 ${show ? 'translate-y-0' : 'translate-y-full'}`}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center">
                    <p className="text-base font-bold text-gray-900 mr-3">{bName}</p>
                    <div className="flex items-center text-sm">
                        <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded mr-1">{overall}</span>
                        <span className="text-gray-600 mr-2">{total} Ratings</span>
                        {business?.status === 'Verified' && <span className="text-blue-600 font-medium mr-2">Verified</span>}
                        {business?.claimed && <span className="text-orange-600 font-medium">Claimed</span>}
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button className="flex items-center bg-green-700 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800 transition">
                        <span className="mr-1">📞</span>{phone}
                    </button>
                    <button className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">
                        Enquire Now
                    </button>
                    <button className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition">
                        <span className="mr-1">💬</span> WhatsApp
                    </button>
                    <button className="text-gray-500 hover:text-gray-700"><span className="text-xl">💾</span></button>
                    <button className="text-gray-500 hover:text-gray-700"><span className="text-xl">🔗</span></button>
                </div>
            </div>
        </div>
    );
}

const SubServicePage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('Overview');
    const { id } = useParams();
    const [saved, setSaved] = useState(true);
    const [liked, setLiked] = useState(true);

    const handleLike = (e) => {
        e.stopPropagation();
        setLiked(!liked);
    };

    const handleSave = (e) => {
        e.stopPropagation();
        setSaved(!saved);
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const fetchedData = await fetchBusinessData(id);
                setData(fetchedData);
                setError(null);
            } catch (err) {
                console.error("Failed to fetch business data:", err);
                setError("Failed to load business details. Please try again.");
                setData(null);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

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

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600 font-semibold text-lg">
                {error}
            </div>
        );
    }

    if (!data) return null;

    // New schema: ratings and contactDetails; fallback to old fields for safety
    const {
        media = {},
        operatingHours,
        overview = {},
        reviews = {},
        locationDetails = {},
        name,
        ratings,
        rating, // fallback
        numRatings, // fallback
        status,
        claimed,
        contactDetails,
        contactNumber
    } = data;

    const overall = ratings?.overall ?? rating ?? (reviews?.jdRating ?? 0);
    const total = ratings?.total ?? numRatings ?? (reviews?.totalReviews ?? 0);
    const phone = contactDetails?.phone ?? contactNumber ?? overview?.contact ?? "";

    const business = {
        name,
        operatingHours,
        overview,
        reviews,
        media,
        rating: overall,
        numRatings: total,
        status,
        claimed,
        contactNumber: phone,
        locationDetails
    };

    const YouMightExplore = ({ categories = [] }) => (
        <div className="mt-8 border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">You might want to explore</h3>
                <button className="text-blue-600 text-sm font-medium hover:underline">View all</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {categories.map((cat) => (
                    <span key={cat} className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200">{cat}</span>
                ))}
            </div>

            <h4 className="text-lg font-bold text-gray-900 mt-6 mb-4">Recommended</h4>
            <div className="space-y-4">
                {(overview.relatedListings || []).map((listing, index) => (
                    <div key={index} className="flex p-3 border border-gray-200 rounded-lg bg-white shadow-sm">
                        <div className="w-16 h-16 mr-3 flex-shrink-0">
                            <img src={listing.imageUrl} alt={listing.name} className="w-full h-full object-cover rounded-md" />
                        </div>
                        <div className="flex-grow">
                            <p className="text-base font-semibold text-gray-900">{listing.name}</p>
                            <div className="flex items-center text-sm">
                                <span className="bg-green-600 text-white font-bold px-1.5 py-0.5 rounded mr-2">{listing.rating}★</span>
                                <span className="text-gray-600 mr-2">{listing.reviews} Ratings</span>
                                {listing.verified && <span className="text-blue-600 font-medium">Verified</span>}
                                {listing.trust && <span className="text-orange-600 font-medium ml-2">Trust</span>}
                            </div>
                            <p className="text-xs text-gray-500">{listing.distance}, {listing.location}</p>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                            <button className="text-sm py-1 px-2 bg-green-700 text-white rounded-md">Show Number</button>
                            <button className="text-sm py-1 px-2 bg-green-500 text-white rounded-md flex items-center justify-center">💬 WhatsApp</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    const ReviewsContent = () => (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Our Happy Customers</h2>
            <div className="flex space-x-4 border-b border-gray-200 pb-2">
                {['Relevant', 'Latest', 'High to Low'].map(sort => (
                    <button key={sort} className={`text-sm font-semibold pb-1 ${sort === 'Relevant' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}>
                        {sort}
                    </button>
                ))}
            </div>

            <div className="space-y-6">
                {(reviews.list || reviews.userReviews || []).map((review, index) => <UserReviewCard key={index} review={review} />)}
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Reviews & Ratings</h3>
                <div className="flex items-center mb-4">
                    <span className="text-3xl font-bold text-green-600 mr-2">{overall}</span>
                    <span className="text-lg text-gray-600">Rating index based on {total} ratings across the web</span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 mb-3">Start your Review</h4>
                <div className="flex space-x-2 text-3xl text-gray-300 mb-4"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div>
            </div>
        </div>
    );

    const Sidebar = () => (
        <div className="w-full lg:w-1/3 space-y-6 sticky top-4 self-start">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Contact</h3>
                <p className="text-blue-600 text-base font-medium mb-4 flex items-center"><span className="mr-2">📞</span>{phone}</p>

                <h3 className="text-lg font-bold text-gray-900 mb-3">Address</h3>
                <p className="text-sm text-gray-700 font-semibold">{overview.addressDetails?.name}</p>
                <p className="text-sm text-gray-600">{overview.addressDetails?.line2}</p>

                <div className="mt-4 border-t border-gray-100 pt-4">
                    <button className="text-blue-600 text-sm font-medium hover:underline">Get Directions</button>
                    <p className="mt-2 text-sm text-gray-700">Open 24 Hrs <span className="text-xs text-gray-500">▼</span></p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Suggest New Timings</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Send Enquiry by Email</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Get info via SMS/email</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Share</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Tap to rate</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Edit this Listing</p>
                    <p className="mt-2 text-sm text-blue-600 hover:underline cursor-pointer">Add Website</p>
                    <p className="mt-4 text-xs text-gray-500">GSTIN : {data.contactDetails?.gstin ?? data.contactDetails?.gst ?? "—"}</p>
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-700 mb-3">Get the List of {overview?.banquetType?.join(', ') || 'Banquet Halls'}</p>
                <p className="text-xs text-gray-500 mb-4">We'll send you contact details in seconds for free</p>

                <h4 className="text-sm font-semibold mb-2">What type of Banquet Halls looking for?</h4>
                <div className="flex gap-4 mb-4">
                    <label className="flex items-center text-sm text-gray-700">
                        <input type="radio" name="ac_type" value="AC" defaultChecked className="mr-1" /> AC
                    </label>
                    <label className="flex items-center text-sm text-gray-700">
                        <input type="radio" name="ac_type" value="Non AC" className="mr-1" /> Non AC
                    </label>
                </div>

                <input type="text" placeholder="Your name" className="w-full p-2 border border-gray-300 rounded-md mb-3 text-sm" />
                <input type="tel" placeholder="Phone number" className="w-full p-2 border border-gray-300 rounded-md mb-4 text-sm" />

                <button className="w-full py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition">
                    Get Best Deal &gt;&gt;
                </button>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-3">Also listed in</h4>
                <div className="space-y-2">
                    {(reviews.alsoListedIn || []).map((item, index) => (
                        <p key={index} className="text-sm text-blue-600 hover:underline cursor-pointer">
                            {item.category} {item.count}
                        </p>
                    ))}
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">More</p>
                </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="text-xs text-gray-500 mb-3">Help us to make listings more updated and relevant for you.</p>
                <button className="text-sm py-2 px-4 border border-gray-400 text-gray-700 font-semibold rounded-md hover:bg-gray-100">Report Now</button>
            </div>
        </div>
    );

    let mainContent;
    if (activeTab === 'Overview') {
        mainContent = (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center"><span className="mr-2">✔️</span>Occasion</h3>
                        <p className="text-sm text-gray-600">{(overview.occasion || []).join(', ')}</p>
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 mb-2 flex items-center"><span className="mr-2">✔️</span>Banquet Type</h3>
                        <p className="text-sm text-gray-600">{(overview.banquetType || []).join(', ')}</p>
                    </div>
                    <button className="text-blue-600 text-sm font-medium hover:underline justify-self-start mt-4 md:col-span-2">View all</button>
                </div>

                <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Photos</h3>
                    <div className="flex space-x-4 overflow-x-auto pb-3">
                        {(media.photoCategories || []).map((cat, index) => (
                            <div key={index} className="flex-shrink-0 text-center">
                                <div className="w-20 h-20 overflow-hidden rounded-lg bg-gray-100 mb-1">
                                    <img src={`/path/to/cat_preview_${index}.jpg`} alt={cat.name} className="w-full h-full object-cover" />
                                </div>
                                <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                                <p className="text-xs text-gray-500">{cat.count} Photos</p>
                            </div>
                        ))}
                    </div>
                    <button className="mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Upload Photos</button>
                </div>

                <div className="relative w-full h-32 overflow-hidden rounded-lg bg-pink-600 flex items-center justify-between p-4">
                    <h3 className="text-xl text-white font-bold">Find vendors for your <br /> Dream Wedding</h3>
                    <button className="py-2 px-4 bg-white text-pink-600 font-bold rounded-lg hover:bg-gray-100">Explore Now →</button>
                    <div className="absolute inset-y-0 right-0 w-1/3 opacity-70">
                        <img src="/path/to/wedding_background.jpg" alt="Wedding" className="w-full h-full object-cover" />
                    </div>
                </div>

                <YouMightExplore categories={overview.exploreCategories || []} />
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Our Happy Customers</h3>
                    <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm max-w-sm">
                        <UserReviewCard review={(reviews.list || reviews.userReviews || [])[0] || {}} />
                        <button className="text-blue-600 text-sm font-medium hover:underline mt-2">...More</button>
                    </div>
                </div>

                <div className="mt-8 p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Reviews & Ratings</h3>
                    <div className="flex items-center mb-4">
                        <span className="text-3xl font-bold text-green-600 mr-2">{overall}</span>
                        <span className="text-lg text-gray-600">Rating index based on {total} ratings across the web</span>
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-3">Start your Review</h4>
                    <div className="flex space-x-2 text-3xl text-gray-300 mb-4"><span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span></div>
                    <p className="text-blue-600 text-sm font-medium hover:underline">See All Reviews</p>
                </div>

                <div className="mt-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4 text-sm text-gray-700">
                        {(overview.faq || []).slice(0, 2).map((item, index) => (
                            <div key={index} className="border-b border-gray-100 pb-2">
                                <p className="font-semibold text-gray-900 mb-1">Q: {item.q}</p>
                                <p className="text-gray-600">A: {item.a}</p>
                            </div>
                        ))}
                        <p className="text-blue-600 text-sm font-medium hover:underline">View All {overview.faq?.length || 0} Questions</p>
                    </div>
                </div>
            </div>
        );
    } else if (activeTab === 'Reviews') {
        mainContent = <ReviewsContent />;
    } else if (activeTab === 'Photos') {
        mainContent = (
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900">Photos</h3>
                <div className="flex space-x-4 overflow-x-auto pb-3">
                    {(media.photoCategories || []).map((cat, index) => (
                        <div key={index} className="flex-shrink-0 text-center">
                            <div className="w-20 h-20 overflow-hidden rounded-lg bg-gray-100 mb-1">
                                <img src={`/path/to/cat_preview_${index}.jpg`} alt={cat.name} className="w-full h-full object-cover" />
                            </div>
                            <p className="text-sm font-medium text-gray-800">{cat.name}</p>
                            <p className="text-xs text-gray-500">{cat.count} Photos</p>
                        </div>
                    ))}
                </div>
                <button className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">Upload Photos</button>
                <YouMightExplore categories={overview.exploreCategories || []} />
            </div>
        );
    } else {
        mainContent = <div className="text-center p-10 text-gray-500">Content for {activeTab} tab goes here...</div>;
    }

    return (
        <>
            <div className="font-sans bg-gray-50 min-h-screen pb-20">
                <BusinessHeaderSection />
                <Breadcrumb subTitle={data.name} />

                <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-2xl border border-gray-500 px-4 md:p-6">
                        <ImageGallery images={media.mainImages} totalPhotos={media.totalPhotos} />

                        <div className="border-b border-gray-200">
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">{business.name}</h1>
                            <div className="flex items-center mb-3 text-sm">
                                <span className="bg-green-600 text-white font-bold px-2 py-0.5 rounded mr-2">{overall}★</span>
                                <span className="text-gray-600 mr-2">{total} Ratings</span>
                                {business.status === 'Verified' && <span className="text-blue-600 font-medium mr-2">Verified</span>}
                                {business.claimed && <span className="text-orange-600 font-medium">Claimed</span>}
                            </div>
                            <p className="text-sm text-gray-700 mb-3">{business.locationDetails?.address} ( {business.operatingHours} )</p>

                            <div className="flex flex-wrap gap-3">
                                <button className="flex items-center bg-green-700 text-white font-bold py-2 px-4 rounded-md hover:bg-green-800 transition">
                                    <span className="mr-1">📞</span>{phone}
                                </button>
                                <button className="flex items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition">
                                    Enquire Now
                                </button>
                                <button className="flex items-center bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 transition">
                                    <span className="mr-1">💬</span> WhatsApp
                                </button>
                                <div className="flex space-x-3 text-gray-500 text-xl items-center ml-2">
                                    <span className="cursor-pointer hover:text-gray-700" title="Click to Rate">☆</span>
                                    <span className="cursor-pointer hover:text-gray-700" title="Edit Listing">✏️</span>
                                    <span className="cursor-pointer hover:text-gray-700" title="Share">🔗</span>
                                </div>
                            </div>
                        </div>

                        <NavigationTabs activeTab={activeTab} onTabChange={setActiveTab} />
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 mt-6">
                        <div className="w-full lg:w-2/3">
                            {mainContent}
                        </div>

                        <Sidebar />
                    </div>
                </main>

                <FloatingFooterBar business={business} />
            </div>
        </>
    );
};

export default SubServicePage;
