import React from "react";

const FooterSection = () => {
  return (
    <footer className="bg-white border-t-4 mt-10 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-5 gap-8">
        
        {/* Categories */}
        <div>
          <h3 className="font-bold mb-3">Categories</h3>
          <ul className="space-y-2">
            <li>Graphics & Design</li>
            <li>Digital Marketing</li>
            <li>Writing & Translation</li>
            <li>Video & Animation</li>
            <li>Music & Audio</li>
            <li>Programming & Tech</li>
            <li>AI Services</li>
            <li>Consulting</li>
            <li>Data</li>
            <li>Business</li>
            <li>Personal Growth & Hobbies</li>
            <li>Photography</li>
            <li>Finance</li>
            <li>End-to-End Projects</li>
            <li>Service Catalog</li>
          </ul>
        </div>

        {/* For Clients */}
        <div>
          <h3 className="font-bold mb-3">For Clients</h3>
          <ul className="space-y-2">
            <li>How Servizio Works</li>
            <li>Customer Success Stories</li>
            <li>Trust & Safety</li>
            <li>Quality Guide</li>
            <li>Learn – Online Courses</li>
            <li>Servizio Guides</li>
            <li>Servizio Answers</li>
          </ul>
        </div>

        {/* For Freelancers */}
        <div>
          <h3 className="font-bold mb-3">For Freelancers</h3>
          <ul className="space-y-2">
            <li>Become a Servizio Freelancer</li>
            <li>Become an Agency</li>
            <li>Freelancer Equity Program</li>
            <li>Community Hub</li>
            <li>Forum</li>
            <li>Events</li>
          </ul>
        </div>

        {/* Business Solutions */}
        <div>
          <h3 className="font-bold mb-3">Business Solutions</h3>
          <ul className="space-y-2">
            <li>Servizio Pro</li>
            <li>Project Management Service</li>
            <li>Expert Sourcing Service</li>
            <li>ClearVoice – Content Marketing</li>
            <li>Working Not Working – Creative Talent</li>
            <li>AutoDS – Dropshipping Tool</li>
            <li>AI Store Builder</li>
            <li>Servizio Logo Maker</li>
            <li>Contact Sales</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-bold mb-3">Company</h3>
          <ul className="space-y-2">
            <li>About Servizio</li>
            <li>Help & Support</li>
            <li>Social Impact</li>
            <li>Careers</li>
            <li>Terms of Service</li>
            <li>Privacy Policy</li>
            <li>Do not sell or share my personal information</li>
            <li>Partnerships</li>
            <li>Creator Network</li>
            <li>Affiliates</li>
            <li>Invite a Friend</li>
            <li>Press & News</li>
            <li>Investor Relations</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-4 border-b-4 py-10 px-6 flex flex-col md:flex-row justify-around items-center text-gray-600 text-4xl">
        <p className="mb-2 md:mb-0">
          &copy; <span className="font-bold text-black">Servizio </span>International Ltd. 2025
        </p>
        <div className="flex gap-4 text-4xl text-black">
          <i className="fab fa-tiktok"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-linkedin"></i>
          <i className="fab fa-facebook"></i>
          <i className="fab fa-x-twitter"></i>
        </div>
      </div>
    </footer>
  );
};

export default FooterSection;
