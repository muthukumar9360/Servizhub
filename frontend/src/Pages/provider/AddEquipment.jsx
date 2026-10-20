import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Wrench, Upload, Plus, Trash2, ArrowLeft } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import Input from "../../Components/common/Input";
import Button from "../../Components/common/Button";

const AddEquipment = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [modelName, setModelName] = useState("");
  const [condition, setCondition] = useState("EXCELLENT");
  const [rentalPrice, setRentalPrice] = useState("");
  const [securityDeposit, setSecurityDeposit] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [city, setCity] = useState("Chennai");
  const [address, setAddress] = useState("");
  const [pickupInstructions, setPickupInstructions] = useState("");

  const [specifications, setSpecifications] = useState([
    { key: "Operating Weight", value: "" },
    { key: "Power Output", value: "" },
  ]);

  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await axiosInstance.get("/categories");
        setCategories(res.data.data || []);
        if (res.data.data?.length > 0) setCategory(res.data.data[0]._id);
      } catch (e) {
        console.error(e);
      }
    };
    fetchCats();
  }, []);

  const addSpecRow = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecRow = (idx) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  const updateSpecRow = (idx, field, val) => {
    const updated = [...specifications];
    updated[idx][field] = val;
    setSpecifications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !description || !rentalPrice || !category) {
      alert("Please fill all required equipment details.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("brand", brand);
      formData.append("modelName", modelName);
      formData.append("condition", condition);
      formData.append("rentalPrice", rentalPrice);
      formData.append("securityDeposit", securityDeposit || "0");
      formData.append("quantity", quantity);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("pickupInstructions", pickupInstructions);
      formData.append("specifications", JSON.stringify(specifications.filter((s) => s.key && s.value)));

      for (let file of imageFiles) {
        formData.append("images", file);
      }

      await axiosInstance.post("/equipments", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Equipment listing submitted for Admin review!");
      navigate("/provider/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit equipment listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-xs font-bold text-gray-600 hover:text-indigo-600 mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </button>

        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Add Equipment Listing</h1>
            <p className="text-xs text-gray-500 mt-1">List heavy machinery, camera gear, or power tools for short-term hire</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Equipment Name"
              placeholder="e.g. CAT 320 Hydraulic Excavator"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.mainCategory}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Provide detailed operating specifications, included attachments, and pickup instructions..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input label="Brand" placeholder="e.g. Caterpillar, Sony, JBL" value={brand} onChange={(e) => setBrand(e.target.value)} />
              <Input label="Model Name / Number" placeholder="e.g. 320 D3, FX6" value={modelName} onChange={(e) => setModelName(e.target.value)} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Input
                label="Daily Rental Rate (₹)"
                type="number"
                placeholder="4500"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
                required
              />
              <Input
                label="Refundable Deposit (₹)"
                type="number"
                placeholder="15000"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(e.target.value)}
              />
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="w-full p-2.5 text-xs border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="EXCELLENT">Excellent</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>
            </div>

            {/* Specifications Key-Value Builder */}
            <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-3">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-gray-900">Technical Specifications</h4>
                <button
                  type="button"
                  onClick={addSpecRow}
                  className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Row
                </button>
              </div>

              {specifications.map((row, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Engine)"
                    value={row.key}
                    onChange={(e) => updateSpecRow(idx, "key", e.target.value)}
                    className="w-1/2 p-2 text-xs border border-gray-300 rounded-xl"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 148 HP)"
                    value={row.value}
                    onChange={(e) => updateSpecRow(idx, "value", e.target.value)}
                    className="w-1/2 p-2 text-xs border border-gray-300 rounded-xl"
                  />
                  <button type="button" onClick={() => removeSpecRow(idx)} className="text-red-500 p-1">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Equipment Photos (Max 5)</label>
              <input
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => setImageFiles(Array.from(e.target.files))}
                className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
              />
            </div>

            <Button type="submit" variant="primary" loading={loading} className="w-full py-3 text-sm font-bold">
              Submit Equipment Listing
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEquipment;
