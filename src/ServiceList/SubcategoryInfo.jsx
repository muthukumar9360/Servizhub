import React, { useEffect, useState } from "react";
import TipsSection from "./TipsSection";
import FooterSection from "../HomeSections/FooterSection";
import RemainingSection from "../HomeSections/RemainingSection";
import { useParams, useNavigate, Link } from "react-router-dom";

const SubcategoryInfo = () => {
  const { subId } = useParams();
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState(null);
  const [service, setService] = useState("");
  const [topcategories, setTopcategories] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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


  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("serviceid");

    fetch(`${api}/services/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setService(data)
        setFaqs(data.faqarr || []);
        setTopcategories(data.topservices)
        console.log(data.topservices)
      })
      .catch((err) => console.error("Error fetching service:", err));

    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          console.log("Logged in user data:", data.user);
          setUsername(data.user._id);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
    fetch(`${api}/subcategory/users/${subId}`)
      .then((res) => res.json())
      .then((data) => {
        setUsers(data)
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, [subId]);

  setTimeout(() => {
    setLoading(false);
  }, 2000);

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
      <div className="bg-gray-50 min-h-screen">
        {/* Back Button */}
        <div className="fixed z-50 mx-5 my-5">
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* Banner */}
        <div className="bg-multi-gradient text-white pt-24 pb-5 px-10 text-center shadow-md">
          <h1 className="text-6xl text-black font-extrabold mb-3" style={{
            WebkitTextStroke: "3px yellow"
          }}>
            Find Your Perfect Expert
          </h1>
          <p className="text-lg opacity-90">
            Skilled professionals ready to deliver quality work
          </p>
        </div>
        <div className="mt-5 px-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {service.title}
          </h2>
          <p className="text-gray-600 mb-5">
            {service.description} with skilled {service.title} developers
          </p>

          {/* Categories */}
          {/* Categories Slide Bar */}
          <div className="overflow-x-auto">
            <div className="flex gap-2 w-max px-2 py-3">
              {topcategories.map((category, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow cursor-pointer hover:shadow-md transition flex-shrink-0"
                >
                  <div className="text-xl">{category.icon}</div>
                  <span className="font-medium text-gray-800 whitespace-nowrap">
                    {category.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
            <select className="px-4 py-2 border rounded-lg text-gray-700">
              <option>Service options</option>
            </select>
            <select className="px-4 py-2 border rounded-lg text-gray-700">
              <option>Seller details</option>
            </select>
            <select className="px-4 py-2 border rounded-lg text-gray-700">
              <option>Budget</option>
            </select>
            <select className="px-4 py-2 border rounded-lg text-gray-700">
              <option>Delivery time</option>
            </select>

            {/* Toggles */}
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Pro services</span>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" className="w-4 h-4" />
              <span className="text-gray-700">Instant response</span>
              <span className="text-xs bg-pink-500 text-white px-2 py-1 rounded-full">
                New
              </span>
            </div>
          </div>
        </div>

        {/* Users Section */}
        <section className="px-20 my-6">
          <h2 className="text-3xl font-bold mb-10 text-gray-800 text-center">
            Available Experts
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {users && users.length > 0 ? (
              users.map((user, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-3 border-2 hover:border-gray-300"
                >
                  {/* Card Content */}
                  <div className="flex flex-col items-center p-6">
                    {/* Avatar */}
                    <img
                      src={user.image || "https://via.placeholder.com/150"}
                      alt={user.name}
                      className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-indigo-100"
                    />

                    {/* Name + Username */}
                    <h3 className="mt-4 font-bold text-lg text-gray-900">
                      {user.name}
                    </h3>

                    {/* Location + Availability */}
                    <div className="mt-3 text-sm text-gray-700 space-y-1">
                      <p><span className="font-medium">Location:</span> {user.location}</p>
                      <p><span className="font-medium">Availability:</span> {user.availability}</p>
                    </div>

                    {/* Rating, Price, Experience */}
                    <div className="flex justify-between items-center w-full mt-4 text-sm">
                      <span className="text-yellow-500 font-medium">⭐ {user.rating}</span>
                      <span className="font-semibold text-indigo-600">₹{user.price}</span>
                      <span className="text-gray-600">{user.experience} yrs exp</span>
                    </div>

                    {/* IDs (optional: show for debugging/admin only) */}
                    <div className="mt-4 text-xs text-gray-400 text-center break-words">
                      <p><b>UserId:</b> {user._id}</p>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => navigate(`/userprofile/${user._id}`)}
                      className="mt-5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm shadow hover:bg-indigo-700 transition"
                    >
                      View Profile
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No users available for this subcategory
              </p>
            )}
          </div>
        </section>

        {/* Explore More Services */}
        <section className="my-10 px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
            Explore More Website Development Services
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Website Design",
              "SEO",
              "Website Maintenance",
              "Website Migration",
              "Magento",
              "SiteBuilder",
              "Drupal",
              "Joomla",
              "Opencart",
              "BigCommerce",
              "Dropshipping website development",
              "Education website development",
              "Portfolio Website Development",
              "Blog website development",
              "E-commerce Website Development",
              "Job Board Website Development",
              "Landing Page Development",
              "Business website development",
            ].map((service, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer transition"
              >
                {service}
              </span>
            ))}
          </div>
        </section>

        {/* Hire Freelancers */}
        <section className="my-8 px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800">
            Hire freelancers related to Website Development
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              "Elementor Pro experts",
              "WooCommerce experts",
              "Shopify developers",
              "Website designers",
              "Website developers",
              "Wordpress customization experts",
              "WordPress performance experts",
              "WordPress security experts",
              "Facebook ads experts",
              "Copywriters",
              "Sales copywriters",
              "Business website developers",
              "Website consultants",
              "Wix website designers",
              "Wix SEO experts",
              "Wordpress experts",
              "Wix code experts",
            ].map((expert, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-200 cursor-pointer transition"
              >
                {expert}
              </span>
            ))}
          </div>
        </section>
        <TipsSection />

        <div className="mt-0 bg-gray-50 py-4 px-20 rounded-2xl shadow-md">
          <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">
            Website Development FAQs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            {faqs && faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-lg text-gray-900">{faq.question}</h3>
                  <p className="mt-2 text-sm">{faq.answer}</p>
                </div>
              ))
            ) : (
              <p className="col-span-2 text-gray-500">No FAQs available.</p>
            )}
          </div>


        </div>

      </div>
      <RemainingSection />
      <FooterSection />
    </>
  );
};

export default SubcategoryInfo;
