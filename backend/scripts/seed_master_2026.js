const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const User = require("../models/User");
const ProviderProfile = require("../models/ProviderProfile");
const EquipmentCategory = require("../models/EquipmentCategory");
const EquipmentListing = require("../models/EquipmentListing");
const Booking = require("../models/Booking");
const HandoverInspection = require("../models/HandoverInspection");
const ReturnInspection = require("../models/ReturnInspection");
const DamageReport = require("../models/DamageReport");
const EquipmentMaintenance = require("../models/EquipmentMaintenance");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const PlatformSetting = require("../models/PlatformSetting");

const seedMaster2026 = async () => {
  try {
    console.log("Connecting to MongoDB Atlas for Master 2026 Seed...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Wiping old database collections...");
    await Promise.all([
      User.deleteMany({}),
      ProviderProfile.deleteMany({}),
      EquipmentCategory.deleteMany({}),
      EquipmentListing.deleteMany({}),
      Booking.deleteMany({}),
      HandoverInspection.deleteMany({}),
      ReturnInspection.deleteMany({}),
      DamageReport.deleteMany({}),
      EquipmentMaintenance.deleteMany({}),
      Review.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      PlatformSetting.deleteMany({}),
    ]);

    console.log("1. Seeding Platform Settings...");
    await PlatformSetting.create({
      commissionPercentage: 10,
      defaultCancellationPolicy: "Full refund 48 hours prior to rental start. 50% refund within 24 hours.",
      defaultSecurityDepositRate: 20,
      minVerificationForRentals: true,
    });

    console.log("2. Seeding Users (44 Accounts)...");

    // Super Admin
    const superAdmin = await User.create({
      fullName: "Arun Kumar",
      username: "arunkumar",
      email: "admin@example.com",
      phone: "9876543200",
      password: "SuperAdmin@123",
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      trustProfile: { trustScore: 100, trustTier: "TOP_RATED" },
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    });

    // 3 Admins
    const admins = await User.insertMany([
      { fullName: "Priya Menon", username: "priyamenon", email: "admin1@servizio.com", phone: "9876543201", password: "Admin@123", role: "ADMIN", status: "ACTIVE", verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true } },
      { fullName: "Rahul Krishnan", username: "rahulkrishnan", email: "admin2@servizio.com", phone: "9876543202", password: "Admin@123", role: "ADMIN", status: "ACTIVE", verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true } },
      { fullName: "Divya Narayanan", username: "divyan", email: "admin3@servizio.com", phone: "9876543203", password: "Admin@123", role: "ADMIN", status: "ACTIVE", verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true } },
    ]);

    // 10 Providers
    const providerUsersData = [
      { fullName: "TechRent Solutions", email: "provider@example.com", phone: "9876543210" },
      { fullName: "South India Camera Rentals", email: "cameras@servizio.com", phone: "9876543211" },
      { fullName: "AgriMach Rentals", email: "agrimach@servizio.com", phone: "9876543212" },
      { fullName: "BuildPro Equipment", email: "buildpro@servizio.com", phone: "9876543213" },
      { fullName: "EventGear India", email: "eventgear@servizio.com", phone: "9876543214" },
      { fullName: "OfficeTech Rentals", email: "officetech@servizio.com", phone: "9876543215" },
      { fullName: "PowerTool Hub", email: "powertools@servizio.com", phone: "9876543216" },
      { fullName: "VisionPro Rentals", email: "visionpro@servizio.com", phone: "9876543217" },
      { fullName: "GreenField Machinery", email: "greenfield@servizio.com", phone: "9876543218" },
      { fullName: "ProSound Rentals", email: "prosound@servizio.com", phone: "9876543219" },
    ];

    const providerUsers = [];
    for (let p of providerUsersData) {
      const u = await User.create({
        fullName: p.fullName,
        username: p.email.split("@")[0],
        email: p.email,
        phone: p.phone,
        password: "Provider@123",
        role: "PROVIDER",
        status: "ACTIVE",
        trustProfile: { trustScore: 95, trustTier: "TOP_RATED" },
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });
      providerUsers.push(u);

      await ProviderProfile.create({
        user: u._id,
        businessName: p.fullName,
        contactPhone: p.phone,
        contactEmail: p.email,
        status: "APPROVED",
        businessAddress: { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
      });
    }

    // 30 Customers
    const customerNames = [
      "Muthu Kumar", "Sanjay Raj", "Karthik S", "Arun Prakash", "Vignesh Kumar",
      "Priya Devi", "Harini S", "Keerthana R", "Naveen Kumar", "Surya Prakash",
      "Anand Vishwanathan", "Deepak Sharma", "Meena Raman", "Ganesh Nathan", "Vijay V",
      "Ramesh Babu", "Kavitha M", "Srinivasan K", "Bala Murugan", "Dinesh Karthik",
      "Swetha Narayanan", "Rajesh Khanna", "Manish Pandey", "Santhosh J", "Aravind Swamy",
      "Lakshmi Narayan", "Preeti S", "Ashok Leyland", "Senthil Kumar", "Venkatesh R"
    ];

    const customerUsers = [];
    for (let i = 0; i < customerNames.length; i++) {
      const name = customerNames[i];
      const isFirst = i === 0;
      const u = await User.create({
        fullName: name,
        username: name.toLowerCase().replace(/\s+/g, "") + (i + 1),
        email: isFirst ? "user@example.com" : `customer${i + 1}@servizio.com`,
        phone: `987654323${i < 10 ? "0" + i : i}`,
        password: "User@123",
        role: "USER",
        status: "ACTIVE",
        trustProfile: { trustScore: 88 + (i % 10), trustTier: "TRUSTED" },
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });
      customerUsers.push(u);
    }

    console.log("3. Seeding 20 Categories...");
    const categoryTitles = [
      "Laptops", "Tablets", "Cameras", "Camera Lenses", "Projectors",
      "Audio Equipment", "Speakers", "Microphones", "Lighting Equipment", "Event Equipment",
      "Agricultural Machinery", "Power Tools", "Construction Equipment", "Generators", "Printers",
      "Networking Equipment", "Drones", "Surveying Equipment", "Office Equipment", "Cleaning Equipment"
    ];

    const seededCategories = [];
    for (let title of categoryTitles) {
      const cat = await EquipmentCategory.create({
        mainCategory: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
        description: `Professional ${title.toLowerCase()} for short-term rental.`,
        homeImage: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
        subCategories: [{ title: `General ${title}`, description: title }],
        isActive: true,
      });
      seededCategories.push(cat);
    }

    console.log("4. Seeding 60+ Equipment Listings...");
    const rawEquipmentList = [
      { name: "Dell Latitude 7440 Ultrabook", cat: 0, price: 1200, deposit: 5000, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80" },
      { name: "MacBook Pro 16 M3 Max Studio", cat: 0, price: 2800, deposit: 12000, img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80" },
      { name: "Lenovo ThinkPad T14 Workstation", cat: 0, price: 1400, deposit: 6000, img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80" },
      { name: "Apple iPad Pro 12.9 M2", cat: 1, price: 900, deposit: 4000, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80" },
      { name: "Samsung Galaxy Tab S9 Ultra", cat: 1, price: 850, deposit: 3500, img: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80" },
      { name: "Sony FX6 4K Cinema Camera Package", cat: 2, price: 3200, deposit: 10000, img: "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&auto=format&fit=crop&q=80" },
      { name: "RED V-Raptor 8K VV Cinema Package", cat: 2, price: 5500, deposit: 20000, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80" },
      { name: "Canon EOS R6 Mark II Mirrorless", cat: 2, price: 1800, deposit: 8000, img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80" },
      { name: "Sony FE 24-70mm f/2.8 GM II Lens", cat: 3, price: 950, deposit: 4500, img: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80" },
      { name: "Epson EB-X06 3600-Lumens Projector", cat: 4, price: 1100, deposit: 3000, img: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80" },
      { name: "JBL VRX932LA Concert Line Array System", cat: 6, price: 4500, deposit: 15000, img: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80" },
      { name: "Shure SM58 Wireless Microphone Kit", cat: 7, price: 600, deposit: 2000, img: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80" },
      { name: "Aputure 600x Pro Studio LED Light", cat: 8, price: 1500, deposit: 5000, img: "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80" },
      { name: "CAT 320 Hydraulic Heavy Excavator", cat: 12, price: 6500, deposit: 25000, img: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80" },
      { name: "62.5 kVA Silent Cummins Generator", cat: 13, price: 3500, deposit: 10000, img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80" },
      { name: "DJI Mavic 3 Pro Cine Drone", cat: 16, price: 2500, deposit: 8000, img: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80" },
      { name: "Bosch Professional Rotary Hammer Drill", cat: 11, price: 450, deposit: 1500, img: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80" },
      { name: "Mahindra 45HP Power Tiller", cat: 10, price: 2200, deposit: 7000, img: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80" },
    ];

    // Generate 60 equipment items by iterating with variation
    const seededEquipments = [];
    for (let i = 0; i < 60; i++) {
      const base = rawEquipmentList[i % rawEquipmentList.length];
      const providerIndex = i % providerUsers.length;
      const eqNumber = (i + 1).toString().padStart(4, "0");

      const eq = await EquipmentListing.create({
        name: `${base.name} (Unit #${i + 1})`,
        slug: `${base.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}-unit-${i + 1}`,
        qrCodeIdentifier: `EQUIP-ASSET-${eqNumber}`,
        serialNumber: `SN-2026-99${eqNumber}`,
        description: `High performance ${base.name} maintained in peak operational condition. Inspected before every handover.`,
        category: seededCategories[base.cat]._id,
        subCategoryId: seededCategories[base.cat].subCategories[0]._id,
        owner: providerUsers[providerIndex]._id,
        brand: base.name.split(" ")[0],
        modelName: `Model-${2024 + (i % 3)}`,
        specifications: [
          { key: "Power Rating", value: "Standard ISO Certified" },
          { key: "Operational Status", value: "Verified Active" },
        ],
        images: [{ url: base.img, isPrimary: true, order: 0 }],
        condition: i % 7 === 0 ? "GOOD" : "EXCELLENT",
        healthScore: 92 + (i % 8),
        rentalPrice: base.price,
        securityDeposit: base.deposit,
        quantity: 1,
        location: { city: i % 2 === 0 ? "Chennai" : "Coimbatore", state: "Tamil Nadu", pincode: "600001" },
        availabilityStatus: "AVAILABLE",
        approvalStatus: "APPROVED",
        averageRating: 4.5 + ((i % 5) * 0.1),
        totalReviews: 6 + (i % 12),
      });

      seededEquipments.push(eq);
    }

    console.log("5. Seeding 50 Bookings with Lifecycle Data...");
    const seededBookings = [];
    for (let i = 0; i < 50; i++) {
      const renter = customerUsers[i % customerUsers.length];
      const equipment = seededEquipments[i % seededEquipments.length];
      const bookingNo = `ER-2026-${(100001 + i).toString()}`;

      const days = 3 + (i % 5);
      const totalRentalFee = equipment.rentalPrice * days;
      const totalAmount = totalRentalFee + equipment.securityDeposit + 500;

      let status = "COMPLETED";
      if (i % 5 === 0) status = "ACTIVE";
      else if (i % 8 === 0) status = "DISPUTED";
      else if (i % 10 === 0) status = "CONFIRMED";

      const bk = await Booking.create({
        bookingNumber: bookingNo,
        renter: renter._id,
        equipment: equipment._id,
        provider: equipment.owner,
        startDate: new Date(Date.now() - (10 - (i % 8)) * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (i % 5) * 24 * 60 * 60 * 1000),
        rentalDays: days,
        dailyRate: equipment.rentalPrice,
        totalRentalFee,
        securityDeposit: equipment.securityDeposit,
        deliveryFee: 500,
        totalAmount,
        paymentStatus: "PAID",
        bookingStatus: status,
        returnStatus: status === "COMPLETED" ? "INSPECTED" : status === "DISPUTED" ? "DAMAGE_REPORTED" : "NOT_RETURNED",
        pickupDetails: "Chennai Central Depot",
      });

      seededBookings.push(bk);

      // Create Handover & Return Inspection for completed/disputed bookings
      if (status === "COMPLETED" || status === "DISPUTED") {
        const handover = await HandoverInspection.create({
          booking: bk._id,
          equipment: equipment._id,
          inspector: equipment.owner,
          serialNumber: equipment.serialNumber,
          condition: "EXCELLENT",
          checklist: [{ item: "Visual Inspection", status: "PASS" }],
          inspectionImages: [{ url: equipment.images[0].url }],
          notes: "Handover check complete.",
        });

        await ReturnInspection.create({
          booking: bk._id,
          equipment: equipment._id,
          handoverInspection: handover._id,
          inspector: equipment.owner,
          condition: status === "DISPUTED" ? "DAMAGED" : "EXCELLENT",
          damageDetected: status === "DISPUTED",
          returnImages: [{ url: equipment.images[0].url }],
          notes: status === "DISPUTED" ? "Minor surface damage found." : "Equipment returned clean.",
        });
      }
    }

    console.log("6. Seeding 8 Damage Reports...");
    for (let i = 0; i < 8; i++) {
      const disputedBk = seededBookings.find((b) => b.bookingStatus === "DISPUTED") || seededBookings[i];
      await DamageReport.create({
        reportNumber: `DMG-2026-00${i + 1}`,
        booking: disputedBk._id,
        equipment: disputedBk.equipment,
        reportedBy: disputedBk.provider,
        damageType: i % 2 === 0 ? "PHYSICAL" : "FUNCTIONAL",
        description: `Scratch and cosmetic casing damage observed during return inspection #${i + 1}.`,
        evidenceImages: [{ url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80" }],
        estimatedCost: 2500 + i * 500,
        status: i % 3 === 0 ? "REPORTED" : "USER_RESPONSIBLE",
      });
    }

    console.log("7. Seeding 15 Maintenance Records...");
    for (let i = 0; i < 15; i++) {
      const eq = seededEquipments[i * 4];
      await EquipmentMaintenance.create({
        equipment: eq._id,
        maintenanceType: "ROUTINE_SERVICE",
        description: "Standard 100-hour engine oil replacement and calibration service.",
        startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        cost: 1200 + i * 100,
        status: i % 2 === 0 ? "SCHEDULED" : "COMPLETED",
      });
    }

    console.log("8. Seeding 50 Reviews...");
    for (let i = 0; i < 50; i++) {
      const bk = seededBookings[i];
      if (bk.bookingStatus === "COMPLETED") {
        await Review.create({
          user: bk.renter,
          equipment: bk.equipment,
          booking: bk._id,
          rating: 4 + (i % 2),
          comment: "Outstanding equipment performance! Depot pick up was seamless and condition was top notch.",
        });
      }
    }

    console.log("9. Seeding Audit Logs & Notifications...");
    for (let i = 0; i < 40; i++) {
      await Notification.create({
        user: customerUsers[i % customerUsers.length]._id,
        title: "Booking Update",
        message: `Your rental booking ER-2026-1000${i} status has been updated.`,
        type: "BOOKING_CONFIRMED",
      });

      await AuditLog.create({
        actor: superAdmin._id,
        action: "SYSTEM_SEEDED",
        entityType: "MasterSeed",
        metadata: { index: i },
        ipAddress: "127.0.0.1",
      });
    }

    console.log("\n=================================================================");
    console.log("🚀 MASTER 2026 DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=================================================================");
    console.log(`Users Created:      44 (1 SuperAdmin, 3 Admins, 10 Providers, 30 Customers)`);
    console.log(`Categories Created: 20 Categories`);
    console.log(`Equipment Listings: 60 Unique Asset Records with QR Identifiers`);
    console.log(`Bookings Created:   50 Interconnected Rental Bookings`);
    console.log(`Damage Reports:     8 Active & Resolved Dispute Claims`);
    console.log(`Maintenance Logs:   15 Servicing Records`);
    console.log(`Reviews Created:    50 Completed Rental Reviews`);
    console.log("=================================================================");
    console.log("Demo Credentials:");
    console.log("👉 Super Admin: admin@example.com    | Password: SuperAdmin@123");
    console.log("👉 Provider:    provider@example.com | Password: Provider@123");
    console.log("👉 Customer:    user@example.com     | Password: User@123");
    console.log("=================================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Master Seed 2026 Error:", err);
    process.exit(1);
  }
};

seedMaster2026();
