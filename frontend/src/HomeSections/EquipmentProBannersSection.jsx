import React from "react";
import { Link } from "react-router-dom";

const EquipmentProBannersSection = () => {
  return (
    <>
      {/* Section 1 */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-900 rounded-3xl text-white flex flex-col lg:flex-row items-center justify-between gap-6 my-12 px-12 lg:px-20 mx-6 lg:mx-10 py-16 shadow-2xl">
        <div className="max-w-md">
          <h2 className="text-4xl font-extrabold mb-3 leading-tight">
            Need heavy machinery or specialized gear?
          </h2>
          <p className="mb-6 text-white/90 font-medium text-lg">
            Get matched with top verified equipment owners & depots to deliver your machinery on site today.
          </p>
          <Link to="/browse">
            <button className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-100 transition shadow-lg text-sm">
              Browse All Equipment
            </button>
          </Link>
        </div>
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80"
            alt="Heavy Construction Equipment"
            className="rounded-2xl shadow-2xl w-full lg:w-[500px] h-[320px] object-cover border-2 border-white/20"
          />
        </div>
      </section>

      {/* Section 2 */}
      <section className="bg-green-50 rounded-3xl border-2 border-black p-8 lg:p-12 mx-6 lg:mx-10 flex flex-col lg:flex-row items-center justify-between gap-10 my-12 shadow-xl">
        <div className="w-full lg:w-1/2">
          <img
            src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80"
            alt="Depot Machinery Team"
            className="rounded-2xl shadow-lg w-full h-[340px] object-cover border border-gray-300"
          />
        </div>
        <div className="w-full lg:w-1/2">
          <h3 className="text-5xl font-black text-gray-900 mb-4 tracking-tight">
            equipora <span className="text-green-600 font-bold">pro.</span>
          </h3>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            The <span className="text-green-600">premium</span> equipment rental marketplace for enterprise & depot partners
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 mb-6">
            <li className="flex items-center gap-2">
              <strong className="text-green-600 text-lg">✔</strong> Certified equipment operators
            </li>
            <li className="flex items-center gap-2">
              <strong className="text-green-600 text-lg">✔</strong> Zero breakdown guarantee
            </li>
            <li className="flex items-center gap-2">
              <strong className="text-green-600 text-lg">✔</strong> Site transport delivery & pickup
            </li>
            <li className="flex items-center gap-2">
              <strong className="text-green-600 text-lg">✔</strong> Flexible daily & weekly rental rates
            </li>
          </ul>
          <Link to="/register">
            <button className="bg-black text-white px-6 py-3 font-bold rounded-xl hover:bg-gray-800 transition text-sm shadow-md">
              Become a Provider
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default EquipmentProBannersSection;
