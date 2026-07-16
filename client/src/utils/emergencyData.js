// Static dummy data for the Emergency page.
// Swap for real API calls (hospital locator, live stock, etc.) later.

export const EMERGENCY_ACTIONS = [
  {
    id: "ambulance",
    label: "Ambulance",
    icon: "Ambulance",
    number: "108",
    description: "For medical emergencies requiring immediate transport.",
    buttonLabel: "Call Ambulance",
  },
  {
    id: "police",
    label: "Police",
    icon: "Shield",
    number: "100",
    description: "For crime, accidents, or immediate safety threats.",
    buttonLabel: "Call Police",
  },
  {
    id: "fire",
    label: "Fire & Rescue",
    icon: "Flame",
    number: "101",
    description: "For fires, gas leaks, or rescue situations.",
    buttonLabel: "Call Fire Service",
  },
  {
    id: "poison",
    label: "Poison Control",
    icon: "AlertTriangle",
    number: "1800-XXX-XXXX",
    description: "For accidental poisoning or overdose situations.",
    buttonLabel: "Call Poison Control",
  },
];

export const FIRST_AID_GUIDES = [
  {
    id: "fever",
    title: "High Fever",
    description: "Body temperature above 103°F (39.4°C) needs prompt attention.",
    steps: [
      "Remove excess clothing and keep the person cool",
      "Give paracetamol as per recommended dosage",
      "Encourage fluids to prevent dehydration",
      "Seek medical help if fever persists beyond 2 days",
    ],
  },
  {
    id: "heart-attack",
    title: "Heart Attack",
    description: "Chest pain, shortness of breath, or pain radiating to the arm/jaw.",
    steps: [
      "Call ambulance (108) immediately",
      "Have the person sit down and stay calm",
      "Loosen tight clothing",
      "Give aspirin only if not allergic and advised",
    ],
  },
  {
    id: "stroke",
    title: "Stroke",
    description: "Sudden numbness, confusion, or difficulty speaking — act FAST.",
    steps: [
      "Note the time symptoms started",
      "Call ambulance immediately",
      "Keep the person lying down with head slightly raised",
      "Do not give food or water",
    ],
  },
  {
    id: "burns",
    title: "Burns",
    description: "Thermal, chemical, or electrical burns to the skin.",
    steps: [
      "Cool the burn under running water for 10–15 minutes",
      "Do not apply ice, butter, or ointments",
      "Cover loosely with a sterile, non-stick dressing",
      "Seek medical help for burns larger than a palm",
    ],
  },
  {
    id: "bleeding",
    title: "Bleeding",
    description: "Cuts, wounds, or injuries causing blood loss.",
    steps: [
      "Apply firm, direct pressure with a clean cloth",
      "Elevate the injured area above heart level if possible",
      "Do not remove embedded objects",
      "Seek medical help if bleeding doesn't stop in 10 minutes",
    ],
  },
  {
    id: "fracture",
    title: "Fracture",
    description: "Suspected broken bone from a fall or impact.",
    steps: [
      "Keep the injured area still — avoid movement",
      "Support the limb with a splint if trained to do so",
      "Apply ice wrapped in cloth to reduce swelling",
      "Get to a hospital for an X-ray",
    ],
  },
  {
    id: "snake-bite",
    title: "Snake Bite",
    description: "Venomous or unknown snake bite requiring urgent care.",
    steps: [
      "Keep the person calm and still",
      "Immobilize the bitten limb below heart level",
      "Do not cut, suck, or apply ice to the wound",
      "Get to a hospital immediately for antivenom",
    ],
  },
  {
    id: "food-poisoning",
    title: "Food Poisoning",
    description: "Nausea, vomiting, or diarrhea after eating contaminated food.",
    steps: [
      "Stay hydrated with ORS or clear fluids",
      "Rest and avoid solid food until symptoms ease",
      "Avoid anti-diarrheal medicine without medical advice",
      "Seek help if there's blood, high fever, or severe dehydration",
    ],
  },
  {
    id: "allergic-reaction",
    title: "Allergic Reaction",
    description: "Swelling, rash, or difficulty breathing after exposure to an allergen.",
    steps: [
      "Remove the person from the allergen source",
      "Give an antihistamine if mild and available",
      "For difficulty breathing or swelling of the face, call 108 immediately",
      "Use an epinephrine auto-injector if prescribed and available",
    ],
  },
  {
    id: "choking",
    title: "Choking",
    description: "Airway blocked by food or an object — person can't breathe or speak.",
    steps: [
      "Encourage coughing if the person can still breathe",
      "Give 5 back blows between the shoulder blades",
      "Follow with 5 abdominal thrusts (Heimlich maneuver)",
      "Call for emergency help if the object doesn't dislodge",
    ],
  },
];

export const EMERGENCY_HOSPITALS = [
  {
    id: "hosp-1",
    name: "Coimbatore Medical College Hospital",
    distance: "0.9 km",
    travelTime: "4 min drive",
    rating: 4.6,
    emergency: "24/7 Emergency",
    phone: "+91 422 2301393",
    address: "Trichy Road, Coimbatore",
  },
  {
    id: "hosp-2",
    name: "Ganga Hospital",
    distance: "2.4 km",
    travelTime: "8 min drive",
    rating: 4.8,
    emergency: "Emergency Available",
    phone: "+91 422 2485000",
    address: "Mettupalayam Road, Coimbatore",
  },
  {
    id: "hosp-3",
    name: "PSG Hospitals",
    distance: "3.2 km",
    travelTime: "11 min drive",
    rating: 4.7,
    emergency: "24/7 Emergency",
    phone: "+91 422 2570170",
    address: "Peelamedu, Coimbatore",
  },
  {
    id: "hosp-4",
    name: "KMCH Hospital",
    distance: "5.1 km",
    travelTime: "16 min drive",
    rating: 4.8,
    emergency: "Emergency Available",
    phone: "+91 422 4323800",
    address: "Avinashi Road, Coimbatore",
  },
];

export const EMERGENCY_MEDICINES = [
  {
    id: "em-1",
    name: "Paracetamol",
    purpose: "Fever & pain relief",
    price: 18,
    availability: "In Stock",
  },
  {
    id: "em-2",
    name: "ORS",
    purpose: "Dehydration & fluid loss",
    price: 25,
    availability: "In Stock",
  },
  {
    id: "em-3",
    name: "Band-Aid",
    purpose: "Minor cuts & wounds",
    price: 55,
    availability: "In Stock",
  },
  {
    id: "em-4",
    name: "Antiseptic Solution",
    purpose: "Wound cleaning",
    price: 65,
    availability: "Limited Stock",
  },
  {
    id: "em-5",
    name: "Cotton Roll",
    purpose: "Dressing & first aid",
    price: 30,
    availability: "In Stock",
  },
  {
    id: "em-6",
    name: "Pain Relief Spray",
    purpose: "Muscle & joint pain",
    price: 110,
    availability: "In Stock",
  },
];

export const EMERGENCY_CHECKLIST = [
  "First Aid Kit",
  "Emergency Contacts Saved",
  "Required Medicines",
  "Water Bottle",
  "Prescription Copies",
];

export const SAFETY_TIPS = [
  "Do not self-medicate during serious emergencies.",
  "Call emergency services immediately if symptoms become severe.",
  "Keep emergency numbers accessible at all times.",
  "Store medicines safely away from children.",
];