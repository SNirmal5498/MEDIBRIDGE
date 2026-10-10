const COMPOSITION_TERM_MAPS = {
  ta: {
    "Multi B-Complex": "மல்டி பி-காம்ப்ளக்ஸ்",
    "B-Complex": "பி-காம்ப்ளக்ஸ்",
    "Multi": "மல்டி",
    "Vit C": "வைட்டமின் சி",
    "Vitamin C": "வைட்டமின் சி",
    "Vit D3": "வைட்டமின் டி3",
    "Vitamin D3": "வைட்டமின் டி3",
    "Vit E": "வைட்டமின் ஈ",
    "Vitamin E": "வைட்டமின் ஈ",
    "Zinc": "துத்தநாகம்",
    "Iron": "இரும்புச்சத்து",
    "B12": "பி12",
    "Vitamin B12": "வைட்டமின் பி12",
    "Antiseptic": "கிருமிநாசினி",
    "Liquid": "திரவம்",
    "Syrup": "சிரப்",
    "Suspension": "சஸ்பென்ஷன்",
    "Fast Action": "வேகமான செயல்பாடு",
    "Caffeine": "காஃபின்",
    "Calcium": "கால்சியம்",
    "Aspirin": "ஆஸ்பிரின்",
    "Ibuprofen": "ஐபூப்ரோஃபென்",
    "Paracetamol": "பாராசிட்டமால்",
  },
  hi: {
    "Multi B-Complex": "मल्टी बी-कॉम्प्लेक्स",
    "B-Complex": "बी-कॉम्प्लेक्स",
    "Multi": "मल्टी",
    "Vit C": "विटामिन सी",
    "Vitamin C": "विटामिन सी",
    "Vit D3": "विटामिन डी3",
    "Vitamin D3": "विटामिन डी3",
    "Zinc": "जिंक",
    "Iron": "आयरन",
    "B12": "बी12",
    "Antiseptic": "एंटीसेप्टिक",
    "Liquid": "लिक्विड",
    "Syrup": "सिरप",
    "Fast Action": "फास्ट एक्शन",
    "Caffeine": "कैफीन",
  },
  te: {
    "Multi B-Complex": "మల్టీ B-కాంప్లెక్స్",
    "B-Complex": "B-కాంప్లెక్స్",
    "Vit C": "విటమిన్ C",
    "Zinc": "జింక్",
    "Iron": "ఐరన్",
    "B12": "B12",
    "Antiseptic": "యాంటీసెప్టిక్",
    "Liquid": "లిక్విడ్",
  },
  ml: {
    "Multi B-Complex": "മൾട്ടി B-കോംപ്ലക്സ്",
    "B-Complex": "B-കോംപ്ലക്സ്",
    "Vit C": "വിറ്റാമിൻ C",
    "Zinc": "സിങ്ക്",
    "Iron": "അയൺ",
    "B12": "B12",
    "Antiseptic": "ആന്റിസെപ്റ്റിക്",
    "Liquid": "ലിക്വിഡ്",
  },
  kn: {
    "Multi B-Complex": "ಮಲ್ಟಿ B-ಕಾಂಪ್ಲೆಕ್ಸ್",
    "B-Complex": "B-ಕಾಂಪ್ಲೆಕ್ಸ್",
    "Vit C": "ವಿಟಮಿನ್ C",
    "Zinc": "ಝಿಂಕ್",
    "Iron": "ಐರನ್",
    "B12": "B12",
    "Antiseptic": "ಆಂಟಿಸೆಪ್ಟಿಕ್",
    "Liquid": "ಲಿಕ್ವಿಡ್",
  },
};

function formatCompositionPhrase(phrase, langCode = "en") {
  if (!phrase || langCode === "en") return phrase || "";
  const map = COMPOSITION_TERM_MAPS[langCode];
  if (!map) return phrase;

  if (map[phrase]) return map[phrase];

  // Try compound splitting by +, /, &, spaces
  let result = String(phrase);

  // If contains +, split by +
  if (result.includes("+")) {
    const parts = result.split("+").map(p => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" + ");
  }

  // If contains /, split by /
  if (result.includes("/")) {
    const parts = result.split("/").map(p => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" / ");
  }

  // Replace individual tokens from largest to smallest
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.includes(key)) {
      const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}\\b`, "gi");
      result = result.replace(regex, map[key]);
    }
  }

  return result;
}

// Test cases from evidence
const testPhrases = [
  "Multi B-Complex+Vit C",
  "B-Complex+Vit C+Zinc",
  "Antiseptic Liquid",
  "Antiseptic",
  "Iron+B12 (200ml)",
  "500mg Fast Action",
  "Ibuprofen+Caffeine"
];

const langs = ["ta", "hi", "te", "ml", "kn"];

console.log("=== COMPOSITION PHRASE TRANSLATION TEST ===");
for (const lang of langs) {
  console.log(`\nLanguage: ${lang.toUpperCase()}`);
  for (const phrase of testPhrases) {
    const trans = formatCompositionPhrase(phrase, lang);
    console.log(`  '${phrase}' => '${trans}'`);
  }
}
