import React, { useState } from "react";

const PersonalStep = ({ onNext }) => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    occupation: "",
    city: "",
    area: "",
    pincode: "",
  });

  const handleChange = (e) =>
    setData({ ...data, [e.target.name]: e.target.value });

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        <input name="firstname" placeholder="First Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="lastname" placeholder="Last Name" onChange={handleChange} className="border p-2 rounded" />
        <input name="dob" type="date" onChange={handleChange} className="border p-2 rounded" />
        <select name="gender" onChange={handleChange} className="border p-2 rounded">
          <option value="">Select Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <select name="maritalStatus" onChange={handleChange} className="border p-2 rounded">
          <option value="">Marital Status</option>
          <option>Single</option>
          <option>Married</option>
          <option>Widowed</option>
          <option>Divorced</option>
        </select>
        <input name="occupation" placeholder="Occupation" onChange={handleChange} className="border p-2 rounded" />
        <input name="city" placeholder="City" onChange={handleChange} className="border p-2 rounded" />
        <input name="area" placeholder="Area" onChange={handleChange} className="border p-2 rounded" />
        <input name="pincode" placeholder="Pincode" onChange={handleChange} className="border p-2 rounded" />
      </div>
      <button
        onClick={() => onNext(data)}
        className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Next →
      </button>
    </div>
  );
};

export default PersonalStep;
