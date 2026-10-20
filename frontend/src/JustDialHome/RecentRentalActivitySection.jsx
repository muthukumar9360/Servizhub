import React from "react";

const ReviewCard = ({ depotName, location, logoUrl, reviewText, reviewerName }) => (
  <div className="p-5 border border-gray-200 rounded-2xl shadow-xs bg-white h-full flex flex-col hover:shadow-xl transition duration-200">
    <h3 className="text-base font-extrabold text-gray-900 leading-snug">{depotName}</h3>
    <p className="text-xs text-gray-500 mb-3">{location}</p>

    <div className="flex-grow">
      <div className="w-full h-32 mb-3 overflow-hidden rounded-xl bg-gray-100">
        <img src={logoUrl} alt={depotName} className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center mb-2">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="" className="w-7 h-7 rounded-full object-cover mr-2" />
        <div>
          <p className="text-xs font-bold text-gray-900">{reviewerName}</p>
          <p className="text-[10px] text-gray-400">Verified Equipment Renter</p>
        </div>
      </div>

      <div className="text-amber-400 text-sm mb-1">★★★★★</div>
      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{reviewText}</p>
    </div>
  </div>
);

const OfferCard = ({ serviceName, location, offerDetails, agentName, offerImageUrl }) => (
  <div className="p-5 border border-gray-200 rounded-2xl shadow-xs bg-white h-full flex flex-col hover:shadow-xl transition duration-200">
    <div className="flex justify-between items-start mb-1">
      <h3 className="text-base font-extrabold text-gray-900 leading-snug">{serviceName}</h3>
      <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg hover:bg-emerald-700 transition shrink-0">
        WhatsApp Depot
      </a>
    </div>
    <p className="text-xs text-gray-500 mb-3">{location}</p>

    <div className="flex-grow">
      <div className="w-full h-32 mb-3 overflow-hidden rounded-xl bg-gray-100">
        <img src={offerImageUrl} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center mb-2">
        <img src="https://randomuser.me/api/portraits/men/44.jpg" alt="" className="w-7 h-7 rounded-full object-cover mr-2" />
        <div>
          <p className="text-xs font-bold text-gray-900">{agentName}</p>
          <p className="text-[10px] text-gray-400">Depot Operations Manager</p>
        </div>
      </div>

      <div className="text-amber-400 text-sm mb-1">★★★★★</div>
      <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{offerDetails}</p>
    </div>
  </div>
);

const RatingCard = ({ title, rating, numRatings, location, cardImageUrl }) => (
  <div className="p-5 border border-gray-200 rounded-2xl shadow-xs bg-white h-full hover:shadow-xl transition duration-200">
    <h3 className="text-base font-extrabold text-gray-900 mb-4">Rate Your Rental Experience</h3>

    <div className="flex mb-4 pb-4 border-b border-gray-100">
      <div className="w-24 h-20 mr-3 shrink-0 rounded-xl overflow-hidden bg-gray-100">
        <img src={cardImageUrl} alt={title} className="w-full h-full object-cover" />
      </div>
      <div className="flex-grow text-xs">
        <p className="font-bold text-gray-900">{title}</p>
        <p className="text-gray-500 text-[11px]">{location}</p>
        <div className="flex items-center my-1">
          <span className="font-bold text-emerald-600 mr-1">{rating}</span>
          <span className="text-amber-400 text-xs">★</span>
          <span className="text-gray-400 text-[10px] ml-1">({numRatings} Reviews)</span>
        </div>
        <button className="text-blue-600 font-bold hover:underline">Tap to Rate Equipment</button>
      </div>
    </div>
  </div>
);

const RecentRentalActivitySection = () => {
  const activities = [
    {
      type: "review",
      depotName: "TechRent Solutions Depot",
      location: "Chennai Central - Pasumpon Road",
      logoUrl: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
      reviewerName: "V. Selvakumar",
      reviewText: "TechRent Solutions provided a CAT 320 Hydraulic Excavator in top operational order. Site delivery was punctual and machine operator was highly trained.",
    },
    {
      type: "offer",
      serviceName: "South India Camera Depot",
      location: "Kodambakkam Cinema Hub - Chennai",
      agentName: "Sivakumar",
      offerImageUrl: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80",
      offerDetails: "Special discount on Sony FX6 & RED V-Raptor 8K packages. Pre-rental sensor calibration certificate included.",
    },
    {
      type: "rating",
      title: "Cummins Genset Depot",
      location: "Madurai Industrial Estate",
      rating: 4.9,
      numRatings: 342,
      cardImageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section className="bg-gray-50 font-sans px-8 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">Recent Rental Activity & Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((item, idx) => {
            if (item.type === "review") return <ReviewCard key={idx} {...item} />;
            if (item.type === "offer") return <OfferCard key={idx} {...item} />;
            if (item.type === "rating") return <RatingCard key={idx} {...item} />;
            return null;
          })}
        </div>
      </div>
    </section>
  );
};

export default RecentRentalActivitySection;
