import React from 'react';

// --- Card Component ---
const ArticleCard = ({ title, imageUrl, snippet }) => {
  return (
    <div className="w-80 sm:w-96 flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white mr-4 last:mr-0 mb-5">
      {/* Image Area */}
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition duration-300 hover:scale-[1.05]"
        />
      </div>

      {/* Text Content */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-800 mb-2 leading-snug">
          {title}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {snippet}
        </p>
        <a href="#" className="text-blue-600 text-md font-medium hover:underline">
          Explore
        </a>
      </div>
    </div>
  );
};

// --- Main Section Component ---
const RelatedArticlesSlider = () => {
  // Mock Data for Articles
  const articlesData = [
    {
      title: 'Hitchki BKC: Where Cocktails, Quirk, and Comfort Food Collide in Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      snippet: 'Discover the perfect nightlife spot with great ambiance, creative drinks, and delicious Indian fusion comfort food.',
    },
    {
      title: 'Chinese Snacks You Can Make at Home: Easy, Tasty, Addictive in India',
      imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      snippet: 'A list of quick and simple Chinese snacks like chili potatoes and spring rolls that are perfect for your next movie night.',
    },
    {
      title: 'Shop for the Best Sharara Sets from these places in Mumbai',
      imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      snippet: 'Find the trendiest and most elegantly designed Sharara sets for weddings and festive occasions at these top Mumbai boutiques.',
    },
    {
      title: 'Top 5 Weekend Getaways Near Bangalore for Nature Lovers',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
      snippet: 'Escape the city rush with these serene destinations perfect for a quick weekend break, including hills and lakeside resorts.',
    },
    {
      title: 'Budget-Friendly Interior Design Hacks to Refresh Your Living Room',
      imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80',
      snippet: 'Simple and affordable tips and tricks to transform your living space without breaking the bank. Focus on colors and lighting.',
    },
    {
      title: 'Best Cafes in Delhi to Work From: Free Wi-Fi and Great Coffee',
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      snippet: 'A curated list of the best co-working cafes in Delhi NCR that offer a quiet atmosphere and excellent coffee selection.',
    },
  ];

  // Placeholder functions for slider navigation
  const scrollContainerRef = React.useRef(null);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400; // Scroll by roughly one card width
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="bg-white max-w-full mx-10">
      {/* Header and Explore Link */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900 underline pt-3">Related Articles</h2>
        <a href="#" className="text-blue-600 text-md font-medium hover:underline pt-5">
          Explore more &gt;&gt;&gt;
        </a>
      </div>

      {/* Slider Container with Navigation */}
      <div className="relative">

        {/* Scrollable Articles List */}
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden py-2 select-none" // 👈 changed from overflow-x-scroll
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          onWheel={(e) => e.preventDefault()}       // 👈 block mouse wheel scroll
          onTouchMove={(e) => e.preventDefault()}   // 👈 block touch/drag scroll (mobile)
        >
          {articlesData.map((article, index) => (
            <ArticleCard
              key={index}
              title={article.title}
              imageUrl={article.imageUrl}
              snippet={article.snippet}
            />
          ))}
        </div>

        {/* Previous Button (Left Arrow) */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-800 cursor-pointer z-10 opacity-100 transition duration-150 ml-2 text-black font-extrabold"
          aria-label="Previous Article"
        >
          &lt;
        </button>

        {/* Next Button (Right Arrow) */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-800 cursor-pointer z-10 opacity-100 transition duration-150 mr-2 text-black font-extrabold"
          aria-label="Next Article"
        >
          &gt;
        </button>

      </div>
    </section>
  );
};

export default RelatedArticlesSlider;
