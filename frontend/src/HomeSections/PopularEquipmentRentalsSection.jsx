import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import axiosInstance from "../api/axiosInstance";

const PopularEquipmentRentalsSection = () => {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/equipments?limit=10")
      .then((res) => setEquipments(res.data.data?.equipments || []))
      .catch((err) => console.error("Error fetching popular equipment:", err));
  }, []);

  return (
    <section className="px-10 py-12 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Popular Equipment Rentals</h2>

        {equipments.length > 0 ? (
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
            className="mySwiper pb-10"
          >
            {equipments.map((eq) => (
              <SwiperSlide key={eq._id}>
                <Link to={`/equipment/${eq._id}`}>
                  <div className="bg-green-600 hover:bg-green-700 text-white rounded-2xl p-4 shadow-xl flex flex-col justify-between h-80 transition cursor-pointer border border-green-500">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-[10px] uppercase font-black tracking-widest bg-black/40 px-2.5 py-0.5 rounded-full">
                          {eq.location?.city || "Chennai"}
                        </span>
                        <span className="text-xs font-bold text-amber-300">★ {eq.averageRating || 4.8}</span>
                      </div>
                      <h3 className="font-extrabold text-base line-clamp-1 mb-1">{eq.name}</h3>
                      <p className="text-xs text-green-100 line-clamp-2 mb-3">{eq.description}</p>
                    </div>

                    <div>
                      <img
                        src={eq.images[0]?.url || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"}
                        className="rounded-xl w-full h-36 object-cover border border-white/20 mb-3"
                        alt={eq.name}
                      />
                      <div className="flex justify-between items-center pt-2 border-t border-green-500/50">
                        <span className="text-xs text-green-100 font-medium">Daily Rate</span>
                        <span className="text-lg font-black text-white">₹{eq.rentalPrice} / day</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <p className="text-gray-500">Loading popular equipment rentals...</p>
        )}
      </div>
    </section>
  );
};

export default PopularEquipmentRentalsSection;
