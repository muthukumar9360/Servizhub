import React, { useRef, useEffect } from 'react';

// --- Tourist Place Card ---
const TouristPlaceCard = ({ city, imageUrl }) => {
  return (
    <div
      className="
        w-52 flex-shrink-0
        border border-gray-500 rounded-lg bg-white
        shadow-sm hover:shadow-md
        overflow-hidden
        transition-transform duration-300
        hover:-translate-y-1
        cursor-pointer
      "
    >
      <div className="flex items-center p-2">
        {/* Image (Left Side) */}
        <div className="w-16 h-16 flex-shrink-0 rounded-md overflow-hidden group relative">
          <img
            src={imageUrl}
            alt={city}
            className="
              w-full h-full object-cover
              transform transition-transform duration-500
              group-hover:scale-110
            "
          />
        </div>

        {/* Text (Right Side) */}
        <div className="ml-3 flex flex-col justify-center">
          <p className="text-lg font-semibold text-gray-800 truncate">{city}</p>
          <a
            href="#"
            className="text-sm text-blue-600 font-medium hover:underline mt-1"
          >
            Explore
          </a>
        </div>
      </div>
    </div>
  );
};

// --- Popular Search Card ---
const PopularSearchCard = ({ title, imageUrl }) => {
  return (
    <div className="w-44 sm:w-48 md:w-52 lg:w-56 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden shadow-md bg-gray-600 hover:shadow-lg transition-transform duration-300 hover:-translate-y-1">
      <div className="h-44 relative overflow-hidden group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="bg-blue-600 p-3 text-white">
        <p className="text-sm md:text-base font-semibold leading-tight mb-2 truncate">
          {title}
        </p>
        <button className="bg-white text-blue-600 text-xs md:text-sm font-semibold py-1.5 px-3 md:px-4 rounded hover:bg-gray-100 transition duration-150">
          Enquire Now
        </button>
      </div>
    </div>
  );
};

// --- Main Page Section ---
const TouristAndSearchPage = () => {
  const scrollRef = useRef(null); // ✅ Added ref for tourist section

  const touristPlaces = [
    { city: 'Mumbai', imageUrl: 'https://picsum.photos/100/100?random=1' },
    { city: 'Pune', imageUrl: 'https://picsum.photos/100/100?random=2' },
    { city: 'Nashik', imageUrl: 'https://picsum.photos/100/100?random=3' },
    { city: 'Ahmedabad', imageUrl: 'https://picsum.photos/100/100?random=4' },
    { city: 'Jaipur', imageUrl: 'https://picsum.photos/100/100?random=5' },
    { city: 'Goa', imageUrl: 'https://picsum.photos/100/100?random=6' },
    { city: 'Hyderabad', imageUrl: 'https://picsum.photos/100/100?random=7' },
    { city: 'Bangalore', imageUrl: 'https://picsum.photos/100/100?random=8' },
    { city: 'Chennai', imageUrl: 'https://picsum.photos/100/100?random=9' },
    { city: 'Kolkata', imageUrl: 'https://picsum.photos/100/100?random=10' },
  ];

  const popularSearches = [
    { title: 'Estate Agents For Residential Rental', imageUrl: 'https://picsum.photos/300/200?random=11' },
    { title: 'Estate Agents For Residence', imageUrl: 'https://picsum.photos/300/200?random=12' },
    { title: 'Interior Designers', imageUrl: 'https://picsum.photos/300/200?random=13' },
    { title: 'Real Estate Agents', imageUrl: 'https://picsum.photos/300/200?random=14' },
    { title: 'Banquet Halls', imageUrl: 'https://picsum.photos/300/200?random=15' },
    { title: 'Wedding Planners', imageUrl: 'https://picsum.photos/300/200?random=16' },
    { title: 'Party Halls', imageUrl: 'https://picsum.photos/300/200?random=17' },
    { title: 'Photography Services', imageUrl: 'https://picsum.photos/300/200?random=18' },
  ];

  // ✅ Auto-scroll logic (only affects tourist section)
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 250; // px per scroll
    const interval = 2500; // ms

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;

      scrollAmount += scrollStep;
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, interval);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <section className="p-8 bg-gray-50 font-sans max-w-full">

      {/* Explore Top Tourist Places Section */}
      <div className="mb-6 border-2 border-gray-500 p-5 rounded-3xl">
        <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-6">
          Explore Top Tourist Places <span className="text-red-600 text-sm align-top font-extrabold">NEW</span><span className='hover:text-yellow-500 ml-5'>{">>>"}</span>
        </h2>

        <div className="relative">
          <div
            ref={scrollRef} // ✅ added ref here
            className="flex overflow-x-scroll scrollbar-hide space-x-4 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {touristPlaces.map((place, index) => (
              <TouristPlaceCard
                key={index}
                city={place.city}
                imageUrl={place.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Searches Section (UNCHANGED) */}
      <div className='ml-2'>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Popular Searches
        </h2>

        <div className="relative">
          <div className="flex overflow-x-scroll space-x-[18px] py-2">
            {popularSearches.map((search, index) => (
              <PopularSearchCard
                key={index}
                title={search.title}
                imageUrl={search.imageUrl}
                className="hover:scale-105"
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
};

export default TouristAndSearchPage;
