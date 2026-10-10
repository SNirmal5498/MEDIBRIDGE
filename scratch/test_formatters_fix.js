const MEDICINE_BRAND_MAPS = {
  ta: {
    "Electral Powder": "எலக்ட்ரால் பவுடர்",
    "Electral": "எலக்ட்ரால்",
    "Eno Fruit Salt Lemon": "ஈனோ ஃப்ரூட் சால்ட் எலுமிச்சை",
    "Eno Fruit Salt Regular": "ஈனோ ஃப்ரூட் சால்ட் ரெகுலர்",
    "Eno": "ஈனோ",
    "Evion 400": "ஈவியான் 400",
    "Foracort 200 Inhaler": "ஃபோராகோர்ட் 200 இன்ஹேலர்",
    "Glycomet-SR 500": "கிளைகோமெட்-எஸ்ஆர் 500",
    "Moov Pain Relief Cream": "மூவ் வலி நிவாரண கிரீம்",
    "Neurobion Forte": "நியூரோபியான் ஃபோர்ட்டே",
  },
  hi: {
    "Electral Powder": "इलेक्ट्रा-एल पाउडर",
    "Electral": "इलेक्ट्रा-एल",
    "Eno Fruit Salt Lemon": "ईनो फ्रूट साल्ट लेमन",
    "Eno Fruit Salt Regular": "ईनो फ्रूट साल्ट रेगुलर",
    "Eno": "ईनो",
    "Evion 400": "इवियन 400",
    "Foracort 200 Inhaler": "फोराकोर्ट 200 इनहेलर",
    "Glycomet-SR 500": "ग्लाइकोमेट-एसआर 500",
    "Moov Pain Relief Cream": "मूव पेन रिलीफ क्रीम",
    "Neurobion Forte": "न्यूरोबियन फोर्ट",
  },
  te: {
    "Electral Powder": "ఎలక్ట్రాల్ పౌడర్",
    "Electral": "ఎలక్ట్రాల్",
    "Eno Fruit Salt Lemon": "ఈనో ఫ్రూట్ సాల్ట్ నిమ్మ",
    "Eno Fruit Salt Regular": "ఈనో ఫ్రూట్ సాల్ట్ రెగ్యులర్",
    "Eno": "ఈనో",
    "Evion 400": "ఇవియాన్ 400",
    "Foracort 200 Inhaler": "ఫోరాకోర్ట్ 200 ఇన్హేలర్",
    "Glycomet-SR 500": "గ్లైకోమెట్-ఎస్ఆర్ 500",
    "Moov Pain Relief Cream": "మూవ్ పెయిన్ రిలీఫ్ క్రీమ్",
    "Neurobion Forte": "న్యూరోబియాన్ ఫోర్టే",
  },
  ml: {
    "Electral Powder": "ഇലക്ട്രാൽ പൗഡർ",
    "Electral": "ഇലക്ട്രാൽ",
    "Eno Fruit Salt Lemon": "ഈനോ ഫ്രൂട്ട് സാൾട്ട് ലമൺ",
    "Eno Fruit Salt Regular": "ഈനോ ഫ്രൂട്ട് സാൾട്ട് റെഗുലർ",
    "Eno": "ഈനോ",
    "Evion 400": "ഇവിയോൺ 400",
    "Foracort 200 Inhaler": "ഫോറാകോർട്ട് 200 ഇൻഹേലർ",
    "Glycomet-SR 500": "ഗ്ലൈക്കോമെറ്റ്-എസ്ആർ 500",
    "Moov Pain Relief Cream": "മൂവ് പെയ്ൻ റിലീഫ് ക്രീം",
    "Neurobion Forte": "ന്യൂറോബിയോൺ ഫോർട്ട്",
  },
  kn: {
    "Electral Powder": "ಎಲೆಕ್ಟ್ರಾಲ್ ಪೌಡರ್",
    "Electral": "ಎಲೆಕ್ಟ್ರಾಲ್",
    "Eno Fruit Salt Lemon": "ಈನೋ ಫ್ರೂಟ್ ಸಾಲ್ಟ್ ಲೆಮನ್",
    "Eno Fruit Salt Regular": "ಈನೋ ಫ್ರೂಟ್ ಸಾಲ್ಟ್ ರೆಗ್ಯುಲರ್",
    "Eno": "ಈನೋ",
    "Evion 400": "ಇವಿಯಾನ್ 400",
    "Foracort 200 Inhaler": "ಫೊರಾಕಾರ್ಟ್ 200 ಇನ್‌ಹೇಲರ್",
    "Glycomet-SR 500": "ಗ್ಲೈಕೋಮೆಟ್-ಎಸ್ಆರ್ 500",
    "Moov Pain Relief Cream": "ಮೂವ್ ಪೇನ್ ರಿಲೀಫ್ ಕ್ರೀಮ್",
    "Neurobion Forte": "ನ್ಯೂರೋಬಿಯಾನ್ ಫೋರ್ಟೆ",
  },
};

const COMMON_WORD_MAPS = {
  ta: {
    "Powder": "பவுடர்", "Fruit Salt": "ஃப்ரூட் சால்ட்", "Lemon": "எலுமிச்சை", "Regular": "ரெகுலர்",
    "Cream": "கிரீம்", "Inhaler": "இன்ஹேலர்", "Forte": "ஃபோர்ட்டே", "Limited": "லிமிடெட்"
  },
  hi: {
    "Powder": "पाउडर", "Fruit Salt": "फ्रूट साल्ट", "Lemon": "लेमन", "Regular": "रेगुलर",
    "Cream": "क्रीम", "Inhaler": "इनहेलर", "Forte": "फोर्ट", "Limited": "लिमिटेड"
  },
  te: {
    "Powder": "పౌడర్", "Fruit Salt": "ఫ్రൂట్ సాల్ట్", "Lemon": "నిమ్మ", "Regular": "రెగ్యులర్",
    "Cream": "క్రీమ్", "Inhaler": "ఇన్హేలర్", "Forte": "ఫోర్టే", "Limited": "లిమిటెడ్"
  },
  ml: {
    "Powder": "പൗഡർ", "Fruit Salt": "ഫ്രൂട്ട് സാൾട്ട്", "Lemon": "ലമൺ", "Regular": "റെഗുലർ",
    "Cream": "ക്രീം", "Inhaler": "ഇൻഹേലർ", "Forte": "ഫോർട്ട്", "Limited": "ലിമിറ്റഡ്"
  },
  kn: {
    "Powder": "ಪೌಡರ್", "Fruit Salt": "ಫ್ರೂಟ್ ಸಾಲ್ಟ್", "Lemon": "ಲೆಮನ್", "Regular": "ರೆಗ್ಯುಲರ್",
    "Cream": "ಕ್ರೀಮ್", "Inhaler": "ಇನ್‌ಹೇಲರ್", "Forte": "ಫೋರ್ಟೆ", "Limited": "ಲಿಮಿಟೆಡ್"
  }
};

function applyWordReplacements(text, langCode) {
  if (!text || typeof text !== "string" || langCode === "en") return text;
  const wordMap = COMMON_WORD_MAPS[langCode];
  if (!wordMap) return text;
  let result = text;
  const sortedKeys = Object.keys(wordMap).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    const regex = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
    result = result.replace(regex, wordMap[key]);
  }
  return result;
}

function formatBrandName(brandName, langCode = "en") {
  if (!brandName || langCode === "en") return brandName || "";
  const map = MEDICINE_BRAND_MAPS[langCode];
  if (map && map[brandName]) return map[brandName];

  const lowerBrand = String(brandName).toLowerCase();
  if (map) {
    const exactKey = Object.keys(map).find((k) => k.toLowerCase() === lowerBrand);
    if (exactKey) return map[exactKey];

    let result = String(brandName);
    const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      if (result.toLowerCase().includes(key.toLowerCase())) {
        const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
        result = result.replace(regex, map[key]);
      }
    }
    return applyWordReplacements(result, langCode);
  }

  return applyWordReplacements(brandName, langCode);
}

["en", "hi", "ta", "te", "ml", "kn"].forEach(lang => {
  console.log(`\n=== Language: ${lang} ===`);
  console.log("Electral Powder:", formatBrandName("Electral Powder", lang));
  console.log("Eno Fruit Salt Lemon:", formatBrandName("Eno Fruit Salt Lemon", lang));
  console.log("Evion 400:", formatBrandName("Evion 400", lang));
  console.log("Foracort 200 Inhaler:", formatBrandName("Foracort 200 Inhaler", lang));
  console.log("Glycomet-SR 500:", formatBrandName("Glycomet-SR 500", lang));
  console.log("Moov Pain Relief Cream:", formatBrandName("Moov Pain Relief Cream", lang));
  console.log("Neurobion Forte:", formatBrandName("Neurobion Forte", lang));
});
