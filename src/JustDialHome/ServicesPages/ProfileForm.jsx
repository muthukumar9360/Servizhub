import React, { useState, useEffect } from "react";

const ProfileForm = () => {
    const api = import.meta.env.VITE_SERVER_URL;

    const [step, setStep] = useState(1);
    const [progress, setProgress] = useState(10);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState(null);

    const [personalDetails, setPersonalDetails] = useState({
        title: "Mr",
        firstName: "",
        middleName: "",
        lastName: "",
        dob: { day: "", month: "", year: "" },
        maritalStatus: "",
        city: "",
        area: "",
        pincode: "",
        occupation: "",
        profilePic: null,
        email: "",
        mobile1: "",
        mobile2: "",
        homeLandline1: "",
        homeLandline2: "",
        officeLandline1: "",
        officeLandline2: "",
    });

    const [addressDetails, setAddressDetails] = useState({
        name: "",
        landmark: "",
        contactNumber: "",
        pincode: "",
        landlineNumber: "",
        email: "",
        city: "",
        tag: "",
    });

    const [familyFriends, setFamilyFriends] = useState([
        {
            title: "",
            firstName: "",
            lastName: "",
            relationship: "",
            email: "",
            mobile: "",
            dob: { day: "", month: "", year: "" },
        },
    ]);

    const [favorites, setFavorites] = useState({
        selectedCategories: [],
    });

    const categories = [
        "Doctor", "Hospital", "Grocery Store", "Chemist",
        "Laundry Service", "Spa & Salon", "Car Service", "AC Service",
        "Water Purifier Service", "Plumber", "Restaurant", "Pizza",
        "Cinema Hall"
    ];

    const isLocked = (value) => value && value.trim() !== "";

    // Fetch session to get userId
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const res = await fetch(`${api}/session/me`, { credentials: "include" });
                const data = await res.json();
                if (data.user) {
                    setUserId(data.user._id);
                }
            } catch (err) {
                console.error("Error fetching session:", err);
            }
        };
        fetchSession();
    }, []);

    // Fetch user details
    useEffect(() => {
        if (!userId) return;
        const fetchUser = async () => {
            try {
                const res = await fetch(`${api}/userprofile/${userId}`);
                const data = await res.json();
                if (data) {
                    const date = new Date(data.dob);
                    setPersonalDetails({
                        title: data.gender === "male" ? "Mr" : "Ms",
                        firstName: data.firstname || "",
                        middleName: "",
                        lastName: data.lastname || "",
                        dob: {
                            day: date.getDate().toString().padStart(2, "0"),
                            month: (date.getMonth() + 1).toString().padStart(2, "0"),
                            year: date.getFullYear().toString(),
                        },
                        maritalStatus: "",
                        city: "",
                        area: "",
                        pincode: "",
                        occupation: "",
                        profilePic: null,
                        email: data.email || "",
                        mobile1: data.phno || "",
                        mobile2: "",
                        homeLandline1: "",
                        homeLandline2: "",
                        officeLandline1: "",
                        officeLandline2: "",
                    });
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [userId]);

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
            setProgress(progress + 20);
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1);
            setProgress(progress - 20);
        }
    };

    const handlePersonalChange = (e) => {
        const { name, value, files } = e.target;
        if (!isLocked(personalDetails[name])) {
            setPersonalDetails({
                ...personalDetails,
                [name]: files ? files[0] : value,
            });
        }
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        if (!isLocked(addressDetails[name])) {
            setAddressDetails({ ...addressDetails, [name]: value });
        }
    };

    const handleFamilyChange = (index, e) => {
        const { name, value } = e.target;
        const updated = [...familyFriends];
        if (["day", "month", "year"].includes(name)) {
            updated[index].dob[name] = value;
        } else {
            updated[index][name] = value;
        }
        setFamilyFriends(updated);
    };

    const addFamilyMember = () => {
        setFamilyFriends([
            ...familyFriends,
            {
                title: "",
                firstName: "",
                lastName: "",
                relationship: "",
                email: "",
                mobile: "",
                dob: { day: "", month: "", year: "" },
            },
        ]);
    };

    const handleFavoritesChange = (category) => {
        const selected = [...favorites.selectedCategories];
        if (selected.includes(category)) {
            setFavorites({ selectedCategories: selected.filter((c) => c !== category) });
        } else {
            selected.push(category);
            setFavorites({ selectedCategories: selected });
        }
    };

    const handleSaveProfile = async () => {
        const fullProfile = { personalDetails, addressDetails, familyFriends, favorites };
        try {
            const res = await fetch(`${api}/userprofile/update/${userId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(fullProfile),
            });
            const result = await res.json();
            alert("Profile saved successfully!");
            console.log(result);
        } catch (err) {
            console.error(err);
        }
    };

    const lockedStyle =
        "bg-gray-100 cursor-not-allowed hover:bg-white hover:shadow-md transition-all duration-200";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
                FILL PROFILE IN FEW STEPS
            </h2>
            <div className="w-full bg-gray-200 h-3 rounded-full mb-6">
                <div
                    className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* === Step 1: Personal Details === */}
            {step === 1 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
                    <p className="mb-2 text-gray-600">* Denotes mandatory fields</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        <select
                            name="title"
                            value={personalDetails.title}
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        >
                            <option>Mr</option>
                            <option>Mrs</option>
                            <option>Miss</option>
                            <option>Dr</option>
                        </select>

                        <input
                            type="text"
                            name="firstName"
                            value={personalDetails.firstName}
                            placeholder="First Name"
                            onChange={handlePersonalChange}
                            readOnly={isLocked(personalDetails.firstName)}
                            title={personalDetails.firstName}
                            className={`border p-2 rounded ${isLocked(personalDetails.firstName) ? lockedStyle : ""}`}
                        />

                        <input
                            type="text"
                            name="middleName"
                            value={personalDetails.middleName}
                            placeholder="Middle Name"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="lastName"
                            value={personalDetails.lastName}
                            placeholder="Last Name"
                            onChange={handlePersonalChange}
                            readOnly={isLocked(personalDetails.lastName)}
                            title={personalDetails.lastName}
                            className={`border p-2 rounded ${isLocked(personalDetails.lastName) ? lockedStyle : ""}`}
                        />

                        {/* DOB */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                name="day"
                                placeholder="DD"
                                value={personalDetails.dob.day}
                                onChange={(e) => handlePersonalChange({ target: { name: "dob", value: { ...personalDetails.dob, day: e.target.value } } })}
                                className="border p-2 rounded w-1/3"
                            />
                            <input
                                type="text"
                                name="month"
                                placeholder="MM"
                                value={personalDetails.dob.month}
                                onChange={(e) => handlePersonalChange({ target: { name: "dob", value: { ...personalDetails.dob, month: e.target.value } } })}
                                className="border p-2 rounded w-1/3"
                            />
                            <input
                                type="text"
                                name="year"
                                placeholder="YYYY"
                                value={personalDetails.dob.year}
                                onChange={(e) => handlePersonalChange({ target: { name: "dob", value: { ...personalDetails.dob, year: e.target.value } } })}
                                className="border p-2 rounded w-1/3"
                            />
                        </div>

                        {/* Marital Status */}
                        <select
                            name="maritalStatus"
                            value={personalDetails.maritalStatus}
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        >
                            <option value="">Select Marital Status</option>
                            <option>Single</option>
                            <option>Married</option>
                            <option>Divorced</option>
                        </select>

                        <input
                            type="text"
                            name="city"
                            value={personalDetails.city}
                            placeholder="City"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="area"
                            value={personalDetails.area}
                            placeholder="Area"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="pincode"
                            value={personalDetails.pincode}
                            placeholder="Pincode"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />
                        <input
                            type="text"
                            name="occupation"
                            value={personalDetails.occupation}
                            placeholder="Occupation"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        {/* Profile picture */}
                        <div className="col-span-2">
                            <label className="block font-medium mb-1">Profile Picture</label>
                            <input type="file" name="profilePic" onChange={handlePersonalChange} />
                        </div>

                        {/* Email & Phones */}
                        <input
                            type="email"
                            name="email"
                            value={personalDetails.email}
                            placeholder="Email ID"
                            onChange={handlePersonalChange}
                            readOnly={isLocked(personalDetails.email)}
                            title={personalDetails.email}
                            className={`border p-2 rounded ${isLocked(personalDetails.email) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="mobile1"
                            value={personalDetails.mobile1}
                            placeholder="Mobile Number 1"
                            onChange={handlePersonalChange}
                            readOnly={isLocked(personalDetails.mobile1)}
                            title={personalDetails.mobile1}
                            className={`border p-2 rounded ${isLocked(personalDetails.mobile1) ? lockedStyle : ""}`}
                        />

                        <input
                            type="text"
                            name="mobile2"
                            value={personalDetails.mobile2}
                            placeholder="Mobile Number 2"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="homeLandline1"
                            value={personalDetails.homeLandline1}
                            placeholder="Home Landline 1"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="homeLandline2"
                            value={personalDetails.homeLandline2}
                            placeholder="Home Landline 2"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="officeLandline1"
                            value={personalDetails.officeLandline1}
                            placeholder="Office Landline 1"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />

                        <input
                            type="text"
                            name="officeLandline2"
                            value={personalDetails.officeLandline2}
                            placeholder="Office Landline 2"
                            onChange={handlePersonalChange}
                            className="border p-2 rounded"
                        />
                    </div>
                </div>
            )}

            {/* Step 2: Home & Office Address */}
            {step === 2 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Addresses</h3>
                    <p className="text-gray-600 mb-4">Please provide home and office address</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            value={addressDetails.name}
                            onChange={(e) => handleAddressChange(e)}
                            placeholder="Name"
                            readOnly={isLocked(addressDetails.name)}
                            title={addressDetails.name}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.name) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="landmark"
                            value={addressDetails.landmark}
                            onChange={handleAddressChange}
                            placeholder="Enter Landmark"
                            readOnly={isLocked(addressDetails.landmark)}
                            title={addressDetails.landmark}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.landmark) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="contactNumber"
                            value={addressDetails.contactNumber}
                            onChange={handleAddressChange}
                            placeholder="Contact Number +91"
                            readOnly={isLocked(addressDetails.contactNumber)}
                            title={addressDetails.contactNumber}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.contactNumber) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="pincode"
                            value={addressDetails.pincode}
                            onChange={handleAddressChange}
                            placeholder="Pincode"
                            readOnly={isLocked(addressDetails.pincode)}
                            title={addressDetails.pincode}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.pincode) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="landlineNumber"
                            value={addressDetails.landlineNumber}
                            onChange={handleAddressChange}
                            placeholder="Landline Number"
                            readOnly={isLocked(addressDetails.landlineNumber)}
                            title={addressDetails.landlineNumber}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.landlineNumber) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="email"
                            value={addressDetails.email}
                            onChange={handleAddressChange}
                            placeholder="Email ID"
                            readOnly={isLocked(addressDetails.email)}
                            title={addressDetails.email}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.email) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="city"
                            value={addressDetails.city}
                            onChange={handleAddressChange}
                            placeholder="City"
                            readOnly={isLocked(addressDetails.city)}
                            title={addressDetails.city}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.city) ? lockedStyle : ""}`}
                        />
                        <input
                            type="text"
                            name="tag"
                            value={addressDetails.tag}
                            onChange={handleAddressChange}
                            placeholder="Tag"
                            readOnly={isLocked(addressDetails.tag)}
                            title={addressDetails.tag}
                            className={`border p-2 rounded w-full ${isLocked(addressDetails.tag) ? lockedStyle : ""}`}
                        />
                    </div>
                    <button
                        onClick={handleNext}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Save & Continue
                    </button>
                </div>
            )}

            {/* Step 3: Family & Friends */}
            {step === 3 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Family & Friends</h3>
                    <p className="text-gray-600 mb-4">Add your friends and family members</p>
                    {familyFriends.map((member, index) => (
                        <div key={index} className="border p-4 rounded mb-4 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <select
                                    name="title"
                                    value={member.title}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    className="border px-2 py-1 rounded w-full"
                                >
                                    <option value="">Select Title</option>
                                    <option>Mr</option>
                                    <option>Mrs</option>
                                    <option>Miss</option>
                                </select>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={member.firstName}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    placeholder="First Name"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={member.lastName}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    placeholder="Last Name"
                                    className="border p-2 rounded w-full"
                                />
                                <select
                                    name="relationship"
                                    value={member.relationship}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    className="border px-2 py-1 rounded w-full"
                                >
                                    <option value="">Select Relationship</option>
                                    <option>Father</option>
                                    <option>Mother</option>
                                    <option>Brother</option>
                                    <option>Sister</option>
                                    <option>Friend</option>
                                </select>
                                <input
                                    type="email"
                                    name="email"
                                    value={member.email}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    placeholder="Email ID"
                                    className="border p-2 rounded w-full"
                                />
                                <input
                                    type="text"
                                    name="mobile"
                                    value={member.mobile}
                                    onChange={(e) => handleFamilyChange(index, e)}
                                    placeholder="Mobile +91"
                                    className="border p-2 rounded w-full"
                                />
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        name="day"
                                        value={member.dob.day}
                                        onChange={(e) => handleFamilyChange(index, e)}
                                        placeholder="DD"
                                        className="border p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="text"
                                        name="month"
                                        value={member.dob.month}
                                        onChange={(e) => handleFamilyChange(index, e)}
                                        placeholder="MM"
                                        className="border p-2 rounded w-1/3"
                                    />
                                    <input
                                        type="text"
                                        name="year"
                                        value={member.dob.year}
                                        onChange={(e) => handleFamilyChange(index, e)}
                                        placeholder="YYYY"
                                        className="border p-2 rounded w-1/3"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                    <button
                        onClick={addFamilyMember}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                    >
                        + Add Member
                    </button>
                    <button
                        onClick={handleNext}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Save & Continue
                    </button>
                </div>
            )}

            {/* Step 4: Favorites / Services */}
            {step === 4 && (
                <div>
                    <h3 className="text-lg font-semibold mb-2">Favorites / Services</h3>
                    <p className="mb-4 text-gray-600">
                        Please select a category to enter details
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => handleFavoritesChange(cat)}
                                className={`p-3 rounded-lg border transition-all duration-300 text-center ${favorites.selectedCategories.includes(cat)
                                        ? "bg-indigo-600 text-white scale-105"
                                        : "bg-white text-gray-700 hover:bg-indigo-50"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={handleNext}
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Save & Continue
                    </button>
                </div>
            )}


            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
                {step > 1 && (
                    <button
                        onClick={handlePrev}
                        className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                        Previous
                    </button>
                )}
                {step < 5 && (
                    <button
                        onClick={handleNext}
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Next
                    </button>
                )}
                {step === 5 && (
                    <button
                        onClick={handleSaveProfile}
                        className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Save Profile
                    </button>
                )}
            </div>
        </div>
    );
};

export default ProfileForm;
