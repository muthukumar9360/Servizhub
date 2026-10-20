import React from "react";

const ServiceItem = ({ title, description, icon }) => (
  <div className="flex flex-col p-5 bg-white rounded-2xl border border-gray-200 shadow-xs hover:shadow-xl transition duration-200">
    <div className="flex items-center mb-3">
      <span className="text-2xl mr-3">{icon}</span>
      <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
    </div>
    <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
  </div>
);

const DailyEquipmentRentalSection = () => {
  const servicesData = [
    {
      title: "B2B Depot Network",
      icon: "💼",
      description: "Experience the ultimate equipment rental portal by Equipora. Explore 25 diverse categories, verified depot vendors, wholesale project rates, and site transport delivery.",
    },
    {
      title: "All India Coverage",
      icon: "🌍",
      description: "From heavy hydraulic excavators to cinema cameras, Equipora connects contractor enterprises across Chennai, Coimbatore, Madurai, Bengaluru, Hyderabad, and Mumbai.",
    },
    {
      title: "Heavy Haulage & Site Transport",
      icon: "📦",
      description: "Relocating heavy machinery or cinema gear? Get quotes from verified equipment transport logistics partners for zero-damage site transit.",
    },
    {
      title: "Instant Equipment Booking",
      icon: "⚡",
      description: "Order excavators, power generators, and cinema packages online with real-time date overlap verification and instant deposit reservation.",
    },
    {
      title: "Certified Machine Operators",
      icon: "👷",
      description: "Hire skilled excavator, crane, and generator operators along with your heavy machinery for complete site execution.",
    },
    {
      title: "Zero Breakdown Guarantee",
      icon: "🛡️",
      description: "All equipment undergoes strict pre-handover calibration and safety checks before leaving the depot, backed by rapid replacement support.",
    },
    {
      title: "Depot Storefronts & Rentals",
      icon: "🔑",
      description: "Discover trusted equipment stores and rental depots for long-term construction or filming projects with transparent weekly and monthly discounts.",
    },
    {
      title: "Security Deposit Shield",
      icon: "💳",
      description: "Transparent handover & return inspection comparison protecting renters against false damage claims with admin dispute resolution.",
    },
  ];

  return (
    <section className="bg-white font-sans px-8 py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-black text-gray-900 mb-6 tracking-tight">
          Day-to-Day Equipment Rental Advantages
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {servicesData.map((service, index) => (
            <ServiceItem key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default DailyEquipmentRentalSection;