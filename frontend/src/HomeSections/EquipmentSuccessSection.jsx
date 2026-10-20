import React from "react";

const CombinedSection = () => {
  return (
    <div className="bg-white">
      {/* Success Section */}
      <section className="px-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2 text-center">
          What success on Servizio Equipment Rental looks like
        </h2>
        <p className="text-gray-900 mb-6 text-center">
          Contractors and production houses rely on Servizio equipment rentals to complete projects on time.
        </p>

        <div className="rounded-xl overflow-hidden shadow-lg max-w-6xl mx-auto">
          <video
            controls
            autoPlay
            muted
            loop
            className="w-full h-[600px] rounded-xl object-cover"
          >
            <source
              src="https://www.w3schools.com/howto/rain.mp4"
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Vontélle’s trusted services */}
      <section className="pt-20 px-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-800 font-serif">
          Top Equipment Categories for Hire
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: "Heavy Excavators & Earthmoving", img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=400&auto=format&fit=crop&q=80" },
            { title: "4K & 8K Cinema Cameras", img: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=400&auto=format&fit=crop&q=80" },
            { title: "Concert Sound & Stage PA", img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&auto=format&fit=crop&q=80" },
            { title: "Silent Power Generators", img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&auto=format&fit=crop&q=80" },
            { title: "Demolition & Power Tools", img: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=80" },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg border p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <img src={service.img} alt={service.title} className="mb-4 rounded-2xl h-36 object-cover w-full" />
              <p className="font-medium text-sm text-gray-800">{service.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Make it all happen Section */}
      <section className="pt-16 pb-8 px-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 font-mono">
          Make it all happen with Servizio Equipment Rental
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-700 mb-10">
          {[
            {
              img: "images/1.png",
              text: "Access verified machinery and tools across 500+ rental categories",
            },
            {
              img: "images/2.png",
              text: "Enjoy flexible daily, weekly, or monthly rental options",
            },
            {
              img: "images/3.png",
              text: "Get premium certified equipment delivered directly to your site",
            },
            {
              img: "images/4.png",
              text: "Only pay after equipment inspection and booking confirmation",
            },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <img src={item.img} alt="" />
              <p className="text-sm">{item.text}</p>
            </div>
          ))}
        </div>

        <button className="bg-black text-white px-6 py-2 rounded font-semibold hover:bg-gray-300 hover:text-black transition">
          Join now
        </button>
      </section>
    </div>
  );
};

export default CombinedSection;
