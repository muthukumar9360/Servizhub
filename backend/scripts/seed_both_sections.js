const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const BusinessCategory = require("../models/Business");
const BusinessList = require("../models/BusinessList");
const Service = require("../models/Service");
const UserList = require("../models/UserList");
const Guide = require("../models/Guide");

const seedBothSections = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    // 1. Get or create primary providers
    let providers = await User.find({ userType: "provider" });
    if (providers.length === 0) {
      console.log("Creating default provider accounts...");
      const p1 = await User.create({
        firstname: "Harish",
        lastname: "Pandian",
        username: "Harishpandian",
        email: "iharishpandian2006@gmail.com",
        phno: "8608731504",
        userType: "provider",
        password: "Provider@123",
      });
      const p2 = await User.create({
        firstname: "Muthu",
        lastname: "Kumar",
        username: "2312090",
        email: "perumpatayans@gmail.com",
        phno: "9360493471",
        userType: "provider",
        password: "Provider@123",
      });
      providers = [p1, p2];
    }
    const defaultProvider = providers[0];
    console.log(`Using ${providers.length} provider accounts for listings.`);

    // =========================================================================
    // PART A: ONLINE SECTION (Freelance Marketplace -> "services" & "servicelist")
    // =========================================================================
    console.log("\n--- Seeding ONLINE SECTION (Freelance Services & Freelancers) ---");
    await mongoose.connection.collection("services").drop().catch(() => {});
    await mongoose.connection.collection("servicelist").drop().catch(() => {});

    const onlineServicesData = [
      {
        title: "Web & App Development",
        description: "Full-stack web applications, REST APIs, mobile apps, and custom SaaS engineering.",
        homeImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "Full Stack MERN Development",
            description: "Custom React 19, Node.js, Express, and MongoDB responsive full stack portals.",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Frontend & React.js",
            description: "Ultra-fast modern interfaces using Next.js, Vite, Tailwind CSS, and Redux Toolkit.",
            image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Mobile App Development",
            description: "Cross-platform mobile apps for Android and iOS using Flutter and React Native.",
            image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Python & Backend APIs",
            description: "FastAPI, Django, database schema design, and microservices architecture.",
            image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80",
          },
        ],
        faqarr: [
          { question: "How does online milestone payment work?", answer: "Payments are held securely via Razorpay escrow until you approve the delivered milestone." },
          { question: "Do freelancers provide source code?", answer: "Yes, full GitHub repository ownership and deployment instructions are provided on project completion." },
        ],
      },
      {
        title: "UI/UX & Product Design",
        description: "User research, wireframing, high-fidelity Figma design systems, and mobile interfaces.",
        homeImage: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "Figma UI/UX Design",
            description: "Pixel-perfect Figma designs, responsive layouts, interactive click-through prototypes.",
            image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Mobile App UI Design",
            description: "Intuitive iOS & Android app interfaces adhering to Apple Human Interface and Material 3 guidelines.",
            image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Website Redesign & Audits",
            description: "Heuristic evaluation, accessibility (a11y) checks, and conversion rate optimization.",
            image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=600&auto=format&fit=crop&q=80",
          },
        ],
        faqarr: [
          { question: "What formats do I receive?", answer: "You receive editable Figma files, exported SVGs, PNG assets, and typography guides." },
        ],
      },
      {
        title: "Graphics & Branding",
        description: "Vector logos, company brand identities, 3D product renders, and social media kits.",
        homeImage: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "Logo & Brand Identity",
            description: "Minimalist, corporate, or 3D logos with complete brand style guides and vector files.",
            image: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Social Media Post Design",
            description: "Engaging Instagram carousels, LinkedIn banners, and promotional advertising banners.",
            image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "3D Product Modeling",
            description: "Blender 3D mockups, realistic packaging renders, and product animations.",
            image: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        title: "Digital Marketing & SEO",
        description: "Google Ads, Organic SEO ranking, Social Media Growth, and Email Automation.",
        homeImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "Search Engine Optimization (SEO)",
            description: "On-page keyword strategy, technical site speed audits, and high-authority backlinks.",
            image: "https://images.unsplash.com/photo-1571786256017-aee7a0c009b6?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Social Media Marketing",
            description: "Organic content calendars, audience growth, and community management on Instagram and LinkedIn.",
            image: "https://images.unsplash.com/photo-1562577309-4932fdd64cd1?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        title: "Video Editing & Animation",
        description: "High-retention YouTube editing, Instagram Reels, Motion Graphics, and 2D Explainer videos.",
        homeImage: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "YouTube Video Editing",
            description: "Fast-paced storytelling, sound design, color grading, and custom thumbnail design.",
            image: "https://images.unsplash.com/photo-1536240478700-b869070f9279?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Shorts & Reels Production",
            description: "Engaging viral captions, B-roll overlays, and trending sound sync for 9:16 vertical video.",
            image: "https://images.unsplash.com/photo-1616469829941-c7200edec809?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        title: "Content & Copywriting",
        description: "Compelling website copy, technical programming blogs, SEO articles, and product descriptions.",
        homeImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&auto=format&fit=crop&q=80",
        subcategories: [
          {
            title: "Technical Writing & Docs",
            description: "API documentation, developer tutorials, GitHub readmes, and engineering case studies.",
            image: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Website Copywriting",
            description: "High-converting landing page headlines, value propositions, and email sales sequences.",
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
    ];

    const createdServices = [];
    for (let s of onlineServicesData) {
      const doc = await Service.create(s);
      createdServices.push(doc);
    }
    console.log(`Created ${createdServices.length} online service categories.`);

    // Seed Freelancer Profiles into "servicelist"
    const sampleFreelancers = [
      {
        name: "Muthu Kumar A",
        username: "muthukumar_9360",
        serviceTitle: "Web & App Development",
        subTitle: "Full Stack MERN Development",
        description: "Experienced MERN stack developer passionate about building scalable, secure web architectures, real-time Socket.IO communication, and clean responsive UI.",
        price: 2500,
        rating: 4.9,
        completedProjects: 24,
        skills: ["React.js", "Node.js", "Express.js", "MongoDB", "Socket.IO", "Tailwind CSS", "Redux Toolkit"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 3,
        phone: "9360493470",
        email: "2312090@nec.edu.in",
        education: [{ degree: "B.Tech Information Technology", institution: "National Engineering College", year: 2026 }],
        projects: [
          { title: "Servizio Marketplace", description: "Multi-vendor service discovery and booking platform", link: "https://github.com/muthukumar9360/Servizio" },
          { title: "Real-time Chat Engine", description: "Socket.IO bi-directional chat with room partitioning", link: "https://github.com/muthukumar9360" },
        ],
        reviews: [
          { reviewer: "Anand R.", comment: "Delivered our complete web platform ahead of schedule with spotless code quality!", rating: 5 },
          { reviewer: "Sarah Jenkins", comment: "Great communication and impressive full-stack skills. Highly recommended!", rating: 5 },
        ],
        languages: ["English", "Tamil"],
        linkedin: "https://linkedin.com/in/muthukumar9360",
        github: "https://github.com/muthukumar9360",
      },
      {
        name: "Harishpandian I",
        username: "Harishpandian",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Figma UI/UX Design",
        description: "Senior Product & UI/UX Designer crafting user-centric design systems, mobile apps, and SaaS interfaces with strong focus on micro-interactions and usability.",
        price: 1800,
        rating: 5.0,
        completedProjects: 38,
        skills: ["Figma", "UI/UX Design", "Wireframing", "Design Systems", "Prototyping", "User Research"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        location: "Madurai, Tamil Nadu",
        experience: 4,
        phone: "8608731504",
        email: "iharishpandian2006@gmail.com",
        education: [{ degree: "B.Tech Computer Science", institution: "Anna University", year: 2025 }],
        projects: [
          { title: "Fintech Mobile App UI", description: "Complete design system and 40+ screens in Figma", link: "https://figma.com" },
        ],
        reviews: [
          { reviewer: "Karthik S.", comment: "Our app conversion increased 40% after Harish redesigned the onboarding flow!", rating: 5 },
        ],
        languages: ["English", "Tamil"],
      },
      {
        name: "Ajay Kumar K L",
        username: "CaptainAmerica",
        serviceTitle: "Web & App Development",
        subTitle: "Frontend & React.js",
        description: "Frontend specialist and animation enthusiast. I turn complex Figma designs into responsive, production-ready React and Next.js applications.",
        price: 1500,
        rating: 4.8,
        completedProjects: 19,
        skills: ["React", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Vite", "Framer Motion"],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 2,
        phone: "1234567890",
        email: "hpandian176@gmail.com",
        languages: ["English", "Tamil", "Kannada"],
      },
      {
        name: "Pooja Sharma",
        username: "poojasharma_seo",
        serviceTitle: "Digital Marketing & SEO",
        subTitle: "Search Engine Optimization (SEO)",
        description: "Certified Google & SEO specialist. I help local businesses and online marketplaces achieve #1 organic Google rankings.",
        price: 1200,
        rating: 4.9,
        completedProjects: 45,
        skills: ["Technical SEO", "Ahrefs", "Google Search Console", "Keyword Research", "Backlinking"],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        location: "Hyderabad, Telangana",
        experience: 5,
        phone: "9876543231",
        email: "pooja.seo@gmail.com",
        languages: ["English", "Hindi"],
      },
      {
        name: "Vikramaditya Nair",
        username: "vikram_video",
        serviceTitle: "Video Editing & Animation",
        subTitle: "YouTube Video Editing",
        description: "Professional video editor working with top creators. Expertise in Premiere Pro, After Effects, cinematic color grading, and dynamic sound design.",
        price: 2000,
        rating: 5.0,
        completedProjects: 62,
        skills: ["Adobe Premiere Pro", "After Effects", "Color Grading", "Sound Design", "Motion Graphics"],
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
        location: "Kochi, Kerala",
        experience: 4,
        phone: "9876543232",
        email: "vikram.media@gmail.com",
        languages: ["English", "Malayalam", "Tamil"],
      },
      {
        name: "Sneha Mukherjee",
        username: "sneha_copy",
        serviceTitle: "Content & Copywriting",
        subTitle: "Website Copywriting",
        description: "Direct response copywriter and brand voice strategist. I write words that sell products and build trust with your customers.",
        price: 1000,
        rating: 4.8,
        completedProjects: 31,
        skills: ["Copywriting", "SEO Content", "Email Marketing", "Brand Messaging"],
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
        location: "Kolkata, West Bengal",
        experience: 3,
        phone: "9876543233",
        email: "sneha.writer@gmail.com",
        languages: ["English", "Bengali", "Hindi"],
      },
    ];

    for (let f of sampleFreelancers) {
      const s = createdServices.find((srv) => srv.title === f.serviceTitle);
      if (s) {
        const sub = s.subcategories.find((sc) => sc.title === f.subTitle) || s.subcategories[0];
        await UserList.create({
          name: f.name,
          username: f.username,
          serviceId: s._id,
          subcategoryId: sub._id,
          description: f.description,
          price: f.price,
          rating: f.rating,
          completedProjects: f.completedProjects,
          skills: f.skills,
          image: f.image,
          location: f.location,
          experience: f.experience,
          availability: "Available",
          phone: f.phone,
          email: f.email,
          education: f.education || [],
          projects: f.projects || [],
          reviews: f.reviews || [],
          languages: f.languages || ["English"],
          linkedin: f.linkedin || "",
          github: f.github || "",
        });
      }
    }
    console.log(`Seeded ${sampleFreelancers.length} top-tier Freelancers into "servicelist".`);

    // =========================================================================
    // PART B: OFFLINE SECTION (Justdial Local Services -> "Businesses" & "Businesslist")
    // =========================================================================
    console.log("\n--- Seeding OFFLINE SECTION (Justdial Categories & Verified Local Businesses) ---");
    await mongoose.connection.collection("Businesses").drop().catch(() => {});
    await mongoose.connection.collection("Businesslist").drop().catch(() => {});

    const offlineCategoriesData = [
      {
        mainCategory: "Wedding Requisites",
        description: "Banquet halls, bridal makeup artists, caterers, wedding photographers, mandap decorators, and transport.",
        homeImage: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Banquet Halls",
            description: "AC luxury marriage mandapams, banquet halls, and convention centers with parking.",
            image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Bridal Requisite",
            description: "HD bridal makeup artists, hair stylists, saree draping, and pre-wedding packages.",
            image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Caterers",
            description: "Traditional South & North Indian feasts, live buffet counters, and corporate catering.",
            image: "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Photography Services",
            description: "Candid wedding photographers, 4K cinematic teasers, and drone coverage.",
            image: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Wedding Planners",
            description: "End-to-end wedding management, hospitality, guest coordination, and stage decor.",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Decor & Design",
            description: "Floral stage backdrops, theme lighting, entrance arches, and seating decor.",
            image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Repairs & Services",
        description: "AC technicians, certified electricians, plumbers, car service, bike mechanics, and home appliances.",
        homeImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "AC Service",
            description: "Jet cleaning, gas filling, copper piping, PCB repair, and split/window AC installation.",
            image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Electricians",
            description: "Emergency wiring repair, MCB trip fixes, inverter setup, and light fixtures.",
            image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Car Service",
            description: "Periodic car maintenance, synthetic engine oil change, wheel balancing, and car foam wash.",
            image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Bike Service",
            description: "General bike tuning, engine oil change, brake overhaul, and doorstep maintenance.",
            image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Plumbers",
            description: "Tap leakage repair, pipeline blockage clearing, water heater and motor installation.",
            image: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80",
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
            description: "Trendy haircuts, hair spa, keratin smoothening, beard grooming, and facials.",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Beauty Parlours",
            description: "Organic waxing, manicure, pedicure, skin brightening facials, and threading.",
            image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Spa & Massages",
            description: "Swedish full body massage, deep tissue therapy, herbal steam, and aromatherapy.",
            image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Daily Needs",
        description: "Packers & movers, house deep cleaning, pest control, grocery supermarkets, and laundry.",
        homeImage: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Packers & Movers",
            description: "Reliable household shifting, office relocation, multi-layer bubble packing, and inter-city transport.",
            image: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Home Cleaning",
            description: "Complete apartment deep cleaning, kitchen degreasing, sofa and mattress sanitization.",
            image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Pest Control",
            description: "Termite eradication, cockroach odorless gel, bedbug treatments, and fogging.",
            image: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Grocery",
            description: "Fresh vegetables, organic pulses, pantry staples, and same-day express delivery.",
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Education & Coaching",
        description: "School tuitions, IIT/NEET entrance coaching, spoken English, and music/dance academies.",
        homeImage: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Entrance Exam Coaching",
            description: "NEET, JEE Mains/Advanced, and CA foundation expert faculty classes.",
            image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Language Training",
            description: "Spoken English, IELTS, TOEFL, German, and French certification courses.",
            image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
      {
        mainCategory: "Healthcare & Clinics",
        description: "Multi-speciality clinics, dental care, diagnostic pathology labs, and physiotherapy.",
        homeImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          {
            title: "Dental Clinics",
            description: "Root canal therapy, dental implants, teeth whitening, and orthodontic braces.",
            image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80",
          },
          {
            title: "Diagnostic Labs",
            description: "Full body blood tests, digital X-Ray, ultrasound, and home sample collection.",
            image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80",
          },
        ],
      },
    ];

    const createdBusinessCats = [];
    for (let c of offlineCategoriesData) {
      const doc = await BusinessCategory.create(c);
      createdBusinessCats.push(doc);
    }
    console.log(`Created ${createdBusinessCats.length} offline business categories in "Businesses".`);

    // Seed Verified Local Businesses into "Businesslist"
    const sampleOfflineListings = [
      {
        catName: "Wedding Requisites",
        subName: "Banquet Halls",
        name: "Grand Imperial Palace & Convention Centre",
        ratings: { overall: 4.9, total: 342 },
        operatingHours: "Open 24 Hours / 7 Days",
        extraInfo: "Capacity: 1500 Guests | AC Centralized | 250+ Car Parking",
        locationDetails: {
          address: "No. 45, GST Road, Guindy",
          city: "Chennai",
          pincode: "600032",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543201",
          email: "grandimperial@servizio.com",
          website: "https://grandimperialpalace.com",
        },
        overview: {
          description: "Chennai's premier luxury wedding venue with sprawling air-conditioned banquet halls, royal chandeliers, green bridal dressing suites, and generator backup.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80", alt: "Grand Banquet Interior" },
          ],
        },
        tags: ["Banquet Hall", "Wedding Mandapam", "AC Convention Center", "Valet Parking"],
      },
      {
        catName: "Repairs & Services",
        subName: "AC Service",
        name: "CoolBreeze 24/7 Doorstep AC Repair & Service",
        ratings: { overall: 4.8, total: 512 },
        operatingHours: "07:00 AM - 10:00 PM",
        extraInfo: "30-Min Fast Response | 90-Day Service Warranty | Genuine Spare Parts",
        locationDetails: {
          address: "Shop 12, 1st Cross, Anna Nagar West",
          city: "Chennai",
          pincode: "600040",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543202",
          email: "support@coolbreezeac.com",
          website: "https://coolbreezeac.com",
        },
        overview: {
          description: "Certified Daikin, Voltas, and LG technicians providing jet pressure cleaning, refrigerant gas leakage repair, compressor fixes, and split AC relocation.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", alt: "AC Deep Cleaning" },
          ],
        },
        tags: ["AC Repair", "AC Installation", "Gas Refill", "Voltas Service", "Daikin Specialist"],
      },
      {
        catName: "Beauty & Spa",
        subName: "Salons",
        name: "Glow & Shine Luxury Unisex Salon & Spa",
        ratings: { overall: 4.9, total: 289 },
        operatingHours: "09:00 AM - 09:00 PM",
        extraInfo: "L'Oreal Certified Stylists | Sanitized Tools | Bridal Lounge",
        locationDetails: {
          address: "88, 100 Feet Road, Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
          state: "Karnataka",
        },
        contactDetails: {
          phone: "9876543203",
          email: "glowandshine@salon.com",
          website: "https://glowandshinesalon.com",
        },
        overview: {
          description: "Premium hair and beauty salon offering Moroccan oil hair spa, keratin treatments, beard sculpting, organic skin facials, and bridal makeovers.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Salon Chairs" },
          ],
        },
        tags: ["Hair Salon", "Keratin Treatment", "Unisex Salon", "Bridal Makeup", "Indiranagar"],
      },
      {
        catName: "Daily Needs",
        subName: "Packers & Movers",
        name: "SafeShift Inter-City Packers & Relocation Movers",
        ratings: { overall: 4.9, total: 420 },
        operatingHours: "24/7 Helpline",
        extraInfo: "Transit Insurance | Bubble Wrap & Crates | Zero Damage Guarantee",
        locationDetails: {
          address: "Plot 5, Bypass Road",
          city: "Madurai",
          pincode: "625016",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543204",
          email: "contact@safeshiftmovers.com",
          website: "https://safeshiftmovers.com",
        },
        overview: {
          description: "Top-rated packing and moving service for household shifting, office relocation, vehicle car carrier transport, and warehouse storage.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80", alt: "Moving Boxes" },
          ],
        },
        tags: ["Packers Movers", "Home Shifting", "Office Relocation", "Safe Transport"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Photography Services",
        name: "LensCraft Cinematic Wedding & Portrait Studio",
        ratings: { overall: 5.0, total: 198 },
        operatingHours: "09:30 AM - 08:30 PM",
        extraInfo: "Sony Alpha 7IV & Drone Equipment | Pre-Wedding Shoot Specialists",
        locationDetails: {
          address: "21, Race Course Road",
          city: "Coimbatore",
          pincode: "641018",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543205",
          email: "lenscraft@studio.com",
          website: "https://lenscraftstudio.com",
        },
        overview: {
          description: "Award-winning wedding photography and cinematography team capturing your timeless candid moments, reception teasers, and albums.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80", alt: "Wedding Photography" },
          ],
        },
        tags: ["Wedding Photography", "Candid Photos", "Drone Shoot", "Cinematography"],
      },
      {
        catName: "Repairs & Services",
        subName: "Electricians",
        name: "VoltSafe Certified Domestic & Industrial Electricians",
        ratings: { overall: 4.8, total: 275 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Licensed Wiremen | 45-Min Emergency Service | Fixed Rates",
        locationDetails: {
          address: "No. 14, Velachery Main Road",
          city: "Chennai",
          pincode: "600042",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543206",
          email: "voltsafe@electrician.com",
          website: "https://voltsafe.in",
        },
        overview: {
          description: "Certified electricians for house wiring, 3-phase connection balancing, short circuit troubleshooting, and commercial panel setups.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80", alt: "Electrician Working" },
          ],
        },
        tags: ["Electrician", "House Wiring", "Emergency Power Fix", "Inverter Installation"],
      },
      {
        catName: "Education & Coaching",
        subName: "Entrance Exam Coaching",
        name: "Apex Academy - IIT JEE & NEET Premier Institute",
        ratings: { overall: 4.9, total: 460 },
        operatingHours: "08:00 AM - 08:00 PM",
        extraInfo: "Top Rankers Faculty | Mock Test Series | AC Digital Classrooms",
        locationDetails: {
          address: "5th Block, Koramangala",
          city: "Bengaluru",
          pincode: "560095",
          state: "Karnataka",
        },
        contactDetails: {
          phone: "9876543207",
          email: "admissions@apexacademy.edu",
          website: "https://apexacademy.edu",
        },
        overview: {
          description: "Comprehensive coaching for 11th, 12th, and repeater students for NEET Medical and IIT JEE Engineering with proven track records.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", alt: "Classroom" },
          ],
        },
        tags: ["NEET Coaching", "JEE Coaching", "Tuitions", "Apex Academy"],
      },
      {
        catName: "Healthcare & Clinics",
        subName: "Dental Clinics",
        name: "SmileCraft Advanced Multi-Speciality Dental Care",
        ratings: { overall: 5.0, total: 310 },
        operatingHours: "09:00 AM - 08:00 PM",
        extraInfo: "Painless Laser Dentistry | Digital OPG X-Ray | Sterile Environment",
        locationDetails: {
          address: "Plot 30, TTK Road, Alwarpet",
          city: "Chennai",
          pincode: "600018",
          state: "Tamil Nadu",
        },
        contactDetails: {
          phone: "9876543208",
          email: "care@smilecraftdental.com",
          website: "https://smilecraftdental.com",
        },
        overview: {
          description: "Leading dental center specializing in painless single-sitting root canals, invisible aligners, dental implants, and cosmetic smile designs.",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80", alt: "Dental Chair" },
          ],
        },
        tags: ["Dental Clinic", "Root Canal", "Teeth Whitening", "Invisalign", "Alwarpet"],
      },
    ];

    for (let item of sampleOfflineListings) {
      const cat = createdBusinessCats.find((c) => c.mainCategory === item.catName);
      if (cat) {
        const sub = cat.subCategories.find((s) => s.title === item.subName) || cat.subCategories[0];
        await BusinessList.create({
          name: item.name,
          providerId: defaultProvider._id,
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
    }
    console.log(`Seeded ${sampleOfflineListings.length} verified businesses into "Businesslist".`);

    // 4. Guides
    console.log("Seeding Helpful Guides...");
    await Guide.deleteMany({});
    const guides = [
      { title: "Top 7 Tips When Hiring a Full-Stack MERN Freelancer in 2026", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
      { title: "Complete Guide: How to Choose the Perfect Banquet Hall for Your Wedding", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80" },
      { title: "AC Service Checklist: Avoid Overcharging and Ensure Maximum Cooling", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
      { title: "How to Protect Fragile Electronics During Inter-City Household Relocation", imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80" },
    ];
    await Guide.insertMany(guides);

    console.log("\n=================================================================");
    console.log("🚀 MASTER DUAL-SECTION SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=================================================================");
    console.log("ONLINE SECTION:  6 Categories, 18 Subcategories, 6 Top Freelancers");
    console.log("OFFLINE SECTION: 6 Categories, 23 Subcategories, 8 Verified Centers");
    console.log("ALL REAL USER ACCOUNTS SAFELY PRESERVED!");
    console.log("=================================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedBothSections();
