const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const Service = require("../models/EquipmentCategory");
const UserList = require("../models/EquipmentListing");
const BusinessCategory = require("../models/EquipmentDepotCategory");
const BusinessList = require("../models/EquipmentDepotListing");
const Guide = require("../models/Guide");
const User = require("../models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/servizio";

async function seedData() {
  try {
    console.log("Connecting to MongoDB:", MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data in target collections
    console.log("Clearing existing data...");
    await Service.deleteMany({});
    await UserList.deleteMany({});
    await BusinessCategory.deleteMany({});
    await BusinessList.deleteMany({});
    await Guide.deleteMany({});

    console.log("Seeding Equipment Services & Subcategories...");

    // 1. SERVICES (EQUIPMENT CATEGORIES)
    const equipmentCategoriesData = [
      {
        title: "Construction & Heavy Machinery",
        description: "Rent earthmoving machinery, excavators, concrete mixers, cranes, and compaction equipment for all project sizes.",
        homeImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80",
        tagarr: ["Excavator", "Bulldozer", "Concrete Mixer", "Crane", "Scaffolding", "Compactor"],
        topservices: [
          { name: "Caterpillar Excavators", icon: "🚜" },
          { name: "Mobile Cranes", icon: "🏗️" },
          { name: "Concrete Pumps", icon: "⚙️" },
          { name: "Soil Compactors", icon: "🚚" }
        ],
        faqarr: [
          { question: "Are operators provided with heavy machinery rentals?", answer: "Yes, certified operators can be included upon request with daily rental packages." },
          { question: "Is delivery and pickup included in the rental price?", answer: "Transportation costs are calculated based on site location and equipment size." }
        ],
        subcategories: [
          {
            title: "Hydraulic Excavators & Diggers",
            description: "Heavy excavators from CAT, Komatsu, and JCB suitable for trenching, foundation digging, and demolition.",
            image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "20-Ton Crawler Excavator", icon: "🚜" },
              { name: "Mini Excavator 3.5T", icon: "🛠️" }
            ]
          },
          {
            title: "Concrete Mixers & Batching Equipment",
            description: "Transit mixers, self-loading concrete mixers, and batching plants for construction sites.",
            image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "Self-Loading Mixer 4m³", icon: "🚚" },
              { name: "Portable Mixer Machine", icon: "⚡" }
            ]
          },
          {
            title: "Mobile Cranes & Aerial Platforms",
            description: "Hydraulic cranes, boom lifts, and scissor lifts for high-elevation construction and material lifting.",
            image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "50-Ton Telescopic Crane", icon: "🏗️" },
              { name: "45ft Articulated Boom Lift", icon: "🪜" }
            ]
          }
        ]
      },
      {
        title: "Audio, Visual & Cinema Gear",
        description: "Professional camera bodies, lenses, cinema lighting kits, audio systems, and drones for shoots and events.",
        homeImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
        tagarr: ["RED Cinema", "Sony FX6", "Aputure Lights", "DJI Drones", "Sennheiser Mics"],
        topservices: [
          { name: "4K Cinema Cameras", icon: "📹" },
          { name: "Studio Lighting Kits", icon: "💡" },
          { name: "Wireless Mic Systems", icon: "🎙️" }
        ],
        faqarr: [
          { question: "Can I rent lenses separately without camera bodies?", answer: "Yes, all prime and zoom lenses are available for individual daily rental." },
          { question: "Is camera insurance mandatory?", answer: "Basic equipment protection is included; optional full zero-liability coverage is available." }
        ],
        subcategories: [
          {
            title: "Cinema & Mirrorless Cameras",
            description: "Sony FX3/FX6, RED Komodo, Canon R5 C, and ARRI Alexa Mini systems for film productions and commercial shoots.",
            image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "Sony FX6 Cinema Line", icon: "📷" },
              { name: "RED Komodo 6K Rig", icon: "🎬" }
            ]
          },
          {
            title: "COB & RGB Studio Lighting",
            description: "Aputure 600d, Nanlite Pavotubes, ARRI SkyPanels, and softbox accessories for photo and video setups.",
            image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "Aputure 600x Pro Light Kit", icon: "💡" },
              { name: "RGB LED Tube Lights (4-Pack)", icon: "✨" }
            ]
          },
          {
            title: "Aerial Drones & Gimbals",
            description: "DJI Inspire 3, Mavic 3 Pro Cine, Ronin RS3 Pro gimbals, and FPV drone setups with licensed operators.",
            image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "DJI Mavic 3 Cine Combo", icon: "🚁" },
              { name: "DJI RS3 Pro Gimbal Stabilizer", icon: "🎥" }
            ]
          }
        ]
      },
      {
        title: "Event Sound & Stage Equipment",
        description: "PA systems, DJ equipment, stage trusses, LED screens, and silent generator power for events and concerts.",
        homeImage: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80",
        tagarr: ["Line Array", "Pioneer DJ", "LED Video Wall", "Stage Trusses", "Generator"],
        topservices: [
          { name: "JBL Line Array Speakers", icon: "🔊" },
          { name: "Pioneer CDJ-3000 Rig", icon: "🎧" },
          { name: "Outdoor LED Screens", icon: "🖥️" }
        ],
        faqarr: [
          { question: "Do you offer sound technician support during the event?", answer: "Yes, sound engineers and stage technicians are available for on-site management." }
        ],
        subcategories: [
          {
            title: "Concert PA Systems & Speakers",
            description: "JBL, L-Acoustics, and RCF line array speakers, subwoofers, and digital mixing consoles.",
            image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "10,000W Outdoor PA System", icon: "🔊" },
              { name: "Behringer X32 Digital Console", icon: "🎛️" }
            ]
          },
          {
            title: "Professional DJ Gear & Decks",
            description: "Pioneer CDJ-3000, DJM-A9 mixers, Technics turntables, and monitor speakers for festivals and clubs.",
            image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "Pioneer CDJ-3000 (Pair) + DJM-A9", icon: "🎧" }
            ]
          }
        ]
      },
      {
        title: "Industrial & Power Tools",
        description: "Demolition hammers, portable generators, air compressors, pressure washers, and welding machines.",
        homeImage: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
        tagarr: ["DeWalt", "Bosch", "Generator", "Compressor", "Welding Rig"],
        topservices: [
          { name: "Silent Diesel Generators", icon: "⚡" },
          { name: "Jackhammers & Breakers", icon: "🔨" }
        ],
        faqarr: [
          { question: "Are power tools delivered fully charged with extra batteries?", answer: "All cordless equipment includes 2+ fully charged high-capacity batteries and fast chargers." }
        ],
        subcategories: [
          {
            title: "Portable Power Generators",
            description: "Silent 5kVA to 125kVA diesel and petrol generators for outdoor jobs, events, and emergency backup.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "62.5 kVA Silent Diesel Generator", icon: "⚡" },
              { name: "Honda 5kVA Portable Generator", icon: "🔌" }
            ]
          },
          {
            title: "Heavy Duty Power & Demolition Tools",
            description: "Bosch demolition hammers, DeWalt impact drivers, STIHL cut-off saws, and concrete core drills.",
            image: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=80",
            topservices: [
              { name: "Bosch 16kg Jackhammer", icon: "🔨" },
              { name: "Hilti Core Drilling Machine", icon: "⚙️" }
            ]
          }
        ]
      }
    ];

    const insertedServices = await Service.insertMany(equipmentCategoriesData);
    console.log(`Inserted ${insertedServices.length} main equipment categories.`);

    // 2. USERLIST (EQUIPMENT LISTINGS / OWNER PROFILES)
    console.log("Seeding Equipment Listings (UserList)...");
    const userListItems = [
      {
        name: "Metro Heavy Rental Hub",
        username: "metro_machinery",
        serviceId: insertedServices[0]._id,
        subcategoryId: insertedServices[0].subcategories[0]._id,
        description: "20-Ton CAT 320 Hydraulic Excavator available for daily, weekly, and monthly project rentals. Comes with heavy digging bucket and breaker piping.",
        price: 4500, // per day
        rating: 4.9,
        completedProjects: 142,
        skills: ["CAT 320", "Hydraulic Breaker Attachment", "GPS Tracking", "Operator Available"],
        image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 8,
        availability: "Available",
        phone: "+91 9876543210",
        email: "rentals@metroheavy.com",
        reviews: [
          { reviewer: "Karthik Construction", comment: "Excellent machine condition and timely site delivery!", rating: 5 },
          { reviewer: "Apex Infra", comment: "Reliable operator and smooth excavation performance.", rating: 5 }
        ]
      },
      {
        name: "Apex Lift & Crane Services",
        username: "apex_cranes",
        serviceId: insertedServices[0]._id,
        subcategoryId: insertedServices[0].subcategories[2]._id,
        description: "50-Ton XCMG Telescopic Mobile Crane with certified rigger and operator. Ideal for high-rise steel structure lifting and heavy equipment positioning.",
        price: 8500,
        rating: 4.8,
        completedProjects: 98,
        skills: ["50T Telescopic Boom", "Certified Operator", "Load Indicator System", "24/7 Site Support"],
        image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80",
        location: "Coimbatore, Tamil Nadu",
        experience: 12,
        availability: "Available",
        phone: "+91 9842109876",
        email: "bookings@apexcranes.in",
        reviews: [
          { reviewer: "Southern Builders", comment: "Top quality crane with all safety certifications.", rating: 5 }
        ]
      },
      {
        name: "CineGears Pro Camera Rentals",
        username: "cinegears_pro",
        serviceId: insertedServices[1]._id,
        subcategoryId: insertedServices[1].subcategories[0]._id,
        description: "Sony FX6 Cinema Line Full-Frame Camera Package with 24-70mm f/2.8 GM Lens, V-mount batteries, CFexpress cards, and Miller Carbon Tripod.",
        price: 3200,
        rating: 5.0,
        completedProjects: 215,
        skills: ["Sony FX6 4K", "Sony 24-70 GM II", "2x 150Wh V-Mounts", "CFexpress 160GB"],
        image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80",
        location: "Madurai, Tamil Nadu",
        experience: 6,
        availability: "Available",
        phone: "+91 9789012345",
        email: "hello@cinegearspro.com",
        reviews: [
          { reviewer: "Vikram Films", comment: "Immaculate sensor condition, batteries held charge perfectly throughout shoot.", rating: 5 }
        ]
      },
      {
        name: "ProLight & FX Rentals",
        username: "prolight_fx",
        serviceId: insertedServices[1]._id,
        subcategoryId: insertedServices[1].subcategories[1]._id,
        description: "Aputure 600x Pro Bi-Color LED Monolight Kit with F10 Fresnel, Light Dome III softbox, and C-stands.",
        price: 1800,
        rating: 4.7,
        completedProjects: 87,
        skills: ["Aputure 600x Pro", "F10 Fresnel Lens", "Softbox & Grid", "Avenger Heavy C-Stand"],
        image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 5,
        availability: "Available",
        phone: "+91 9123456789",
        email: "info@prolightfx.in",
        reviews: [
          { reviewer: "Studio Pixel", comment: "Super bright light kit, setup was seamless.", rating: 5 }
        ]
      },
      {
        name: "SoundStorm Audio & Stage Solutions",
        username: "soundstorm_audio",
        serviceId: insertedServices[2]._id,
        subcategoryId: insertedServices[2].subcategories[0]._id,
        description: "10,000W JBL VRX Line Array Sound System with dual 18-inch powered subwoofers, digital mixer, and wireless microphone setup.",
        price: 12000,
        rating: 4.9,
        completedProjects: 165,
        skills: ["JBL VRX 932LAP", "Dual 18 Subwoofers", "Sound Engineer Included", "Sennheiser EW-D Mics"],
        image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&auto=format&fit=crop&q=80",
        location: "Kovilpatti, Tamil Nadu",
        experience: 10,
        availability: "Available",
        phone: "+91 9443210987",
        email: "events@soundstorm.in",
        reviews: [
          { reviewer: "College Fest Commitee", comment: "The sound clarity was unmatched! Handled 3000+ crowd effortlessly.", rating: 5 }
        ]
      },
      {
        name: "PowerGrid Generators & Tools",
        username: "powergrid_tools",
        serviceId: insertedServices[3]._id,
        subcategoryId: insertedServices[3].subcategories[0]._id,
        description: "62.5 kVA Silent Cummins Diesel Generator with automatic transfer switch and cables. Fuel delivery option available.",
        price: 3500,
        rating: 4.8,
        completedProjects: 310,
        skills: ["Cummins Engine", "Acoustic Enclosure (Silent)", "Auto Start Unit", "Diesel Delivery Support"],
        image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
        location: "Tirunelveli, Tamil Nadu",
        experience: 15,
        availability: "Available",
        phone: "+91 9360123456",
        email: "powergrid@rentals.com",
        reviews: [
          { reviewer: "Grand Palace Marriage Hall", comment: "Ran non-stop for 18 hours without any glitch. Very low noise level.", rating: 5 }
        ]
      }
    ];

    const insertedUserList = await UserList.insertMany(userListItems);
    console.log(`Inserted ${insertedUserList.length} equipment listings.`);

    // 3. BUSINESS CATEGORIES & BUSINESSLIST (RENTAL HUBS & STORES)
    console.log("Seeding Equipment Rental Business Directory...");
    const businessCatData = {
      mainCategory: "Equipment Rental Outlets & Machinery Depots",
      description: "Find verified equipment rental stores, machinery yards, camera rental houses, and tool hire centers near you.",
      homeImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      subCategories: [
        {
          title: "Heavy Equipment Rental Depots",
          description: "Yards offering excavators, loaders, cranes, and compaction rollers for hire.",
          image: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80"
        },
        {
          title: "Camera & AV Equipment Rental Houses",
          description: "Rental studios for high-end digital cinema cameras, lenses, lighting, and sound gear.",
          image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80"
        },
        {
          title: "Power Tool & Generator Hire Centers",
          description: "Local stores providing jackhammers, drills, generators, and welding units.",
          image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=600&auto=format&fit=crop&q=80"
        }
      ]
    };

    const insertedBusCat = await BusinessCategory.create(businessCatData);
    console.log("Inserted Business Category:", insertedBusCat.mainCategory);

    // Dummy user for providerId reference
    let dummyUser = await User.findOne({});
    if (!dummyUser) {
      dummyUser = await User.create({
        username: "admin_equipment",
        email: "admin@servizioequipment.com",
        password: "hashedpassword123",
        role: "Provider"
      });
    }

    const businessListItems = [
      {
        name: "Servizio Heavy Equipment Hub - South Yard",
        providerId: dummyUser._id,
        mainCategoryId: insertedBusCat._id,
        subCategoryId: insertedBusCat.subCategories[0]._id,
        ratings: { overall: 4.9, total: 84 },
        status: "Verified",
        claimed: true,
        isOpen: true,
        operatingHours: "07:00 AM - 08:00 PM (Mon - Sat)",
        extraInfo: "Same-day site delivery, ISO 9001 certified machinery maintenance.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80", alt: "Depot Yard" },
            { url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80", alt: "Excavators Fleet" }
          ],
          totalPhotos: 12
        },
        overview: {
          description: "Servizio Heavy Equipment Hub is Tamil Nadu's premier heavy machinery rental depot. We supply top-tier excavators, cranes, loaders, and concrete mixers to infrastructure contractors.",
          establishedYear: 2012,
          facilities: ["On-Site Field Repairs", "Certified Operators", "Lowbed Trailer Transport", "GPS Machine Monitoring"],
          priceRange: "₹2,500 - ₹25,000 / day",
          openingHours: "07:00 AM - 08:00 PM",
          closedDays: "Sunday",
          website: "https://servizioequipment.com",
          email: "yard@servizioequipment.com",
          faq: [
            { q: "What documents are required to rent heavy equipment?", a: "Company GST registration, PO order, and security deposit agreement." },
            { q: "Do you supply fuel for generators and excavators?", a: "Dry rate (without fuel) and wet rate (with fuel) packages are available." }
          ],
          services: ["Excavator Rental", "Mobile Crane Hire", "Scaffolding Systems", "Compactor Rental"]
        },
        locationDetails: {
          address: "124 Bypass Highway Industrial Estate",
          area: "K.R. Nagar",
          city: "Kovilpatti",
          pincode: "628503",
          landmark: "Near National Engineering College Campus",
          mapLink: "https://maps.google.com"
        },
        contactDetails: {
          phone: "+91 9876543210",
          whatsapp: "+91 9876543210",
          email: "contact@servizioequipment.com",
          ownerName: "Muthuramalingam A",
          verified: true,
          gstin: "33ABCDE1234F1Z5"
        },
        highlights: ["Instant Machine Booking", "Zero Break Down Guarantee", "Govt Certified Operators"],
        tags: ["Excavator", "Crane", "Heavy Machinery", "Kovilpatti Rental"]
      },
      {
        name: "CineRental AV & Camera Studio",
        providerId: dummyUser._id,
        mainCategoryId: insertedBusCat._id,
        subCategoryId: insertedBusCat.subCategories[1]._id,
        ratings: { overall: 4.8, total: 62 },
        status: "Verified",
        claimed: true,
        isOpen: true,
        operatingHours: "09:00 AM - 09:00 PM (Daily)",
        extraInfo: "High speed lens testing bench & camera prep bays on premises.",
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80", alt: "Camera Bay" }
          ],
          totalPhotos: 8
        },
        overview: {
          description: "Full service camera house offering RED, Sony Cinema, ARRI, Aputure lighting, and DJI professional aerial drones.",
          establishedYear: 2018,
          facilities: ["Camera Checkout Bays", "Sensor Cleaning", "Flight Case Delivery"],
          priceRange: "₹1,000 - ₹15,000 / day",
          openingHours: "09:00 AM - 09:00 PM",
          closedDays: "None",
          website: "https://cinerentalstudio.in",
          email: "rentals@cinerentalstudio.in",
          faq: [
            { q: "Is assistant camera personnel available?", a: "Yes, certified Camera Attendants (1st/2nd AC) can accompany rental gear." }
          ],
          services: ["Sony FX6 Rental", "Aputure 600d Lighting", "DJI Mavic 3 Drone", "Wireless Video Transmitters"]
        },
        locationDetails: {
          address: "45 Media Hub Avenue",
          area: "Anna Nagar",
          city: "Chennai",
          pincode: "600040",
          landmark: "Opposite Metro Station",
          mapLink: "https://maps.google.com"
        },
        contactDetails: {
          phone: "+91 9444012345",
          whatsapp: "+91 9444012345",
          email: "support@cinerentalstudio.in",
          ownerName: "Ajay Kumar K L",
          verified: true
        },
        highlights: ["4K & 8K Cinema Gear", "Sanitized Equipment Cases", "Student Filmmaker Discount"],
        tags: ["Camera Rental", "Sony FX6", "Cinema Lighting", "Chennai"]
      }
    ];

    const insertedBusList = await BusinessList.insertMany(businessListItems);
    console.log(`Inserted ${insertedBusList.length} equipment business outlets.`);

    // 4. GUIDES
    console.log("Seeding Equipment Rental Guides & Safety Tips...");
    const guideItems = [
      { title: "Heavy Machinery Site Checklist Before Renting", imageUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=600&auto=format&fit=crop&q=80" },
      { title: "How to Choose the Right Cinema Camera & Lens Package", imageUrl: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80" },
      { title: "Generator Sizing Guide for Events & Construction Sites", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80" }
    ];
    await Guide.insertMany(guideItems);
    console.log("Inserted equipment rental guides.");

    console.log("\n✅ ALL EQUIPMENT RENTAL SEED DATA INSERTED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding equipment rental data:", err);
    process.exit(1);
  }
}

seedData();
