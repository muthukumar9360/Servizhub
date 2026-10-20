import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import SampleImg from "./assets/image.png";
import FooterSection from "../HomeSections/FooterSection";
import { Typewriter } from "react-simple-typewriter";

const ServiceInfo = () => {
    const { id } = useParams();
    const [service, setService] = useState(null);
    const [faqs, setFaqs] = useState([]);
    const [tags, setTags] = useState([]);
    const [openIndex, setOpenIndex] = useState(null);
    const [topCategories, setTopCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const [username, setUsername] = useState(null);
    const api = import.meta.env.VITE_SERVER_URL;

    const handleLogout = () => {
        fetch(`${api}/session/logout`, {
            method: "POST",
            credentials: "include",
        })
            .then(() => {
                alert("Logged out successfully...");
                setUsername("Guest");
            })
            .catch((err) => console.error("Error logging out:", err));
    };

    // Fetch Top Categories
    useEffect(() => {
        fetch(`${api}/services/topcategories/${id}`)
            .then((res) => res.json())
            .then((data) => setTopCategories(data))
            .catch((err) => console.error("Error fetching top categories:", err));
    }, [id]);

    // Fetch service
    useEffect(() => {
        fetch(`${api}/session/me`, { credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                if (data.user) {
                    console.log("Logged in user data:", data.user);
                    sessionStorage.setItem("userdemoId", data.user.userId);
                    setUsername(data.user._id);
                    localStorage.setItem("username", data.user._id);
                }
            })
            .catch((err) => console.error("Error fetching session:", err));
        fetch(`${api}/services/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setService(data)
                setTags(data.tagsarr || []);
                setTopCategories(data.topservices || []);
                console.log(data.topservices)
                setFaqs(data.faqarr || []);
            })
            .catch((err) => console.error("Error fetching service:", err));
    }, [id]);

    const scroll = (direction) => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    setTimeout(() => setLoading(false), 2000);

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
                    Loading Services Details ...
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
            {/* Navbar */}
            <nav className="flex justify-evenly items-center py-4 bg-white text-black border-b-2 border-gray-400 shadow-2xl fixed top-0 left-0 w-full z-10">
                <div className="text-4xl font-bold text-green-600">Servizio</div>

                <div className="flex items-center space-x-8 text-sm font-semibold">
                    <Link to="#" className="hover:underline">
                        Activate Pro
                    </Link>
                    <Link to="#" className="hover:underline">
                        Explore
                    </Link>
                    <Link to="#" className="hover:underline">
                        Become a Seller
                    </Link>

                    {username === "Guest" || !username ? (
                        <>
                            <Link to="/loginsignup">
                                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                                    Sign in
                                </button>
                            </Link>
                            <Link to="/loginsignup">
                                <button className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition">
                                    Join
                                </button>
                            </Link>
                            <h1 className="text-2xl font-bold">Guest</h1>
                        </>
                    ) : (
                        <>
                            <h1 className="text-2xl font-bold text-red-500">{username}</h1>
                            <button
                                onClick={handleLogout}
                                className="border-2 px-4 py-1 rounded hover:bg-green-600 hover:text-white transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
            <div className="bg-white">
                {/* Back Button */}
                <div className="fixed z-50 mx-5 my-5">
                    <button
                        onClick={() => navigate("/")}
                        className="px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    >
                        ← Back to Home
                    </button>
                </div>

                {/* Banner Section */}
                <div className="relative bg-green-950 pt-24 pb-5 px-10 text-center flex items-center justify-center">
                    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-3xl shadow-2xl p-10 max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-green-100">
                            <Typewriter
                                words={[service.title]}
                                loop={true}
                                cursor
                                cursorStyle="|"
                                typeSpeed={80}
                                deleteSpeed={20}
                                delaySpeed={1000}
                            />
                        </h1>
                        <p className="text-lg text-gray-200 leading-relaxed">
                            {service.description}
                        </p>
                    </div>
                </div>

                {/* 🔥 Top Categories Section (Merged here) */}
                <div className="relative w-full mt-10 px-20">
                    <h2 className="text-2xl font-semibold mb-12">
                        Most Popular in {service.title}
                    </h2>

                    {/* Scroll Buttons */}
                    <button
                        onClick={() => scroll("left")}
                        className="mx-8 mt-5 absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll("right")}
                        className="mx-8 mt-5 absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-md p-2 rounded-full z-10"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Scrollable Categories */}
                    <div
                        ref={scrollRef}
                        className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth px-10 -mt-5"
                    >
                        {topCategories.length > 0 ? (
                            topCategories.map((cat, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-3 min-w-[220px] px-4 py-3 border rounded-xl shadow-sm bg-white cursor-pointer hover:shadow-md transition"
                                >
                                    <span className="text-lg">{cat.icon || "⭐"}</span>
                                    <p className="font-medium">{cat.name}</p>
                                    <span className="ml-auto text-gray-500">→</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No top categories available</p>
                        )}
                    </div>
                </div>

                {/* Your Extra Section */}
                <section className="mx-20 my-10 bg-green-100 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4 ml-10">
                        <h2 className="text-2xl md:text-3xl font-bold">
                            Big development project?{" "}
                            <span className="text-green-600">We’ll handle it</span>
                        </h2>
                        <p className="text-gray-700">
                            From freelancer sourcing to execution, work with a certified project manager who:
                        </p>
                        <ul className="space-y-2 text-gray-700">
                            <li className="flex items-center gap-2">
                                ✅ Consistently manages large and small projects
                            </li>
                            <li className="flex items-center gap-2">
                                ✅ Was carefully selected and certified by our platform
                            </li>
                            <li className="flex items-center gap-2">
                                ✅ Has proven expertise in your project’s domain
                            </li>
                        </ul>
                        <div className="flex items-center gap-4 pt-4">
                            <button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition">
                                Book a free consultation
                            </button>
                            <span className="text-gray-600 flex items-center gap-1">
                                🛡️ Money-back guarantee
                            </span>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex-1 flex justify-center md:justify-end">
                        <div className="flex gap-4">
                            {/* Card 1 */}
                            <div className="bg-white rounded-xl shadow p-4 text-center w-30 h-30">
                                <img
                                    src={SampleImg}
                                    alt="Eugene"
                                    className="w-40 h-40 rounded-full mt-5 mx-auto"
                                />
                                <p className="mt-8 font-bold text-xl">Eugene Chern</p>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-white rounded-xl shadow p-4 text-center w-30 h-30">
                                <img
                                    src={SampleImg}
                                    alt="Carolina"
                                    className="w-40 h-40 rounded-full mx-auto mt-5"
                                />
                                <p className="mt-8 font-bold text-xl">Carolina Cruz</p>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-white rounded-xl shadow p-4 text-center w-30 h-30">
                                <img
                                    src={SampleImg}
                                    alt="Carolina"
                                    className="w-40 h-40 rounded-full mx-auto mt-5"
                                />
                                <p className="mt-8 font-bold text-xl">Viktor Musienko</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Subcategories */}
                <section className="px-10 mb-16 mt-12">
                    <h2 className="text-2xl font-bold mb-10">
                        Available Services under {service.title}
                    </h2>
                    <div className="grid grid-cols-4 gap-y-12">
                        {service.subcategories && service.subcategories.length > 0 ? (
                            service.subcategories.map((sub, index) => (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/subcategory/${sub._id}?serviceid=${service._id}`)}
                                    className="bg-white border rounded-lg shadow-md w-80 p-4 flex flex-col items-center text-center cursor-pointer hover:scale-105 transition"
                                >
                                    <img
                                        src={sub.image || "https://picsum.photos/200"}
                                        alt={sub.title}
                                        className="w-20 h-20 mb-3 rounded-full object-cover"
                                    />
                                    <h3 className="font-bold text-lg">{sub.title}</h3>
                                    <p className="text-gray-500 text-sm font-semibold mt-2">
                                        {sub.description}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No subcategories available</p>
                        )}
                    </div>
                </section>

                {/* FAQs Section */}
                <div className="mt-16">
                    <hr />
                    <hr />
                    <h2 className="text-2xl font-bold text-center mb-8 mt-8">
                        {service.title} FAQs
                    </h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        {faqs.length > 0 ? (
                            faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="border-b pb-4 cursor-pointer"
                                    onClick={() =>
                                        setOpenIndex(openIndex === index ? null : index)
                                    }
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-lg text-gray-800">
                                            {faq.question}
                                        </h3>
                                        <ChevronDown
                                            className={`w-5 h-5 transition-transform ${openIndex === index ? "rotate-180" : ""
                                                }`}
                                        />
                                    </div>
                                    {openIndex === index && (
                                        <p className="mt-2 text-gray-600">{faq.answer}</p>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No FAQs available</p>
                        )}
                    </div>

                    {/* Suggested Tags */}
                    <div className="mt-16 text-center">
                        <h3 className="text-xl font-semibold mb-6">
                            You might be interested in {service.title}
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {tags.length > 0 ? (
                                tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        {tag}
                                    </span>
                                ))
                            ) : (
                                <p className="text-gray-500">No tags available</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <FooterSection />
        </>
    );
};

export default ServiceInfo;
