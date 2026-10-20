const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const BusinessCategory = require("../models/Business");
const BusinessList = require("../models/BusinessList");
const Service = require("../models/Service");
const UserList = require("../models/UserList");

// =========================================================================
// DATA DEFINITIONS - 5 ONLINE CATEGORIES (EXCLUDING Content & Copywriting)
// =========================================================================
const onlineCategories = [
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
      { question: "Can the designer build design systems for developers?", answer: "Yes, components include autolayout, variants, and design tokens ready for Tailwind or CSS modules." },
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
    faqarr: [
      { question: "Do I get full intellectual property rights?", answer: "Yes, complete commercial usage and copyright ownership are transferred upon project delivery." },
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
    faqarr: [
      { question: "How long until I see SEO results?", answer: "Technical fixes take 2-4 weeks, while organic competitive keyword rankings typically mature within 60 to 90 days." },
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
    faqarr: [
      { question: "Can I provide raw footage in 4K?", answer: "Yes, editors accept Google Drive, WeTransfer, and Dropbox links with 4K ProRes or MP4 footage." },
    ],
  },
];

// =========================================================================
// DATA DEFINITIONS - 6 OFFLINE BUSINESS CATEGORIES
// =========================================================================
const offlineCategories = [
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

// Helper pools for generating high quality realistic data
const indianCities = [
  { city: "Chennai", state: "Tamil Nadu", areas: ["Anna Nagar", "T. Nagar", "Guindy", "Velachery", "Adyar", "Mylapore", "Nungambakkam", "Tambaram"] },
  { city: "Bengaluru", state: "Karnataka", areas: ["Koramangala", "Indiranagar", "HSR Layout", "Whitefield", "Jayanagar", "Electronic City", "Marathahalli"] },
  { city: "Hyderabad", state: "Telangana", areas: ["Hitec City", "Madhapur", "Banjara Hills", "Jubilee Hills", "Gachibowli", "Kondapur", "Secunderabad"] },
  { city: "Coimbatore", state: "Tamil Nadu", areas: ["RS Puram", "Gandhipuram", "Peelamedu", "Saibaba Colony", "Saravanampatti", "Race Course"] },
  { city: "Mumbai", state: "Maharashtra", areas: ["Bandra West", "Andheri East", "Powai", "Juhu", "Dadar", "Thane West", "Navi Mumbai"] },
  { city: "Pune", state: "Maharashtra", areas: ["Kothrud", "Viman Nagar", "Baner", "Hinjewadi", "Koregaon Park", "Aundh"] },
  { city: "Kochi", state: "Kerala", areas: ["Edappally", "Kaloor", "Marine Drive", "Kakkanad", "Panampilly Nagar"] },
  { city: "Delhi NCR", state: "Delhi", areas: ["Connaught Place", "South Extension", "Hauz Khas", "Noida Sector 18", "Gurugram Cyber City"] },
  { city: "Madurai", state: "Tamil Nadu", areas: ["KK Nagar", "Anna Nagar", "Simmakkal", "SS Colony", "Tallakulam"] },
];

const avatarPhotos = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1528892952291-009c663ce843?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
];

// Subcategory-specific skill templates
const skillsBySubcategory = {
  "Full Stack MERN Development": [
    ["React 19", "Node.js", "Express", "MongoDB Atlas", "Socket.IO", "Tailwind CSS"],
    ["Next.js 15", "TypeScript", "NestJS", "MongoDB", "Redux Toolkit", "GraphQL"],
    ["MERN Stack", "Docker", "JWT Auth", "REST APIs", "AWS EC2", "PostgreSQL"],
    ["React", "Node", "MongoDB", "Microservices", "Redis", "Cloudinary"]
  ],
  "Frontend & React.js": [
    ["React.js", "Vite", "Tailwind CSS", "Framer Motion", "Shadcn UI", "State Management"],
    ["Next.js", "SSR", "SEO Optimization", "TypeScript", "Tailwind CSS", "Zustand"],
    ["HTML5/CSS3", "JavaScript ES6+", "React Hooks", "Responsive Design", "Bootstrap"],
    ["Vue.js & React", "Styled Components", "Performance Tuning", "PWA", "Web Vitals"]
  ],
  "Mobile App Development": [
    ["Flutter", "Dart", "Firebase", "State Management (Bloc/Provider)", "REST APIs"],
    ["React Native", "Expo", "Redux", "Push Notifications", "App Store Submission"],
    ["iOS & Android", "Cross-Platform", "SQLite", "Camera API", "Payment Gateways"],
    ["Flutter", "Clean Architecture", "In-App Purchases", "Google Maps API"]
  ],
  "Python & Backend APIs": [
    ["FastAPI", "Python 3.12", "PostgreSQL", "Docker", "SQLAlchemy", "Pydantic"],
    ["Django REST Framework", "Celery", "Redis", "AWS S3", "Microservices"],
    ["Flask", "Python Automation", "BeautifulSoup", "Pandas", "ETL Pipelines"],
    ["Python", "AsyncIO", "gRPC", "MongoDB", "OAuth2", "CI/CD Pipelines"]
  ],
  "Figma UI/UX Design": [
    ["Figma", "Design Systems", "Auto Layout", "Interactive Prototyping", "Wireframing"],
    ["UI/UX Research", "Figma Components", "User Personas", "Journey Mapping"],
    ["Figma", "Micro-Interactions", "Heuristic Evaluation", "Accessibility (WCAG)"],
    ["Product Design", "Figma Variables", "Component Tokens", "Design Handoff"]
  ],
  "Mobile App UI Design": [
    ["iOS Human Interface", "Material 3", "Mobile Wireframing", "Figma", "Prototyping"],
    ["Dark Mode Design", "Mobile Interactions", "App Icon Design", "User Testing"],
    ["Fintech UI", "E-commerce App UX", "Figma", "Micro-animations", "Usability"],
    ["HealthTech UI", "SaaS Mobile UX", "Adaptive Layouts", "Design Systems"]
  ],
  "Website Redesign & Audits": [
    ["UX Audit", "Conversion Rate Optimization (CRO)", "A/B Testing", "Figma", "Analytics"],
    ["Landing Page Optimization", "Heuristic Evaluation", "User Testing", "Heatmaps"],
    ["Website Revamp", "Information Architecture", "Wireframing", "Speed Audit"],
    ["Visual Polish", "Responsive Grid Auditing", "Accessibility Audits", "Figma"]
  ],
  "Logo & Brand Identity": [
    ["Minimalist Logos", "Vector Illustration", "Brand Style Guide", "Adobe Illustrator"],
    ["Corporate Identity", "Typography Pairing", "Color Palette", "Stationery Kit"],
    ["3D Logo Design", "App Icon Sets", "Vector Art", "Brand Mascot"],
    ["Brand Strategy", "Modern Monograms", "SVG Vector Assets", "Figma/Illustrator"]
  ],
  "Social Media Post Design": [
    ["Instagram Carousels", "LinkedIn Banners", "Canva Pro", "Photoshop", "Ad Creatives"],
    ["Story Templates", "Promotional Banners", "Typography", "Color Theory", "Figma"],
    ["Viral Hooks", "Thumbnail Design", "Infographics", "Brand Templates"],
    ["Meta Ads Design", "E-commerce Product Graphics", "Graphic Design", "Photoshop"]
  ],
  "3D Product Modeling": [
    ["Blender 3D", "Photorealistic Renders", "Product Packaging", "Cycles & Eevee"],
    ["3D Animation", "Lighting & Texturing", "Cinema 4D", "Product Turnarounds"],
    ["3D Mockups", "Cosmetic Bottle Renders", "KeyShot", "Substance Painter"],
    ["CAD to 3D", "Isometric Illustration", "AR Assets (glTF/USDZ)", "Blender"]
  ],
  "Search Engine Optimization (SEO)": [
    ["On-Page SEO", "Technical SEO Audits", "Semrush", "Ahrefs", "Google Search Console"],
    ["Keyword Research", "High-DA Backlinks", "Schema Markup", "Core Web Vitals"],
    ["Local SEO", "Google Business Profile", "Content Optimization", "PageSpeed"],
    ["E-commerce SEO", "Shopify/WordPress SEO", "Competitor Gap Analysis", "Rank Tracking"]
  ],
  "Social Media Marketing": [
    ["Instagram Growth", "LinkedIn Personal Branding", "Content Calendars", "Hashtag Strategy"],
    ["Meta Ads (FB/IG)", "ROAS Optimization", "Audience Retargeting", "Ad Copywriting"],
    ["Community Management", "Influencer Collaborations", "Organic Reach", "Analytics"],
    ["Omni-channel Strategy", "TikTok/Reels Marketing", "Brand Engagement", "Lead Generation"]
  ],
  "YouTube Video Editing": [
    ["Adobe Premiere Pro", "After Effects", "Color Grading", "Sound Design", "Thumbnail Design"],
    ["Retention Pacing", "Visual Effects (SFX)", "DaVinci Resolve", "Jump Cuts", "B-roll Sync"],
    ["Documentary Editing", "Podcast Video Production", "Audio Denoising", "Multicam Sync"],
    ["Tech Reviews", "Gaming Edits", "Dynamic Transitions", "Cinematic LUTs"]
  ],
  "Shorts & Reels Production": [
    ["CapCut Pro", "Premiere Pro", "Animated Captions", "Trending Audio Sync", "9:16 Video"],
    ["Hormozi Style Cuts", "Sound Effects", "Visual Emojis", "Hook Optimization", "Viral Reels"],
    ["TikTok Editing", "Instagram Growth Video", "Motion Graphics", "Fast Cut Transitions"],
    ["UGC Video Ads", "Product Reel Demos", "Subtitle Styling", "B-roll Overlay"]
  ],
};

// Realistic freelancer details builder
const namesList = [
  "Muthu Kumar A", "Harish Pandian", "Karthik Rajan", "Priya Sundaram", "Sneha Reddy",
  "Farhan Akhtar", "Natasha Pinto", "Sanjeev Roy", "Divya Balaji", "Aman Sheikh",
  "Devendra Hegde", "Kabir Khanna", "Ananya Iyer", "Rajeshwari Nathan", "Vigneshwaran K",
  "Meera Nambiar", "Kavitha Selvam", "Suresh Babu", "Pooja Venkat", "Dinesh Kumar",
  "Aishwarya Raman", "Gautham Menon", "Swathi Sridhar", "Arvind Swamy", "Preeti Nair",
  "Varun Teja", "Shalini Murthy", "Nitin Chawla", "Ritu Deshmukh", "Sameer Kulkarni",
  "Tanvi Joshi", "Rohan Verma", "Shruti Patel", "Aditya Sen", "Malini Rao",
  "Sanjay Gupta", "Neha Kulkarni", "Manoj Pillai", "Keerthana R", "Deepa Krishnan",
  "Arun Prakash", "Bhavna Mishra", "Chetan Bhagat", "Durga Prasad", "Esha Deol",
  "Faisal Khan", "Geeta Bhatt", "Hemant Soren", "Indira Goswami", "Jitendra Verma",
  "Kalyani Priyadarshan", "Lalitha Kumari", "Madhavan R", "Naveen Polishetty", "Omkar Thakur",
  "Pranitha Subhash", "Qasim Rizvi", "Rashmika Rao", "Siddharth Malhotra", "Tara Sutaria",
  "Uday Chopra", "Vaishali Desai", "Wasim Akram", "Yamini Reddy", "Zoya Akhtar",
  "Abhishek Bachchan", "Bipasha Basu", "Charu Sharma", "Deepak Dobriyal", "Ekta Kapoor",
  "Feroz Khan", "Govind Namdev", "Himesh Reshammiya", "Ila Arun", "Jagjit Singh",
  "Kailash Kher", "Lata Mangeshkar", "Mukesh Khanna", "Nirmala Sitharaman", "Pankaj Tripathi",
  "Radhika Apte", "Sachin Tendulkar", "Tabu Hashmi", "Upendra Rao", "Vidya Balan",
  "Yash Gowda", "Zakir Khan", "Aditi Rao", "Boman Irani", "Chitra Visweswaran",
  "Diljit Dosanjh", "Emraan Hashmi", "Fatima Sana", "Girish Karnad", "Huma Qureshi",
  "Irfaan Khan", "Juhi Chawla", "Karan Johar", "Lisa Haydon", "Mahesh Babu",
  "Naseeruddin Shah", "Paresh Rawal", "Radha Ravi", "Shabana Azmi", "Tanikella Bharani",
  "Vijay Sethupathi", "Ajith Kumar", "Suriya Sivakumar", "Dhanush K", "Silambarasan TR",
  "Arya Ramani", "Jayaram Subramaniam", "Karthi Sivakumar", "Sivakarthikeyan D", "Vishal Krishna",
  "Vikram Kennedy", "Jiiva Amar", "Prabhu Deva", "Raghava Lawrence", "Vijay Antony",
  "Atharvaa Murali", "Harish Kalyan", "Ashok Selvan", "Gautham Karthik", "Kalidas Jayaram",
  "Dulquer Salmaan", "Nivin Pauly", "Tovino Thomas", "Prithviraj Sukumaran", "Fahadh Faasil",
  "Allu Arjun", "Ram Charan", "NTR Jr", "Prabhas Raju", "Mahesh Babu",
  "Nani Bellamkonda", "Vijay Deverakonda", "Sharwanand M", "Sai Dharam", "Varun Tej"
];

// Offline businesses data generator by category
const offlineTemplates = {
  "Banquet Halls": {
    names: [
      "Grand Imperial Palace & Convention Centre", "Raj Mahal AC Marriage Hall", "SVB Luxury Convention Center",
      "Mayuri Royal Banquet Hall", "Shree Venkateshwara Grand Hall", "Emerald Palms Convention Hub",
      "Crown Heritage Banquets", "Golden Jubilee AC Hall", "Saffron Vista Banquet Palace", "Vasantham Grand Celebration Arena"
    ],
    facilities: ["AC Banquet Hall", "Valet Parking", "Bridal Dressing Suite", "Kitchen Facilities", "Generator Backup", "Lift Access", "Dining Hall for 500+"],
    capacity: { minGuests: 150, maxGuests: 1800 },
    priceRange: "₹45,000 - ₹2,50,000 per day",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "Bridal Requisite": {
    names: [
      "Lavanya HD Bridal Studio & Spa", "Kavitha Saree Draping & Makeover", "Glitz & Glam Bridal Makeover",
      "Royal Bride HD Airbrush Lounge", "Apsara Bridal Beautique", "Shimmering Looks Bridal Academy",
      "Mehendi & Saree Elegance Hub", "Vogue Bridal Glamour Studio", "Divas Divine Wedding Makeovers", "Subhadra Traditional Bridal Arts"
    ],
    facilities: ["Airbrush HD Makeup", "Saree Draping & Ironing", "Hair Styling & Flowers", "Trial Sessions Available", "Doorstep Service at Venue"],
    capacity: { minGuests: 1, maxGuests: 10 },
    priceRange: "₹12,000 - ₹35,000 package",
    images: [
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "Caterers": {
    names: [
      "Annapoorna Traditional Caterers", "Sri Krishna Grand Catering Services", "Spice Symphony Royal Feast Caterers",
      "Madras Flavours South & North Caterers", "Ruchi Gourmet Banqueting & Feasts", "Udupi Sri Sai Catering Services",
      "Bawarchi Royal Biryani & Catering", "Dakshin Heritage Feast Masters", "Anandham Authentic Vegetarian Caterers", "Celebration Live Counters Catering"
    ],
    facilities: ["Pure Veg & Non-Veg", "Live Dosa & Chaat Counters", "Uniformed Service Staff", "Eco-Friendly Areca Nut Plates", "Customized Menu Tasting"],
    capacity: { minGuests: 50, maxGuests: 3000 },
    priceRange: "₹280 - ₹850 per plate",
    images: [
      "https://images.unsplash.com/photo-1555244162-803834f70033?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "Photography Services": {
    names: [
      "FocusCraft Candid Wedding Studios", "CinemaRolls 4K Wedding Filming", "MemoryLane Drone & Candid Arts",
      "PixelMoments Premium Wedding Photography", "Aura Creative Wedding Tales", "ShutterBug Cinematic Stories",
      "GoldenHour Traditional & Candid Studio", "LensQueen Bridal Portfolios", "RoyalCapture Wedding Films", "EternalFrame Studios"
    ],
    facilities: ["Sony FX3 / A7IV 4K Cameras", "DJI Mavic 3 Drone Coverage", "Same-Day Teaser Video", "Luxury Leather Photo Albums", "Pre-Wedding Shoot Included"],
    capacity: { minGuests: 10, maxGuests: 2000 },
    priceRange: "₹50,000 - ₹2,00,000 per wedding",
    images: [
      "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "Wedding Planners": {
    names: [
      "DreamWed Luxe Wedding Planners", "Knot & Tie Celebration Architects", "Grandeur Events & Hospitality",
      "Vivaah Moments Destination Planners", "Shree Mangal Wedding Curators", "Celebrity Vows Event Management",
      "Royal Mandap & Wedding Co.", "Blissful Unions Event Specialists", "Aayiram Kaal Mandapam Planners", "Infinite Memories Event Designers"
    ],
    facilities: ["End-to-End Planning", "Budget Tracking", "Hospitality & Guest Transport", "Vendor Coordination", "Theme Decor & Entertainment"],
    capacity: { minGuests: 100, maxGuests: 5000 },
    priceRange: "₹1,50,000 - ₹10,00,000",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "Decor & Design": {
    names: [
      "FloralFantasy Mandap & Stage Decorators", "ThemeArt Royal Wedding Decors", "BloomCraft Entrance & Stage Lighting",
      "Vasanta Vilas Traditional Floral Arts", "Saffron Glow Ambient Event Design", "Crystal Palace Backdrop Decors",
      "Sri Sai Floral Symphony", "Lotus Bloom Stage & Lawn Decor", "Elegance Theme Designers", "Grand Arch Mandapam Creations"
    ],
    facilities: ["Fresh Flower Arrangements", "LED Ambient Stage Lighting", "Theme Entrance Arches", "Customized Couple Sofa", "Eco-friendly Materials"],
    capacity: { minGuests: 50, maxGuests: 3000 },
    priceRange: "₹35,000 - ₹3,00,000",
    images: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&auto=format&fit=crop&q=80"
    ]
  },
  "AC Service": {
    names: [
      "CoolBreeze Rapid AC Repair & Service", "Arctic Chill Multi-Brand AC Experts", "SmartAir Jet Clean & Gas Refill",
      "FrostTech Doorstep AC Maintenance", "BlueStar Certified AC Doctors", "Voltas & Daikin AC Service Hub",
      "SuperCool Inverter AC Technicians", "QuickFix 24/7 AC Solutions", "Metro Cooling Engineers", "Apex Air Conditioning Care"
    ],
    facilities: ["Doorstep Inspection in 60 Mins", "High-Pressure Jet Wash", "Genuine Spare Parts", "30-Day Service Warranty", "Environment-safe Freon Gas"],
    priceRange: "₹499 - ₹2,499",
    images: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80"]
  },
  "Electricians": {
    names: [
      "PowerVolt Certified Electrician Services", "SparkFree 24/7 Home Electricals", "Apex Wiring & MCB Experts",
      "QuickShock Electrical Solutions", "SafeCurrent Home & Industrial Electricians", "BrightHome Inverter & Switchgear Care",
      "LumenPro Emergency Electrician Care", "Chennai Circuit Breaker & Wiring Hub", "Citywide Master Electricians", "ProWatt Domestic Electric Care"
    ],
    facilities: ["Government Certified Wiremen", "Thermal Imaging for Short Circuits", "Standard Rate Card", "Complete Tooling Kit", "Fast 45-Min Arrival"],
    priceRange: "₹250 - ₹1,800",
    images: ["https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=600&auto=format&fit=crop&q=80"]
  },
  "Car Service": {
    names: [
      "PitStop Express Multi-Brand Car Care", "AutoShine Foam Wash & Detailing Studio", "GermanTech European Car Specialists",
      "MotoCare Synthetic Oil & Brake Studio", "DriveSafe Periodic Service & Alignment", "SpeedyWheel Complete Tyre & Alignment",
      "RevvUp Engine Tuning & Denting Paint", "Classic Motors Doorstep Oil Change", "Apex Automotive Care Centre", "Royal Wheels Luxury Car Garage"
    ],
    facilities: ["Free Pick-up & Drop", "Fully Automated Foam Wash", "Digital Wheel Alignment", "Computerized Engine Scanning", "OEM Spare Parts"],
    priceRange: "₹1,499 - ₹8,999",
    images: ["https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80"]
  },
  "Bike Service": {
    names: [
      "MotoTune Multi-Brand Two-Wheeler Care", "TwoWheeler Doctors Doorstep Bike Care", "BulletCraft Royal Enfield Specialist Garage",
      "SpeedoPoint Express Bike Tuning", "SuperBikes & Commuter Repair Hub", "RapidGear Two-Wheeler Maintenance",
      "ThrottleHouse Performance & Oil Care", "CityRide Scooter & Bike Service", "Apex Motorbikes Care", "SmartBike Quick Repair Hub"
    ],
    facilities: ["Doorstep Bike Servicing", "Motul/Castrol Engine Oil", "Carburetor/FI Ultrasonic Cleaning", "Brake Overhaul & Chain Lubrication", "Free Water Wash"],
    priceRange: "₹399 - ₹1,999",
    images: ["https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=600&auto=format&fit=crop&q=80"]
  },
  "Plumbers": {
    names: [
      "AquaFlow Rapid Plumber & Pipe Services", "LeakProof Emergency Plumbing Hub", "DrainMaster Blockage Clearing & Motors",
      "HydroFix Certified Sanitary Technicians", "WaterGuard Bathroom Fittings & Heaters", "QuickPlumb Doorstep Plumbers",
      "Citywide Pipe & Tap Repair Care", "SmartPlumber Water Tank Cleaning", "BluePipe Domestic Plumbers", "Metro Flow Plumbing Specialists"
    ],
    facilities: ["Advanced Pipeline Blockage Snaker", "Overhead Tank UV Sanitization", "Concealed Leakage Detectors", "Instant 60-Min Doorstep Service"],
    priceRange: "₹299 - ₹2,200",
    images: ["https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=600&auto=format&fit=crop&q=80"]
  },
  "Salons": {
    names: [
      "Toni&Style Unisex Luxury Hair Salon", "Cut&Shave Premium Men's Grooming Lounge", "MirrorMirror Unisex Hair & Beauty",
      "Vogue Trendz Professional Hair Studio", "UrbanGroom Men & Women Styling Hub", "LuxeStrands Keratin & Hair Spa",
      "Blush & Blade Unisex Salon", "The Barber Club Classic Grooming", "Affinity High-Fashion Hair Salon", "Glamour Zone Family Salon"
    ],
    facilities: ["L'Oreal & Schwarzkopf Products", "Air-conditioned Private Stations", "Complimentary Green Tea", "Sanitized Tools", "Prior Booking System"],
    priceRange: "₹300 - ₹3,500",
    images: ["https://images.unsplash.com/photo-1562322140-8baeececf3df?w=600&auto=format&fit=crop&q=80"]
  },
  "Beauty Parlours": {
    names: [
      "Naturals Ladies Beauty Parlour & Makeover", "Lakme Salon & Bridal Care Lounge", "GreenTrends Ladies Hair & Skin Studio",
      "Feminine Touch Organic Facials & Waxing", "Bellezza Ladies Wellness & Beauty", "Rose Petals Herbal Beauty Care",
      "Shringar Ladies Makeup & Mehendi", "Elegance Women's Parlour", "Blossom Ladies Beauty Care", "GlowUp Women's Beauty Suite"
    ],
    facilities: ["Female-Only Certified Staff", "Organic & Herbal Facial Kits", "Rica Painless Waxing", "Bridal Consultation Room", "Hygienic Disposable Kits"],
    priceRange: "₹450 - ₹4,000",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"]
  },
  "Spa & Massages": {
    names: [
      "AyurVeda Bliss Authentic Kerala Spa", "ThaiSerenity Healing Therapy & Spa", "TranquilOasis Full Body Massage Lounge",
      "Golden Lotus Reflexology & Steam Hub", "Aura Healing Ayurvedic Rejuvenation", "Nirvana Wellness Herbal Spa",
      "Bodhi Tree Swedish Massage Centre", "Zensation Aromatherapy & Steam Suite", "Recharge Deep Tissue Spa", "Oceanic Breeze Wellness Spa"
    ],
    facilities: ["Ayurvedic Dhanwantharam Oils", "Private Steam & Shower Cabins", "Certified Kerala Masseurs", "Calming Instrumental Music", "Herbal Detox Drink"],
    priceRange: "₹1,500 - ₹6,000",
    images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&auto=format&fit=crop&q=80"]
  },
  "Packers & Movers": {
    names: [
      "Agarwal Express Relocation & Shifting", "SafeMove Inter-City Household Packers", "SpeedyLogistics Office & House Shifting",
      "UrbanMovers 5-Layer Bubble Packing", "TransIndia Cargo & Home Movers", "MetroRelocate Door-to-Door Carriers",
      "EasyShift Packers and Movers", "PrimePack Dedicated Vehicle Shifting", "SouthWest Express Cargo Movers", "Reliable Packers & Transit Logistics"
    ],
    facilities: ["5-Layer Bubble Wrap & Corrugated Boxes", "GPS-Tracked Enclosed Trucks", "Transit Damage Insurance", "Assembly & Disassembly by Carpenters", "Zero Breakage Guarantee"],
    priceRange: "₹4,500 - ₹28,000",
    images: ["https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=600&auto=format&fit=crop&q=80"]
  },
  "Home Cleaning": {
    names: [
      "SparkleClean Full House Deep Cleaning", "UrbanMaid Sofa & Mattress Shampooing", "FreshNest Kitchen Degreasing & Bath Sanitizing",
      "EcoShine Bio-Friendly Home Cleaning", "PureClean Villa & Apartment Cleaning", "Spotless 360 Deep Sanitization Services",
      "CleanTech Industrial Floor Polishing", "AllClear Balcony & Glass Cleaners", "RapidHome Cleaners", "Supreme House Cleaning Solutions"
    ],
    facilities: ["Taski German Cleaning Chemicals", "Single-Disc Floor Scrubbing Machine", "Industrial Vacuum Extraction", "Trained Background-Verified Crew"],
    priceRange: "₹1,200 - ₹7,500",
    images: ["https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80"]
  },
  "Pest Control": {
    names: [
      "PestTerminator Odorless Herbal Gel", "TermiteShield Subterranean Drilling Care", "ZeroBugs Bedbug & Cockroach Solution",
      "EcoPest Safe Herbal Pest Control", "Falcon Anti-Pest Commercial Services", "QuickEradicate Rodent & Mosquito Fogging",
      "ShieldGuard 1-Year Warranty Pest Care", "SafeLiving Domestic Pest Control", "GreenPest Odor-Free Exterminators", "Metro Pest Management"
    ],
    facilities: ["Bayer Certified Chemicals", "100% Odorless Gel Applications", "Child & Pet Safe", "Free Inspection & Re-treatment Warranty"],
    priceRange: "₹899 - ₹4,500",
    images: ["https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=600&auto=format&fit=crop&q=80"]
  },
  "Grocery": {
    names: [
      "FreshBasket Farm-to-Kitchen Supermarket", "OrganicRoots Certified Millets & Pulses", "DailyGreen Hydroponic Veggies & Fruits",
      "MetroMart 24/7 Departmental Store", "NammaAngadi Pure Cold-Pressed Oils & Spices", "NatureFresh Farm Produce Hub",
      "PureGrains Whole Spices & Dals Store", "SuperBazaar Express Grocery Delivery", "GreenGrocer Organic Superstore", "Heritage Pantry Staples"
    ],
    facilities: ["Direct Farm Sourcing", "Organic Certification Guarantee", "Free 45-Min Home Delivery", "Fresh Daily Stock", "Digital POS Billing"],
    priceRange: "₹50 - ₹2,500",
    images: ["https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80"]
  },
  "Entrance Exam Coaching": {
    names: [
      "Apex IIT-JEE & NEET Premier Academy", "Ignite CA Foundation & Commerce Hub", "Rankers Point Medical Entrance Classes",
      "Target Achievers Olympiad & JEE Foundation", "Shree Vidya Science & Entrance Mentors", "Vanguard Learning NEET Institute",
      "SuccessGate Competitive Exam Centre", "Visionary Mind IIT Foundation Classes", "ExcelPoint Medical & Engineering Prep", "Pinnacle Entrance Academy"
    ],
    facilities: ["Ex-IITian/Doctor Faculty", "Weekly Computer-Based Mock Tests", "Air-conditioned Smart Classrooms", "Comprehensive Doubt Clearing Hours"],
    priceRange: "₹25,000 - ₹1,20,000 per year",
    images: ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&auto=format&fit=crop&q=80"]
  },
  "Language Training": {
    names: [
      "FluencyPro Spoken English & IELTS Academy", "LinguistHub German, French & Spanish School", "AccentCraft Corporate Communication Classes",
      "GlobalBridge TOEFL & PTE Coaching Lounge", "British English Institute & Soft Skills", "Polyglot Language Learning Academy",
      "SpeakEasy Conversational English Hub", "EuroLingua Goethe Certified German Classes", "Oxford Pathway English Training", "WorldLingo International Languages"
    ],
    facilities: ["British Council / Goethe Certified Trainers", "Interactive Audio-Visual Labs", "Unlimited 1-on-1 Speaking Practice", "Guaranteed Band 7.5+ Assistance"],
    priceRange: "₹6,000 - ₹24,000",
    images: ["https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80"]
  },
  "Dental Clinics": {
    names: [
      "SmileCraft Laser & Multi-Speciality Dental Care", "RootCare Painless Endodontics & Implants", "PearlWhite Orthodontic & Aligners Studio",
      "DentCare 3D Scanning & Aesthetic Dentistry", "Apollo White Dental Clinic & Surgery", "DentaGlow Teeth Whitening & Crown Center",
      "GentleBite Pediatric & Family Dentistry", "Dr. Smile Multi-Specialty Dental Clinic", "Zenith Laser Dental Care", "Citywide Smile Dental Studio"
    ],
    facilities: ["Painless Laser Dentistry", "Digital 3D OPG Scanner", "Invisible Clear Aligners", "Autoclave Class-B Sterilization", "Implantologist on Board"],
    priceRange: "₹500 - ₹25,000",
    images: ["https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80"]
  },
  "Diagnostic Labs": {
    names: [
      "MediScan NABL Certified Diagnostic Centre", "ThyroCare Automated Blood Pathology Lab", "Apollo Diagnostics & ECG Pathology Hub",
      "HealthPath Digital X-Ray & Ultrasound Clinic", "Metropolis Healthcare Pathology Centre", "Dr. Lal PathLabs Blood Test & Biopsy",
      "CityScan 24/7 Diagnostic & Blood Lab", "AccuTest Comprehensive Health Checkups", "BioMedica Pathology & Hormonal Assay", "TrueTest Automated Medical Diagnostics"
    ],
    facilities: ["NABL & ISO 9001 Accredited", "Free Home Sample Collection in 30 Mins", "Same-Day Online PDF Reports via WhatsApp", "Automated Barcoded Sample Testing"],
    priceRange: "₹300 - ₹4,500",
    images: ["https://images.unsplash.com/photo-1579154204601-01588f351e67?w=600&auto=format&fit=crop&q=80"]
  }
};

// =========================================================================
// MAIN SEED FUNCTION
// =========================================================================
const seed5xDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully to:", mongoose.connection.name);

    // 1. Get or create provider
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

    // =========================================================================
    // PART A: ONLINE SECTION (5 Categories, 14 Subcategories, ~154 Freelancers)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("--- SEEDING ONLINE SECTION (5 Services -> ~154 Profiles) ---");
    console.log("=======================================================");

    await mongoose.connection.collection("services").drop().catch(() => {});
    await mongoose.connection.collection("servicelist").drop().catch(() => {});

    const createdServices = [];
    for (let cat of onlineCategories) {
      const doc = await Service.create(cat);
      createdServices.push(doc);
    }
    console.log(`Created ${createdServices.length} online service categories.`);

    let freelancerIndex = 0;
    let totalOnlineFreelancers = 0;

    for (const service of createdServices) {
      for (const sub of service.subcategories) {
        // Seed 11 unique freelancers for every subcategory
        const countForThisSub = 11;
        const skillSets = skillsBySubcategory[sub.title] || [["Professional", "Consulting", "Expert"]];

        for (let i = 0; i < countForThisSub; i++) {
          const name = namesList[freelancerIndex % namesList.length];
          const username = `${name.toLowerCase().replace(/[^a-z0-9]/g, "")}_${100 + freelancerIndex}`;
          const cityInfo = indianCities[freelancerIndex % indianCities.length];
          const area = cityInfo.areas[i % cityInfo.areas.length];
          const location = `${area}, ${cityInfo.city}`;
          const avatar = avatarPhotos[freelancerIndex % avatarPhotos.length];
          const skills = skillSets[i % skillSets.length];
          const experience = 2 + ((freelancerIndex * 3) % 9);
          const price = 800 + ((freelancerIndex * 170) % 3500);
          const rating = +(4.7 + ((freelancerIndex * 7) % 30) / 100).toFixed(2);
          const completedProjects = 15 + ((freelancerIndex * 13) % 85);
          const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
          const email = `${username}@gmail.com`;

          await UserList.create({
            name,
            username,
            serviceId: service._id,
            subcategoryId: sub._id,
            description: `Passionate ${sub.title} specialist based in ${location} with ${experience}+ years of verified industry experience delivering high-performance, polished, and commercially ready outcomes.`,
            price,
            rating,
            completedProjects,
            skills,
            image: avatar,
            location,
            experience,
            availability: "Available",
            phone,
            email,
            education: [
              {
                degree: i % 2 === 0 ? "B.Tech Information Technology" : "B.Sc Computer Science & Design",
                institution: i % 2 === 0 ? "National Engineering College" : "Anna University",
                year: 2020 + (i % 5),
              },
            ],
            projects: [
              {
                title: `${sub.title} Portfolio Project`,
                description: `High-impact client milestone delivered with modern best practices, high speed, and clean documentation.`,
                link: "https://github.com/muthukumar9360/Servizhub",
              },
              {
                title: `Scalable Production ${service.title}`,
                description: `Full cycle delivery adhering to international standards, high security, and responsiveness.`,
                link: "https://github.com/muthukumar9360",
              },
            ],
            reviews: [
              {
                reviewer: "Anand R.",
                comment: "Top notch quality, super fast turnaround, and transparent communication throughout!",
                rating: 5,
              },
              {
                reviewer: "Sarah Jenkins",
                comment: "Exceeded all expectations. Code and design were spotless and easy to integrate.",
                rating: 5,
              },
            ],
            languages: ["English", cityInfo.state === "Tamil Nadu" ? "Tamil" : "Hindi"],
            linkedin: `https://linkedin.com/in/${username}`,
            github: `https://github.com/${username}`,
          });

          freelancerIndex++;
          totalOnlineFreelancers++;
        }
      }
    }

    console.log(`Successfully seeded ${totalOnlineFreelancers} online freelancers into "servicelist"! (11 per subcategory across 14 subcategories)`);

    // =========================================================================
    // PART B: OFFLINE SECTION (6 Categories, 22 Subcategories, 220 Businesses)
    // =========================================================================
    console.log("\n=======================================================");
    console.log("--- SEEDING OFFLINE SECTION (6 Categories -> 220 Businesses) ---");
    console.log("=======================================================");

    await mongoose.connection.collection("Businesses").drop().catch(() => {});
    await mongoose.connection.collection("Businesslist").drop().catch(() => {});

    const createdBusinessCats = [];
    for (let c of offlineCategories) {
      const doc = await BusinessCategory.create(c);
      createdBusinessCats.push(doc);
    }
    console.log(`Created ${createdBusinessCats.length} offline business categories in "Businesses".`);

    let totalOfflineListings = 0;
    let bIndex = 0;

    for (const cat of createdBusinessCats) {
      for (const sub of cat.subCategories) {
        const template = offlineTemplates[sub.title] || {
          names: Array.from({ length: 10 }, (_, idx) => `${sub.title} Pro Care ${idx + 1}`),
          facilities: ["Verified Quality", "Professional Staff", "Card / UPI Accepted"],
          priceRange: "₹₹",
          images: [sub.image],
        };

        const targetCount = 10; // 10 businesses per subcategory -> 22 * 10 = 220 businesses!

        for (let i = 0; i < targetCount; i++) {
          const businessName = template.names[i % template.names.length] + (i >= template.names.length ? ` - Branch ${i + 1}` : "");
          const cityInfo = indianCities[bIndex % indianCities.length];
          const area = cityInfo.areas[i % cityInfo.areas.length];
          const address = `No. ${10 + (bIndex % 85)}, Main Road, ${area}`;
          const pincode = `${600000 + (bIndex % 900) + 10}`;
          const overallRating = +(4.6 + ((bIndex * 3) % 35) / 100).toFixed(1);
          const totalReviews = 85 + ((bIndex * 37) % 450);
          const phone = `9${Math.floor(100000000 + Math.random() * 900000000)}`;
          const owner = namesList[(bIndex + 15) % namesList.length];
          const imagesPool = template.images && template.images.length > 0 ? template.images : [sub.image];
          const mainImg = imagesPool[i % imagesPool.length] || sub.image;

          await BusinessList.create({
            name: businessName,
            providerId: defaultProvider._id,
            mainCategoryId: cat._id,
            subCategoryId: sub._id,
            ratings: { overall: overallRating, total: totalReviews },
            status: "Verified",
            claimed: true,
            isOpen: true,
            operatingHours: "08:30 AM - 09:30 PM (All 7 Days)",
            extraInfo: `${sub.title} | Verified by Servizhub | ${template.priceRange || "Competitive Pricing"}`,
            media: {
              mainImages: [
                { url: mainImg, alt: businessName },
                { url: sub.image, alt: sub.title },
              ],
              totalPhotos: 8,
              categories: [
                {
                  name: "All",
                  images: [{ url: mainImg }, { url: sub.image }],
                  count: 2,
                },
              ],
            },
            overview: {
              description: `Top-rated and verified ${sub.title} destination in ${area}, ${cityInfo.city}. Equipped with certified experts, cutting-edge standards, upfront transparent pricing, and 100% satisfaction guarantee.`,
              establishedYear: 2012 + (bIndex % 10),
              facilities: template.facilities || ["Certified Experts", "Card / UPI Accepted", "Parking Available"],
              capacity: template.capacity,
              priceRange: template.priceRange || "₹₹",
              openingHours: "08:30 AM - 09:30 PM",
              services: [sub.title, `${sub.title} Consultation`, `Express ${sub.title}`],
              faq: [
                {
                  q: `How do I book an appointment with ${businessName}?`,
                  a: "You can call the verified direct number or send a WhatsApp message directly via Servizhub for instant confirmation.",
                },
                {
                  q: "Are payment receipts and GST invoices provided?",
                  a: "Yes, official GST bills and itemized service warranty receipts are provided on all services.",
                },
              ],
            },
            locationDetails: {
              address,
              area,
              city: cityInfo.city,
              pincode,
              state: cityInfo.state,
              landmark: `Near ${area} Metro / Bus Terminus`,
            },
            contactDetails: {
              phone,
              whatsapp: phone,
              email: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}@servizhub.com`,
              ownerName: owner,
              verified: true,
              gstin: `33AA${String.fromCharCode(65 + (bIndex % 26))}C${1000 + (bIndex % 9000)}F1Z${(bIndex % 9) + 1}`,
              website: `https://${businessName.toLowerCase().replace(/[^a-z0-9]/g, "")}.servizhub.com`,
            },
            highlights: ["Verified & Insured", "4.8+ Rating", "Transparent Pricing", "Doorstep / On-site Service"],
            reviews: {
              list: [
                {
                  name: "Karthikeyan M.",
                  reviewsCount: 14,
                  date: "1 week ago",
                  text: `Exceptional service from ${businessName}! Extremely polite staff, punctual arrival, and clean work.`,
                  highlight: "Highly Recommended",
                },
                {
                  name: "Deepa Krishnan",
                  reviewsCount: 9,
                  date: "3 weeks ago",
                  text: "Great experience booking through Servizhub. Transparent pricing with no hidden charges.",
                  highlight: "Prompt & Professional",
                },
              ],
            },
            tags: [cat.mainCategory, sub.title, cityInfo.city, area, "Verified Service"],
          });

          bIndex++;
          totalOfflineListings++;
        }
      }
    }

    console.log(`Successfully seeded ${totalOfflineListings} verified local businesses into "Businesslist"! (10 per subcategory across 22 subcategories)`);

    console.log("\n=======================================================");
    console.log("             SEEDING COMPLETED SUMMARY                 ");
    console.log("=======================================================");
    console.log(`Online Service Categories: ${createdServices.length} (Excluded: Content & Copywriting)`);
    console.log(`Online Subcategories:      14`);
    console.log(`Online Freelancer Profiles: ${totalOnlineFreelancers} (Previous: 32 -> ~5x Increase)`);
    console.log(`Offline Categories:        ${createdBusinessCats.length}`);
    console.log(`Offline Subcategories:     22`);
    console.log(`Offline Local Businesses:  ${totalOfflineListings} (Previous: 44 -> Exactly 5x Increase)`);
    console.log("=======================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("Seeding failed with error:", err);
    process.exit(1);
  }
};

seed5xDatabase();
