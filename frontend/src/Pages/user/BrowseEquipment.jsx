import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, Filter, Star, SlidersHorizontal, MapPin, Wrench, RefreshCw } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Button from "../../components/common/Button";
import Badge from "../../components/common/Badge";

const BrowseEquipment = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [equipments, setEquipments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  // Filters state
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [city, setCity] = useState(searchParams.get("city") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [condition, setCondition] = useState(searchParams.get("condition") || "");

  const fetchEquipments = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", "9");
      if (q) params.set("q", q);
      if (selectedCategory) params.set("category", selectedCategory);
      if (city) params.set("city", city);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (condition) params.set("condition", condition);

      const response = await axiosInstance.get(`/equipments?${params.toString()}`);
      setEquipments(response.data.data.equipments || []);
      setPagination(response.data.data.pagination || { page: 1, totalPages: 1 });
    } catch (e) {
      console.error("Failed to fetch equipment listings", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data || []);
      } catch (e) {
        console.error("Failed to fetch categories", e);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    fetchEquipments(1);
  }, [selectedCategory, condition]);

  const resetAllFilters = () => {
    setQ("");
    setSelectedCategory("");
    setCity("");
    setMaxPrice("");
    setCondition("");
    setSearchParams({});
    fetchEquipments(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Browse Rental Equipment</h1>
          <p className="text-sm text-gray-600 mt-1">Find verified heavy machinery, cinema cameras, sound systems, and generators</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Filter Column */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs h-fit space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-green-600" /> Filters
              </h3>
              <button
                onClick={resetAllFilters}
                className="text-xs text-green-600 hover:underline font-semibold flex items-center gap-1"
              >
                <RefreshCw className="h-3 w-3" /> Reset All
              </button>
            </div>

            {/* Keyword Search */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Search Keywords</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Excavator, Sony FX6..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </div>

            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.mainCategory}
                  </option>
                ))}
              </select>
            </div>

            {/* City Location */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City Location</label>
              <input
                type="text"
                placeholder="e.g. Chennai, Madurai"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* Max Daily Rate */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Max Rate: <span className="text-green-600 font-extrabold">{maxPrice ? `₹${maxPrice}/day` : "Any"}</span>
              </label>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={maxPrice || 25000}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full accent-green-600"
              />
            </div>

            {/* Condition Filter */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 outline-none bg-white"
              >
                <option value="">Any Condition</option>
                <option value="EXCELLENT">Excellent Condition</option>
                <option value="GOOD">Good Condition</option>
                <option value="FAIR">Fair Condition</option>
              </select>
            </div>

            <Button onClick={() => fetchEquipments(1)} variant="primary" className="w-full py-2.5 text-xs font-bold bg-green-600 hover:bg-green-700">
              Apply Filters
            </Button>
          </div>

          {/* Right Main Equipment Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="py-20 text-center text-gray-500">
                <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-3" />
                Loading equipment listings...
              </div>
            ) : equipments.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-gray-200 shadow-xs">
                <Wrench className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900">No equipment found</h3>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search query or reset filters.</p>
                <Button onClick={resetAllFilters} variant="secondary" className="mt-4 text-xs font-bold">
                  Reset Search
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {equipments.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => navigate(`/equipment/${item._id}`)}
                      className="group bg-white rounded-2xl border-2 border-gray-900 overflow-hidden shadow-md hover:shadow-xl hover:border-green-600 transition cursor-pointer flex flex-col"
                    >
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={item.images[0]?.url || "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80"}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-bold text-gray-800 flex items-center gap-1 shadow-xs">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {item.averageRating || 5.0}
                        </span>
                        <div className="absolute top-3 left-3">
                          <Badge status={item.availabilityStatus} />
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[10px] font-extrabold uppercase text-green-700 tracking-wider">
                            {item.category?.mainCategory}
                          </span>
                          <h3 className="font-bold text-gray-900 text-base group-hover:text-green-600 transition line-clamp-1 mt-0.5">
                            {item.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <MapPin className="h-3.5 w-3.5 text-gray-400" />
                            {item.location?.city || "Chennai"}
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-black text-green-600">₹{item.rentalPrice}</span>
                            <span className="text-[10px] text-gray-400">/day</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => fetchEquipments(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-xs font-bold text-gray-700">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled={pagination.page >= pagination.totalPages}
                      onClick={() => fetchEquipments(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseEquipment;
