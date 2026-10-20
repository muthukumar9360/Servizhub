import React from "react";
import { Link } from "react-router-dom";
import { Wrench, Shield, Truck, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10 border-b border-gray-800 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-indigo-900/50 text-indigo-400 rounded-2xl">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Verified Equipment & KYC</h4>
              <p className="text-xs text-gray-400">100% identity and machine condition checks.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-indigo-900/50 text-indigo-400 rounded-2xl">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Depot Pickup & Site Delivery</h4>
              <p className="text-xs text-gray-400">Flexible equipment pickup or transport delivery.</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="p-3 bg-indigo-900/50 text-indigo-400 rounded-2xl">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Breakdown Guarantee</h4>
              <p className="text-xs text-gray-400">Immediate operator and technician support.</p>
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-extrabold text-lg mb-4">
              <Wrench className="h-5 w-5" />
              <span>Servizio</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              India's premium marketplace for renting construction machinery, cinema gear, stage audio systems, and industrial power tools.
            </p>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-4">For Renters</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/browse" className="hover:text-indigo-400 transition">Browse Equipment</Link></li>
              <li><Link to="/my-bookings" className="hover:text-indigo-400 transition">My Rental Bookings</Link></li>
              <li><Link to="/wishlist" className="hover:text-indigo-400 transition">Saved Wishlist</Link></li>
              <li><Link to="/profile" className="hover:text-indigo-400 transition">KYC Verification Center</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-4">For Owners / Providers</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/register" className="hover:text-indigo-400 transition">Register Equipment Depot</Link></li>
              <li><Link to="/provider/add-equipment" className="hover:text-indigo-400 transition">List Heavy Equipment</Link></li>
              <li><Link to="/provider/dashboard" className="hover:text-indigo-400 transition">Provider Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-white text-sm mb-4">Top Rental Categories</h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/browse?category=construction" className="hover:text-indigo-400 transition">Construction & Excavators</Link></li>
              <li><Link to="/browse?category=cinema" className="hover:text-indigo-400 transition">Cinema 4K Cameras & Lights</Link></li>
              <li><Link to="/browse?category=sound" className="hover:text-indigo-400 transition">Event Sound & Stage Systems</Link></li>
              <li><Link to="/browse?category=power" className="hover:text-indigo-400 transition">Silent Diesel Generators</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Servizio Equipment Rental Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
