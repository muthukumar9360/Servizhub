import React from 'react';

// Define a reusable component for each service item
const ServiceItem = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col mb-2 p-5 shadow-md hover:shadow-2xl transition duration-100">
      <div className="flex items-center mb-3">
        {/* Icon Placeholder */}
        <span className="text-xl mr-3 text-gray-800">{icon}</span> 
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

const DayToDayServicesSection = () => {
  // Array of data for all services
  const servicesData = [
    {
      title: 'B2B',
      icon: '💼', // Placeholder for the icon
      description: 'Experience the ultimate B2B portal by Justdial. You can explore countless diverse categories, innumerable top-quality vendors, and an unmatched wholesale experience. You’ll find everything you need for B2B requirements on this exclusive platform. Our interactive interface allows you to apply relevant filters, ascertain the best rates, and get instant assistance via chat.',
    },
    {
      title: 'All India',
      icon: '🌍',
      description: 'Elevate your search for B2B requisites. From lead generation to promoting and selling products/services, Justdial enables enterprises to reach vast audiences all across India. Embracing digital strategies, Justdial India encompasses manufacturers, dealers, suppliers, vendors, wholesalers, and more, offering convenience in the B2B market space and empowering businesses nationwide.',
    },
    {
      title: 'Packers and Movers',
      icon: '📦',
      description: 'If you’re relocating to another place, or even if you just want to send some belongings elsewhere, find the best deals on the most reliable packers and movers for your location. Get quotes from multiple agencies, read reviews from previous customers, and check ratings before making a selection for a hassle-free experience.',
    },
    {
      title: 'Order Food Online',
      icon: '🍽️',
      description: 'You are just three clicks away from placing an order and exploring a wide range of exotic cuisines. Order food online with Justdial and get your favourite food delivered at your doorstep. Search for restaurants, view reviews and ratings, avail discounts and order your food.',
    },
    // --- Second Row ---
    {
      title: 'Jobs',
      icon: '📄',
      description: 'Providing pertinent jobs to job seekers and relevant profiles to employers, this service will help you reach out to employers and vice-versa across industry verticals, experience levels and geographies.',
    },
    {
      title: 'Movies',
      icon: '🎥',
      description: 'This gives you access to book tickets and keep updated with the latest movies. With the provision of a synopsis, cast, crew and trailer, you can make a better choice in the movie you would like to watch.',
    },
    // --- Third Row ---
    {
      title: 'Real Estate Agents',
      icon: '🔑',
      description: 'Discover the power of our cohesive platform for simplified property searches. Whether your interest lies in PG, rentals, buying, or selling, you can connect with trusted agents and developers and stay updated on upcoming or trending residential and commercial projects.',
    },
    {
      title: 'Online Recharge/Bill Payment',
      icon: '💳',
      description: 'With the help of this service you can stay on back in making your bill payments and recharges without having to wait in a queue. This includes bill payments for gas, electricity, data card, DTH, landline, etc.',
    },
    // The image shows the last row as having only 3 items, leaving the 4th column empty.
  ];

  return (
    <section className="bg-white font-sans mx-auto pb-5">
      <h2 className="text-3xl font-bold text-gray-900 mb-5 ml-5 pt-8">
        Some of our services that will prove useful to you on a day-to-day basis are :
      </h2>

      {/* Grid Container for 4 columns */}
      <div className="grid grid-cols-4 gap-x-4 gap-y-4 mx-5">
        {servicesData.map((service, index) => (
          <ServiceItem
            key={index}
            title={service.title}
            description={service.description}
            icon={service.icon} 
          />
        ))}
      </div>
    </section>
  );
};

export default DayToDayServicesSection;