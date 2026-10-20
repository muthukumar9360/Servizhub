import React from 'react';
// --- Card Components ---

// 1. Review/Activity Card (Left Side)
const ReviewCard = ({ bankName, location, logoUrl, reviewText, reviewerName }) => (
  <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white h-full flex flex-col hover:shadow-2xl transition-shadow duration-100">
    <h3 className="text-lg font-semibold text-gray-800 leading-snug">{bankName}</h3>
    <p className="text-xs text-gray-500 mb-4">{location}</p>

    <div className="flex-grow">
      {/* Logo/Image Area */}
      <div className="w-full h-28 mb-3 overflow-hidden rounded-md">
        <img src={logoUrl} alt={`${bankName} Logo`} className="w-full h-full object-cover" />
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200">
          <img src="https://randomuser.me/api/portraits/men/35.jpg" alt={reviewerName} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{reviewerName}</p>
          <p className="text-xs text-gray-500">Wrote a review</p>
        </div>
      </div>

      <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
      <p className="text-sm text-gray-600 line-clamp-3">{reviewText}</p>
    </div>
  </div>
);

// 2. Loan/Service Offer Card (Middle)
const OfferCard = ({ serviceName, location, offerDetails, agentName, offerImageUrl }) => (
  <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white h-full flex flex-col hover:shadow-2xl transition-shadow duration-100">
    <div className="flex justify-between items-start">
      <h3 className="text-lg font-semibold text-gray-800 leading-snug">{serviceName}</h3>
      <div className="flex items-center bg-green-500 text-white text-xs py-1 px-3 rounded-lg ml-2 hover:bg-green-800 cursor-pointer">
        <a href="#">🕵️‍♂️ WhatsApp</a>
      </div>
    </div>
    <p className="text-xs text-gray-500 mb-4">{location}</p>

    <div className="flex-grow">
      {/* Offer Image Area */}
      <div className="w-full h-28 mb-3 overflow-hidden rounded-md relative">
        <img src={offerImageUrl} alt="Offer" className="w-full h-full object-cover opacity-90" />
      </div>

      {/* Agent Info */}
      <div className="flex items-center mb-2">
        <div className="w-8 h-8 rounded-full overflow-hidden mr-2 bg-gray-200">
          <img src="https://randomuser.me/api/portraits/men/40.jpg" alt={agentName} className="w-full h-full object-cover" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-700">{agentName}</p>
          <p className="text-xs text-gray-500">Agent</p>
        </div>
      </div>

      <div className="text-yellow-500 text-lg mb-2">★★★★★</div>
      <p className="text-sm text-gray-600 line-clamp-3">{offerDetails}</p>
    </div>
  </div>
);

// 3. Rating/Feedback Card (Right Side)
const RatingCard = ({ title, rating, numRatings, location, cardImageUrl }) => (
  <div className="p-4 border border-gray-200 rounded-xl shadow-sm bg-white h-full hover:shadow-2xl transition-shadow duration-100">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">How would you rate your experience?</h3>

    {/* Item 1 */}
    <div className="flex mb-4 border-b-4">
      <div className="w-32 h-24 mr-3 flex-shrink-0">
        <img src={cardImageUrl} alt={title} className="w-full h-full object-cover rounded-sm" />
      </div>
      <div className="flex-grow">
        <p className="text-base font-semibold text-gray-800">{title}</p>
        <p className="text-xs text-gray-500">{location}</p>
        <div className="flex items-center">
          <span className="text-sm font-bold text-green-600 mr-1">{rating}</span>
          <span className="text-yellow-500 text-base">★</span>
          <span className="text-xs text-gray-500 ml-1">({numRatings} Ratings)</span>
        </div>
        <div className="flex space-x-2 text-xl text-gray-300">
          <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
        </div>
        <button className="text-blue-600 text-xs font-medium hover:underline mb-3">Tap to rate</button>
      </div>
    </div>

    {/* Item 2 */}
    <div className="flex">
      <div className="w-32 h-24 mr-3 flex-shrink-0">
        <img src="https://images.unsplash.com/photo-1568605114967-8130f3a36994" alt="Hotel Green Star" className="w-full h-full object-cover rounded-sm" />
      </div>
      <div className="flex-grow">
        <p className="text-base font-semibold text-gray-800">Hotel Green Star Hospitality</p>
        <p className="text-xs text-gray-500">Malad, West</p>
        <div className="flex items-center">
          <span className="text-sm font-bold text-green-600 mr-1">4.2</span>
          <span className="text-yellow-500 text-base">★</span>
          <span className="text-xs text-gray-500 ml-1">(539 Ratings)</span>
        </div>
        <div className="flex space-x-2 text-xl text-gray-300">
          <span>☆</span><span>☆</span><span>☆</span><span>☆</span><span>☆</span>
        </div>
        <button className="text-blue-600 text-xs font-medium hover:underline">Tap to rate</button>
      </div>
    </div>
  </div>
);

// --- Main Section Component ---
const RecentActivitySection = () => {
  const activities = [
    {
      type: 'review',
      bankName: 'Tamilnad Mercantile Bank Ltd',
      location: 'Pasuvanthandai Road - Kovilpatti',
      logoUrl: 'https://images.unsplash.com/photo-1603791440384-56cd371ee9a7',
      reviewerName: 'V. Selvakumar',
      reviewText: 'Tamilnad Mercantile Bank Ltd is a reliable and customer-friendly bank. The reasonable fees make it a great choice for banking services.',
    },
    {
      type: 'offer',
      serviceName: 'Raja Home Loans',
      location: 'Old Bus Stand Road - Kovilpatti',
      agentName: 'Sivakumar',
      offerImageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      offerDetails: 'I had an excellent experience with Raja Home Loans. They had financial advisors available to assist me, and the process was smooth.',
    },
    {
      type: 'rating',
      title: 'Manju Estates',
      location: 'Tardeo',
      rating: 4.8,
      numRatings: 1538,
      cardImageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
    },
    {
      type: 'review',
      bankName: 'City Union Bank Ltd',
      location: 'Main Road - Madurai',
      logoUrl: 'https://images.unsplash.com/photo-1573164574472-797cdf4a583a',
      reviewerName: 'A. Priya',
      reviewText: 'City Union Bank offers excellent fixed deposit rates and convenient mobile banking.',
    },
    {
      type: 'offer',
      serviceName: 'Sai Motors Car Loan',
      location: 'Bypass Road - Virudhunagar',
      agentName: 'R. Karthik',
      offerImageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
      offerDetails: 'Got my car loan approved quickly through Sai Motors. The interest rate was competitive and the staff was very helpful.',
    },
    {
      type: 'rating',
      title: 'Ocean View Rentals',
      location: 'Bandra, West',
      rating: 4.5,
      numRatings: 890,
      cardImageUrl: 'https://images.unsplash.com/photo-1502877338535-766e1452684a',
    },
  ];

  return (
    <section className="bg-gray-50 font-sans px-10 -mt-2">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">Recent Activity</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activities.map((item, index) => {
          if (item.type === 'review') return <ReviewCard key={index} {...item} />;
          if (item.type === 'offer') return <OfferCard key={index} {...item} />;
          if (item.type === 'rating') return <RatingCard key={index} {...item} />;
          return null;
        })}
      </div>

      <div className="mt-5 text-center">
        <a
          href="/all-recent-activity"
          className="inline-block bg-blue-600 border-2 border-black hover:bg-white hover:text-black text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-200 mb-5"
        >
          Load More
        </a>
      </div>
    </section>
  );
};

export default RecentActivitySection;
