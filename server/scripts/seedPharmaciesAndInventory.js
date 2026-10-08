require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Pharmacy = require("../models/Pharmacy");
const Inventory = require("../models/Inventory");
const Medicine = require("../models/Medicine");

const PHARMACIES_DATA = [
  {
    id: "pharm-apollo-rspuram",
    name: "Apollo Pharmacy - RS Puram",
    logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=120&auto=format&fit=crop&q=80",
    address: "DB Road, RS Puram, Coimbatore, Tamil Nadu",
    phone: "+91-422-254-1234",
    rating: 4.8,
    distanceKm: 1.2,
    travelTimeDrive: "4 mins",
    travelTimeWalk: "12 mins",
    openingTime: "07:30 AM",
    closingTime: "11:00 PM",
    isOpen: true,
    deliveryAvailable: true,
    deliveryFee: 25,
    latitude: 11.0083,
    longitude: 76.9515,
    isActive: true,
  },
  {
    id: "pharm-medplus-gandhipuram",
    name: "MedPlus - Gandhipuram",
    logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=120&auto=format&fit=crop&q=80",
    address: "Cross Cut Road, Gandhipuram, Coimbatore, Tamil Nadu",
    phone: "+91-422-249-5678",
    rating: 4.6,
    distanceKm: 2.5,
    travelTimeDrive: "7 mins",
    travelTimeWalk: "22 mins",
    openingTime: "08:00 AM",
    closingTime: "10:30 PM",
    isOpen: true,
    deliveryAvailable: true,
    deliveryFee: 30,
    latitude: 11.0182,
    longitude: 76.9654,
    isActive: true,
  },
  {
    id: "pharm-wellness-peelamedu",
    name: "Wellness Forever - Peelamedu",
    logo: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=120&auto=format&fit=crop&q=80",
    address: "Avinashi Road, Peelamedu, Coimbatore, Tamil Nadu",
    phone: "+91-422-259-8899",
    rating: 4.7,
    distanceKm: 4.1,
    travelTimeDrive: "10 mins",
    travelTimeWalk: "45 mins",
    openingTime: "00:00 AM",
    closingTime: "11:59 PM",
    isOpen: true,
    deliveryAvailable: true,
    deliveryFee: 40,
    latitude: 11.0285,
    longitude: 77.0028,
    isActive: true,
  },
  {
    id: "pharm-tulsi-saibaba",
    name: "Tulsi Pharmacy - Saibaba Colony",
    logo: "https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=120&auto=format&fit=crop&q=80",
    address: "NSR Road, Saibaba Colony, Coimbatore, Tamil Nadu",
    phone: "+91-422-244-3322",
    rating: 4.5,
    distanceKm: 3.0,
    travelTimeDrive: "8 mins",
    travelTimeWalk: "30 mins",
    openingTime: "08:00 AM",
    closingTime: "10:00 PM",
    isOpen: true,
    deliveryAvailable: true,
    deliveryFee: 25,
    latitude: 11.0252,
    longitude: 76.9481,
    isActive: true,
  },
  {
    id: "pharm-thulasi-townhall",
    name: "Thulasi Pharmacy - Town Hall",
    logo: "https://images.unsplash.com/photo-1576602976047-174e57a47881?w=120&auto=format&fit=crop&q=80",
    address: "Oppo Railway Station, Town Hall, Coimbatore, Tamil Nadu",
    phone: "+91-422-230-1100",
    rating: 4.4,
    distanceKm: 1.8,
    travelTimeDrive: "5 mins",
    travelTimeWalk: "18 mins",
    openingTime: "07:00 AM",
    closingTime: "10:00 PM",
    isOpen: true,
    deliveryAvailable: false,
    deliveryFee: 0,
    latitude: 10.9984,
    longitude: 76.9621,
    isActive: true,
  },
];

async function seed() {
  console.log("==================================================");
  console.log("  MEDIBRIDGE PHARMACY & INVENTORY SEEDER");
  console.log("==================================================");

  try {
    await connectDB();

    // 1. Seed Pharmacies
    console.log("🚀 Upserting partner pharmacy records...");
    const pharmacyOps = PHARMACIES_DATA.map((pharm) => ({
      updateOne: {
        filter: { id: pharm.id },
        update: { $set: pharm },
        upsert: true,
      },
    }));
    await Pharmacy.bulkWrite(pharmacyOps, { ordered: false });
    const totalPharmacies = await Pharmacy.countDocuments();
    console.log(`✅ ${totalPharmacies} Partner Pharmacies active in database.`);

    // 2. Fetch medicines to map to inventory
    const medicines = await Medicine.find().limit(20).lean();
    if (medicines.length === 0) {
      console.log("⚠️ No medicines found in DB. Skipping inventory seeding.");
    } else {
      console.log(`📦 Mapping inventory records across ${medicines.length} medicines and ${PHARMACIES_DATA.length} pharmacies...`);
      const inventoryOps = [];

      PHARMACIES_DATA.forEach((pharm, pIdx) => {
        medicines.forEach((med, mIdx) => {
          const basePrice = med.price || 30;
          const stock = ((pIdx + 1) * (mIdx + 3) * 7) % 85;
          const availability = stock === 0 ? "out" : stock <= 5 ? "limited" : "in-stock";

          inventoryOps.push({
            updateOne: {
              filter: { pharmacyId: pharm.id, medicineId: med.id },
              update: {
                $set: {
                  pharmacyId: pharm.id,
                  medicineId: med.id,
                  stock,
                  price: basePrice + (pIdx * 2),
                  availability,
                  deliveryAvailable: pharm.deliveryAvailable,
                },
              },
              upsert: true,
            },
          });
        });
      });

      await Inventory.bulkWrite(inventoryOps, { ordered: false });
      const totalInventory = await Inventory.countDocuments();
      console.log(`✅ ${totalInventory} Pharmacy Inventory stock records created/updated.`);
    }

    console.log("==================================================");
    console.log("🎉 PHARMACY & INVENTORY SEED COMPLETED");
    console.log("==================================================");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    process.exit(1);
  }
}

seed();
