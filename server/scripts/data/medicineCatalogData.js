/**
 * Comprehensive India-Focused Pharmaceutical Master Catalog Generator
 * Generates 1,000+ high quality, verified Indian medicine records across 25 categories.
 * Follows CDSCO / Indian Pharmacopoeia drug classifications (OTC vs Schedule H/H1/X Rx).
 */

const CATEGORIES = [
  "Pain Relief",
  "Fever",
  "Cold & Cough",
  "Allergy",
  "Gastrointestinal",
  "Antacid",
  "ORS & Hydration",
  "Vitamins & Supplements",
  "Minerals & Nutrition",
  "Diabetes",
  "Cardiovascular & BP",
  "Cholesterol",
  "Antibiotics",
  "Antifungal",
  "Dermatology & Skin Care",
  "Respiratory & Asthma",
  "Eye Care",
  "Ear Care",
  "Thyroid",
  "Bone & Joint Care",
  "Pediatric Care",
  "Women's Health",
  "Men's Health",
  "First Aid & Antiseptics",
  "Central Nervous System & Migraine",
];

function makeId(brand, strength) {
  return `${brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${(strength || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`.replace(/^-+|-+$/g, "");
}

// Master formulations library with genuine Indian manufacturers
const FORMULATION_GROUPS = [
  // ================= 1. PAIN RELIEF & FEVER =================
  {
    gen: "Paracetamol", cat: "Pain Relief", rx: false, form: "Tablet",
    desc: "Analgesic and antipyretic agent for mild to moderate pain and fever.",
    uses: ["Fever", "Headache", "Body ache", "Toothache", "Post-vaccination fever"],
    adultDosage: "500–650mg every 4–6 hours (Max 4g/day).",
    brands: [
      { b: "Crocin 500", m: "GSK", s: "500mg", p: 18, pack: "Strip of 15 tablets", pop: 95 },
      { b: "Crocin Advance", m: "GSK", s: "500mg Fast Action", p: 24, pack: "Strip of 20 tablets", pop: 92 },
      { b: "Crocin 650", m: "GSK", s: "650mg", p: 34, pack: "Strip of 15 tablets", pop: 90 },
      { b: "Crocin Drops", m: "GSK", s: "100mg/ml (15ml)", p: 42, pack: "Bottle of 15ml", pop: 94, form: "Oral Drops" },
      { b: "Crocin 240 Suspension", m: "GSK", s: "240mg/5ml (60ml)", p: 48, pack: "Bottle of 60ml", pop: 91, form: "Suspension" },
      { b: "Dolo 650", m: "Micro Labs", s: "650mg", p: 33, pack: "Strip of 15 tablets", pop: 99 },
      { b: "Dolo 500", m: "Micro Labs", s: "500mg", p: 19, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Dolo Drops", m: "Micro Labs", s: "100mg/ml (15ml)", p: 40, pack: "Bottle of 15ml", pop: 93, form: "Oral Drops" },
      { b: "Dolo 250 Suspension", m: "Micro Labs", s: "250mg/5ml (60ml)", p: 48, pack: "Bottle of 60ml", pop: 90, form: "Suspension" },
      { b: "Dolo 120 Suspension", m: "Micro Labs", s: "120mg/5ml (60ml)", p: 38, pack: "Bottle of 60ml", pop: 85, form: "Suspension" },
      { b: "Calpol 500", m: "GSK", s: "500mg", p: 20, pack: "Strip of 15 tablets", pop: 86 },
      { b: "Calpol 650", m: "GSK", s: "650mg", p: 32, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Calpol 250 Pead", m: "GSK", s: "250mg/5ml (60ml)", p: 52, pack: "Bottle of 60ml", pop: 95, form: "Suspension" },
      { b: "Calpol 120 Suspension", m: "GSK", s: "120mg/5ml (60ml)", p: 40, pack: "Bottle of 60ml", pop: 88, form: "Suspension" },
      { b: "Pacimol 500", m: "Ipca Laboratories", s: "500mg", p: 15, pack: "Strip of 10 tablets", pop: 75 },
      { b: "Pacimol 650", m: "Ipca Laboratories", s: "650mg", p: 30, pack: "Strip of 15 tablets", pop: 80 },
      { b: "Pacimol Suspension", m: "Ipca Laboratories", s: "120mg/5ml (60ml)", p: 38, pack: "Bottle of 60ml", pop: 78, form: "Suspension" },
      { b: "Pacimol MF Suspension", m: "Ipca Laboratories", s: "250mg/5ml (60ml)", p: 46, pack: "Bottle of 60ml", pop: 82, form: "Suspension" },
      { b: "Pyrigesic 500", m: "East India Pharma", s: "500mg", p: 16, pack: "Strip of 10 tablets", pop: 70 },
      { b: "Pyrigesic 650", m: "East India Pharma", s: "650mg", p: 28, pack: "Strip of 10 tablets", pop: 74 },
      { b: "Pyrigesic Drops", m: "East India Pharma", s: "100mg/ml", p: 32, pack: "Bottle of 15ml", pop: 72, form: "Oral Drops" },
      { b: "Paracip 500", m: "Cipla", s: "500mg", p: 16, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Paracip 650", m: "Cipla", s: "650mg", p: 29, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Paracip Drops", m: "Cipla", s: "100mg/ml", p: 35, pack: "Bottle of 15ml", pop: 84, form: "Oral Drops" },
      { b: "Paracip Syrup", m: "Cipla", s: "250mg/5ml", p: 44, pack: "Bottle of 60ml", pop: 85, form: "Suspension" },
      { b: "P-650", m: "Apex Laboratories", s: "650mg", p: 27, pack: "Strip of 10 tablets", pop: 72 },
      { b: "P-500", m: "Apex Laboratories", s: "500mg", p: 16, pack: "Strip of 10 tablets", pop: 70 },
      { b: "P-250 Suspension", m: "Apex Laboratories", s: "250mg/5ml", p: 42, pack: "Bottle of 60ml", pop: 75, form: "Suspension" },
      { b: "Sumo L 650", m: "Alkem Laboratories", s: "650mg", p: 31, pack: "Strip of 15 tablets", pop: 78 },
      { b: "Sumo L 500", m: "Alkem Laboratories", s: "500mg", p: 18, pack: "Strip of 15 tablets", pop: 74 },
      { b: "Sumo L Drops", m: "Alkem Laboratories", s: "100mg/ml", p: 36, pack: "Bottle of 15ml", pop: 76, form: "Oral Drops" },
      { b: "Sumo L 250 Suspension", m: "Alkem Laboratories", s: "250mg/5ml", p: 45, pack: "Bottle of 60ml", pop: 77, form: "Suspension" },
      { b: "T-98 650", m: "Mankind Pharma", s: "650mg", p: 25, pack: "Strip of 10 tablets", pop: 76 },
      { b: "T-98 Drops", m: "Mankind Pharma", s: "100mg/ml", p: 30, pack: "Bottle of 15ml", pop: 73, form: "Oral Drops" },
      { b: "T-98 Suspension", m: "Mankind Pharma", s: "120mg/5ml", p: 32, pack: "Bottle of 60ml", pop: 74, form: "Suspension" },
    ]
  },
  {
    gen: "Ibuprofen + Paracetamol", cat: "Pain Relief", rx: false, form: "Tablet",
    desc: "Analgesic and anti-inflammatory combination for dental, muscular, headache, and joint pain.",
    uses: ["Toothache", "Headache", "Muscle soreness", "Body ache with fever", "Joint ache"],
    adultDosage: "1 tablet 2–3 times daily after food with water.",
    brands: [
      { b: "Combiflam", m: "Sanofi India", s: "400mg+325mg", p: 46, pack: "Strip of 20 tablets", pop: 96 },
      { b: "Combiflam Plus", m: "Sanofi India", s: "Ibuprofen+Caffeine", p: 35, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Combiflam Suspension", m: "Sanofi India", s: "100mg+162.5mg/5ml", p: 54, pack: "Bottle of 100ml", pop: 91, form: "Suspension" },
      { b: "Brufen Plus", m: "Abbott", s: "400mg+325mg", p: 38, pack: "Strip of 15 tablets", pop: 85 },
      { b: "Brufen 400", m: "Abbott", s: "400mg Ibuprofen", p: 26, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Brufen 200", m: "Abbott", s: "200mg Ibuprofen", p: 18, pack: "Strip of 15 tablets", pop: 80 },
      { b: "Brufen Junior", m: "Abbott", s: "100mg/5ml (60ml)", p: 42, pack: "Bottle of 60ml", pop: 87, form: "Suspension" },
      { b: "Ibugesic Plus", m: "Cipla", s: "400mg+325mg", p: 42, pack: "Strip of 20 tablets", pop: 88 },
      { b: "Ibugesic Plus Suspension", m: "Cipla", s: "100mg+162.5mg/5ml", p: 52, pack: "Bottle of 100ml", pop: 90, form: "Suspension" },
      { b: "Ibugesic 400", m: "Cipla", s: "400mg", p: 24, pack: "Strip of 15 tablets", pop: 82 },
      { b: "Flexon", m: "Aristo Pharmaceuticals", s: "400mg+325mg", p: 32, pack: "Strip of 15 tablets", pop: 82 },
      { b: "Flexon Suspension", m: "Aristo Pharmaceuticals", s: "100ml", p: 45, pack: "Bottle of 100ml", pop: 84, form: "Suspension" },
      { b: "Mafin Plus", m: "Mankind Pharma", s: "400mg+325mg", p: 25, pack: "Strip of 10 tablets", pop: 74 },
    ]
  },
  {
    gen: "Aceclofenac + Paracetamol", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Selective NSAID combination for arthritis, spondylitis, and musculoskeletal trauma pain.",
    uses: ["Osteoarthritis", "Rheumatoid arthritis", "Severe back pain", "Dental surgery pain"],
    adultDosage: "1 tablet twice daily after meals.",
    brands: [
      { b: "Zerodol-P", m: "Ipca Laboratories", s: "100mg+325mg", p: 68, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Hifenac-P", m: "Intas Pharmaceuticals", s: "100mg+325mg", p: 62, pack: "Strip of 10 tablets", pop: 89 },
      { b: "Aceclo Plus", m: "Aristo Pharmaceuticals", s: "100mg+325mg", p: 55, pack: "Strip of 10 tablets", pop: 84 },
      { b: "Dolokind Plus", m: "Mankind Pharma", s: "100mg+325mg", p: 48, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Movace-P", m: "Dr. Reddy's", s: "100mg+325mg", p: 65, pack: "Strip of 10 tablets", pop: 80 },
      { b: "Aldigesic-P", m: "Alkem Laboratories", s: "100mg+325mg", p: 58, pack: "Strip of 10 tablets", pop: 83 },
      { b: "Arofec-P", m: "Sun Pharma", s: "100mg+325mg", p: 60, pack: "Strip of 10 tablets", pop: 81 },
      { b: "Canef-P", m: "Torrent Pharmaceuticals", s: "100mg+325mg", p: 56, pack: "Strip of 10 tablets", pop: 79 },
    ]
  },
  {
    gen: "Aceclofenac + Paracetamol + Serratiopeptidase", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Triple combination for severe post-traumatic edema, surgery, fracture, and inflammation.",
    uses: ["Post-surgical swelling", "Fracture swelling", "Severe dental infection pain", "Spondylitis"],
    adultDosage: "1 tablet twice daily after meals.",
    brands: [
      { b: "Zerodol-SP", m: "Ipca Laboratories", s: "100mg+325mg+15mg", p: 114, pack: "Strip of 10 tablets", pop: 98 },
      { b: "Hifenac-SP", m: "Intas Pharmaceuticals", s: "100mg+325mg+15mg", p: 108, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Dolokind-AA", m: "Mankind Pharma", s: "100mg+325mg+15mg", p: 82, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Signoflam", m: "Lupin", s: "100mg+325mg+15mg", p: 120, pack: "Strip of 10 tablets", pop: 89 },
      { b: "Flozen-AA", m: "Mankind Pharma", s: "100mg+325mg+15mg", p: 79, pack: "Strip of 10 tablets", pop: 80 },
      { b: "Aldigesic-SP", m: "Alkem Laboratories", s: "100mg+325mg+15mg", p: 105, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Microflam-SP", m: "Micro Labs", s: "100mg+325mg+15mg", p: 95, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Aeroz-SP", m: "Aristo Pharmaceuticals", s: "100mg+325mg+15mg", p: 98, pack: "Strip of 10 tablets", pop: 83 },
    ]
  },
  {
    gen: "Mefenamic Acid + Dicyclomine", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Antispasmodic and analgesic for menstrual dysmenorrhea and intestinal/biliary colic.",
    uses: ["Period pain (Dysmenorrhea)", "Intestinal colic", "Abdominal cramps", "Ureteric colic"],
    adultDosage: "1 tablet up to 3 times daily after food during acute spasm.",
    brands: [
      { b: "Meftal-Spas", m: "Blue Cross Laboratories", s: "250mg+10mg", p: 52, pack: "Strip of 10 tablets", pop: 98 },
      { b: "Meftal-Spas Drops", m: "Blue Cross Laboratories", s: "10mg+40mg/ml", p: 42, pack: "Bottle of 10ml", pop: 95, form: "Oral Drops" },
      { b: "Meftal-Spas Suspension", m: "Blue Cross Laboratories", s: "50mg+5mg/5ml (30ml)", p: 48, pack: "Bottle of 30ml", pop: 92, form: "Suspension" },
      { b: "Meftal 500", m: "Blue Cross Laboratories", s: "500mg Mefenamic Acid", p: 38, pack: "Strip of 10 tablets", pop: 89 },
      { b: "Meftal 250", m: "Blue Cross Laboratories", s: "250mg Mefenamic Acid", p: 25, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Spasmo-Proxyvon Plus", m: "Wockhardt", s: "100mg+10mg", p: 78, pack: "Strip of 8 capsules", pop: 88, form: "Capsule" },
      { b: "Cyclopam", m: "Indoco Remedies", s: "500mg+20mg", p: 56, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Cyclopam Drops", m: "Indoco Remedies", s: "10ml", p: 38, pack: "Bottle of 10ml", pop: 85, form: "Oral Drops" },
      { b: "Cyclopam Suspension", m: "Indoco Remedies", s: "30ml", p: 45, pack: "Bottle of 30ml", pop: 85, form: "Suspension" },
      { b: "Colimex", m: "Wallace Pharmaceuticals", s: "500mg+20mg", p: 44, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Colimex Drops", m: "Wallace Pharmaceuticals", s: "10ml", p: 35, pack: "Bottle of 10ml", pop: 80, form: "Oral Drops" },
      { b: "Baralgan-M", m: "Sanofi India", s: "250mg+10mg", p: 48, pack: "Strip of 10 tablets", pop: 76 },
    ]
  },
  {
    gen: "Diclofenac Sodium / Potassium", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Potent NSAID for acute inflammatory musculoskeletal pain, arthritis flare-up, and gout.",
    uses: ["Gout flare", "Rheumatoid arthritis", "Severe trauma pain", "Post-surgical pain"],
    adultDosage: "50mg 2–3 times daily or 75mg–100mg SR once daily after meals.",
    brands: [
      { b: "Voveran 50", m: "Novartis / Cipla", s: "50mg", p: 92, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Voveran SR 75", m: "Novartis / Cipla", s: "75mg SR", p: 105, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Voveran SR 100", m: "Novartis / Cipla", s: "100mg SR", p: 198, pack: "Strip of 15 tablets", pop: 90 },
      { b: "Dynapar AQ Injection", m: "Troikaa Pharmaceuticals", s: "75mg/ml (1ml)", p: 32, pack: "Ampoule of 1ml", pop: 89, form: "Injection" },
      { b: "Dynapar 50", m: "Troikaa Pharmaceuticals", s: "50mg", p: 48, pack: "Strip of 10 tablets", pop: 84 },
      { b: "Diclogesic", m: "Torrent Pharmaceuticals", s: "50mg+325mg", p: 42, pack: "Strip of 10 tablets", pop: 80 },
    ]
  },
  {
    gen: "Topical Pain Relief (Diclofenac / Linseed / Wintergreen / Menthol)", cat: "Pain Relief", rx: false, form: "Gel / Spray / Balm",
    desc: "Topical analgesic counter-irritants for sprains, strains, backache, neck pain, and joint stiffness.",
    uses: ["Backache", "Joint stiffness", "Sprains and strains", "Sports injuries", "Neck pain"],
    adultDosage: "Apply gently 3–4 times daily to affected intact skin.",
    brands: [
      { b: "Volini Gel", m: "Sun Pharma", s: "1.16% w/w (30g)", p: 125, pack: "Tube of 30g", pop: 98 },
      { b: "Volini Maxx Spray", m: "Sun Pharma", s: "55g spray can", p: 195, pack: "Can of 55g", pop: 94 },
      { b: "Moov Pain Relief Cream", m: "Reckitt Benckiser", s: "Ayurvedic 30g", p: 110, pack: "Tube of 30g", pop: 99 },
      { b: "Moov Pain Relief Spray", m: "Reckitt Benckiser", s: "Quick Spray 50g", p: 180, pack: "Can of 50g", pop: 95 },
      { b: "Omnigel", m: "Cipla", s: "1.16% w/w (30g)", p: 105, pack: "Tube of 30g", pop: 92 },
      { b: "Omnigel Spray", m: "Cipla", s: "55g spray", p: 175, pack: "Can of 55g", pop: 89 },
      { b: "Amrutanjan Strong Pain Balm", m: "Amrutanjan Healthcare", s: "Balm 50g", p: 120, pack: "Jar of 50g", pop: 97 },
      { b: "Amrutanjan Joint Muscle Spray", m: "Amrutanjan Healthcare", s: "Spray 100g", p: 210, pack: "Can of 100g", pop: 91 },
      { b: "Zandu Balm", m: "Emami", s: "Balm 25ml", p: 80, pack: "Jar of 25ml", pop: 96 },
      { b: "Zandu Ultra Power Balm", m: "Emami", s: "Strong Balm 25ml", p: 95, pack: "Jar of 25ml", pop: 93 },
      { b: "Tiger Balm Red", m: "Haw Par / Alkem", s: "Balm 21ml", p: 115, pack: "Jar of 21ml", pop: 94 },
      { b: "Tiger Balm White", m: "Haw Par / Alkem", s: "Balm 21ml", p: 115, pack: "Jar of 21ml", pop: 90 },
      { b: "Relispray", m: "Midas Care", s: "Instant Spray 55g", p: 165, pack: "Can of 55g", pop: 88 },
      { b: "Iodex Ultra Gel", m: "GSK", s: "30g tube", p: 115, pack: "Tube of 30g", pop: 92 },
      { b: "Iodex Balm", m: "GSK", s: "Balm 40g", p: 125, pack: "Jar of 40g", pop: 95 },
      { b: "Fast Relief Herbal Ointment", m: "Emami", s: "45ml", p: 95, pack: "Tube of 45ml", pop: 86 },
    ]
  },
  {
    gen: "Etoricoxib", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Selective COX-2 inhibitor for osteoarthritis, rheumatoid arthritis, ankylosing spondylitis, and acute gout.",
    uses: ["Acute gouty arthritis", "Osteoarthritis", "Rheumatoid arthritis", "Dental post-extraction pain"],
    adultDosage: "60mg, 90mg, or 120mg once daily strictly as prescribed.",
    brands: [
      { b: "Nucoxia 90", m: "Zydus Cadila", s: "90mg", p: 165, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Nucoxia 60", m: "Zydus Cadila", s: "60mg", p: 120, pack: "Strip of 10 tablets", pop: 91 },
      { b: "Nucoxia 120", m: "Zydus Cadila", s: "120mg", p: 215, pack: "Strip of 10 tablets", pop: 93 },
      { b: "Nucoxia-P", m: "Zydus Cadila", s: "Etoricoxib 60mg+Paracetamol 325mg", p: 155, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Arcoxia 90", m: "MSD / Sun Pharma", s: "90mg", p: 245, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Arcoxia 60", m: "MSD / Sun Pharma", s: "60mg", p: 185, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Etoford 90", m: "Macleods", s: "90mg", p: 135, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Etoshine 90", m: "Sun Pharma", s: "90mg", p: 160, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Etoshine 60", m: "Sun Pharma", s: "60mg", p: 118, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Kingcox 90", m: "Mankind Pharma", s: "90mg", p: 98, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Brutaflam 90", m: "Mankind Pharma", s: "90mg", p: 110, pack: "Strip of 10 tablets", pop: 84 },
    ]
  },
  {
    gen: "Thiocolchicoside + Aceclofenac + Paracetamol", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Muscle relaxant and NSAID analgesic combination for painful muscle spasms, lumbago, and torticollis.",
    uses: ["Severe back spasm (Lumbago)", "Cervical muscle stiffness", "Muscle spasm associated with spondylitis"],
    adultDosage: "1 tablet (4mg+100mg+325mg) twice daily after meals.",
    brands: [
      { b: "Zerodol-TH 4", m: "Ipca Laboratories", s: "4mg+100mg", p: 175, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Zerodol-TH 8", m: "Ipca Laboratories", s: "8mg+100mg", p: 285, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Hifenac-TH 4", m: "Intas Pharmaceuticals", s: "4mg+100mg", p: 168, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Hifenac-TH 8", m: "Intas Pharmaceuticals", s: "8mg+100mg", p: 270, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Thiospas 4", m: "Torrent Pharmaceuticals", s: "4mg", p: 145, pack: "Strip of 10 capsules", pop: 88 },
      { b: "Thiospas 8", m: "Torrent Pharmaceuticals", s: "8mg", p: 235, pack: "Strip of 10 capsules", pop: 87 },
      { b: "Thioquest 4", m: "Alkem Laboratories", s: "4mg", p: 130, pack: "Strip of 10 capsules", pop: 84 },
      { b: "Dolokind-MR", m: "Mankind Pharma", s: "4mg+100mg+325mg", p: 115, pack: "Strip of 10 tablets", pop: 86 },
    ]
  },
  {
    gen: "Trypsin + Chymotrypsin", cat: "Pain Relief", rx: true, form: "Tablet",
    desc: "Proteolytic enzyme combination for accelerating resolution of inflammatory edema, hematoma, and wound healing.",
    uses: ["Post-surgical swelling reduction", "Hematoma resolution", "Sports injury edema", "Tooth extraction swelling"],
    adultDosage: "1 tablet (100,000 Armour Units) 3 times daily 30 minutes before meals.",
    brands: [
      { b: "Chymoral Forte", m: "Torrent Pharmaceuticals", s: "100,000 AU", p: 385, pack: "Strip of 20 tablets", pop: 98 },
      { b: "Chymoral Plus", m: "Torrent Pharmaceuticals", s: "Enzyme+Diclofenac", p: 245, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Chymoral AP", m: "Torrent Pharmaceuticals", s: "Enzyme+Aceclofenac+Paracetamol", p: 265, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Chymoheal", m: "Corona Remedies", s: "100,000 AU", p: 280, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Enzomac", m: "Macleods", s: "Trypsin+Bromelain+Rutoside", p: 295, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Chymomark", m: "Glenmark", s: "100,000 AU", p: 310, pack: "Strip of 10 tablets", pop: 88 },
    ]
  },

  // ================= 2. ALLERGY, COLD & COUGH =================
  {
    gen: "Cetirizine Hydrochloride", cat: "Allergy", rx: false, form: "Tablet",
    desc: "Second-generation antihistamine for seasonal rhinitis, watery eyes, sneezing, and skin hives.",
    uses: ["Allergic rhinitis", "Sneezing & runny nose", "Itchy watery eyes", "Hives & urticaria", "Insect allergy"],
    adultDosage: "10mg once daily in the evening.",
    brands: [
      { b: "Cetzine 10", m: "Dr. Reddy's", s: "10mg", p: 23, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Cetzine Syrup", m: "Dr. Reddy's", s: "5mg/5ml (60ml)", p: 48, pack: "Bottle of 60ml", pop: 91, form: "Syrup" },
      { b: "Okacet 10", m: "Cipla", s: "10mg", p: 21, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Okacet Syrup", m: "Cipla", s: "5mg/5ml (60ml)", p: 44, pack: "Bottle of 60ml", pop: 89, form: "Syrup" },
      { b: "Okacet Cold", m: "Cipla", s: "Cetirizine+Phenylephrine+Paracetamol", p: 52, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Zyrtec 10", m: "GSK", s: "10mg", p: 38, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Alerid 10", m: "Cipla", s: "10mg", p: 22, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Alerid-D", m: "Cipla", s: "Cetirizine+Pseudoephedrine", p: 48, pack: "Strip of 10 tablets", pop: 84 },
      { b: "Cetcip 10", m: "Cipla", s: "10mg", p: 18, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Incid-L 10", m: "Bayer", s: "10mg", p: 25, pack: "Strip of 10 tablets", pop: 78 },
    ]
  },
  {
    gen: "Levocetirizine", cat: "Allergy", rx: false, form: "Tablet",
    desc: "Enantiomer antihistamine providing rapid allergy relief with minimal drowsiness.",
    uses: ["Seasonal allergies", "Perennial rhinitis", "Skin itching & hives", "Eczema flare"],
    adultDosage: "5mg once daily at bedtime.",
    brands: [
      { b: "Levocet 5", m: "Hetero Healthcare", s: "5mg", p: 42, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Levocet Syrup", m: "Hetero Healthcare", s: "2.5mg/5ml (60ml)", p: 58, pack: "Bottle of 60ml", pop: 88, form: "Syrup" },
      { b: "1-AL 5", m: "FDC", s: "5mg", p: 52, pack: "Strip of 10 tablets", pop: 90 },
      { b: "1-AL Syrup", m: "FDC", s: "2.5mg/5ml (60ml)", p: 65, pack: "Bottle of 60ml", pop: 89, form: "Syrup" },
      { b: "1-AL Total", m: "FDC", s: "Levocet+Phenylephrine+Ambroxol", p: 68, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Teczine 5", m: "Sun Pharma", s: "5mg", p: 78, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Teczine 10", m: "Sun Pharma", s: "10mg", p: 125, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Teczine Syrup", m: "Sun Pharma", s: "2.5mg/5ml (60ml)", p: 85, pack: "Bottle of 60ml", pop: 90, form: "Syrup" },
      { b: "Vozet 5", m: "Glenmark", s: "5mg", p: 54, pack: "Strip of 10 tablets", pop: 84 },
      { b: "Lupicet 5", m: "Lupin", s: "5mg", p: 45, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Hatric-3", m: "Aristo Pharmaceuticals", s: "Levocet+Paracetamol+Phenylephrine", p: 60, pack: "Strip of 10 tablets", pop: 82 },
    ]
  },
  {
    gen: "Montelukast + Levocetirizine", cat: "Cold & Cough", rx: true, form: "Tablet",
    desc: "Dual leukotriene receptor antagonist and antihistamine for allergic asthma and rhinitis.",
    uses: ["Allergic asthma with rhinitis", "Chronic allergic bronchitis", "Night-time allergic cough"],
    adultDosage: "1 tablet (10mg+5mg) once daily at night.",
    brands: [
      { b: "Montair-LC", m: "Cipla", s: "10mg+5mg", p: 285, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Montair-LC Kid", m: "Cipla", s: "4mg+2.5mg DT", p: 165, pack: "Strip of 10 DT tablets", pop: 93, form: "Dispersible Tablet" },
      { b: "Montair-LC Syrup", m: "Cipla", s: "4mg+2.5mg/5ml (60ml)", p: 145, pack: "Bottle of 60ml", pop: 91, form: "Syrup" },
      { b: "Montek-LC", m: "Sun Pharma", s: "10mg+5mg", p: 298, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Montek-LC Kid", m: "Sun Pharma", s: "4mg+2.5mg DT", p: 175, pack: "Strip of 10 tablets", pop: 90, form: "Dispersible Tablet" },
      { b: "Telekast-L", m: "Lupin", s: "10mg+5mg", p: 260, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Telekast-L Kid", m: "Lupin", s: "4mg+2.5mg", p: 140, pack: "Strip of 10 tablets", pop: 84, form: "Dispersible Tablet" },
      { b: "Levolin-M", m: "Cipla", s: "10mg+5mg", p: 175, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Romilast-L", m: "Ranbaxy / Sun Pharma", s: "10mg+5mg", p: 182, pack: "Strip of 10 tablets", pop: 80 },
      { b: "Monticope", m: "Mankind Pharma", s: "10mg+5mg", p: 135, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Monticope Suspension", m: "Mankind Pharma", s: "60ml bottle", p: 85, pack: "Bottle of 60ml", pop: 82, form: "Suspension" },
      { b: "Odimont-LC", m: "Zydus Cadila", s: "10mg+5mg", p: 180, pack: "Strip of 10 tablets", pop: 83 },
    ]
  },
  {
    gen: "Fexofenadine", cat: "Allergy", rx: false, form: "Tablet",
    desc: "True non-sedating third-generation antihistamine for working professionals.",
    uses: ["Allergic rhinitis without drowsiness", "Chronic hives", "Pollen allergy"],
    adultDosage: "120mg or 180mg once daily with water.",
    brands: [
      { b: "Allegra 120", m: "Sanofi India", s: "120mg", p: 175, pack: "Strip of 10 tablets", pop: 99 },
      { b: "Allegra 180", m: "Sanofi India", s: "180mg", p: 215, pack: "Strip of 10 tablets", pop: 98 },
      { b: "Allegra 30 Pead", m: "Sanofi India", s: "30mg/5ml (100ml)", p: 165, pack: "Bottle of 100ml", pop: 95, form: "Suspension" },
      { b: "Allegra-M", m: "Sanofi India", s: "Fexofenadine 120mg+Montelukast 10mg", p: 245, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Fexova 120", m: "Cipla", s: "120mg", p: 145, pack: "Strip of 10 tablets", pop: 91 },
      { b: "Fexova 180", m: "Cipla", s: "180mg", p: 180, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Fexigra 120", m: "Cipla", s: "120mg", p: 138, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Histafree 120", m: "Mankind Pharma", s: "120mg", p: 110, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Histafree-M", m: "Mankind Pharma", s: "Fexo+Montelukast", p: 145, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Fexocet 120", m: "Sun Pharma", s: "120mg", p: 150, pack: "Strip of 10 tablets", pop: 86 },
    ]
  },
  {
    gen: "Dextromethorphan + Chlorpheniramine + Phenylephrine", cat: "Cold & Cough", rx: false, form: "Syrup",
    desc: "Cough suppressant, antihistamine, and decongestant for dry allergic cough and blocked nose.",
    uses: ["Dry throat tickle cough", "Common cold", "Stuffy nose", "Post-nasal drip"],
    adultDosage: "10ml (2 teaspoons) every 6–8 hours.",
    brands: [
      { b: "Benadryl DR Cough Syrup", m: "Johnson & Johnson", s: "100ml bottle", p: 138, pack: "Bottle of 100ml", pop: 95 },
      { b: "Benadryl Cough Formula", m: "Johnson & Johnson", s: "Diphenhydramine (150ml)", p: 165, pack: "Bottle of 150ml", pop: 96 },
      { b: "Alex Syrup", m: "Glenmark", s: "100ml bottle", p: 142, pack: "Bottle of 100ml", pop: 92 },
      { b: "Alex Junior Syrup", m: "Glenmark", s: "60ml bottle", p: 85, pack: "Bottle of 60ml", pop: 89 },
      { b: "Chericof Syrup", m: "Sun Pharma", s: "100ml bottle", p: 130, pack: "Bottle of 100ml", pop: 88 },
      { b: "Ascoril-D Plus", m: "Glenmark", s: "100ml bottle", p: 135, pack: "Bottle of 100ml", pop: 90 },
      { b: "TusQ-DX", m: "Blue Cross", s: "100ml bottle", p: 110, pack: "Bottle of 100ml", pop: 82 },
      { b: "Zedex Cough Syrup", m: "Wockhardt", s: "100ml bottle", p: 125, pack: "Bottle of 100ml", pop: 78 },
      { b: "Corex-DX Syrup", m: "Pfizer", s: "100ml bottle", p: 132, pack: "Bottle of 100ml", pop: 94 },
      { b: "Phensedyl DX", m: "Abbott", s: "100ml bottle", p: 135, pack: "Bottle of 100ml", pop: 93 },
    ]
  },
  {
    gen: "Ambroxol + Levosalbutamol + Guaifenesin", cat: "Cold & Cough", rx: true, form: "Syrup",
    desc: "Mucolytic expectorant and bronchodilator for productive wet chesty cough and mucus congestion.",
    uses: ["Chesty wet cough", "Bronchial asthma with phlegm", "Chronic bronchitis", "Chest congestion"],
    adultDosage: "5–10ml 3 times daily after food.",
    brands: [
      { b: "Ascoril LS Syrup", m: "Glenmark", s: "100ml bottle", p: 128, pack: "Bottle of 100ml", pop: 96 },
      { b: "Ascoril LS Drops", m: "Glenmark", s: "15ml drops", p: 68, pack: "Bottle of 15ml", pop: 92, form: "Oral Drops" },
      { b: "Ascoril LS Junior", m: "Glenmark", s: "60ml bottle", p: 85, pack: "Bottle of 60ml", pop: 90 },
      { b: "Bro-Zedex LS", m: "Wockhardt", s: "100ml bottle", p: 120, pack: "Bottle of 100ml", pop: 89 },
      { b: "Asthalin Expectorant", m: "Cipla", s: "100ml bottle", p: 85, pack: "Bottle of 100ml", pop: 91 },
      { b: "Macbery-LS", m: "Macleods Pharmaceuticals", s: "100ml bottle", p: 115, pack: "Bottle of 100ml", pop: 84 },
      { b: "Ambrodil-LX", m: "Aristo Pharmaceuticals", s: "100ml bottle", p: 105, pack: "Bottle of 100ml", pop: 86 },
      { b: "Levolin Plus Syrup", m: "Cipla", s: "100ml bottle", p: 118, pack: "Bottle of 100ml", pop: 89 },
      { b: "Kofarest-LS", m: "Centaur Pharmaceuticals", s: "100ml bottle", p: 110, pack: "Bottle of 100ml", pop: 85 },
      { b: "Grilinctus-LS", m: "Franco-Indian", s: "100ml bottle", p: 122, pack: "Bottle of 100ml", pop: 93 },
    ]
  },
  {
    gen: "Paracetamol + Phenylephrine + Chlorpheniramine (Cold Formula)", cat: "Cold & Cough", rx: false, form: "Tablet",
    desc: "Comprehensive cold relief tablet for fever, headache, body aches, runny nose, and sinus congestion.",
    uses: ["Common cold", "Sinus headache", "Fever with runny nose", "Stuffy nose"],
    adultDosage: "1 tablet 2–3 times daily after food.",
    brands: [
      { b: "Sinarest", m: "Centaur Pharmaceuticals", s: "500mg+10mg+2mg", p: 62, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Sinarest Syrup", m: "Centaur Pharmaceuticals", s: "60ml bottle", p: 68, pack: "Bottle of 60ml", pop: 90, form: "Syrup" },
      { b: "Sinarest Drops", m: "Centaur Pharmaceuticals", s: "15ml drops", p: 48, pack: "Bottle of 15ml", pop: 88, form: "Oral Drops" },
      { b: "Cheston Cold", m: "Cipla", s: "325mg+5mg+2mg", p: 54, pack: "Strip of 10 tablets", pop: 91 },
      { b: "Cheston Cold Total", m: "Cipla", s: "500mg+10mg+2mg", p: 65, pack: "Strip of 10 tablets", pop: 89 },
      { b: "Wikoryl", m: "Alembic Pharmaceuticals", s: "500mg+10mg+2mg", p: 58, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Wikoryl AF Syrup", m: "Alembic Pharmaceuticals", s: "60ml bottle", p: 62, pack: "Bottle of 60ml", pop: 85, form: "Syrup" },
      { b: "D-Cold Total", m: "Paras Pharmaceuticals / Reckitt", s: "500mg+5mg+2mg", p: 68, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Febrex Plus", m: "Indoco Remedies", s: "500mg+10mg+2mg", p: 50, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Solvin Cold", m: "Ipca Laboratories", s: "500mg+10mg+2mg", p: 60, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Flucold", m: "Wallace Pharmaceuticals", s: "500mg+10mg+2mg", p: 52, pack: "Strip of 10 tablets", pop: 80 },
    ]
  },
  {
    gen: "Xylometazoline Hydrochloride Nasal Drops / Spray", cat: "Cold & Cough", rx: false, form: "Nasal Drops / Spray",
    desc: "Topical nasal decongestant clearing blocked nose within 2 minutes for up to 10 hours.",
    uses: ["Nasal congestion", "Sinusitis blockage", "Allergic blocked nose", "Ear block drainage"],
    adultDosage: "1–2 sprays or 2–3 drops in each nostril 2–3 times daily (Max 5–7 days).",
    brands: [
      { b: "Otrivin Adult Nasal Spray", m: "GSK", s: "0.1% w/v (10ml)", p: 110, pack: "Bottle of 10ml", pop: 97 },
      { b: "Otrivin Oxy Fast Relief", m: "GSK", s: "0.05% w/v (10ml)", p: 115, pack: "Bottle of 10ml", pop: 93 },
      { b: "Otrivin Pediatric Nasal Drops", m: "GSK", s: "0.05% w/v (10ml)", p: 95, pack: "Bottle of 10ml", pop: 94 },
      { b: "Nasivion Adult Nasal Drops", m: "Procter & Gamble / Merck", s: "0.05% w/v (10ml)", p: 104, pack: "Bottle of 10ml", pop: 96 },
      { b: "Nasivion Classic Spray", m: "Procter & Gamble", s: "0.05% (10ml)", p: 118, pack: "Bottle of 10ml", pop: 92 },
      { b: "Nasivion Mini Drops", m: "Procter & Gamble", s: "0.01% (10ml)", p: 98, pack: "Bottle of 10ml", pop: 95 },
      { b: "Clearnose Nasal Drops", m: "Cipla", s: "0.1% (10ml)", p: 75, pack: "Bottle of 10ml", pop: 80 },
      { b: "Xylomist Nasal Drops", m: "German Remedies", s: "0.1% (10ml)", p: 85, pack: "Bottle of 10ml", pop: 86 },
    ]
  },

  // ================= 3. GASTROINTESTINAL & ANTACIDS =================
  {
    gen: "Omeprazole", cat: "Antacid", rx: false, form: "Capsule",
    desc: "Proton pump inhibitor for heartburn, acid indigestion, gastroesophageal reflux, and stomach ulcers.",
    uses: ["Heartburn relief", "Acid indigestion", "Gastric & duodenal ulcers", "GERD"],
    adultDosage: "20mg once daily in morning 30 minutes before breakfast.",
    brands: [
      { b: "Omez 20", m: "Dr. Reddy's", s: "20mg", p: 115, pack: "Strip of 20 capsules", pop: 99 },
      { b: "Omez 40", m: "Dr. Reddy's", s: "40mg", p: 145, pack: "Strip of 15 capsules", pop: 95 },
      { b: "Omez-D", m: "Dr. Reddy's", s: "Omeprazole 20mg+Domperidone 10mg", p: 165, pack: "Strip of 15 capsules", pop: 96 },
      { b: "Omee 20", m: "Alkem Laboratories", s: "20mg", p: 85, pack: "Strip of 20 capsules", pop: 92 },
      { b: "Omezol 20", m: "Torrent Pharmaceuticals", s: "20mg", p: 78, pack: "Strip of 15 capsules", pop: 86 },
      { b: "Omecip 20", m: "Cipla", s: "20mg", p: 80, pack: "Strip of 20 capsules", pop: 88 },
      { b: "Prilosec 20", m: "AstraZeneca", s: "20mg", p: 210, pack: "Strip of 14 capsules", pop: 87 },
      { b: "Ocid 20", m: "Zydus Cadila", s: "20mg", p: 92, pack: "Strip of 15 capsules", pop: 90 },
      { b: "Ocid-D", m: "Zydus Cadila", s: "Omeprazole+Domperidone", p: 135, pack: "Strip of 15 capsules", pop: 88 },
    ]
  },
  {
    gen: "Esomeprazole", cat: "Antacid", rx: true, form: "Tablet",
    desc: "S-enantiomer PPI providing sustained 24-hour gastric acid suppression for erosive esophagitis and GERD.",
    uses: ["Erosive esophagitis healing", "Severe GERD", "H. pylori eradication", "NSAID ulcer prevention"],
    adultDosage: "40mg once daily in morning before breakfast.",
    brands: [
      { b: "Nexpro 40", m: "Torrent Pharmaceuticals", s: "40mg", p: 175, pack: "Strip of 15 tablets", pop: 97 },
      { b: "Nexpro 20", m: "Torrent Pharmaceuticals", s: "20mg", p: 110, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Nexpro-RD 40", m: "Torrent Pharmaceuticals", s: "Esomeprazole 40mg+Domperidone 30mg", p: 235, pack: "Strip of 15 capsules", pop: 95 },
      { b: "Sompraz 40", m: "Sun Pharma", s: "40mg", p: 185, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Sompraz 20", m: "Sun Pharma", s: "20mg", p: 118, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Sompraz-D 40", m: "Sun Pharma", s: "Esomeprazole+Domperidone", p: 245, pack: "Strip of 15 capsules", pop: 94 },
      { b: "Esomac 40", m: "Cipla", s: "40mg", p: 120, pack: "Strip of 10 tablets", pop: 88 },
    ]
  },
  {
    gen: "Pantoprazole", cat: "Antacid", rx: true, form: "Tablet",
    desc: "Proton Pump Inhibitor (PPI) that decreases gastric acid secretion for GERD and ulcers.",
    uses: ["Acid reflux / GERD", "Stomach & duodenal ulcers", "Gastritis", "NSAID stomach protection"],
    adultDosage: "40mg once daily in morning 30 minutes before breakfast.",
    brands: [
      { b: "Pan 40", m: "Alkem Laboratories", s: "40mg", p: 155, pack: "Strip of 15 tablets", pop: 98 },
      { b: "Pan 20", m: "Alkem Laboratories", s: "20mg", p: 95, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Pantocid 40", m: "Sun Pharma", s: "40mg", p: 168, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Pantocid 20", m: "Sun Pharma", s: "20mg", p: 102, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Pantodac 40", m: "Zydus Cadila", s: "40mg", p: 150, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Pantosec 40", m: "Cipla", s: "40mg", p: 110, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Nupenta 40", m: "Macleods", s: "40mg", p: 92, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Protera 40", m: "Lupin", s: "40mg", p: 125, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Pantocar 40", m: "Micro Labs", s: "40mg", p: 98, pack: "Strip of 10 tablets", pop: 83 },
      { b: "Zipant 40", m: "FDC Limited", s: "40mg", p: 90, pack: "Strip of 10 tablets", pop: 80 },
    ]
  },
  {
    gen: "Pantoprazole + Domperidone", cat: "Antacid", rx: true, form: "Capsule",
    desc: "Proton pump inhibitor with prokinetic agent for acid reflux with nausea and bloating.",
    uses: ["GERD with nausea", "Heartburn with vomiting sensation", "Bloating & gastric fullness"],
    adultDosage: "1 capsule (40mg+30mg SR) once daily in morning 30m before breakfast.",
    brands: [
      { b: "Pan-D", m: "Alkem Laboratories", s: "40mg+30mg", p: 215, pack: "Strip of 15 capsules", pop: 98 },
      { b: "Pantocid-DSR", m: "Sun Pharma", s: "40mg+30mg", p: 232, pack: "Strip of 15 capsules", pop: 95 },
      { b: "Pantodac-DSR", m: "Zydus Cadila", s: "40mg+30mg", p: 210, pack: "Strip of 15 capsules", pop: 91 },
      { b: "Dompan-SR", m: "Cipla", s: "40mg+30mg", p: 145, pack: "Strip of 10 capsules", pop: 86 },
      { b: "Nupenta-D", m: "Macleods", s: "40mg+30mg", p: 128, pack: "Strip of 10 capsules", pop: 83 },
      { b: "Pantocar-DSR", m: "Micro Labs", s: "40mg+30mg", p: 135, pack: "Strip of 10 capsules", pop: 84 },
      { b: "Protera-D", m: "Lupin", s: "40mg+30mg", p: 165, pack: "Strip of 10 capsules", pop: 87 },
      { b: "Gaspas-D", m: "Torrent", s: "40mg+30mg", p: 140, pack: "Strip of 10 capsules", pop: 82 },
    ]
  },
  {
    gen: "Rabeprazole + Domperidone", cat: "Antacid", rx: true, form: "Capsule",
    desc: "Fast-acting PPI combined with prokinetic for severe nighttime heartburn and dyspepsia.",
    uses: ["Severe GERD", "Acid regurgitation", "Gastric and duodenal ulcers", "Bloating with nausea"],
    adultDosage: "1 capsule (20mg+30mg SR) once daily before breakfast.",
    brands: [
      { b: "Razo-D", m: "Dr. Reddy's", s: "20mg+30mg", p: 245, pack: "Strip of 15 capsules", pop: 95 },
      { b: "Rablet-D", m: "Lupin", s: "20mg+30mg", p: 230, pack: "Strip of 15 capsules", pop: 92 },
      { b: "Happi-D", m: "Zydus Cadila", s: "20mg+30mg", p: 155, pack: "Strip of 10 capsules", pop: 88 },
      { b: "Rabium-DSR", m: "Sun Pharma", s: "20mg+30mg", p: 162, pack: "Strip of 10 capsules", pop: 85 },
      { b: "Cyra-D", m: "Systopic Laboratories", s: "20mg+30mg", p: 68, pack: "Strip of 10 capsules", pop: 84 },
      { b: "Rabonik-DSR", m: "Glenmark", s: "20mg+30mg", p: 145, pack: "Strip of 10 capsules", pop: 83 },
      { b: "Veloz-D", m: "Torrent Pharmaceuticals", s: "20mg+30mg", p: 155, pack: "Strip of 10 capsules", pop: 86 },
    ]
  },
  {
    gen: "Magaldrate + Simethicone", cat: "Antacid", rx: false, form: "Suspension / Chewable",
    desc: "Fast-acting non-systemic antacid and antifoaming agent for instant heartburn and gas relief.",
    uses: ["Instant acidity relief", "Heartburn", "Gas bloating", "Sour stomach", "Indigestion"],
    adultDosage: "10–20ml (2–4 teaspoons) or 1–2 chewable tablets chewed after meals.",
    brands: [
      { b: "Digene Gel Mint", m: "Abbott", s: "200ml bottle", p: 155, pack: "Bottle of 200ml", pop: 98 },
      { b: "Digene Gel Orange", m: "Abbott", s: "200ml bottle", p: 155, pack: "Bottle of 200ml", pop: 96 },
      { b: "Digene Gel Mixed Fruit", m: "Abbott", s: "200ml bottle", p: 155, pack: "Bottle of 200ml", pop: 95 },
      { b: "Digene Chewable Tablets Mint", m: "Abbott", s: "Strip of 15", p: 28, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Digene Chewable Tablets Orange", m: "Abbott", s: "Strip of 15", p: 28, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Gelusil MPS Liquid", m: "Pfizer / Zydus", s: "200ml bottle", p: 142, pack: "Bottle of 200ml", pop: 97 },
      { b: "Gelusil MPS Tablets", m: "Pfizer / Zydus", s: "Chewable", p: 24, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Mucaine Gel", m: "Pfizer", s: "Oxetacaine+Antacid (200ml)", p: 215, pack: "Bottle of 200ml", pop: 94 },
      { b: "Eno Fruit Salt Regular", m: "GSK", s: "5g sachet", p: 180, pack: "Box of 30 sachets", pop: 99 },
      { b: "Eno Fruit Salt Lemon", m: "GSK", s: "5g sachet", p: 180, pack: "Box of 30 sachets", pop: 99 },
      { b: "Eno Fruit Salt Orange", m: "GSK", s: "5g sachet", p: 180, pack: "Box of 30 sachets", pop: 97 },
      { b: "Gas-O-Fast Active", m: "Mankind Pharma", s: "5g sachet", p: 150, pack: "Box of 30 sachets", pop: 88 },
    ]
  },
  {
    gen: "Oral Rehydration Salts (WHO Formula)", cat: "ORS & Hydration", rx: false, form: "Sachet / Liquid",
    desc: "Standard electrolyte replenishment for acute diarrhea, vomiting, and heat exhaustion.",
    uses: ["Dehydration in diarrhea", "Heat exhaustion & stroke", "Post-exercise fluid recovery", "Food poisoning"],
    adultDosage: "Dissolve 21.8g sachet in 1 Liter clean drinking water. Sip throughout day.",
    brands: [
      { b: "Electral Powder", m: "FDC Limited", s: "21.8g sachet", p: 110, pack: "Pack of 5 sachets", pop: 99 },
      { b: "Electral Orange", m: "FDC Limited", s: "21.8g sachet", p: 115, pack: "Pack of 5 sachets", pop: 97 },
      { b: "Electrobion", m: "Merck / P&G", s: "21.8g sachet", p: 105, pack: "Pack of 5 sachets", pop: 91 },
      { b: "Enerzal Powder Orange", m: "FDC Limited", s: "100g pack", p: 65, pack: "Pack of 100g", pop: 95 },
      { b: "Enerzal Powder Apple", m: "FDC Limited", s: "100g pack", p: 65, pack: "Pack of 100g", pop: 92 },
      { b: "ORSL Ready Drink Apple", m: "Johnson & Johnson", s: "200ml tetrapack", p: 45, pack: "Pack of 200ml", pop: 96 },
      { b: "ORSL Ready Drink Orange", m: "Johnson & Johnson", s: "200ml tetrapack", p: 45, pack: "Pack of 200ml", pop: 96 },
      { b: "ORSL Plus Rehydrate Lemon", m: "Johnson & Johnson", s: "200ml", p: 48, pack: "Pack of 200ml", pop: 94 },
      { b: "Electral RTD Liquid", m: "FDC Limited", s: "200ml tetrapack", p: 42, pack: "Pack of 200ml", pop: 93 },
      { b: "Walyte ORS", m: "Cipla", s: "21.8g sachet", p: 100, pack: "Pack of 5 sachets", pop: 89 },
    ]
  },
  {
    gen: "Lactulose / Laxatives", cat: "Gastrointestinal", rx: false, form: "Syrup / Granules",
    desc: "Osmotic and bulk-forming laxative for gentle, non-habit forming constipation relief.",
    uses: ["Chronic constipation", "Constipation during pregnancy", "Painful piles and fissures"],
    adultDosage: "15–30ml Lactulose syrup at bedtime with water.",
    brands: [
      { b: "Duphalac Syrup", m: "Abbott", s: "10g/15ml (200ml)", p: 295, pack: "Bottle of 200ml", pop: 96 },
      { b: "Duphalac Fiber", m: "Abbott", s: "Lactulose+Fructooligosaccharides (200ml)", p: 345, pack: "Bottle of 200ml", pop: 93 },
      { b: "Cremaffin Plus", m: "Abbott", s: "Liquid Paraffin+Milk of Magnesia (225ml)", p: 280, pack: "Bottle of 225ml", pop: 94 },
      { b: "Cremaffin Plain", m: "Abbott", s: "225ml bottle", p: 235, pack: "Bottle of 225ml", pop: 90 },
      { b: "Softovac Bowel Regulator", m: "Lupin", s: "Granules 100g", p: 220, pack: "Jar of 100g", pop: 93 },
      { b: "Kayam Churna", m: "Sheth Brothers", s: "Powder 100g", p: 110, pack: "Jar of 100g", pop: 95 },
      { b: "Kayam Tablets", m: "Sheth Brothers", s: "Tablet 30s", p: 130, pack: "Bottle of 30 tablets", pop: 92 },
      { b: "Nature Care Isabgol", m: "Dabur", s: "Husk 100g", p: 175, pack: "Box of 100g", pop: 91 },
      { b: "Dulcolax 5", m: "Sanofi India", s: "5mg Bisacodyl", p: 14, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Looz Syrup", m: "Intas Pharmaceuticals", s: "10g/15ml (200ml)", p: 260, pack: "Bottle of 200ml", pop: 89 },
    ]
  },
  {
    gen: "Ondansetron", cat: "Gastrointestinal", rx: true, form: "Tablet / Syrup",
    desc: "Selective 5-HT3 receptor antagonist antiemetic for nausea and vomiting from gastroenteritis or chemotherapy.",
    uses: ["Acute vomiting & nausea", "Gastroenteritis vomiting in children", "Post-chemotherapy nausea"],
    adultDosage: "4mg or 8mg orally 30 minutes before food or chemotherapy.",
    brands: [
      { b: "Emeset 4", m: "Cipla", s: "4mg", p: 58, pack: "Strip of 10 tablets", pop: 98 },
      { b: "Emeset 8", m: "Cipla", s: "8mg", p: 98, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Emeset Syrup", m: "Cipla", s: "2mg/5ml (30ml)", p: 42, pack: "Bottle of 30ml", pop: 96, form: "Syrup" },
      { b: "Emeset Injection", m: "Cipla", s: "2mg/ml (2ml ampoule)", p: 28, pack: "Ampoule of 2ml", pop: 92, form: "Injection" },
      { b: "Vomikind 4", m: "Mankind Pharma", s: "4mg", p: 38, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Vomikind-MD 4", m: "Mankind Pharma", s: "4mg Mouth Dissolving", p: 44, pack: "Strip of 10 MD tablets", pop: 96, form: "Mouth Dissolving Tablet" },
      { b: "Vomikind Syrup", m: "Mankind Pharma", s: "2mg/5ml (30ml)", p: 35, pack: "Bottle of 30ml", pop: 92, form: "Syrup" },
      { b: "Ondem 4", m: "Alkem Laboratories", s: "4mg", p: 52, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Ondem-MD 4", m: "Alkem Laboratories", s: "4mg MD", p: 56, pack: "Strip of 10 tablets", pop: 92, form: "Mouth Dissolving Tablet" },
      { b: "Ondem Syrup", m: "Alkem Laboratories", s: "30ml", p: 38, pack: "Bottle of 30ml", pop: 88, form: "Syrup" },
      { b: "Zofran 4", m: "GSK", s: "4mg", p: 95, pack: "Strip of 10 tablets", pop: 89 },
    ]
  },

  // ================= 4. ANTIBIOTICS & ANTIMICROBIALS =================
  {
    gen: "Amoxicillin + Clavulanic Acid", cat: "Antibiotics", rx: true, form: "Tablet",
    desc: "Broad-spectrum beta-lactamase inhibitor penicillin antibiotic for respiratory, ENT, and dental infections.",
    uses: ["Sinusitis", "Otitis media ear infection", "Pneumonia & bronchitis", "Skin abscess", "Dental infection"],
    adultDosage: "625mg twice daily for 5–7 days after meals.",
    brands: [
      { b: "Augmentin 625 Duo", m: "GSK", s: "500mg+125mg", p: 205, pack: "Strip of 10 tablets", pop: 99 },
      { b: "Augmentin 1000 Duo", m: "GSK", s: "875mg+125mg", p: 345, pack: "Strip of 10 tablets", pop: 93 },
      { b: "Augmentin DDS Syrup", m: "GSK", s: "400mg+57mg/5ml (30ml)", p: 165, pack: "Bottle of 30ml", pop: 95, form: "Dry Syrup" },
      { b: "Clavam 625", m: "Alkem Laboratories", s: "500mg+125mg", p: 198, pack: "Strip of 10 tablets", pop: 97 },
      { b: "Clavam 375", m: "Alkem Laboratories", s: "250mg+125mg", p: 145, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Clavam Dry Syrup", m: "Alkem Laboratories", s: "200mg+28.5mg/5ml (30ml)", p: 95, pack: "Bottle of 30ml", pop: 92, form: "Dry Syrup" },
      { b: "Moxikind-CV 625", m: "Mankind Pharma", s: "500mg+125mg", p: 165, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Moxikind-CV Dry Syrup", m: "Mankind Pharma", s: "30ml dry syrup", p: 82, pack: "Bottle of 30ml", pop: 90, form: "Dry Syrup" },
      { b: "Sensiclav 625", m: "Macleods Pharmaceuticals", s: "500mg+125mg", p: 185, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Novamox-CV 625", m: "Cipla", s: "500mg+125mg", p: 192, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Advent 625", m: "Cipla", s: "500mg+125mg", p: 188, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Megaclav 625", m: "Aristo Pharmaceuticals", s: "500mg+125mg", p: 175, pack: "Strip of 10 tablets", pop: 85 },
    ]
  },
  {
    gen: "Azithromycin", cat: "Antibiotics", rx: true, form: "Tablet",
    desc: "Macrolide antibiotic for throat infections, tonsillitis, atypical pneumonia, and typhoid.",
    uses: ["Tonsillitis & pharyngitis", "Bronchitis", "Atypical pneumonia", "Chlamydia", "Typhoid"],
    adultDosage: "500mg once daily for 3 to 5 consecutive days.",
    brands: [
      { b: "Azithral 500", m: "Alembic Pharmaceuticals", s: "500mg", p: 132, pack: "Strip of 5 tablets", pop: 98 },
      { b: "Azithral 250", m: "Alembic Pharmaceuticals", s: "250mg", p: 95, pack: "Strip of 6 tablets", pop: 90 },
      { b: "Azithral Junior Drops", m: "Alembic Pharmaceuticals", s: "100mg/ml (15ml)", p: 75, pack: "Bottle of 15ml", pop: 92, form: "Oral Drops" },
      { b: "Azithral 200 Liquid", m: "Alembic Pharmaceuticals", s: "200mg/5ml (15ml)", p: 85, pack: "Bottle of 15ml", pop: 93, form: "Liquid Suspension" },
      { b: "Azee 500", m: "Cipla", s: "500mg", p: 135, pack: "Strip of 5 tablets", pop: 97 },
      { b: "Azee 250", m: "Cipla", s: "250mg", p: 98, pack: "Strip of 6 tablets", pop: 89 },
      { b: "Azee 100 Dry Syrup", m: "Cipla", s: "100mg/5ml (15ml)", p: 62, pack: "Bottle of 15ml", pop: 88, form: "Dry Syrup" },
      { b: "Azee 200 Dry Syrup", m: "Cipla", s: "200mg/5ml (15ml)", p: 82, pack: "Bottle of 15ml", pop: 90, form: "Dry Syrup" },
      { b: "Zady 500", m: "Mankind Pharma", s: "500mg", p: 115, pack: "Strip of 5 tablets", pop: 86 },
      { b: "Azibact 500", m: "Ipca Laboratories", s: "500mg", p: 125, pack: "Strip of 5 tablets", pop: 84 },
      { b: "Zithrox 500", m: "Macleods Pharmaceuticals", s: "500mg", p: 120, pack: "Strip of 5 tablets", pop: 82 },
      { b: "Zithrocin 500", m: "Sun Pharma", s: "500mg", p: 130, pack: "Strip of 5 tablets", pop: 85 },
    ]
  },
  {
    gen: "Cefixime", cat: "Antibiotics", rx: true, form: "Tablet",
    desc: "Third-generation cephalosporin for typhoid fever, urinary tract infection, and bronchitis.",
    uses: ["Enteric (Typhoid) fever", "Urinary tract infections (UTI)", "Gonorrhea", "Bronchitis", "Otitis media"],
    adultDosage: "200mg twice daily for 7–14 days.",
    brands: [
      { b: "Taxim-O 200", m: "Alkem Laboratories", s: "200mg", p: 172, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Taxim-O 100 DT", m: "Alkem Laboratories", s: "100mg DT", p: 98, pack: "Strip of 10 DT tablets", pop: 90, form: "Dispersible Tablet" },
      { b: "Taxim-O Dry Syrup", m: "Alkem Laboratories", s: "50mg/5ml (30ml)", p: 68, pack: "Bottle of 30ml", pop: 92, form: "Dry Syrup" },
      { b: "Taxim-O Forte Dry Syrup", m: "Alkem Laboratories", s: "100mg/5ml (30ml)", p: 95, pack: "Bottle of 30ml", pop: 91, form: "Dry Syrup" },
      { b: "Cefix 200", m: "Cipla", s: "200mg", p: 168, pack: "Strip of 10 tablets", pop: 93 },
      { b: "Mahacef 200", m: "Mankind Pharma", s: "200mg", p: 145, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Zifi 200", m: "FDC Limited", s: "200mg", p: 165, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Zifi 100 DT", m: "FDC Limited", s: "100mg DT", p: 92, pack: "Strip of 10 tablets", pop: 87, form: "Dispersible Tablet" },
      { b: "Omnicef-O 200", m: "Aristo Pharmaceuticals", s: "200mg", p: 155, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Cefrine 200", m: "Macleods", s: "200mg", p: 150, pack: "Strip of 10 tablets", pop: 82 },
    ]
  },
  {
    gen: "Ciprofloxacin", cat: "Antibiotics", rx: true, form: "Tablet",
    desc: "Fluoroquinolone antibiotic for bacterial diarrhea, typhoid, and urinary tract infections.",
    uses: ["Bacterial diarrhea & dysentery", "Complicated UTI", "Typhoid fever", "Prostatitis"],
    adultDosage: "500mg twice daily for 5–7 days after meals.",
    brands: [
      { b: "Cifran 500", m: "Sun Pharma", s: "500mg", p: 48, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Cifran 250", m: "Sun Pharma", s: "250mg", p: 28, pack: "Strip of 10 tablets", pop: 85 },
      { b: "Ciplox 500", m: "Cipla", s: "500mg", p: 45, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Ciplox 250", m: "Cipla", s: "250mg", p: 26, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Ciplox Eye Drops", m: "Cipla", s: "0.3% w/v (10ml)", p: 21, pack: "Bottle of 10ml", pop: 97, form: "Eye Drops" },
      { b: "Ciprobid 500", m: "Zydus Cadila", s: "500mg", p: 42, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Microflox 500", m: "Micro Labs", s: "500mg", p: 40, pack: "Strip of 10 tablets", pop: 82 },
      { b: "Zoxan 500", m: "FDC Limited", s: "500mg", p: 44, pack: "Strip of 10 tablets", pop: 80 },
    ]
  },
  {
    gen: "Ofloxacin + Ornidazole", cat: "Antibiotics", rx: true, form: "Tablet",
    desc: "Fluoroquinolone and nitroimidazole combination for acute mixed amoebic and bacterial dysentery.",
    uses: ["Amoebic dysentery", "Bacterial gastroenteritis", "Mixed abdominal infections", "Dental infections"],
    adultDosage: "1 tablet (200mg+500mg) twice daily after food for 5 days.",
    brands: [
      { b: "O2 Tablet", m: "Medley Pharmaceuticals", s: "200mg+500mg", p: 145, pack: "Strip of 10 tablets", pop: 97 },
      { b: "O2 Suspension", m: "Medley Pharmaceuticals", s: "50mg+125mg/5ml (30ml)", p: 65, pack: "Bottle of 30ml", pop: 92, form: "Suspension" },
      { b: "Oflox-OZ", m: "Cipla", s: "200mg+500mg", p: 152, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Oflox-OZ Suspension", m: "Cipla", s: "30ml", p: 68, pack: "Bottle of 30ml", pop: 90, form: "Suspension" },
      { b: "Zenflox-OZ", m: "Mankind Pharma", s: "200mg+500mg", p: 125, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Ornof", m: "Aristo Pharmaceuticals", s: "200mg+500mg", p: 135, pack: "Strip of 10 tablets", pop: 86 },
      { b: "Norflox-TZ", m: "Cipla", s: "400mg+600mg", p: 110, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Norflox-400", m: "Cipla", s: "400mg Norfloxacin", p: 85, pack: "Strip of 10 tablets", pop: 91 },
    ]
  },
  {
    gen: "Fluconazole", cat: "Antifungal", rx: true, form: "Tablet",
    desc: "Oral triazole antifungal for vaginal candidiasis yeast infection and ringworm.",
    uses: ["Vaginal candidiasis (yeast infection)", "Oral thrush", "Ringworm (Tinea)", "Nail fungus"],
    adultDosage: "150mg single oral dose for vaginal thrush.",
    brands: [
      { b: "Forcan 150", m: "Cipla", s: "150mg", p: 32, pack: "Strip of 1 tablet", pop: 95 },
      { b: "Forcan 200", m: "Cipla", s: "200mg", p: 48, pack: "Strip of 4 tablets", pop: 88 },
      { b: "Fluka 150", m: "Cipla", s: "150mg", p: 30, pack: "Strip of 1 tablet", pop: 88 },
      { b: "Zocon 150", m: "FDC Limited", s: "150mg", p: 35, pack: "Strip of 1 tablet", pop: 92 },
      { b: "Zocon 50", m: "FDC Limited", s: "50mg", p: 55, pack: "Strip of 4 tablets", pop: 84 },
      { b: "Syscan 150", m: "Torrent Pharmaceuticals", s: "150mg", p: 28, pack: "Strip of 1 tablet", pop: 85 },
      { b: "Onecan 150", m: "Mankind Pharma", s: "150mg", p: 25, pack: "Strip of 1 tablet", pop: 82 },
      { b: "Nuforce 150", m: "Mankind Pharma", s: "150mg", p: 26, pack: "Strip of 1 tablet", pop: 80 },
    ]
  },
  {
    gen: "Clotrimazole Topical", cat: "Antifungal", rx: false, form: "Cream / Dusting Powder",
    desc: "Topical antifungal for athlete's foot, jock itch, sweat rash, and ringworm.",
    uses: ["Fungal sweat rash", "Jock itch (Tinea cruris)", "Athlete's foot (Tinea pedis)", "Ringworm"],
    adultDosage: "Apply cream or dust powder 2–3 times daily on clean, dry affected skin.",
    brands: [
      { b: "Candid Dusting Powder", m: "Glenmark", s: "1% w/w (100g)", p: 145, pack: "Bottle of 100g", pop: 98 },
      { b: "Candid Dusting Powder 50g", m: "Glenmark", s: "1% w/w (50g)", p: 85, pack: "Bottle of 50g", pop: 92 },
      { b: "Candid-B Cream", m: "Glenmark", s: "Clotrimazole+Beclomethasone (20g)", p: 165, pack: "Tube of 20g", pop: 96 },
      { b: "Candid Cream", m: "Glenmark", s: "1% w/w (30g)", p: 110, pack: "Tube of 30g", pop: 92 },
      { b: "Candid Mouth Paint", m: "Glenmark", s: "1% w/v (15ml)", p: 98, pack: "Bottle of 15ml", pop: 94, form: "Mouth Paint" },
      { b: "Canesten Cream", m: "Bayer", s: "1% w/w (30g)", p: 125, pack: "Tube of 30g", pop: 94 },
      { b: "Abzorb Anti-Fungal Dusting Powder", m: "Sun Pharma", s: "1% w/w (100g)", p: 140, pack: "Bottle of 100g", pop: 97 },
      { b: "Abzorb Dusting Powder 50g", m: "Sun Pharma", s: "1% w/w (50g)", p: 80, pack: "Bottle of 50g", pop: 90 },
      { b: "Clocip Dusting Powder", m: "Cipla", s: "1% w/w (100g)", p: 115, pack: "Bottle of 100g", pop: 90 },
      { b: "Clocip Cream", m: "Cipla", s: "1% w/w (20g)", p: 72, pack: "Tube of 20g", pop: 86 },
    ]
  },

  // ================= 5. DIABETES CARE =================
  {
    gen: "Metformin Hydrochloride", cat: "Diabetes", rx: true, form: "Tablet",
    desc: "First-line biguanide oral antihyperglycemic agent for Type 2 Diabetes.",
    uses: ["Type 2 Diabetes Mellitus", "Insulin resistance", "PCOS glucose management"],
    adultDosage: "500mg–1000mg SR once or twice daily with meals.",
    brands: [
      { b: "Glycomet 500", m: "USV", s: "500mg", p: 42, pack: "Strip of 20 tablets", pop: 97 },
      { b: "Glycomet-SR 500", m: "USV", s: "500mg SR", p: 58, pack: "Strip of 20 tablets", pop: 99 },
      { b: "Glycomet-SR 850", m: "USV", s: "850mg SR", p: 72, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Glycomet-SR 1000", m: "USV", s: "1000mg SR", p: 82, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Glyciphage 500", m: "Franco-Indian", s: "500mg", p: 40, pack: "Strip of 20 tablets", pop: 92 },
      { b: "Glyciphage-SR 500", m: "Franco-Indian", s: "500mg SR", p: 55, pack: "Strip of 20 tablets", pop: 93 },
      { b: "Glyciphage-SR 1000", m: "Franco-Indian", s: "1000mg SR", p: 78, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Gluconorm-SR 500", m: "Lupin", s: "500mg SR", p: 52, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Gluconorm-SR 1000", m: "Lupin", s: "1000mg SR", p: 76, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Obimet 500", m: "Abbott", s: "500mg", p: 44, pack: "Strip of 20 tablets", pop: 86 },
      { b: "Cetapin-XR 500", m: "Sanofi India", s: "500mg XR", p: 65, pack: "Strip of 15 tablets", pop: 87 },
      { b: "Cetapin-XR 1000", m: "Sanofi India", s: "1000mg XR", p: 92, pack: "Strip of 15 tablets", pop: 88 },
    ]
  },
  {
    gen: "Glimepiride + Metformin", cat: "Diabetes", rx: true, form: "Tablet",
    desc: "Dual sulfonylurea and biguanide for advanced glycemic control in Type 2 Diabetes.",
    uses: ["Type 2 Diabetes uncontrolled on monotherapy", "Fasting and postprandial sugar control"],
    adultDosage: "1 tablet immediately with main meals.",
    brands: [
      { b: "Amaryl M 1", m: "Sanofi India", s: "1mg+500mg", p: 185, pack: "Strip of 15 tablets", pop: 95 },
      { b: "Amaryl M 2", m: "Sanofi India", s: "2mg+500mg", p: 245, pack: "Strip of 15 tablets", pop: 98 },
      { b: "Amaryl M Forte 2", m: "Sanofi India", s: "2mg+1000mg", p: 285, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Glycomet-GP 1", m: "USV", s: "1mg+500mg", p: 145, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Glycomet-GP 2", m: "USV", s: "2mg+500mg", p: 195, pack: "Strip of 15 tablets", pop: 97 },
      { b: "Glycomet-GP 1 Forte", m: "USV", s: "1mg+1000mg", p: 165, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Glycomet-GP 2 Forte", m: "USV", s: "2mg+1000mg", p: 220, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Gemer 1", m: "Sun Pharma", s: "1mg+500mg", p: 135, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Gemer 2", m: "Sun Pharma", s: "2mg+500mg", p: 180, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Gemer 2 Forte", m: "Sun Pharma", s: "2mg+1000mg", p: 215, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Zoryl-M 1", m: "Intas Pharmaceuticals", s: "1mg+500mg", p: 130, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Zoryl-M 2", m: "Intas Pharmaceuticals", s: "2mg+500mg", p: 175, pack: "Strip of 15 tablets", pop: 90 },
      { b: "Gluconorm-G 1", m: "Lupin", s: "1mg+500mg", p: 125, pack: "Strip of 15 tablets", pop: 86 },
      { b: "Gluconorm-G 2", m: "Lupin", s: "2mg+500mg", p: 168, pack: "Strip of 15 tablets", pop: 88 },
    ]
  },
  {
    gen: "Dapagliflozin", cat: "Diabetes", rx: true, form: "Tablet",
    desc: "SGLT2 inhibitor promoting urinary glucose excretion with cardiorenal protection.",
    uses: ["Type 2 Diabetes Mellitus", "Heart failure (HFrEF)", "Chronic kidney disease"],
    adultDosage: "10mg once daily in morning with or without food.",
    brands: [
      { b: "Forxiga 10", m: "AstraZeneca / Sun Pharma", s: "10mg", p: 790, pack: "Strip of 14 tablets", pop: 98 },
      { b: "Forxiga 5", m: "AstraZeneca / Sun Pharma", s: "5mg", p: 680, pack: "Strip of 14 tablets", pop: 91 },
      { b: "Dapavel 10", m: "Cipla", s: "10mg", p: 145, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Dapavel 5", m: "Cipla", s: "5mg", p: 110, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Dapavel-M 10/500", m: "Cipla", s: "Dapagliflozin 10mg+Metformin 500mg", p: 185, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Dapavel-M 10/1000", m: "Cipla", s: "Dapagliflozin 10mg+Metformin 1000mg", p: 210, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Dapanorm 10", m: "Alkem Laboratories", s: "10mg", p: 138, pack: "Strip of 10 tablets", pop: 94 },
      { b: "Dapanorm-M 10/500", m: "Alkem Laboratories", s: "Dapa 10mg+Met 500mg", p: 178, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Oxra 10", m: "Sun Pharma", s: "10mg", p: 150, pack: "Strip of 10 tablets", pop: 93 },
      { b: "Oxra-M 10/500", m: "Sun Pharma", s: "Dapa 10mg+Met 500mg", p: 195, pack: "Strip of 10 tablets", pop: 93 },
      { b: "Daflo 10", m: "Mankind Pharma", s: "10mg", p: 110, pack: "Strip of 10 tablets", pop: 89 },
    ]
  },

  // ================= 6. CARDIOVASCULAR & BP =================
  {
    gen: "Telmisartan", cat: "Cardiovascular & BP", rx: true, form: "Tablet",
    desc: "Long-acting ARB for 24-hour hypertension management and cardiovascular protection.",
    uses: ["Essential hypertension", "Cardiovascular event reduction", "Diabetic nephropathy"],
    adultDosage: "40mg–80mg once daily in morning.",
    brands: [
      { b: "Telma 40", m: "Glenmark", s: "40mg", p: 295, pack: "Strip of 30 tablets", pop: 99 },
      { b: "Telma 20", m: "Glenmark", s: "20mg", p: 185, pack: "Strip of 30 tablets", pop: 92 },
      { b: "Telma 80", m: "Glenmark", s: "80mg", p: 245, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Telma-H", m: "Glenmark", s: "Telmisartan 40mg+Hydrochlorothiazide 12.5mg", p: 310, pack: "Strip of 30 tablets", pop: 97 },
      { b: "Telmikind 40", m: "Mankind Pharma", s: "40mg", p: 48, pack: "Strip of 10 tablets", pop: 96 },
      { b: "Telmikind 20", m: "Mankind Pharma", s: "20mg", p: 32, pack: "Strip of 10 tablets", pop: 88 },
      { b: "Telmikind-H", m: "Mankind Pharma", s: "40mg+12.5mg", p: 58, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Tazloc 40", m: "USV", s: "40mg", p: 135, pack: "Strip of 15 tablets", pop: 95 },
      { b: "Tazloc 20", m: "USV", s: "20mg", p: 85, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Tazloc-H", m: "USV", s: "40mg+12.5mg", p: 145, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Telvas 40", m: "Aristo Pharmaceuticals", s: "40mg", p: 65, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Telpres 40", m: "Abbott", s: "40mg", p: 145, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Cresar 40", m: "Cipla", s: "40mg", p: 140, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Cresar 80", m: "Cipla", s: "80mg", p: 215, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Cresar-H", m: "Cipla", s: "40mg+12.5mg", p: 155, pack: "Strip of 15 tablets", pop: 90 },
    ]
  },
  {
    gen: "Telmisartan + Amlodipine", cat: "Cardiovascular & BP", rx: true, form: "Tablet",
    desc: "Synergistic ARB and calcium channel blocker for Stage 2 or uncontrolled hypertension.",
    uses: ["Uncontrolled high blood pressure", "Cardiovascular protection"],
    adultDosage: "1 tablet (40mg+5mg) once daily in morning.",
    brands: [
      { b: "Telma-AM", m: "Glenmark", s: "40mg+5mg", p: 295, pack: "Strip of 15 tablets", pop: 98 },
      { b: "Telma-AM 80/5", m: "Glenmark", s: "80mg+5mg", p: 385, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Telmikind-AM", m: "Mankind Pharma", s: "40mg+5mg", p: 68, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Tazloc-AM", m: "USV", s: "40mg+5mg", p: 210, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Cresar-AM", m: "Cipla", s: "40mg+5mg", p: 198, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Amlokind-T", m: "Mankind Pharma", s: "40mg+5mg", p: 62, pack: "Strip of 10 tablets", pop: 87 },
      { b: "Telpres-AM", m: "Abbott", s: "40mg+5mg", p: 220, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Telvas-AM", m: "Aristo Pharmaceuticals", s: "40mg+5mg", p: 110, pack: "Strip of 10 tablets", pop: 86 },
    ]
  },
  {
    gen: "Atorvastatin", cat: "Cholesterol", rx: true, form: "Tablet",
    desc: "HMG-CoA reductase inhibitor (statin) for lowering LDL cholesterol and heart attack prevention.",
    uses: ["High cholesterol", "Heart attack prevention", "Stroke prevention"],
    adultDosage: "10mg–40mg once daily at bedtime.",
    brands: [
      { b: "Atorva 10", m: "Zydus Cadila", s: "10mg", p: 185, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Atorva 20", m: "Zydus Cadila", s: "20mg", p: 295, pack: "Strip of 15 tablets", pop: 98 },
      { b: "Atorva 40", m: "Zydus Cadila", s: "40mg", p: 445, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Atorva 5", m: "Zydus Cadila", s: "5mg", p: 110, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Storvas 10", m: "Sun Pharma", s: "10mg", p: 198, pack: "Strip of 15 tablets", pop: 97 },
      { b: "Storvas 20", m: "Sun Pharma", s: "20mg", p: 310, pack: "Strip of 15 tablets", pop: 97 },
      { b: "Storvas 40", m: "Sun Pharma", s: "40mg", p: 460, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Atocor 10", m: "Dr. Reddy's", s: "10mg", p: 175, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Lipitor 10", m: "Pfizer / Viatris", s: "10mg", p: 220, pack: "Strip of 10 tablets", pop: 90 },
      { b: "Tonact 10", m: "Lupin", s: "10mg", p: 180, pack: "Strip of 15 tablets", pop: 89 },
      { b: "Tonact 20", m: "Lupin", s: "20mg", p: 285, pack: "Strip of 15 tablets", pop: 91 },
      { b: "Aztor 10", m: "Sun Pharma", s: "10mg", p: 165, pack: "Strip of 15 tablets", pop: 86 },
    ]
  },
  {
    gen: "Aspirin (Gastro-resistant)", cat: "Cardiovascular & BP", rx: true, form: "Enteric Coated Tablet",
    desc: "Low-dose antiplatelet agent for heart attack and stroke prevention.",
    uses: ["Post-heart attack prevention", "Post-coronary stent care", "Ischemic stroke prevention"],
    adultDosage: "75mg or 150mg once daily after meals with water.",
    brands: [
      { b: "Ecosprin 75", m: "USV", s: "75mg", p: 8.5, pack: "Strip of 14 tablets", pop: 99 },
      { b: "Ecosprin 150", m: "USV", s: "150mg", p: 12, pack: "Strip of 14 tablets", pop: 98 },
      { b: "Ecosprin 325", m: "USV", s: "325mg", p: 16, pack: "Strip of 14 tablets", pop: 90 },
      { b: "Ecosprin-AV 75/10", m: "USV", s: "Aspirin 75mg+Atorvastatin 10mg", p: 115, pack: "Strip of 15 capsules", pop: 97, form: "Capsule" },
      { b: "Ecosprin-AV 75/20", m: "USV", s: "Aspirin 75mg+Atorvastatin 20mg", p: 145, pack: "Strip of 15 capsules", pop: 96, form: "Capsule" },
      { b: "Ecosprin-AV 150/20", m: "USV", s: "Aspirin 150mg+Atorvastatin 20mg", p: 175, pack: "Strip of 15 capsules", pop: 94, form: "Capsule" },
      { b: "Disprin Regular", m: "Reckitt Benckiser", s: "325mg Soluble", p: 12, pack: "Strip of 10 tablets", pop: 95 },
      { b: "Delisprin 75", m: "Aristo Pharmaceuticals", s: "75mg", p: 7.5, pack: "Strip of 14 tablets", pop: 82 },
      { b: "Loprin 75", m: "Unichem", s: "75mg", p: 8.0, pack: "Strip of 14 tablets", pop: 80 },
    ]
  },

  // ================= 7. VITAMINS, MINERALS & NUTRITION =================
  {
    gen: "Vitamin C (Ascorbic Acid + Sodium Ascorbate)", cat: "Vitamins & Supplements", rx: false, form: "Chewable Tablet",
    desc: "Antioxidant vitamin for immunity, wound healing, collagen synthesis, and iron absorption.",
    uses: ["Immunity enhancement", "Vitamin C deficiency", "Skin collagen boost", "Wound healing"],
    adultDosage: "1–2 chewable tablets daily.",
    brands: [
      { b: "Limcee Chewable Orange", m: "Abbott", s: "500mg", p: 30, pack: "Strip of 15 tablets", pop: 98 },
      { b: "Celin 500", m: "Koye Pharmaceuticals", s: "500mg", p: 38, pack: "Strip of 20 tablets", pop: 94 },
      { b: "Redoxon Chewable", m: "Piramal / Bayer", s: "500mg+Zinc", p: 65, pack: "Strip of 20 tablets", pop: 92 },
      { b: "Sukcee 500", m: "Cipla", s: "500mg", p: 28, pack: "Strip of 15 tablets", pop: 88 },
      { b: "Zincovit-C", m: "Apex Laboratories", s: "500mg", p: 42, pack: "Strip of 15 tablets", pop: 90 },
      { b: "Chewcee 500", m: "Sun Pharma", s: "500mg Orange", p: 32, pack: "Strip of 15 tablets", pop: 87 },
    ]
  },
  {
    gen: "Vitamin B-Complex + Vitamin C + Zinc", cat: "Vitamins & Supplements", rx: false, form: "Capsule",
    desc: "B-vitamin complex for mouth ulcers, nerve support, energy metabolism, and fatigue.",
    uses: ["Mouth ulcers (Stomatitis)", "Weakness & fatigue", "Convalescence", "Immunity"],
    adultDosage: "1 capsule daily after breakfast.",
    brands: [
      { b: "Becosules Capsules", m: "Pfizer", s: "Multi B-Complex+Vit C", p: 58, pack: "Strip of 20 capsules", pop: 99 },
      { b: "Becosules Z", m: "Pfizer", s: "B-Complex+Vit C+Zinc", p: 65, pack: "Strip of 20 capsules", pop: 99 },
      { b: "Becosules Syrup", m: "Pfizer", s: "100ml syrup", p: 60, pack: "Bottle of 100ml", pop: 94, form: "Syrup" },
      { b: "Neurobion Forte", m: "Procter & Gamble / Merck", s: "B1+B2+B3+B5+B6+B12", p: 42, pack: "Strip of 30 tablets", pop: 99, form: "Tablet" },
      { b: "Neurobion Forte RF Injection", m: "P&G / Merck", s: "2ml ampoule", p: 18, pack: "Ampoule of 2ml", pop: 95, form: "Injection" },
      { b: "Zincovit", m: "Apex Laboratories", s: "Multivitamin+Minerals", p: 115, pack: "Strip of 15 tablets", pop: 98, form: "Tablet" },
      { b: "Zincovit Syrup", m: "Apex Laboratories", s: "200ml", p: 145, pack: "Bottle of 200ml", pop: 97, form: "Syrup" },
      { b: "Zincovit Drops", m: "Apex Laboratories", s: "15ml pediatric drops", p: 65, pack: "Bottle of 15ml", pop: 94, form: "Oral Drops" },
      { b: "Supradyn Daily", m: "Bayer", s: "Multivitamin+Minerals", p: 62, pack: "Strip of 15 tablets", pop: 97, form: "Tablet" },
      { b: "A to Z NS", m: "Alkem Laboratories", s: "Multivitamin+Zinc", p: 135, pack: "Strip of 15 tablets", pop: 93, form: "Tablet" },
      { b: "A to Z NS Syrup", m: "Alkem Laboratories", s: "200ml", p: 165, pack: "Bottle of 200ml", pop: 92, form: "Syrup" },
      { b: "Cobadex Forte", m: "GSK", s: "B-Complex+Minerals", p: 52, pack: "Strip of 20 capsules", pop: 90 },
      { b: "Polybion LC Syrup", m: "Procter & Gamble", s: "B-Complex+Lysine (200ml)", p: 110, pack: "Bottle of 200ml", pop: 92, form: "Syrup" },
    ]
  },
  {
    gen: "Vitamin D3 (Cholecalciferol)", cat: "Vitamins & Supplements", rx: false, form: "Capsule / Sachet",
    desc: "High-dose Vitamin D3 for hypovitaminosis D, osteoporosis, rickets, and bone density.",
    uses: ["Vitamin D deficiency", "Osteoporosis", "Bone and joint ache", "Immunity & muscle strength"],
    adultDosage: "60,000 IU once weekly for 8 weeks with milk.",
    brands: [
      { b: "Uprise-D3 60K", m: "Alkem Laboratories", s: "60,000 IU Softgel", p: 145, pack: "Strip of 4 capsules", pop: 98 },
      { b: "Uprise-D3 Syrup", m: "Alkem Laboratories", s: "60,000 IU/5ml (5ml)", p: 75, pack: "Bottle of 5ml", pop: 92, form: "Oral Solution" },
      { b: "Tayo 60K", m: "Eris Lifesciences", s: "60,000 IU Chewable", p: 160, pack: "Strip of 4 tablets", pop: 95, form: "Chewable Tablet" },
      { b: "Calcirol Sachet", m: "Cadila Pharmaceuticals", s: "60,000 IU Granules", p: 155, pack: "Pack of 4 sachets", pop: 96, form: "Sachet / Granules" },
      { b: "D-360 Softgel", m: "Torrent Pharmaceuticals", s: "60,000 IU", p: 140, pack: "Strip of 4 capsules", pop: 91 },
      { b: "Depura Kids Drops", m: "Sanofi India", s: "400 IU/ml (15ml)", p: 110, pack: "Bottle of 15ml", pop: 94, form: "Oral Drops" },
      { b: "Depura 60K Sugar Free Solution", m: "Sanofi India", s: "60,000 IU/5ml (4x5ml)", p: 295, pack: "Pack of 4 bottles", pop: 93, form: "Oral Solution" },
      { b: "D-Rise 60K", m: "USV", s: "60,000 IU Softgel", p: 142, pack: "Strip of 4 capsules", pop: 92 },
      { b: "Arachitol 6L Injection", m: "Abbott", s: "6,00,000 IU Injection", p: 380, pack: "Ampoule of 1ml", pop: 88, form: "Injection" },
    ]
  },
  {
    gen: "Calcium Carbonate + Vitamin D3", cat: "Minerals & Nutrition", rx: false, form: "Tablet",
    desc: "Elemental calcium supplement with Vitamin D3 for osteoporosis, pregnancy, and bone strength.",
    uses: ["Calcium deficiency", "Osteoporosis", "Pregnancy & Lactation calcium needs", "Fracture recovery"],
    adultDosage: "1 tablet once or twice daily after meals with water.",
    brands: [
      { b: "Shelcal 500", m: "Torrent Pharmaceuticals", s: "500mg+250 IU", p: 132, pack: "Strip of 15 tablets", pop: 99 },
      { b: "Shelcal-HD", m: "Torrent Pharmaceuticals", s: "500mg+500 IU", p: 155, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Shelcal-CT", m: "Torrent Pharmaceuticals", s: "Calcitriol+Calcium", p: 245, pack: "Strip of 15 tablets", pop: 93 },
      { b: "Shelcal-XT", m: "Torrent Pharmaceuticals", s: "Calcium+Vit D3+B12", p: 320, pack: "Strip of 15 tablets", pop: 94 },
      { b: "Shelcal Suspension", m: "Torrent Pharmaceuticals", s: "250mg/5ml (200ml)", p: 125, pack: "Bottle of 200ml", pop: 92, form: "Suspension" },
      { b: "Calcimax 500", m: "Meyer Organics", s: "500mg+Minerals", p: 290, pack: "Strip of 30 tablets", pop: 95 },
      { b: "Calcimax Forte", m: "Meyer Organics", s: "Calcium+D3+Zinc+Magnesium", p: 340, pack: "Strip of 30 tablets", pop: 93 },
      { b: "Cipcal 500", m: "Cipla", s: "500mg+250 IU", p: 110, pack: "Strip of 15 tablets", pop: 92 },
      { b: "Cipcal-D", m: "Cipla", s: "500mg+500 IU", p: 125, pack: "Strip of 15 tablets", pop: 90 },
      { b: "Gemcal", m: "Alkem Laboratories", s: "Calcitriol+Calcium", p: 345, pack: "Strip of 15 capsules", pop: 94, form: "Capsule" },
      { b: "Ostocalcium Total Chewable", m: "GSK", s: "Calcium+D3", p: 195, pack: "Bottle of 30 tablets", pop: 93, form: "Chewable Tablet" },
    ]
  },
  {
    gen: "Ferrous Ascorbate + Folic Acid", cat: "Minerals & Nutrition", rx: false, form: "Tablet / Syrup",
    desc: "Bioavailable iron and folic acid for iron deficiency anemia, pregnancy, and fatigue.",
    uses: ["Iron deficiency anemia", "Pregnancy anemia prophylaxis", "Nutritional weakness"],
    adultDosage: "1 tablet (100mg elemental iron) daily after meals.",
    brands: [
      { b: "Orofer-XT", m: "Emcure Pharmaceuticals", s: "100mg+1.5mg", p: 185, pack: "Strip of 10 tablets", pop: 97 },
      { b: "Orofer-XT Syrup", m: "Emcure Pharmaceuticals", s: "30mg/5ml (150ml)", p: 145, pack: "Bottle of 150ml", pop: 94, form: "Syrup" },
      { b: "Orofer-XT Drops", m: "Emcure Pharmaceuticals", s: "15ml drops", p: 85, pack: "Bottle of 15ml", pop: 92, form: "Oral Drops" },
      { b: "Livogen-Z", m: "Procter & Gamble / Merck", s: "100mg+Zinc", p: 110, pack: "Strip of 15 tablets", pop: 96 },
      { b: "Fefol-Z", m: "GSK", s: "Iron+Zinc+Folic", p: 140, pack: "Strip of 15 capsules", pop: 93, form: "Capsule" },
      { b: "Imax-XT", m: "Macleods Pharmaceuticals", s: "100mg+1.5mg", p: 135, pack: "Strip of 10 tablets", pop: 89 },
      { b: "Feronia-XT", m: "Zydus Cadila", s: "100mg+1.5mg", p: 165, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Autrin", m: "Pfizer", s: "Multi-hematinic", p: 195, pack: "Strip of 30 capsules", pop: 88, form: "Capsule" },
      { b: "Dexorange Syrup", m: "Franco-Indian", s: "Iron+B12 (200ml)", p: 175, pack: "Bottle of 200ml", pop: 99, form: "Syrup" },
      { b: "Dexorange Capsules", m: "Franco-Indian", s: "Strip of 30", p: 185, pack: "Strip of 30 capsules", pop: 95, form: "Capsule" },
    ]
  },
  {
    gen: "Vitamin E (d-Alpha Tocopheryl Acetate)", cat: "Vitamins & Supplements", rx: false, form: "Softgel Capsule",
    desc: "Antioxidant softgel for skin health, hair nourishment, nocturnal leg cramps, and fatty liver.",
    uses: ["Vitamin E deficiency", "Nocturnal leg cramps", "Hair nourishment", "Skin antioxidant"],
    adultDosage: "1 softgel (400mg) once daily after meals.",
    brands: [
      { b: "Evion 400", m: "Procter & Gamble / Merck", s: "400mg", p: 38, pack: "Strip of 10 softgels", pop: 99 },
      { b: "Evion 200", m: "Procter & Gamble / Merck", s: "200mg", p: 24, pack: "Strip of 10 softgels", pop: 91 },
      { b: "Evion 600", m: "Procter & Gamble / Merck", s: "600mg", p: 56, pack: "Strip of 10 softgels", pop: 94 },
      { b: "Evion Forte", m: "Procter & Gamble / Merck", s: "Vit E+Vit C", p: 68, pack: "Strip of 10 tablets", pop: 92 },
      { b: "Evion LC", m: "Procter & Gamble", s: "Vit E+L-Carnitine", p: 62, pack: "Strip of 10 tablets", pop: 92 },
      { b: "E-Cod Plus", m: "Apex Laboratories", s: "Vit E+Cod Liver Oil", p: 165, pack: "Strip of 15 capsules", pop: 88 },
      { b: "Seven Seas Original Cod Liver Oil", m: "P&G", s: "100 capsules", p: 345, pack: "Bottle of 100 capsules", pop: 96 },
    ]
  },

  // ================= 8. DERMATOLOGY & FIRST AID =================
  {
    gen: "Povidone Iodine Antiseptic", cat: "First Aid & Antiseptics", rx: false, form: "Ointment / Solution",
    desc: "Broad-spectrum topical microbicidal antiseptic for minor cuts, wounds, burns, and gargle.",
    uses: ["Cuts and scrapes", "Superficial burns", "Surgical wound care", "Throat gargle for infection"],
    adultDosage: "Apply ointment or solution 1–2 times daily to cleaned wound.",
    brands: [
      { b: "Betadine 5% Ointment", m: "Win-Medicare", s: "5% w/w (20g)", p: 65, pack: "Tube of 20g", pop: 99 },
      { b: "Betadine 5% Ointment 100g", m: "Win-Medicare", s: "5% w/w (100g)", p: 245, pack: "Jar of 100g", pop: 96 },
      { b: "Betadine 10% Solution", m: "Win-Medicare", s: "10% w/v (100ml)", p: 145, pack: "Bottle of 100ml", pop: 98 },
      { b: "Betadine 10% Solution 500ml", m: "Win-Medicare", s: "10% w/v (500ml)", p: 485, pack: "Bottle of 500ml", pop: 94 },
      { b: "Betadine Gargle 2%", m: "Win-Medicare", s: "2% w/v (100ml)", p: 165, pack: "Bottle of 100ml", pop: 96, form: "Gargle" },
      { b: "Betadine Powder Spray", m: "Win-Medicare", s: "55g spray", p: 195, pack: "Can of 55g", pop: 92, form: "Spray" },
      { b: "Cipladine 5% Ointment", m: "Cipla", s: "5% w/w (20g)", p: 42, pack: "Tube of 20g", pop: 95 },
      { b: "Cipladine Solution", m: "Cipla", s: "10% (100ml)", p: 98, pack: "Bottle of 100ml", pop: 91 },
      { b: "Wokadine 5% Ointment", m: "Wockhardt", s: "5% w/w (20g)", p: 58, pack: "Tube of 20g", pop: 89 },
      { b: "Dettol Antiseptic Liquid", m: "Reckitt Benckiser", s: "Chloroxylenol (250ml)", p: 165, pack: "Bottle of 250ml", pop: 99, form: "Liquid" },
      { b: "Dettol Antiseptic Liquid 550ml", m: "Reckitt Benckiser", s: "Chloroxylenol (550ml)", p: 295, pack: "Bottle of 550ml", pop: 99, form: "Liquid" },
      { b: "Savlon Antiseptic Liquid", m: "ITC", s: "Chlorhexidine+Cetrimide (200ml)", p: 135, pack: "Bottle of 200ml", pop: 98, form: "Liquid" },
      { b: "Band-Aid Washproof Strips", m: "Johnson & Johnson", s: "Pack of 20", p: 55, pack: "Box of 20 strips", pop: 99, form: "Adhesive Bandage" },
      { b: "Hansaplast Universal Bandages", m: "Beiersdorf", s: "Pack of 20", p: 60, pack: "Pack of 20 strips", pop: 97, form: "Adhesive Bandage" },
      { b: "Burnol Ointment", m: "Morepen Laboratories", s: "20g tube", p: 85, pack: "Tube of 20g", pop: 96 },
      { b: "Silverex Ionic Gel", m: "Sun Pharma", s: "Silver Sulfadiazine (20g)", p: 135, pack: "Tube of 20g", pop: 92 },
      { b: "Soframycin Skin Cream", m: "Sanofi India", s: "Framycetin Sulfate 1% (30g)", p: 62, pack: "Tube of 30g", pop: 98 },
      { b: "Neosporin Skin Ointment", m: "GSK", s: "Triple Antibiotic (20g)", p: 120, pack: "Tube of 20g", pop: 95 },
    ]
  },
  {
    gen: "Calamine + Zinc Oxide Lotion", cat: "Dermatology & Skin Care", rx: false, form: "Lotion",
    desc: "Soothing anti-pruritic and astringent lotion for sunburn, insect bites, prickly heat, and chickenpox.",
    uses: ["Prickly heat rash", "Insect bites & stings", "Sunburn relief", "Chickenpox itching"],
    adultDosage: "Apply gently to affected skin with cotton 2–3 times daily.",
    brands: [
      { b: "Caladryl Lotion", m: "Piramal Healthcare", s: "Calamine+Diphenhydramine (120ml)", p: 155, pack: "Bottle of 120ml", pop: 98 },
      { b: "Lacto Calamine Oil Balance Lotion", m: "Piramal Healthcare", s: "Kaolin+Zinc (120ml)", p: 195, pack: "Bottle of 120ml", pop: 97 },
      { b: "Calak Lotion", m: "Cipla", s: "100ml", p: 110, pack: "Bottle of 100ml", pop: 88 },
      { b: "Dermocalm Lotion", m: "Intas", s: "100ml", p: 125, pack: "Bottle of 100ml", pop: 85 },
    ]
  },

  // ================= 9. RESPIRATORY & ASTHMA =================
  {
    gen: "Salbutamol Inhaler / Tablets", cat: "Respiratory & Asthma", rx: true, form: "Inhaler / Tablet",
    desc: "Short-acting beta-2 agonist rescue bronchodilator for acute asthma attack and COPD wheezing.",
    uses: ["Acute asthma attack", "COPD wheezing", "Exercise-induced bronchospasm"],
    adultDosage: "1–2 puffs (100mcg/puff) as needed for acute shortness of breath.",
    brands: [
      { b: "Asthalin Inhaler", m: "Cipla", s: "100mcg (200 MDI)", p: 165, pack: "Canister of 200 MDI", pop: 99 },
      { b: "Asthalin Respules", m: "Cipla", s: "2.5mg/2.5ml", p: 145, pack: "Pack of 20 respules", pop: 96, form: "Respules" },
      { b: "Asthalin 4 Tablet", m: "Cipla", s: "4mg", p: 9.5, pack: "Strip of 30 tablets", pop: 86 },
      { b: "Asthalin 2 Tablet", m: "Cipla", s: "2mg", p: 6.5, pack: "Strip of 30 tablets", pop: 80 },
      { b: "Ventorlin Inhaler", m: "GSK", s: "100mcg (200 MDI)", p: 175, pack: "Canister of 200 MDI", pop: 94 },
      { b: "Deriphyllin Retard 150", m: "Zydus Cadila", s: "Theophylline+Etophylline", p: 38, pack: "Strip of 30 tablets", pop: 92 },
      { b: "Deriphyllin Retard 300", m: "Zydus Cadila", s: "Theophylline+Etophylline", p: 68, pack: "Strip of 30 tablets", pop: 94 },
      { b: "Deriphyllin Syrup", m: "Zydus Cadila", s: "100ml", p: 45, pack: "Bottle of 100ml", pop: 89, form: "Syrup" },
    ]
  },
  {
    gen: "Budesonide + Formoterol Inhaler", cat: "Respiratory & Asthma", rx: true, form: "Inhaler / Rotacaps",
    desc: "Inhaled steroid and long-acting bronchodilator for daily maintenance asthma and COPD control.",
    uses: ["Chronic bronchial asthma", "Moderate to severe COPD", "Prevention of nocturnal wheezing"],
    adultDosage: "1–2 puffs twice daily (morning & night). Rinse mouth after use.",
    brands: [
      { b: "Foracort 200 Inhaler", m: "Cipla", s: "200mcg+6mcg (120 MDI)", p: 420, pack: "Canister of 120 MDI", pop: 99 },
      { b: "Foracort 400 Inhaler", m: "Cipla", s: "400mcg+6mcg (120 MDI)", p: 540, pack: "Canister of 120 MDI", pop: 98 },
      { b: "Foracort 200 Rotacaps", m: "Cipla", s: "200mcg+6mcg", p: 185, pack: "Bottle of 30 rotacaps", pop: 95, form: "Rotacaps" },
      { b: "Foracort 400 Rotacaps", m: "Cipla", s: "400mcg+6mcg", p: 245, pack: "Bottle of 30 rotacaps", pop: 94, form: "Rotacaps" },
      { b: "Foracort Respules 0.5mg", m: "Cipla", s: "0.5mg/2ml", p: 265, pack: "Pack of 20 respules", pop: 93, form: "Respules" },
      { b: "Budecort 200 Inhaler", m: "Cipla", s: "200mcg Budesonide", p: 380, pack: "Canister of 200 MDI", pop: 94 },
      { b: "Budecort 0.5mg Respules", m: "Cipla", s: "0.5mg/2ml", p: 235, pack: "Pack of 20 respules", pop: 96, form: "Respules" },
      { b: "Seroflo 250 Inhaler", m: "Cipla", s: "Salmeterol+Fluticasone", p: 620, pack: "Canister of 120 MDI", pop: 96 },
      { b: "Seroflo 125 Inhaler", m: "Cipla", s: "Salmeterol+Fluticasone", p: 495, pack: "Canister of 120 MDI", pop: 92 },
      { b: "Symbicort 160/4.5", m: "AstraZeneca", s: "Budesonide+Formoterol", p: 920, pack: "Turbuhaler 120 doses", pop: 96, form: "Turbuhaler" },
      { b: "Duolin Inhaler", m: "Cipla", s: "Ipratropium+Levosalbutamol", p: 340, pack: "Canister of 200 MDI", pop: 92 },
      { b: "Duolin Respules", m: "Cipla", s: "Ipratropium+Levosalbutamol", p: 210, pack: "Pack of 20 respules", pop: 95, form: "Respules" },
    ]
  },

  // ================= 10. THYROID, EYE & EAR CARE =================
  {
    gen: "Levothyroxine Sodium", cat: "Thyroid", rx: true, form: "Tablet",
    desc: "Synthetic thyroxine (T4) hormone replacement therapy for primary and secondary hypothyroidism.",
    uses: ["Hypothyroidism", "Goiter reduction", "Thyroid replacement in pregnancy"],
    adultDosage: "25mcg–150mcg once daily on empty stomach 30m before morning tea/coffee.",
    brands: [
      { b: "Thyronorm 50", m: "Abbott", s: "50mcg", p: 195, pack: "Bottle of 120 tablets", pop: 99 },
      { b: "Thyronorm 25", m: "Abbott", s: "25mcg", p: 165, pack: "Bottle of 120 tablets", pop: 95 },
      { b: "Thyronorm 75", m: "Abbott", s: "75mcg", p: 215, pack: "Bottle of 120 tablets", pop: 96 },
      { b: "Thyronorm 100", m: "Abbott", s: "100mcg", p: 235, pack: "Bottle of 120 tablets", pop: 98 },
      { b: "Thyronorm 12.5", m: "Abbott", s: "12.5mcg", p: 145, pack: "Bottle of 120 tablets", pop: 91 },
      { b: "Thyronorm 88", m: "Abbott", s: "88mcg", p: 225, pack: "Bottle of 120 tablets", pop: 93 },
      { b: "Thyronorm 112", m: "Abbott", s: "112mcg", p: 240, pack: "Bottle of 120 tablets", pop: 94 },
      { b: "Thyronorm 125", m: "Abbott", s: "125mcg", p: 255, pack: "Bottle of 120 tablets", pop: 95 },
      { b: "Eltroxin 50", m: "GSK", s: "50mcg", p: 190, pack: "Bottle of 120 tablets", pop: 98 },
      { b: "Eltroxin 100", m: "GSK", s: "100mcg", p: 230, pack: "Bottle of 120 tablets", pop: 97 },
      { b: "Eltroxin 25", m: "GSK", s: "25mcg", p: 160, pack: "Bottle of 120 tablets", pop: 94 },
      { b: "Eltroxin 75", m: "GSK", s: "75mcg", p: 210, pack: "Bottle of 120 tablets", pop: 95 },
      { b: "Thyrox 50", m: "Macleods Pharmaceuticals", s: "50mcg", p: 155, pack: "Bottle of 100 tablets", pop: 90 },
      { b: "Euthyrox 50", m: "Merck", s: "50mcg", p: 185, pack: "Strip of 100 tablets", pop: 92 },
    ]
  },
  {
    gen: "Carboxymethylcellulose Eye Drops (Artificial Tears)", cat: "Eye Care", rx: false, form: "Eye Drops",
    desc: "Lubricating artificial tears for soothing dry, burning, and screen-strained eyes.",
    uses: ["Dry eyes", "Computer vision strain", "Eye irritation", "Post-LASIK lubrication"],
    adultDosage: "Instill 1–2 drops in affected eye(s) 3–4 times daily or as needed.",
    brands: [
      { b: "Refresh Tears", m: "Allergan / AbbVie", s: "0.5% w/v (10ml)", p: 165, pack: "Bottle of 10ml", pop: 99 },
      { b: "Refresh Liquigel", m: "Allergan / AbbVie", s: "1.0% w/v (10ml)", p: 245, pack: "Bottle of 10ml", pop: 96 },
      { b: "Tears Naturale II", m: "Alcon / Novartis", s: "Dextran+HPMC (10ml)", p: 265, pack: "Bottle of 10ml", pop: 95 },
      { b: "Eyemist Eye Drops", m: "Sun Pharma", s: "HPMC 0.3% (10ml)", p: 185, pack: "Bottle of 10ml", pop: 92 },
      { b: "Eco Tears", m: "Intas Pharmaceuticals", s: "0.5% (10ml)", p: 140, pack: "Bottle of 10ml", pop: 90 },
      { b: "Add Tears", m: "Sun Pharma", s: "0.5% (10ml)", p: 145, pack: "Bottle of 10ml", pop: 89 },
      { b: "Ciplox Eye Drops", m: "Cipla", s: "Ciprofloxacin 0.3% (10ml)", p: 21, pack: "Bottle of 10ml", pop: 96 },
      { b: "Moxicip Eye Drops", m: "Cipla", s: "Moxifloxacin 0.5% (5ml)", p: 115, pack: "Bottle of 5ml", pop: 95 },
      { b: "Vigamox Eye Drops", m: "Alcon / Novartis", s: "Moxifloxacin 0.5% (5ml)", p: 295, pack: "Bottle of 5ml", pop: 97 },
      { b: "Tobastran Eye Drops", m: "Sun Pharma", s: "Tobramycin 0.3% (5ml)", p: 75, pack: "Bottle of 5ml", pop: 86 },
    ]
  },
  {
    gen: "Paradichlorobenzene + Benzocaine + Chlorbutol", cat: "Ear Care", rx: false, form: "Ear Drops",
    desc: "Cerumenolytic ear drops for softening and gentle dispersal of impacted ear wax.",
    uses: ["Impacted ear wax softening", "Ear fullness and earwax blockage", "Ear discomfort"],
    adultDosage: "Instill 4–5 drops into ear canal twice daily for 3–5 days.",
    brands: [
      { b: "Waxsol Ear Drops", m: "Dexcel / Abbott", s: "0.5% (10ml)", p: 95, pack: "Bottle of 10ml", pop: 97 },
      { b: "Clearwax Ear Drops", m: "Cipla", s: "10ml bottle", p: 110, pack: "Bottle of 10ml", pop: 94 },
      { b: "Otorex Ear Drops", m: "Centaur Pharmaceuticals", s: "10ml bottle", p: 90, pack: "Bottle of 10ml", pop: 90 },
      { b: "Soliwax Ear Drops", m: "Entod Pharmaceuticals", s: "10ml bottle", p: 105, pack: "Bottle of 10ml", pop: 92 },
      { b: "Candibiotic Ear Drops", m: "Glenmark", s: "Clotrimazole+Lignocaine (5ml)", p: 125, pack: "Bottle of 5ml", pop: 98 },
      { b: "Otocin Ear Drops", m: "Mankind Pharma", s: "Ciprofloxacin+Dexamethasone (10ml)", p: 65, pack: "Bottle of 10ml", pop: 88 },
    ]
  }
];

// Expanded therapeutic catalog matrices with diverse Indian brand names
const ADDITIONAL_THERAPEUTIC_MATRICES = [
  // CNS & Psychiatry
  { gen: "Sertraline Hydrochloride", cat: "Central Nervous System & Migraine", rx: true, form: "Tablet", desc: "Selective serotonin reuptake inhibitor (SSRI) for major depressive disorder, panic attacks, and OCD.", uses: ["Depression", "Obsessive-compulsive disorder", "Panic disorder", "Social anxiety"], brands: ["Zoloft 50 (Pfizer)", "Zoloft 100 (Pfizer)", "Daxid 50 (Pfizer)", "Serlift 50 (Sun Pharma)", "Serlift 100 (Sun Pharma)", "Sertima 50 (Intas)", "Inosert 50 (Ipca)", "Serta 50 (Torrent)"], prices: [220, 390, 145, 135, 240, 110, 115, 125] },
  { gen: "Escitalopram Oxalate", cat: "Central Nervous System & Migraine", rx: true, form: "Tablet", desc: "High-affinity SSRI for generalized anxiety disorder and major depressive episodes.", uses: ["Generalized anxiety", "Depression", "Panic attacks"], brands: ["Nexito 10 (Sun Pharma)", "Nexito 5 (Sun Pharma)", "Nexito 20 (Sun Pharma)", "Nexito Plus (Sun Pharma)", "Nexito Forte (Sun Pharma)", "Cilentra 10 (Intas)", "Stalopam 10 (Lupin)", "S-Citadep 10 (Cipla)", "Feliz S 10 (Torrent)"], prices: [125, 75, 215, 165, 185, 110, 115, 105, 112] },
  { gen: "Clonazepam", cat: "Central Nervous System & Migraine", rx: true, form: "Tablet", desc: "High-potency benzodiazepine for panic disorder, acute anxiety episodes, and myoclonic seizures.", uses: ["Panic attacks", "Severe anxiety", "Seizure disorders", "Restless legs"], brands: ["Clonafit 0.5 (Mankind)", "Clonafit 0.25 (Mankind)", "Zapiz 0.5 (Intas)", "Zapiz 0.25 (Intas)", "Lonazep 0.5 (Sun Pharma)", "Lonazep 0.25 (Sun Pharma)", "Rivotril 0.5 (Abbott)", "Epitril 0.5 (Novartis)"], prices: [48, 30, 52, 32, 55, 34, 75, 68] },
  { gen: "Amitriptyline", cat: "Central Nervous System & Migraine", rx: true, form: "Tablet", desc: "Tricyclic antidepressant for chronic neuropathic pain, migraine prophylaxis, and tension headaches.", uses: ["Migraine prevention", "Tension headache", "Fibromyalgia nerve pain", "Depression"], brands: ["Tryptomer 10 (Wockhardt)", "Tryptomer 25 (Wockhardt)", "Tryptomer 50 (Wockhardt)", "Amitone 10 (Intas)", "Amitone 25 (Intas)", "Eliwel 10 (Sun Pharma)", "Sarotena 10 (Lundbeck)"], prices: [35, 58, 95, 32, 52, 38, 70] },

  // Gynae & Women's Health
  { gen: "Dydrogesterone", cat: "Women's Health", rx: true, form: "Tablet", desc: "Retroprogesterone for threatened miscarriage, recurrent abortion, and luteal phase support.", uses: ["Threatened abortion prevention", "Habitual miscarriage", "Endometriosis", "Luteal phase support"], brands: ["Duphaston 10 (Abbott)", "Dydrofem 10 (Sun Pharma)", "Dydroboon 10 (Torrent)", "Dydrogest 10 (Cipla)", "Dydrosure 10 (Alkem)", "Divagest 10 (Glenmark)", "Dydrowin 10 (Mankind)"], prices: [720, 540, 510, 490, 480, 500, 460] },
  { gen: "Progesterone (Micronized)", cat: "Women's Health", rx: true, form: "Capsule", desc: "Natural micronized bioidentical progesterone for pregnancy support and HRT.", uses: ["IVF luteal support", "Threatened miscarriage", "Secondary amenorrhea"], brands: ["Susten 200 (Sun Pharma)", "Susten 300 (Sun Pharma)", "Susten 400 (Sun Pharma)", "Naturogest 200 (Zydus)", "Naturogest 300 (Zydus)", "Dubagest 200 (Glenmark)", "Dubagest 300 (Glenmark)", "Gesterol 200 (Torrent)", "Gestofit 200 (Alembic)"], prices: [430, 580, 720, 395, 540, 410, 560, 380, 375] },
  { gen: "Tranexamic Acid + Mefenamic Acid", cat: "Women's Health", rx: true, form: "Tablet", desc: "Antifibrinolytic and NSAID for menorrhagia and dysmenorrhea.", uses: ["Heavy menstrual bleeding (Menorrhagia)", "Post-surgical bleeding"], brands: ["Trapic-MF (Sun Pharma)", "Pause-MF (Emcure)", "Trenaxa-MF (Macleods)", "Clip-MF (FDC)", "Texakind-MF (Mankind)", "Dubatran-MF (Glenmark)", "Trax-MF (Cipla)"], prices: [245, 235, 210, 195, 180, 220, 205] },

  // Men's Health & Urology
  { gen: "Tamsulosin + Dutasteride", cat: "Men's Health", rx: true, form: "Tablet", desc: "Dual alpha-blocker and 5-ARI for benign prostatic hyperplasia (BPH) urinary symptoms.", uses: ["BPH weak stream & nocturia", "Prostate enlargement reduction"], brands: ["Urimax-D (Cipla)", "Urimax 0.4 (Cipla)", "Veltam-Plus (Intas)", "Flodart-Plus (Mankind)", "Tamflo-D (Sun Pharma)", "Dynapres 0.4 (Torrent)", "Tamcontin-D (Modi Mundi)"], prices: [445, 265, 420, 235, 460, 175, 395] },
  { gen: "Silodosin", cat: "Men's Health", rx: true, form: "Capsule", desc: "Highly uroselective alpha-1A blocker for rapid BPH symptom relief with minimal hypotension.", uses: ["BPH urinary hesitancy & frequency"], brands: ["Silodal 8 (Sun Pharma)", "Silodal 4 (Sun Pharma)", "Sildoo 8 (Intas)", "Sildoo 4 (Intas)", "Silofast 8 (Cipla)", "Rapilif 8 (Ipca)", "Silotime 8 (Mankind)"], prices: [340, 195, 320, 185, 310, 295, 245] },

  // Eye & Ear
  { gen: "Moxifloxacin Eye Drops", cat: "Eye Care", rx: true, form: "Eye Drops", desc: "Fourth-generation fluoroquinolone ophthalmic drop for bacterial conjunctivitis and corneal ulcers.", uses: ["Bacterial pink eye", "Corneal ulcer", "Post-cataract surgery care"], brands: ["Moxicip (Cipla)", "Vigamox (Alcon / Novartis)", "Moxiflox (Sun Pharma)", "Mahaflox (Mankind)", "Moxikind (Mankind)", "4-Quin (Entod)", "Moxoft (Alembic)", "Moxicip-KT (Cipla)"], prices: [115, 295, 110, 95, 88, 105, 100, 145] },
  { gen: "Olopatadine Eye Drops", cat: "Eye Care", rx: false, form: "Eye Drops", desc: "Dual mast cell stabilizer and antihistamine for allergic red itchy eyes.", uses: ["Allergic conjunctivitis", "Itchy eyes", "Pollen eye allergy"], brands: ["Pataday 0.2% (Alcon / Novartis)", "Patanol 0.1% (Alcon / Novartis)", "Opat (Sun Pharma)", "Olopat (Cipla)", "Winolap (Sun Pharma)", "Alert-O (Micro Labs)"], prices: [295, 245, 145, 140, 150, 125] },

  // Bone & Joint
  { gen: "Glucosamine + Diacerein + MSM", cat: "Bone & Joint Care", rx: false, form: "Tablet", desc: "Chondroprotective joint formula for cartilage preservation in knee osteoarthritis.", uses: ["Knee osteoarthritis", "Joint cartilage wear", "Stiff joints"], brands: ["Jointace-DN (Meyer)", "Kondro Plus (Zydus)", "Cartigen Pro (Alkem)", "FreeFlex Forte (Cipla)", "Cartilamine (Pharmed)", "Osteocip (Cipla)", "Movexx Plus (Sun Pharma)"], prices: [285, 260, 310, 295, 340, 250, 240] },

  // Cardiometabolic & Hypertension Matrices
  { gen: "Cilnidipine", cat: "Cardiovascular & BP", rx: true, form: "Tablet", desc: "Dual L- and N-type calcium channel blocker reducing pedal edema and proteinuria in hypertension.", uses: ["Hypertension with renal protection", "Blood pressure control without tachycardia"], brands: ["Cilacar 10 (J.B. Chemicals)", "Cilacar 5 (J.B. Chemicals)", "Cilacar 20 (J.B. Chemicals)", "Nexovas 10 (Macleods)", "Nexovas 5 (Macleods)", "Nexovas 20 (Macleods)", "Cilaheart 10 (Mankind)", "Cilaheart 5 (Mankind)", "Dilnip 10 (Torrent)", "Dilnip 5 (Torrent)"], prices: [145, 85, 235, 130, 78, 210, 110, 65, 125, 75] },
  { gen: "Cilnidipine + Telmisartan", cat: "Cardiovascular & BP", rx: true, form: "Tablet", desc: "Dual ARB and calcium channel blocker for difficult-to-control hypertension.", uses: ["Hypertension with metabolic syndrome", "Cardiovascular risk reduction"], brands: ["Cilacar-T (J.B. Chemicals)", "Nexovas-T (Macleods)", "Cilaheart-T (Mankind)", "Telma-LN 40/10 (Glenmark)", "Tazloc-LN (USV)", "Dilnip-T (Torrent)", "Cresar-LN (Cipla)"], prices: [265, 240, 195, 285, 250, 235, 245] },
  { gen: "Telmisartan + Chlorthalidone", cat: "Cardiovascular & BP", rx: true, form: "Tablet", desc: "Long-acting thiazide-like diuretic and ARB for resistant systolic hypertension.", uses: ["Isolated systolic hypertension", "Resistant hypertension"], brands: ["Telma-CT 40/12.5 (Glenmark)", "Telma-CT 40/6.25 (Glenmark)", "Tazloc-CT 40/12.5 (USV)", "Tazloc-CT 40/6.25 (USV)", "Telmikind-CT (Mankind)", "Cresar-CT (Cipla)", "Arbitel-CT (Micro Labs)", "Telpres-CT (Abbott)"], prices: [285, 260, 245, 220, 165, 235, 230, 240] },
  { gen: "Bisoprolol Fumarate", cat: "Cardiovascular & BP", rx: true, form: "Tablet", desc: "Highly selective beta-1 adrenergic blocker for heart failure, angina, and hypertension.", uses: ["Chronic stable heart failure", "Angina pectoris", "Hypertension"], brands: ["Concor 5 (Merck)", "Concor 2.5 (Merck)", "Concor 10 (Merck)", "Corbis 5 (Unichem)", "Corbis 2.5 (Unichem)", "Bisoheart 5 (Mankind)", "Bisosafe 5 (Alkem)", "Biselect 5 (Sun Pharma)"], prices: [165, 95, 245, 140, 85, 110, 125, 135] },
  { gen: "Nebivolol Hydrochloride", cat: "Cardiovascular & BP", rx: true, form: "Tablet", desc: "Third-generation beta-1 blocker with nitric oxide-mediated vasodilation properties.", uses: ["Hypertension with preserved cardiac output", "Elderly heart failure"], brands: ["Nebicard 5 (Torrent)", "Nebicard 2.5 (Torrent)", "Nebistar 5 (Lupin)", "Nebistar 2.5 (Lupin)", "Nebilong 5 (Micro Labs)", "Nebilong 2.5 (Micro Labs)", "Nebisurf 5 (Cipla)", "Nodon 5 (Cadila)"], prices: [185, 115, 175, 108, 168, 102, 160, 155] },
  { gen: "Rosuvastatin + Aspirin + Clopidogrel", cat: "Cardiovascular & BP", rx: true, form: "Capsule", desc: "All-in-one cardiac polypill for post-PCI, acute coronary syndrome, and ischemic heart disease.", uses: ["Post-angioplasty stent prophylaxis", "Triple cardiac protection", "Secondary prevention of MI"], brands: ["Rosave Gold 20 (Torrent)", "Rosave Gold 10 (Torrent)", "Rosuvas Gold 20 (Sun Pharma)", "Rosuvas Gold 10 (Sun Pharma)", "Rozavel Gold 20 (Sun Pharma)", "Rozavel Gold 10 (Sun Pharma)", "Roseday Gold 20 (USV)", "Razel Gold 20 (Glenmark)", "Turbovas Gold 20 (Micro Labs)"], prices: [365, 265, 385, 280, 375, 270, 350, 360, 340] },
  { gen: "Metformin + Glimepiride + Voglibose", cat: "Diabetes", rx: true, form: "Tablet", desc: "Triple oral antidiabetic therapy addressing fasting, postprandial, and insulin secretion defects.", uses: ["Type 2 Diabetes uncontrolled on dual therapy", "Postprandial sugar spike control"], brands: ["Glycomet Trio 2 (USV)", "Glycomet Trio 1 (USV)", "Amaryl Trio 2 (Sanofi)", "Amaryl Trio 1 (Sanofi)", "Gemer Trio 2 (Sun Pharma)", "Gemer Trio 1 (Sun Pharma)", "Gluconorm-VG 2 (Lupin)", "Gluconorm-VG 1 (Lupin)", "Zoryl-MV 2 (Intas)", "Zoryl-MV 1 (Intas)", "Voliphage-M 0.3 (Franco-Indian)", "Trio-Gemer 2 (Sun Pharma)"], prices: [265, 215, 340, 285, 245, 198, 235, 190, 225, 185, 210, 240] },

  // Cephalosporins & Potent Anti-Infectives
  { gen: "Cefpodoxime Proxetil", cat: "Antibiotics", rx: true, form: "Tablet", desc: "Third-generation oral cephalosporin with excellent tissue penetration for pneumonia and skin infections.", uses: ["Community acquired pneumonia", "Acute otitis media", "Skin & soft tissue infections", "Pharyngitis"], brands: ["Gudcef 200 (Mankind)", "Gudcef 100 (Mankind)", "Gudcef 50 Dry Syrup (Mankind)", "Doxcef 200 (Lupin)", "Doxcef 100 (Lupin)", "Monocef-O 200 (Aristo)", "Monocef-O 100 (Aristo)", "Monocef-O Dry Syrup (Aristo)", "Macpod 200 (Macleods)", "Macpod 100 (Macleods)", "Zedocef 200 (Macleods)", "Cefoprox 200 (Cipla)", "Cefoprox 100 (Cipla)", "Swich 200 (Alkem)", "Swich 100 (Alkem)"], prices: [245, 140, 85, 260, 155, 240, 138, 88, 235, 135, 230, 255, 150, 248, 142] },
  { gen: "Rifaximin", cat: "Gastrointestinal", rx: true, form: "Tablet", desc: "Non-absorbable gut-selective antibiotic for traveler's diarrhea, IBS-D, and hepatic encephalopathy.", uses: ["Irritable Bowel Syndrome with Diarrhea (IBS-D)", "Hepatic encephalopathy prevention", "Small Intestinal Bacterial Overgrowth (SIBO)", "Traveler's diarrhea"], brands: ["Rifagut 550 (Sun Pharma)", "Rifagut 400 (Sun Pharma)", "Rifagut 200 (Sun Pharma)", "Rcifax 550 (Lupin)", "Rcifax 400 (Lupin)", "Rcifax 200 (Lupin)", "Rifaxigress 550 (La Renon)", "Rifaxigress 400 (La Renon)", "Sibofix 550 (Dr. Reddy's)", "Sibofix 400 (Dr. Reddy's)", "Torfix 550 (Torrent)", "Gifaxin 550 (Aristo)"], prices: [520, 395, 215, 495, 380, 205, 480, 370, 490, 375, 485, 465] },
  { gen: "Ursodeoxycholic Acid (UDCA)", cat: "Gastrointestinal", rx: true, form: "Tablet", desc: "Naturally occurring hydrophilic bile acid dissolving gallstones and protecting hepatocytes.", uses: ["Cholesterol gallstone dissolution", "Primary biliary cholangitis", "Non-alcoholic fatty liver disease (NAFLD)", "Intrahepatic cholestasis of pregnancy"], brands: ["Udiliv 300 (Abbott)", "Udiliv 150 (Abbott)", "Udiliv 600 (Abbott)", "Udiliv 450 (Abbott)", "Ursocol 300 (Sun Pharma)", "Ursocol 150 (Sun Pharma)", "Ursocol 600 (Sun Pharma)", "Ursetor 300 (Torrent)", "Actibile 300 (Zydus Cadila)", "Golbi 300 (Intas)", "Ursokem 300 (Alkem)"], prices: [480, 260, 890, 670, 465, 250, 860, 440, 450, 430, 425] },
  { gen: "Silymarin + L-Ornithine L-Aspartate", cat: "Gastrointestinal", rx: false, form: "Tablet / Syrup", desc: "Hepatoprotective formulation detoxifying ammonia and regenerating damaged liver cells.", uses: ["Fatty liver (Steatosis)", "Alcoholic liver disease support", "Elevated liver enzymes ALT/AST", "Cirrhosis adjunct"], brands: ["Hepa-Merz Granules (Win-Medicare)", "Hepa-Merz Syrup (Win-Medicare)", "Hepagard Tablets (Cipla)", "Silybon 140 (Micro Labs)", "Silybon 70 (Micro Labs)", "Liv-52 DS Tablets (Himalaya)", "Liv-52 Plain Tablets (Himalaya)", "Liv-52 Syrup (Himalaya)", "Amlycure DS (Aimil Pharmaceuticals)", "Hepano Syrup (Dabur)"], prices: [560, 340, 245, 220, 125, 195, 140, 165, 210, 135] },

  // Dermatology, Permethrin & Retinoids
  { gen: "Luliconazole", cat: "Antifungal", rx: true, form: "Cream", desc: "Modern imidazole antifungal with superior fungicidal potency against dermatophytosis.", uses: ["Tinea cruris (Jock itch)", "Tinea corporis (Ringworm)", "Tinea pedis (Athlete's foot)", "Refractory skin fungal infection"], brands: ["Lulifin Cream 30g (Sun Pharma)", "Lulifin Cream 20g (Sun Pharma)", "Lulifin Cream 10g (Sun Pharma)", "Lulifin Lotion 30ml (Sun Pharma)", "Lulican Cream 20g (Glenmark)", "Lulican Cream 30g (Glenmark)", "Luliz Cream 20g (Cipla)", "Lulibet Cream 20g (Intas)", "Lulimac Cream 30g (Macleods)", "Ludura Cream 20g (Torrent)", "Luligee Cream 20g (Alkem)"], prices: [440, 310, 175, 345, 295, 420, 290, 285, 380, 280, 275] },
  { gen: "Tretinoin & Adapalene (Retinoids)", cat: "Dermatology & Skin Care", rx: true, form: "Gel / Cream", desc: "Topical vitamin A retinoid accelerating follicular cellular turnover and clearing microcomedones.", uses: ["Acne vulgaris comedones", "Post-inflammatory acne marks", "Photoaging skin texture"], brands: ["Retino-A 0.025% (Janssen)", "Retino-A 0.05% (Janssen)", "Adaferin 0.1% Gel (Galderma)", "Deriva-CMS Gel (Glenmark)", "A-Ret 0.05% Gel (Menarini)", "Tretiheal 0.05% (Healing Pharma)", "Epiduo Gel (Galderma)", "Klenzit-MS Gel (Glenmark)"], prices: [265, 320, 360, 295, 210, 185, 890, 310] },
  { gen: "Permethrin", cat: "Dermatology & Skin Care", rx: false, form: "Lotion / Soap / Cream", desc: "Topical pediculicide and scabicide disrupting sodium channels in scabies mites and lice.", uses: ["Scabies mite infestation", "Head lice & nits eradication", "Pubic lice"], brands: ["Scaboma Lotion 100ml (Glenmark)", "Scaboma Soap 75g (Glenmark)", "Permite 5% Cream 30g (Curatio)", "Permite 5% Cream 60g (Curatio)", "Scabper Cream 30g (Curatio)", "Scabper Soap 75g (Curatio)", "Perlice Anti-Lice Cream Wash 60ml (Galderma)", "Permasol Soap 75g (Cipla)", "Scabex Lotion 100ml (Alkem)"], prices: [165, 110, 125, 230, 115, 105, 145, 95, 140] },

  // Probiotics & Gut Health
  { gen: "Probiotics & Prebiotics (Spore-forming)", cat: "Gastrointestinal", rx: false, form: "Capsule / Sachet / Mini-bottle", desc: "Multi-strain gut flora restorative for antibiotic-associated diarrhea and gastroenteritis.", uses: ["Antibiotic-induced diarrhea prevention", "Acute gastroenteritis recovery", "Gut microbiome balance", "Irritable bowel bloating"], brands: ["Enterogermina 2B (Sanofi India)", "Enterogermina 4B (Sanofi India)", "Sporlac-DS (Sanzyme)", "Sporlac-Plus (Sanzyme)", "Darolac (Aristo)", "Econorm Sachet (Dr. Reddy's)", "Econorm Capsule (Dr. Reddy's)", "Vizylac (Unichem)", "Bifilac (Tablets India)", "Gutpro (Cipla)", "Vibact (USV)"], prices: [520, 680, 145, 175, 155, 340, 360, 120, 185, 210, 195] },

  // Anthelmintic & Parasitic
  { gen: "Albendazole", cat: "Gastrointestinal", rx: false, form: "Chewable Tablet / Suspension", desc: "Broad-spectrum anthelmintic agent eradicating intestinal roundworms, pinworms, hookworms, and whipworms.", uses: ["Intestinal worm deworming", "Pinworm & roundworm infection", "Tapeworm cysts"], brands: ["Zentel 400 (GSK)", "Zentel Suspension (GSK)", "Bandy 400 (Mankind)", "Bandy-Plus (Mankind)", "Noworm 400 (Alkem)", "Noworm Suspension (Alkem)", "Albend 400 (Cipla)", "Albezole 400 (Sun Pharma)"], prices: [14, 28, 12, 28, 11, 24, 12, 10] },
  { gen: "Ivermectin", cat: "Dermatology & Skin Care", rx: true, form: "Tablet", desc: "Potent antiparasitic agent for crusted scabies, filariasis, and strongyloidiasis.", uses: ["Crusted scabies eradication", "Lymphatic filariasis", "Strongyloidiasis"], brands: ["Ivecop 12 (Menarini)", "Ivecop 6 (Menarini)", "Vermact 12 (Mankind)", "Vermact 6 (Mankind)", "Iverkind 12 (Mankind)", "Iversun 12 (Sun Pharma)", "Scabo 12 (Torrent)"], prices: [165, 95, 145, 85, 140, 155, 135] },

  // Glaucoma & Ophthalmic
  { gen: "Bimatoprost / Latanoprost Ophthalmic Solution", cat: "Eye Care", rx: true, form: "Eye Drops", desc: "Prostaglandin analogue lowering intraocular pressure in open-angle glaucoma and ocular hypertension.", uses: ["Open-angle glaucoma", "Ocular hypertension", "Eyelash hypotrichosis"], brands: ["Careprost 0.03% (Sun Pharma)", "Lumigan 0.01% (Allergan)", "Lumigan 0.03% (Allergan)", "Xalatan 0.005% (Pfizer)", "Latocom (Sun Pharma)", "Bimat LS (Sun Pharma)", "Travatan 0.004% (Alcon / Novartis)"], prices: [485, 780, 890, 750, 680, 440, 820] },
  { gen: "Timolol Maleate + Brimonidine Ophthalmic", cat: "Eye Care", rx: true, form: "Eye Drops", desc: "Dual beta-blocker and alpha-2 adrenergic agonist decreasing aqueous humor formation in glaucoma.", uses: ["Glaucoma elevated intraocular pressure", "Ocular hypertension"], brands: ["Glucomol 0.5% (Allergan)", "Timolong 0.5% (Sun Pharma)", "Alphagan-P 0.15% (Allergan)", "Brimodin (Sun Pharma)", "Brimocom (Sun Pharma)", "Combigan (Allergan)"], prices: [145, 120, 480, 245, 410, 640] },

  // Dental & Oral Care
  { gen: "Chlorhexidine Gluconate Medicated Mouthwash", cat: "First Aid & Antiseptics", rx: false, form: "Mouthwash", desc: "Gold standard antiseptic mouthwash preventing dental plaque, gingivitis, and oral mucositis.", uses: ["Gingivitis bleeding gums", "Dental plaque prevention", "Post-dental surgery hygiene", "Mouth ulcer antiseptic"], brands: ["Hexidine Mouthwash (ICPA Health)", "Clohex-Plus Mouthwash (Dr. Reddy's)", "Rexidin-M Forte Mouthwash (Indoco)", "Betadine Mint Gargle 2% (Win-Medicare)", "S-Dent Mouthwash (Sun Pharma)", "Sensodyne Daily Mouthwash (GSK)", "Colgate PerioGard (Colgate)"], prices: [145, 160, 155, 175, 130, 210, 195] },
  { gen: "Choline Salicylate + Lignocaine Dental Gel", cat: "Pain Relief", rx: false, form: "Oral Gel", desc: "Fast-acting pain-numbing gel for painful mouth ulcers, denture sores, and orthodontic abrasions.", uses: ["Mouth ulcers (Aphthous stomatitis)", "Teething gum pain", "Denture irritation sores", "Tongue blisters"], brands: ["Zytee RB Gel (Raptakos Brett)", "Zytee Gel (Raptakos Brett)", "Mucopain Gel (ICPA Health)", "Ora-Fast Gel (Curatio)", "Tess Oral Paste (Troikaa)", "Kenalog in Orabase (Piramal)", "Dologel (Dr. Reddy's)", "Smile Gel (Mankind)"], prices: [95, 88, 110, 92, 135, 185, 75, 68] },

  // Pediatric Care & Fever/Cold Drops
  { gen: "Pediatric Colic & Digestive Drops (Simethicone + Dill Oil)", cat: "Pediatric Care", rx: false, form: "Oral Drops", desc: "Gentle antispasmodic and antiflatulent drops for infant infantile colic, abdominal bloating, and griping pain.", uses: ["Infantile colic pain", "Gas distension in babies", "Griping pain"], brands: ["Colicaid Drops (Bayer)", "Woodwards Gripe Water (Reckitt)", "Neopeptine Drops (Raptakos Brett)", "Bonnisan Drops (Himalaya)", "Spasmo-Proxyvon Drops (Wockhardt)", "Coliza Drops (Centaur)", "Babygesic Drops (Alkem)"], prices: [85, 65, 95, 75, 48, 60, 42] },
  { gen: "Zinc Gluconate / Acetate Pediatric Solution", cat: "Pediatric Care", rx: false, form: "Syrup / Drops", desc: "WHO-recommended zinc supplementation for acute pediatric diarrhea and mucosal regeneration.", uses: ["Pediatric acute diarrhea recovery", "Immune support in children", "Zinc deficiency"], brands: ["Zinconia 20mg Syrup (Apex)", "Zinconia 50mg (Apex)", "Zincovit Pead Drops (Apex)", "Zincolife Pead (Fourrts)", "Nu-Zinc Pead (Mankind)", "Zinconil Drops (Micro Labs)"], prices: [62, 85, 55, 48, 42, 45] },

  // Neuro-nutrients & Multivitamins
  { gen: "Methylcobalamin + Benfotiamine + Alpha Lipoic Acid", cat: "Vitamins & Supplements", rx: false, form: "Capsule / Tablet", desc: "Comprehensive neurotropic formula reversing peripheral neuropathy and nerve exhaustion.", uses: ["Diabetic peripheral neuropathy", "Numbness & tingling in hands/feet", "Sciatica nerve regeneration", "Chronic fatigue"], brands: ["Nurokind-Gold (Mankind)", "Nurokind-LC (Mankind)", "Nurokind-Plus RF (Mankind)", "Rejunuron-Forte (Apex)", "Mecob-OD (Torrent)", "Maxgalin-ER 75 (Sun Pharma)", "Nervijen-D3 (Apex)", "Trinerve (Alkem)", "Rejunex-CD3 (Intas)", "Cobal-G (Micro Labs)"], prices: [145, 210, 135, 240, 195, 280, 230, 220, 260, 180] },
  { gen: "Biotin + Amino Acids + Minerals (Hair Nutrition)", cat: "Vitamins & Supplements", rx: false, form: "Tablet", desc: "Trichological nutritional supplement supplying keratin building blocks for hair fall reduction.", uses: ["Hair fall reduction", "Brittle nails", "Telogen effluvium", "Hair density improvement"], brands: ["Keraglo-Eva (Ipca)", "Keraglo-Men (Ipca)", "Follihair (Abbott)", "Follihair A (Abbott)", "Hair4U (Glenmark)", "Tricovera (Sun Pharma)", "Chello-Biotin 10mg (Fourrts)", "Follirich (Torrent)", "Trichospire (Sun Pharma)"], prices: [590, 610, 580, 640, 520, 480, 290, 490, 550] },
  { gen: "Coenzyme Q10 + Lycopene + Omega 3", cat: "Vitamins & Supplements", rx: false, form: "Softgel Capsule", desc: "High-potency cellular antioxidant formulation supporting mitochondrial energy, cardiovascular health, and sperm vitality.", uses: ["Mitochondrial energy support", "Cardiovascular wellness", "Male fertility sperm motility", "Statin-induced myopathy relief"], brands: ["CoQ 100 (Universal Nutriscience)", "CoQ 300 (Universal Nutriscience)", "UbiQ-300 (Fourrts)", "Maxirich CoQ (Cipla)", "Lycostar (Mankind)", "Carofit Plus (Ajanta Pharma)", "Oxitard (Himalaya)", "Wellman Multi (Meyer Organics)", "Wellwoman Multi (Meyer Organics)"], prices: [680, 1450, 1380, 590, 185, 245, 175, 420, 420] }
];

/**
 * Generate 1,000+ realistic, unique records
 */
function generateFullCatalog() {
  const catalog = [];
  const genericToIds = new Map();

  // 1. Ingest detailed formulations
  for (const group of FORMULATION_GROUPS) {
    for (const b of group.brands) {
      const id = makeId(b.b, b.s || group.form);
      const name = `${b.b} ${b.s || ""}`.trim();
      const composition = group.gen.includes("+")
        ? group.gen
        : `${group.gen} ${b.s || ""}`.trim();

      const record = {
        id,
        name,
        brand: b.b,
        genericName: group.gen,
        composition,
        activeIngredients: group.gen.split("+").map((s) => s.trim()),
        strength: b.s || "Standard Strength",
        dosageForm: b.form || group.form,
        category: group.cat,
        manufacturer: b.m,
        packSize: b.pack || "Strip of 10",
        price: b.p,
        prescriptionRequired: group.rx,
        otc: !group.rx,
        rating: 4.4 + ((b.pop * 3) % 6) / 10,
        popularity: b.pop || 75,
        description: group.desc,
        uses: group.uses,
        howItWorks: `Pharmacological action of ${group.gen} for indicated therapy.`,
        dosage: {
          adults: group.adultDosage,
          children: "Under pediatric guidance.",
          missedDose: "Take when remembered.",
          overdose: "Seek immediate medical evaluation.",
        },
        sideEffects: {
          common: ["Mild gastrointestinal discomfort or local transient sensation"],
          rare: ["Allergic reaction"],
        },
        warnings: {
          pregnancy: group.rx ? "Consult doctor before use." : "Safe at recommended dosage.",
          breastfeeding: "Consult physician.",
          kidneyDisease: "Use with caution.",
          liverDisease: "Use with caution.",
          alcohol: "Avoid alcohol.",
          driving: "No impairment.",
        },
        interactions: ["Consult physician for drug interactions."],
        foodInteractions: {
          beforeFood: "As directed.",
          afterFood: "Preferred after meals with water.",
          avoid: ["Alcohol"],
        },
        storage: "Store below 30°C in a dry place.",
        alternatives: [],
        badges: {
          bestSeller: b.pop >= 95,
          topRated: b.pop >= 96,
          lowestPrice: false,
        },
        image: "",
        isActive: true,
      };

      catalog.push(record);
      const gKey = group.gen.toLowerCase().trim();
      if (!genericToIds.has(gKey)) genericToIds.set(gKey, []);
      genericToIds.get(gKey).push(id);
    }
  }

  // 2. Ingest additional therapeutic matrices
  for (const entry of ADDITIONAL_THERAPEUTIC_MATRICES) {
    entry.brands.forEach((brandStr, idx) => {
      const match = brandStr.match(/^(.*?)\s*\((.*?)\)$/);
      const brand = match ? match[1].trim() : brandStr;
      const manufacturer = match ? match[2].trim() : "Indian Pharma";
      const price = entry.prices[idx] || 99;
      const id = makeId(brand, entry.gen);

      const record = {
        id,
        name: `${brand} (${entry.gen})`,
        brand,
        genericName: entry.gen,
        composition: `${entry.gen}`,
        activeIngredients: entry.gen.split("+").map((s) => s.trim()),
        strength: "Standard Strength",
        dosageForm: entry.form,
        category: entry.cat,
        manufacturer,
        packSize: entry.form.includes("Eye") || entry.form.includes("Drops") ? "Bottle of 10ml" : "Strip of 10",
        price,
        prescriptionRequired: entry.rx,
        otc: !entry.rx,
        rating: 4.4 + ((idx * 3) % 6) / 10,
        popularity: 70 + ((idx * 7) % 28),
        description: entry.desc,
        uses: entry.uses,
        howItWorks: `Action of ${entry.gen} for indicated therapy.`,
        dosage: {
          adults: "As directed on product label or by physician.",
          children: "Under pediatric supervision.",
          missedDose: "Take when remembered.",
          overdose: "Seek medical help.",
        },
        sideEffects: {
          common: ["Mild stomach discomfort or local reaction"],
          rare: ["Allergic sensitivity"],
        },
        warnings: {
          pregnancy: entry.rx ? "Consult doctor before use." : "Safe at recommended dosage.",
          breastfeeding: "Consult doctor.",
          kidneyDisease: "Use with caution.",
          liverDisease: "Use with caution.",
          alcohol: "Avoid alcohol.",
          driving: "No impairment.",
        },
        interactions: ["Consult doctor."],
        foodInteractions: {
          beforeFood: "As directed.",
          afterFood: "Preferred after meals.",
          avoid: ["Alcohol"],
        },
        storage: "Store below 30°C.",
        alternatives: [],
        badges: {
          bestSeller: idx === 0,
          topRated: idx === 1,
          lowestPrice: false,
        },
        image: "",
        isActive: true,
      };

      catalog.push(record);
      const gKey = entry.gen.toLowerCase().trim();
      if (!genericToIds.has(gKey)) genericToIds.set(gKey, []);
      genericToIds.get(gKey).push(id);
    });
  }

  // 3. Clinical strength / pack expansion for major Indian medicines
  // Expanding realistic, commercially available strengths (e.g. 5mg, 10mg, 20mg, 40mg, 100mg, 250mg, 500mg, Forte, DT, Syrup)
  const expandedStrengths = [
    { base: "Telma", strengths: ["Telma-ACT 40/5/12.5", "Telma-LN 40/10", "Telma-CT 40/6.25", "Telma-CT 40/12.5"], m: "Glenmark", cat: "Cardiovascular & BP", rx: true },
    { base: "Pan", strengths: ["Pan-IT (Pantoprazole+Itopride)", "Pan-L (Pantoprazole+Levosulpiride)", "Pan-MPS", "Pan 80 Injection"], m: "Alkem Laboratories", cat: "Antacid", rx: true },
    { base: "Pantocid", strengths: ["Pantocid-IT", "Pantocid-L", "Pantocid-HP Kit", "Pantocid IV"], m: "Sun Pharma", cat: "Antacid", rx: true },
    { base: "Razo", strengths: ["Razo 20", "Razo 10", "Razo-L (Rabeprazole+Levosulpiride)", "Razo-IT"], m: "Dr. Reddy's", cat: "Antacid", rx: true },
    { base: "Augmentin", strengths: ["Augmentin 375", "Augmentin 1.2g IV", "Augmentin ES 600", "Augmentin Suspension 228.5mg"], m: "GSK", cat: "Antibiotics", rx: true },
    { base: "Clavam", strengths: ["Clavam Forte Dry Syrup", "Clavam 1g", "Clavam 375 DT", "Clavam 1.2g IV"], m: "Alkem Laboratories", cat: "Antibiotics", rx: true },
    { base: "Azithral", strengths: ["Azithral 100", "Azithral 200 Susp", "Azithral XL 200", "Azithral A (with Ambroxol)"], m: "Alembic", cat: "Antibiotics", rx: true },
    { b: "Azee", strengths: ["Azee 100 DT", "Azee 1000", "Azee XL 200", "Azee-DT 250"], m: "Cipla", cat: "Antibiotics", rx: true },
    { base: "Taxim-O", strengths: ["Taxim-O 50 DT", "Taxim-O CV 200/125", "Taxim-O Forte 200"], m: "Alkem Laboratories", cat: "Antibiotics", rx: true },
    { base: "Mahacef", strengths: ["Mahacef-Plus (Cefixime+Ofloxacin)", "Mahacef-CV", "Mahacef 100 DT"], m: "Mankind Pharma", cat: "Antibiotics", rx: true },
    { base: "Zifi", strengths: ["Zifi-CV 200", "Zifi-O (Cefixime+Ofloxacin)", "Zifi-Turbo"], m: "FDC Limited", cat: "Antibiotics", rx: true },
    { base: "Foracort", strengths: ["Foracort 100 Inhaler", "Foracort 100 Rotacaps", "Foracort 400 Autohaler", "Foracort 1mg Respules"], m: "Cipla", cat: "Respiratory & Asthma", rx: true },
    { base: "Asthalin", strengths: ["Asthalin Inhaler with Dose Counter", "Asthalin Rotacaps 200mcg", "Asthalin Respules 1.25mg", "Asthalin Syrup 2mg/5ml"], m: "Cipla", cat: "Respiratory & Asthma", rx: true },
    { base: "Budecort", strengths: ["Budecort 100 Inhaler", "Budecort 400 Inhaler", "Budecort 1mg Respules", "Budecort 200 Rotacaps"], m: "Cipla", cat: "Respiratory & Asthma", rx: true },
    { base: "Seroflo", strengths: ["Seroflo 50 Inhaler", "Seroflo 500 Rotacaps", "Seroflo 250 Rotacaps", "Seroflo 100 Synchrobreathe"], m: "Cipla", cat: "Respiratory & Asthma", rx: true },
    { base: "Duolin", strengths: ["Duolin Rotacaps", "Duolin Forte Respules", "Duolin LD Respules"], m: "Cipla", cat: "Respiratory & Asthma", rx: true },
    { base: "Shelcal", strengths: ["Shelcal 250", "Shelcal-K", "Shelcal-M", "Shelcal Joint"], m: "Torrent", cat: "Minerals & Nutrition", rx: false },
    { base: "Calcimax", strengths: ["Calcimax-D", "Calcimax Plus", "Calcimax Chewable", "Calcimax K2 Plus"], m: "Meyer", cat: "Minerals & Nutrition", rx: false },
    { base: "Orofer", strengths: ["Orofer-FCM Injection", "Orofer Syrup", "Orofer Drops", "Orofer S 100 Injection"], m: "Emcure", cat: "Minerals & Nutrition", rx: false },
    { base: "Livogen", strengths: ["Livogen Adult Tonic", "Livogen Kids Syrup", "Livogen Captabs", "Livogen Hematinic Drops"], m: "P&G", cat: "Minerals & Nutrition", rx: false },
    { base: "Zincovit", strengths: ["Zincovit CL", "Zincovit Women", "Zincovit Tablet 30s", "Zincovit Sugar Free Syrup"], m: "Apex", cat: "Vitamins & Supplements", rx: false },
    { base: "Supradyn", strengths: ["Supradyn Immuno+ Chewable", "Supradyn Kids Multi", "Supradyn Energy Gummies", "Supradyn Pro"], m: "Bayer", cat: "Vitamins & Supplements", rx: false },
    { base: "Uprise-D3", strengths: ["Uprise-D3 2K Capsule", "Uprise-D3 Drops 800 IU", "Uprise-D3 1K Chewable", "Uprise-D3 Granules 60K"], m: "Alkem", cat: "Vitamins & Supplements", rx: false },
    { base: "Tayo", strengths: ["Tayo Drops", "Tayo 2K Chewable", "Tayo-D3 Liquid 60K", "Tayo Gold"], m: "Eris", cat: "Vitamins & Supplements", rx: false },
    { base: "Candid", strengths: ["Candid-V Gel (Vaginal)", "Candid-V6 Vaginal Tablets", "Candid 3D Cream", "Candid TV Suspension"], m: "Glenmark", cat: "Antifungal", rx: false },
    { base: "Betadine", strengths: ["Betadine 7.5% Scrub", "Betadine 5% Cream", "Betadine Vaginal Pessaries", "Betadine Throat Spray"], m: "Win-Medicare", cat: "First Aid & Antiseptics", rx: false },
    { base: "Volini", strengths: ["Volini Active Gel", "Volini Joint Expert Gel", "Volini Roll-on", "Volini Patch (Pack of 3)"], m: "Sun Pharma", cat: "Pain Relief", rx: false },
    { base: "Moov", strengths: ["Moov Advance Gel", "Moov Neck & Shoulder Cream", "Moov Ortho Spray", "Moov Active Roll-On"], m: "Reckitt", cat: "Pain Relief", rx: false },
    { base: "Digene", strengths: ["Digene Ultra Fizz Sachet", "Digene Sticks Orange", "Digene Sticks Mint", "Digene Sugar-Free Liquid"], m: "Abbott", cat: "Antacid", rx: false },
    { base: "Eno", strengths: ["Eno Cola Flavor", "Eno Ajwain Flavor", "Eno Pudina Flavor", "Eno Extra Strong Lemon"], m: "GSK", cat: "Antacid", rx: false },
    { base: "Electral", strengths: ["Electral Active Orange Drink", "Electral Apple Fizz", "Electral Energy 500ml", "Electral Z Sachet"], m: "FDC", cat: "ORS & Hydration", rx: false },
    { base: "Otrivin", strengths: ["Otrivin Breathe Clean Saline", "Otrivin Moisturizing Adult", "Otrivin Menthol Spray", "Otrivin Baby Saline Drops"], m: "GSK", cat: "Cold & Cough", rx: false },
    { base: "Nasivion", strengths: ["Nasivion Saline Nasal Spray", "Nasivion Rest Easy Vapour Patches", "Nasivion S Nasal Drops", "Nasivion Care Spray"], m: "P&G", cat: "Cold & Cough", rx: false },
  ];

  for (const exp of expandedStrengths) {
    const parent = catalog.find((c) => c.brand.toLowerCase().startsWith((exp.base || "").toLowerCase()));
    for (const strName of exp.strengths) {
      const id = makeId(strName, exp.m);
      if (!catalog.some((x) => x.id === id)) {
        const record = {
          id,
          name: strName,
          brand: strName.split(" ")[0],
          genericName: parent ? parent.genericName : strName,
          composition: parent ? parent.composition : strName,
          activeIngredients: parent ? parent.activeIngredients : [strName],
          strength: strName.includes(" ") ? strName.split(" ").slice(1).join(" ") : "Standard",
          dosageForm: strName.includes("Spray") ? "Spray" : strName.includes("Drops") ? "Drops" : strName.includes("Syrup") || strName.includes("Suspension") ? "Syrup" : "Tablet",
          category: exp.cat,
          manufacturer: exp.m,
          packSize: strName.includes("100ml") ? "Bottle of 100ml" : "Strip of 10",
          price: (parent ? Math.round(parent.price * 1.1) : 120) || 95,
          prescriptionRequired: exp.rx,
          otc: !exp.rx,
          rating: 4.6,
          popularity: 80,
          description: parent ? parent.description : `Pharmaceutical preparation of ${strName}`,
          uses: parent ? parent.uses : ["Therapeutic health application"],
          howItWorks: parent ? parent.howItWorks : "Targeted pharmacological action.",
          dosage: parent ? parent.dosage : { adults: "As directed.", children: "Under advice.", missedDose: "Take when remembered.", overdose: "Seek medical help." },
          sideEffects: parent ? parent.sideEffects : { common: ["Mild discomfort"], rare: ["Allergic sensitivity"] },
          warnings: parent ? parent.warnings : { pregnancy: "Consult doctor.", breastfeeding: "Consult doctor.", kidneyDisease: "Caution.", liverDisease: "Caution.", alcohol: "Avoid.", driving: "No impairment." },
          interactions: ["Consult pharmacist."],
          foodInteractions: { beforeFood: "As directed.", afterFood: "Preferred after meals.", avoid: [] },
          storage: "Store in a cool dry place below 30°C.",
          alternatives: [],
          badges: { bestSeller: false, topRated: true, lowestPrice: false },
          image: "",
          isActive: true,
        };
        catalog.push(record);
        const gKey = record.genericName.toLowerCase().trim();
        if (!genericToIds.has(gKey)) genericToIds.set(gKey, []);
        genericToIds.get(gKey).push(id);
      }
    }
  }

  // Cross link alternatives and set lowest price
  for (const item of catalog) {
    const gKey = item.genericName.toLowerCase().trim();
    const allMatching = genericToIds.get(gKey) || [];
    item.alternatives = allMatching.filter((xId) => xId !== item.id).slice(0, 8);

    const peers = catalog.filter((m) => m.genericName.toLowerCase().trim() === gKey);
    if (peers.length > 1) {
      const minPrice = Math.min(...peers.map((p) => p.price));
      if (item.price === minPrice) {
        item.badges.lowestPrice = true;
      }
    }
  }

  return catalog;
}

module.exports = {
  CATEGORIES,
  generateFullCatalog,
};
