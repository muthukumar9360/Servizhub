import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BusinessCategory = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const api = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    fetch(`${api}/business`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubClick = (id) => {
    navigate(`/Businesssubcategory/${encodeURIComponent(id)}`);
  };

  const handleViewAll = () => {
    navigate("/all-categories", { state: { categories } });
  };

  return (
    <div className="p-6 relative">
      {/* View All Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleViewAll}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-900"
        >
          View All Categories and SubCategories
        </button>
      </div>

      {/* Display first 4 categories only */}
      <div className="grid grid-cols-2 gap-4">
        {categories.slice(0, 4).map((cat) => (
          <div
            key={cat._id}
            className="rounded-lg border-gray-300 border-2 p-6 shadow-lg hover:shadow-2xl transition"
          >
            <h2 className="text-2xl font-bold mb-4 text-center underline">
              {cat.mainCategory}
            </h2>

            <div className="grid grid-cols-3 gap-2 mt-3">
              {/* ✅ Only show first 3 subcategories */}
              {cat.subCategories &&
                cat.subCategories.slice(0, 3).map((sub, index) => (
                  <div
                    key={index}
                    className="rounded-lg shadow-lg p-2 hover:scale-105 transition cursor-pointer"
                    onClick={() => handleSubClick(sub._id)}
                  >
                    <img
                      src={sub.image}
                      alt={sub.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="text-md font-light mt-1 text-center">
                      {sub.title}
                    </h3>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCategory;
