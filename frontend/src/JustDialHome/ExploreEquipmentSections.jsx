import React, { useState } from "react";
import { Link } from "react-router-dom";

const categoryTabs = [
  "Laptops & Computers",
  "Tablets",
  "Cameras",
  "Camera Lenses",
  "Projectors",
  "Audio Equipment",
  "Speakers",
  "Microphones",
  "Lighting Equipment",
  "Event Equipment",
  "Agricultural Machinery",
  "Power Tools",
  "Construction Equipment",
  "Generators",
  "Drones",
  "Printers",
  "Networking Equipment",
  "Surveying Equipment",
  "Office Equipment",
  "Cleaning Equipment",
  "Industrial Equipment",
  "Welding Equipment",
  "Gardening Equipment",
  "Safety Equipment",
  "Medical/Professional Equipment"
];

const categorySubItems = {
  "Laptops & Computers": ["Dell Latitude Ultrabooks", "MacBook Pro M3 Max", "Lenovo ThinkPad Workstations", "HP EliteBook Studio", "ASUS ROG Gaming Laptops", "Acer TravelMate Notebooks", "Workstation Monitors", "CAD Laptops"],
  "Cameras": ["Sony FX6 Cinema 4K", "RED V-Raptor 8K", "Canon EOS R6 Mark II", "Sony A7 IV Mirrorless", "Nikon Z6 II Camera", "Blackmagic Pocket 6K", "Fujifilm X-T5", "Panasonic Lumix S1H"],
  "Construction Equipment": ["CAT 320 Hydraulic Excavators", "Concrete Mixers", "JCB Backhoe Loaders", "Compactor Rollers", "Tower Crane Winches", "Scaffolding Kits", "Earth Compactors", "Asphalt Pavers"],
  "Generators": ["62.5 kVA Silent Cummins Genset", "Portable Honda Petrol Generator", "125 kVA Kirloskar Diesel Engine", "250 kVA Industrial Generator", "Solar Battery Banks", "Silent Event Power Backup"],
  "Agricultural Machinery": ["Mahindra 45HP Power Tillers", "Rotavator Cultivators", "Water Pumping Engines", "Agricultural Crop Sprayers", "Seed Drills", "Mini Tractor Units", "Brush Cutters"],
  "Power Tools": ["Bosch Rotary Hammer Drills", "DeWalt Angle Grinders", "Makita Circular Saws", "Welding Inverter Units", "Demolition Breakers", "Impact Wrenches", "Jig Saws"],
  "Drones": ["DJI Mavic 3 Pro Cine", "DJI Matrice 300 RTK Survey Drone", "Autel Robotics EVO II", "FPV Film Drones", "Drone Thermal Imaging Kits"],
};

const ExploreEquipmentSections = () => {
  const [activeCategory, setActiveCategory] = useState("Laptops & Computers");
  const currentItems = categorySubItems[activeCategory] || categorySubItems["Construction Equipment"];

  return (
    <section className="px-8 py-10 bg-gray-50 text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black mb-6 text-gray-900 tracking-tight">Explore Equipment Categories</h2>

        {/* Scrollable Category Tabs */}
        <div className="overflow-x-auto whitespace-nowrap mb-6 pb-2">
          <div className="inline-flex gap-2">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition shrink-0 ${
                  activeCategory === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-item Tag Grid */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-extrabold text-gray-900 mb-4">
            Popular <span className="text-blue-600">{activeCategory}</span> Rentals:
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {currentItems.map((item, idx) => (
              <Link
                key={idx}
                to={`/browse?q=${encodeURIComponent(item)}`}
                className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs font-bold text-gray-800 hover:border-blue-600 hover:text-blue-600 transition flex items-center justify-between"
              >
                <span>{item}</span>
                <span className="text-gray-400 text-[10px]">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExploreEquipmentSections;
