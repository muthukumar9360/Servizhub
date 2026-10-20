import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const EquipmentCategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/categories")
      .then((res) => {
        setCategories(res.data.data || []);
      })
      .catch((err) => console.error("Error fetching equipment categories:", err));
  }, []);

  return (
    <section className="px-10 py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Explore Equipment Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {categories.slice(0, 12).map((cat, index) => (
            <Link key={cat._id || index} to={`/browse?category=${cat._id}`}>
              <div className="bg-white text-black rounded-2xl shadow-md border-2 border-gray-900 p-3 hover:scale-105 hover:border-green-600 transition flex flex-col items-center justify-between cursor-pointer h-48">
                <h3 className="font-bold text-xs text-center text-gray-900 line-clamp-1 mb-2">
                  {cat.mainCategory}
                </h3>
                <img
                  src={cat.homeImage || "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80"}
                  className="rounded-xl w-full h-32 object-cover"
                  alt={cat.mainCategory}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EquipmentCategoriesSection;
