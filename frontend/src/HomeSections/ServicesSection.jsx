import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchWithCache, getCachedData } from "../utils/apiCache";

const ServicesSection = () => {
  const api = import.meta.env.VITE_SERVER_URL;
  const cached = getCachedData(`${api}/services`);
  const [services, setServices] = useState(() => cached || []);

  useEffect(() => {
    fetchWithCache(`${api}/services`)
      .then((data) => {
        if (data) setServices(data);
      })
      .catch((err) => console.error("Error fetching services:", err));
  }, [api]);

  return (
    <section className="px-10 mt-12 pt-12 bg-white">
      <div className="flex gap-4 items-center">
        {services.length > 0 ? (
          services.map((service, index) => (
            <Link key={index} to={`/services/${service._id}`}>
              <div className="bg-white text-black rounded-2xl shadow-lg border-black border-2 w-50 p-3 hover:scale-105 transition flex flex-col items-center justify-between cursor-pointer">
                <h3 className="font-bold text-md mb-3">{service.title}</h3>
                <img
                  src={service.homeImage}
                  className="rounded-xl w-full h-40 object-contain" 
                  alt={service.title}
                />
              </div>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Loading services...</p>
        )}
      </div>
    </section>
  );
};

export default ServicesSection;
