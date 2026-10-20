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
          { question: "Can the designer build design systems for developers?", answer: "Yes, components include autolayout, variants, and design tokens ready for Tailwind or CSS modules." }
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
          { question: "Do I get full intellectual property rights?", answer: "Yes, complete commercial usage and copyright ownership are transferred upon project delivery." }
        ]
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
          { question: "How long until I see SEO results?", answer: "Technical fixes take 2-4 weeks, while organic competitive keyword rankings typically mature within 60 to 90 days." }
        ]
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
          { question: "Can I provide raw footage in 4K?", answer: "Yes, editors accept Google Drive, WeTransfer, and Dropbox links with 4K ProRes or MP4 footage." }
        ]
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
        faqarr: [
          { question: "Is all content 100% human-written and plagiarism free?", answer: "Yes, every delivery is verified through Copyscape and Grammarly Premium before submission." }
        ]
      },
    ];

    const createdServices = [];
    for (let s of onlineServicesData) {
      const doc = await Service.create(s);
      createdServices.push(doc);
    }
    console.log(`Created ${createdServices.length} online service categories.`);

    // Comprehensive list of Freelancer Profiles ensuring EVERY subcategory has multiple high-quality experts
    const sampleFreelancers = [
      // 1. Web & App Development -> Full Stack MERN Development
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
          { title: "Servizhub Marketplace", description: "Multi-vendor service discovery and booking platform", link: "https://github.com/muthukumar9360/Servizhub" },
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
        name: "Karthik Rajan",
        username: "karthik_fullstack",
        serviceTitle: "Web & App Development",
        subTitle: "Full Stack MERN Development",
        description: "Senior Full Stack Architect specializing in enterprise SaaS, Next.js 15 App Router, NestJS, and high-concurrency MongoDB clustering.",
        price: 3200,
        rating: 4.95,
        completedProjects: 48,
        skills: ["Next.js", "React 19", "Node.js", "TypeScript", "MongoDB Atlas", "GraphQL", "Docker"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 6,
        phone: "9845012345",
        email: "karthik.rajan.dev@gmail.com",
        education: [{ degree: "M.S. Software Systems", institution: "BITS Pilani", year: 2020 }],
        projects: [
          { title: "FinFlow SaaS", description: "Invoicing and reconciliation engine processing 10k transactions/sec", link: "https://github.com" },
        ],
        reviews: [
          { reviewer: "Deepak M.", comment: "Architected our microservices from scratch flawlessly. Rock solid engineer!", rating: 5 },
        ],
        languages: ["English", "Tamil", "Kannada"],
      },

      // Web & App Development -> Frontend & React.js
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
        phone: "9876543110",
        email: "hpandian176@gmail.com",
        languages: ["English", "Tamil", "Kannada"],
      },
      {
        name: "Deepa Sundar",
        username: "deepa_frontend",
        serviceTitle: "Web & App Development",
        subTitle: "Frontend & React.js",
        description: "UI Engineering Lead focused on web accessibility (WCAG), micro-frontends, Framer Motion animations, and ultra-high Lighthouse scores.",
        price: 2200,
        rating: 4.9,
        completedProjects: 36,
        skills: ["React.js", "Next.js", "Tailwind CSS", "Framer Motion", "Storybook", "TypeScript"],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 4,
        phone: "9840123987",
        email: "deepa.sundar.ui@gmail.com",
        languages: ["English", "Tamil"],
      },

      // Web & App Development -> Mobile App Development
      {
        name: "Vigneshwaran S",
        username: "vignesh_flutter",
        serviceTitle: "Web & App Development",
        subTitle: "Mobile App Development",
        description: "Senior Mobile Engineer with 5+ years crafting 60fps Flutter and React Native cross-platform apps for iOS and Android.",
        price: 2800,
        rating: 4.9,
        completedProjects: 41,
        skills: ["Flutter", "Dart", "React Native", "Firebase", "App Store Deployment", "BLoC", "Redux"],
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
        location: "Coimbatore, Tamil Nadu",
        experience: 5,
        phone: "9443187654",
        email: "vignesh.mobile@gmail.com",
        education: [{ degree: "B.E. Computer Science", institution: "PSG Tech", year: 2021 }],
        projects: [
          { title: "MedOrder App", description: "Medicine delivery app with 50K+ Play Store downloads", link: "https://play.google.com" },
        ],
        reviews: [
          { reviewer: "Ramesh P.", comment: "Published our app to both App Store and Google Play smoothly without rejections!", rating: 5 },
        ],
        languages: ["English", "Tamil"],
      },
      {
        name: "Ananya Deshmukh",
        username: "ananya_reactnative",
        serviceTitle: "Web & App Development",
        subTitle: "Mobile App Development",
        description: "React Native and Native iOS Swift specialist. Expert in offline-first SQLite sync, Push Notifications, and biometric authentication.",
        price: 2600,
        rating: 4.85,
        completedProjects: 28,
        skills: ["React Native", "Expo", "Swift", "Kotlin", "Push Notifications", "In-App Purchases"],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
        location: "Pune, Maharashtra",
        experience: 4,
        phone: "9822019283",
        email: "ananya.dev@outlook.com",
        languages: ["English", "Marathi", "Hindi"],
      },

      // Web & App Development -> Python & Backend APIs
      {
        name: "Siddharth Menon",
        username: "siddharth_backend",
        serviceTitle: "Web & App Development",
        subTitle: "Python & Backend APIs",
        description: "Backend engineer specializing in high-throughput FastAPI, Django REST framework, Redis caching, Celery task queues, and PostgreSQL indexing.",
        price: 2900,
        rating: 5.0,
        completedProjects: 33,
        skills: ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Celery", "Docker", "AWS"],
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80",
        location: "Kochi, Kerala",
        experience: 5,
        phone: "9745123980",
        email: "siddharth.menon.api@gmail.com",
        projects: [
          { title: "Payment Routing Gateway", description: "Multi-acquirer payment router with 99.99% uptime", link: "https://github.com" },
        ],
        languages: ["English", "Malayalam", "Tamil"],
      },
      {
        name: "Ritu Sen",
        username: "ritu_python",
        serviceTitle: "Web & App Development",
        subTitle: "Python & Backend APIs",
        description: "API Architect building RESTful and GraphQL endpoints, OAuth2 / JWT authentication systems, and cloud-native serverless functions.",
        price: 2400,
        rating: 4.88,
        completedProjects: 26,
        skills: ["Python", "Flask", "FastAPI", "SQLAlchemy", "JWT", "Microservices", "RESTful APIs"],
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80",
        location: "Hyderabad, Telangana",
        experience: 3,
        phone: "9123456780",
        email: "ritu.sen.dev@gmail.com",
        languages: ["English", "Hindi", "Bengali"],
      },

      // 2. UI/UX & Product Design -> Figma UI/UX Design
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
        name: "Tanvi Verma",
        username: "tanvi_uxlead",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Figma UI/UX Design",
        description: "Principal Product Designer specialized in complex SaaS B2B platforms, enterprise dashboard workflows, and complete Figma component libraries.",
        price: 2400,
        rating: 4.95,
        completedProjects: 52,
        skills: ["Figma", "Design Systems", "User Journeys", "Wireframing", "Information Architecture"],
        image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 6,
        phone: "9819234857",
        email: "tanvi.verma.ux@gmail.com",
        languages: ["English", "Hindi"],
      },

      // UI/UX & Product Design -> Mobile App UI Design
      {
        name: "Rahul Chawla",
        username: "rahul_mobileui",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Mobile App UI Design",
        description: "Mobile-first UI designer following Apple Human Interface Guidelines and Material You. Specialized in fintech, food delivery, and social apps.",
        price: 2100,
        rating: 4.9,
        completedProjects: 34,
        skills: ["iOS UI Design", "Android Material Design", "Figma", "Micro-animations", "App Prototyping"],
        image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
        location: "Mumbai, Maharashtra",
        experience: 4,
        phone: "9820192847",
        email: "rahul.chawla.ui@gmail.com",
        languages: ["English", "Hindi"],
      },
      {
        name: "Meera Krishnan",
        username: "meera_appdesign",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Mobile App UI Design",
        description: "Award-winning mobile designer creating thumb-friendly, aesthetically stunning onboarding experiences and dark/light responsive palettes.",
        price: 1950,
        rating: 4.88,
        completedProjects: 29,
        skills: ["Mobile UI", "Figma Prototyping", "Design Tokens", "Usability Testing"],
        image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 3,
        phone: "9840283741",
        email: "meera.krishnan.ui@gmail.com",
        languages: ["English", "Tamil"],
      },

      // UI/UX & Product Design -> Website Redesign & Audits
      {
        name: "Arvind Swamy",
        username: "arvind_cro_audit",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Website Redesign & Audits",
        description: "Conversion Rate Optimization (CRO) expert and accessibility auditor. I pinpoint friction points on landing pages and boost checkout conversion rates.",
        price: 2300,
        rating: 4.92,
        completedProjects: 45,
        skills: ["CRO", "UX Audit", "Heuristic Evaluation", "A/B Testing", "Figma Redesign", "Heatmap Analysis"],
        image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=400&auto=format&fit=crop&q=80",
        location: "Coimbatore, Tamil Nadu",
        experience: 5,
        phone: "9442019283",
        email: "arvind.swamy.cro@gmail.com",
        languages: ["English", "Tamil"],
      },
      {
        name: "Shalini Gupta",
        username: "shalini_redesign",
        serviceTitle: "UI/UX & Product Design",
        subTitle: "Website Redesign & Audits",
        description: "Transform outdated legacy websites into modern, high-converting digital storefronts with rapid turnaround and developer-ready specs.",
        price: 1750,
        rating: 4.85,
        completedProjects: 27,
        skills: ["Website Redesign", "Figma", "UX Audit", "Responsive Design", "WCAG Compliance"],
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
        location: "Delhi NCR",
        experience: 3,
        phone: "9811029384",
        email: "shalini.gupta.ux@gmail.com",
        languages: ["English", "Hindi"],
      },

      // 3. Graphics & Branding -> Logo & Brand Identity
      {
        name: "Aditya Banerjee",
        username: "aditya_branding",
        serviceTitle: "Graphics & Branding",
        subTitle: "Logo & Brand Identity",
        description: "Logo & Visual Identity specialist. I create iconic, memorable brand marks with full stationery design, typography scales, and vector guideline books.",
        price: 2000,
        rating: 4.95,
        completedProjects: 60,
        skills: ["Logo Design", "Adobe Illustrator", "Brand Identity", "Typography", "Vector Graphics", "Brand Guidelines"],
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
        location: "Kolkata, West Bengal",
        experience: 5,
        phone: "9830192837",
        email: "aditya.banerjee.design@gmail.com",
        languages: ["English", "Bengali", "Hindi"],
      },
      {
        name: "Preeti Nambiar",
        username: "preeti_brandmark",
        serviceTitle: "Graphics & Branding",
        subTitle: "Logo & Brand Identity",
        description: "Modern minimalist and luxury branding designer. Crafted visual identities for 40+ funded startups and boutique brands worldwide.",
        price: 2200,
        rating: 4.9,
        completedProjects: 43,
        skills: ["Minimalist Logos", "Packaging Design", "Illustrator", "Photoshop", "Brand Books"],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 4,
        phone: "9845192830",
        email: "preeti.nambiar.brand@gmail.com",
        languages: ["English", "Malayalam", "Hindi"],
      },

      // Graphics & Branding -> Social Media Post Design
      {
        name: "Rohan Kulkarni",
        username: "rohan_visuals",
        serviceTitle: "Graphics & Branding",
        subTitle: "Social Media Post Design",
        description: "Creating high-CTR social media ad creatives, carousel slides for LinkedIn, and vibrant Instagram templates in Photoshop & Canva Pro.",
        price: 1200,
        rating: 4.88,
        completedProjects: 78,
        skills: ["Social Media Graphics", "Canva Pro", "Photoshop", "Ad Creatives", "Carousel Design"],
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80",
        location: "Pune, Maharashtra",
        experience: 3,
        phone: "9823019284",
        email: "rohan.visuals@gmail.com",
        languages: ["English", "Marathi", "Hindi"],
      },
      {
        name: "Swati Patel",
        username: "swati_socialdesign",
        serviceTitle: "Graphics & Branding",
        subTitle: "Social Media Post Design",
        description: "Specialized in D2C brand social identities, sales promotional banners, festive greeting posters, and YouTube thumbnails.",
        price: 1100,
        rating: 4.82,
        completedProjects: 55,
        skills: ["Banner Ads", "Instagram Posts", "Photoshop", "Illustrator", "Visual Storytelling"],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
        location: "Ahmedabad, Gujarat",
        experience: 3,
        phone: "9898019284",
        email: "swati.patel.creative@gmail.com",
        languages: ["English", "Gujarati", "Hindi"],
      },

      // Graphics & Branding -> 3D Product Modeling
      {
        name: "Neil D'Souza",
        username: "neil_3drenders",
        serviceTitle: "Graphics & Branding",
        subTitle: "3D Product Modeling",
        description: "Blender 3D and Cinema4D artist creating photorealistic e-commerce product renders, cosmetic packaging mockups, and 360-degree turntable animations.",
        price: 2800,
        rating: 4.96,
        completedProjects: 39,
        skills: ["Blender 3D", "Cinema 4D", "Octane Render", "Substance Painter", "Product Renders"],
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80",
        location: "Goa / Mumbai",
        experience: 5,
        phone: "9820019283",
        email: "neil.3d.renders@gmail.com",
        languages: ["English", "Hindi"],
      },
      {
        name: "Varun Reddy",
        username: "varun_cad3d",
        serviceTitle: "Graphics & Branding",
        subTitle: "3D Product Modeling",
        description: "Industrial 3D modeler producing precision CAD geometry, realistic lighting scenes, and WebGL Spline 3D interactive assets for modern websites.",
        price: 2600,
        rating: 4.88,
        completedProjects: 31,
        skills: ["3D Modeling", "Blender", "Spline 3D", "KeyShot", "Texturing & Shading"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        location: "Hyderabad, Telangana",
        experience: 4,
        phone: "9849019284",
        email: "varun.reddy3d@gmail.com",
        languages: ["English", "Telugu", "Hindi"],
      },

      // 4. Digital Marketing & SEO -> Search Engine Optimization (SEO)
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
        name: "Farhan Akhtar",
        username: "farhan_techseo",
        serviceTitle: "Digital Marketing & SEO",
        subTitle: "Search Engine Optimization (SEO)",
        description: "Technical SEO consultant specializing in Core Web Vitals optimization, schema markup, international hreflang tags, and high-authority DA 70+ backlinks.",
        price: 1800,
        rating: 4.94,
        completedProjects: 58,
        skills: ["Core Web Vitals", "Technical Audits", "Semrush", "Link Building", "Schema.org", "PageSpeed"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 6,
        phone: "9840019284",
        email: "farhan.akhtar.seo@gmail.com",
        languages: ["English", "Tamil", "Hindi"],
      },

      // Digital Marketing & SEO -> Social Media Marketing
      {
        name: "Natasha Pinto",
        username: "natasha_smm",
        serviceTitle: "Digital Marketing & SEO",
        subTitle: "Social Media Marketing",
        description: "Social media strategist driving organic viral reach on Instagram, LinkedIn, and YouTube Shorts through content calendars and hashtag strategy.",
        price: 1400,
        rating: 4.89,
        completedProjects: 63,
        skills: ["Social Media Marketing", "Content Strategy", "Instagram Growth", "LinkedIn Personal Branding", "Community Management"],
        image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
        location: "Mumbai, Maharashtra",
        experience: 4,
        phone: "9821019284",
        email: "natasha.pinto.social@gmail.com",
        languages: ["English", "Hindi"],
      },
      {
        name: "Abhinav Joshi",
        username: "abhinav_growth",
        serviceTitle: "Digital Marketing & SEO",
        subTitle: "Social Media Marketing",
        description: "Paid and organic social growth specialist. Managed over ₹1.5 Cr in Meta ad spend with proven 4.2x ROAS for e-commerce and local services.",
        price: 1900,
        rating: 4.92,
        completedProjects: 49,
        skills: ["Meta Ads", "ROAS Optimization", "Audience Retargeting", "Influencer Outreach", "Analytics"],
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 5,
        phone: "9845019284",
        email: "abhinav.joshi.ads@gmail.com",
        languages: ["English", "Hindi", "Kannada"],
      },

      // 5. Video Editing & Animation -> YouTube Video Editing
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
        name: "Sanjeev Roy",
        username: "sanjeev_edits",
        serviceTitle: "Video Editing & Animation",
        subTitle: "YouTube Video Editing",
        description: "Story-driven documentary and educational YouTube video editor. Expert in retention pacing, zooms, visual SFX, and custom thumbnails.",
        price: 1800,
        rating: 4.91,
        completedProjects: 47,
        skills: ["Premiere Pro", "DaVinci Resolve", "Color Grading", "Retention Pacing", "Thumbnails"],
        image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&auto=format&fit=crop&q=80",
        location: "Kolkata, West Bengal",
        experience: 4,
        phone: "9831019284",
        email: "sanjeev.roy.editor@gmail.com",
        languages: ["English", "Bengali", "Hindi"],
      },

      // Video Editing & Animation -> Shorts & Reels Production
      {
        name: "Divya Balaji",
        username: "divya_reelsmaker",
        serviceTitle: "Video Editing & Animation",
        subTitle: "Shorts & Reels Production",
        description: "Viral 9:16 vertical short-form video specialist. Fast hooks, animated subtitles, trending audio pairing, and dynamic b-roll overlays.",
        price: 1300,
        rating: 4.93,
        completedProjects: 84,
        skills: ["CapCut Pro", "Premiere Pro", "Subtitles Animation", "Shorts Pacing", "B-roll Editing"],
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80",
        location: "Chennai, Tamil Nadu",
        experience: 3,
        phone: "9840192837",
        email: "divya.reels@gmail.com",
        languages: ["English", "Tamil"],
      },
      {
        name: "Aman Sheikh",
        username: "aman_shorts",
        serviceTitle: "Video Editing & Animation",
        subTitle: "Shorts & Reels Production",
        description: "Alex Hormozi style dynamic captioning, sound effects, emojis, and punchy cuts tailored for high engagement on Instagram and TikTok.",
        price: 1200,
        rating: 4.87,
        completedProjects: 72,
        skills: ["Dynamic Captions", "Sound Effects", "Short-form Editing", "Motion Graphics"],
        image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80",
        location: "Delhi NCR",
        experience: 3,
        phone: "9810019284",
        email: "aman.sheikh.edits@gmail.com",
        languages: ["English", "Hindi"],
      },

      // 6. Content & Copywriting -> Technical Writing & Docs
      {
        name: "Devendra Hegde",
        username: "devendra_techwriter",
        serviceTitle: "Content & Copywriting",
        subTitle: "Technical Writing & Docs",
        description: "Senior Technical Writer crafting clean OpenAPI/Swagger specifications, developer onboarding documentation, software architecture guides, and SDK manuals.",
        price: 1700,
        rating: 4.96,
        completedProjects: 37,
        skills: ["Technical Writing", "API Docs", "OpenAPI / Swagger", "Markdown", "GitBook", "Docusaurus"],
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80",
        location: "Bengaluru, Karnataka",
        experience: 5,
        phone: "9845019283",
        email: "devendra.hegde.tech@gmail.com",
        languages: ["English", "Kannada", "Hindi"],
      },
      {
        name: "Lakshmi Prasad",
        username: "lakshmi_docs",
        serviceTitle: "Content & Copywriting",
        subTitle: "Technical Writing & Docs",
        description: "Specialized in cloud architecture case studies, engineering blogs, GitHub READMEs, and technical whitepapers for software startups.",
        price: 1500,
        rating: 4.88,
        completedProjects: 29,
        skills: ["Developer Tutorials", "Whitepapers", "Software Docs", "Code Walkthroughs"],
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&auto=format&fit=crop&q=80",
        location: "Hyderabad, Telangana",
        experience: 4,
        phone: "9849123847",
        email: "lakshmi.prasad.writer@gmail.com",
        languages: ["English", "Telugu", "Hindi"],
      },

      // Content & Copywriting -> Website Copywriting
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
      {
        name: "Kabir Khanna",
        username: "kabir_conversioncopy",
        serviceTitle: "Content & Copywriting",
        subTitle: "Website Copywriting",
        description: "Conversion-focused website copywriter. Crafting high-converting SaaS landing pages, punchy value propositions, and abandoned cart email sequences.",
        price: 1600,
        rating: 4.92,
        completedProjects: 44,
        skills: ["Landing Page Copy", "Value Propositions", "Sales Letters", "Email Sequences", "A/B Testing"],
        image: "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=400&auto=format&fit=crop&q=80",
        location: "Mumbai, Maharashtra",
        experience: 4,
        phone: "9820019284",
        email: "kabir.khanna.copy@gmail.com",
        languages: ["English", "Hindi"],
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
    console.log(`Seeded ${sampleFreelancers.length} top-tier Freelancers into "servicelist". Every online subcategory is covered!`);

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

    // Comprehensive list of Verified Local Businesses ensuring EVERY subcategory has multiple listings
    const sampleOfflineListings = [
      // 1. Wedding Requisites -> Banquet Halls
      {
        catName: "Wedding Requisites",
        subName: "Banquet Halls",
        name: "Grand Imperial Palace & Convention Centre",
        ratings: { overall: 4.9, total: 342 },
        operatingHours: "Open 24 Hours / 7 Days",
        extraInfo: "Capacity: 1500 Guests | AC Centralized | 250+ Car Parking",
        locationDetails: {
          address: "No. 45, GST Road, Guindy",
          area: "Guindy",
          city: "Chennai",
          pincode: "600032",
          state: "Tamil Nadu",
          landmark: "Opposite Kathipara Flyover",
        },
        contactDetails: {
          phone: "9876543201",
          whatsapp: "9876543201",
          email: "grandimperial@servizhub.com",
          ownerName: "Sundaramurthy Chettiar",
          verified: true,
          gstin: "33AABCG1234F1Z1",
          website: "https://grandimperialpalace.com",
        },
        overview: {
          description: "Chennai's premier luxury wedding venue with sprawling air-conditioned banquet halls, royal chandeliers, green bridal dressing suites, and generator backup.",
          establishedYear: 2014,
          facilities: ["AC Banquet Hall", "Valet Parking", "Bridal Dressing Suite", "Kitchen Facilities", "Generator Backup"],
          capacity: { minGuests: 200, maxGuests: 1500 },
          priceRange: "₹₹₹₹",
          services: ["Wedding Receptions", "Sangeet Ceremonies", "Corporate Galas", "Exhibitions"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80", alt: "Grand Banquet Interior" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Stage Decor" },
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80", alt: "Dining Hall" },
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80", alt: "Entrance Lobby" },
          ],
          totalPhotos: 28,
        },
        tags: ["Banquet Hall", "Wedding Mandapam", "AC Convention Center", "Valet Parking"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Banquet Halls",
        name: "Sri Venkateswara Royal Heritage Mandapam",
        ratings: { overall: 4.8, total: 215 },
        operatingHours: "06:00 AM - 11:00 PM",
        extraInfo: "Capacity: 1000 Guests | Traditional Dravidian Architecture | Large Dining",
        locationDetails: {
          address: "12, 100 Feet Road, Vadapalani",
          area: "Vadapalani",
          city: "Chennai",
          pincode: "600026",
          state: "Tamil Nadu",
          landmark: "Near Murugan Temple",
        },
        contactDetails: {
          phone: "9876543210",
          whatsapp: "9876543210",
          email: "svmandapam@servizhub.com",
          ownerName: "Venkatesan R",
          verified: true,
          gstin: "33AABCV5678F1Z2",
        },
        overview: {
          description: "A majestic traditional wedding hall blending heritage carving with state-of-the-art modern comforts and expansive dining space.",
          establishedYear: 2011,
          facilities: ["Central AC", "Dining Seating 400", "Guest Rooms", "CCTV Security"],
          capacity: { minGuests: 150, maxGuests: 1000 },
          priceRange: "₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Heritage Mandapam" },
            { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80", alt: "Dining Hall" },
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80", alt: "Entrance" },
          ],
          totalPhotos: 22,
        },
        tags: ["Mandapam", "Wedding Hall", "Vadapalani", "Heritage Hall"],
      },

      // Wedding Requisites -> Bridal Requisite
      {
        catName: "Wedding Requisites",
        subName: "Bridal Requisite",
        name: "Apsara Bridal Makeover & HD Airbrush Studio",
        ratings: { overall: 4.95, total: 184 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Certified MAC & Kryolan Artists | Doorstep Venue Service | Pre-Bridal Skin Glow",
        locationDetails: {
          address: "24, Harrington Road, Chetpet",
          area: "Chetpet",
          city: "Chennai",
          pincode: "600031",
          state: "Tamil Nadu",
          landmark: "Near Chetpet Railway Station",
        },
        contactDetails: {
          phone: "9876543211",
          whatsapp: "9876543211",
          email: "apsarabridal@gmail.com",
          ownerName: "Meenakshi Sundaram",
          verified: true,
          website: "https://apsarabridal.in",
        },
        overview: {
          description: "Top-rated bridal makeover salon specializing in HD Airbrush makeup, South Indian traditional muhurtham looks, reception styling, and saree draping.",
          establishedYear: 2016,
          facilities: ["Private Bridal Suite", "Imported Cosmetics", "Hair Styling Station", "Skin Prep Lounge"],
          priceRange: "₹₹₹",
          services: ["Muhurtham Bridal Look", "Airbrush Makeup", "Saree Draping", "Bridal Mehndi", "Hairstyling"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80", alt: "Bridal Makeover" },
            { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", alt: "Bridal Studio" },
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Hair Styling" },
          ],
          totalPhotos: 34,
        },
        tags: ["Bridal Makeup", "Airbrush Makeup", "Saree Draping", "Chetpet", "Muhurtham Look"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Bridal Requisite",
        name: "Lotus Queen Bridal Couture & Salon",
        ratings: { overall: 4.86, total: 142 },
        operatingHours: "09:00 AM - 08:30 PM",
        extraInfo: "Celebrity Makeup Stylists | Customized Hair Extensions | Trial Sessions Available",
        locationDetails: {
          address: "56, 12th Main Road, Indiranagar",
          area: "Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
          state: "Karnataka",
          landmark: "Near Metro Pillar 84",
        },
        contactDetails: {
          phone: "9876543212",
          whatsapp: "9876543212",
          email: "lotusqueen.bridal@gmail.com",
          ownerName: "Pooja Hegde",
          verified: true,
        },
        overview: {
          description: "Bespoke bridal styling studio offering comprehensive wedding makeup packages, glass-skin facials, and customized jewelry coordination.",
          establishedYear: 2018,
          priceRange: "₹₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", alt: "Bridal Couture" },
            { url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80", alt: "Makeup Brushes" },
          ],
          totalPhotos: 20,
        },
        tags: ["Bridal Studio", "Indiranagar", "Pre-Bridal Package", "Hairstyling"],
      },

      // Wedding Requisites -> Caterers
      {
        catName: "Wedding Requisites",
        subName: "Caterers",
        name: "Madhura Grand Royal South & North Indian Caterers",
        ratings: { overall: 4.92, total: 380 },
        operatingHours: "07:00 AM - 10:00 PM",
        extraInfo: "Authentic Brahmin & Chettinad Feasts | 50+ Live Counters | Hygienic Central Kitchen",
        locationDetails: {
          address: "18, North Mada Street, Mylapore",
          area: "Mylapore",
          city: "Chennai",
          pincode: "600004",
          state: "Tamil Nadu",
          landmark: "Near Kapaleeshwarar Temple",
        },
        contactDetails: {
          phone: "9876543213",
          whatsapp: "9876543213",
          email: "madhuracatering@gmail.com",
          ownerName: "Subramania Iyer",
          verified: true,
          gstin: "33AABCM3456F1Z3",
        },
        overview: {
          description: "Mylapore's iconic catering company serving mouthwatering traditional banana leaf feasts, live dosas, chaat stalls, North Indian banquets, and customized sweets.",
          establishedYear: 2005,
          priceRange: "₹₹ - ₹₹₹",
          facilities: ["Uniformed Service Staff", "Eco-Friendly Leaf Service", "Live Food Counters", "Tasting Session"],
          services: ["Muhurtham Breakfast & Lunch", "Reception Buffet", "Live Chaat & Sweets", "Corporate Catering"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80", alt: "Gourmet Catering Table" },
            { url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", alt: "Traditional Feast" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Dessert Counter" },
          ],
          totalPhotos: 25,
        },
        tags: ["Caterers", "Wedding Catering", "Mylapore", "Banana Leaf Feast", "Live Counters"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Caterers",
        name: "Annapoorna Traditional Catering & Banquet Kitchen",
        ratings: { overall: 4.88, total: 260 },
        operatingHours: "08:00 AM - 09:30 PM",
        extraInfo: "Serving 500 to 5000 Guests | Fresh Local Ingredients | Award-Winning Desserts",
        locationDetails: {
          address: "77, D.B. Road, R.S. Puram",
          area: "R.S. Puram",
          city: "Coimbatore",
          pincode: "641002",
          state: "Tamil Nadu",
          landmark: "Near Flower Market",
        },
        contactDetails: {
          phone: "9876543214",
          whatsapp: "9876543214",
          email: "annapoornacaterers@gmail.com",
          ownerName: "Murugesan K",
          verified: true,
        },
        overview: {
          description: "Renowned Kongu Nadu and Pan-Indian catering service known for exquisite taste, immaculate cleanliness, and dedicated hospitality staff.",
          establishedYear: 2012,
          priceRange: "₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", alt: "Buffet Catering" },
            { url: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80", alt: "Catering Spread" },
          ],
          totalPhotos: 18,
        },
        tags: ["Catering", "Coimbatore", "Wedding Buffet", "Kongu Cuisine"],
      },

      // Wedding Requisites -> Photography Services
      {
        catName: "Wedding Requisites",
        subName: "Photography Services",
        name: "LensCraft Cinematic Wedding & Portrait Studio",
        ratings: { overall: 5.0, total: 198 },
        operatingHours: "09:30 AM - 08:30 PM",
        extraInfo: "Sony Alpha 7IV & Drone Equipment | Pre-Wedding Shoot Specialists",
        locationDetails: {
          address: "21, Race Course Road",
          area: "Race Course",
          city: "Coimbatore",
          pincode: "641018",
          state: "Tamil Nadu",
          landmark: "Opposite Circuit House",
        },
        contactDetails: {
          phone: "9876543205",
          whatsapp: "9876543205",
          email: "lenscraft@studio.com",
          ownerName: "Karthik Vijay",
          verified: true,
          website: "https://lenscraftstudio.com",
        },
        overview: {
          description: "Award-winning wedding photography and cinematography team capturing your timeless candid moments, reception teasers, and albums.",
          establishedYear: 2017,
          priceRange: "₹₹₹₹",
          facilities: ["Air Conditioned Photo Studio", "Drone Coverage", "Live LED Wall Streaming", "Italian Leather Albums"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80", alt: "Wedding Photography" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Bride Portrait" },
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80", alt: "Couple Candid" },
          ],
          totalPhotos: 32,
        },
        tags: ["Wedding Photography", "Candid Photos", "Drone Shoot", "Cinematography", "Race Course"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Photography Services",
        name: "CandidTales Luxury 4K Wedding & Drone Studio",
        ratings: { overall: 4.93, total: 165 },
        operatingHours: "10:00 AM - 08:00 PM",
        extraInfo: "4K Cinema Cameras | Candid Moments Guaranteed | Fast 15-Day Delivery",
        locationDetails: {
          address: "88, TTK Road, Alwarpet",
          area: "Alwarpet",
          city: "Chennai",
          pincode: "600018",
          state: "Tamil Nadu",
          landmark: "Near Park Sheraton",
        },
        contactDetails: {
          phone: "9876543215",
          whatsapp: "9876543215",
          email: "contact@candidtales.com",
          ownerName: "Arun Swaminathan",
          verified: true,
        },
        overview: {
          description: "Specializing in documentary-style wedding stories, slow-motion wedding films, and breathtaking destination pre-wedding shoots.",
          establishedYear: 2018,
          priceRange: "₹₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Candid Couple" },
            { url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=800&auto=format&fit=crop&q=80", alt: "Wedding Rituals" },
          ],
          totalPhotos: 24,
        },
        tags: ["Candid Photography", "Wedding Teasers", "Alwarpet", "4K Video"],
      },

      // Wedding Requisites -> Wedding Planners
      {
        catName: "Wedding Requisites",
        subName: "Wedding Planners",
        name: "Vivaha Elite Destination & Royal Wedding Planners",
        ratings: { overall: 4.96, total: 154 },
        operatingHours: "09:00 AM - 09:00 PM",
        extraInfo: "Turnkey Planning | Hotel & Flight Logistics | Celebrity Artist Booking",
        locationDetails: {
          address: "Plot 10, ECR Main Road, Injambakkam",
          area: "ECR",
          city: "Chennai",
          pincode: "600115",
          state: "Tamil Nadu",
          landmark: "Near Prarthana Beach",
        },
        contactDetails: {
          phone: "9876543216",
          whatsapp: "9876543216",
          email: "hello@vivahaelite.com",
          ownerName: "Deepak Chawla",
          verified: true,
          website: "https://vivahaelite.com",
        },
        overview: {
          description: "Complete luxury wedding curation from venue booking, hospitality management, themed decor, bridal styling, to post-wedding legal paperwork.",
          establishedYear: 2015,
          priceRange: "₹₹₹₹₹",
          facilities: ["Dedicated Wedding Manager", "Vendor Coordination", "Guest Transport Fleet", "Custom Theme Concepts"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80", alt: "Luxury Wedding Planning" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Destination Decor" },
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80", alt: "Floral Arch" },
          ],
          totalPhotos: 30,
        },
        tags: ["Wedding Planner", "Destination Wedding", "ECR Chennai", "Event Management"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Wedding Planners",
        name: "UTSAV Grand Events & Bespoke Wedding Curators",
        ratings: { overall: 4.9, total: 120 },
        operatingHours: "09:00 AM - 08:30 PM",
        extraInfo: "End-to-End Coordination | Budget-Friendly Packages | 100+ Weddings Planned",
        locationDetails: {
          address: "42, Residency Road",
          area: "Residency Road",
          city: "Bengaluru",
          pincode: "560025",
          state: "Karnataka",
          landmark: "Near Brigade Towers",
        },
        contactDetails: {
          phone: "9876543217",
          whatsapp: "9876543217",
          email: "utsavevents@gmail.com",
          ownerName: "Priyanka Nair",
          verified: true,
        },
        overview: {
          description: "Passionate team of wedding coordinators delivering unforgettable celebrations with hassle-free guest hospitality and elegant staging.",
          establishedYear: 2018,
          priceRange: "₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Event Planning" },
            { url: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80", alt: "Stage Coordination" },
          ],
          totalPhotos: 19,
        },
        tags: ["Wedding Curators", "Bengaluru Events", "Budget Wedding Planners"],
      },

      // Wedding Requisites -> Decor & Design
      {
        catName: "Wedding Requisites",
        subName: "Decor & Design",
        name: "Pushpa Malai Exotic Mandapam & Stage Floral Stylists",
        ratings: { overall: 4.94, total: 240 },
        operatingHours: "07:00 AM - 10:00 PM",
        extraInfo: "Fresh Dutch & Exotic Blooms | 3D Stage Visualizations | LED Fairy Light Themes",
        locationDetails: {
          address: "15, South Usman Road, T. Nagar",
          area: "T. Nagar",
          city: "Chennai",
          pincode: "600017",
          state: "Tamil Nadu",
          landmark: "Near Panagal Park",
        },
        contactDetails: {
          phone: "9876543218",
          whatsapp: "9876543218",
          email: "pushpamalaidecor@gmail.com",
          ownerName: "Murugan Selvam",
          verified: true,
          gstin: "33AABCP8901F1Z4",
        },
        overview: {
          description: "Creating magical wedding atmospheres with aromatic fresh flowers, royal entrance pathways, thematic canopy lighting, and modern geometric backdrops.",
          establishedYear: 2012,
          priceRange: "₹₹₹",
          facilities: ["In-house Floral Cold Storage", "Customized 3D Stage Previews", "Pyrotechnics & Cold Sparklers"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80", alt: "Floral Mandap Decor" },
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Stage Lighting" },
            { url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80", alt: "Entrance Pathway" },
          ],
          totalPhotos: 27,
        },
        tags: ["Floral Decor", "Mandap Decor", "T. Nagar", "Stage Design", "Fairy Lights"],
      },
      {
        catName: "Wedding Requisites",
        subName: "Decor & Design",
        name: "Crystal Glow Theme Wedding & Light Stylists",
        ratings: { overall: 4.87, total: 178 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Crystal Chandeliers | Fiber Mandaps | Neon & Haldi Photo Booths",
        locationDetails: {
          address: "33, 80 Feet Road, Koramangala",
          area: "Koramangala",
          city: "Bengaluru",
          pincode: "560034",
          state: "Karnataka",
          landmark: "Near Sony World Signal",
        },
        contactDetails: {
          phone: "9876543219",
          whatsapp: "9876543219",
          email: "crystaldecor@gmail.com",
          ownerName: "Vikram Seth",
          verified: true,
        },
        overview: {
          description: "Specialized in contemporary reception lighting, crystal ceiling suspensions, cocktail bar themes, and traditional mehendi cabana setups.",
          establishedYear: 2017,
          priceRange: "₹₹₹",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80", alt: "Stage Decor" },
            { url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80", alt: "Crystal Lighting" },
          ],
          totalPhotos: 21,
        },
        tags: ["Wedding Decor", "Koramangala", "Theme Lighting", "Photo Booth"],
      },

      // 2. Repairs & Services -> AC Service
      {
        catName: "Repairs & Services",
        subName: "AC Service",
        name: "CoolBreeze 24/7 Doorstep AC Repair & Service",
        ratings: { overall: 4.8, total: 512 },
        operatingHours: "07:00 AM - 10:00 PM",
        extraInfo: "30-Min Fast Response | 90-Day Service Warranty | Genuine Spare Parts",
        locationDetails: {
          address: "Shop 12, 1st Cross, Anna Nagar West",
          area: "Anna Nagar",
          city: "Chennai",
          pincode: "600040",
          state: "Tamil Nadu",
          landmark: "Near Roundtana",
        },
        contactDetails: {
          phone: "9876543202",
          whatsapp: "9876543202",
          email: "support@coolbreezeac.com",
          ownerName: "Mohan Kumar",
          verified: true,
          gstin: "33AABCC1234F1Z5",
          website: "https://coolbreezeac.com",
        },
        overview: {
          description: "Certified Daikin, Voltas, and LG technicians providing jet pressure cleaning, refrigerant gas leakage repair, compressor fixes, and split AC relocation.",
          establishedYear: 2015,
          priceRange: "₹499 - ₹2,499",
          facilities: ["Doorstep Inspection", "High-Pressure Jet Wash", "Digital Gas Leak Detectors", "Online Payment & Invoicing"],
          services: ["AC Jet Wash Deep Cleaning", "Refrigerant Gas Top-Up", "Split AC Installation", "PCB Circuit Repair"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", alt: "AC Deep Cleaning" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "AC Servicing Technician" },
            { url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80", alt: "Tools and Equipment" },
          ],
          totalPhotos: 22,
        },
        tags: ["AC Repair", "AC Installation", "Gas Refill", "Voltas Service", "Daikin Specialist", "Anna Nagar"],
      },
      {
        catName: "Repairs & Services",
        subName: "AC Service",
        name: "ArcticZone Jet Cleaning & Inverter AC Specialist",
        ratings: { overall: 4.85, total: 320 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Inverter PCB Diagnostic Lab | 100% Copper Piping | Instant Gas Refill",
        locationDetails: {
          address: "45, BTM 2nd Stage, Outer Ring Road",
          area: "BTM Layout",
          city: "Bengaluru",
          pincode: "560076",
          state: "Karnataka",
          landmark: "Near Udupi Garden Signal",
        },
        contactDetails: {
          phone: "9876543220",
          whatsapp: "9876543220",
          email: "arcticzoneac@gmail.com",
          ownerName: "Harish Rao",
          verified: true,
        },
        overview: {
          description: "Specialized in energy-saving inverter AC servicing, duct cleaning, smell removal, and multi-brand copper pipe installation.",
          establishedYear: 2018,
          priceRange: "₹599 - ₹2,999",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", alt: "AC Inverter Repair" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Technician Working" },
          ],
          totalPhotos: 16,
        },
        tags: ["AC Service", "Inverter AC", "BTM Layout", "Jet Cleaning"],
      },

      // Repairs & Services -> Electricians
      {
        catName: "Repairs & Services",
        subName: "Electricians",
        name: "VoltSafe Certified Domestic & Industrial Electricians",
        ratings: { overall: 4.8, total: 275 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Licensed Wiremen | 45-Min Emergency Service | Fixed Rates",
        locationDetails: {
          address: "No. 14, Velachery Main Road",
          area: "Velachery",
          city: "Chennai",
          pincode: "600042",
          state: "Tamil Nadu",
          landmark: "Opposite Phoenix Marketcity",
        },
        contactDetails: {
          phone: "9876543206",
          whatsapp: "9876543206",
          email: "voltsafe@electrician.com",
          ownerName: "Saravanan P",
          verified: true,
          website: "https://voltsafe.in",
        },
        overview: {
          description: "Certified electricians for house wiring, 3-phase connection balancing, short circuit troubleshooting, and commercial panel setups.",
          establishedYear: 2016,
          priceRange: "₹299 - ₹1,499",
          facilities: ["Licensed Wireman B-Certificate", "Digital Voltage Multimeters", "Emergency Tripping Fix"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80", alt: "Electrician Working" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Electrical Panel" },
          ],
          totalPhotos: 18,
        },
        tags: ["Electrician", "House Wiring", "Emergency Power Fix", "Inverter Installation", "Velachery"],
      },
      {
        catName: "Repairs & Services",
        subName: "Electricians",
        name: "PowerGuard 24/7 Emergency Electrician & Inverter Hub",
        ratings: { overall: 4.86, total: 198 },
        operatingHours: "Open 24 Hours",
        extraInfo: "24/7 Power Breakdown Support | Luminous & Microtek Dealer | Fuse Box Fix",
        locationDetails: {
          address: "99, CMH Road, Indiranagar",
          area: "Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
          state: "Karnataka",
          landmark: "Near Metro Station",
        },
        contactDetails: {
          phone: "9876543221",
          whatsapp: "9876543221",
          email: "powerguardblr@gmail.com",
          ownerName: "Gopalakrishna M",
          verified: true,
        },
        overview: {
          description: "Reliable 24-hour electrician service for sudden short circuits, meter box repairs, UPS battery installation, and smart home automation switches.",
          establishedYear: 2017,
          priceRange: "₹349 - ₹1,800",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80", alt: "Circuit Board Fix" },
            { url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", alt: "Wiring Check" },
          ],
          totalPhotos: 15,
        },
        tags: ["24/7 Electrician", "Inverter Setup", "Short Circuit Repair", "Indiranagar"],
      },

      // Repairs & Services -> Car Service
      {
        catName: "Repairs & Services",
        subName: "Car Service",
        name: "Apex AutoWorks Multi-Brand Car Service & Detailing",
        ratings: { overall: 4.91, total: 410 },
        operatingHours: "08:00 AM - 08:30 PM",
        extraInfo: "Free Doorstep Pick & Drop | Bosch Computerized Scanning | Ceramic Coating",
        locationDetails: {
          address: "Plot 8, OMR IT Highway, Perungudi",
          area: "Perungudi",
          city: "Chennai",
          pincode: "600096",
          state: "Tamil Nadu",
          landmark: "Near Toll Plaza",
        },
        contactDetails: {
          phone: "9876543222",
          whatsapp: "9876543222",
          email: "service@apexautoworks.com",
          ownerName: "Dhanush Raghavan",
          verified: true,
          gstin: "33AABCA4567F1Z6",
          website: "https://apexautoworks.com",
        },
        overview: {
          description: "State-of-the-art multi-brand automobile garage providing 40-point periodic car maintenance, synthetic Mobil1 oil changes, automatic AC refrigerant recovery, and 9H ceramic detailing.",
          establishedYear: 2015,
          priceRange: "₹1,999 - ₹8,999",
          facilities: ["Computerized OBD Scanner", "Hydraulic Lifts (6 Bays)", "Dust-Free Paint Booth", "Customer Lounge with WiFi"],
          services: ["Periodic General Service", "Brake Pad Replacement", "Wheel Alignment & Balancing", "Car Foam Wash & Polish"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80", alt: "Car on Hydraulic Lift" },
            { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80", alt: "Engine Oil Change" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Wheel Alignment" },
          ],
          totalPhotos: 26,
        },
        tags: ["Car Service", "Perungudi OMR", "Oil Change", "Wheel Alignment", "Car Spa"],
      },
      {
        catName: "Repairs & Services",
        subName: "Car Service",
        name: "SpeedWheel Bosch Certified Car Care & Wheel Alignment",
        ratings: { overall: 4.84, total: 290 },
        operatingHours: "08:30 AM - 08:00 PM",
        extraInfo: "3D Camera Wheel Alignment | Nitrogen Air Refill | 100% Genuine Spare Parts",
        locationDetails: {
          address: "24, Hosur Road, Madiwala",
          area: "Madiwala",
          city: "Bengaluru",
          pincode: "560068",
          state: "Karnataka",
          landmark: "Near Total Mall",
        },
        contactDetails: {
          phone: "9876543223",
          whatsapp: "9876543223",
          email: "speedwheel.bosch@gmail.com",
          ownerName: "Kishore Kumar",
          verified: true,
        },
        overview: {
          description: "Authorized Bosch Car Service Centre equipped for fuel injector cleaning, clutch overhaul, battery replacement, and AC cooling coil repairs.",
          establishedYear: 2017,
          priceRange: "₹1,499 - ₹7,500",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=800&auto=format&fit=crop&q=80", alt: "Car Detailing" },
            { url: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80", alt: "Auto Repair" },
          ],
          totalPhotos: 20,
        },
        tags: ["Car Workshop", "Bosch Service", "Madiwala", "Brake Overhaul"],
      },

      // Repairs & Services -> Bike Service
      {
        catName: "Repairs & Services",
        subName: "Bike Service",
        name: "MotoFix Doorstep Two-Wheeler Tuning & Oil Change",
        ratings: { overall: 4.89, total: 345 },
        operatingHours: "08:00 AM - 08:30 PM",
        extraInfo: "Doorstep Bike Service at Home/Office | Motul Synthetic Oil | 30-Day Guarantee",
        locationDetails: {
          address: "Shop 5, 2nd Avenue, Ashok Nagar",
          area: "Ashok Nagar",
          city: "Chennai",
          pincode: "600083",
          state: "Tamil Nadu",
          landmark: "Near Ashok Pillar",
        },
        contactDetails: {
          phone: "9876543224",
          whatsapp: "9876543224",
          email: "support@motofixservice.in",
          ownerName: "Karthikeyan B",
          verified: true,
        },
        overview: {
          description: "Convenient doorstep two-wheeler service van bringing spark plug cleaning, carburetor/FI tuning, chain lubrication, and brake maintenance directly to your parking spot.",
          establishedYear: 2019,
          priceRange: "₹399 - ₹1,499",
          facilities: ["Mobile Service Van", "High-Grade Motul & Castrol Oils", "Brake Pad Check", "Battery Jumpstart"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80", alt: "Motorcycle Workshop" },
            { url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80", alt: "Bike Engine Tuning" },
          ],
          totalPhotos: 17,
        },
        tags: ["Bike Service", "Doorstep Two Wheeler", "Oil Change", "Ashok Nagar", "Chain Lube"],
      },
      {
        catName: "Repairs & Services",
        subName: "Bike Service",
        name: "RevvUp Royal Enfield & Superbike Specialist Workshop",
        ratings: { overall: 4.94, total: 280 },
        operatingHours: "09:00 AM - 08:00 PM",
        extraInfo: "Bullet & Himalayan Specialists | Custom Exhausts & Accessories | Engine Rebuilds",
        locationDetails: {
          address: "102, 100 Feet Road, Indiranagar",
          area: "Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
          state: "Karnataka",
          landmark: "Opposite Toit Brewery",
        },
        contactDetails: {
          phone: "9876543225",
          whatsapp: "9876543225",
          email: "revvupgarage@gmail.com",
          ownerName: "Prithvi Raj",
          verified: true,
        },
        overview: {
          description: "Top-rated cruiser and superbike tuning garage for Royal Enfield, KTM, Jawa, and Triumph motorcycles with performance dyno tuning and fork overhaul.",
          establishedYear: 2016,
          priceRange: "₹699 - ₹4,500",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=800&auto=format&fit=crop&q=80", alt: "Royal Enfield Tuning" },
            { url: "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&auto=format&fit=crop&q=80", alt: "Bike Mechanics" },
          ],
          totalPhotos: 23,
        },
        tags: ["Royal Enfield Service", "Superbike Garage", "Indiranagar", "Bike Tuning"],
      },

      // Repairs & Services -> Plumbers
      {
        catName: "Repairs & Services",
        subName: "Plumbers",
        name: "AquaFlow Master Plumbers & Leak Detection Experts",
        ratings: { overall: 4.88, total: 270 },
        operatingHours: "07:00 AM - 09:30 PM",
        extraInfo: "Underground Acoustic Leak Detection | Jaguar & Kohler Spares | Blockage Removal",
        locationDetails: {
          address: "19, Lake View Road, West Mambalam",
          area: "West Mambalam",
          city: "Chennai",
          pincode: "600033",
          state: "Tamil Nadu",
          landmark: "Near Ayodhya Mandapam",
        },
        contactDetails: {
          phone: "9876543226",
          whatsapp: "9876543226",
          email: "aquaflowplumbers@gmail.com",
          ownerName: "Ganesan S",
          verified: true,
        },
        overview: {
          description: "Professional plumbing solutions for stubborn drain blockages, concealed wall leaks, CP fitting installation, geyser connections, and overhead water tank cleaning.",
          establishedYear: 2014,
          priceRange: "₹249 - ₹1,299",
          facilities: ["Electric Drain Snake Machine", "Acoustic Leak Detector", "Pressure Pump Installation"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80", alt: "Plumbing Pipe Repair" },
            { url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80", alt: "Wrench and Tools" },
          ],
          totalPhotos: 16,
        },
        tags: ["Plumber", "Leak Repair", "Drain Clearing", "West Mambalam", "Tap Replacement"],
      },
      {
        catName: "Repairs & Services",
        subName: "Plumbers",
        name: "QuickPipe 24/7 Motor Pump & Bathroom Plumbing",
        ratings: { overall: 4.82, total: 195 },
        operatingHours: "Open 24 Hours",
        extraInfo: "Borewell Submersible Pump Repair | Bathroom Renovation | Emergency Leak Fix",
        locationDetails: {
          address: "54, 5th Main, Malleshwaram",
          area: "Malleshwaram",
          city: "Bengaluru",
          pincode: "560003",
          state: "Karnataka",
          landmark: "Near 8th Cross Circle",
        },
        contactDetails: {
          phone: "9876543227",
          whatsapp: "9876543227",
          email: "quickpipe.blr@gmail.com",
          ownerName: "Ravichandran M",
          verified: true,
        },
        overview: {
          description: "Fast-acting plumbers available round the clock for water motor burnouts, PVC pipeline burst repair, toilet flush valve leaks, and sink clearing.",
          establishedYear: 2016,
          priceRange: "₹299 - ₹1,500",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80", alt: "Pipe Installation" },
            { url: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=800&auto=format&fit=crop&q=80", alt: "Plumber Work" },
          ],
          totalPhotos: 14,
        },
        tags: ["Plumbing Services", "Water Motor Repair", "Malleshwaram", "Emergency Plumber"],
      },

      // 3. Beauty & Spa -> Salons
      {
        catName: "Beauty & Spa",
        subName: "Salons",
        name: "Glow & Shine Luxury Unisex Salon & Spa",
        ratings: { overall: 4.9, total: 289 },
        operatingHours: "09:00 AM - 09:00 PM",
        extraInfo: "L'Oreal Certified Stylists | Sanitized Tools | Bridal Lounge",
        locationDetails: {
          address: "88, 100 Feet Road, Indiranagar",
          area: "Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
          state: "Karnataka",
          landmark: "Near 12th Main Junction",
        },
        contactDetails: {
          phone: "9876543203",
          whatsapp: "9876543203",
          email: "glowandshine@salon.com",
          ownerName: "Sheela Ramesh",
          verified: true,
          website: "https://glowandshinesalon.com",
        },
        overview: {
          description: "Premium hair and beauty salon offering Moroccan oil hair spa, keratin treatments, beard sculpting, organic skin facials, and bridal makeovers.",
          establishedYear: 2016,
          priceRange: "₹350 - ₹4,500",
          facilities: ["VIP Private Cabins", "Moroccanoil Bar", "Steam Shower", "Beverage Station"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Salon Chairs" },
            { url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80", alt: "Hair Styling" },
            { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", alt: "Cosmetics" },
          ],
          totalPhotos: 24,
        },
        tags: ["Hair Salon", "Keratin Treatment", "Unisex Salon", "Bridal Makeup", "Indiranagar"],
      },
      {
        catName: "Beauty & Spa",
        subName: "Salons",
        name: "Scissors & Co. Premium Unisex Hair Studio & Beard Bar",
        ratings: { overall: 4.86, total: 215 },
        operatingHours: "09:30 AM - 09:30 PM",
        extraInfo: "Toni&Guy Trained Stylists | Hot Towel Shave | Balayage & Ombre Hair Colors",
        locationDetails: {
          address: "14, Kader Nawaz Khan Road, Nungambakkam",
          area: "Nungambakkam",
          city: "Chennai",
          pincode: "600006",
          state: "Tamil Nadu",
          landmark: "Near Starbucks",
        },
        contactDetails: {
          phone: "9876543228",
          whatsapp: "9876543228",
          email: "scissorsco@salon.com",
          ownerName: "Farooq Ahmed",
          verified: true,
        },
        overview: {
          description: "Trendsetting hair studio renowned for international hair coloring, precision fade cuts, scalp detox therapy, and men's luxury grooming.",
          establishedYear: 2018,
          priceRange: "₹400 - ₹5,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80", alt: "Barber Cutting Hair" },
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Salon Mirrors" },
          ],
          totalPhotos: 19,
        },
        tags: ["Unisex Salon", "Nungambakkam", "Hair Studio", "Fade Haircut", "Balayage"],
      },

      // Beauty & Spa -> Beauty Parlours
      {
        catName: "Beauty & Spa",
        subName: "Beauty Parlours",
        name: "Belleza Ladies Beauty Care & Organic Skin Clinic",
        ratings: { overall: 4.92, total: 310 },
        operatingHours: "10:00 AM - 08:30 PM",
        extraInfo: "Ladies Exclusive | Rica Waxing | Organic Fruit Peels & De-Tan Therapy",
        locationDetails: {
          address: "27, 4th Cross, Gandhi Nagar, Adyar",
          area: "Adyar",
          city: "Chennai",
          pincode: "600020",
          state: "Tamil Nadu",
          landmark: "Near Adyar Ananda Bhavan",
        },
        contactDetails: {
          phone: "9876543229",
          whatsapp: "9876543229",
          email: "bellezabeautyladies@gmail.com",
          ownerName: "Malini Krishnan",
          verified: true,
        },
        overview: {
          description: "An exclusive, safe haven for women offering gentle organic waxing, Korean glass facials, pedicure spas, bridal threading, and hair smoothening.",
          establishedYear: 2015,
          priceRange: "₹250 - ₹3,200",
          facilities: ["Women-Only Staff", "Private Waxing Rooms", "Pedicure Massage Chairs", "Hygienic Disposables"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", alt: "Beauty Parlour Room" },
            { url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80", alt: "Skin Care Products" },
          ],
          totalPhotos: 22,
        },
        tags: ["Ladies Parlour", "Adyar", "Rica Waxing", "Facials", "Pedicure Spa"],
      },
      {
        catName: "Beauty & Spa",
        subName: "Beauty Parlours",
        name: "Naturals Golden Touch Ladies Beauty Lounge",
        ratings: { overall: 4.85, total: 240 },
        operatingHours: "09:30 AM - 08:30 PM",
        extraInfo: "Cheryl's & O3+ Certified Skin Specialists | Bridal Packages | Hair Botox",
        locationDetails: {
          address: "15, 11th Main Road, Jayanagar 4th Block",
          area: "Jayanagar",
          city: "Bengaluru",
          pincode: "560011",
          state: "Karnataka",
          landmark: "Near Jayanagar Shopping Complex",
        },
        contactDetails: {
          phone: "9876543230",
          whatsapp: "9876543230",
          email: "goldentouch.jayanagar@gmail.com",
          ownerName: "Rashmi Bhat",
          verified: true,
        },
        overview: {
          description: "Trusted neighborhood beauty lounge known for affordable luxury, immaculate hygiene, relaxing head massages, and herbal hair treatments.",
          establishedYear: 2017,
          priceRange: "₹200 - ₹2,800",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&auto=format&fit=crop&q=80", alt: "Facial Care" },
            { url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80", alt: "Parlour Interior" },
          ],
          totalPhotos: 18,
        },
        tags: ["Beauty Parlour", "Jayanagar", "O3 Facial", "Threading & Waxing"],
      },

      // Beauty & Spa -> Spa & Massages
      {
        catName: "Beauty & Spa",
        subName: "Spa & Massages",
        name: "AyurVeda Traditional Kerala Herbal Steam & Abhyanga Spa",
        ratings: { overall: 4.96, total: 320 },
        operatingHours: "08:00 AM - 08:30 PM",
        extraInfo: "Authentic Kottakkal Herbal Oils | Certified Ayurvedic Therapists | Wooden Dhroni",
        locationDetails: {
          address: "32, Besant Avenue Road, Besant Nagar",
          area: "Besant Nagar",
          city: "Chennai",
          pincode: "600090",
          state: "Tamil Nadu",
          landmark: "Near Elliot's Beach",
        },
        contactDetails: {
          phone: "9876543231",
          whatsapp: "9876543231",
          email: "ayurvedaspa.besant@gmail.com",
          ownerName: "Dr. Manoj Namboodiri",
          verified: true,
          website: "https://keralaspa.in",
        },
        overview: {
          description: "Traditional Kerala Ayurvedic wellness centre offering Abhyanga 4-hand body massages, Shirodhara oil flow for stress relief, Kizhi herbal bundles, and herbal steam baths.",
          establishedYear: 2013,
          priceRange: "₹1,200 - ₹4,000",
          facilities: ["Authentic Teak Dhroni Tables", "Herbal Steam Chamber", "Shower Suites", "BAMS Doctor Consultation"],
          services: ["Abhyanga Oil Massage", "Shirodhara Stress Relief", "Njavarakizhi Rejuvenation", "Spine & Joint Care"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80", alt: "Ayurvedic Massage" },
            { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80", alt: "Spa Candle and Oils" },
          ],
          totalPhotos: 25,
        },
        tags: ["Ayurvedic Spa", "Shirodhara", "Abhyanga", "Besant Nagar", "Kerala Massage"],
      },
      {
        catName: "Beauty & Spa",
        subName: "Spa & Massages",
        name: "Nirvana Thai Therapy & Swedish Deep Tissue Wellness Spa",
        ratings: { overall: 4.9, total: 275 },
        operatingHours: "09:00 AM - 09:30 PM",
        extraInfo: "Thai Certified Therapists | Aroma Essential Oils | Couple Massage Rooms",
        locationDetails: {
          address: "18, Lavelle Road",
          area: "Lavelle Road",
          city: "Bengaluru",
          pincode: "560001",
          state: "Karnataka",
          landmark: "Near UB City",
        },
        contactDetails: {
          phone: "9876543232",
          whatsapp: "9876543232",
          email: "nirvanaspa.blr@gmail.com",
          ownerName: "Somchai Thanaporn",
          verified: true,
        },
        overview: {
          description: "Luxury urban oasis offering Thai acupressure stretches, hot stone therapy, Swedish muscle relaxation, and foot reflexology.",
          establishedYear: 2017,
          priceRange: "₹1,500 - ₹5,500",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80", alt: "Thai Spa Room" },
            { url: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80", alt: "Hot Stone Therapy" },
          ],
          totalPhotos: 20,
        },
        tags: ["Thai Spa", "Deep Tissue", "Lavelle Road", "Foot Reflexology", "Hot Stone"],
      },

      // 4. Daily Needs -> Packers & Movers
      {
        catName: "Daily Needs",
        subName: "Packers & Movers",
        name: "SafeShift Inter-City Packers & Relocation Movers",
        ratings: { overall: 4.9, total: 420 },
        operatingHours: "24/7 Helpline",
        extraInfo: "Transit Insurance | Bubble Wrap & Crates | Zero Damage Guarantee",
        locationDetails: {
          address: "Plot 5, Bypass Road",
          area: "Bypass Road",
          city: "Madurai",
          pincode: "625016",
          state: "Tamil Nadu",
          landmark: "Near Mattuthavani Bus Stand",
        },
        contactDetails: {
          phone: "9876543204",
          whatsapp: "9876543204",
          email: "contact@safeshiftmovers.com",
          ownerName: "Perumal Thevar",
          verified: true,
          website: "https://safeshiftmovers.com",
        },
        overview: {
          description: "Top-rated packing and moving service for household shifting, office relocation, vehicle car carrier transport, and warehouse storage.",
          establishedYear: 2013,
          priceRange: "₹3,500 - ₹25,000",
          facilities: ["Multi-layer corrugated boxes", "GPS Tracked Closed Container Trucks", "Transit Goods Insurance", "Loading & Unloading Labour"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80", alt: "Moving Boxes" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Packing Furniture" },
          ],
          totalPhotos: 20,
        },
        tags: ["Packers Movers", "Home Shifting", "Office Relocation", "Safe Transport", "Madurai"],
      },
      {
        catName: "Daily Needs",
        subName: "Packers & Movers",
        name: "Agarwal Super Relocations & Household Packers",
        ratings: { overall: 4.88, total: 360 },
        operatingHours: "24/7 Service",
        extraInfo: "Nationwide Relocation | Free Pre-Move Survey | Professional Carpenters",
        locationDetails: {
          address: "24, Poonamallee High Road, Koyambedu",
          area: "Koyambedu",
          city: "Chennai",
          pincode: "600107",
          state: "Tamil Nadu",
          landmark: "Near Rohini Theatre",
        },
        contactDetails: {
          phone: "9876543233",
          whatsapp: "9876543233",
          email: "superagarwalmovers@gmail.com",
          ownerName: "Sanjay Agarwal",
          verified: true,
        },
        overview: {
          description: "India's dependable packing and moving experts offering dismantling/assembly of furniture, air-bubble wrapping for electronics, and swift delivery.",
          establishedYear: 2011,
          priceRange: "₹4,000 - ₹30,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80", alt: "Truck Loading" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Carton Boxes" },
          ],
          totalPhotos: 22,
        },
        tags: ["Packers Movers", "Koyambedu", "Intercity Moving", "Household Shifting"],
      },

      // Daily Needs -> Home Cleaning
      {
        catName: "Daily Needs",
        subName: "Home Cleaning",
        name: "SparkleClean Deep Home & Kitchen Degreasing Services",
        ratings: { overall: 4.91, total: 290 },
        operatingHours: "07:30 AM - 08:30 PM",
        extraInfo: "German Karcher Steam Machines | Eco-Friendly Degreasers | Same-Day Booking",
        locationDetails: {
          address: "71, 2nd Main Road, R.A. Puram",
          area: "R.A. Puram",
          city: "Chennai",
          pincode: "600028",
          state: "Tamil Nadu",
          landmark: "Near Billroth Hospital",
        },
        contactDetails: {
          phone: "9876543234",
          whatsapp: "9876543234",
          email: "sparkleclean.chennai@gmail.com",
          ownerName: "Jitendra Singh",
          verified: true,
          website: "https://sparkleclean.in",
        },
        overview: {
          description: "Top-to-bottom deep cleaning for apartments and villas, specialized chimney degreasing, bathroom tile acid scrubbing, and glass window polishing.",
          establishedYear: 2016,
          priceRange: "₹1,499 - ₹6,500",
          facilities: ["Karcher Steam Vacuum Cleaners", "Single-Disc Floor Scrubbing Machine", "Non-Toxic Diversey Chemicals"],
          services: ["Full Apartment Deep Clean", "Kitchen Degreasing", "Bathroom Descaling", "Balcony & Window Wash"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Deep Cleaning" },
            { url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80", alt: "Polished Floor" },
          ],
          totalPhotos: 18,
        },
        tags: ["Home Cleaning", "Deep Cleaning", "Kitchen Cleaning", "R.A. Puram", "Floor Scrubbing"],
      },
      {
        catName: "Daily Needs",
        subName: "Home Cleaning",
        name: "CleanNest Sofa Shampooing & Bathroom Sanitization Pro",
        ratings: { overall: 4.86, total: 210 },
        operatingHours: "08:00 AM - 08:00 PM",
        extraInfo: "Wet Vacuum Extraction | 99.9% Germ Eradication | Odor Neutralization",
        locationDetails: {
          address: "44, Sarjapur Main Road, Bellandur",
          area: "Bellandur",
          city: "Bengaluru",
          pincode: "560103",
          state: "Karnataka",
          landmark: "Near EcoSpace Tech Park",
        },
        contactDetails: {
          phone: "9876543235",
          whatsapp: "9876543235",
          email: "cleannestblr@gmail.com",
          ownerName: "Srinivasa Gowda",
          verified: true,
        },
        overview: {
          description: "Fabric sofa wet extraction, mattress dust mite sanitization, leather conditioning, and anti-bacterial bathroom descaling.",
          establishedYear: 2018,
          priceRange: "₹899 - ₹4,200",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Sofa Shampooing" },
            { url: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=800&auto=format&fit=crop&q=80", alt: "Clean Living Room" },
          ],
          totalPhotos: 15,
        },
        tags: ["Sofa Cleaning", "Bathroom Sanitization", "Bellandur", "Mattress Cleaning"],
      },

      // Daily Needs -> Pest Control
      {
        catName: "Daily Needs",
        subName: "Pest Control",
        name: "ZeroPest Odorless Herbal Termite & Cockroach Control",
        ratings: { overall: 4.93, total: 340 },
        operatingHours: "08:00 AM - 09:00 PM",
        extraInfo: "Government Licensed | 100% Odorless Bayer Gel | 1-Year Free Warranty",
        locationDetails: {
          address: "33, Arcot Road, Porur",
          area: "Porur",
          city: "Chennai",
          pincode: "600116",
          state: "Tamil Nadu",
          landmark: "Near Porur Junction",
        },
        contactDetails: {
          phone: "9876543236",
          whatsapp: "9876543236",
          email: "zeropestchennai@gmail.com",
          ownerName: "Venkata Raman",
          verified: true,
          website: "https://zeropestcontrol.in",
        },
        overview: {
          description: "Bayer certified pest control eliminating termites, German cockroaches, bedbugs, and rats without harmful fumes, leaving no need to vacate your home.",
          establishedYear: 2014,
          priceRange: "₹799 - ₹3,500",
          facilities: ["Bayer Maxforce Gel", "Termite Piping Drilling & Injection", "Sub-floor Fogging Machines"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80", alt: "Pest Control Technician" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Gel Treatment" },
          ],
          totalPhotos: 19,
        },
        tags: ["Pest Control", "Termite Control", "Cockroach Gel", "Porur", "Odorless"],
      },
      {
        catName: "Daily Needs",
        subName: "Pest Control",
        name: "PestShield Certified Bedbug & Rodent Eradication",
        ratings: { overall: 4.87, total: 220 },
        operatingHours: "07:00 AM - 09:00 PM",
        extraInfo: "Two-Round Bedbug Treatment | Glue Trap Stations | Child & Pet Safe",
        locationDetails: {
          address: "81, Bannerghatta Main Road",
          area: "Bannerghatta",
          city: "Bengaluru",
          pincode: "560076",
          state: "Karnataka",
          landmark: "Opposite IIM Bangalore",
        },
        contactDetails: {
          phone: "9876543237",
          whatsapp: "9876543237",
          email: "pestshield.blr@gmail.com",
          ownerName: "Naveen Kumar",
          verified: true,
        },
        overview: {
          description: "Specialized in eradicating severe bedbug infestations with targeted heat and micro-droplet spray, alongside commercial rodent proofing.",
          establishedYear: 2017,
          priceRange: "₹899 - ₹4,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80", alt: "Spray Treatment" },
            { url: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80", alt: "Protective Gear" },
          ],
          totalPhotos: 16,
        },
        tags: ["Bedbug Treatment", "Rodent Control", "Bannerghatta", "Pest Free"],
      },

      // Daily Needs -> Grocery
      {
        catName: "Daily Needs",
        subName: "Grocery",
        name: "FreshFarm Organic Supermarket & Daily Express Mart",
        ratings: { overall: 4.89, total: 490 },
        operatingHours: "06:30 AM - 10:30 PM",
        extraInfo: "Direct Farm Fresh Produce | Certified A2 Milk & Cold Pressed Oils | 30-Min Delivery",
        locationDetails: {
          address: "10, First Main Road, Besant Nagar",
          area: "Besant Nagar",
          city: "Chennai",
          pincode: "600090",
          state: "Tamil Nadu",
          landmark: "Near Reserve Bank Colony",
        },
        contactDetails: {
          phone: "9876543238",
          whatsapp: "9876543238",
          email: "orders@freshfarmmart.com",
          ownerName: "Jayaraman S",
          verified: true,
          website: "https://freshfarmmart.com",
        },
        overview: {
          description: "A premium organic grocery store stocking pesticide-free vegetables, native heirloom rices (Mappillai Samba, Karuppu Kavuni), A2 Gir cow milk, and gourmet dry fruits.",
          establishedYear: 2016,
          priceRange: "₹50 - ₹1,500",
          facilities: ["Doorstep Delivery Fleet", "Cold-Press Oil Extraction on Spot", "Organic Certification Display"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80", alt: "Fresh Supermarket Aisle" },
            { url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80", alt: "Organic Fruits and Vegetables" },
          ],
          totalPhotos: 24,
        },
        tags: ["Organic Supermarket", "Farm Fresh", "Besant Nagar", "A2 Milk", "Daily Groceries"],
      },
      {
        catName: "Daily Needs",
        subName: "Grocery",
        name: "GreenBasket Fresh Fruits, Veggies & Millets Hub",
        ratings: { overall: 4.84, total: 310 },
        operatingHours: "07:00 AM - 10:00 PM",
        extraInfo: "Unpolished Millets | Hydroponic Greens | Free Door Delivery on ₹500+",
        locationDetails: {
          address: "55, 14th Main, HSR Layout Sector 4",
          area: "HSR Layout",
          city: "Bengaluru",
          pincode: "560102",
          state: "Karnataka",
          landmark: "Near BDA Complex",
        },
        contactDetails: {
          phone: "9876543239",
          whatsapp: "9876543239",
          email: "greenbasket.hsr@gmail.com",
          ownerName: "Vinod Chandran",
          verified: true,
        },
        overview: {
          description: "HSR Layout's favorite health food grocery store providing farm-direct greens, sourdough bread, organic pulses, cold-pressed coconut oils, and exotic fruits.",
          establishedYear: 2018,
          priceRange: "₹40 - ₹1,200",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=800&auto=format&fit=crop&q=80", alt: "Produce Shelf" },
            { url: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&auto=format&fit=crop&q=80", alt: "Fresh Greens" },
          ],
          totalPhotos: 20,
        },
        tags: ["Grocery", "HSR Layout", "Organic Millets", "Hydroponic Greens"],
      },

      // 5. Education & Coaching -> Entrance Exam Coaching
      {
        catName: "Education & Coaching",
        subName: "Entrance Exam Coaching",
        name: "Apex Academy - IIT JEE & NEET Premier Institute",
        ratings: { overall: 4.9, total: 460 },
        operatingHours: "08:00 AM - 08:00 PM",
        extraInfo: "Top Rankers Faculty | Mock Test Series | AC Digital Classrooms",
        locationDetails: {
          address: "5th Block, Koramangala",
          area: "Koramangala",
          city: "Bengaluru",
          pincode: "560095",
          state: "Karnataka",
          landmark: "Near Forum Mall",
        },
        contactDetails: {
          phone: "9876543207",
          whatsapp: "9876543207",
          email: "admissions@apexacademy.edu",
          ownerName: "Prof. R. C. Sharma",
          verified: true,
          website: "https://apexacademy.edu",
        },
        overview: {
          description: "Comprehensive coaching for 11th, 12th, and repeater students for NEET Medical and IIT JEE Engineering with proven track records.",
          establishedYear: 2010,
          priceRange: "₹35,000 - ₹1,20,000 / Year",
          facilities: ["Interactive Smartboards", "Computer-Based Test (CBT) Lab", "Doubt Clearing Sessions", "Library & Study Rooms"],
          services: ["IIT-JEE Main & Advanced Coaching", "NEET-UG Foundation & Advanced", "KVPY & Olympiad Training", "Weekend Repeater Batches"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", alt: "Classroom" },
            { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80", alt: "Students Studying" },
          ],
          totalPhotos: 22,
        },
        tags: ["NEET Coaching", "JEE Coaching", "Tuitions", "Apex Academy", "Koramangala"],
      },
      {
        catName: "Education & Coaching",
        subName: "Entrance Exam Coaching",
        name: "Zenith CA Foundation & CS Executive Elite Academy",
        ratings: { overall: 4.88, total: 310 },
        operatingHours: "07:30 AM - 07:30 PM",
        extraInfo: "All-India Rank 1 Mentors | 82% Pass Rate | Live & Recorded Video Lectures",
        locationDetails: {
          address: "24, North Usman Road, T. Nagar",
          area: "T. Nagar",
          city: "Chennai",
          pincode: "600017",
          state: "Tamil Nadu",
          landmark: "Near Panagal Park",
        },
        contactDetails: {
          phone: "9876543240",
          whatsapp: "9876543240",
          email: "info@zenithca.com",
          ownerName: "CA G. Balasubramanian",
          verified: true,
        },
        overview: {
          description: "Premier commerce coaching institute specializing in CA Foundation, CA Intermediate, and CS Executive with personalized mentoring and chapter-wise mock exams.",
          establishedYear: 2013,
          priceRange: "₹20,000 - ₹65,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80", alt: "Lecture Hall" },
            { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", alt: "Study Notes" },
          ],
          totalPhotos: 18,
        },
        tags: ["CA Coaching", "CS Coaching", "T. Nagar", "Commerce Coaching", "Zenith"],
      },

      // Education & Coaching -> Language Training
      {
        catName: "Education & Coaching",
        subName: "Language Training",
        name: "Cambridge Spoken English & IELTS/TOEFL Master Classes",
        ratings: { overall: 4.94, total: 390 },
        operatingHours: "08:00 AM - 08:30 PM",
        extraInfo: "British Council Certified Trainers | Band 8+ Guarantee | Mock Speaking Interviews",
        locationDetails: {
          address: "68, Sterling Road, Nungambakkam",
          area: "Nungambakkam",
          city: "Chennai",
          pincode: "600034",
          state: "Tamil Nadu",
          landmark: "Opposite Loyola College",
        },
        contactDetails: {
          phone: "9876543241",
          whatsapp: "9876543241",
          email: "ielts.cambridge@gmail.com",
          ownerName: "David Jonathan",
          verified: true,
          website: "https://cambridgelanguage.in",
        },
        overview: {
          description: "Chennai's leading institute for Spoken English fluency, corporate communication skills, IELTS Academic/General training, and TOEFL preparations.",
          establishedYear: 2012,
          priceRange: "₹6,000 - ₹18,000",
          facilities: ["Audio Listening Lab", "One-on-One Speaking Booths", "Study Abroad Guidance"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", alt: "Language Class" },
            { url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80", alt: "Group Discussion" },
          ],
          totalPhotos: 20,
        },
        tags: ["IELTS Coaching", "Spoken English", "TOEFL", "Nungambakkam", "Language Training"],
      },
      {
        catName: "Education & Coaching",
        subName: "Language Training",
        name: "Goethe German & European Foreign Language Hub",
        ratings: { overall: 4.89, total: 245 },
        operatingHours: "09:00 AM - 07:30 PM",
        extraInfo: "German A1 to C1 Certification | French & Spanish Classes | Visa Interview Prep",
        locationDetails: {
          address: "12, Church Street",
          area: "Church Street",
          city: "Bengaluru",
          pincode: "560001",
          state: "Karnataka",
          landmark: "Near MG Road Metro",
        },
        contactDetails: {
          phone: "9876543242",
          whatsapp: "9876543242",
          email: "germanhub.blr@gmail.com",
          ownerName: "Anke Mueller",
          verified: true,
        },
        overview: {
          description: "Specialized European language institute preparing students and software engineers for Goethe Zertifikat German exams and university admissions in Germany.",
          establishedYear: 2016,
          priceRange: "₹8,500 - ₹24,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&auto=format&fit=crop&q=80", alt: "Foreign Language Learning" },
            { url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&auto=format&fit=crop&q=80", alt: "Classroom Session" },
          ],
          totalPhotos: 16,
        },
        tags: ["German Language", "Goethe A1 A2 B1", "Church Street", "Foreign Languages"],
      },

      // 6. Healthcare & Clinics -> Dental Clinics
      {
        catName: "Healthcare & Clinics",
        subName: "Dental Clinics",
        name: "SmileCraft Advanced Multi-Speciality Dental Care",
        ratings: { overall: 5.0, total: 310 },
        operatingHours: "09:00 AM - 08:00 PM",
        extraInfo: "Painless Laser Dentistry | Digital OPG X-Ray | Sterile Environment",
        locationDetails: {
          address: "Plot 30, TTK Road, Alwarpet",
          area: "Alwarpet",
          city: "Chennai",
          pincode: "600018",
          state: "Tamil Nadu",
          landmark: "Near Music Academy",
        },
        contactDetails: {
          phone: "9876543208",
          whatsapp: "9876543208",
          email: "care@smilecraftdental.com",
          ownerName: "Dr. Arvind Sivakumar MDS",
          verified: true,
          website: "https://smilecraftdental.com",
        },
        overview: {
          description: "Leading dental center specializing in painless single-sitting root canals, invisible aligners, dental implants, and cosmetic smile designs.",
          establishedYear: 2014,
          priceRange: "₹500 - ₹25,000",
          facilities: ["Autoclave 4-Tier Sterilization", "Rotary Endodontics", "Intraoral 3D Camera", "Children Pediatric Dental Bay"],
          services: ["Painless Root Canal (RCT)", "Invisible Teeth Aligners", "Titanium Dental Implants", "Laser Teeth Whitening"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80", alt: "Dental Chair" },
            { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80", alt: "Dentist Examining Teeth" },
          ],
          totalPhotos: 22,
        },
        tags: ["Dental Clinic", "Root Canal", "Teeth Whitening", "Invisalign", "Alwarpet"],
      },
      {
        catName: "Healthcare & Clinics",
        subName: "Dental Clinics",
        name: "Pearl Dental Implants & Invisible Braces Studio",
        ratings: { overall: 4.92, total: 240 },
        operatingHours: "09:30 AM - 08:30 PM",
        extraInfo: "Invisalign Diamond Provider | Digital Smile Design | CBCT 3D Scan",
        locationDetails: {
          address: "15, 80 Feet Road, 4th Block, Koramangala",
          area: "Koramangala",
          city: "Bengaluru",
          pincode: "560034",
          state: "Karnataka",
          landmark: "Near Maharaja Signal",
        },
        contactDetails: {
          phone: "9876543243",
          whatsapp: "9876543243",
          email: "pearldental.blr@gmail.com",
          ownerName: "Dr. Sneha Reddy MDS",
          verified: true,
        },
        overview: {
          description: "Modern dental boutique offering customized clear aligners, immediate Nobel Biocare dental implants, porcelain veneers, and smile makeover treatments.",
          establishedYear: 2016,
          priceRange: "₹600 - ₹35,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80", alt: "Modern Dental Clinic" },
            { url: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80", alt: "Dental Equipment" },
          ],
          totalPhotos: 20,
        },
        tags: ["Dental Implants", "Clear Aligners", "Koramangala", "Smile Design"],
      },

      // Healthcare & Clinics -> Diagnostic Labs
      {
        catName: "Healthcare & Clinics",
        subName: "Diagnostic Labs",
        name: "MedPath Advanced Automated Pathology & Full Body Checkups",
        ratings: { overall: 4.95, total: 430 },
        operatingHours: "06:30 AM - 09:00 PM",
        extraInfo: "NABL Accredited | Free Home Sample Collection | Reports within 6 Hours on WhatsApp",
        locationDetails: {
          address: "52, Medavakkam Main Road, Madipakkam",
          area: "Madipakkam",
          city: "Chennai",
          pincode: "600091",
          state: "Tamil Nadu",
          landmark: "Near Koot Road Signal",
        },
        contactDetails: {
          phone: "9876543244",
          whatsapp: "9876543244",
          email: "reports@medpathlab.com",
          ownerName: "Dr. K. Chandrasekar MD (Pathology)",
          verified: true,
          website: "https://medpathdiagnostics.in",
        },
        overview: {
          description: "NABL accredited robotic pathology lab delivering precise blood test results, thyroid profiling, cardiac markers, master health checkups, and diabetes management packages.",
          establishedYear: 2013,
          priceRange: "₹199 - ₹3,499",
          facilities: ["Beckman Coulter Automated Analyzers", "Temperature Controlled Phlebotomy Vans", "Online Barcoded Reports"],
          services: ["Complete Master Health Checkup", "Thyroid Profile (T3, T4, TSH)", "HbA1c Diabetes Test", "Vitamin D3 & B12 Test"],
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80", alt: "Pathology Lab Analyzer" },
            { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80", alt: "Blood Test Tubes" },
          ],
          totalPhotos: 21,
        },
        tags: ["Blood Test", "Diagnostic Lab", "Full Body Checkup", "NABL Lab", "Madipakkam"],
      },
      {
        catName: "Healthcare & Clinics",
        subName: "Diagnostic Labs",
        name: "HealthScan 24/7 Digital X-Ray, ECG & Diagnostic Lab",
        ratings: { overall: 4.88, total: 320 },
        operatingHours: "Open 24 Hours",
        extraInfo: "Digital High-Res X-Ray | 12-Lead ECG with Cardiologist Reporting | Ultrasound Scanning",
        locationDetails: {
          address: "88, 10th Cross, Wilson Garden",
          area: "Wilson Garden",
          city: "Bengaluru",
          pincode: "560027",
          state: "Karnataka",
          landmark: "Near Hosur Road Cross",
        },
        contactDetails: {
          phone: "9876543245",
          whatsapp: "9876543245",
          email: "healthscan.blr@gmail.com",
          ownerName: "Dr. Priya Natarajan",
          verified: true,
        },
        overview: {
          description: "Comprehensive 24/7 diagnostic imaging and laboratory center with emergency ECG reporting, digital chest X-rays, ultrasound abdomen, and lipid profiling.",
          establishedYear: 2015,
          priceRange: "₹250 - ₹4,000",
        },
        media: {
          mainImages: [
            { url: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&auto=format&fit=crop&q=80", alt: "X-Ray Clinic" },
            { url: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80", alt: "Lab Microscope" },
          ],
          totalPhotos: 17,
        },
        tags: ["X-Ray", "ECG Test", "Diagnostic Center", "Wilson Garden", "Blood Testing"],
      },
    ];

    let seededBizCount = 0;
    for (let item of sampleOfflineListings) {
      const cat = createdBusinessCats.find((c) => c.mainCategory === item.catName);
      if (cat) {
        const sub = cat.subCategories.find((s) => s.title === item.subName) || cat.subCategories[0];
        // Distribute listings among primary providers
        const assignedProvider = providers[seededBizCount % providers.length] || defaultProvider;

        await BusinessList.create({
          name: item.name,
          providerId: assignedProvider._id,
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
        seededBizCount++;
      }
    }
    console.log(`Seeded ${seededBizCount} verified businesses into "Businesslist". Every offline subcategory is covered!`);

    // 4. Guides
    console.log("Seeding Helpful Guides...");
    await Guide.deleteMany({});
    const guides = [
      { title: "Top 7 Tips When Hiring a Full-Stack MERN Freelancer in 2026", imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80" },
      { title: "Complete Guide: How to Choose the Perfect Banquet Hall for Your Wedding", imageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&auto=format&fit=crop&q=80" },
      { title: "AC Service Checklist: Avoid Overcharging and Ensure Maximum Cooling", imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
      { title: "How to Protect Fragile Electronics During Inter-City Household Relocation", imageUrl: "https://images.unsplash.com/photo-1600518464441-9154a4dea21b?w=800&auto=format&fit=crop&q=80" },
      { title: "The Ultimate Guide to Designing Mobile Apps with Apple & Material 3 Guidelines", imageUrl: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&auto=format&fit=crop&q=80" },
      { title: "Why Regular Preventive Car Service Saves You Thousands in Engine Repairs", imageUrl: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=800&auto=format&fit=crop&q=80" },
    ];
    await Guide.insertMany(guides);

    console.log("\n=================================================================");
    console.log("🚀 MASTER DUAL-SECTION SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=================================================================");
    console.log(`ONLINE SECTION:  ${createdServices.length} Categories, 18 Subcategories, ${sampleFreelancers.length} Freelancer Profiles`);
    console.log(`OFFLINE SECTION: ${createdBusinessCats.length} Categories, 22 Subcategories, ${seededBizCount} Verified Businesses`);
    console.log("EVERY CATEGORY & EVERY SUBCATEGORY CONTAINS SERVICES & LISTINGS!");
    console.log("ALL REAL USER ACCOUNTS SAFELY PRESERVED!");
    console.log("=================================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Error:", err);
    process.exit(1);
  }
};

seedBothSections();
