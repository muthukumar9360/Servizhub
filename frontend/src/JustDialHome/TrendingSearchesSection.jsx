import React, { useRef, useEffect } from 'react';

// --- Trending Search Card ---
const TrendingSearchCard = ({ title, imageUrl }) => {
  return (
    <div className="w-44 sm:w-48 md:w-52 lg:w-56 flex-shrink-0 cursor-pointer rounded-lg overflow-hidden shadow-sm bg-gray-600 hover:shadow-2xl transition-transform duration-300 hover:-translate-y-1">
      <div className="h-28 relative overflow-hidden group">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
      </div>

      <div className="bg-blue-600 px-3 py-3 text-white">
        <p className="text-sm md:text-base font-semibold leading-tight truncate">
          {title}
        </p>
        <button className="bg-white text-blue-600 text-xs md:text-sm font-semibold py-1.5 px-3 md:px-4 rounded hover:bg-gray-100 transition duration-150">
          Explore
        </button>
      </div>
    </div>
  );
};

// --- Trending Searches Section ---
const TrendingSearchesSection = () => {
  const scrollRef = useRef(null);

  const trendingSearches = [
    { title: 'Luxury Hotels', imageUrl: 'https://picsum.photos/300/200?random=21' },
    { title: 'Adventure Trips', imageUrl: 'https://picsum.photos/300/200?random=22' },
    { title: 'Food Tours', imageUrl: 'https://picsum.photos/300/200?random=23' },
    { title: 'City Walks', imageUrl: 'https://picsum.photos/300/200?random=24' },
    { title: 'Historical Sites', imageUrl: 'https://picsum.photos/300/200?random=25' },
    { title: 'Nightlife', imageUrl: 'https://picsum.photos/300/200?random=26' },
    { title: 'Shopping Streets', imageUrl: 'https://picsum.photos/300/200?random=27' },
    { title: 'Photography Spots', imageUrl: 'https://picsum.photos/300/200?random=28' },
    { title: 'Seashore Spots', imageUrl: 'https://picsum.photos/300/200?random=29' },
    { title: 'Shopping Areas', imageUrl: 'https://picsum.photos/300/200?random=30' },
    { title: 'Bike Riding', imageUrl: 'https://picsum.photos/300/200?random=31' },
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = 260;
    const interval = 2000;

    const scrollInterval = setInterval(() => {
      if (!scrollContainer) return;

      scrollAmount += scrollStep;
      if (scrollAmount >= scrollContainer.scrollWidth - scrollContainer.clientWidth+300) {
        scrollAmount = 0;
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollTo({ left: scrollAmount, behavior: 'smooth' });
      }
    }, interval);

    return () => clearInterval(scrollInterval);
  }, []);

  return (
    <section className="px-5 mt-1 mx-1 bg-gray-100 font-sans max-w-full">
      <div className="border-2 border-gray-500 p-4 rounded-3xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Trending Searches Near You{' '}
          <span className="text-red-600 text-sm align-top font-extrabold">HOT</span>
          <span className="hover:text-yellow-500 ml-5">{'>>>'}</span>
        </h2>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll scrollbar-hide space-x-4 py-2"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {trendingSearches.map((item, index) => (
              <TrendingSearchCard
                key={index}
                title={item.title}
                imageUrl={item.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingSearchesSection;
