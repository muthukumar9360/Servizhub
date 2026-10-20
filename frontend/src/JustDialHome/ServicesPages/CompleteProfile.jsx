import React, { useState } from "react";
import PersonalStep from "../../Components/ProfileSteps/PersonalStep";
import AddressStep from "../../Components/ProfileSteps/AddressStep";
import FamilyStep from "../../Components/ProfileSteps/FamilyStep";
import FavoriteStep from "../../Components/ProfileSteps/FavouriteStep";

const CompleteProfile = () => {
  const api = import.meta.env.VITE_SERVER_URL;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});

  const handleNext = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const res = await fetch(`${api}/users/update/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, profileCompleted: true }),
      });

      if (res.ok) {
        alert("🎉 Profile completed successfully!");
        window.location.href = `/userprofile/${userId}`;
      }
    } catch (err) {
      console.error("Error saving profile:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg p-6 rounded-xl mt-10">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-700">
          {step === 1
            ? "Personal Details"
            : step === 2
            ? "Address Details"
            : step === 3
            ? "Family & Friends"
            : "Favorites"}
        </h2>
        <p className="text-gray-500">
          Step {step} / 4
        </p>
      </div>

      {step === 1 && <PersonalStep onNext={handleNext} />}
      {step === 2 && <AddressStep onNext={handleNext} onBack={handleBack} />}
      {step === 3 && <FamilyStep onNext={handleNext} onBack={handleBack} />}
      {step === 4 && <FavoriteStep onSubmit={handleSubmit} onBack={handleBack} />}
    </div>
  );
};

export default CompleteProfile;
