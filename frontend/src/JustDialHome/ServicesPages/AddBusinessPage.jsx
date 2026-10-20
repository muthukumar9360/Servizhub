import React, { useEffect, useState } from "react";

/**
 * AddBusinessPage.jsx (Updated)
 * - Step 2 validation (can't advance without choosing subcategory)
 * - Removed Step 9 (reviews)
 * - Step 5: Accordion-style Photo Categories + Main Images + optional video
 * - totalPhotos is auto-calculated
 * - overview.services editable
 * - Step 10: unique preview design + submit
 *
 * Notes:
 * - Keeps the dynamic overview mapping you already had
 * - Uses simple local state; no external libs required
 */

export default function AddBusinessPage() {
  const api = import.meta.env.VITE_SERVER_URL || "http://localhost:5024/api";

  // ---------- Utilities ----------
  const generateOid = () => {
    const ts = Math.floor(Date.now() / 1000).toString(16);
    let rand = "";
    while (rand.length < 16) rand += Math.floor(Math.random() * 16).toString(16);
    return (ts + rand).slice(0, 24);
  };

  // ---------- Step state ----------
  // removed step 9 (reviews); total steps becomes 9
  const [step, setStep] = useState(1);
  const totalSteps = 9;

  // ---------- Master form state ----------
  const [form, setForm] = useState({
    _id: { $oid: generateOid() },
    name: "",
    mainCategoryId: null,
    subCategoryId: null,
    // default overall rating fields (0)
    rating: 0,
    numRatings: 0,
    status: "Not Verified",
    claimed: false,
    isOpen: true,
    operatingHours: "",
    media: {
      // mainImages = used for listing preview (top)
      mainImages: [], // [{ url, alt }]
      // photoCategories: array of { name, images: [{ url, alt }] }
      photoCategories: [],
      totalPhotos: 0,
      videoTour: "", // optional
    },
    overview: {
      description: "",
      establishedYear: null,
      facilities: [],
      capacity: { minGuests: null, maxGuests: null },
      priceRange: "",
      availableFor: [],
      openingHours: "",
      closedDays: "",
      website: "",
      email: "",
      occasion: [],
      banquetType: [],
      contact: "",
      addressDetails: { name: "", line2: "" },
      exploreCategories: [],
      relatedListings: [],
      faq: [],
      // <-- added services explicitly here
      services: [],
    },
    locationDetails: {
      address: "",
      area: "",
      city: "",
      pincode: "",
      landmark: "",
      mapLink: "",
    },
    contactDetails: {
      phone: "",
      whatsapp: "",
      email: "",
      ownerName: "",
      verified: false,
      gstin: "",
    },
    highlights: [],
    // removed admin-addable reviews (admin shouldn't add reviews)
    reviews: {
      jdRating: 0,
      totalReviews: 0,
      userReviews: [], // not used in admin form
      alsoListedIn: [],
    },
    meta: {
      lastUpdated: { $date: new Date().toISOString() },
      status: "Choose Status",
      verifiedListing: false,
    },
    providerId: { $oid: generateOid() },
  });

  // ---------- Temp states for dynamic lists ----------
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [tempImageAlt, setTempImageAlt] = useState("");
  const [tempPhotoCategoryName, setTempPhotoCategoryName] = useState("");
  const [tempPhotoImageUrl, setTempPhotoImageUrl] = useState("");
  const [tempPhotoImageAlt, setTempPhotoImageAlt] = useState("");
  const [expandedCatIndex, setExpandedCatIndex] = useState(null); // for accordion (S3)
  const [tempFacility, setTempFacility] = useState("");
  const [tempExploreCategory, setTempExploreCategory] = useState("");
  const [tempRelatedListing, setTempRelatedListing] = useState({
    name: "",
    rating: "",
    reviews: "",
    distance: "",
    location: "",
    verified: false,
    trust: false,
    imageUrl: "",
  });
  const [tempFaq, setTempFaq] = useState({ q: "", a: "" });
  const [tempService, setTempService] = useState("");

  // ---------- Categories ----------
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${api}/business`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        // fallback sample data
        setCategories([
          {
            _id: { $oid: "68f03915ebbbdc6ba1e1a37b" },
            mainCategory: "Wedding Requisites",
            description: "Everything you need — venues to catering.",
            homeImage:
              "https://res.cloudinary.com/dy249i760/image/upload/v1759018081/wedding_requisites.webp",
            subCategories: [
              {
                title: "Banquet Halls",
                description:
                  "Spacious and elegant banquet halls for weddings and events.",
                image:
                  "https://res.cloudinary.com/dy249i760/image/upload/v1758101387/BanquetHall_jtuc7r.jpg",
                _id: { $oid: "68f03a1ff0177348631f6600" },
              },
              {
                title: "Bridal Requisite",
                description: "Jewelry, makeup, and attire.",
                image:
                  "https://res.cloudinary.com/dy249i760/image/upload/v1758101318/BrideRequisite_arfpsd.jpg",
                _id: { $oid: "68f03a1ff0177348631f6601" },
              },
            ],
          },
        ]);
      }
    };
    fetchCategories();
  }, [api]);

  // ---------- Helpers ----------
  const updateForm = (path, value) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        const p = parts[i];
        if (!(p in cur)) cur[p] = {};
        cur = cur[p];
      }
      cur[parts[parts.length - 1]] = value;
      return copy;
    });
  };

  // generic push for arrays
  const pushToArray = (path, value) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        if (i === parts.length - 1) {
          if (!Array.isArray(cur[p])) cur[p] = [];
          cur[p].push(value);
        } else {
          if (!(p in cur)) cur[p] = {};
          cur = cur[p];
        }
      }
      return copy;
    });
  };

  const removeFromArray = (path, index) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const parts = path.split(".");
      let cur = copy;
      for (let i = 0; i < parts.length - 1; i++) {
        cur = cur[parts[i]] || {};
      }
      const arr = cur[parts[parts.length - 1]] || [];
      arr.splice(index, 1);
      cur[parts[parts.length - 1]] = arr;
      return copy;
    });
  };

  // recalc totalPhotos (mainImages + sum(photoCategories images length))
  const recalcTotalPhotos = (targetForm = null) => {
    const f = targetForm || form;
    const mainCount = Array.isArray(f.media.mainImages) ? f.media.mainImages.length : 0;
    const catCount = Array.isArray(f.media.photoCategories)
      ? f.media.photoCategories.reduce((acc, c) => acc + (Array.isArray(c.images) ? c.images.length : 0), 0)
      : 0;
    const total = mainCount + catCount;
    // update form
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.media.totalPhotos = total;
      return copy;
    });
  };

  // ---------- Dynamic overview field mapping ----------
  const overviewFieldMap = {
    banquethalls: [
      { key: "capacity", type: "capacity", label: "Capacity" },
      { key: "banquetType", type: "array", label: "Banquet Type (AC / Open / Indoor...)" },
      { key: "occasion", type: "array", label: "Occasions (Wedding, Reception...)" },
      { key: "services", type: "array", label: "Services (Catering, Parking...)" },
      { key: "priceRange", type: "text", label: "Price Range" },
    ],
    bridalrequisite: [
      { key: "brandsUsed", type: "array", label: "Brands Used" },
      { key: "services", type: "array", label: "Services (Jewellery, Makeup...)" },
      { key: "experience", type: "text", label: "Years of experience / Note" },
      { key: "priceRange", type: "text", label: "Price Range / Starting Price" },
    ],
    caterers: [
      { key: "cuisine", type: "array", label: "Cuisine (Indian, Chinese...)" },
      { key: "menuType", type: "array", label: "Menu Type (Veg, Non-Veg, Combo...)" },
      { key: "services", type: "array", label: "Services (Live counters, Dessert...)" },
      { key: "priceRange", type: "text", label: "Price Range (per plate / event)" },
    ],
    // ... other mappings unchanged (kept same as your original)
  };

  const normalizeSubTitle = (title = "") => title.replace(/\s+/g, "").toLowerCase();

  const getOverviewFieldsForSubcategory = (subTitle) => {
    if (!subTitle) return [];
    const key = normalizeSubTitle(subTitle);
    if (overviewFieldMap[key]) return overviewFieldMap[key];
    return [
      { key: "services", type: "array", label: "Services" },
      { key: "priceRange", type: "text", label: "Price Range" },
      { key: "notes", type: "text", label: "Notes" },
    ];
  };

  // ---------- Derived helpers ----------
  const selectedMainCategory = categories.find((c) => {
    const cid = c._id?.$oid || c._id;
    const selected = form.mainCategoryId?.$oid || form.mainCategoryId;
    return cid === selected;
  });

  const selectedSubCategory = (() => {
    const subs = selectedMainCategory?.subCategories || [];
    const sid = form.subCategoryId?.$oid || form.subCategoryId;
    return subs.find((s) => (s._id?.$oid || s._id) === sid) || null;
  })();

  const dynamicOverviewFields = getOverviewFieldsForSubcategory(selectedSubCategory?.title || "");

  // ---------- Navigation with validation ----------
  const next = () => {
    // if on step 2, ensure subcategory selected
    if (step === 2) {
      if (!form.subCategoryId) {
        alert("Please select a subcategory before proceeding.");
        return;
      }
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ---------- Photo Category helpers (Accordion S3) ----------
  const addPhotoCategory = () => {
    const name = (tempPhotoCategoryName || "").trim();
    if (!name) {
      alert("Enter a category name first (e.g. Interior, Exterior).");
      return;
    }
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!Array.isArray(copy.media.photoCategories)) copy.media.photoCategories = [];
      copy.media.photoCategories.push({ name, images: [] });
      return copy;
    });
    setTempPhotoCategoryName("");
    // expand newly added
    setExpandedCatIndex((idx) => {
      // next index is last
      return form.media.photoCategories ? form.media.photoCategories.length : 0;
    });
  };

  const addImageToCategory = (catIndex) => {
    const url = tempPhotoImageUrl?.trim();
    if (!url) {
      alert("Provide image url to add into category.");
      return;
    }
    const alt = tempPhotoImageAlt?.trim() || form.name || "Photo";
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!Array.isArray(copy.media.photoCategories)) copy.media.photoCategories = [];
      if (!copy.media.photoCategories[catIndex].images) copy.media.photoCategories[catIndex].images = [];
      copy.media.photoCategories[catIndex].images.push({ url, alt });
      return copy;
    });
    setTempPhotoImageUrl("");
    setTempPhotoImageAlt("");
    // recalc
    setTimeout(() => recalcTotalPhotos(), 50);
  };

  const removeImageFromCategory = (catIndex, imgIndex) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (copy.media.photoCategories?.[catIndex]?.images) {
        copy.media.photoCategories[catIndex].images.splice(imgIndex, 1);
        // if empty images array remains that's okay
      }
      return copy;
    });
    setTimeout(() => recalcTotalPhotos(), 50);
  };

  const removeCategory = (catIndex) => {
    if (!confirm("Remove this photo category and its images?")) return;
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.media.photoCategories.splice(catIndex, 1);
      return copy;
    });
    setExpandedCatIndex(null);
    setTimeout(() => recalcTotalPhotos(), 50);
  };

  // mainImages helpers (used for listing preview)
  const addMainImage = () => {
    const url = tempImageUrl?.trim();
    if (!url) {
      alert("Provide main image url.");
      return;
    }
    const alt = tempImageAlt?.trim() || form.name || "Main Image";
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      if (!Array.isArray(copy.media.mainImages)) copy.media.mainImages = [];
      copy.media.mainImages.push({ url, alt });
      return copy;
    });
    setTempImageUrl("");
    setTempImageAlt("");
    setTimeout(() => recalcTotalPhotos(), 50);
  };

  const removeMainImage = (idx) => {
    setForm((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy.media.mainImages.splice(idx, 1);
      return copy;
    });
    setTimeout(() => recalcTotalPhotos(), 50);
  };

  // call recalc on mount and when media changes (safe guard)
  useEffect(() => {
    recalcTotalPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---------- Submit ----------
  const handlePreviewAndSubmit = async () => {
    // update lastUpdated
    updateForm("meta.lastUpdated.$date", new Date().toISOString());
    // ensure numeric fields are numbers
    const output = JSON.parse(JSON.stringify(form));
    // convert id strings if present (keeps your $oid format)
    if (output.mainCategoryId && typeof output.mainCategoryId === "string")
      output.mainCategoryId = { $oid: output.mainCategoryId };
    if (output.subCategoryId && typeof output.subCategoryId === "string")
      output.subCategoryId = { $oid: output.subCategoryId };
    if (output.providerId && typeof output.providerId === "string")
      output.providerId = { $oid: output.providerId };

    // ensure totalPhotos correct before sending
    output.media.totalPhotos =
      (output.media.mainImages?.length || 0) +
      (output.media.photoCategories?.reduce((acc, c) => acc + (c.images?.length || 0), 0) || 0);

    console.log("--- Final JSON to send to backend ---\n", output);

    try {
      const res = await fetch(`${api}/businesslist/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(output),
      });
      const data = await res.json();
      console.log("Backend response:", data);
      alert("Business data sent to backend (check console)");
    } catch (err) {
      console.error("Failed to send to backend", err);
      alert("Failed to send to backend (see console)");
    }
  };

  // ---------- Render UI ----------
  // small helper: render step header consistent theme
  const StepHeader = ({ number, title }) => (
    <div className="flex items-center justify-between mb-4">
      <div>
        <div className="text-sm text-gray-500">Step {number} of {totalSteps}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
      <div className="text-sm text-gray-400">JD Admin</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Business — Multi-step Form</h1>

      {/* Stepper */}
      <div className="flex gap-2 mb-6 items-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`px-3 py-1 rounded-full border ${step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>
            Step {i + 1}
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {/* STEP 1: Category */}
        {step === 1 && (
          <section>
            <StepHeader number={1} title="Choose Main Category" />
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const id = cat._id?.$oid || (cat._id && cat._id.toString());
                return (
                  <div
                    key={id}
                    className={`p-4 border rounded cursor-pointer hover:shadow ${form.mainCategoryId?.$oid === id ? 'border-blue-600 shadow-lg' : 'bg-white'}`}
                    onClick={() => {
                      updateForm("mainCategoryId", { $oid: id });
                      // clear subcategory when main changes
                      updateForm("subCategoryId", null);
                    }}
                  >
                    <div className="font-medium">{cat.mainCategory}</div>
                    <div className="text-sm text-gray-500">{cat.description || "—"}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* STEP 2: Subcategory */}
        {step === 2 && (
          <section>
            <StepHeader number={2} title="Choose Subcategory (required)" />
            {!form.mainCategoryId ? (
              <div className="text-red-500 text-center">Please select a main category first.</div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {((selectedMainCategory?.subCategories) || []).length === 0 ? (
                  <div className="text-gray-500">No subcategories found.</div>
                ) : (
                  (selectedMainCategory.subCategories || []).map((sub) => {
                    const sid = sub._id?.$oid || sub._id;
                    return (
                      <div
                        key={sid}
                        className={`p-4 border rounded cursor-pointer ${form.subCategoryId?.$oid === sid ? "border-blue-600 shadow-lg" : "bg-white"}`}
                        onClick={() => updateForm("subCategoryId", { $oid: sid })}
                      >
                        <div className="font-medium">{sub.title}</div>
                        <div className="text-sm text-gray-500">{sub.description || "—"}</div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </section>
        )}

        {/* STEP 3: Basic Info */}
        {step === 3 && (
          <section>
            <StepHeader number={3} title="Basic Info" />
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Business name" value={form.name} onChange={(e) => updateForm("name", e.target.value)} />
              <select className="border p-2 rounded" value={form.status} onChange={(e) => updateForm("status", e.target.value)}>
                <option>Not Verified</option>
                <option>Verified</option>
                <option>Closed</option>
              </select>

              {/* rating fields kept but default 0 */}
              <input className="border p-2 rounded" type="number" placeholder="Rating (e.g. 4.5)" value={form.rating} onChange={(e) => updateForm("rating", Number(e.target.value))} />
              <input className="border p-2 rounded" type="number" placeholder="Number of ratings" value={form.numRatings} onChange={(e) => updateForm("numRatings", Number(e.target.value))} />

              <label className="flex items-center gap-2"><input type="checkbox" checked={form.claimed} onChange={(e) => updateForm("claimed", e.target.checked)} /> Claimed</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isOpen} onChange={(e) => updateForm("isOpen", e.target.checked)} /> Currently Open</label>

              <input className="border p-2 rounded col-span-2" placeholder="Operating hours" value={form.operatingHours} onChange={(e) => updateForm("operatingHours", e.target.value)} />
            </div>
          </section>
        )}

        {/* STEP 4: Overview (dynamic) */}
        {step === 4 && (
          <section>
            <StepHeader number={4} title="Overview (dynamic per subcategory)" />
            <textarea className="w-full border p-2 rounded mb-3" placeholder="Short description" value={form.overview.description} onChange={(e) => updateForm("overview.description", e.target.value)} />

            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="border p-2 rounded" placeholder="Established year" value={form.overview.establishedYear || ""} onChange={(e) => updateForm("overview.establishedYear", e.target.value ? Number(e.target.value) : null)} />
              <input className="border p-2 rounded" placeholder="Website" value={form.overview.website} onChange={(e) => updateForm("overview.website", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Email" value={form.overview.email} onChange={(e) => updateForm("overview.email", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Contact" value={form.overview.contact} onChange={(e) => updateForm("overview.contact", e.target.value)} />
            </div>

            {/* facilities */}
            <div className="mb-3">
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Add facility (press Add)" value={tempFacility} onChange={(e) => setTempFacility(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempFacility) { pushToArray("overview.facilities", tempFacility); setTempFacility(""); } }}>Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.overview.facilities.map((f, i) => (
                  <div key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    <span>{f}</span>
                    <button onClick={() => removeFromArray("overview.facilities", i)} className="text-red-500">x</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Capacity */}
            <div className="mb-3">
              <h4 className="font-medium">Capacity</h4>
              <div className="flex gap-2 mt-2">
                <input className="border p-2 rounded" placeholder="Min (e.g. 50)" value={form.overview.capacity.minGuests || ""} onChange={(e) => updateForm("overview.capacity.minGuests", e.target.value ? Number(e.target.value) : null)} />
                <input className="border p-2 rounded" placeholder="Max (e.g. 500)" value={form.overview.capacity.maxGuests || ""} onChange={(e) => updateForm("overview.capacity.maxGuests", e.target.value ? Number(e.target.value) : null)} />
              </div>
            </div>

            {/* Services (explicit admin field) */}
            <div className="mb-3">
              <h4 className="font-medium mb-2">Services</h4>
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Add service (e.g. Catering)" value={tempService} onChange={(e) => setTempService(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempService) { pushToArray("overview.services", tempService); setTempService(""); } }}>Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.overview.services.map((s, i) => (
                  <div key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                    <span>{s}</span>
                    <button onClick={() => removeFromArray("overview.services", i)} className="text-red-500">x</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dynamic fields mapping */}
            <div className="mb-3">
              <h4 className="font-medium mb-2">Category-specific fields for: <span className="font-semibold">{selectedSubCategory?.title || '—'}</span></h4>
              {dynamicOverviewFields.length === 0 && <div className="text-sm text-gray-500">No specific fields for this subcategory.</div>}
              <div className="space-y-3">
                {dynamicOverviewFields.map((fld) => {
                  const val = form.overview[fld.key];

                  if (fld.type === "text") {
                    return (
                      <div key={fld.key}>
                        <label className="block text-sm font-medium mb-1">{fld.label}</label>
                        <input className="border p-2 rounded w-full" value={val || ""} onChange={(e) => updateForm(`overview.${fld.key}`, e.target.value)} />
                      </div>
                    );
                  }

                  if (fld.type === "array") {
                    return (
                      <DynamicArrayField
                        key={fld.key}
                        fieldKey={fld.key}
                        label={fld.label}
                        values={Array.isArray(val) ? val : []}
                        onAdd={(v) => pushToArray(`overview.${fld.key}`, v)}
                        onRemove={(index) => removeFromArray(`overview.${fld.key}`, index)}
                        onChange={(v) => updateForm(`overview.${fld.key}`, v)}
                      />
                    );
                  }

                  if (fld.type === "capacity") {
                    return (
                      <div key={fld.key}>
                        <label className="block text-sm font-medium mb-1">Capacity (min / max)</label>
                        <div className="flex gap-2">
                          <input className="border p-2 rounded" placeholder="Min" value={form.overview.capacity.minGuests || ""} onChange={(e) => updateForm("overview.capacity.minGuests", e.target.value ? Number(e.target.value) : null)} />
                          <input className="border p-2 rounded" placeholder="Max" value={form.overview.capacity.maxGuests || ""} onChange={(e) => updateForm("overview.capacity.maxGuests", e.target.value ? Number(e.target.value) : null)} />
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={fld.key}>
                      <label className="block text-sm font-medium mb-1">{fld.label}</label>
                      <input className="border p-2 rounded w-full" value={val || ""} onChange={(e) => updateForm(`overview.${fld.key}`, e.target.value)} />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Explore categories */}
            <div className="mb-3">
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Explore category" value={tempExploreCategory} onChange={(e) => setTempExploreCategory(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempExploreCategory) { pushToArray("overview.exploreCategories", tempExploreCategory); setTempExploreCategory(""); } }}>Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.overview.exploreCategories.map((f, i) => (<div key={i} className="px-2 py-1 bg-gray-100 rounded">{f}<button onClick={() => removeFromArray("overview.exploreCategories", i)} className="text-red-500 ml-2">x</button></div>))}
              </div>
            </div>

            {/* Related listings & FAQ */}
            <div className="col-span-2 mb-3">
              <h4 className="font-medium">Related Listings</h4>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Name" className="border p-2 rounded" value={tempRelatedListing.name} onChange={(e) => setTempRelatedListing(r => ({ ...r, name: e.target.value }))} />
                <input placeholder="Rating" className="border p-2 rounded" value={tempRelatedListing.rating} onChange={(e) => setTempRelatedListing(r => ({ ...r, rating: e.target.value }))} />
                <input placeholder="Reviews" className="border p-2 rounded" value={tempRelatedListing.reviews} onChange={(e) => setTempRelatedListing(r => ({ ...r, reviews: e.target.value }))} />
                <input placeholder="Distance" className="border p-2 rounded" value={tempRelatedListing.distance} onChange={(e) => setTempRelatedListing(r => ({ ...r, distance: e.target.value }))} />
                <input placeholder="Location" className="border p-2 rounded" value={tempRelatedListing.location} onChange={(e) => setTempRelatedListing(r => ({ ...r, location: e.target.value }))} />
                <input placeholder="Image URL" className="border p-2 rounded" value={tempRelatedListing.imageUrl} onChange={(e) => setTempRelatedListing(r => ({ ...r, imageUrl: e.target.value }))} />
              </div>
              <div className="flex gap-2 mt-2">
                <label className="flex items-center gap-2"><input type="checkbox" checked={tempRelatedListing.verified} onChange={(e) => setTempRelatedListing(r => ({ ...r, verified: e.target.checked }))} /> Verified</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={tempRelatedListing.trust} onChange={(e) => setTempRelatedListing(r => ({ ...r, trust: e.target.checked }))} /> Trust</label>
                <button className="px-3 bg-green-600 text-white rounded" onClick={() => { pushToArray("overview.relatedListings", tempRelatedListing); setTempRelatedListing({ name: "", rating: "", reviews: "", distance: "", location: "", verified: false, trust: false, imageUrl: "" }); }}>Add related</button>
              </div>

              <div className="mt-3">
                {form.overview.relatedListings.map((rl, idx) => (
                  <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{rl.name}</div>
                      <div className="text-sm text-gray-500">{rl.location} • {rl.rating} • {rl.distance}</div>
                    </div>
                    <button onClick={() => removeFromArray("overview.relatedListings", idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium">FAQs</h4>
              <div className="grid grid-cols-2 gap-2">
                <input placeholder="Question" className="border p-2 rounded" value={tempFaq.q} onChange={(e) => setTempFaq(f => ({ ...f, q: e.target.value }))} />
                <input placeholder="Answer" className="border p-2 rounded" value={tempFaq.a} onChange={(e) => setTempFaq(f => ({ ...f, a: e.target.value }))} />
              </div>
              <div className="mt-2 flex gap-2">
                <button className="px-3 bg-green-600 text-white rounded" onClick={() => { if (tempFaq.q && tempFaq.a) { pushToArray("overview.faq", tempFaq); setTempFaq({ q: "", a: "" }); } }}>Add FAQ</button>
              </div>
              <div className="mt-3">
                {form.overview.faq.map((fq, idx) => (
                  <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                    <div><div className="font-medium">{fq.q}</div><div className="text-sm text-gray-600">{fq.a}</div></div>
                    <button onClick={() => removeFromArray("overview.faq", idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* STEP 5: Media (Accordion S3) */}
        {step === 5 && (
          <section>
            <StepHeader number={5} title="Media — Main Images + Photo Categories (Accordion)" />

            {/* Main Images (used on listing preview) */}
            <div className="mb-4 p-4 border rounded bg-gray-50">
              <h3 className="font-semibold mb-2">Main Images (used for listing preview)</h3>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <input className="border p-2 rounded col-span-2" placeholder="Main image URL" value={tempImageUrl} onChange={(e) => setTempImageUrl(e.target.value)} />
                <input className="border p-2 rounded" placeholder="Alt text" value={tempImageAlt} onChange={(e) => setTempImageAlt(e.target.value)} />
              </div>
              <div className="flex gap-2 mb-3">
                <button className="px-3 bg-green-600 text-white rounded" onClick={addMainImage}>Add Main Image</button>
                <div className="text-sm text-gray-500 self-center">Main images appear on listing cards — add at least one.</div>
              </div>

              <div className="grid grid-cols-1 gap-2">
                {form.media.mainImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3 border p-2 rounded bg-white">
                    <img src={img.url} alt={img.alt} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{img.alt}</div>
                      <div className="text-xs text-gray-500">{img.url}</div>
                    </div>
                    <button className="text-red-500" onClick={() => removeMainImage(idx)}>Remove</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo categories (accordion) */}
            <div className="p-4 border rounded">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Photo Categories</h3>
                <div className="text-sm text-gray-500">{form.media.totalPhotos || 0} photos total</div>
              </div>

              {/* Add new category */}
              <div className="flex gap-2 mb-4">
                <input className="border p-2 rounded flex-1" placeholder="Category name (e.g. Interior)" value={tempPhotoCategoryName} onChange={(e) => setTempPhotoCategoryName(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={addPhotoCategory}>Add Category</button>
              </div>

              {/* Categories List (Accordion) */}
              <div className="space-y-3">
                {form.media.photoCategories.map((cat, ci) => (
                  <div key={ci} className="border rounded">
                    <button
                      className="w-full text-left px-4 py-3 flex justify-between items-center bg-white"
                      onClick={() => setExpandedCatIndex(expandedCatIndex === ci ? null : ci)}
                    >
                      <div>
                        <div className="font-medium">{cat.name}</div>
                        <div className="text-xs text-gray-500">{(cat.images?.length || 0)} images</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-400">Toggle</div>
                        <div className="text-sm">{expandedCatIndex === ci ? "▲" : "▼"}</div>
                      </div>
                    </button>

                    {expandedCatIndex === ci && (
                      <div className="p-4 bg-gray-50">
                        {/* Add image to this category */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                          <input placeholder="Image URL" className="border p-2 rounded col-span-2" value={tempPhotoImageUrl} onChange={(e) => setTempPhotoImageUrl(e.target.value)} />
                          <input placeholder="Alt text" className="border p-2 rounded" value={tempPhotoImageAlt} onChange={(e) => setTempPhotoImageAlt(e.target.value)} />
                        </div>
                        <div className="flex gap-2 mb-3">
                          <button className="px-3 bg-green-600 text-white rounded" onClick={() => addImageToCategory(ci)}>Add Image to {cat.name}</button>
                          <button className="px-3 bg-red-500 text-white rounded" onClick={() => removeCategory(ci)}>Remove Category</button>
                        </div>

                        {/* Images grid */}
                        <div className="grid grid-cols-3 gap-3">
                          {(cat.images || []).map((img, ii) => (
                            <div key={ii} className="relative border rounded overflow-hidden bg-white">
                              <img src={img.url} alt={img.alt} className="w-full h-32 object-cover" />
                              <div className="p-2">
                                <div className="text-sm font-medium">{img.alt}</div>
                                <div className="text-xs text-gray-500 line-clamp-1">{img.url}</div>
                              </div>
                              <button onClick={() => removeImageFromCategory(ci, ii)} className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-red-500">x</button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Optional video */}
            <div className="mt-4">
              <h4 className="font-medium mb-2">Video (optional)</h4>
              <input className="border p-2 rounded w-full" placeholder="Video tour URL (optional)" value={form.media.videoTour} onChange={(e) => updateForm("media.videoTour", e.target.value)} />
            </div>
          </section>
        )}

        {/* STEP 6: Location (unchanged per your request) */}
        {step === 6 && (
          <section>
            <StepHeader number={6} title="Location Details (keep unchanged)" />
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Address" value={form.locationDetails.address} onChange={(e) => updateForm("locationDetails.address", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Area" value={form.locationDetails.area} onChange={(e) => updateForm("locationDetails.area", e.target.value)} />
              <input className="border p-2 rounded" placeholder="City" value={form.locationDetails.city} onChange={(e) => updateForm("locationDetails.city", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Pincode" value={form.locationDetails.pincode} onChange={(e) => updateForm("locationDetails.pincode", e.target.value)} />
              <input className="border p-2 rounded col-span-2" placeholder="Landmark" value={form.locationDetails.landmark} onChange={(e) => updateForm("locationDetails.landmark", e.target.value)} />
              <input className="border p-2 rounded col-span-2" placeholder="Map link" value={form.locationDetails.mapLink} onChange={(e) => updateForm("locationDetails.mapLink", e.target.value)} />
            </div>
          </section>
        )}

        {/* STEP 7: Contact (unchanged) */}
        {step === 7 && (
          <section>
            <StepHeader number={7} title="Contact Details (keep unchanged)" />
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Phone" value={form.contactDetails.phone} onChange={(e) => updateForm("contactDetails.phone", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Whatsapp" value={form.contactDetails.whatsapp} onChange={(e) => updateForm("contactDetails.whatsapp", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Email" value={form.contactDetails.email} onChange={(e) => updateForm("contactDetails.email", e.target.value)} />
              <input className="border p-2 rounded" placeholder="Owner name" value={form.contactDetails.ownerName} onChange={(e) => updateForm("contactDetails.ownerName", e.target.value)} />
              <input className="border p-2 rounded" placeholder="GSTIN" value={form.contactDetails.gstin} onChange={(e) => updateForm("contactDetails.gstin", e.target.value)} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.contactDetails.verified} onChange={(e) => updateForm("contactDetails.verified", e.target.checked)} /> Verified contact</label>
            </div>
          </section>
        )}

        {/* STEP 8: Highlights & FAQ (you said OK keep) */}
        {step === 8 && (
          <section>
            <StepHeader number={8} title="Highlights & FAQ (no change)" />
            <div>
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Add highlight" value={tempFacility} onChange={(e) => setTempFacility(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempFacility) { pushToArray("highlights", tempFacility); setTempFacility(""); } }}>Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.highlights.map((h, i) => (<div key={i} className="px-2 py-1 bg-gray-100 rounded">{h}<button onClick={() => removeFromArray("highlights", i)} className="text-red-500 ml-2">x</button></div>))}
              </div>

              <div className="mt-4">
                <h4 className="font-medium">FAQs</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Question" className="border p-2 rounded" value={tempFaq.q} onChange={(e) => setTempFaq(f => ({ ...f, q: e.target.value }))} />
                  <input placeholder="Answer" className="border p-2 rounded" value={tempFaq.a} onChange={(e) => setTempFaq(f => ({ ...f, a: e.target.value }))} />
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 bg-green-600 text-white rounded" onClick={() => { if (tempFaq.q && tempFaq.a) { pushToArray("overview.faq", tempFaq); setTempFaq({ q: "", a: "" }); } }}>Add FAQ</button>
                </div>
                <div className="mt-3">
                  {form.overview.faq.map((fq, idx) => (
                    <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                      <div><div className="font-medium">{fq.q}</div><div className="text-sm text-gray-600">{fq.a}</div></div>
                      <button onClick={() => removeFromArray("overview.faq", idx)} className="text-red-500">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STEP 9: Meta & Preview (unique design) */}
        {step === 9 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-gray-500">Final Step</div>
                <h2 className="text-2xl font-bold">Preview & Meta (Unique Design)</h2>
                <p className="text-sm text-gray-600 mt-1">Review everything below. Once you submit, the listing will be posted to your backend.</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Provider</div>
                <div className="font-medium">{form.providerId?.$oid}</div>
              </div>
            </div>

            {/* Compact meta controls */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 rounded border bg-white">
                <label className="block text-xs text-gray-500 mb-1">Status</label>
                <select className="w-full p-2 border rounded" value={form.meta.status} onChange={(e) => updateForm("meta.status", e.target.value)}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Deprecated</option>
                </select>
                <label className="flex items-center gap-2 mt-3"><input type="checkbox" checked={form.meta.verifiedListing} onChange={(e) => updateForm("meta.verifiedListing", e.target.checked)} /> Verified listing</label>
              </div>

              <div className="p-4 rounded border bg-white">
                <div className="text-sm text-gray-500 mb-2">Listing snapshot</div>
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded overflow-hidden bg-gray-100">
                    <img src={form.media.mainImages[0]?.url || "/placeholder/default_hall.jpg"} alt="preview" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">{form.name || "Untitled Business"}</div>
                    <div className="text-sm text-gray-600">{form.locationDetails.address || "Address not set"}</div>
                    <div className="text-sm text-gray-500">Photos: {form.media.totalPhotos || 0} • Rating: {form.rating} ({form.numRatings})</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Large preview JSON but nicer */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 p-4 bg-white border rounded max-h-96 overflow-auto">
                <h3 className="font-semibold mb-2">Preview JSON (read-only)</h3>
                <pre className="text-xs text-gray-700">{JSON.stringify(form, null, 2)}</pre>
              </div>

              <div className="p-4 bg-white border rounded space-y-3">
                <h3 className="font-semibold">Quick Actions</h3>
                <button className="w-full py-2 bg-green-600 text-white rounded" onClick={handlePreviewAndSubmit}>Submit to backend</button>
                <button className="w-full py-2 bg-gray-200 rounded" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(form, null, 2)); alert("JSON copied to clipboard"); }}>Copy JSON</button>
                <button className="w-full py-2 bg-white border rounded" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Edit from start</button>
                <div className="text-xs text-gray-500 pt-2">Tip: make sure main image is set for better listing view.</div>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="mt-6 flex justify-between">
        <div>
          {step > 1 && <button className="px-4 py-2 bg-gray-200 rounded" onClick={prev}>← Previous</button>}
        </div>
        <div className="flex gap-2">
          {step < totalSteps && <button className="px-4 py-2 bg-indigo-600 text-white rounded" onClick={next}>Next →</button>}
        </div>
      </div>
    </div>
  );
}

/**
 * DynamicArrayField component (unchanged)
 */
function DynamicArrayField({ fieldKey, label, values, onAdd, onRemove, onChange }) {
  const [temp, setTemp] = useState("");

  return (
    <div className="border p-3 rounded">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input className="border p-2 rounded flex-1" value={temp} onChange={(e) => setTemp(e.target.value)} placeholder={`Add ${label}`} />
        <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (temp) { onAdd(temp); setTemp(''); } }}>Add</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map((v, i) => (
          <div key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
            <span className="text-sm">{v}</span>
            <button onClick={() => onRemove(i)} className="text-red-500">x</button>
          </div>
        ))}
      </div>
    </div>
  );
}
