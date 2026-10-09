const path = require("path");
const fs = require("fs");

const translationsPath = path.join(__dirname, "../client/src/i18n/translations.js");
let content = fs.readFileSync(translationsPath, "utf8");

// Define new keys to insert per language
const newKeys = {
  en: {
    "autocomplete.suggestionsHeader": "Suggestions",
    "autocomplete.viewAllResults": "View all results for",
    "autocomplete.noResults": "No matching medicines found",
    "autocomplete.noResultsDesc": "Try checking for typos or searching by generic chemical name.",
    "pharmacy.verifiedStock": "Verified Stock",
    "pharmacy.demoData": "Sample Data",
    "pharmacy.outOfStockOrderUnavailable": "Out of Stock - Order Unavailable",
    "pharmacy.locating": "Locating nearby partner pharmacies...",
    "pharmacy.noPharmaciesDesc": "No active partner pharmacies matched your current search or stock filters.",
    "medicine.loading": "Loading medicines...",
    "medicine.noMedicinesDesc": "No medicines found matching your criteria. Try adjusting your search or filters.",
    "profile.noAddress": "No address saved",
    "orders.atWarehouse": "At Warehouse",
    "orders.inTransit": "In Transit",
    "auth.loginError": "Login failed. Please check your credentials.",
    "auth.registerError": "Registration failed. Please try again.",
    "common.translationUnavailable": "Translation unavailable",
    "common.retryTranslation": "Retry translation",
  },
  hi: {
    "autocomplete.suggestionsHeader": "सुझाव",
    "autocomplete.viewAllResults": "के सभी परिणाम देखें",
    "autocomplete.noResults": "कोई मेल खाती दवाएं नहीं मिलीं",
    "autocomplete.noResultsDesc": "वर्तनी की जांच करें या जेनेरिक नाम से खोजें।",
    "pharmacy.verifiedStock": "सत्यापित स्टॉक",
    "pharmacy.demoData": "नमूना डेटा",
    "pharmacy.outOfStockOrderUnavailable": "स्टॉक समाप्त - ऑर्डर उपलब्ध नहीं है",
    "pharmacy.locating": "निकटतम भागीदार फ़ार्मेसियों का पता लगाया जा रहा है...",
    "pharmacy.noPharmaciesDesc": "आपकी खोज या स्टॉक फ़िल्टर से कोई फ़ार्मेसी मेल नहीं खाती।",
    "medicine.loading": "दवाएं लोड हो रही हैं...",
    "medicine.noMedicinesDesc": "आपके मानदंडों से मेल खाती कोई दवाएं नहीं मिलीं।",
    "profile.noAddress": "कोई पता सहेजा नहीं गया",
    "orders.atWarehouse": "वेयरहाउस में",
    "orders.inTransit": "रास्ते में",
    "auth.loginError": "लॉगिन विफल। कृपया अपने विवरण की जांच करें।",
    "auth.registerError": "पंजीकरण विफल। कृपया पुनः प्रयास करें।",
    "common.translationUnavailable": "अनुवाद अनुपलब्ध",
    "common.retryTranslation": "पुनः प्रयास करें",
  },
  ta: {
    "autocomplete.suggestionsHeader": "பரிந்துரைகள்",
    "autocomplete.viewAllResults": "க்கான அனைத்து முடிவுகளையும் காண்க",
    "autocomplete.noResults": "பொருந்தும் மருந்துகள் எதுவும் கிடைக்கவில்லை",
    "autocomplete.noResultsDesc": "எழுத்துப்பிழைகளைச் சரிபார்க்கவும் அல்லது ஜெனரிக் பெயரால் தேடவும்.",
    "pharmacy.verifiedStock": "சரிபார்க்கப்பட்ட இருப்பு",
    "pharmacy.demoData": "மாதிரித் தரவு",
    "pharmacy.outOfStockOrderUnavailable": "இருப்பு இல்லை - ஆர்டர் செய்ய முடியாது",
    "pharmacy.locating": "அருகிலுள்ள மருத்தகங்களைக் கண்டறிகிறது...",
    "pharmacy.noPharmaciesDesc": "உங்கள் தேடலுக்கு ஏற்ற மருந்தகங்கள் எதுவும் கிடைக்கவில்லை.",
    "medicine.loading": "மருந்துகள் ஏற்றப்படுகின்றன...",
    "medicine.noMedicinesDesc": "உங்கள் நிபந்தனைகளுக்கு ஏற்ற மருந்துகள் எதுவும் கிடைக்கவில்லை.",
    "profile.noAddress": "முகவரி எதுவும் சேமிக்கப்படவில்லை",
    "orders.atWarehouse": "கிடங்கில் உள்ளது",
    "orders.inTransit": "பயணத்தில் உள்ளது",
    "auth.loginError": "உள்நுழைவு தோல்வியடைந்தது. விவரங்களைச் சரிபார்க்கவும்.",
    "auth.registerError": "பதிவு செய்வது தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.",
    "common.translationUnavailable": "மொழிபெயர்ப்பு கிடைக்கவில்லை",
    "common.retryTranslation": "மீண்டும் முயல்க",
  },
  te: {
    "autocomplete.suggestionsHeader": "సూచనలు",
    "autocomplete.viewAllResults": "అన్ని ఫలితాలను చూడండి",
    "autocomplete.noResults": "సరిపోలే మందులు కనుగొనబడలేదు",
    "autocomplete.noResultsDesc": "అక్షరదోషాలను తనిఖీ చేయండి లేదా జెనెరిక్ పేరుతో శోధించండి.",
    "pharmacy.verifiedStock": "ధృవీకరించబడిన స్టాక్",
    "pharmacy.demoData": "నమూనా డేటా",
    "pharmacy.outOfStockOrderUnavailable": "స్టాక్ లేదు - ఆర్డర్ అందుబాటులో లేదు",
    "pharmacy.locating": "సమీప భాగస్వామి ఫార్మసీలను కనుగొంటోంది...",
    "pharmacy.noPharmaciesDesc": "మీ శోధనకు తగిన ఫార్మసీలు కనుగొనబడలేదు.",
    "medicine.loading": "మందులు లోడ్ అవుతున్నాయి...",
    "medicine.noMedicinesDesc": "మీ నిబంధనలకు తగిన మందులు కనుగొనబడలేదు.",
    "profile.noAddress": "చిరునామా సేవ్ చేయబడలేదు",
    "orders.atWarehouse": "వేర్‌హౌస్‌లో ఉంది",
    "orders.inTransit": "రవాణాలో ఉంది",
    "auth.loginError": "లాగిన్ విఫలమైంది. దయచేసి వివరాలను తనిఖీ చేయండి.",
    "auth.registerError": "రిజిస్ట్రేషన్ విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    "common.translationUnavailable": "అనువాదం అందుబాటులో లేదు",
    "common.retryTranslation": "మళ్లీ ప్రయత్నించండి",
  },
  ml: {
    "autocomplete.suggestionsHeader": "നിർദ്ദേശങ്ങൾ",
    "autocomplete.viewAllResults": "എല്ലാ ഫലങ്ങളും കാണുക",
    "autocomplete.noResults": "പൊരുത്തപ്പെടുന്ന മരുന്നുകൾ കണ്ടെത്തിയില്ല",
    "autocomplete.noResultsDesc": "അക്ഷരത്തെറ്റുകൾ പരിശോധിക്കുക അല്ലെങ്കിൽ ജനറിക് പേര് ഉപയോഗിച്ച് തിരയുക.",
    "pharmacy.verifiedStock": "സ്ഥിരീകരിച്ച സ്റ്റോക്ക്",
    "pharmacy.demoData": "സാമ്പിൾ ഡാറ്റ",
    "pharmacy.outOfStockOrderUnavailable": "സ്റ്റോക്കില്ല - ഓർഡർ ലഭ്യവുമല്ല",
    "pharmacy.locating": "സമീപത്തുള്ള പങ്കാളി ഫാർമസികൾ കണ്ടെത്തുന്നു...",
    "pharmacy.noPharmaciesDesc": "നിങ്ങളുടെ തിരയലിന് അനുയോജ്യമായ ഫാർമസികളൊന്നും കണ്ടെത്തിയില്ല.",
    "medicine.loading": "മരുന്നുകൾ ലോഡുചെയ്യുന്നു...",
    "medicine.noMedicinesDesc": "നിങ്ങളുടെ മാനദണ്ഡങ്ങളുമായി പൊരുത്തപ്പെടുന്ന മരുന്നുകളൊന്നും കണ്ടെത്തിയില്ല.",
    "profile.noAddress": "മേൽവിലാസമൊന്നും സേവ് ചെയ്തിട്ടില്ല",
    "orders.atWarehouse": "വെയർഹൗസിൽ",
    "orders.inTransit": "വഴിമധ്യേ",
    "auth.loginError": "ലോഗിൻ പരാജയപ്പെട്ടു. വിവരങ്ങൾ പരിശോധിക്കുക.",
    "auth.registerError": "രജിസ്ട്രേഷൻ പരാജയപ്പെട്ടു. ദയവായി വീണ്ടും ശ്രമിക്കുക.",
    "common.translationUnavailable": "വിവർത്തനം ലഭ്യമല്ല",
    "common.retryTranslation": "വീണ്ടും ശ്രമിക്കുക",
  },
  kn: {
    "autocomplete.suggestionsHeader": "ಸಲಹೆಗಳು",
    "autocomplete.viewAllResults": "ಎಲ್ಲಾ ಫಲಿತಾಂಶಗಳನ್ನು ವೀಕ್ಷಿಸಿ",
    "autocomplete.noResults": "ಯಾವುದೇ ಸೂಕ್ತ ಔಷಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ",
    "autocomplete.noResultsDesc": "ಅಕ್ಷರ ಸಂಯೋಜನೆ ಪರಿಶೀಲಿಸಿ ಅಥವಾ ಜೆನೆರಿಕ್ ಹೆಸರಿನಿಂದ ಹುಡುಕಿ.",
    "pharmacy.verifiedStock": "ದೃಢೀಕರಿಸಿದ ಸ್ಟಾಕ್",
    "pharmacy.demoData": "ಮಾದರಿ ಡೇಟಾ",
    "pharmacy.outOfStockOrderUnavailable": "ಸ್ಟಾಕ್ ಇಲ್ಲ - ಆರ್ಡರ್ ಲಭ್ಯವಿಲ್ಲ",
    "pharmacy.locating": "ಹತ್ತಿರದ ಪಾಲುದಾರ ಫಾರ್ಮಸಿಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    "pharmacy.noPharmaciesDesc": "ನಿಮ್ಮ ಹುಡುಕಾಟಕ್ಕೆ ಸೂಕ್ತವಾದ ಯಾವುದೇ ಫಾರ್ಮಸಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    "medicine.loading": "ಔಷಧಿಗಳನ್ನು ಲೋಡ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    "medicine.noMedicinesDesc": "ನಿಮ್ಮ ಮಾನದಂಡಕ್ಕೆ ಸೂಕ್ತವಾದ ಯಾವುದೇ ಔಷಧಿಗಳು ಕಂಡುಬಂದಿಲ್ಲ.",
    "profile.noAddress": "ಯಾವುದೇ ವಿಳಾಸವನ್ನು ಉಳಿಸಲಾಗಿಲ್ಲ",
    "orders.atWarehouse": "ವೇರ್‌ಹೌಸ್‌ನಲ್ಲಿ",
    "orders.inTransit": "ಸಾಗಣೆಯಲ್ಲಿದೆ",
    "auth.loginError": "ಲಾಗಿನ್ ವಿಫಲವಾಗಿದೆ. ವಿವರಗಳನ್ನು ಪರಿಶೀಲಿಸಿ.",
    "auth.registerError": "ನೋಂದಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    "common.translationUnavailable": "ಅನುವಾದ ಲಭ್ಯವಿಲ್ಲ",
    "common.retryTranslation": "ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ",
  },
};

// Insert keys into content before `common.search` or `common.loading` for each language
for (const lang of ["en", "hi", "ta", "te", "ml", "kn"]) {
  const langKeys = newKeys[lang];
  let keyString = "";
  for (const [k, v] of Object.entries(langKeys)) {
    keyString += `    "${k}": ${JSON.stringify(v)},\n`;
  }

  // Find position in content for `common.loading` in this lang block
  const searchPattern = new RegExp(`(${lang}:\\s*\\{[\\s\\S]*?)("common\\.loading":)`);
  if (searchPattern.test(content)) {
    content = content.replace(searchPattern, `$1${keyString}$2`);
    console.log(`Updated ${lang.toUpperCase()} keys`);
  } else {
    console.warn(`Could not match language block for ${lang}`);
  }
}

fs.writeFileSync(translationsPath, content, "utf8");
console.log("✅ Successfully updated translations.js with all missing UI keys!");
