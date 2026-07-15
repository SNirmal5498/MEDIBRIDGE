// Central place for mock content. Swap these for real API calls in services/
// as the corresponding backend endpoints become available.

export const NAV_LINKS = [
  { label: "Home", path: "/", icon: "Home" },
  { label: "Compare Medicines", path: "/medicine", icon: "Scale" },
  { label: "Nearby Pharmacy", path: "/pharmacy", icon: "MapPin" },
  { label: "Emergency", path: "/emergency", icon: "Siren" },
  { label: "About", path: "/about", icon: "Info" },
];

export const AUTH_NAV_LINKS = [
  { label: "Orders", path: "/orders", icon: "Package" },
  { label: "Favorites", path: "/favorites", icon: "Heart" },
  { label: "Profile", path: "/profile", icon: "User" },
];

export const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "hi", label: "हिन्दी" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ml", label: "മലയാളം" },
  { code: "kn", label: "ಕನ್ನಡ" },
];

export const STATS = [
  { value: "2500+", label: "Medicines" },
  { value: "500+", label: "Partner Pharmacies" },
  { value: "6+", label: "Languages" },
  { value: "1000+", label: "Medicine Comparisons" },
];

export const COMPARISON_STEPS = [
  { label: "Search", icon: "Search", description: "Type a medicine name" },
  { label: "Select Medicine", icon: "MousePointerClick", description: "Choose the exact match" },
  { label: "Compare Brands", icon: "Scale", description: "See alternate brands side by side" },
  { label: "Compare Prices", icon: "IndianRupee", description: "Check price per brand" },
  { label: "Find Nearby Pharmacy", icon: "MapPin", description: "Locate stock near you" },
  { label: "Order (if OTC)", icon: "ShoppingCart", description: "Only OTC medicines can be ordered" },
];

export const SAMPLE_COMPARISON = {
  query: "Paracetamol 500mg",
  rows: [
    { feature: "Brand", crocin: "Crocin", dolo: "Dolo", calpol: "Calpol" },
    { feature: "Generic", crocin: "Paracetamol", dolo: "Paracetamol", calpol: "Paracetamol" },
    { feature: "Strength", crocin: "500mg", dolo: "650mg", calpol: "500mg" },
    { feature: "Price", crocin: "₹18", dolo: "₹35", calpol: "₹20" },
    { feature: "Manufacturer", crocin: "GSK", dolo: "Micro Labs", calpol: "GSK" },
    { feature: "OTC", crocin: "Yes", dolo: "Yes", calpol: "Yes" },
  ],
};

export const OTC_MEDICINES = [
{ id: "otc-1", name: "Paracetamol", brand: "Crocin", strength: "500mg", price: 18, otc: true, manufacturer: "GSK" },
{ id: "otc-1b", name: "Paracetamol", brand: "Dolo", strength: "650mg", price: 35, otc: true, manufacturer: "Micro Labs" },
{ id: "otc-1c", name: "Paracetamol", brand: "Calpol", strength: "500mg", price: 20, otc: true, manufacturer: "GSK" },  { id: "otc-2", name: "Cetirizine", brand: "Cetrizine-D", strength: "10mg", price: 22, otc: true, manufacturer: "Cipla" },
  { id: "otc-3", name: "ORS", brand: "Electral", strength: "21.8g", price: 25, otc: true, manufacturer: "FDC" },
  { id: "otc-4", name: "Vitamin C", brand: "Limcee", strength: "500mg", price: 30, otc: true, manufacturer: "Abbott" },
  { id: "otc-5", name: "Antacid", brand: "Digene", strength: "10ml", price: 45, otc: true, manufacturer: "Abbott" },
  { id: "otc-6", name: "Antacid", brand: "Gelusil", strength: "10ml", price: 40, otc: true, manufacturer: "Zydus" },
  { id: "otc-7", name: "Bandage", brand: "Band-Aid", strength: "Pack of 10", price: 55, otc: true, manufacturer: "J&J" },
];

export const PRESCRIPTION_MEDICINES = [
  { id: "rx-1", name: "Amoxicillin", brand: "Novamox", strength: "500mg", manufacturer: "Cipla", otc: false },
  { id: "rx-2", name: "Metformin", brand: "Glycomet", strength: "500mg", manufacturer: "USV", otc: false },
];

export const PHARMACIES = [
  { id: "ph-1", name: "Apollo Pharmacy", rating: 4.5, distance: "0.8 km", isOpen: true, phone: "+91 98765 43210", address: "MG Road, Bengaluru" },
  { id: "ph-2", name: "MedPlus", rating: 4.2, distance: "1.2 km", isOpen: true, phone: "+91 98765 11223", address: "Indiranagar, Bengaluru" },
  { id: "ph-3", name: "Wellness Forever", rating: 4.0, distance: "2.4 km", isOpen: false, phone: "+91 98765 99887", address: "Koramangala, Bengaluru" },
  { id: "ph-4", name: "Netmeds Pharmacy", rating: 4.4, distance: "3.1 km", isOpen: true, phone: "+91 98765 55667", address: "HSR Layout, Bengaluru" },
];

export const EMERGENCY_CONTACTS = [
  { label: "Ambulance", number: "108" },
  { label: "National Emergency", number: "112" },
  { label: "Poison Control", number: "1800-116-117" },
  { label: "Women's Helpline", number: "1091" },
];

export const EMERGENCY_MEDICINES = [
  "Paracetamol (fever/pain)",
  "ORS (dehydration)",
  "Antihistamine (allergic reaction)",
  "Antiseptic solution",
  "Sterile gauze & bandages",
];

export const FEATURES = [
  { icon: "Scale", title: "Compare Brands", description: "See every brand alternative for a medicine, side by side, in seconds." },
  { icon: "MapPin", title: "Locate Pharmacies", description: "Find nearby pharmacies with live stock and distance, not guesswork." },
  { icon: "ShieldCheck", title: "OTC-Only Ordering", description: "Only genuinely over-the-counter medicines can be ordered — nothing riskier." },
  { icon: "Globe", title: "Multilingual", description: "Use MediBridge in the language you're most comfortable with." },
];

export const TESTIMONIALS = [
  { name: "Ananya R.", role: "Caregiver", quote: "Finding a cheaper alternative for my mother's medicine used to take three pharmacy calls. Now it takes ten seconds." },
  { name: "Rahul K.", role: "Patient", quote: "The nearby pharmacy locator saved me a late-night drive to three different stores." },
  { name: "Dr. Meera S.", role: "General Physician", quote: "I like that prescription drugs are clearly separated from OTC — it keeps patients safe by default." },
];