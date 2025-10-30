import React, { useState } from "react";

const FavoriteStep = ({ onSubmit, onBack }) => {
  const [data, setData] = useState({
    favoriteDoctor: "",
    favoriteHospital: "",
    favoriteRestaurant: "",
    favoriteSalon: "",
    favoritePlumber: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <input name="favoriteDoctor" placeholder="Favorite Doctor" onChange={handleChange} className="border p-2 rounded" />
        <input name="favoriteHospital" placeholder="Favorite Hospital" onChange={handleChange} className="border p-2 rounded" />
        <input name="favoriteRestaurant" placeholder="Favorite Restaurant" onChange={handleChange} className="border p-2 rounded" />
        <input name="favoriteSalon" placeholder="Favorite Salon" onChange={handleChange} className="border p-2 rounded" />
        <input name="favoritePlumber" placeholder="Favorite Plumber" onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded">← Back</button>
        <button
          onClick={() => onSubmit(data)}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          ✅ Submit
        </button>
      </div>
    </div>
  );
};

export default FavoriteStep;
