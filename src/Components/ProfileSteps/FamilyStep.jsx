import React, { useState } from "react";

const FamilyStep = ({ onNext, onBack }) => {
  const [data, setData] = useState({
    fatherName: "",
    motherName: "",
    spouseName: "",
    childrenNames: "",
    friends: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <input name="fatherName" placeholder="Father's Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="motherName" placeholder="Mother's Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="spouseName" placeholder="Spouse Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="childrenNames" placeholder="Children (comma separated)" onChange={handleChange} className="border p-2 rounded" />
        <input name="friends" placeholder="Friends (comma separated)" onChange={handleChange} className="border p-2 rounded" />
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

export default FamilyStep;
