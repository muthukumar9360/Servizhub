import React, { useEffect, useState } from "react";
import sampleImg from "./assets/image.png"; // adjust path based on your project

const RemainingSection = () => {
  const [guides, setGuides] = useState([]);
  const api=import.meta.env.VITE_SERVER_URL;


  useEffect(() => {
    fetch(`${api}/guides`)
      .then((res) => res.json())
      .then((data) => setGuides(data))
      .catch((err) => console.error("Error fetching guides:", err));
  }, []);

  return (
    <>
      {/* Guides Section */}
      <section className="px-16 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">
            Guides to help you grow
          </h2>
          <a href="#" className="text-blue-600 font-medium hover:underline">
            See more
          </a>
        </div>

        <div className="overflow-x-auto">
          <div className="flex space-x-6 pb-6">
            {guides.length > 0 ? (
              guides.map((guide, index) => (
                <div key={index} className="flex-shrink-0 w-72">
                  <img
                    src={sampleImg}
                    className="w-full h-56 object-cover rounded-lg mb-2"
                    alt={guide.title}
                  />
                  <p className="text-gray-700 font-medium text-center">
                    {guide.title}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Loading guides...</p>
            )}
          </div>
        </div>
      </section>

      {/* Freelance Services Banner */}
      <section className="bg-[#541c2b] py-16 px-8 mt-8 rounded-xl max-w-7xl mx-auto text-center">
        <h2 className="text-6xl text-white font-bold">
          Freelance services at your{" "}
          <span className="text-orange-400 font-medium">fingertips</span>
        </h2>
        <div className="mt-10">
          <a
            href="#"
            className="bg-white text-[#541c2b] font-semibold px-5 py-2 rounded-md hover:bg-gray-300"
          >
            Join Servizio
          </a>
        </div>
      </section>
    </>
  );
};

export default RemainingSection;
