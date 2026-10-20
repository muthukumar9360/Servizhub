const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const EquipmentCategory = require("../models/EquipmentCategory");
const EquipmentListing = require("../models/EquipmentListing");
const Booking = require("../models/Booking");
const DamageReport = require("../models/DamageReport");
const AuditLog = require("../models/AuditLog");

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    console.log("Connecting to MongoDB for Master Seed...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully!");

    console.log("Cleaning old database documents...");
    await Promise.all([
      User.deleteMany({}),
      EquipmentCategory.deleteMany({}),
      EquipmentListing.deleteMany({}),
      Booking.deleteMany({}),
      DamageReport.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    console.log("1. Seeding Users (SuperAdmin, Admin, Provider, User)...");
    const superAdmin = await User.create({
      fullName: "Super Admin",
      username: "superadmin",
      email: "superadmin@servizio.com",
      phone: "9876543210",
      password: "SuperAdmin@123",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    const admin = await User.create({
      fullName: "Platform Admin",
      username: "admin",
      email: "admin@servizio.com",
      phone: "9876543211",
      password: "Admin@123",
      role: "ADMIN",
      status: "ACTIVE",
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    const provider = await User.create({
      fullName: "Metro Heavy Equipment Depots",
      username: "metrodepot",
      email: "provider@servizio.com",
      phone: "9876543212",
      password: "Provider@123",
      role: "PROVIDER",
      status: "ACTIVE",
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    const renter = await User.create({
      fullName: "Karthik Construction Renter",
      username: "karthikrenter",
      email: "user@servizio.com",
      phone: "9876543213",
      password: "User@123",
      role: "USER",
      status: "ACTIVE",
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    console.log("2. Seeding Equipment Categories...");
    const categories = await EquipmentCategory.insertMany([
      {
        mainCategory: "Construction & Heavy Machinery",
        slug: "construction-heavy-machinery",
        description: "Excavators, mobile cranes, compactors, and earth-moving machinery for short-term construction site hire.",
        homeImage: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          { title: "Hydraulic Excavators", description: "20-ton CAT excavators", image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=600&auto=format&fit=crop&q=80" },
          { title: "Mobile Telescopic Cranes", description: "50-ton hydraulic boom cranes", image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80" },
        ],
      },
      {
        mainCategory: "Audio/Visual & Cinema Gear",
        slug: "audiovisual-cinema-gear",
        description: "Professional digital cinema cameras, prime lenses, studio lighting, and broadcast audio recorders.",
        homeImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          { title: "4K Digital Cinema Cameras", description: "Sony FX6 & RED V-Raptor packages", image: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=600&auto=format&fit=crop&q=80" },
          { title: "LED Monolights & Softboxes", description: "Aputure 600x Pro studio lights", image: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=600&auto=format&fit=crop&q=80" },
        ],
      },
      {
        mainCategory: "Event Sound & Stage Equipment",
        slug: "event-sound-stage",
        description: "10,000W JBL line array sound systems, digital mixing consoles, stage lighting, and wireless microphone systems.",
        homeImage: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          { title: "Line Array Speaker Systems", description: "JBL VRX 932LAP 10,000W systems", image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=600&auto=format&fit=crop&q=80" },
        ],
      },
      {
        mainCategory: "Industrial Power Tools & Generators",
        slug: "industrial-power-tools-generators",
        description: "Silent Cummins diesel generators, heavy jackhammers, concrete cutters, and portable power stations.",
        homeImage: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
        subCategories: [
          { title: "Silent Diesel Generators", description: "62.5 kVA Cummins Silent Gensets", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80" },
        ],
      },
    ]);

    console.log("3. Seeding Equipment Listings...");
    const equipments = await EquipmentListing.insertMany([
      {
        name: "CAT 320 Hydraulic Heavy Excavator",
        slug: "cat-320-hydraulic-heavy-excavator",
        description: "20-Ton CAT 320 Hydraulic Excavator equipped with heavy-duty digging bucket and breaker piping. Ideal for earthmoving and site preparation.",
        category: categories[0]._id,
        subCategoryId: categories[0].subCategories[0]._id,
        owner: provider._id,
        brand: "Caterpillar",
        modelName: "320 D3",
        specifications: [
          { key: "Operating Weight", value: "20,500 kg" },
          { key: "Engine Power", value: "148 HP" },
          { key: "Attachment", value: "Hydraulic Breaker Piping Included" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 }],
        condition: "EXCELLENT",
        rentalPrice: 4500,
        pricingType: "PER_DAY",
        securityDeposit: 15000,
        quantity: 2,
        location: { address: "Industrial Highway Yard 4", city: "Chennai", state: "Tamil Nadu", pincode: "600028" },
        pickupInstructions: "Depot pick-up available between 7 AM - 7 PM.",
        deliveryAvailable: true,
        deliveryCharge: 1500,
        availabilityStatus: "AVAILABLE",
        approvalStatus: "APPROVED",
        averageRating: 4.9,
        totalReviews: 12,
      },
      {
        name: "Sony FX6 Cinema Camera Package",
        slug: "sony-fx6-cinema-camera-package",
        description: "Full-Frame Sony FX6 Cinema Camera Kit with 24-70mm f/2.8 GM Lens, dual 160GB CFexpress cards, 2x V-mount batteries, and Miller tripod.",
        category: categories[1]._id,
        subCategoryId: categories[1].subCategories[0]._id,
        owner: provider._id,
        brand: "Sony",
        modelName: "FX6 Cinema Line",
        specifications: [
          { key: "Sensor", value: "4K Full-Frame CMOS" },
          { key: "Lens", value: "Sony 24-70mm f/2.8 GM II" },
          { key: "Media", value: "2x 160GB CFexpress Type A" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 }],
        condition: "EXCELLENT",
        rentalPrice: 3200,
        pricingType: "PER_DAY",
        securityDeposit: 10000,
        quantity: 3,
        location: { address: "Film City Studio Depot", city: "Madurai", state: "Tamil Nadu", pincode: "625001" },
        pickupInstructions: "Studio verification required at handover.",
        deliveryAvailable: false,
        deliveryCharge: 0,
        availabilityStatus: "AVAILABLE",
        approvalStatus: "APPROVED",
        averageRating: 5.0,
        totalReviews: 18,
      },
      {
        name: "62.5 kVA Silent Cummins Generator",
        slug: "62-5-kva-silent-cummins-generator",
        description: "Silent Diesel Generator with acoustic canopy, automatic transfer switch, and distribution cables. Ideal for wedding halls and outdoor events.",
        category: categories[3]._id,
        subCategoryId: categories[3].subCategories[0]._id,
        owner: provider._id,
        brand: "Cummins",
        modelName: "C62D5 Silent",
        specifications: [
          { key: "Power Output", value: "62.5 kVA / 50 kW" },
          { key: "Noise Level", value: "75 dBA @ 1 meter" },
          { key: "Fuel Type", value: "High-Speed Diesel" },
        ],
        images: [{ url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80", isPrimary: true, order: 0 }],
        condition: "EXCELLENT",
        rentalPrice: 3500,
        pricingType: "PER_DAY",
        securityDeposit: 8000,
        quantity: 4,
        location: { address: "Power Depot Yard 2", city: "Coimbatore", state: "Tamil Nadu", pincode: "641001" },
        pickupInstructions: "Mobile transport trailer supplied upon request.",
        deliveryAvailable: true,
        deliveryCharge: 1200,
        availabilityStatus: "AVAILABLE",
        approvalStatus: "APPROVED",
        averageRating: 4.8,
        totalReviews: 24,
      },
    ]);

    console.log("4. Seeding Sample Booking...");
    const sampleBooking = await Booking.create({
      bookingNumber: "BK-889900-101",
      renter: renter._id,
      equipment: equipments[0]._id,
      provider: provider._id,
      startDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      rentalDays: 5,
      dailyRate: 4500,
      totalRentalFee: 22500,
      securityDeposit: 15000,
      deliveryFee: 1500,
      totalAmount: 39000,
      paymentStatus: "PAID",
      bookingStatus: "ACTIVE",
      returnStatus: "NOT_RETURNED",
      pickupDetails: "Industrial Highway Depot Yard",
    });

    console.log("5. Seeding Master Audit Logs...");
    await AuditLog.create({
      actor: superAdmin._id,
      action: "MASTER_SEED_COMPLETED",
      entityType: "System",
      metadata: { totalUsers: 4, totalCategories: 4, totalEquipments: 3 },
      ipAddress: "127.0.0.1",
    });

    console.log("\n========================================================");
    console.log("✅ MASTER DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("========================================================");
    console.log("Credentials for testing:");
    console.log("👉 Super Admin: superadmin@servizio.com | Pass: SuperAdmin@123");
    console.log("👉 Admin:       admin@servizio.com      | Pass: Admin@123");
    console.log("👉 Provider:    provider@servizio.com   | Pass: Provider@123");
    console.log("👉 User/Renter: user@servizio.com       | Pass: User@123");
    console.log("========================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error running Master Seed script:", err);
    process.exit(1);
  }
};

seedData();
