export default function HomePageJustDial() {
  const categories = [
    { name: "Restaurants", icon: "🍽️" },
    { name: "Hotels", icon: "🏨" },
    { name: "Beauty Spa", icon: "💆‍♀️" },
    { name: "Home Decor", icon: "🛋️" },
    { name: "Wedding Planning", icon: "💍" },
    { name: "Education", icon: "🎓" },
    { name: "Rent & Hire", icon: "🔑" },
    { name: "Hospitals", icon: "🏥" },
    { name: "Contractors", icon: "👷" },
    { name: "Pet Shops", icon: "🐾" },
    { name: "PG/Hostels", icon: "🛏️" },
    { name: "Estate Agent", icon: "🏘️" },
    { name: "Dentists", icon: "🦷" },
    { name: "Gym", icon: "🏋️‍♂️" },
    { name: "Loans", icon: "💰" },
    { name: "Event Organisers", icon: "🎉" },
    { name: "Driving Schools", icon: "🚗" },
    { name: "Packers & Movers", icon: "📦" },
    { name: "Courier Service", icon: "🚚" },
    { name: "Popular Categories", icon: "📋" },
  ];

  return (
    <div className="flex flex-col items-center">

      {/* Categories */}
      <section className="max-w-full mt-5 p-6 rounded-xl shadow-md mx-5 border-2 border-gray-300">
        <div className="grid grid-cols-10 gap-7">
          {categories.map((cat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-3 border-2 border-gray-300 rounded-2xl hover:shadow-2xl hover:scale-110 cursor-pointer transition-all duration-200 hover:border-2 hover:border-black"
            >
              <div className="text-3xl mb-2">{cat.icon}</div>
              <p className="text-md font-medium text-gray-700 text-center">
                {cat.name}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
