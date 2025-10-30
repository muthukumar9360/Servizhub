import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const MovieCard = ({ title, language, format, rating, imageUrl }) => {
  return (
    <div className="w-44 sm:w-52 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 relative mb-5">
      {/* Movie Poster */}
        {/* Movie Poster + Overlay Container */}
        <div className="relative group transform transition-transform duration-300 hover:scale-105">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-60 object-cover"
          />

          {/* Rating Badge */}
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
            <span className="text-red-500 text-md">❤️</span>
            <span className="text-md">{rating}%</span>
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
            <button className="bg-blue-500 text-white font-bold text-xl px-4 py-1 rounded-lg hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-2">
          <p className="text-lg font-bold text-gray-900 truncate">{title}</p>
          <p className="text-md text-gray-500">
            {language} · {format}
          </p>
        </div>

    </div>
  );
};

const LatestMoviesSection = () => {
  const movies = [
    { id: 1, title: "The Galactic Odyssey", language: "English", format: "3D", rating: 92, imageUrl: "https://picsum.photos/300/400?random=1" },
    { id: 2, title: "Chennai Chronicles", language: "Tamil", format: "2D", rating: 88, imageUrl: "https://picsum.photos/300/400?random=2" },
    { id: 3, title: "The Great Heist", language: "Hindi", format: "2D", rating: 95, imageUrl: "https://picsum.photos/300/400?random=3" },
    { id: 4, title: "Moonlight Memories", language: "English", format: "2D", rating: 80, imageUrl: "https://picsum.photos/300/400?random=4" },
    { id: 5, title: "The Hidden Fortress", language: "Telugu", format: "3D", rating: 84, imageUrl: "https://picsum.photos/300/400?random=5" },
    { id: 6, title: "City Lights", language: "Marathi", format: "2D", rating: 78, imageUrl: "https://picsum.photos/300/400?random=6" },
    { id: 7, title: "Silent Waves", language: "Malayalam", format: "2D", rating: 90, imageUrl: "https://picsum.photos/300/400?random=7" },
    { id: 8, title: "Shadow Realm", language: "Hindi", format: "3D", rating: 93, imageUrl: "https://picsum.photos/300/400?random=8" },
    { id: 9, title: "Love Beyond Stars", language: "English", format: "2D", rating: 85, imageUrl: "https://picsum.photos/300/400?random=9" },
    { id: 10, title: "The Final Dawn", language: "Kannada", format: "2D", rating: 82, imageUrl: "https://picsum.photos/300/400?random=10" },
  ];

  return (
    <section className="bg-white rounded-xl shadow-md border border-gray-200 pl-6 relative">
      <div className="flex justify-between items-center py-5">
        <h2 className="text-2xl font-bold text-gray-900">
          🎥 Latest Movies & Reviews
        </h2>
        <a href="#" className="text-blue-600 font-bold text-xl hover:underline pr-10">
          View All
        </a>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={1}
        autoplay={{ delay: 1500, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 2 },    // mobile
          640: { slidesPerView: 3 },  // small tablets
          768: { slidesPerView: 4 },  // tablets
          1024: { slidesPerView: 6 }, // large desktops
        }}
      >

        {movies.map((movie) => (
          <SwiperSlide key={movie.id}>
            <MovieCard {...movie} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default LatestMoviesSection;
