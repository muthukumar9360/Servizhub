const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const BusinessCategory = require("../models/Business");
const BusinessList = require("../models/BusinessList");
const Guide = require("../models/Guide");
const Service = require("../models/Service");

const seedServicePlatform = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
    console.log("Connecting to MongoDB Atlas for Service Provider Platform Seed...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    console.log("Cleaning old database collections and stale indexes...");
    const collectionsToDrop = ["services", "Businesses", "businesses", "Businesslist", "businesslists", "guides", "users"];
    for (const c of collectionsToDrop) {
      try {
        await mongoose.connection.collection(c).drop();
      } catch (e) {
        // ignore if collection does not exist
      }
    }

    // 2. Users: Super Admin, Providers, Customers
    console.log("Creating Verified Platform Users...");
    const superAdmin = await User.create({
      fullName: "Arun Kumar (Platform Admin)",
      username: "arunkumar",
      email: "admin@example.com",
      phone: "9876543200",
      password: "SuperAdmin@123",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      trustProfile: { trustScore: 100, trustTier: "TOP_RATED" },
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    const primaryProvider = await User.create({
      fullName: "Servizio Verified Providers Hub",
      username: "servizioprovider",
      email: "provider@example.com",
      phone: "9876543210",
      password: "Provider@123",
      role: "PROVIDER",
      status: "ACTIVE",
      trustProfile: { trustScore: 98, trustTier: "TOP_RATED" },
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    const primaryCustomer = await User.create({
      fullName: "Muthu Kumar",
      username: "muthukumar",
      email: "user@example.com",
      phone: "9876543220",
      password: "User@123",
      role: "USER",
      status: "ACTIVE",
      trustProfile: { trustScore: 95, trustTier: "TRUSTED" },
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    // Additional Service Providers for realism
    const additionalProvidersData = [
      { name: "Royal Grand Banquet & Events", email: "royalbanquets@servizio.com", phone: "9876543221", city: "Chennai" },
      { name: "CoolBreeze 24/7 AC Care", email: "coolbreeze@servizio.com", phone: "9876543222", city: "Chennai" },
      { name: "Glow & Shine Luxury Salon & Spa", email: "glowshine@servizio.com", phone: "9876543223", city: "Bengaluru" },
      { name: "AutoPro Car Detailing & Service", email: "autopro@servizio.com", phone: "9876543224", city: "Coimbatore" },
      { name: "SparkleClean Pro Home Services", email: "sparkleclean@servizio.com", phone: "9876543225", city: "Chennai" },
      { name: "LensCraft Wedding Photography", email: "lenscraft@servizio.com", phone: "9876543226", city: "Madurai" },
      { name: "VoltSafe Certified Electricians", email: "voltsafe@servizio.com", phone: "9876543227", city: "Chennai" },
      { name: "SafeShift Packers & Movers", email: "safeshift@servizio.com", phone: "9876543228", city: "Bengaluru" },
    ];

    const providerAccounts = [primaryProvider];
    for (let p of additionalProvidersData) {
      const u = await User.create({
        fullName: p.name,
        username: p.email.split("@")[0],
        email: p.email,
        phone: p.phone,
        password: "Provider@123",
        role: "PROVIDER",
        status: "ACTIVE",
        trustProfile: { trustScore: 94, trustTier: "TOP_RATED" },
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });
      providerAccounts.push(u);
    }

    // 3. Service Categories & Subcategories
    console.log("Seeding Master Service Categories & Subcategories...");
    const masterServiceCategories = [
      {
        mainCategory: "Wedding Requisites",
        description: "Banquet halls, bridal artists, caterers, photographers, wedding planners and decorators.",
        homeImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Banquet Halls",
            description: "Air-conditioned AC halls, marriage mandapams, and luxury party lawns with ample car parking.",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Bridal Requisite",
            description: "HD bridal makeup, hair styling, pre-wedding skin prep, and saree draping specialists.",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Caterers",
            description: "Veg & Non-Veg traditional feast, live food counters, and multi-cuisine corporate buffet catering.",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Photography Services",
            description: "Candid wedding photography, cinematic 4K video teaser, drone coverage, and pre-wedding shoots.",
            image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Wedding Planners",
            description: "End-to-end wedding conceptualization, vendor coordination, and seamless ceremony management.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Decor & Design",
            description: "Traditional floral stage decoration, modern fairy-light entrance, and theme mandap setups.",
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Entertainment & DJs",
            description: "Live orchestra, high-energy wedding DJs, LED dance floor, and sound system rentals.",
            image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Wedding Transport",
            description: "Luxury bridal cars, vintage convertibles, and AC passenger coaches for wedding guests.",
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Repairs & Services",
        description: "AC technicians, certified electricians, plumbers, car service, bike mechanics, and home appliance care.",
        homeImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "AC Service",
            description: "Split and window AC deep jet cleaning, gas charging, compressor repair, and installation.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Electricians",
            description: "Complete house wiring, short circuit fixes, fan and chandelier installation, inverter setup.",
            image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Car Service",
            description: "Periodic car maintenance, synthetic engine oil change, foam car wash, and wheel alignment.",
            image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Bike Service",
            description: "General bike tuning, brake overhaul, clutch cable replacement, and mobile doorstep servicing.",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Plumbers",
            description: "Leak repair, tap fitting, blocked drain clearance, bathroom sanitary fittings, and water heater installation.",
            image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Beauty & Spa",
        description: "Unisex salons, ladies beauty parlours, therapeutic ayurvedic spa, and skin rejuvenation treatments.",
        homeImage: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Salons",
            description: "Haircut, hair spa, keratin smoothening, beard sculpting, and facial rejuvenation.",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Beauty Parlours",
            description: "Skin whitening facials, organic waxing, manicure, pedicure, and threading services.",
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Spa & Massages",
            description: "Full body Swedish massage, aromatherapy, deep tissue relief, and herbal steam baths.",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Daily Needs",
        description: "House deep cleaning, packers & movers, grocery stores, pest control, and household utility services.",
        homeImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Packers & Movers",
            description: "Safe household shifting, office relocation, secure bubble packing, and inter-city transport.",
            image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Home Cleaning",
            description: "Full apartment deep cleaning, kitchen degreasing, bathroom descaling, and sofa shampooing.",
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Pest Control",
            description: "Termite eradication, cockroach gel treatment, bed bug control, and mosquito fogging.",
            image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Grocery",
            description: "Fresh farm vegetables, organic staples, dairy products, and doorstep same-day delivery.",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
    ];

    const createdBusinessCategories = [];
    for (let cat of masterServiceCategories) {
      const c = await BusinessCategory.create(cat);
      createdBusinessCategories.push(c);

      // Mirror into Service model for consistency
      await Service.create({
        title: cat.mainCategory,
        description: cat.description,
        homeImage: cat.homeImage,
        subcategories: cat.subCategories.map((sub, idx) => ({
          _id: c.subCategories[idx]._id,
          title: sub.title,
          description: sub.description,
          image: sub.image,
        })),
      });
    }

    // 4. Real Business Listings (Businesslist collection)
    console.log("Seeding Verified Local Service Businesses (BusinessList)...");
    const sampleBusinesses = [
      // 1. Banquet Hall
      {
        name: "Grand Imperial Palace & Convention Centre",
        catName: "Wedding Requisites",
        subName: "Banquet Halls",
        providerIndex: 1,
        ratings: { overall: 4.8, total: 184 },
        operatingHours: "07:00 AM - 11:00 PM",
        extraInfo: "State-of-the-art centralized AC, dining hall capacity of 600, 100+ car parking.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80", alt: "Grand Imperial Hall Main" },
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80", alt: "Dining Area" },
          ],
          totalPhotos: 14,
        },
        locationDetails: { address: "124 GST Road, Guindy", city: "Chennai", state: "Tamil Nadu", pincode: "600032" },
        contactDetails: { phone: "9876543221", email: "royalbanquets@servizio.com", website: "https://grandimperialpalace.com" },
        overview: {
          description: "One of Chennai's premier luxury wedding venues featuring crystal chandeliers, centralized climate control, dedicated bridal suites, and generator backup.",
          establishedYear: 2016,
          facilities: ["Air Conditioned", "Valet Car Parking", "Bridal Dressing Room", "In-house Catering Available", "Power Backup"],
          capacity: { minGuests: 150, maxGuests: 1200 },
          priceRange: "₹₹₹ (Premium)",
          services: ["Wedding Receptions", "Corporate Conferences", "Engagement Ceremonies", "Birthday Galas"],
        },
        tags: ["Verified", "Top Rated", "Luxury Hall", "Valet Parking"],
      },
      // 2. AC Service
      {
        name: "CoolBreeze 24/7 Doorstep AC Repair & Service",
        catName: "Repairs & Services",
        subName: "AC Service",
        providerIndex: 2,
        ratings: { overall: 4.9, total: 310 },
        operatingHours: "08:00 AM - 09:30 PM (Mon - Sun)",
        extraInfo: "Same-day doorstep technician arrival in 90 minutes. 90-day service warranty.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", alt: "AC Jet Pump Service" },
            { url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80", alt: "Gas Refill" },
          ],
          totalPhotos: 9,
        },
        locationDetails: { address: "45 Velachery Main Road", city: "Chennai", state: "Tamil Nadu", pincode: "600042" },
        contactDetails: { phone: "9876543222", email: "coolbreeze@servizio.com", website: "https://coolbreezeac.in" },
        overview: {
          description: "Certified HVAC engineers specializing in Daikin, Voltas, LG, Samsung, and Blue Star AC systems. Complete jet washing, leak detection, and genuine copper coil spares.",
          establishedYear: 2018,
          facilities: ["Doorstep Service", "Online Payment", "90-Day Warranty", "Certified Technicians", "Transparent Pricing"],
          priceRange: "₹₹ (Affordable)",
          services: ["Jet Pump Deep Cleaning", "R32/R410A Gas Refilling", "PCB Board Repair", "New Unit Installation"],
        },
        tags: ["90-Day Warranty", "Verified", "Same Day Service", "ISO Certified"],
      },
      // 3. Salon & Spa
      {
        name: "Glow & Shine Luxury Unisex Salon & Spa",
        catName: "Beauty & Spa",
        subName: "Salons",
        providerIndex: 3,
        ratings: { overall: 4.8, total: 242 },
        operatingHours: "09:30 AM - 09:00 PM",
        extraInfo: "L'Oréal & Olaplex certified professional stylists. Complimentary green tea & head massage.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Salon Interior" },
            { url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80", alt: "Styling Chairs" },
          ],
          totalPhotos: 18,
        },
        locationDetails: { address: "88 Indiranagar 100ft Road", city: "Bengaluru", state: "Karnataka", pincode: "560038" },
        contactDetails: { phone: "9876543223", email: "glowshine@servizio.com", website: "https://glowshinesalon.com" },
        overview: {
          description: "Award-winning unisex salon offering bespoke haircuts, Balayage coloring, Keratin protein smoothening, and botanical skin revitalizing facials.",
          establishedYear: 2019,
          facilities: ["Air Conditioned", "Free High-Speed Wi-Fi", "Online Appointment", "Card / UPI Accepted"],
          priceRange: "₹₹ (Moderate)",
          services: ["Creative Haircuts", "Olaplex Hair Spa", "Hydra Facial", "Beard Styling", "Manicure & Pedicure"],
        },
        tags: ["Verified", "Top Rated", "Unisex", "Hygienic Clean"],
      },
      // 4. Photography
      {
        name: "LensCraft Cinematic Wedding & Portrait Studio",
        catName: "Wedding Requisites",
        subName: "Photography Services",
        providerIndex: 6,
        ratings: { overall: 4.9, total: 175 },
        operatingHours: "09:00 AM - 08:00 PM",
        extraInfo: "Over 400+ weddings captured across South India. Sony A7 IV & DJI Master coverage.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80", alt: "Couple Portrait" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Ceremony Candid" },
          ],
          totalPhotos: 22,
        },
        locationDetails: { address: "14 North Veli Street", city: "Madurai", state: "Tamil Nadu", pincode: "625001" },
        contactDetails: { phone: "9876543226", email: "lenscraft@servizio.com", website: "https://lenscraftweddings.com" },
        overview: {
          description: "Passionate team of visual storytellers specializing in candid wedding documentation, traditional photography, 4K teaser reels, and fine art photobooks.",
          establishedYear: 2017,
          facilities: ["Drone Shoots", "Teaser in 48 Hours", "Leather Photobooks", "Pan-India Travel"],
          priceRange: "₹₹₹ (Premium)",
          services: ["Candid Photography", "Cinematic 4K Video", "Pre-Wedding Shoots", "Maternity Shoots"],
        },
        tags: ["Award Winning", "Drone Licensed", "Verified", "Top Rated"],
      },
      // 5. Electricians
      {
        name: "VoltSafe Certified Domestic & Industrial Electricians",
        catName: "Repairs & Services",
        subName: "Electricians",
        providerIndex: 7,
        ratings: { overall: 4.7, total: 198 },
        operatingHours: "24/7 Emergency Response",
        extraInfo: "Government licensed wiremen. Instant arrival for short-circuit emergencies.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80", alt: "Electrical Panel Work" },
          ],
          totalPhotos: 8,
        },
        locationDetails: { address: "19 Anna Nagar 2nd Avenue", city: "Chennai", state: "Tamil Nadu", pincode: "600040" },
        contactDetails: { phone: "9876543227", email: "voltsafe@servizio.com", website: "https://voltsafe.in" },
        overview: {
          description: "Fast, reliable electrical services for residential apartments, villas, and commercial establishments. Heavy appliance wiring, MCB replacements, and Earthing solutions.",
          establishedYear: 2015,
          facilities: ["24/7 Emergency Support", "Certified Technicians", "Upfront Pricing", "Safety First ISO"],
          priceRange: "₹₹ (Affordable)",
          services: ["Switchboard Repair", "Inverter & UPS Setup", "Full House Re-wiring", "Chandelier Fitting"],
        },
        tags: ["24/7 Available", "Verified", "Emergency Electrician"],
      },
      // 6. Packers & Movers
      {
        name: "SafeShift Inter-City Packers & Relocation Movers",
        catName: "Daily Needs",
        subName: "Packers & Movers",
        providerIndex: 8,
        ratings: { overall: 4.8, total: 420 },
        operatingHours: "06:00 AM - 10:00 PM",
        extraInfo: "Zero damage transit guarantee. 5-layer corrugated bubble packaging.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80", alt: "Safe Shifting Truck" },
          ],
          totalPhotos: 12,
        },
        locationDetails: { address: "77 Outer Ring Road, Marathahalli", city: "Bengaluru", state: "Karnataka", pincode: "560037" },
        contactDetails: { phone: "9876543228", email: "safeshift@servizio.com", website: "https://safeshiftmovers.com" },
        overview: {
          description: "Trusted packing and moving company with container trucks, professional handlers, electronic packing boxes, and comprehensive transit insurance.",
          establishedYear: 2014,
          facilities: ["Transit Insurance", "Live GPS Tracking", "Bubble Packing", "Free Storage up to 7 Days"],
          priceRange: "₹₹ (Competitive)",
          services: ["Household Shifting", "Corporate Office Relocation", "Two-Wheeler Transport", "Furniture Dismantling & Assembly"],
        },
        tags: ["Insured Transit", "Verified", "GPS Tracked"],
      },
      // 7. Home Cleaning
      {
        name: "SparkleClean Pro Home Deep Cleaning & Sanitization",
        catName: "Daily Needs",
        subName: "Home Cleaning",
        providerIndex: 5,
        ratings: { overall: 4.9, total: 265 },
        operatingHours: "08:00 AM - 08:00 PM",
        extraInfo: "Eco-friendly Taski chemicals. Kärcher steam vacuum extraction machines.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Deep Clean Machinery" },
          ],
          totalPhotos: 15,
        },
        locationDetails: { address: "33 T. Nagar North Boag Road", city: "Chennai", state: "Tamil Nadu", pincode: "600017" },
        contactDetails: { phone: "9876543225", email: "sparkleclean@servizio.com", website: "https://sparklecleanpro.in" },
        overview: {
          description: "Top-rated professional home deep cleaning service. Complete kitchen oil degreasing, hard water stain removal from bathroom tiles, sofa shampooing, and balcony wash.",
          establishedYear: 2020,
          facilities: ["Kärcher Steam Cleaning", "Trained Staff", "Eco-friendly Chemicals", "Doorstep Service"],
          priceRange: "₹₹ (Moderate)",
          services: ["Full Villa Deep Cleaning", "Kitchen Degreasing", "Bathroom Acid-free Descaling", "Fabric Sofa Shampooing"],
        },
        tags: ["Verified", "Eco Friendly", "Steam Sanitized"],
      },
      // 8. Car Service
      {
        name: "AutoPro Multi-Brand Bosch Car Care Center",
        catName: "Repairs & Services",
        subName: "Car Service",
        providerIndex: 4,
        ratings: { overall: 4.8, total: 215 },
        operatingHours: "08:30 AM - 08:30 PM",
        extraInfo: "Free pick up and drop across Coimbatore. Bosch computerized diagnostic scanning.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80", alt: "Car Lift Inspection" },
          ],
          totalPhotos: 16,
        },
        locationDetails: { address: "52 Avinashi Road, Peelamedu", city: "Coimbatore", state: "Tamil Nadu", pincode: "641004" },
        contactDetails: { phone: "9876543224", email: "autopro@servizio.com", website: "https://autoprocare.in" },
        overview: {
          description: "Modern automated multi-brand car workshop. Periodic oil services, 3D laser wheel alignment, ceramic paint protection, dent repair, and cashless insurance claims.",
          establishedYear: 2017,
          facilities: ["Computerized Diagnostics", "Free Pickup & Drop", "Cashless Insurance", "Lounge with Wi-Fi"],
          priceRange: "₹₹ (Moderate)",
          services: ["General Service", "Brake Pad Replacement", "Air Conditioning Overhaul", "Teflon & Ceramic Coating"],
        },
        tags: ["Bosch Certified", "Verified", "Free Pickup"],
      },
    ];

    for (let item of sampleBusinesses) {
      const cat = createdBusinessCategories.find((c) => c.mainCategory === item.catName);
      const sub = cat.subCategories.find((s) => s.title === item.subName);
      const provider = providerAccounts[item.providerIndex % providerAccounts.length];

      await BusinessList.create({
        name: item.name,
        providerId: provider._id,
        mainCategoryId: cat._id,
        subCategoryId: sub._id,
        ratings: item.ratings,
        status: "Verified",
        claimed: true,
        isOpen: true,
        operatingHours: item.operatingHours,
        extraInfo: item.extraInfo,
        media: item.media,
        locationDetails: item.locationDetails,
        contactDetails: item.contactDetails,
        overview: item.overview,
        tags: item.tags,
      });

    }

    // 5. Guides
    console.log("Seeding Practical Consumer Service Guides...");
    const sampleGuides = [
      {
        title: "How to Pick the Best AC Service Technician & Avoid Overcharging",
        imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "10 Essential Questions to Ask Your Wedding Photographer Before Booking",
        imageUrl: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Complete Banquet Hall Checklist: AC, Capacity, Generator & Parking",
        imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80",
      },
      {
        title: "Smooth Shifting Checklist: How to Protect Fragile Items During Relocation",
        imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80",
      },
    ];
    await Guide.insertMany(sampleGuides);

    console.log("\n=================================================================");
    console.log("🚀 SERVIZIO SERVICE PROVIDER PLATFORM SEEDED SUCCESSFULLY!");
    console.log("=================================================================");
    console.log("Categories Seeded: 4 Major Service Verticals (Weddings, Repairs, Beauty & Spa, Daily Needs)");
    console.log("Subcategories:     19 Granular Service Segments with Icons & Images");
    console.log("Business Listings: 8 Verified Premier Service Centers with Full Details");
    console.log("Guides Seeded:     4 Local Service Guides");
    console.log("Accounts Active:   Super Admin, Verified Providers, and Renter/Customer");
    console.log("=================================================================");
    console.log("Demo Credentials:");
    console.log("👉 Admin:    admin@example.com    | Password: SuperAdmin@123");
    console.log("👉 Provider: provider@example.com | Password: Provider@123");
    console.log("👉 Customer: user@example.com     | Password: User@123");
    console.log("=================================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Service Platform Seed Error:", err);
    process.exit(1);
  }
};

seedServicePlatform();
