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
const Wishlist = require("../models/Wishlist");
const Notification = require("../models/Notification");
const AuditLog = require("../models/AuditLog");
const PlatformSetting = require("../models/PlatformSetting");

const categoryNames = [
  "Laptops & Computers", "Tablets", "Cameras", "Camera Lenses", "Projectors",
  "Audio Equipment", "Speakers", "Microphones", "Lighting Equipment", "Event Equipment",
  "Agricultural Machinery", "Power Tools", "Construction Equipment", "Generators", "Drones",
  "Printers", "Networking Equipment", "Surveying Equipment", "Office Equipment", "Cleaning Equipment",
  "Industrial Equipment", "Welding Equipment", "Gardening Equipment", "Safety Equipment", "Medical/Professional Equipment"
];

const categoryImages = [
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1527011046414-4781f1f94f8c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584467735871-8e85353a8413?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=800&auto=format&fit=crop&q=80"
];

const indianCities = ["Chennai", "Coimbatore", "Madurai", "Tirunelveli", "Trichy", "Salem", "Bengaluru", "Hyderabad", "Kochi", "Mumbai"];

const seedEquipora = async () => {
  try {
    console.log("Connecting to MongoDB Atlas for EQUIPORA Bulk Seeding...");
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
      Wishlist.deleteMany({}),
      Notification.deleteMany({}),
      AuditLog.deleteMany({}),
      PlatformSetting.deleteMany({}),
    ]);

    console.log("1. Seeding Platform Settings...");
    await PlatformSetting.create({
      commissionPercentage: 10,
      defaultCancellationPolicy: "Full refund 48h prior to rental start. 50% refund within 24h.",
      defaultSecurityDepositRate: 20,
      minVerificationForRentals: true,
    });

    console.log("2. Preparing 100 Demo Users (SuperAdmin, Admins, 50 Providers, 50 Customers)...");

    const usersToInsert = [];
    const providerProfilesToInsert = [];

    // SuperAdmin
    const superAdminObj = {
      _id: new mongoose.Types.ObjectId(),
      fullName: "Arun Kumar",
      username: "arunkumar",
      email: "admin@example.com",
      phone: "9876543000",
      password: "$2a$10$e8w.R6MvUq24aP.P28W1A.sA6B.rWnLg99kG0Ww5/u4O8y7K5aD9K", // SuperAdmin@123
      role: "SUPER_ADMIN",
      status: "ACTIVE",
      trustProfile: { trustScore: 100, trustTier: "TOP_RATED" },
      verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
    };
    usersToInsert.push(superAdminObj);

    // 3 Admins
    for (let i = 1; i <= 3; i++) {
      usersToInsert.push({
        _id: new mongoose.Types.ObjectId(),
        fullName: `Equipora Admin ${i}`,
        username: `admin${i}`,
        email: `admin${i}@equipora.com`,
        phone: `987654300${i}`,
        password: "$2a$10$e8w.R6MvUq24aP.P28W1A.sA6B.rWnLg99kG0Ww5/u4O8y7K5aD9K",
        role: "ADMIN",
        status: "ACTIVE",
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });
    }

    // 50 Providers
    const providerUserIds = [];
    for (let i = 1; i <= 50; i++) {
      const isFirst = i === 1;
      const providerName = isFirst ? "TechRent Solutions" : `Equipora Provider Depot #${i}`;
      const email = isFirst ? "provider@example.com" : `provider${i}@equipora.com`;
      const phone = `987654${1000 + i}`;
      const pId = new mongoose.Types.ObjectId();
      providerUserIds.push(pId);

      usersToInsert.push({
        _id: pId,
        fullName: providerName,
        username: `provider${i}`,
        email,
        phone,
        password: "$2a$10$e8w.R6MvUq24aP.P28W1A.sA6B.rWnLg99kG0Ww5/u4O8y7K5aD9K",
        role: "PROVIDER",
        status: "ACTIVE",
        trustProfile: { trustScore: 92 + (i % 8), trustTier: "TOP_RATED" },
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });

      providerProfilesToInsert.push({
        user: pId,
        businessName: providerName,
        contactPhone: phone,
        contactEmail: email,
        status: "APPROVED",
        businessAddress: { city: indianCities[i % indianCities.length], state: "Tamil Nadu", pincode: "600001" },
      });
    }

    // 50 Customers
    const customerUserIds = [];
    for (let i = 1; i <= 50; i++) {
      const isFirst = i === 1;
      const customerName = isFirst ? "Muthu Kumar" : `Renter Customer #${i}`;
      const email = isFirst ? "user@example.com" : `customer${i}@equipora.com`;
      const phone = `987654${2000 + i}`;
      const cId = new mongoose.Types.ObjectId();
      customerUserIds.push(cId);

      usersToInsert.push({
        _id: cId,
        fullName: customerName,
        username: `customer${i}`,
        email,
        phone,
        password: "$2a$10$e8w.R6MvUq24aP.P28W1A.sA6B.rWnLg99kG0Ww5/u4O8y7K5aD9K",
        role: "USER",
        status: "ACTIVE",
        trustProfile: { trustScore: 85 + (i % 12), trustTier: "TRUSTED" },
        verification: { emailVerified: true, phoneVerified: true, identityVerified: true, addressVerified: true, adminApproved: true },
      });
    }

    await User.insertMany(usersToInsert);
    await ProviderProfile.insertMany(providerProfilesToInsert);

    console.log("3. Seeding 25 Categories...");
    const categoriesToInsert = categoryNames.map((title, i) => ({
      _id: new mongoose.Types.ObjectId(),
      mainCategory: title,
      slug: title.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      description: `Professional ${title.toLowerCase()} for daily and weekly rental.`,
      homeImage: categoryImages[i],
      subCategories: [{ _id: new mongoose.Types.ObjectId(), title: `General ${title}`, description: title }],
      isActive: true,
    }));

    const seededCategories = await EquipmentCategory.insertMany(categoriesToInsert);

    console.log("4. Bulk Seeding 1,250 Equipment Listings...");
    const equipmentToInsert = [];
    let assetCount = 0;

    for (let c = 0; c < seededCategories.length; c++) {
      const category = seededCategories[c];
      const imgUrl = categoryImages[c];

      for (let item = 1; item <= 50; item++) {
        assetCount++;
        const assetTag = `EQUIP-ASSET-${assetCount.toString().padStart(6, "0")}`;
        const providerId = providerUserIds[assetCount % providerUserIds.length];

        const dailyRate = 400 + ((assetCount % 35) * 150);
        const deposit = dailyRate * 4;

        equipmentToInsert.push({
          _id: new mongoose.Types.ObjectId(),
          name: `${category.mainCategory} Model #${item}`,
          slug: `${category.slug}-item-${item}`,
          qrCodeIdentifier: assetTag,
          serialNumber: `SN-2026-${assetCount.toString().padStart(6, "0")}`,
          description: `High performance ${category.mainCategory} unit #${item} available for short-term and project rental. Fully tested and calibrated.`,
          category: category._id,
          subCategoryId: category.subCategories[0]._id,
          owner: providerId,
          brand: `Brand-${(item % 10) + 1}`,
          modelName: `Pro-2024-${item}`,
          specifications: [
            { key: "Power Output", value: "Industrial Grade" },
            { key: "Calibration", value: "Certified ISO 9001" },
          ],
          images: [{ url: imgUrl, isPrimary: true, order: 0 }],
          condition: item % 8 === 0 ? "GOOD" : "EXCELLENT",
          healthScore: 90 + (item % 10),
          rentalPrice: dailyRate,
          securityDeposit: deposit,
          quantity: 1,
          location: { city: indianCities[assetCount % indianCities.length], state: "Tamil Nadu", pincode: "600001" },
          availabilityStatus: "AVAILABLE",
          approvalStatus: "APPROVED",
          averageRating: 4.2 + ((item % 8) * 0.1),
          totalReviews: 8 + (item % 15),
        });
      }
    }

    const seededEquipments = await EquipmentListing.insertMany(equipmentToInsert);

    console.log("5. Bulk Seeding 200 Bookings, Inspections, Reviews...");
    const bookingsToInsert = [];
    const handoversToInsert = [];
    const returnsToInsert = [];
    const reviewsToInsert = [];
    const wishlistsToInsert = [];
    const damageReportsToInsert = [];
    const maintenanceToInsert = [];

    for (let i = 0; i < 200; i++) {
      const renterId = customerUserIds[i % customerUserIds.length];
      const equipment = seededEquipments[i % seededEquipments.length];
      const bookingId = new mongoose.Types.ObjectId();
      const bookingNo = `ER-2026-${(100001 + i).toString()}`;
      const days = 2 + (i % 6);
      const rentalFee = equipment.rentalPrice * days;
      const totalAmount = rentalFee + equipment.securityDeposit + 500;

      let status = "COMPLETED";
      if (i % 6 === 0) status = "ACTIVE";
      else if (i % 10 === 0) status = "DISPUTED";
      else if (i % 12 === 0) status = "CONFIRMED";

      bookingsToInsert.push({
        _id: bookingId,
        bookingNumber: bookingNo,
        renter: renterId,
        equipment: equipment._id,
        provider: equipment.owner,
        startDate: new Date(Date.now() - (15 - (i % 10)) * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + (i % 5) * 24 * 60 * 60 * 1000),
        rentalDays: days,
        dailyRate: equipment.rentalPrice,
        totalRentalFee: rentalFee,
        securityDeposit: equipment.securityDeposit,
        deliveryFee: 500,
        totalAmount,
        paymentStatus: "PAID",
        bookingStatus: status,
        returnStatus: status === "COMPLETED" ? "INSPECTED" : status === "DISPUTED" ? "DAMAGE_REPORTED" : "NOT_RETURNED",
        pickupDetails: `${equipment.location.city} Central Depot`,
      });

      if (status === "COMPLETED" || status === "DISPUTED") {
        const handoverId = new mongoose.Types.ObjectId();
        handoversToInsert.push({
          _id: handoverId,
          booking: bookingId,
          equipment: equipment._id,
          inspector: equipment.owner,
          serialNumber: equipment.serialNumber,
          condition: "EXCELLENT",
          checklist: [{ item: "Power Inspection", status: "PASS" }],
          inspectionImages: [{ url: equipment.images[0].url }],
          notes: "Pre-rental handover complete.",
        });

        returnsToInsert.push({
          booking: bookingId,
          equipment: equipment._id,
          handoverInspection: handoverId,
          inspector: equipment.owner,
          condition: status === "DISPUTED" ? "DAMAGED" : "EXCELLENT",
          damageDetected: status === "DISPUTED",
          returnImages: [{ url: equipment.images[0].url }],
          notes: status === "DISPUTED" ? "Minor surface casing scratch." : "Clean return inspection.",
        });

        reviewsToInsert.push({
          user: renterId,
          equipment: equipment._id,
          booking: bookingId,
          rating: 4 + (i % 2),
          comment: "High quality equipment performance! Depot pickup was quick and condition was top notch.",
        });
      }

      if (i < 50) {
        damageReportsToInsert.push({
          reportNumber: `DMG-2026-${(100 + i).toString()}`,
          booking: bookingId,
          equipment: equipment._id,
          reportedBy: equipment.owner,
          damageType: i % 2 === 0 ? "PHYSICAL" : "FUNCTIONAL",
          description: `Cosmetic scratch and panel damage reported on equipment unit #${i + 1}.`,
          evidenceImages: [{ url: categoryImages[i % categoryImages.length] }],
          estimatedCost: 1500 + i * 200,
          status: i % 3 === 0 ? "REPORTED" : "USER_RESPONSIBLE",
        });
      }
    }

    for (let i = 0; i < 100; i++) {
      const eq = seededEquipments[i * 12];
      maintenanceToInsert.push({
        equipment: eq._id,
        maintenanceType: "ROUTINE_SERVICE",
        description: "Scheduled 100-hour preventive servicing and calibration.",
        startDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        cost: 1500 + i * 50,
        status: i % 2 === 0 ? "SCHEDULED" : "COMPLETED",
      });
    }

    for (let i = 0; i < 200; i++) {
      wishlistsToInsert.push({
        user: customerUserIds[i % customerUserIds.length],
        equipment: seededEquipments[(i * 3) % seededEquipments.length]._id,
      });
    }

    await Booking.insertMany(bookingsToInsert);
    await HandoverInspection.insertMany(handoversToInsert);
    await ReturnInspection.insertMany(returnsToInsert);
    await Review.insertMany(reviewsToInsert);
    await DamageReport.insertMany(damageReportsToInsert);
    await EquipmentMaintenance.insertMany(maintenanceToInsert);
    await Wishlist.insertMany(wishlistsToInsert);

    console.log("6. Bulk Seeding Notifications & Audit Logs...");
    const notificationsToInsert = [];
    const auditLogsToInsert = [];

    for (let i = 0; i < 200; i++) {
      notificationsToInsert.push({
        user: customerUserIds[i % customerUserIds.length],
        title: "Rental Confirmation",
        message: `Your Equipora rental booking ER-2026-${100001 + i} status has been updated.`,
        type: "BOOKING_CONFIRMED",
      });

      auditLogsToInsert.push({
        actor: superAdminObj._id,
        action: "EQUIPORA_BULK_SEEDED",
        entityType: "MasterSeed",
        metadata: { index: i },
        ipAddress: "127.0.0.1",
      });
    }

    await Notification.insertMany(notificationsToInsert);
    await AuditLog.insertMany(auditLogsToInsert);

    console.log("\n=================================================================");
    console.log("🚀 EQUIPORA BULK DATABASE SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=================================================================");
    console.log(`Users Created:      100 (1 SuperAdmin, 3 Admins, 50 Providers, 50 Customers)`);
    console.log(`Categories Created: 25 Categories`);
    console.log(`Equipment Listings: 1,250 Unique Asset Records (25 Categories x 50 Items)`);
    console.log(`Bookings Created:   200 Interconnected Rental Bookings`);
    console.log(`Damage Reports:     50 Dispute Claims`);
    console.log(`Maintenance Logs:   100 Servicing Records`);
    console.log(`Reviews Created:    Completed Rental Reviews`);
    console.log("=================================================================");
    console.log("EQUIPORA Demo Credentials:");
    console.log("👉 Super Admin: admin@example.com    | Password: SuperAdmin@123");
    console.log("👉 Provider:    provider@example.com | Password: Provider@123");
    console.log("👉 Customer:    user@example.com     | Password: User@123");
    console.log("=================================================================\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ EQUIPORA Seeding Error:", err);
    process.exit(1);
  }
};

seedEquipora();
