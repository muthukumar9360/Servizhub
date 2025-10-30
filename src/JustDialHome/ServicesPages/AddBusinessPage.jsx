import React, { useEffect, useState } from "react";

// AddBusinessPage.jsx
// Single-file multi-step form that collects comprehensive business data
// Tailwind utility classes are used for styling (no external CSS required)
// At the final step the form builds a JSON shaped like your sample and logs it

export default function AddBusinessPage() {
  const api = import.meta.env.VITE_SERVER_URL || "http://localhost:5024/api";

  // ---------- Utilities ----------
  // Generate a 24-char hex string similar to MongoDB ObjectId (client-side placeholder)
  const generateOid = () => {
    // 24 hex chars (12 bytes) -> combine timestamp + random
    const ts = Math.floor(Date.now() / 1000).toString(16); // 8 chars
    let rand = "";
    while (rand.length < 16) rand += Math.floor(Math.random() * 16).toString(16);
    return (ts + rand).slice(0, 24);
  };

  // ---------- Step state ----------
  const [step, setStep] = useState(1);
  const totalSteps = 10;

  // ---------- Master form state (normalized to match your JSON) ----------
  const [form, setForm] = useState({
    // meta IDs will be filled after category selection
    _id: { $oid: generateOid() },
    name: "",
    mainCategoryId: null, // { $oid: "..." }
    subCategoryId: null,
    rating: 0,
    numRatings: 0,
    status: "Not Verified",
    claimed: false,
    isOpen: true,
    operatingHours: "",

    media: {
      mainImages: [], // [{url, alt}]
      totalPhotos: 0,
      photoCategories: [], // [{name, count}]
      videoTour: "",
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
      relatedListings: [], // array of objects
      faq: [],
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

    reviews: {
      jdRating: 0,
      totalReviews: 0,
      userReviews: [],
      alsoListedIn: [],
    },

    meta: {
      lastUpdated: { $date: new Date().toISOString() },
      status: "Choose Status",
      verifiedListing: false,
    },

    providerId: { $oid: generateOid() },
  });

  // temporary inputs for dynamic lists
  const [tempImageUrl, setTempImageUrl] = useState("");
  const [tempImageAlt, setTempImageAlt] = useState("");
  const [tempPhotoCategoryName, setTempPhotoCategoryName] = useState("");
  const [tempPhotoCategoryCount, setTempPhotoCategoryCount] = useState("");

  const [tempFacility, setTempFacility] = useState("");
  const [tempAvailableFor, setTempAvailableFor] = useState("");
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
  const [tempUserReview, setTempUserReview] = useState({ name: "", reviewsCount: "", date: "", text: "", userImage: "", highlight: "" });

  // example categories fetched from backend (or you can hardcode list)
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend or set sample categories
    // Endpoint expected: GET /api/business (or adjust)
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${api}/business`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        // provide fallback sample categories to continue UI
        setCategories([
          { _id: { $oid: generateOid() }, mainCategory: "Banquet Halls", homeImage: "", subCategories: [{ _id: { $oid: generateOid() }, title: "AC Halls", image: "" }, { _id: { $oid: generateOid() }, title: "Open Lawn", image: "" }] },
          { _id: { $oid: generateOid() }, mainCategory: "Salon & Spa", homeImage: "", subCategories: [{ _id: { $oid: generateOid() }, title: "Unisex Salon", image: "" }] },
        ]);
      }
    };
    fetchCategories();
  }, [api]);

  // ---------- Helpers to mutate the big form state ----------
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

  // ---------- Navigation ----------
  const next = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  // ---------- Submit (console + send to backend) ----------
  const handlePreviewAndSubmit = async () => {
    // update meta timestamp
    updateForm('meta.lastUpdated.$date', new Date().toISOString());

    // Build final JSON (deep clone of form)
    const output = JSON.parse(JSON.stringify(form));

    // Ensure IDs are in {$oid: '...'} form if raw strings used
    if (output.mainCategoryId && typeof output.mainCategoryId === 'string') output.mainCategoryId = { $oid: output.mainCategoryId };
    if (output.subCategoryId && typeof output.subCategoryId === 'string') output.subCategoryId = { $oid: output.subCategoryId };
    if (output.providerId && typeof output.providerId === 'string') output.providerId = { $oid: output.providerId };

    console.log("--- Final JSON to send to backend ---\n", output);

    // POST to backend
    try {
      const res = await fetch(`${api}/businesslist/add`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(output),
      });
      const data = await res.json();
      console.log('Backend response:', data);
      alert('Business data sent to backend (check console)');
    } catch (err) {
      console.error('Failed to send to backend', err);
      alert('Failed to send to backend (see console)');
    }
  };

  // ---------- Render UI steps ----------
  return (
    <div className="max-w-6xl mx-auto p-6 mt-8 bg-white rounded shadow-md">
      <h1 className="text-2xl font-bold mb-4">Add Business — Multi-step Form</h1>

      {/* Stepper */}
      <div className="flex gap-2 mb-6 items-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className={`px-3 py-1 rounded-full border ${step === i + 1 ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}>Step {i + 1}</div>
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {step === 1 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">1) Category</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const id = cat._id?.$oid || (cat._id && (cat._id.toString()));
                return (
                  <div key={id} className={`p-4 border rounded cursor-pointer ${form.mainCategoryId?.$oid === id ? 'border-blue-600 shadow' : ''}`} onClick={() => updateForm('mainCategoryId', { $oid: id })}>
                    <div className="font-medium">{cat.mainCategory}</div>
                    <div className="text-sm text-gray-500">{cat.description || '—'}</div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {step === 2 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">2) Subcategory</h2>
            <div className="grid grid-cols-2 gap-3">
              {(() => {
                const chosen = categories.find(c => c._id?.$oid === form.mainCategoryId?.$oid) || categories[0] || {};
                const subs = chosen.subCategories || chosen.subCategories || [];
                // fallback: try categories[0].subCategories
                return subs.length ? subs.map((s) => (
                  <div key={s._id?.$oid || s._id} className={`p-4 border rounded cursor-pointer ${form.subCategoryId?.$oid === s._id?.$oid ? 'border-blue-600 shadow' : ''}`} onClick={() => updateForm('subCategoryId', { $oid: s._id?.$oid || generateOid() })}>
                    <div className="font-medium">{s.title}</div>
                    <div className="text-sm text-gray-500">{s.description || '—'}</div>
                  </div>
                )) : (<div className="text-gray-500">No subcategories available for selected category.</div>)
              })()}
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">3) Basic Info</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Business name" value={form.name} onChange={(e) => updateForm('name', e.target.value)} />
              <input className="border p-2 rounded" type="number" placeholder="Rating (e.g. 4.5)" value={form.rating} onChange={(e) => updateForm('rating', Number(e.target.value))} />
              <input className="border p-2 rounded" type="number" placeholder="Number of ratings" value={form.numRatings} onChange={(e) => updateForm('numRatings', Number(e.target.value))} />
              <select className="border p-2 rounded" value={form.status} onChange={(e) => updateForm('status', e.target.value)}>
                <option>Not Verified</option>
                <option>Verified</option>
                <option>Closed</option>
              </select>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.claimed} onChange={(e) => updateForm('claimed', e.target.checked)} /> Claimed</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.isOpen} onChange={(e) => updateForm('isOpen', e.target.checked)} /> Currently Open</label>
              <input className="border p-2 rounded col-span-2" placeholder="Operating hours" value={form.operatingHours} onChange={(e) => updateForm('operatingHours', e.target.value)} />
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">4) Overview (description, facilities, capacity, services)</h2>
            <textarea className="w-full border p-2 rounded" placeholder="Short description" value={form.overview.description} onChange={(e) => updateForm('overview.description', e.target.value)} />

            <div className="mt-3 grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Established year" value={form.overview.establishedYear || ''} onChange={(e) => updateForm('overview.establishedYear', e.target.value ? Number(e.target.value) : null)} />

              <div>
                <div className="flex gap-2">
                  <input className="border p-2 rounded flex-1" placeholder="Add facility (press Add)" value={tempFacility} onChange={(e) => setTempFacility(e.target.value)} />
                  <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempFacility) { pushToArray('overview.facilities', tempFacility); setTempFacility(''); } }}>Add</button>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {form.overview.facilities.map((f, i) => (
                    <div key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">
                      <span>{f}</span>
                      <button onClick={() => removeFromArray('overview.facilities', i)} className="text-red-500">x</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <input className="border p-2 rounded" placeholder="Min capacity" value={form.overview.capacity.minGuests || ''} onChange={(e) => updateForm('overview.capacity.minGuests', e.target.value ? Number(e.target.value) : null)} />
                <input className="border p-2 rounded" placeholder="Max capacity" value={form.overview.capacity.maxGuests || ''} onChange={(e) => updateForm('overview.capacity.maxGuests', e.target.value ? Number(e.target.value) : null)} />
              </div>

              <input className="border p-2 rounded" placeholder="Price range" value={form.overview.priceRange} onChange={(e) => updateForm('overview.priceRange', e.target.value)} />

              <div>
                <div className="flex gap-2">
                  <input className="border p-2 rounded flex-1" placeholder="Available for (comma separated)" value={tempAvailableFor} onChange={(e) => setTempAvailableFor(e.target.value)} />
                  <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempAvailableFor) { pushToArray('overview.availableFor', ...tempAvailableFor.split(',').map(s => s.trim()).filter(Boolean)); setTempAvailableFor(''); } }}>Add</button>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {form.overview.availableFor.map((f, i) => (
                    <div key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-2">{f}<button onClick={() => removeFromArray('overview.availableFor', i)} className="text-red-500">x</button></div>
                  ))}
                </div>
              </div>

              <input className="border p-2 rounded" placeholder="Website" value={form.overview.website} onChange={(e) => updateForm('overview.website', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Email" value={form.overview.email} onChange={(e) => updateForm('overview.email', e.target.value)} />

              <input className="border p-2 rounded col-span-2" placeholder="Contact" value={form.overview.contact} onChange={(e) => updateForm('overview.contact', e.target.value)} />

              <div className="col-span-2">
                <div className="flex gap-2">
                  <input className="border p-2 rounded flex-1" placeholder="Explore category" value={tempExploreCategory} onChange={(e) => setTempExploreCategory(e.target.value)} />
                  <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempExploreCategory) { pushToArray('overview.exploreCategories', tempExploreCategory); setTempExploreCategory(''); } }}>Add</button>
                </div>
                <div className="mt-2 flex gap-2 flex-wrap">
                  {form.overview.exploreCategories.map((f, i) => (<div key={i} className="px-2 py-1 bg-gray-100 rounded">{f}<button onClick={() => removeFromArray('overview.exploreCategories', i)} className="text-red-500 ml-2">x</button></div>))}
                </div>
              </div>

              <div className="col-span-2">
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
                  <button className="px-3 bg-green-600 text-white rounded" onClick={() => { pushToArray('overview.relatedListings', tempRelatedListing); setTempRelatedListing({ name: '', rating: '', reviews: '', distance: '', location: '', verified: false, trust: false, imageUrl: '' }); }}>Add related</button>
                </div>

                <div className="mt-3">
                  {form.overview.relatedListings.map((rl, idx) => (
                    <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                      <div>
                        <div className="font-medium">{rl.name}</div>
                        <div className="text-sm text-gray-500">{rl.location} • {rl.rating} • {rl.distance}</div>
                      </div>
                      <button onClick={() => removeFromArray('overview.relatedListings', idx)} className="text-red-500">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">5) Media (images, photo categories, video)</h2>
            <div className="grid grid-cols-3 gap-3">
              <input className="border p-2 rounded col-span-2" placeholder="Image URL" value={tempImageUrl} onChange={(e) => setTempImageUrl(e.target.value)} />
              <input className="border p-2 rounded" placeholder="Alt text" value={tempImageAlt} onChange={(e) => setTempImageAlt(e.target.value)} />
              <div className="col-span-3 flex gap-2">
                <button className="px-3 bg-green-600 text-white rounded" onClick={() => { if (tempImageUrl) { pushToArray('media.mainImages', { url: tempImageUrl, alt: tempImageAlt || form.name }); setTempImageUrl(''); setTempImageAlt(''); } }}>Add Image</button>
              </div>

              <div className="col-span-3">
                {form.media.mainImages.map((img, idx) => (
                  <div key={idx} className="flex items-center gap-3 border rounded p-2 mb-2">
                    <img src={img.url} alt={img.alt} className="w-24 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium">{img.alt}</div>
                      <div className="text-sm text-gray-500">{img.url}</div>
                    </div>
                    <button onClick={() => removeFromArray('media.mainImages', idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>

              <div className="col-span-2">
                <input className="border p-2 rounded w-full" placeholder="Photo category name" value={tempPhotoCategoryName} onChange={(e) => setTempPhotoCategoryName(e.target.value)} />
              </div>
              <input className="border p-2 rounded" placeholder="Count" value={tempPhotoCategoryCount} onChange={(e) => setTempPhotoCategoryCount(e.target.value)} />
              <div className="col-span-3 mt-2">
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempPhotoCategoryName) { pushToArray('media.photoCategories', { name: tempPhotoCategoryName, count: Number(tempPhotoCategoryCount) || 0 }); setTempPhotoCategoryName(''); setTempPhotoCategoryCount(''); } }}>Add Photo Category</button>
              </div>

              <div className="col-span-3 mt-3">
                {form.media.photoCategories.map((pc, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 border rounded mb-2">
                    <div>{pc.name} — {pc.count}</div>
                    <button onClick={() => removeFromArray('media.photoCategories', idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>

              <div className="col-span-3">
                <input className="border p-2 rounded w-full" placeholder="Video tour URL" value={form.media.videoTour} onChange={(e) => updateForm('media.videoTour', e.target.value)} />
              </div>

              <div className="col-span-3">
                <input className="border p-2 rounded w-full" placeholder="Total photos (number)" value={form.media.totalPhotos} onChange={(e) => updateForm('media.totalPhotos', Number(e.target.value))} />
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">6) Location Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Address" value={form.locationDetails.address} onChange={(e) => updateForm('locationDetails.address', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Area" value={form.locationDetails.area} onChange={(e) => updateForm('locationDetails.area', e.target.value)} />
              <input className="border p-2 rounded" placeholder="City" value={form.locationDetails.city} onChange={(e) => updateForm('locationDetails.city', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Pincode" value={form.locationDetails.pincode} onChange={(e) => updateForm('locationDetails.pincode', e.target.value)} />
              <input className="border p-2 rounded col-span-2" placeholder="Landmark" value={form.locationDetails.landmark} onChange={(e) => updateForm('locationDetails.landmark', e.target.value)} />
              <input className="border p-2 rounded col-span-2" placeholder="Map link" value={form.locationDetails.mapLink} onChange={(e) => updateForm('locationDetails.mapLink', e.target.value)} />
            </div>
          </section>
        )}

        {step === 7 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">7) Contact Details</h2>
            <div className="grid grid-cols-2 gap-3">
              <input className="border p-2 rounded" placeholder="Phone" value={form.contactDetails.phone} onChange={(e) => updateForm('contactDetails.phone', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Whatsapp" value={form.contactDetails.whatsapp} onChange={(e) => updateForm('contactDetails.whatsapp', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Email" value={form.contactDetails.email} onChange={(e) => updateForm('contactDetails.email', e.target.value)} />
              <input className="border p-2 rounded" placeholder="Owner name" value={form.contactDetails.ownerName} onChange={(e) => updateForm('contactDetails.ownerName', e.target.value)} />
              <input className="border p-2 rounded" placeholder="GSTIN" value={form.contactDetails.gstin} onChange={(e) => updateForm('contactDetails.gstin', e.target.value)} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.contactDetails.verified} onChange={(e) => updateForm('contactDetails.verified', e.target.checked)} /> Verified contact</label>
            </div>
          </section>
        )}

        {step === 8 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">8) Highlights & FAQ</h2>
            <div>
              <div className="flex gap-2">
                <input className="border p-2 rounded flex-1" placeholder="Add highlight" onChange={(e) => setTempFacility(e.target.value)} />
                <button className="px-3 bg-indigo-600 text-white rounded" onClick={() => { if (tempFacility) { pushToArray('highlights', tempFacility); setTempFacility(''); } }}>Add</button>
              </div>
              <div className="mt-2 flex gap-2 flex-wrap">
                {form.highlights.map((h, i) => (<div key={i} className="px-2 py-1 bg-gray-100 rounded">{h}<button onClick={() => removeFromArray('highlights', i)} className="text-red-500 ml-2">x</button></div>))}
              </div>

              <div className="mt-4">
                <h4 className="font-medium">FAQs</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input placeholder="Question" className="border p-2 rounded" value={tempFaq.q} onChange={(e) => setTempFaq(f => ({ ...f, q: e.target.value }))} />
                  <input placeholder="Answer" className="border p-2 rounded" value={tempFaq.a} onChange={(e) => setTempFaq(f => ({ ...f, a: e.target.value }))} />
                </div>
                <div className="mt-2 flex gap-2">
                  <button className="px-3 bg-green-600 text-white rounded" onClick={() => { if (tempFaq.q && tempFaq.a) { pushToArray('overview.faq', tempFaq); setTempFaq({ q: '', a: '' }); } }}>Add FAQ</button>
                </div>
                <div className="mt-3">
                  {form.overview.faq.map((fq, idx) => (
                    <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                      <div><div className="font-medium">{fq.q}</div><div className="text-sm text-gray-600">{fq.a}</div></div>
                      <button onClick={() => removeFromArray('overview.faq', idx)} className="text-red-500">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 9 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">9) Reviews (optional)</h2>
            <div>
              <div className="grid grid-cols-3 gap-2">
                <input placeholder="Reviewer name" className="border p-2 rounded" value={tempUserReview.name} onChange={(e) => setTempUserReview(r => ({ ...r, name: e.target.value }))} />
                <input placeholder="Reviews Count" className="border p-2 rounded" value={tempUserReview.reviewsCount} onChange={(e) => setTempUserReview(r => ({ ...r, reviewsCount: e.target.value }))} />
                <input placeholder="Date" className="border p-2 rounded" value={tempUserReview.date} onChange={(e) => setTempUserReview(r => ({ ...r, date: e.target.value }))} />
                <input placeholder="Text" className="border p-2 rounded col-span-3" value={tempUserReview.text} onChange={(e) => setTempUserReview(r => ({ ...r, text: e.target.value }))} />
                <input placeholder="UserImage" className="border p-2 rounded" value={tempUserReview.userImage} onChange={(e) => setTempUserReview(r => ({ ...r, userImage: e.target.value }))} />
                <input placeholder="Highlight" className="border p-2 rounded" value={tempUserReview.highlight} onChange={(e) => setTempUserReview(r => ({ ...r, highlight: e.target.value }))} />
              </div>
              <div className="mt-2">
                <button className="px-3 bg-green-600 text-white rounded" onClick={() => { pushToArray('reviews.userReviews', tempUserReview); setTempUserReview({ name: '', reviewsCount: '', date: '', text: '', userImage: '', highlight: '' }); }}>Add Review</button>
              </div>

              <div className="mt-4">
                {form.reviews.userReviews.map((ur, idx) => (
                  <div key={idx} className="p-2 border rounded mb-2 flex justify-between items-center">
                    <div>
                      <div className="font-medium">{ur.name} — {ur.reviewsCount} reviews</div>
                      <div className="text-sm text-gray-500">{ur.text}</div>
                    </div>
                    <button onClick={() => removeFromArray('reviews.userReviews', idx)} className="text-red-500">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {step === 10 && (
          <section>
            <h2 className="font-semibold text-lg mb-3">10) Meta & Preview</h2>

            <div className="grid grid-cols-2 gap-3 text-lg">
              <h1 className="p-4 rounded border border-black text-center">
                USER NAME : {form.providerId?.$oid}
              </h1>
              <h1 className="p-4 rounded border border-black text-center">
                PROVIDER ID : {form.providerId?.$oid}
              </h1>
              <select
                className="border border-black rounded h-10 px-3 mt-3 w-full text-center"
                value={form.meta.status}
                onChange={(e) => updateForm('meta.status', e.target.value)}
              >
                <option>Active</option>
                <option>Inactive</option>
                <option>Deprecated</option>
              </select>
              <label className="flex items-center mt-3 ml-3 text-xl text-black font-bold gap-2">
                <input
                  type="checkbox"
                  checked={form.meta.verifiedListing}
                  onChange={(e) => updateForm('meta.verifiedListing', e.target.checked)}
                  className="w-6 h-6"
                />{" "}
                Verified listing
              </label>
            </div>

            <div className="mt-4">
              <h4 className="font-medium">Preview JSON</h4>
              <pre className="bg-gray-900 text-white p-3 rounded max-h-72 overflow-auto text-xs">{JSON.stringify(form, null, 2)}</pre>
            </div>

            <div className="mt-3 flex gap-3">
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handlePreviewAndSubmit}>Submit to backend</button>
              <button className="px-4 py-2 bg-gray-200 rounded" onClick={() => { navigator.clipboard?.writeText(JSON.stringify(form, null, 2)); alert('JSON copied to clipboard'); }}>Copy JSON</button>
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
