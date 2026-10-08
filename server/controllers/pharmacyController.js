const Pharmacy = require("../models/Pharmacy");
const Inventory = require("../models/Inventory");
const Medicine = require("../models/Medicine");

// Seed initial pharmacies if database is empty
async function ensureSeedPharmacies() {
  const count = await Pharmacy.countDocuments();
  if (count === 0) {
    const initialPharmacies = [
      {
        id: "pharm-001",
        name: "MedPlus Pharmacy",
        address: "124 Race Course Road, Near Thomas Park, Coimbatore",
        phone: "+91 98421 10001",
        rating: 4.8,
        distanceKm: 0.8,
        travelTimeDrive: "3 mins",
        travelTimeWalk: "10 mins",
        openingTime: "07:30 AM",
        closingTime: "11:00 PM",
        isOpen: true,
        deliveryAvailable: true,
        deliveryFee: 20,
        latitude: 11.0046,
        longitude: 76.968,
      },
      {
        id: "pharm-002",
        name: "Apollo Pharmacy",
        address: "45 Cross Cut Road, Gandhipuram, Coimbatore",
        phone: "+91 98421 20002",
        rating: 4.7,
        distanceKm: 1.5,
        travelTimeDrive: "5 mins",
        travelTimeWalk: "18 mins",
        openingTime: "24 Hours",
        closingTime: "24 Hours",
        isOpen: true,
        deliveryAvailable: true,
        deliveryFee: 25,
        latitude: 11.0168,
        longitude: 76.9558,
      },
      {
        id: "pharm-003",
        name: "Netmeds Pharmacy Store",
        address: "88 DB Road, RS Puram, Coimbatore",
        phone: "+91 98421 30003",
        rating: 4.6,
        distanceKm: 2.2,
        travelTimeDrive: "8 mins",
        travelTimeWalk: "26 mins",
        openingTime: "08:00 AM",
        closingTime: "10:30 PM",
        isOpen: true,
        deliveryAvailable: true,
        deliveryFee: 30,
        latitude: 11.008,
        longitude: 76.9508,
      },
      {
        id: "pharm-004",
        name: "Sri Shakthi Wellness Pharmacy",
        address: "Sri Shakthi Nagar, L&T Bypass, Sitra, Coimbatore",
        phone: "+91 98421 40004",
        rating: 4.9,
        distanceKm: 0.4,
        travelTimeDrive: "2 mins",
        travelTimeWalk: "5 mins",
        openingTime: "07:00 AM",
        closingTime: "11:30 PM",
        isOpen: true,
        deliveryAvailable: true,
        deliveryFee: 15,
        latitude: 11.0508,
        longitude: 77.0508,
      },
      {
        id: "pharm-005",
        name: "Tulsi Pharma Care",
        address: "302 Avinashi Road, Peelamedu, Coimbatore",
        phone: "+91 98421 50005",
        rating: 4.5,
        distanceKm: 3.1,
        travelTimeDrive: "10 mins",
        travelTimeWalk: "38 mins",
        openingTime: "08:30 AM",
        closingTime: "09:30 PM",
        isOpen: true,
        deliveryAvailable: false,
        deliveryFee: 0,
        latitude: 11.0268,
        longitude: 76.9958,
      },
    ];

    await Pharmacy.insertMany(initialPharmacies);
    console.log("✅ Seeded initial Pharmacy records into MongoDB");
  }
}

// Seed sample inventory for medicines across pharmacies if empty
async function ensureSeedInventory() {
  const count = await Inventory.countDocuments();
  if (count === 0) {
    const pharmacies = await Pharmacy.find().lean();
    const medicines = await Medicine.find().limit(50).lean();

    if (pharmacies.length > 0 && medicines.length > 0) {
      const inventoryDocs = [];
      for (const pharm of pharmacies) {
        for (const med of medicines) {
          inventoryDocs.push({
            pharmacyId: pharm.id,
            medicineId: med.id,
            stock: Math.floor(Math.random() * 80) + 10,
            price: med.price,
            availability: "in-stock",
            deliveryAvailable: pharm.deliveryAvailable,
          });
        }
      }
      await Inventory.insertMany(inventoryDocs);
      console.log("✅ Seeded initial Inventory records into MongoDB");
    }
  }
}

const getPharmacies = async (req, res) => {
  try {
    await ensureSeedPharmacies();
    await ensureSeedInventory();

    const { search, filter, sort } = req.query;
    const query = { isActive: true };

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [{ name: regex }, { address: regex }];
    }

    if (filter === "open") query.isOpen = true;
    else if (filter === "delivery") query.deliveryAvailable = true;

    let sortObj = { distanceKm: 1 };
    if (sort === "rating") sortObj = { rating: -1, distanceKm: 1 };
    else if (sort === "name") sortObj = { name: 1 };

    const pharmacies = await Pharmacy.find(query).sort(sortObj).lean();

    res.status(200).json({
      success: true,
      pharmacies,
    });
  } catch (error) {
    console.error("Error in getPharmacies:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve pharmacies",
    });
  }
};

const getPharmacyById = async (req, res) => {
  try {
    const { id } = req.params;
    const pharmacy = await Pharmacy.findOne({ id, isActive: true }).lean();

    if (!pharmacy) {
      return res.status(404).json({
        success: false,
        message: "Pharmacy not found",
      });
    }

    res.status(200).json({
      success: true,
      pharmacy,
    });
  } catch (error) {
    console.error("Error in getPharmacyById:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getPharmacyInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const items = await Inventory.find({ pharmacyId: id }).lean();

    res.status(200).json({
      success: true,
      inventory: items,
    });
  } catch (error) {
    console.error("Error in getPharmacyInventory:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch inventory",
    });
  }
};

const getMedicineAvailability = async (req, res) => {
  try {
    await ensureSeedPharmacies();
    await ensureSeedInventory();

    const { medicineId } = req.params;

    const inventoryRecords = await Inventory.find({ medicineId, stock: { $gt: 0 } }).lean();

    const pharmacyIds = inventoryRecords.map((inv) => inv.pharmacyId);
    const pharmacies = await Pharmacy.find({ id: { $in: pharmacyIds }, isActive: true }).lean();

    const results = pharmacies.map((pharm) => {
      const inv = inventoryRecords.find((i) => i.pharmacyId === pharm.id);
      return {
        ...pharm,
        stock: inv ? inv.stock : 0,
        price: inv ? inv.price : 0,
        availability: inv ? inv.availability : "out",
      };
    });

    res.status(200).json({
      success: true,
      pharmacies: results,
    });
  } catch (error) {
    console.error("Error in getMedicineAvailability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
    });
  }
};

module.exports = {
  getPharmacies,
  getPharmacyById,
  getPharmacyInventory,
  getMedicineAvailability,
};
