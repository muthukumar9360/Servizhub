import React from "react";

const CopySection = () => {
  return (
    <>
      {/* Section 1 */}
      <section className="bg-gradient-to-br from-pink-500 to-pink-900 rounded-xl text-white flex flex-col lg:flex-row items-center justify-between gap-6 my-10 px-20 mx-10 py-16 mt-8">
        <div className="max-w-md">
          <h2 className="text-4xl font-bold mb-3">Stuck at vibe coding?</h2>
          <p className="mb-5 text-white/90 font-semibold text-xl">
            Get matched with the right expert to turn your prototype into a real, working product.
          </p>
          <button className="bg-white text-black font-semibold px-4 py-2 rounded hover:bg-gray-300">
            Find an expert
          </button>
        </div>
        <div className="relative">
          <video
            autoPlay
            muted
            loop
            className="rounded-lg shadow-lg w-[600px] h-[400px] object-cover"
          >
            <source src="/Vibe_coding_video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* Section 2 */}
      <section className="bg-green-50 rounded-xl border-2 border-black p-10 mx-10 flex flex-col lg:flex-row items-center justify-between gap-10 my-10">
        <div className="pl-16">
          <img
            src="/images/team_work.png"
            alt="Team working"
            className="rounded-lg shadow-lg w-[600px] h-[400px] object-cover"
          />
        </div>
        <div className="max-w-xl">
          <h3 className="text-5xl font-bold text-gray-800 mb-8">
            servizio <span className="font-normal">pro.</span>
          </h3>
          <h2 className="text-3xl font-semibold mb-6">
            The <span className="text-green-600">premium</span> freelance solution for businesses
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-md text-gray-700 mb-6">
            <li>
              <strong className="text-green-800">✔</strong> Dedicated hiring experts
            </li>
            <li>
              <strong className="text-green-800">✔</strong> Satisfaction guarantee
            </li>
            <li>
              <strong className="text-green-800">✔</strong> Advanced management tools
            </li>
            <li>
              <strong className="text-green-800">✔</strong> Flexible payment models
            </li>
          </ul>
          <button className="bg-black text-white px-5 py-2 mt-5 rounded hover:bg-gray-800">
            Try Now
          </button>
        </div>
      </section>
    </>
  );
};

export default CopySection;
