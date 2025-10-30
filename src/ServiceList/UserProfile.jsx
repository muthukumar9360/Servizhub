import React, { use, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [userId1, setUserId1] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const api=import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetch(`${api}/userprofile/${userId}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user profile:", err));
  }, [userId]);

  useEffect(() => {
    fetch(`${api}/session/me`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUserId1(data.user._id);
        }
      })
      .catch((err) => console.error("Error fetching session:", err));
  },[userId1]);

  const handlePayment = async (packageData) => {
    const response = await fetch("http://localhost:5024/api/payment/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: packageData.price }),
    });

    const orderData = await response.json();

    const options = {
      key: "YOUR_RAZORPAY_TEST_KEY_ID",
      amount: orderData.amount,
      currency: orderData.currency,
      name: "Freelancer Marketplace",
      description: `Hire ${user.name}`,
      order_id: orderData.id,
      handler: function (response) {
        alert(`✅ Payment Successful!\nPayment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: "Client Name",
        email: "client@example.com",
        contact: "9876543210",
      },
      notes: { freelancer: user.name, freelancer_id: user._id },
      theme: { color: "#4F46E5" },
    };

    const razor = new window.Razorpay(options);
    razor.open();
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
          Loading Profile Details ...
        </div>

        {/* Bouncing Dots */}
        <div className="flex space-x-2 mt-4">
          <div className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-red-500 rounded-full animate-bounce animation-delay-150"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-bounce animation-delay-300"></div>
        </div>
      </div>

    );
    console.log("user:", user);
  console.log("user Id1:", userId1);
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-6">
      {/* Back Button */}
      <motion.button
        onClick={() => navigate(-1)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="px-5 py-2 mb-6 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
      >
        ← Back
      </motion.button>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL */}
        <aside className="col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-6 sticky top-8">
            {/* Profile Header */}
            <div className="flex items-center gap-4">
              <img
                src={user.image || "https://via.placeholder.com/150"}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.profession || "Freelancer"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm text-yellow-500">
                  <span className="font-semibold">{user.rating || "N/A"}</span>
                  <span>·</span>
                  <span className="text-gray-500">{user.reviewsCount || 0} reviews</span>
                </div>
              </div>
            </div>

            {/* Basic Info */}
            <div className="mt-6 text-sm text-gray-700 space-y-2">
              <p>📍 From: {user.location || "Not specified"}</p>
              <p>🕒 Avg. response time: {user.responseTime || "1 hour"}</p>
              <p>📦 Orders in queue: {user.ordersInQueue || 0}</p>
              <p>💬 Last delivery: {user.lastDelivery || "Recently"}</p>
              <p>🎯 Member since: {user.memberSince || "2024"}</p>
            </div>

            {/* Hire & Chat Buttons */}
            <div className="mt-6 flex gap-3">
              {/* Hire Button */}
              <button
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 transition"
                onClick={() =>
                  handlePayment({
                    title: "Custom Hire",
                    price: user.price || 100,
                  })
                }
              >
                💼 Hire for ₹{user.price || 100}
              </button>

              {/* Chat Button (depends on login) */}
              <button
                className={`flex-1 px-4 py-2 rounded-md font-semibold transition ${userId1
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-white hover:bg-gray-500"
                  }`}
                onClick={() =>
                  navigate(`/chat/${user._id}?chat=true`)
                }
              >
                {userId1 ? "💬 Chat" : "🔒 Login to Chat"}
              </button>
            </div>




            {/* Dynamic About Section */}
            <div className="mt-2 border-t pt-5">
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Get to Know {user.name}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {user.about || "No about information available."}
              </p>

              {user.specialties?.length > 0 && (
                <ul className="mt-4 text-sm text-gray-700 space-y-2 list-disc list-inside">
                  {user.specialties.map((sp, i) => (
                    <li key={i}>{sp}</li>
                  ))}
                </ul>
              )}

              <p className="mt-4 text-sm text-gray-700">
                🔥 Let’s build your digital dream together and take your business online with impact.
              </p>
            </div>

            {/* Skills */}
            <div className="mt-6 text-sm text-gray-600">
              <h4 className="font-semibold mb-2">Skills</h4>
              <div className="flex gap-2 flex-wrap">
                {user.skills?.length > 0 ? (
                  user.skills.map((s, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p>No skills added</p>
                )}
              </div>
            </div>
          </div>
        </aside>


        {/* RIGHT PANEL */}
        <main className="col-span-1 lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-md p-6">

            {/* Languages */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Languages</h4>
              <div className="flex gap-2 flex-wrap">
                {user.languages?.length > 0 ? (
                  user.languages.map((lang, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {lang}
                    </span>
                  ))
                ) : (
                  <span>No languages listed</span>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div className="mt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Contact</h4>
              <p>📧 {user.email}</p>
              <p>📞 {user.phone}</p>
              <p>
                🔗{" "}
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {user.website}
                </a>
              </p>
            </div>
            {/* Education */}
            {user.education?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">🎓 Education</h3>
                <ul className="space-y-2 text-gray-700">
                  {user.education.map((edu, i) => (
                    <li key={i} className="border-b pb-2">
                      <p className="font-semibold">{edu.degree}</p>
                      <p className="text-sm">{edu.institution}</p>
                      <p className="text-xs text-gray-500">Year: {edu.year}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Projects */}
            {user.projects?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">💻 Projects</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.projects.map((p, i) => (
                    <a
                      key={i}
                      href={p.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-4 border rounded-lg hover:shadow-md transition"
                    >
                      <h4 className="font-semibold">{p.title}</h4>
                      <p className="text-sm text-gray-600">{p.description}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews */}
            {user.reviews?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">⭐ Reviews</h3>
                <div className="space-y-3">
                  {user.reviews.map((r, i) => (
                    <div key={i} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <strong>{r.reviewer}</strong>
                        <span className="text-yellow-500">{r.rating} ⭐</span>
                      </div>
                      <p className="text-sm text-gray-600">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
