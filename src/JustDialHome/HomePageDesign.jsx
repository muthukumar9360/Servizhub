import React from "react";

const BillsAndRecharge = () => {
  const billServices = [
    { name: "Mobile", icon: "📱" },
    { name: "Electricity", icon: "💡" },
    { name: "DTH", icon: "📡" },
    { name: "Water", icon: "💧" },
    { name: "Gas", icon: "⛽" },
    { name: "Insurance", icon: "☂️" },
  ];

  return (
    <section className="w-full bg-white border-b border-gray-300 flex justify-between items-center py-6 px-6 gap-5">
      {/* Left Info Section */}
      <div className="flex flex-col gap-2 w-1/3">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bills & Recharge
        </h2>
        <p className="text-gray-600 mb-2">
          Pay your bills & recharge instantly with Justdial
        </p>
        <a
          href="#"
          className="text-blue-600 font-medium hover:underline mb-6 block"
        >
          Explore More
        </a>
      </div>

      {/* Right Grid Section */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 w-full">
        {billServices.map((service, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl hover:shadow-lg hover:scale-110 transition-all cursor-pointer py-8 duration-300"
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <p className="text-md font-medium text-gray-700 text-center">
              {service.name}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

const TravelBookings = () => {
  const travelServices = [
    { name: "Flight", icon: "✈️", poweredBy: "Powered by Easemytrip.com" },
    { name: "Bus", icon: "🚌", poweredBy: "Affordable Rides" },
    { name: "Train", icon: "🚆", poweredBy: "Indian Railways" },
    { name: "Hotel", icon: "🏨", poweredBy: "Budget-friendly Stay" },
    { name: "Car Rentals", icon: "🚗", poweredBy: "Drive Easy Anywhere" },
    { name: "Holiday Packages", icon: "🌴", poweredBy: "Best Deals" },
  ];

  return (
    <section className="w-full bg-white flex justify-between items-center py-6 px-6 gap-5">
      {/* Left Info Section */}
      <div className="flex flex-col gap-2 w-1/3">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Travel Bookings
        </h2>
        <p className="text-gray-600 mb-2">
          Instant ticket bookings for your best travel experience
        </p>
        <a
          href="#"
          className="text-blue-600 font-medium hover:underline mb-6 block"
        >
          Explore More
        </a>
      </div>

      {/* Right Grid Section */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 w-full">
        {travelServices.map((service, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center border-2 border-gray-300 rounded-2xl hover:shadow-lg cursor-pointer p-3 hover:scale-110 transition-all duration-300"
          >
            <div className="text-3xl mb-2">{service.icon}</div>
            <p className="text-md font-medium text-gray-700 text-center">
              {service.name}
            </p>
            {service.poweredBy && (
              <p className="text-xs text-green-600 text-center mt-1">
                {service.poweredBy}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const HomePageDesign = () => {
  return (
    <div className="flex flex-col items-center bg-gray-50 w-screen py-4">
      <section className="w-11/12 rounded-xl shadow-md border-2 border-gray-300 bg-white">
        <BillsAndRecharge />
        <TravelBookings />
      </section>
    </div>
  );
};

export default HomePageDesign;
