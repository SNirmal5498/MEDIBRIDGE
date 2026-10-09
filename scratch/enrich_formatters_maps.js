const path = require("path");
const fs = require("fs");

const formattersPath = path.join(__dirname, "../client/src/i18n/formatters_enrichment.js");

// We will inject missing brand, generic, manufacturer, dosage form maps directly into formatters.js
const extraBrandMaps = {
  ta: {
    "Becosules": "பெகோசுல்ஸ்",
    "Becosules Capsules": "பெகோசுல்ஸ் கேப்சூல்கள்",
    "Becosules Z": "பெகோசுல்ஸ் இசட்",
    "Betadine": "பீட்டாடின்",
    "Betadine 5% Ointment": "பீட்டாடின் 5% களிம்பு",
    "Azithral": "அசித்ரால்",
    "Pan-40": "பான்-40",
    "Pantocid": "பான்டோசிட்",
    "Shelcal": "ஷெல்கால்",
    "Evion": "ஈவியான்",
    "Liv.52": "லிவ்.52",
    "Supradyn": "சுப்ராடின்",
    "Neurobion": "நியூரோபியான்",
    "Combiflam": "காம் பிஃபிளாம்",
    "Disprin": "டிஸ்ப்ரின்",
    "Voveran": "வோவெரான்",
    "Brufen": "ப்ரூஃபென்",
    "Zerodol-P": "ஜீரோடால்-பி",
    "Pfizer": "ஃபைசர்",
  },
  hi: {
    "Becosules": "बेकोस्यूल्स",
    "Becosules Capsules": "बेकोस्यूल्स कैप्सूल",
    "Becosules Z": "बेकोस्यूल्स जेड",
    "Betadine": "बीटाडीन",
    "Betadine 5% Ointment": "बीटाडीन 5% मलम",
    "Azithral": "एजिथ्रल",
    "Pan-40": "पैन-40",
    "Pantocid": "पैंटोसिट",
    "Shelcal": "शेलकल",
    "Evion": "एवियन",
    "Liv.52": "लिव.52",
    "Supradyn": "सुप्राडिन",
    "Neurobion": "न्यूरोबियन",
    "Combiflam": "कॉम्बीफ्लैम",
    "Disprin": "डिस्प्रिन",
    "Voveran": "वोवेरान",
    "Brufen": "ब्रूफेन",
    "Zerodol-P": "जीरोडॉल-पी",
    "Pfizer": "फाइजर",
  },
  te: {
    "Becosules": "బెకోసూల్స్",
    "Becosules Capsules": "బెకోసూల్స్ క్యాప్సూల్స్",
    "Becosules Z": "బెకోసూల్స్ జెడ్",
    "Betadine": "బీటాడిన్",
    "Betadine 5% Ointment": "బీటాడిన్ 5% ములాము",
    "Azithral": "అజిత్రాల్",
    "Pan-40": "ప్యాన్-40",
    "Pantocid": "ప్యాంటోసిడ్",
    "Shelcal": "షెల్కాల్",
    "Evion": "ఎవియాన్",
    "Liv.52": "లివ్.52",
    "Supradyn": "సుప్రాడిన్",
    "Neurobion": "న్యూరోబియాన్",
    "Combiflam": "కాంబిఫ్లామ్",
    "Disprin": "డిస్ప్రిన్",
    "Voveran": "వోవెరాన్",
    "Brufen": "బ్రూఫెన్",
    "Zerodol-P": "జీరోడాల్-పి",
    "Pfizer": "ఫైజర్",
  },
  ml: {
    "Becosules": "ബെക്കോസൂൾസ്",
    "Becosules Capsules": "ബെക്കോസൂൾസ് ക്യാപ്സ്യൂളുകൾ",
    "Becosules Z": "ബെക്കോസൂൾസ് സെഡ്",
    "Betadine": "ബീറ്റാഡിൻ",
    "Betadine 5% Ointment": "ബീറ്റാഡിൻ 5% കുഴമ്പ്",
    "Azithral": "അസിത്രൽ",
    "Pan-40": "പാൻ-40",
    "Pantocid": "പന്റോസിഡ്",
    "Shelcal": "ഷെൽകാൽ",
    "Evion": "എവിയോൺ",
    "Liv.52": "ലിവ്.52",
    "Supradyn": "സുപ്രാഡിൻ",
    "Neurobion": "ന്യൂറോബിയോൺ",
    "Combiflam": "കോംബിഫ്ലാം",
    "Disprin": "ഡിസ്പ്രിൻ",
    "Voveran": "വോവെറാൻ",
    "Brufen": "ബ്രൂഫെൻ",
    "Zerodol-P": "സിറോഡോൾ-പി",
    "Pfizer": "ഫൈസർ",
  },
  kn: {
    "Becosules": "ಬೆಕೋಸೂಲ್ಸ್",
    "Becosules Capsules": "ಬೆಕೋಸೂಲ್ಸ್ ಕ್ಯಾಪ್ಸುಲ್ಗಳು",
    "Becosules Z": "ಬೆಕೋಸೂಲ್ಸ್ ಝೆಡ್",
    "Betadine": "ಬೀಟಾಡಿನ್",
    "Betadine 5% Ointment": "ಬೀಟಾಡಿನ್ 5% ಲೇಪನ",
    "Azithral": "ಅಜಿತ್ರಾಲ್",
    "Pan-40": "ಪ್ಯಾನ್-40",
    "Pantocid": "ಪ್ಯಾಂಟೋಸಿಡ್",
    "Shelcal": "ಶೆಲ್ಕಾಲ್",
    "Evion": "ಎವಿಯಾನ್",
    "Liv.52": "ಲಿವ್.52",
    "Supradyn": "ಸುಪ್ರಾಡಿನ್",
    "Neurobion": "ನ್ಯೂರೋಬಿಯಾನ್",
    "Combiflam": "ಕಾಂಬಿಫ್ಲಾಮ್",
    "Disprin": "ಡಿಸ್ಪ್ರಿನ್",
    "Voveran": "ವೋವೆರಾನ್",
    "Brufen": "ಬ್ರೂಫೆನ್",
    "Zerodol-P": "ಝೀರೋಡಾಲ್-ಪಿ",
    "Pfizer": "ಫೈಜರ್",
  },
};

const extraGenericMaps = {
  ta: {
    "Vitamin B-Complex with Vitamin C & Zinc": "வைட்டமின் பி-காம்பளக்ஸ், வைட்டமின் சி & துத்தநாகம்",
    "Vitamin B-Complex + Zinc": "வைட்டமின் பி-காம்பளக்ஸ் + துத்தநாகம்",
    "Povidone-Iodine": "பொவிடோன்-அயோடின்",
    "Povidone Iodine": "பொவிடோன் அயோடின்",
    "Azithromycin": "அசித்ரோமைசின்",
    "Pantoprazole": "பான்டோபிரசோல்",
    "Calcium + Vitamin D3": "கால்சியம் + வைட்டமின் டி3",
    "Vitamin E (Tocopheryl Acetate)": "வைட்டமின் ஈ (டோகோஃபெரைல் அசிடேட்)",
    "Ibuprofen + Paracetamol": "ஐபூப்ரோஃபென் + பாராசிட்டமால்",
    "Aceclofenac + Paracetamol": "அசெக்லோஃபெனாக் + பாராசிட்டமால்",
    "Diclofenac Sodium": "டைக்ளோஃபெனாக் சோடியம்",
  },
  hi: {
    "Vitamin B-Complex with Vitamin C & Zinc": "विटामिन बी-कॉम्प्लेक्स, विटामिन सी और जिंक",
    "Vitamin B-Complex + Zinc": "विटामिन बी-कॉम्प्लेक्स + जिंक",
    "Povidone-Iodine": "पोविडोन-आयोडीन",
    "Povidone Iodine": "पोविडोन आयोडीन",
    "Azithromycin": "एजिथ्रोमाइसिन",
    "Pantoprazole": "पैंटोप्राजोल",
    "Calcium + Vitamin D3": "कैल्शियम + विटामिन डी3",
    "Vitamin E (Tocopheryl Acetate)": "विटामिन ई (टोकोफेराइल एसीटेट)",
    "Ibuprofen + Paracetamol": "आइबूप्रोफेन + पैरासिटामोल",
    "Aceclofenac + Paracetamol": "एसीक्लोफेनाक + पैरासिटामोल",
    "Diclofenac Sodium": "डाइक्लोफेनाक सोडियम",
  },
  te: {
    "Vitamin B-Complex with Vitamin C & Zinc": "విటమిన్ బి-కాంప్లెక్స్, విటమిన్ సి & జింక్",
    "Vitamin B-Complex + Zinc": "విటమిన్ బి-కాంప్లెక్స్ + జింక్",
    "Povidone-Iodine": "పోవిడోన్-అయోడిన్",
    "Povidone Iodine": "పోవిడోన్ అయోడిన్",
    "Azithromycin": "అజిత్రోమైసిన్",
    "Pantoprazole": "ప్యాంటోప్రాజోల్",
    "Calcium + Vitamin D3": "కాల్షియం + విటమిన్ డి3",
    "Vitamin E (Tocopheryl Acetate)": "విటమిన్ ఇ (టోకోఫెరిల్ అసిటేట్)",
    "Ibuprofen + Paracetamol": "ఐబూప్రోఫెన్ + పారాసిటమాల్",
    "Aceclofenac + Paracetamol": "అసెక్లోఫెనాక్ + పారాసిటమాల్",
    "Diclofenac Sodium": "డైక్లోఫెనాక్ సోడియం",
  },
  ml: {
    "Vitamin B-Complex with Vitamin C & Zinc": "വിറ്റാമിൻ ബി-കോംപ്ലക്സ്, വിറ്റാമിൻ സി & സിങ്ക്",
    "Vitamin B-Complex + Zinc": "വിറ്റാമിൻ ബി-കോംപ്ലക്സ് + സിങ്ക്",
    "Povidone-Iodine": "പോവിഡോൺ-അയഡിൻ",
    "Povidone Iodine": "പോവിഡോൺ അയഡിൻ",
    "Azithromycin": "അസിത്രോമൈസിൻ",
    "Pantoprazole": "പന്റോപ്രാസോൾ",
    "Calcium + Vitamin D3": "കാൽസ്യം + വിറ്റാമിൻ ഡി3",
    "Vitamin E (Tocopheryl Acetate)": "വിറ്റാമിൻ ഇ (ടോക്കോഫെറൈൽ അസറ്റേറ്റ്)",
    "Ibuprofen + Paracetamol": "ഐബുപ്രോഫെൻ + പാരാസിറ്റമോൾ",
    "Aceclofenac + Paracetamol": "അസെക്ലോഫെനാക് + പാരാസിറ്റമോൾ",
    "Diclofenac Sodium": "ഡിക്ലോഫെനാക് സോഡിയം",
  },
  kn: {
    "Vitamin B-Complex with Vitamin C & Zinc": "ವಿಟಮಿನ್ ಬಿ-ಕಾಂಪ್ಲೆಕ್ಸ್, ವಿಟಮಿನ್ ಸಿ ಮತ್ತು ಝಿಂಕ್",
    "Vitamin B-Complex + Zinc": "ವಿಟಮಿನ್ ಬಿ-ಕಾಂಪ್ಲೆಕ್ಸ್ + ಝಿಂಕ್",
    "Povidone-Iodine": "ಪೋವಿಡೋನ್-ಅಯೋಡಿನ್",
    "Povidone Iodine": "ಪೋವಿಡೋನ್ ಅಯೋಡಿನ್",
    "Azithromycin": "ಅಜಿತ್ರೋಮೈಸಿನ್",
    "Pantoprazole": "ಪ್ಯಾಂಟೋಪ್ರಾಝೋಲ್",
    "Calcium + Vitamin D3": "ಕ್ಯಾಲ್ಸಿಯಂ + ವಿಟಮಿನ್ ಡಿ3",
    "Vitamin E (Tocopheryl Acetate)": "ವಿಟಮಿನ್ ಇ (ಟೋಕೋಫೆರೈಲ್ ಅಸಿಟೇಟ್)",
    "Ibuprofen + Paracetamol": "ಐಬುಪ್ರೊಫೇನ್ + ಪ್ಯಾರಾಸಿಟಮಾಲ್",
    "Aceclofenac + Paracetamol": "ಅಸೆಕ್ಲೋಫೆನಾಕ್ + ಪ್ಯಾರಾಸಿಟಮಾಲ್",
    "Diclofenac Sodium": "ಡೈಕ್ಲೋಫೆನಾಕ್ ಸೋಡಿಯಂ",
  },
};

const extraManufacturerMaps = {
  ta: {
    "Pfizer": "ஃபைசர்",
    "Win-Medicare": "வின்-மெடிகேர்",
    "Lupin": "லூபின்",
    "Dr. Reddy's": "டாக்டர் ரெட்டீஸ்",
    "Sun Pharma": "சன் பார்மா",
    "Alkem": "ஆல்கெம்",
    "Torrent": "டொரண்ட்",
    "Mankind": "மேன்கைண்ட்",
  },
  hi: {
    "Pfizer": "फाइजर",
    "Win-Medicare": "विन-मेडिकेयर",
    "Lupin": "लुपिन",
    "Dr. Reddy's": "डॉ. रेड्डीज",
    "Sun Pharma": "सन फार्मा",
    "Alkem": "अल्केम",
    "Torrent": "टॉरेंट",
    "Mankind": "मैनकाइंड",
  },
  te: {
    "Pfizer": "ఫైజర్",
    "Win-Medicare": "విన్-మెడికేర్",
    "Lupin": "లుపిన్",
    "Dr. Reddy's": "డాక్టర్ రెడ్డీస్",
    "Sun Pharma": "సన్ ఫార్మా",
    "Alkem": "ఆల్కెమ్",
    "Torrent": "టొరెంట్",
    "Mankind": "మ్యాన్‌కైండ్",
  },
  ml: {
    "Pfizer": "ഫൈസർ",
    "Win-Medicare": "വിൻ-മെഡികെയർ",
    "Lupin": "ലൂപിൻ",
    "Dr. Reddy's": "ഡോ. റെഡ്ഡീസ്",
    "Sun Pharma": "സൺ ഫാർമ",
    "Alkem": "ആൽകെം",
    "Torrent": "ടോറന്റ്",
    "Mankind": "മാൻകൈൻഡ്",
  },
  kn: {
    "Pfizer": "ಫೈಜರ್",
    "Win-Medicare": "ವಿನ್-ಮೆಡಿಕೇರ್",
    "Lupin": "ಲುಪಿನ್",
    "Dr. Reddy's": "ಡಾ. ರೆಡ್ಡೀಸ್",
    "Sun Pharma": "ಸನ್ ಫಾರ್ಮಾ",
    "Alkem": "ಆಲ್ಕೆಮ್",
    "Torrent": "ಟೊರೆಂಟ್",
    "Mankind": "ಮ್ಯಾನ್‌ಕೈಂಡ್",
  },
};

const fileToModify = path.join(__dirname, "../client/src/utils/formatters.js");
let fileText = fs.readFileSync(fileToModify, "utf8");

// Function to inject map entries into formatters.js
for (const [lang, map] of Object.entries(extraBrandMaps)) {
  for (const [k, v] of Object.entries(map)) {
    const searchTarget = `MEDICINE_BRAND_MAPS = {`;
    const injectStr = `  ${lang}: {\n    ${JSON.stringify(k)}: ${JSON.stringify(v)},`;
    const langTarget = `MEDICINE_BRAND_MAPS = {\n  ${lang}: {`;
    if (fileText.includes(langTarget)) {
      fileText = fileText.replace(langTarget, `${langTarget}\n    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
    }
  }
}

for (const [lang, map] of Object.entries(extraGenericMaps)) {
  for (const [k, v] of Object.entries(map)) {
    const langTarget = `GENERIC_NAME_MAPS = {\n  ${lang}: {`;
    if (fileText.includes(langTarget)) {
      fileText = fileText.replace(langTarget, `${langTarget}\n    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
    }
  }
}

for (const [lang, map] of Object.entries(extraManufacturerMaps)) {
  for (const [k, v] of Object.entries(map)) {
    const langTarget = `MANUFACTURER_MAPS = {\n  ${lang}: {`;
    if (fileText.includes(langTarget)) {
      fileText = fileText.replace(langTarget, `${langTarget}\n    ${JSON.stringify(k)}: ${JSON.stringify(v)},`);
    }
  }
}

fs.writeFileSync(fileToModify, fileText, "utf8");
console.log("✅ Enhanced formatters.js with Becosules, Betadine, Pfizer, Lupin and extra brand/generic maps!");
