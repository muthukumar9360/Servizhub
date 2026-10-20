import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const TrendingSearchCard = ({ title, imageUrl, query }) => (
  <div className="w-52 flex-shrink-0 cursor-pointer rounded-2xl overflow-hidden shadow-sm bg-gray-900 hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1 border border-gray-800">
    <div className="h-28 relative overflow-hidden group">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
    </div>

    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-3 text-white">
      <p className="text-xs font-bold leading-tight truncate mb-2">{title}</p>
      <Link to={`/browse?q=${encodeURIComponent(query || title)}`}>
        <button className="bg-white text-blue-700 text-[10px] font-extrabold py-1 px-3 rounded-lg hover:bg-gray-100 transition">
          Explore Equipment
        </button>
      </Link>
    </div>
  </div>
);

const TrendingEquipmentSearchesSection = () => {
  const scrollRef = useRef(null);

  const trendingSearches = [
    { title: "CAT Hydraulic Excavator", query: "Excavator", imageUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80" },
    { title: "Sony 4K Cinema Camera", query: "Cinema Camera", imageUrl: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80" },
    { title: "Cummins Diesel Generator", query: "Generator", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80" },
    { title: "JBL Line Array Speakers", query: "Speakers", imageUrl: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&auto=format&fit=crop&q=80" },
    { title: "Mahindra Power Tiller", query: "Agricultural", imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80" },
    { title: "Bosch Rotary Drill", query: "Drill", imageUrl: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80" },
    { title: "DJI 4K Film Drone", query: "Drone", imageUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80" },
    { title: "MacBook Pro M3 Max", query: "Laptop", imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80" },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 240;
    const interval = 2500;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;
      scrollAmount += scrollStep;
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollContainer.scrollTo({ left: scrollAmount, behavior: "smooth" });
      }
    }, interval);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <section className="px-8 py-10 bg-white font-sans border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="border-2 border-gray-300 p-6 rounded-3xl bg-gray-50">
          <h2 className="text-xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
            Trending Equipment Searches Near You
            <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-md">HOT</span>
          </h2>

          <div className="relative">
            <div ref={scrollRef} className="flex overflow-x-scroll scrollbar-hide space-x-4 py-2" style={{ scrollbarWidth: "none" }}>
              {trendingSearches.map((item, index) => (
                <TrendingSearchCard key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingEquipmentSearchesSection;
