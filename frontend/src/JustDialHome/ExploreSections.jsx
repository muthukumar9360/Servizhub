import React, { useState, useEffect } from "react";

// --- Sample data for static sections ---
const dealsAndOffers = [
  // --- Banks & Financial ---
  "Kotak Mahindra Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Canara Bank",
  "Axis Bank",
  "State Bank of India",

  // --- Electronics & Gadgets ---
  "Sony",
  "Apple Store",
  "Croma",
  "Reliance Digital",
  "Vijay Sales",
  "Samsung Smart Plaza",

  // --- Fashion & Lifestyle ---
  "Beverly Hills Polo Club",
  "Max Fashion",
  "Levi’s",
  "Allen Solly",
  "Arrow",
  "Zudio",
  "Pantaloons",

  // --- Food & Beverages ---
  "McDonald's",
  "Starbucks",
  "CCD",
  "Barbeque Nation",
  "Wow! Momo",
  "The Belgian Waffle Co.",
  "Amul Parlour",
  "Bikanervala",
  "A2B (Adyar Ananda Bhavan)",

  // --- Travel & Hospitality ---
  "OYO Rooms",
  "FabHotels",
  "Treebo Hotels",
  "Taj Hotels",
  "ITC Hotels",
  "Radisson Blu",
  "Marriott Hotels",
  "Zoomcar",
  "SpiceJet",
  "Vistara Airlines",

  // --- Health & Wellness ---
  "Apollo Pharmacy",
  "MedPlus",
  "NetMeds",
  "1mg",
  "VLCC",
  "Naturals Salon",
  "Lakme Salon",
  "Toni & Guy",

  // --- Groceries & Home Essentials ---
  "Big Bazaar",
  "DMart",
  "Reliance Fresh",
  "Zepto",
  "Blinkit",
  "Swiggy Instamart",
  "Amazon Pantry",
  "Flipkart Grocery",
  "Metro Cash & Carry",

  // --- Entertainment & Online Services ---
  "INOX Cinemas",
  "PVR Cinemas",
  "BookMyShow",
  "Netflix",
  "Amazon Prime Video",
  "Disney+ Hotstar",
  "Zee5",
  "Sony LIV",

  // --- Miscellaneous Popular Brands ---
  "Archies",
  "Apollo Tyres",
  "Ceat Tyres",
  "Hero MotoCorp",
  "Honda Two Wheelers",
  "Maruti Suzuki",
  "Pepperfry",
  "Sleepwell",
  "Nilkamal Furniture",
  "Amazon Shop",
  "Flipkart Deals",
  "Snapdeal Offers",
  "Myntra Sale",
  "Nykaa Beauty",
];

// --- Category Tabs ---
const categoryTabs = [
  "Accommodation",
  "Beauty & Wellness",
  "Clothing & Fashion",
  "Doctors & Clinics",
  "Education",
  "Food & Restaurants",
  "Gadgets & Electronics",
  "Health & Fitness",
  "Interior & Home Decor",
  "Jewellery & Accessories",
  "Kids & Toys",
  "Legal & Finance",
  "Medical & Healthcare",
  "Non-Profit & NGOs",
  "Office & Business Services",
  "Pet & Animal Care",
  "Quick Links",
  "Real Estate",
  "Shopping & Retail",
  "Transport & Travel",
  "Utilities & Repair",
  "Vehicles & Automobiles",
  "Wedding & Events",
  "Xerox & Printing",
  "Yoga & Spirituality",
  "Zoological & Nature",
];

// --- Main Component ---
const ExploreSections = () => {
  const [activeCategory, setActiveCategory] = useState("Accommodation");
  const [popularSearches, setPopularSearches] = useState([]);

  // Simulate fetching dynamic data
  useEffect(() => {
    // Example dynamic category data (can replace with API call)
    const categoryData = {
      Accommodation: [
        "AC Lodging Services",
        "Beach Resorts",
        "Bungalows On Hire",
        "Farm House",
        "Guest House",
        "Hostels For Men",
        "Hostels For Women",
        "Hotels",
        "Resorts",
        "Dormitory Services",
        "Home Stay",
        "3 Star Hotels",
        "4 Star Hotels",
        "5 Star Hotels",
        "2 Star Hotels",
        "Couple Friendly Hotels",
        "Government Hostels",
        "Paying Guest Accommodations",
        "Village Resorts",
        "Villas On Hire",
        "Water Park Resorts",
        "Private Lodges",
        "Family Resorts",
        "Luxury Hotels",
        "Budget Hotels",
        "Hill View Resorts",
        "Student Hostels",
        "AC Guest House",
        "Government Lodging",
        "Weekend Resorts",
        "Holiday Cottages",
        "Mountain Lodges",
        "Beach View Rooms",
        "Homestays",
        "Cottages On Rent",
        "Farm Stays",
        "Nature Resorts",
        "Eco Lodges",
        "Women Hostels",
        "Men Hostels",
        "AC Dormitories",
        "Student PGs",
        "Couple Stays",
        "Resorts With Pool",
        "Luxury Villas",
        "Boutique Hotels",
        "Hill Resorts",
        "Guest Accommodations",
        "Service Apartments",
        "Hostel Rooms",
      ],

      "Beauty & Wellness": [
        "Beauty Parlours",
        "Spas",
        "Salons",
        "Hair Stylists",
        "Massage Centers",
        "Makeup Artists",
        "Nail Studios",
        "Tattoo Studios",
        "Barbers",
        "Skincare Clinics",
        "Weight Loss Centers",
        "Dietitians",
        "Yoga Centers",
        "Fitness Trainers",
        "Zumba Classes",
        "Meditation Centers",
        "Ayurvedic Spas",
        "Wellness Retreats",
        "Laser Hair Removal Clinics",
        "Hair Transplant Clinics",
        "Cosmetic Clinics",
        "Slimming Centers",
        "Bridal Makeup Artists",
        "Body Spa Services",
        "Men’s Grooming Salons",
        "Organic Beauty Stores",
        "Foot Spa",
        "Unisex Salons",
        "Aromatherapy Centers",
        "Hydrotherapy Spas",
      ],

      "Clothing & Fashion": [
        "Men’s Clothing Stores",
        "Women’s Clothing Stores",
        "Kids Wear Shops",
        "Boutiques",
        "Designer Stores",
        "Bridal Wear Shops",
        "Tailoring Services",
        "Fabric Stores",
        "Ethnic Wear Stores",
        "Western Wear Shops",
        "Jeans Dealers",
        "T-Shirt Dealers",
        "Saree Showrooms",
        "Kurti Shops",
        "Footwear Dealers",
        "Jewellery Showrooms",
        "Watch Stores",
        "Belt & Wallet Dealers",
        "Handbag Stores",
        "Sportswear Shops",
        "Uniform Suppliers",
        "Fashion Accessories Dealers",
        "Winter Wear Stores",
        "Ethnic Jewellery Shops",
        "Luxury Fashion Stores",
        "Online Clothing Boutiques",
        "Custom Tailors",
        "Baby Clothing Stores",
        "Party Wear Stores",
        "Embroidery Shops",
      ],

      "Doctors & Clinics": [
        "General Physicians",
        "Dentists",
        "Eye Specialists",
        "ENT Specialists",
        "Orthopedic Doctors",
        "Gynecologists",
        "Pediatricians",
        "Dermatologists",
        "Cardiologists",
        "Neurologists",
        "Physiotherapists",
        "Diabetologists",
        "Urologists",
        "Psychiatrists",
        "Homeopathy Doctors",
        "Ayurvedic Doctors",
        "Chiropractors",
        "Gastroenterologists",
        "Oncologists",
        "Surgeons",
        "Dieticians",
        "Sexologists",
        "Allergy Specialists",
        "Nephrologists",
        "Endocrinologists",
        "Pathology Labs",
        "X-Ray Centers",
        "Hearing Aid Clinics",
        "Eye Care Centers",
        "Dental Clinics",
      ],

      Education: [
        "Schools",
        "Colleges",
        "Universities",
        "Coaching Centers",
        "Online Training Institutes",
        "Computer Training Institutes",
        "Music Schools",
        "Dance Academies",
        "Drawing Classes",
        "Language Schools",
        "Montessori Schools",
        "Day Care Centers",
        "Competitive Exam Coaching",
        "Tuition Centers",
        "Abacus Classes",
        "Vocational Training Institutes",
        "Fashion Designing Institutes",
        "Culinary Schools",
        "Art & Craft Classes",
        "Photography Institutes",
        "Engineering Colleges",
        "Medical Colleges",
        "Commerce Colleges",
        "Polytechnic Colleges",
        "Online Tutors",
        "Study Abroad Consultants",
        "Career Counselors",
        "Typing Classes",
        "Public Speaking Institutes",
        "Robotics Classes",
      ],

      "Food & Restaurants": [
        "Restaurants",
        "Cafes",
        "Bakeries",
        "Ice Cream Parlours",
        "Sweet Shops",
        "Caterers",
        "Food Delivery Services",
        "Juice Centers",
        "Pizza Outlets",
        "Fast Food Corners",
        "Fine Dining Restaurants",
        "Veg Restaurants",
        "Non-Veg Restaurants",
        "Buffet Restaurants",
        "Seafood Restaurants",
        "Barbecue Restaurants",
        "Chinese Restaurants",
        "South Indian Restaurants",
        "North Indian Restaurants",
        "Continental Restaurants",
        "Food Trucks",
        "Dessert Shops",
        "Online Food Services",
        "Organic Cafes",
        "Multi Cuisine Restaurants",
        "Sandwich Bars",
        "Burger Outlets",
        "Pasta Houses",
        "Family Restaurants",
        "Takeaway Services",
      ],

      "Gadgets & Electronics": [
        "Mobile Dealers",
        "Laptop Dealers",
        "Computer Shops",
        "Camera Stores",
        "Home Appliance Dealers",
        "Television Dealers",
        "Refrigerator Dealers",
        "Washing Machine Dealers",
        "Microwave Oven Dealers",
        "Audio System Dealers",
        "Air Conditioner Dealers",
        "Mobile Accessories Dealers",
        "Laptop Repair Services",
        "Computer Repair Services",
        "Printer Dealers",
        "Gaming Console Dealers",
        "CCTV Dealers",
        "Security System Installers",
        "Inverter Dealers",
        "Solar Panel Dealers",
        "Home Theatre Dealers",
        "Headphone Dealers",
        "Tablet Dealers",
        "Smart Watch Stores",
        "Drone Dealers",
        "LED Light Dealers",
        "Power Bank Dealers",
        "Projector Dealers",
        "Camera Lens Stores",
        "Bluetooth Speaker Dealers",
      ],

      "Health & Fitness": [
        "Gyms",
        "Yoga Studios",
        "Fitness Trainers",
        "Zumba Classes",
        "Pilates Centers",
        "Martial Arts Schools",
        "Swimming Classes",
        "Aerobics Centers",
        "Wellness Clinics",
        "Spa & Massage Centers",
        "Nutritionists",
        "Dietitians",
        "Slimming Centers",
        "Rehabilitation Centers",
        "Health Clubs",
        "Meditation Centers",
        "Sports Coaching",
        "CrossFit Centers",
        "Cycling Clubs",
        "Running Clubs",
        "Health Supplements Stores",
        "Protein Shops",
        "Ayurvedic Wellness Centers",
        "Therapy Centers",
        "Sauna & Steam Centers",
        "Weight Management Clinics",
        "Acupuncture Clinics",
        "Bodybuilding Trainers",
        "Personal Trainers",
        "Fitness Equipment Dealers",
      ],

      "Interior & Home Decor": [
        "Interior Designers",
        "Home Decor Stores",
        "Furniture Dealers",
        "Modular Kitchen Dealers",
        "Curtain Shops",
        "Wallpaper Dealers",
        "Lighting Stores",
        "Carpet Dealers",
        "False Ceiling Contractors",
        "Painting Contractors",
        "Home Renovation Services",
        "Bathroom Fittings Dealers",
        "Flooring Contractors",
        "Glass Dealers",
        "Upholstery Shops",
        "Wood Polishers",
        "Wardrobe Designers",
        "Blinds Dealers",
        "Home Automation Dealers",
        "Smart Home Installers",
        "Decorative Items Shops",
        "Antique Stores",
        "Outdoor Furniture Dealers",
        "Wall Art Stores",
        "Mirror Dealers",
        "Custom Furniture Makers",
        "Handicraft Dealers",
        "PVC Door Dealers",
        "Home Improvement Services",
        "False Ceiling Designers",
      ],

      "Jewellery & Accessories": [
        "Gold Jewellery Showrooms",
        "Silver Jewellery Shops",
        "Diamond Jewellery Dealers",
        "Imitation Jewellery Shops",
        "Fashion Jewellery Stores",
        "Antique Jewellery Shops",
        "Wedding Jewellery Dealers",
        "Jewellery Designers",
        "Jewellery Repair Shops",
        "Pearl Dealers",
        "Gemstone Dealers",
        "Jewellery Manufacturers",
        "Bangle Stores",
        "Bracelet Dealers",
        "Ring Designers",
        "Necklace Shops",
        "Jewellery Exporters",
        "Jewellery Wholesalers",
        "Earring Shops",
        "Jewellery Appraisers",
        "Anklet Dealers",
        "Jewellery Polishing Services",
        "Jewellery Certification Centers",
        "Artificial Jewellery Boutiques",
        "Custom Jewellery Designers",
        "Luxury Watch Stores",
        "Gold Refiners",
        "Platinum Jewellery Shops",
        "Bead Stores",
        "Jewellery Casting Services",
      ],

      "Kids & Toys": [
        "Toy Stores",
        "Baby Product Shops",
        "Kids Wear Stores",
        "Children’s Book Stores",
        "Play Schools",
        "Indoor Play Areas",
        "Baby Furniture Dealers",
        "Birthday Gift Shops",
        "Kids Shoe Stores",
        "Cycle Dealers",
        "Cradle Dealers",
        "Educational Toy Shops",
        "School Bag Dealers",
        "Board Game Shops",
        "Doll Stores",
      ],

      "Legal & Finance": [
        "Lawyers",
        "Chartered Accountants",
        "GST Consultants",
        "Income Tax Consultants",
        "Financial Advisors",
        "Insurance Agents",
        "Loan Providers",
        "Company Registration Services",
        "Auditors",
        "Investment Consultants",
        "Legal Advisors",
        "Wealth Management Services",
        "Stock Brokers",
        "Mutual Fund Agents",
        "Tax Filing Consultants",
      ],

      "Medical & Healthcare": [
        "Hospitals",
        "Clinics",
        "Diagnostic Centers",
        "Blood Banks",
        "Pathology Labs",
        "Pharmacies",
        "Ambulance Services",
        "Eye Hospitals",
        "Dental Hospitals",
        "Physiotherapy Centers",
        "Orthopedic Hospitals",
        "ENT Hospitals",
        "Multi-Specialty Hospitals",
        "Cardiology Clinics",
        "Fertility Centers",
      ],

      "Non-Profit & NGOs": [
        "Animal Welfare NGOs",
        "Child Care NGOs",
        "Elderly Care NGOs",
        "Environmental NGOs",
        "Education NGOs",
        "Health NGOs",
        "Women Empowerment NGOs",
        "Blood Donation NGOs",
        "Charitable Trusts",
        "Disaster Relief NGOs",
        "Social Welfare Organizations",
        "Cultural NGOs",
        "Skill Development NGOs",
        "Rural Development NGOs",
        "Youth Organizations",
      ],

      "Office & Business Services": [
        "Printers & Publishers",
        "Courier Services",
        "Advertising Agencies",
        "Digital Marketing Companies",
        "IT Services",
        "Business Consultants",
        "Recruitment Agencies",
        "Event Management Companies",
        "Software Developers",
        "Graphic Design Firms",
        "Office Furniture Dealers",
        "Corporate Training Firms",
        "SEO Companies",
        "Web Development Companies",
        "BPO Services",
      ],

      "Pet & Animal Care": [
        "Pet Shops",
        "Veterinary Clinics",
        "Pet Grooming Services",
        "Pet Boarding Centers",
        "Dog Trainers",
        "Pet Food Dealers",
        "Animal Shelters",
        "Aquarium Dealers",
        "Bird Pet Shops",
        "Pet Toy Shops",
        "Pet Adoption Centers",
        "Pet Insurance Agents",
        "Pet Photographers",
        "Pet Accessory Dealers",
        "Dog Walkers",
      ],

      "Quick Links": [
        "Home",
        "About Us",
        "Contact Us",
        "Terms & Conditions",
        "Privacy Policy",
        "Help Center",
        "Advertise With Us",
        "FAQs",
        "Feedback",
        "Blog",
        "Careers",
        "Sitemap",
        "Partners",
        "Support",
        "Login/Register",
      ],

      "Real Estate": [
        "Property Dealers",
        "Real Estate Agents",
        "Builders",
        "Apartments For Rent",
        "Flats For Sale",
        "Land Developers",
        "Commercial Properties",
        "Home Loan Providers",
        "Construction Companies",
        "Architects",
        "Building Contractors",
        "Interior Decorators",
        "Vastu Consultants",
        "Home Inspectors",
        "Property Valuers",
      ],

      "Shopping & Retail": [
        "Supermarkets",
        "Department Stores",
        "Clothing Stores",
        "Electronics Stores",
        "Jewellery Stores",
        "Footwear Shops",
        "Book Stores",
        "Stationery Shops",
        "Furniture Stores",
        "Gift Shops",
        "Home Decor Shops",
        "Toy Stores",
        "Cosmetic Shops",
        "Perfume Stores",
        "Handicraft Stores",
      ],

      "Transport & Travel": [
        "Travel Agents",
        "Tour Operators",
        "Car Rentals",
        "Taxi Services",
        "Bus Operators",
        "Bike Rentals",
        "Train Ticket Agents",
        "Flight Booking Agents",
        "Cargo Services",
        "Courier Companies",
        "Packers and Movers",
        "Logistics Companies",
        "Tour Guides",
        "Adventure Travel Agencies",
        "Visa Consultants",
      ],

      "Utilities & Repair": [
        "Electricians",
        "Plumbers",
        "Carpenters",
        "Painters",
        "AC Repair Services",
        "Washing Machine Repair",
        "Mobile Repair Shops",
        "Computer Repair Services",
        "Water Purifier Repair",
        "TV Repair Services",
        "Fridge Repair Technicians",
        "Gas Stove Repair",
        "Microwave Repair",
        "Home Appliance Services",
        "Geyser Repair Services",
      ],

      "Vehicles & Automobiles": [
        "Car Dealers",
        "Used Car Dealers",
        "Bike Dealers",
        "Car Accessories Dealers",
        "Tyre Dealers",
        "Car Rental Services",
        "Auto Repair Shops",
        "Car Wash Centers",
        "Battery Dealers",
        "Car Service Centers",
        "Insurance Agents",
        "Spare Parts Dealers",
        "Truck Dealers",
        "Electric Vehicle Dealers",
        "Car Detailing Centers",
      ],

      "Wedding & Events": [
        "Wedding Planners",
        "Caterers",
        "Banquet Halls",
        "Event Management Companies",
        "Photographers",
        "Decorators",
        "DJ Services",
        "Mehndi Artists",
        "Makeup Artists",
        "Florists",
        "Mandap Decorators",
        "Lighting Services",
        "Stage Designers",
        "Invitation Card Printers",
        "Event Venues",
      ],

      "Xerox & Printing": [
        "Photocopy Shops",
        "Digital Printing Shops",
        "Flex Printing Services",
        "Screen Printing",
        "Visiting Card Printers",
        "Banner Printing",
        "Offset Printing",
        "Label Printing",
        "3D Printing",
        "Book Binding Services",
        "Sticker Printing",
        "Pamphlet Printing",
        "Poster Printing",
        "T-Shirt Printing",
        "Customized Gift Printing",
      ],

      "Yoga & Spirituality": [
        "Yoga Centers",
        "Meditation Halls",
        "Spiritual Retreats",
        "Astrology Services",
        "Reiki Healing Centers",
        "Tarot Readers",
        "Numerologists",
        "Crystal Healing Centers",
        "Vastu Consultants",
        "Chakra Healing Centers",
        "Ayurvedic Centers",
        "Pranic Healing Centers",
        "Holistic Therapy Centers",
        "Satsang Groups",
        "Wellness Resorts",
      ],

      "Zoological & Nature": [
        "Wildlife Sanctuaries",
        "National Parks",
        "Bird Sanctuaries",
        "Zoo Parks",
        "Botanical Gardens",
        "Aquariums",
        "Nature Camps",
        "Eco Tourism Centers",
        "Safari Parks",
        "Animal Rescue Centers",
        "Nature Photography Spots",
        "Forest Resorts",
        "Wildlife NGOs",
        "Animal Shelters",
        "Nature Clubs",
      ],
    };

    setPopularSearches(categoryData[activeCategory] || []);
  }, [activeCategory]);

  return (
    <section className="px-12 bg-gray-50 text-gray-800">
      {/* --- Popular Categories --- */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-8 underline mt-8">Popular Categories</h2>

        {/* Tabs - Scrollable horizontally */}
        <div className="overflow-x-auto whitespace-nowrap mb-4 pb-2">
          <div className="inline-flex gap-3">
            {categoryTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveCategory(tab)}
                className={`px-4 py-2 rounded-md font-semibold transition-all duration-300 shrink-0 ${
                  activeCategory === tab
                    ? "bg-blue-600 text-white text-md font-bold"
                    : "bg-white text-gray-800 border hover:bg-gray-100 text-md"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Category Links */}
        <div className="text-sm leading-relaxed flex flex-wrap gap-x-2">
          {popularSearches.map((item, index) => (
            <a
              key={index}
              href="#"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {item}
              {index < popularSearches.length - 1 && " |"}
            </a>
          ))}
        </div>
      </div>
      {/* --- Trending Searches --- */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-8 underline">Trending Searches</h2>
        <div className="text-sm flex flex-wrap gap-x-2 leading-relaxed">
          {[
            // --- Education & Training ---
            "English Medium Schools",
            "Spoken English Classes",
            "Coaching Classes",
            "Dance Classes",
            "Music Classes",
            "Yoga Classes",

            // --- Home & Moving Services ---
            "Packers And Movers",
            "Car Transport Services",
            "Bike Transport Services",
            "House Cleaning Services",
            "Pest Control Services",
            "Plumbing Services",

            // --- Events & Wedding Services ---
            "Wedding Photographers",
            "Caterers",
            "Banquet Halls",
            "Marriage Halls",
            "Makeup Artists",

            // --- Health & Wellness ---
            "Ayurvedic Doctors",
            "Homeopathy Doctors",
            "Dentists",
            "Eye Clinics",
            "Skin Clinics",
            "ENT Doctors",
            "Child Specialists",

            // --- Food & Restaurants ---
            "Restaurants",
            "Bakeries",
            "Ice Cream Parlours",
            "Sweet Shops",
            "Catering Services",


            // --- Business & Professionals ---
            "Income Tax Consultants",
            "Chartered Accountants",
            "Advocates",
            "Company Registration Consultants",
            "Insurance Agents",
            "Property Dealers",

            // --- Automobiles ---
            "Car Repair & Services",
            "Bike Repair & Services",
            "Car Wash Services",
            "Used Car Dealers",
            "Tyre Dealers",
            "Battery Dealers",

            // --- Shops & Dealers ---
            "Pet Food Dealers",
            "Mobile Phone Dealers",
            "Jewellery Shops",
            "Clothing Stores",
            "Book Stores",
            "Grocery Stores",

            // --- Courier & Logistics ---
            "Courier Services For USA",
            "Local Courier Services",
            "Cargo Agents",
            "Freight Forwarders",
            "Logistics Companies",

            // --- Other Trending ---
            "Astrologers",
            "Vastu Consultants",
            "Numerologists",
            "Pandit For Puja",
            "Tour Packages",
          ]
            .sort()
            .map((item, index) => (
              <a
                key={index}
                href="#"
                className="hover:text-blue-600 transition-colors duration-200"
              >
                {item}
                {index < 56 && " |"}
              </a>
            ))}
        </div>
      </div>

      {/* --- Deals and Offers --- */}
      <div className="mb-10">
        <h2 className="text-3xl font-bold mb-8 underline">Deals and Offers</h2>
        <div className="text-sm flex flex-wrap gap-x-2 leading-relaxed">
          {dealsAndOffers.map((item, index) => (
            <a
              key={index}
              href="#"
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {item}
              {index < dealsAndOffers.length - 1 && " |"}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExploreSections;
