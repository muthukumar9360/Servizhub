import React from "react";
import { Link } from "react-router-dom";

const EquipmentFooterSection = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-gray-800">
          {/* Col 1 */}
          <div className="md:col-span-2">
            <h2 className="text-3xl font-extrabold text-green-500 mb-4 tracking-tight">EQUIPORA</h2>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Rent the right equipment. When you need it. India's trusted marketplace for heavy machinery, 4K digital cinema gear, stage audio, agricultural tools, and generators.
            </p>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/browse?category=construction" className="hover:text-green-400 transition">Construction Equipment</Link></li>
              <li><Link to="/browse?category=cameras" className="hover:text-green-400 transition">Cameras & Cinema</Link></li>
              <li><Link to="/browse?category=audio" className="hover:text-green-400 transition">Audio & Stage Speakers</Link></li>
              <li><Link to="/browse?category=generators" className="hover:text-green-400 transition">Silent Generators</Link></li>
              <li><Link to="/browse?category=laptops" className="hover:text-green-400 transition">Laptops & Workstations</Link></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">For Renters</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/browse" className="hover:text-green-400 transition">Explore All Equipment</Link></li>
              <li><Link to="/my-bookings" className="hover:text-green-400 transition">My Rental Bookings</Link></li>
              <li><Link to="/profile" className="hover:text-green-400 transition">KYC Verification Center</Link></li>
              <li><Link to="/browse" className="hover:text-green-400 transition">Safety & Damage Protection</Link></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="font-bold text-white text-sm mb-4">For Owners / Depots</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/register" className="hover:text-green-400 transition">Become a Provider</Link></li>
              <li><Link to="/provider/add-equipment" className="hover:text-green-400 transition">List Heavy Equipment</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-green-400 transition">Provider Dashboard</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-green-400 transition">Settlements & Payouts</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} EQUIPORA Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gray-400">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-400">Terms of Service</Link>
            <Link to="#" className="hover:text-gray-400">Rental Guarantee</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EquipmentFooterSection;
