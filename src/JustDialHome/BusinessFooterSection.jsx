import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import image from "./assets/image1.png"

const BusinessFooterSection = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top Section */}
      <div className="max-w-full px-10 pt-5 grid grid-cols-5 gap-8 justify-items-center place-items-center">
        {/* Column 1 - Logo & About */}
        <div>
          <h2 className="text-5xl font-extrabold mb-8">
            <span className="text-blue-500">Serv</span>
            <span className="text-orange-400">izio</span>
          </h2>
          <p className="text-lg text-white mb-8">
            Servizio helps you discover local businesses, services, and
            professionals near you with trusted reviews and verified listings.
          </p>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-blue-400"><Facebook size={28} /></a>
            <a href="#" className="hover:text-sky-400"><Twitter size={28} /></a>
            <a href="#" className="hover:text-pink-500"><Instagram size={28} /></a>
            <a href="#" className="hover:text-blue-600"><Linkedin size={28} /></a>
          </div>
        </div>

        {/* Column 2 - Company */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">Company</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="#" className="hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Investor Relations</a></li>
          </ul>
        </div>

        {/* Column 3 - Support */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">Support</h3>
          <ul className="space-y-2 text-lg">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Contact Us</a></li>
            <li><a href="#" className="hover:text-white">Advertise with Us</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Column 4 - Contact Info */}
        <div>
          <h3 className="text-2xl font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-orange-400" />
              support@servizio.com
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="text-orange-400" />
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-orange-400" />
              123 Business Street, Mumbai, India
            </li>
          </ul>
        </div>

        <div>
          <img src={image} alt="" className="w-52 h-72"/>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-700 py-4 text-center text-sm text-white">
        <p>© {new Date().getFullYear()} Servizio Pvt. Ltd. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default BusinessFooterSection;
