import React, { useState } from "react";

const AddressStep = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    homeAddress: "",
    officeAddress: "",
    alternateAddress: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        <textarea name="homeAddress" placeholder="Home Address" onChange={handleChange} className="border p-2 rounded" />
        <textarea name="officeAddress" placeholder="Office Address" onChange={handleChange} className="border p-2 rounded" />
        <textarea name="alternateAddress" placeholder="Alternate Address" onChange={handleChange} className="border p-2 rounded" />
      </div>

      <div className="flex justify-between mt-6">
        <button onClick={onBack} className="bg-gray-200 px-4 py-2 rounded">← Back</button>
        <button onClick={() => onNext(data)} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
          Next →
        </button>
      </div>
    </div>
  );
};

export default AddressStep;
