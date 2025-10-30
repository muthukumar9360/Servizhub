import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import BusinessHeaderSection from "./BusinessHeaderSection";

const AllCategoriesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categories = location.state?.categories || [];
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);
  const [modalLoading, setModalLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  // Sort categories alphabetically
  const sortedCategories = [...categories].sort((a, b) =>
    a.mainCategory.localeCompare(b.mainCategory)
  );

  // Page loader: 2s minimum
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Fade-in animation for grid
  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  const openModal = (category) => {
    setSelectedCategory(category);
    setModalLoading(true); // show spinner
    document.body.style.overflow = "hidden";

    // Modal spinner stays minimum 2s
    const timer = setTimeout(() => setModalLoading(false), 1000);
    return () => clearTimeout(timer);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    document.body.style.overflow = "auto";
  };

  const handleSubcategoryClick = (sub) => {
    navigate(`/Businesssubcategory/${sub._id.$oid || sub._id}`);
    closeModal();
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="relative w-24 h-24 mb-8">
          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-3 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-6 border-4 border-blue-200 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-2xl font-extrabold text-black animate-pulse flex items-center">
          Loading Business Categories ...
        </div>
      </div>
    );
  }

  return (
    <>
      <BusinessHeaderSection />
      <div className="min-h-screen bg-gray-100 py-8 px-6 sm:px-12">
        <motion.button
          onClick={() => navigate(-1)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg shadow-lg hover:bg-indigo-700 transition"
        >
          ← Back
        </motion.button>

        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12 drop-shadow-md">
          Explore Business Categories
        </h1>

        <div
          className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 transition-all duration-700 ${fadeIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
        >
          {sortedCategories.map((cat, index) => (
            <div
              key={cat._id}
              className="group relative overflow-hidden shadow-lg border border-gray-200 bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer"
              onClick={() => openModal(cat)}
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <img
                src={cat.homeImage}
                alt={cat.mainCategory}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <h2 className="text-lg font-semibold text-center py-3 bg-gray-100 text-gray-800 relative z-10">
                {cat.mainCategory}
              </h2>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedCategory && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-md z-50"
            onClick={closeModal}
          >
            <div
              className="relative bg-white shadow-2xl max-w-7xl w-11/12 md:w-3/4 rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-gray-50 sticky top-0 z-10 shadow-2xl">
                <h2 className="text-3xl font-bold">{selectedCategory.mainCategory}</h2>
                <button
                  onClick={closeModal}
                  className="text-3xl font-bold hover:text-red-500"
                >
                  ×
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto px-6 py-3 relative flex flex-col">
                {modalLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-20">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                )}

                <p className="text-center italic text-lg text-gray-700">
                  {selectedCategory.description}
                </p>

                <div className="relative w-full max-w-md mx-auto my-4">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    🔍
                  </span>
                  <input
                    type="text"
                    placeholder="Search the SubCategory"
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 shadow-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {selectedCategory.subCategories?.map((sub) => (
                    <motion.div
                      key={sub._id}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="bg-white border border-gray-200 rounded-lg shadow-md cursor-pointer overflow-hidden"
                      onClick={() => handleSubcategoryClick(sub)}
                    >
                      <img
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-36 object-cover transition-transform duration-500 hover:scale-110"
                      />
                      <div className="p-3 text-center">
                        <h3 className="font-semibold text-gray-800">{sub.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-2">{sub.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCategoriesPage;
