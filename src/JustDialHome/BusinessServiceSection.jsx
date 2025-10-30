import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import b2b from "./assets/b2bperson1.jpg"
import repairs from "./assets/repairperson.jpg"
import doctor from "./assets/doctorperson.jpg"
import education from "./assets/educationperson.jpg"
import realestate from "./assets/realestateperson.jpg"
import TrendingSearchesSection from "./TrendingSearchesSection";

const BusinessShowcase = () => {
  // Image slider data
  const slides = [
    {
      id: 1,
      title: "Get Loan Against Property",
      subtitle: "At a competitive interest rate starting from",
      rate: "9.00%",
      company: "from Jio Finance Limited",
      image: "https://images.unsplash.com/photo-1604014237800-1c52dc1dd25b?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      title: "Grow Your Business",
      subtitle: "Apply for Instant Business Loans at",
      rate: "7.5%",
      company: "No Collateral Needed",
      image: "https://images.unsplash.com/photo-1556742400-b5b7c5121f7c?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      title: "Dream Home Awaits You",
      subtitle: "Affordable Home Loans starting at",
      rate: "8.25%",
      company: "from SBI Home Finance",
      image: "https://images.unsplash.com/photo-1600607687920-4e3b9f52f7aa?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      title: "Get Your First Car Easily",
      subtitle: "Car Loans made simple — Interest from",
      rate: "8.75%",
      company: "from Axis Bank",
      image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 5,
      title: "Secure Your Future",
      subtitle: "Study without limits — Interest starts from",
      rate: "6.95%",
      company: "from ICICI Bank",
      image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 6,
      title: "Plan Your Travel Dreams",
      subtitle: "Personal loans for your perfect getaway at",
      rate: "10.25%",
      company: "from HDFC Bank",
      image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=900&q=80",
      logo: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    },
  ];


  const [current, setCurrent] = useState(0);
  const [active, setActive] = useState(null); // ✅ Added

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Move manually
  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const services = [
    {
      title: "B2B",
      subtitle: "Quick Quotes",
      color: "bg-[#EFDEC7]",
      img: repairs,
    },
    {
      title: "REAL ESTATE",
      subtitle: "Finest Agents",
      color: "bg-gradient-to-r from-purple-500 to-purple-700",
      img: realestate,
    },
    {
      title: "REPAIRS",
      subtitle: "Nearest Vendor",
      color: "bg-[#B3B3B3]",
      img: b2b,
    },
    {
      title: "DOCTORS",
      subtitle: "Book Now",
      color: "bg-gradient-to-r from-green-500 to-green-700",
      img: doctor,
    },
    {
      title: "EDUCATION",
      subtitle: "Find Tutors",
      color: "bg-gradient-to-r from-pink-500 to-pink-700",
      img: education,
    },
  ];

  return (
    <>
      <div className="flex items-center justify-center pt-5 overflow-x-auto no-scrollbar">
        {/* Image Slider */}
        <div className="relative w-[500px] h-[290px] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:scale-105 transition-all duration-200 flex-shrink-0 border-2 border-black">

          {/* Background image with reduced opacity */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          >
            <div className="absolute inset-0 bg-black/10"></div> {/* optional overlay for better readability */}
          </div>

          {/* Content (full opacity) */}
          <div className="absolute inset-0 flex flex-col justify-center items-center z-10">
            <div className="flex items-center gap-4 mb-8">
              <img
                src={slides[current].logo}
                alt="logo"
                className="w-16 h-16 rounded-full"
              />
              <h2 className="text-3xl text-black font-bold">
                {slides[current].title}
              </h2>
            </div>
            <p className="text-white text-sm">{slides[current].subtitle}</p>
            <p className="text-orange-400 text-lg font-bold">{slides[current].rate}</p>
            <p className="text-white text-sm mb-4">{slides[current].company}</p>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-800 border-black border w-fit">
              Apply Now →
            </button>
          </div>

          {/* Controls */}
          <button
            onClick={prevSlide}
            className="absolute left-5 top-1/2 transform -translate-y-1/2 bg-white p-2 border-black border rounded-full shadow z-20"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-5 top-1/2 transform -translate-y-1/2 bg-white p-2 border-black border rounded-full shadow z-20"
          >
            <ChevronRight size={22} />
          </button>

        </div>


        {/* Expanding Service Cards */}
        <div className="flex gap-4 justify-center p-6">
          {services.map((service, index) => (
            <div
              key={index}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className={`relative flex flex-col justify-between rounded-xl cursor-pointer transition-all duration-300 overflow-hidden hover:scale-110
      ${active === index ? "w-56" : "w-40"} h-72 bg-cover bg-center`}
              style={{ backgroundImage: `url(${service.img})` }} // ✅ set image as background
            >
              <div className="absolute inset-0 bg-black/10"></div> {/* optional dark overlay */}
              <div className="relative z-10 flex flex-col items-center justify-end h-full text-center text-white px-3 py-5">
                <h3 className="text-xl font-extrabold text-white">{service.title}</h3>
                <p className="text-md">{service.subtitle}</p>
              </div>
              <div className="absolute bottom-4 right-4 text-2xl font-bold z-10">›</div>
            </div>
          ))}
        </div>

      </div>
      <TrendingSearchesSection />
    </>
  );
};

export default BusinessShowcase;
