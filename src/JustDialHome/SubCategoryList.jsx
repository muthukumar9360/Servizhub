import React from "react";
import { useLocation } from "react-router-dom";

const SubcategoryList = () => {
  const location = useLocation();
  const category = location.state?.category;

  if (!category) {
    return <p className="text-center mt-10 text-gray-500">No category selected.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">{category.mainCategory}</h1>
      <p className="text-center text-gray-600 mb-8">{category.description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {category.subCategories?.map((sub) => (
          <div
            key={sub._id}
            className="rounded-lg shadow-lg border border-gray-200 hover:shadow-2xl transition transform hover:scale-105"
          >
            <img
              src={sub.image}
              alt={sub.title}
              className="w-full h-40 object-cover rounded-t-lg"
            />
            <div className="p-3 text-center">
              <h2 className="text-lg font-semibold">{sub.title}</h2>
              <p className="text-sm text-gray-600 mt-1">{sub.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubcategoryList;
