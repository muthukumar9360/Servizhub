import React from "react";

const CombinedSection = () => {
  return (
    <div className="bg-white">
      {/* Success Section */}
      <section className="px-10">
        <h2 className="text-4xl font-semibold text-gray-800 mb-2 text-center">
          What success on Fiverr looks like
        </h2>
        <p className="text-gray-900 mb-6 text-center">
          Vontélle Eyewear turns to Fiverr freelancers to bring their vision to life.
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
          Vontélle’s trusted services
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {[
            { title: "3D Industrial Design", img: "https://picsum.photos/400/250" },
            { title: "E-commerce Website Development", img: "https://picsum.photos/400/250" },
            { title: "Email Marketing", img: "https://picsum.photos/400/250" },
            { title: "Press Releases", img: "https://picsum.photos/400/250" },
            { title: "Logo Design", img: "https://picsum.photos/400/250" },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-lg border p-4 flex flex-col items-center text-center hover:shadow-md transition"
            >
              <img src={service.img} alt={service.title} className="mb-4 rounded-2xl" />
              <p className="font-medium text-sm text-gray-800">{service.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Make it all happen Section */}
      <section className="pt-16 pb-8 px-12 text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-10 font-mono">
          Make it all happen with freelancers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 text-gray-700 mb-10">
          {[
            {
              img: "images/1.png",
              text: "Access a pool of top talent across 700 categories",
            },
            {
              img: "images/2.png",
              text: "Enjoy a simple, easy-to-use matching experience",
            },
            {
              img: "images/3.png",
              text: "Get quality work done quickly and within budget",
            },
            {
              img: "images/4.png",
              text: "Only pay when you’re happy",
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
