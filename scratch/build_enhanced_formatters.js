import fs from "fs";

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
    "Folic Acid": "போலிக் அமிலம்",
    "B12": "பி12",
    "Vitamin B12": "வைட்டமின் பி12",
    "Cyanocobalamin": "சயனோகோபாலமின்",
    "Antiseptic Liquid": "கிருமிநாசினி திரவம்",
    "Antiseptic": "கிருமிநாசினி",
    "Liquid": "திரவம்",
    "Syrup": "சிரப்",
    "Suspension": "சஸ்பென்ஷன்",
    "Oral Drops": "வாய்வழி சொட்டு மருந்து",
    "Fast Action": "வேகமான செயல்பாடு",
    "Caffeine": "காஃபின்",
    "Calcium": "கால்சியம்",
    "Aspirin": "ஆஸ்பிரின்",
    "Ibuprofen": "ஐபூப்ரோஃபென்",
    "Paracetamol": "பாராசிட்டமால்",
    "Chloroxylenol": "க்ளோரோசைலினால்",
    "Strip of 10 tablets": "10 மாத்திரைகள் ஸ்ட்ரிப்",
    "Strip of 15 tablets": "15 மாத்திரைகள் ஸ்ட்ரிப்",
    "Strip of 20 tablets": "20 மாத்திரைகள் ஸ்ட்ரிப்",
    "Strip of 20 capsules": "20 கேப்சூல்கள் ஸ்ட்ரிப்",
    "Bottle of 100ml": "100 மி.லி. பாட்டில்",
    "Bottle of 60ml": "60 மி.லி. பாட்டில்",
    "Bottle of 15ml": "15 மி.லி. பாட்டில்",
    "Bottle of 500ml": "500 மி.லி. பாட்டில்",
  },
  hi: {
    "Multi B-Complex": "मल्टी बी-कॉम्प्लेक्स",
    "B-Complex": "बी-कॉम्प्लेक्स",
    "Multi": "मल्टी",
    "Vit C": "विटामिन सी",
    "Vitamin C": "विटामिन सी",
    "Vit D3": "विटामिन डी3",
    "Vitamin D3": "विटामिन डी3",
    "Vit E": "विटामिन ई",
    "Vitamin E": "विटामिन ई",
    "Zinc": "जिंक",
    "Iron": "आयरन",
    "Folic Acid": "फॉलिक एसिड",
    "B12": "बी12",
    "Vitamin B12": "विटामिन बी12",
    "Antiseptic Liquid": "एंटीसेप्टिक लिक्विड",
    "Antiseptic": "एंटीसेप्टिक",
    "Liquid": "लिक्विड",
    "Syrup": "सिरप",
    "Suspension": "सस्पेंशन",
    "Fast Action": "फास्ट एक्शन",
    "Caffeine": "कैफीन",
    "Aspirin": "एस्पिरिन",
    "Chloroxylenol": "क्लोरोक्सिलीनॉल",
  },
  te: {
    "Multi B-Complex": "మల్టీ B-కాంప్లెక్స్",
    "B-Complex": "B-కాంప్లెక్స్",
    "Multi": "మల్టీ",
    "Vit C": "విటమిన్ C",
    "Vitamin C": "విటమిన్ C",
    "Zinc": "జింక్",
    "Iron": "ఐరన్",
    "B12": "B12",
    "Antiseptic Liquid": "యాంటీసెప్టిక్ లిక్విడ్",
    "Antiseptic": "యాంటీసెప్టిక్",
    "Liquid": "లిక్విడ్",
    "Syrup": "సిరప్",
    "Fast Action": "ఫాస్ట్ యాక్షన్",
    "Caffeine": "కెఫిన్",
    "Aspirin": "ఆస్పిరిన్",
  },
  ml: {
    "Multi B-Complex": "മൾട്ടി B-കോംപ്ലക്സ്",
    "B-Complex": "B-കോംപ്ലക്സ്",
    "Multi": "മൾട്ടി",
    "Vit C": "വിറ്റാമിൻ C",
    "Vitamin C": "വിറ്റാമിൻ C",
    "Zinc": "സിങ്ക്",
    "Iron": "അയൺ",
    "B12": "B12",
    "Antiseptic Liquid": "ആന്റിസെപ്റ്റിക് ലിക്വിഡ്",
    "Antiseptic": "ആന്റിസെപ്റ്റിക്",
    "Liquid": "ലിക്വിഡ്",
    "Syrup": "സിറപ്പ്",
    "Fast Action": "ഫാസ്റ്റ് ആക്ഷൻ",
    "Caffeine": "കഫീൻ",
    "Aspirin": "ആസ്പിരിൻ",
  },
  kn: {
    "Multi B-Complex": "ಮಲ್ಟಿ B-ಕಾಂಪ್ಲೆಕ್ಸ್",
    "B-Complex": "B-ಕಾಂಪ್ಲೆಕ್ಸ್",
    "Multi": "ಮಲ್ಟಿ",
    "Vit C": "ವಿಟಮಿನ್ C",
    "Vitamin C": "ವಿಟಮಿನ್ C",
    "Zinc": "ಝಿಂಕ್",
    "Iron": "ಐರನ್",
    "B12": "B12",
    "Antiseptic Liquid": "ಆಂಟಿಸೆಪ್ಟಿಕ್ ಲಿಕ್ವಿಡ್",
    "Antiseptic": "ಆಂಟಿಸೆಪ್ಟಿಕ್",
    "Liquid": "ಲಿಕ್ವಿಡ್",
    "Syrup": "ಸಿರಪ್",
    "Fast Action": "ಫಾಸ್ಟ್ ಆಕ್ಷನ್",
    "Caffeine": "ಕ್ಯಾಫೀನ್",
    "Aspirin": "ಆಸ್ಪಿರಿನ್",
  },
};

const formattersCode = `// Centralized locale-aware location, medicine, and date/time formatting system for MediBridge.

const LOCALE_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  ta: "ta-IN",
  te: "te-IN",
  ml: "ml-IN",
  kn: "kn-IN",
};

const LOCATION_MAPS = {
  ta: {
    "Sri Shakthi Hostel": "ஸ்ரீ சக்தி ஹாஸ்டல்",
    "Sri Shakthi Nagar": "ஸ்ரீ சக்தி நகர்",
    "Race Course Road": "ரேஸ் கோர்ஸ் சாலை",
    "Gandhipuram": "காந்திபுரம்",
    "RS Puram": "ஆர்.எஸ். புரம்",
    "Peelamedu": "பீளமேடு",
    "Saibaba Colony": "சாய்பாபா காலனி",
    "Sitra": "சித்ரா",
    "Trichy Road": "திருச்சி சாலை",
    "Mettupalayam Road": "மேட்டுப்பாளையம் சாலை",
    "Avinashi Road": "அவிநாசி சாலை",
    "Coimbatore": "கோயம்பத்தூர்",
    "Tamil Nadu": "தமிழ்நாடு",
    "TamilNadu": "தமிழ்நாடு",
    "TN": "தமிழ்நாடு",
    "India": "இந்தியா",
    "Near": "அருகில்",
    "Road": "சாலை",
    "Street": "தெரு",
    "Nagar": "நகர்",
    "Hostel": "ஹாஸ்டல்",
    "Colony": "காலனி",
  },
  hi: {
    "Sri Shakthi Hostel": "श्री शक्ति हॉस्टल",
    "Sri Shakthi Nagar": "श्री शक्ति नगर",
    "Race Course Road": "रेस कोर्स रोड",
    "Gandhipuram": "गांधीपुरम",
    "RS Puram": "आरएस पुरम",
    "Peelamedu": "पीलामेडू",
    "Saibaba Colony": "साईबाबा कॉलोनी",
    "Sitra": "सिट्रा",
    "Trichy Road": "त्रिची रोड",
    "Mettupalayam Road": "मेट्टुपलायम रोड",
    "Avinashi Road": "अविनाशी रोड",
    "Coimbatore": "कोयंबटूर",
    "Tamil Nadu": "तमिलनाडु",
    "TamilNadu": "तमिलनाडु",
    "TN": "तमिलनाडु",
    "India": "भारत",
    "Near": "पास",
    "Road": "रोड",
    "Street": "स्ट्रीट",
    "Nagar": "नगर",
    "Hostel": "हॉस्टल",
    "Colony": "कॉलोनी",
  },
  te: {
    "Sri Shakthi Hostel": "శ్రీ శక్తి హాస్టల్",
    "Sri Shakthi Nagar": "శ్రీ శక్తి నగర్",
    "Race Course Road": "రేస్ కోర్స్ రోడ్",
    "Gandhipuram": "గాంధీపురం",
    "RS Puram": "ఆర్‌ఎస్ పురం",
    "Peelamedu": "పీలమేడు",
    "Saibaba Colony": "సాయిబాబా కాలనీ",
    "Sitra": "సిత్రా",
    "Trichy Road": "త్రిచీ రోడ్",
    "Mettupalayam Road": "మెట్టుపాళయం రోడ్",
    "Avinashi Road": "అవినాశి రోడ్",
    "Coimbatore": "కోయంబత్తూర్",
    "Tamil Nadu": "తమిళనాడు",
    "TamilNadu": "తమిళనాడు",
    "TN": "తమిళనాడు",
    "India": "భారతదేశం",
    "Near": "సమీపంలో",
    "Road": "రోడ్",
    "Street": "వీధి",
    "Nagar": "నగర్",
  },
  ml: {
    "Sri Shakthi Hostel": "ശ്രീ ശക്തി ഹോസ്റ്റൽ",
    "Sri Shakthi Nagar": "ശ്രീ ശക്തി നഗർ",
    "Race Course Road": "റേസ് കോഴ്സ് റോഡ്",
    "Gandhipuram": "ഗാന്ധിപുരം",
    "RS Puram": "ആർഎസ് പുരം",
    "Peelamedu": "പീളമേട്",
    "Saibaba Colony": "സായിബാബ കോളനി",
    "Sitra": "സിത്ര",
    "Trichy Road": "ട്രിച്ചി റോഡ്",
    "Mettupalayam Road": "മേട്ടുപ്പാളയം റോഡ്",
    "Avinashi Road": "അവിനാശി റോഡ്",
    "Coimbatore": "കോയമ്പത്തൂർ",
    "Tamil Nadu": "തമിഴ്‌നാട്",
    "India": "ഇന്ത്യ",
  },
  kn: {
    "Sri Shakthi Hostel": "ಶ್ರೀ ಶಕ್ತಿ ಹಾಸ್ಟೆಲ್",
    "Sri Shakthi Nagar": "ಶ್ರೀ ಶಕ್ತಿ ನಗರ",
    "Race Course Road": "ರೇಸ್ ಕೋರ್ಸ್ ರಸ್ತೆ",
    "Gandhipuram": "ಗಾಂಧಿಪುರಂ",
    "RS Puram": "ಆರ್‌ಎಸ್ ಪುರಂ",
    "Peelamedu": "ಪೀಲಮೇಡು",
    "Saibaba Colony": "ಸಾಯಿಬಾಬಾ ಕಾಲೋನಿ",
    "Sitra": "ಸಿತ್ರಾ",
    "Trichy Road": "ತಿರುಚಿ ರಸ್ತೆ",
    "Mettupalayam Road": "ಮೆಟ್ಟುಪಾಳಯಂ ರಸ್ತೆ",
    "Avinashi Road": "ಅವಿನಾಶಿ ರಸ್ತೆ",
    "Coimbatore": "ಕೊಯಮತ್ತೂರು",
    "Tamil Nadu": "ತಮಿಳುನಾಡು",
    "India": "ಭಾರತ",
  },
};

const MEDICINE_BRAND_MAPS = {
  ta: {
    "Electral Powder": "எலக்ட்ரல் பவுடர்",
    "Electral Orange": "எலக்ட்ரல் ஆரஞ்சு",
    "Electral": "எலக்ட்ரல்",
    "Eno Fruit Salt Lemon": "ஈனோ ஃப்ரூட் சால்ட் லெமன்",
    "Eno Fruit Salt Regular": "ஈனோ ஃப்ரூட் சால்ட் ரெகுலர்",
    "Eno Fruit Salt Orange": "ஈனோ ஃப்ரூட் சால்ட் ஆரஞ்சு",
    "Eno": "ஈனோ",
    "Evion 400": "எவியான் 400",
    "Evion": "எவியான்",
    "Foracort 200 Inhaler": "ஃபோராகார்ட் 200 இன்ஹேலர்",
    "Foracort 200": "ஃபோராகார்ட் 200",
    "Foracort": "ஃபோராகார்ட்",
    "Glycomet-SR 500": "கிளைகோமெட்-எஸ்ஆர் 500",
    "Glycomet SR 500": "கிளைகோமெட் எஸ்ஆர் 500",
    "Glycomet": "கிளைகோமெட்",
    "Moov Pain Relief Cream": "மூவ் பெயின் ரிலீஃப் க்ரீம்",
    "Moov Spray": "மூவ் ஸ்ப்ரே",
    "Moov": "மூவ்",
    "Neurobion Forte": "நியூரோபியான் ஃபோர்ட்டே",
    "Neurobion": "நியூரோபியான்",
    "Becosules Capsules": "பெகோசுல்ஸ் கேப்சூல்ஸ்",
    "Becosules Z": "பெகோசுல்ஸ் இசட்",
    "Becosules Syrup": "பெகோசுல்ஸ் சிரப்",
    "Becosules": "பெகோசுல்ஸ்",
    "Betadine 5% Ointment": "பெட்டாடின் 5% ஆயில்மென்ட்",
    "Betadine": "பெட்டாடின்",
    "Crocin 500": "க்ரோசின் 500",
    "Crocin Advance": "க்ரோசின் அட்வான்ஸ்",
    "Crocin 650": "க்ரோசின் 650",
    "Crocin Drops": "க்ரோசின் சொட்டு மருந்து",
    "Crocin": "க்ரோசின்",
    "Dolo 650": "டோலோ 650",
    "Dolo 500": "டோலோ 500",
    "Dolo Drops": "டோலோ சொட்டு மருந்து",
    "Dolo": "டோலோ",
    "Calpol 500": "கால்போல் 500",
    "Calpol 650": "கால்போல் 650",
    "Calpol": "கால்போல்",
    "Azithral 500 Tablet": "அசித்ரால் 500 மாத்திரை",
    "Azithral": "அசித்ரால்",
    "Dettol Antiseptic Liquid": "டெட்டால் கிருமிநாசினி திரவம்",
    "Dettol Antiseptic": "டெட்டால் கிருமிநாசினி",
    "Dettol": "டெட்டால்",
    "Ecosprin 75": "ஈகோஸ்ப்ரின் 75",
    "Ecosprin 150": "ஈகோஸ்ப்ரின் 150",
    "Ecosprin": "ஈகோஸ்ப்ரின்",
    "Combiflam": "காம் பிஃபிளாம்",
    "Combiflam Plus": "காம் பிஃபிளாம் பிளஸ்",
    "Brufen 400": "புரூஃபென் 400",
    "Brufen": "புரூஃபென்",
  },
  hi: {
    "Electral Powder": "इलेक्ट्रल पाउडर",
    "Electral Orange": "इलेक्ट्रल ऑरेंज",
    "Electral": "इलेक्ट्रल",
    "Eno Fruit Salt Lemon": "ईनो फ्रूट साल्ट लेमन",
    "Eno Fruit Salt Regular": "ईनो फ्रूट साल्ट रेगुलर",
    "Eno": "ईनो",
    "Evion 400": "एवियन 400",
    "Evion": "एवियन",
    "Foracort 200 Inhaler": "फोराकोर्ट 200 इनहेलर",
    "Foracort": "फोराकोर्ट",
    "Glycomet-SR 500": "ग्लाइकोमेट-एसआर 500",
    "Glycomet": "ग्लाइकोमेट",
    "Moov Pain Relief Cream": "मूव पेन रिलीफ क्रीम",
    "Moov": "मूव",
    "Neurobion Forte": "न्यूरोबियन फोर्ट",
    "Neurobion": "न्यूरोबियन",
    "Becosules Capsules": "बीकोसूल्स कैप्सूल",
    "Becosules Z": "बीकोसूल्स जेड",
    "Becosules": "बीकोसूल्स",
    "Betadine 5% Ointment": "बिटाडिन 5% ऑइंटमेंट",
    "Betadine": "बिटाडिन",
    "Crocin 500": "क्रोसिन 500",
    "Crocin": "क्रोसिन",
    "Dolo 650": "डोलो 650",
    "Dolo": "डोलो",
    "Calpol 500": "कालपोल 500",
    "Calpol": "कालपोल",
    "Azithral": "अजिथ्राल",
    "Dettol Antiseptic Liquid": "डेटोल एंटीसेप्टिक लिक्विड",
    "Dettol": "डेटोल",
    "Ecosprin 75": "इकोस्पिरिन 75",
    "Ecosprin": "इकोस्पिरिन",
    "Combiflam": "कॉम्बीफ्लाम",
  },
  te: {
    "Electral Powder": "ఎలక్ట్రాల్ పౌడర్",
    "Electral": "ఎలక్ట్రాల్",
    "Eno Fruit Salt Lemon": "ఈనో ఫ్రూట్ సాల్ట్ లెమన్",
    "Eno": "ఈనో",
    "Evion 400": "ఎవియాన్ 400",
    "Evion": "ఎవియాన్",
    "Foracort 200 Inhaler": "ఫోరాకార్ట్ 200 ఇన్హేలర్",
    "Foracort": "ఫోరాకార్ట్",
    "Glycomet-SR 500": "గ్లైకోమెట్-ఎస్‌ఆర్ 500",
    "Glycomet": "గ్లైకోమెట్",
    "Moov Pain Relief Cream": "మూవ్ పెయిన్ రిలీఫ్ క్రీమ్",
    "Moov": "మూవ్",
    "Neurobion Forte": "న్యూరోబియాన్ ఫోర్ట్",
    "Neurobion": "న్యూరోబియాన్",
    "Becosules Capsules": "బెకోసల్స్ క్యాప్సూల్స్",
    "Becosules": "బెకోసల్స్",
    "Betadine": "బెటాడిన్",
    "Crocin": "క్రోసిన్",
    "Dolo 650": "డోలో 650",
    "Dolo": "డోలో",
    "Calpol": "కాల్పోల్",
    "Dettol Antiseptic Liquid": "డెట్టాల్ యాంటీసెప్టిక్ లిక్విడ్",
    "Dettol": "డెట్టాల్",
    "Ecosprin 75": "ఈకోస్ప్రిన్ 75",
    "Ecosprin": "ఈకోస్ప్రిన్",
  },
  ml: {
    "Electral Powder": "ഇലക്ട്രൽ പൗഡർ",
    "Electral": "ഇലക്ട്രൽ",
    "Eno Fruit Salt Lemon": "ഈനോ ഫ്രൂട്ട് സാൾട്ട് ലെമൺ",
    "Eno": "ഈനോ",
    "Evion 400": "എവിയോൺ 400",
    "Evion": "എവിയോൺ",
    "Foracort 200 Inhaler": "ഫോറാകോർട്ട് 200 ഇൻഹേലർ",
    "Foracort": "ഫോറാകോർട്ട്",
    "Glycomet-SR 500": "ഗ്ലൈക്കോമെറ്റ്-എസ്ആർ 500",
    "Glycomet": "ഗ്ലൈക്കോമെറ്റ്",
    "Moov Pain Relief Cream": "മൂവ് പെയ്ൻ റിലീഫ് ക്രീം",
    "Moov": "മൂവ്",
    "Neurobion Forte": "ന്യൂറോബിയോൺ ഫോർട്ട്",
    "Neurobion": "ന്യൂറോബിയോൺ",
    "Becosules Capsules": "ബെക്കോസൂൾസ് ക്യാപ്സൂളുകൾ",
    "Becosules": "ബെക്കോസൂൾസ്",
    "Betadine": "ബെറ്റാഡിൻ",
    "Crocin": "ക്രോസിൻ",
    "Dolo": "ഡോളോ",
    "Calpol": "കാൽപോൾ",
    "Dettol Antiseptic Liquid": "ഡെറ്റോൾ ആന്റിസെപ്റ്റിക് ലിക്വിഡ്",
    "Dettol": "ഡെറ്റോൾ",
    "Ecosprin 75": "ഇക്കോസ്പ്രിൻ 75",
    "Ecosprin": "ഇക്കോസ്പ്രിൻ",
  },
  kn: {
    "Electral Powder": "ಎಲೆಕ್ಟ್ರಾಲ್ ಪೌಡರ್",
    "Electral": "ಎಲೆಕ್ಟ್ರಾಲ್",
    "Eno Fruit Salt Lemon": "ಈನೋ ಫ್ರೂಟ್ ಸಾಲ್ಟ್ ಲೆಮನ್",
    "Eno": "ಈನೋ",
    "Evion 400": "ಎವಿಯಾನ್ 400",
    "Evion": "ಎವಿಯಾನ್",
    "Foracort 200 Inhaler": "ಫೊರಾಕಾರ್ಟ್ 200 ಇನ್ಹೇಲರ್",
    "Foracort": "ಫೊರಾಕಾರ್ಟ್",
    "Glycomet-SR 500": "ಗ್ಲೈಕೋಮೆಟ್-ಎಸ್‌ಆರ್ 500",
    "Glycomet": "ಗ್ಲೈಕೋಮೆಟ್",
    "Moov Pain Relief Cream": "ಮೂವ್ ಪೇನ್ ರಿಲೀಫ್ ಕ್ರೀಮ್",
    "Moov": "ಮೂವ್",
    "Neurobion Forte": "ನ್ಯೂರೋಬಿಯಾನ್ ಫೋರ್ಟೆ",
    "Neurobion": "ನ್ಯೂರೋಬಿಯಾನ್",
    "Becosules Capsules": "ಬೆಕೋಸುಲ್ಸ್ ಕ್ಯಾಪ್ಸುಲ್ಗಳು",
    "Becosules": "ಬೆಕೋಸುಲ್ಸ್",
    "Betadine": "ಬೆಟಾಡಿನ್",
    "Crocin": "ಕ್ರೋಸಿನ್",
    "Dolo": "ಡೋಲೋ",
    "Dettol Antiseptic Liquid": "ಡೆಟಾಲ್ ಆಂಟಿಸೆಪ್ಟಿಕ್ ಲಿಕ್ವಿಡ್",
    "Dettol": "ಡೆಟಾಲ್",
    "Ecosprin 75": "ಇಕೋಸ್ಪ್ರಿನ್ 75",
    "Ecosprin": "ಇಕೋಸ್ಪ್ರಿನ್",
  },
};

const GENERIC_NAME_MAPS = {
  ta: {
    "Oral Rehydration Salts (WHO Formula)": "வாய்வழி நீர்சத்து உப்புகள் (WHO ஃபார்முலா)",
    "Oral Rehydration Salts": "வாய்வழி நீர்சத்து உப்புகள்",
    "ORS (Oral Rehydration Salts)": "ஓ.ஆர்.எஸ் (வாய்வழி நீர்சத்து உப்புகள்)",
    "Magaldrate + Simethicone": "மகால்ட்ரேட் + சிமெதிகோன்",
    "Sorbitol + Acid Citric": "சார்பிட்டால் + சிட்ரிக் அமிலம்",
    "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate": "அன்ஹைட்ரஸ் சிட்ரிக் அமிலம் + சோடியம் பைகார்பனேட் + சோடியம் கார்பனேட்",
    "Vitamin E (Tocopheryl Acetate)": "வைட்டமின் ஈ (டோகோஃபெரைல் அசிடேட்)",
    "Tocopheryl Acetate 400mg": "டோகோஃபெரைல் அசிடேட் 400 மி.கி.",
    "Tocopheryl Acetate": "டோகோஃபெரைல் அசிடேட்",
    "Formoterol + Budesonide": "ஃபார்மோட்டரால் + புடசோனைட்",
    "Formoterol Fumarate + Budesonide": "ஃபார்மோட்டரால் ஃபியூமரேட் + புடசோனைட்",
    "Metformin Hydrochloride": "மெட்ஃபோர்மின் ஹைட்ரோகுளோரைடு",
    "Metformin (Sustained Release)": "மெட்ஃபோர்மின் (நீடித்த வெளியீடு)",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "டர்பென்டைன் எண்ணெய் + நீலகிரி எண்ணெய் + வின்டர்கிரீன் எண்ணெய்",
    "Ayurvedic Pain Relief Formula": "ஆயுர்வேத வலி நிவாரண ஃபார்முலா",
    "Vitamin B-Complex + Cyanocobalamin": "வைட்டமின் பி-காம்ப்ளக்ஸ் + சயனோகோபாலமின்",
    "Vitamin B-Complex + Zinc": "வைட்டமின் பி-காம்ப்ளக்ஸ் + துத்தநாகம்",
    "Vitamin B-Complex with Vitamin C & Zinc": "வைட்டமின் பி-காம்ப்ளக்ஸ், வைட்டமின் சி & துத்தநாகம்",
    "Vitamin B1 + B6 + B12": "வைட்டமின் பி1 + பி6 + பி12",
    "Iron + Folic Acid + Cyanocobalamin": "இரும்புச்சத்து + போலிக் அமிலம் + சயனோகோபாலமின்",
    "Iron + Folic Acid": "இரும்புச்சத்து + போலிக் அமிலம்",
    "Iron + B12": "இரும்புச்சத்து + பி12",
    "Chloroxylenol": "க்ளோரோசைலினால்",
    "Aspirin": "ஆஸ்பிரின்",
    "Diclofenac Sodium": "டைக்ளோஃபெனாக் சோடியம்",
    "Aceclofenac + Paracetamol": "அசெக்லோஃபெனாக் + பாராசிட்டமால்",
    "Ibuprofen + Paracetamol": "ஐபூப்ரோஃபென் + பாராசிட்டமால்",
    "Ibuprofen + Caffeine": "ஐபூப்ரோஃபென் + காஃபின்",
    "Calcium + Vitamin D3": "கால்சியம் + வைட்டமின் டி3",
    "Pantoprazole": "பான்டோபிரசோல்",
    "Azithromycin": "அசித்ரோமைசின்",
    "Povidone Iodine": "பொவிடோன் அயோடின்",
    "Povidone-Iodine": "பொவிடோன் அயோடின்",
    "Paracetamol": "பாராசிட்டமால்",
  },
  hi: {
    "Oral Rehydration Salts (WHO Formula)": "ओरल रीहाइड्रेशन साल्ट्स (डब्ल्यूएचओ फॉर्मूला)",
    "Oral Rehydration Salts": "ओरल रीहाइड्रेशन साल्ट्स",
    "ORS (Oral Rehydration Salts)": "ओआरएस (ओरल रीहाइड्रेशन साल्ट्स)",
    "Magaldrate + Simethicone": "मैगाल्ड्रेट + सिमेथिकोन",
    "Anhydrous Citric Acid + Sodium Bicarbonate + Sodium Carbonate": "अनहाइड्रस साइट्रिक एसिड + सोडियम बाइकार्बोनेट + सोडियम कार्बोनेट",
    "Vitamin E (Tocopheryl Acetate)": "विटामिन ई (टोकोफेराइल एसीटेट)",
    "Tocopheryl Acetate": "टोकोफेराइल एसीटेट",
    "Formoterol + Budesonide": "फॉर्मोटेरोल + बुडेसोनाइड",
    "Metformin Hydrochloride": "मेटफॉर्मिन हाइड्रोक्लोराइड",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "तारपीन का तेल + नीलगिरी तेल + विंटरग्रीन तेल",
    "Vitamin B-Complex + Cyanocobalamin": "विटामिन बी-कॉम्प्लेक्स + सायनोकोबालामिन",
    "Vitamin B-Complex + Zinc": "विटामिन बी-कॉम्प्लेक्स + जिंक",
    "Vitamin B-Complex with Vitamin C & Zinc": "विटामिन बी-कॉम्प्लेक्स, विटामिन सी एवं जिंक",
    "Chloroxylenol": "क्लोरोक्सिलीनॉल",
    "Aspirin": "एस्पिरिन",
    "Paracetamol": "पैरासिटामोल",
    "Azithromycin": "अजिथ्रोमाइसिन",
    "Povidone-Iodine": "पोवीडोन-आयोडीन",
  },
  te: {
    "Oral Rehydration Salts (WHO Formula)": "ఓరల్ రీహైడ్రేషన్ సాల్ట్స్ (WHO ఫార్ములా)",
    "Oral Rehydration Salts": "ఓరల్ రీహైడ్రేషన్ సాల్ట్స్",
    "Magaldrate + Simethicone": "మగాల్డ్రేట్ + సిమెథికోన్",
    "Vitamin E (Tocopheryl Acetate)": "విటమిన్ E (టోకోఫెరిల్ ఎసిటేట్)",
    "Formoterol + Budesonide": "ఫార్మోటెరాల్ + బుడెసోనైడ్",
    "Metformin Hydrochloride": "మెట్‌ఫార్మిన్ హైడ్రోక్లోరైడ్",
    "Vitamin B-Complex + Cyanocobalamin": "విటమిన్ B-కాంప్లెక్స్ + సయనోకోబాలమిన్",
    "Vitamin B-Complex + Zinc": "విటమిన్ B-కాంప్లెక్స్ + జింక్",
    "Chloroxylenol": "క్లోరోక్సైలినాల్",
    "Aspirin": "ఆస్పిరిన్",
    "Paracetamol": "పారాసిటమాల్",
  },
  ml: {
    "Oral Rehydration Salts (WHO Formula)": "ഓറൽ റീഹൈഡ്രേഷൻ സാൾട്ട്സ് (WHO ഫോർമുല)",
    "Oral Rehydration Salts": "ഓറൽ റീഹൈഡ്രേഷൻ സാൾട്ട്സ്",
    "Magaldrate + Simethicone": "മഗാൽഡ്രേറ്റ് + സിമെത്തിക്കോൺ",
    "Vitamin E (Tocopheryl Acetate)": "വിറ്റാമിൻ E (ടോകോഫെറിൽ അസറ്റേറ്റ്)",
    "Formoterol + Budesonide": "ഫോർമോട്ടെറോൾ + ബുഡെസോനൈഡ്",
    "Metformin Hydrochloride": "മെറ്റ്ഫോർമിൻ ഹൈഡ്രോക്ലോറൈഡ്",
    "Vitamin B-Complex + Cyanocobalamin": "വിറ്റാമിൻ B-കോംപ്ലക്സ് + സയനോകോബാലമിൻ",
    "Vitamin B-Complex + Zinc": "വിറ്റാമിൻ B-കോംപ്ലക്സ് + സിങ്ക്",
    "Chloroxylenol": "ക്ലോറോക്സൈലിനോൾ",
    "Aspirin": "ആസ്പിരിൻ",
    "Paracetamol": "പാരസെറ്റമോൾ",
  },
  kn: {
    "Oral Rehydration Salts (WHO Formula)": "ఓరల్ റീഹൈഡ്രേഷൻ സാൾട്ട്സ് (WHO ഫോർമുല)",
    "Oral Rehydration Salts": "ಓರಲ್ రీಹೈಡ್ರೇಷನ್ ಸಾಲ್ಟ್ಸ್",
    "Magaldrate + Simethicone": "ಮಗಾಲ್ಡ್ರೇಟ್ + ಸಿಮೆಥಿಕೋನ್",
    "Vitamin E (Tocopheryl Acetate)": "ವಿಟಮಿನ್ E (ಟೋಕೋಫೆರಿಲ್ ಅಸಿಟೇಟ್)",
    "Formoterol + Budesonide": "ಫಾರ್ಮೋಟೆರಾಲ್ + ಬುಡೆಸೊನೈಡ್",
    "Metformin Hydrochloride": "ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಹೈಡ್ರೋಕ್ಲೋರೈಡ್",
    "Vitamin B-Complex + Cyanocobalamin": "ವಿಟಮಿನ್ B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ಸಯನೋಕೋಬಾಲಮಿನ್",
    "Vitamin B-Complex + Zinc": "ವಿಟಮಿನ್ B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ಝಿಂಕ್",
    "Chloroxylenol": "ಕ್ಲೋರೋಕ್ಸೈಲಿನಾಲ್",
    "Aspirin": "ಆಸ್ಪಿರಿನ್",
    "Paracetamol": "ಪ್ಯಾರಾಸಿಟಮಾಲ್",
  },
};

const MANUFACTURER_MAPS = {
  ta: {
    "FDC Limited": "எஃப்டிசி லிமிடெட்",
    "FDC Ltd": "எஃப்டிசி லிமிடெட்",
    "GSK": "ஜிஎஸ்கே",
    "GlaxoSmithKline": "கிளாக்சோஸ்மித்க்லைன்",
    "Merck / P&G Health": "மெர்க் / பி&ஜி ஹெல்த்",
    "P&G Health": "பி&ஜி ஹெல்த்",
    "Merck": "மெர்க்",
    "Cipla": "சிப்ளா",
    "Cipla Ltd": "சிப்ளா லிமிடெட்",
    "USV Private Limited": "யுஎஸ்வி பிரைவேட் லிமிடெட்",
    "USV Ltd": "யுஎஸ்வி லிமிடெட்",
    "Reckitt Benckiser": "ரெக்கிட் பென்கிசர்",
    "Pfizer": "ஃபைசர்",
    "Win-Medicare": "வின்-மெடிகேர்",
    "Alembic": "அலெம்பிக்",
    "Sun Pharma": "சன் ஃபார்மா",
    "Dr. Reddy's": "டாக்டர் ரெட்டீஸ்",
    "Lupin": "லூபின்",
    "Mankind": "மேன்கைண்ட்",
    "Torrent Pharma": "டாரன்ட் ஃபார்மா",
    "Abbott": "அபாட்",
    "Sanofi India": "சனோஃபி இந்தியா",
    "Micro Labs": "மைக்ரோ லேப்ஸ்",
    "Reckitt Benckiser Group": "ரெக்கிட் பென்கிசர் குரூப்",
  },
  hi: {
    "FDC Limited": "एफडीसी लिमिटेड",
    "GSK": "जीएसके",
    "P&G Health": "पीएंडजी हेल्थ",
    "Cipla": "सिप्ला",
    "USV Private Limited": "यूएसवी प्राइवेट लिमिटेड",
    "Reckitt Benckiser": "रेकिट बेंकिज़र",
    "Pfizer": "फाइजर",
    "Micro Labs": "माइक्रो लैब्स",
  },
  te: {
    "FDC Limited": "ఎఫ్‌డిసి లిమిటెడ్",
    "GSK": "జీఎస్‌కే",
    "P&G Health": "పి&జి హెల్త్",
    "Cipla": "సిప్లా",
    "USV Private Limited": "యుఎస్‌వి ప్రైవేట్ లిమిటెడ్",
    "Pfizer": "ఫైజర్",
  },
  ml: {
    "FDC Limited": "എഫ്‌ഡിസി ലിമിറ്റഡ്",
    "GSK": "ജിഎസ്കെ",
    "P&G Health": "പി&ജി ഹെൽത്ത്",
    "Cipla": "സിപ്ല",
    "USV Private Limited": "യുഎസ്വി പ്രൈവറ്റ് ലിമിറ്റഡ്",
    "Pfizer": "ഫൈസർ",
  },
  kn: {
    "FDC Limited": "ಎಫ್‌ಡಿಸಿ ಲಿಮಿಟೆಡ್",
    "GSK": "ಜಿಎಸ್‌ಕೆ",
    "P&G Health": "ಪಿ&ಜಿ ಹೆಲ್ತ್",
    "Cipla": "ಸಿಪ್ಲಾ",
    "USV Private Limited": "ಯುಎಸ್‌ವಿ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್",
    "Pfizer": "ಫೈಜರ್",
  },
};

const STRENGTH_MAPS = {
  ta: {
    "Multi B-Complex+Vit C": "மல்டி பி-காம்ப்ளக்ஸ் + வைட்டமின் சி",
    "B-Complex+Vit C+Zinc": "பி-காம்ப்ளக்ஸ் + வைட்டமின் சி + துத்தநாகம்",
    "Multi B-Complex + Vit C": "மல்டி பி-காம்ப்ளக்ஸ் + வைட்டமின் சி",
    "B-Complex + Vit C + Zinc": "பி-காம்ப்ளக்ஸ் + வைட்டமின் சி + துத்தநாகம்",
    "Antiseptic Liquid": "கிருமிநாசினி திரவம்",
    "Antiseptic": "கிருமிநாசினி",
    "Iron+B12 (200ml)": "இரும்புச்சத்து + பி12 (200 மி.லி.)",
    "Iron + B12 (200ml)": "இரும்புச்சத்து + பி12 (200 மி.லி.)",
    "500mg Fast Action": "500 மி.கி. வேகமான செயல்பாடு",
    "400mg+325mg": "400 மி.கி. + 325 மி.கி.",
    "Ibuprofen+Caffeine": "ஐபூப்ரோஃபென் + காஃபின்",
    "500mg": "500 மி.கி.",
    "650mg": "650 மி.கி.",
    "400mg": "400 மி.கி.",
    "250mg": "250 மி.கி.",
    "120mg": "120 மி.கி.",
    "75mg": "75 மி.கி.",
    "150mg": "150 மி.கி.",
    "10mg": "10 மி.கி.",
    "5mg": "5 மி.கி.",
    "20mg": "20 மி.கி.",
    "40mg": "40 மி.கி.",
    "200mcg": "200 எம்.சி.ஜி",
    "500mg SR": "500 மி.கி. எஸ்.ஆர்",
    "21.8g sachet": "21.8 கிராம் சாஷே",
    "5g sachet": "5 கிராம் சாஷே",
    "50g tube": "50 கிராம் டியூப்",
    "50g": "50 கிராம்",
    "10ml": "10 மி.லி.",
    "100ml": "100 மி.லி.",
    "200ml": "200 மி.லி.",
    "500ml": "500 மி.லி.",
    "5% w/w": "5% w/w",
    "Standard": "தரநிலையானது",
    "Standard Strength": "தரநிலையான அளவு",
  },
  hi: {
    "Multi B-Complex+Vit C": "मल्टी बी-कॉम्प्लेक्स + विटामिन सी",
    "B-Complex+Vit C+Zinc": "बी-कॉम्प्लेक्स + विटामिन सी + जिंक",
    "Multi B-Complex + Vit C": "मल्टी बी-कॉम्प्लेक्स + विटामिन सी",
    "Antiseptic Liquid": "एंटीसेप्टिक लिक्विड",
    "Antiseptic": "एंटीसेप्टिक",
    "Iron+B12 (200ml)": "आयरन + बी12 (200 मि.ली.)",
    "500mg Fast Action": "500 मि.ग्रा. फास्ट एक्शन",
    "500mg": "500 मि.ग्रा.",
    "650mg": "650 मि.ग्रा.",
    "400mg": "400 मि.ग्रा.",
    "75mg": "75 मि.ग्रा.",
    "250mg": "250 मि.ग्रा.",
    "200mcg": "200 एमसीजी",
    "500mg SR": "500 मि.ग्रा. एसआर",
    "21.8g sachet": "21.8 ग्राम सैशे",
    "5g sachet": "5 ग्राम सैशे",
    "50g tube": "50 ग्राम ट्यूब",
    "Standard": "मानक",
    "Standard Strength": "मानक खुराक",
  },
  te: {
    "Multi B-Complex+Vit C": "మల్టీ B-కాంప్లెక్స్ + విటమిన్ C",
    "B-Complex+Vit C+Zinc": "B-కాంప్లెక్స్ + విటమిన్ C + జింక్",
    "Antiseptic Liquid": "యాంటీసెప్టిక్ లిక్విడ్",
    "Antiseptic": "యాంటీసెప్టిక్",
    "500mg": "500 మి.గ్రా.",
    "650mg": "650 మి.గ్రా.",
    "400mg": "400 మి.గ్రా.",
    "75mg": "75 మి.గ్రా.",
    "200mcg": "200 ఎంసిజి",
  },
  ml: {
    "Multi B-Complex+Vit C": "മൾട്ടി B-കോംപ്ലക്സ് + വിറ്റാമിൻ C",
    "B-Complex+Vit C+Zinc": "B-കോംപ്ലക്സ് + വിറ്റാമിൻ C + സിങ്ക്",
    "Antiseptic Liquid": "ആന്റിസെപ്റ്റിക് ലിക്വിഡ്",
    "Antiseptic": "ആന്റിസെപ്റ്റിക്",
    "500mg": "500 മി.ഗ്രാം.",
    "650mg": "650 മി.ഗ്രാം.",
    "400mg": "400 മി.ഗ്രാം.",
    "75mg": "75 മി.ഗ്രാം.",
    "200mcg": "200 എം.സി.ജി",
  },
  kn: {
    "Multi B-Complex+Vit C": "ಮಲ್ಟಿ B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ವಿಟಮಿನ್ C",
    "B-Complex+Vit C+Zinc": "B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ವಿಟಮಿನ್ C + ಝಿಂಕ್",
    "Antiseptic Liquid": "ಆಂಟಿಸೆಪ್ಟಿಕ್ ಲಿಕ್ವಿಡ್",
    "Antiseptic": "ಆಂಟಿಸೆಪ್ಟಿಕ್",
    "500mg": "500 ಮಿ.ಗ್ರಾಂ.",
    "650mg": "650 ಮಿ.ಗ್ರಾಂ.",
    "400mg": "400 ಮಿ.ಗ್ರಾಂ.",
    "75mg": "75 ಮಿ.ಗ್ರಾಂ.",
    "200mcg": "200 ಎಂ.ಸಿ.ಜಿ",
  },
};

const PACK_SIZE_MAPS = {
  ta: {
    "10 tablets": "10 மாத்திரைகள்",
    "15 tablets": "15 மாத்திரைகள்",
    "20 tablets": "20 மாத்திரைகள்",
    "10 capsules": "10 கேப்சூல்கள்",
    "20 capsules": "20 கேப்சூல்கள்",
    "Strip of 15 tablets": "15 மாத்திரைகள் ஸ்ட்ரிப்",
    "Strip of 20 tablets": "20 மாத்திரைகள் ஸ்ட்ரிப்",
    "Strip of 20 capsules": "20 கேப்சூல்கள் ஸ்ட்ரிப்",
    "Bottle of 100ml": "100 மி.லி. பாட்டில்",
    "Bottle of 200ml": "200 மி.லி. பாட்டில்",
    "Bottle of 500ml": "500 மி.லி. பாட்டில்",
    "1 sachet": "1 சாஷே",
    "1 inhaler": "1 இன்ஹேலர்",
    "1 tube": "1 டியூப்",
    "1 bottle": "1 பாட்டில்",
  },
  hi: {
    "10 tablets": "10 टैबलेट",
    "15 tablets": "15 टैबलेट",
    "10 capsules": "10 कैप्सूल",
    "1 sachet": "1 सैशे",
    "1 inhaler": "1 इनहेलर",
    "1 tube": "1 ट्यूब",
  },
};

const DOSAGE_FORM_MAPS = {
  ta: {
    "Tablet": "மாத்திரை",
    "Tablets": "மாத்திரைகள்",
    "Capsule": "கேப்சூல்",
    "Capsules": "கேப்சூல்கள்",
    "Powder": "பவுடர்",
    "Sachet": "சாஷே",
    "Inhaler": "இன்ஹேலர்",
    "Cream": "க்ரீம்",
    "Ointment": "ஆயில்மென்ட்",
    "Syrup": "சிரப்",
    "Gel": "ஜெல்",
    "Spray": "ஸ்ப்ரே",
    "Injection": "ஊசி",
    "Drops": "சொட்டு மருந்து",
    "Liquid": "திரவம்",
    "Suspension": "சஸ்பென்ஷன்",
  },
  hi: {
    "Tablet": "टैबलेट",
    "Tablets": "टैबलेट्स",
    "Capsule": "कैप्सूल",
    "Capsules": "कैप्सूल",
    "Powder": "पाउडर",
    "Sachet": "सैशे",
    "Inhaler": "इनहेलर",
    "Cream": "क्रीम",
    "Ointment": "ऑइंटमेंट",
    "Syrup": "सिरप",
    "Gel": "जेल",
    "Liquid": "लिक्विड",
  },
  te: {
    "Tablet": "టాబ్లెట్",
    "Capsule": "క్యాప్సూల్",
    "Powder": "పౌడర్",
    "Inhaler": "ఇన్హేలర్",
    "Cream": "క్రీమ్",
    "Ointment": "ఆయింట్మెంట్",
    "Liquid": "లిక్విడ్",
  },
  ml: {
    "Tablet": "ടാബ്‌ലെറ്റ്",
    "Capsule": "ക്യാപ്സൂൾ",
    "Powder": "പൗഡർ",
    "Inhaler": "ഇൻഹേലർ",
    "Cream": "ക്രീം",
    "Ointment": "ഓയിന്റ്മെന്റ്",
    "Liquid": "ലിക്വിഡ്",
  },
  kn: {
    "Tablet": "ಟ್ಯಾಬ್ಲೆಟ್",
    "Capsule": "ಕ್ಯಾಪ್ಸುಲ್",
    "Powder": "ಪೌಡರ್",
    "Inhaler": "ಇನ್ಹೇಲರ್",
    "Cream": "ಕ್ರೀಮ್",
    "Ointment": "ಆಯಿಂಟ್‌ಮೆಂಟ್",
    "Liquid": "ಲಿಕ್ವಿಡ್",
  },
};

const SENTENCE_MAPS = {};

export function formatCompositionPhrase(phrase, langCode = "en") {
  if (!phrase || langCode === "en") return phrase || "";
  const map = COMPOSITION_TERM_MAPS[langCode];
  if (!map) return phrase;

  if (map[phrase]) return map[phrase];

  let result = String(phrase);

  // If compound phrase with +, split by +
  if (result.includes("+")) {
    const parts = result.split("+").map((p) => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" + ");
  }

  // If compound phrase with /, split by /
  if (result.includes("/")) {
    const parts = result.split("/").map((p) => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" / ");
  }

  // Replace individual known terms from largest key to smallest
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.includes(key)) {
      const regex = new RegExp(\`\\\\b\${key.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}\\\\b\`, "gi");
      result = result.replace(regex, map[key]);
    }
  }

  return result;
}

export function formatDate(dateVal, languageCode = "en") {
  if (!dateVal) return "";
  try {
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return String(dateVal);
    const locale = LOCALE_MAP[languageCode] || "en-IN";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (e) {
    return String(dateVal);
  }
}

export function formatDateTime(dateVal, languageCode = "en") {
  if (!dateVal) return "";
  try {
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return String(dateVal);
    const locale = LOCALE_MAP[languageCode] || "en-IN";
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  } catch (e) {
    return String(dateVal);
  }
}

export function formatTravelTime(travelTime, t) {
  if (!travelTime) return "";
  if (typeof travelTime === "object") {
    const drive = travelTime.drive ? formatTravelTime(travelTime.drive, t) : "";
    const walk = travelTime.walk ? formatTravelTime(travelTime.walk, t) : "";
    return { drive, walk };
  }

  const str = String(travelTime);
  const match = str.match(/(\\d+)\\s*min\\s*(drive|walk)/i);
  if (match) {
    const count = match[1];
    const mode = match[2].toLowerCase();
    if (mode === "drive") {
      return t("pharmacy.driveTime", { count });
    }
    if (mode === "walk") {
      return t("pharmacy.walkTime", { count });
    }
  }
  return str;
}

export function formatAddress(addressText, tOrLang, t) {
  if (!addressText) return "";
  let lang = typeof tOrLang === "string" ? tOrLang : "en";
  if (typeof tOrLang === "function" && !t) {
    t = tOrLang;
  }

  let result = String(addressText);

  if (t && typeof t === "function") {
    const key = \`address.\${result}\`;
    const translated = t(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  const map = LOCATION_MAPS[lang];
  if (map) {
    Object.keys(map).forEach((term) => {
      const regex = new RegExp(\`\\\\b\${term}\\\\b\`, "gi");
      result = result.replace(regex, map[term]);
    });
  }

  return result;
}

export function formatCityName(city, languageCode = "en") {
  if (!city) return "";
  const map = LOCATION_MAPS[languageCode];
  return map?.[city] || city;
}

export function formatStateName(state, languageCode = "en") {
  if (!state) return "";
  const map = LOCATION_MAPS[languageCode];
  return map?.[state] || state;
}

export function formatLocationName(name, languageCode = "en") {
  if (!name) return "";
  const map = LOCATION_MAPS[languageCode];
  return map?.[name] || name;
}

export function formatInstitutionName(name, t) {
  if (!name) return "";
  if (t && typeof t === "function") {
    const key = \`hospital.name.\${name}\`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return name;
}

export function formatPharmacyName(name, t) {
  if (!name) return "";
  if (t && typeof t === "function") {
    const key = \`pharmacy.name.\${name}\`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return name;
}

export function formatHospitalName(name, t) {
  return formatInstitutionName(name, t);
}

export function formatBrandName(brandName, langCode = "en") {
  if (!brandName || langCode === "en") return brandName || "";
  const map = MEDICINE_BRAND_MAPS[langCode];
  if (!map) return brandName;
  if (map[brandName]) return map[brandName];

  const lowerBrand = String(brandName).toLowerCase();
  const exactKey = Object.keys(map).find((k) => k.toLowerCase() === lowerBrand);
  if (exactKey) return map[exactKey];

  let result = String(brandName);
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.toLowerCase().includes(key.toLowerCase())) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "gi");
      result = result.replace(regex, map[key]);
    }
  }
  return result;
}

export function formatGenericName(genericName, langCode = "en") {
  if (!genericName || langCode === "en") return genericName || "";
  const map = GENERIC_NAME_MAPS[langCode];
  if (map && map[genericName]) return map[genericName];

  const lowerGen = String(genericName).toLowerCase();
  const exactKey = map ? Object.keys(map).find((k) => k.toLowerCase() === lowerGen) : null;
  if (exactKey) return map[exactKey];

  return formatCompositionPhrase(genericName, langCode);
}

export function formatManufacturer(mfg, langCode = "en") {
  if (!mfg || langCode === "en") return mfg || "";
  const map = MANUFACTURER_MAPS[langCode];
  if (!map) return mfg;
  if (map[mfg]) return map[mfg];

  const lowerMfg = String(mfg).toLowerCase();
  const exactKey = Object.keys(map).find((k) => k.toLowerCase() === lowerMfg);
  if (exactKey) return map[exactKey];

  let result = String(mfg);
  const sortedKeys = Object.keys(map).sort((a, b) => b.length - a.length);
  for (const key of sortedKeys) {
    if (result.toLowerCase().includes(key.toLowerCase())) {
      const regex = new RegExp(key.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&"), "gi");
      result = result.replace(regex, map[key]);
    }
  }
  return result;
}

export function formatStrength(strength, langCode = "en") {
  if (!strength || langCode === "en") return strength || "";
  const map = STRENGTH_MAPS[langCode];
  if (map && map[strength]) return map[strength];
  return formatCompositionPhrase(strength, langCode);
}

export function formatPackSize(packSize, langCode = "en") {
  if (!packSize || langCode === "en") return packSize || "";
  const map = PACK_SIZE_MAPS[langCode];
  if (map && map[packSize]) return map[packSize];
  return formatCompositionPhrase(packSize, langCode);
}

export function formatDosageForm(form, langCode = "en") {
  if (!form || langCode === "en") return form || "";
  const map = DOSAGE_FORM_MAPS[langCode];
  if (map && map[form]) return map[form];
  if (map) {
    const key = Object.keys(map).find(
      (k) => k.toLowerCase() === String(form).trim().toLowerCase()
    );
    if (key) return map[key];
  }
  return formatCompositionPhrase(form, langCode);
}

export function formatMedicineText(text, langCode = "en") {
  if (!text) return "";
  if (Array.isArray(text)) {
    return text.map((item) => formatMedicineText(item, langCode));
  }
  if (langCode === "en") return text;
  const map = SENTENCE_MAPS[langCode];
  if (map && map[text]) return map[text];
  return text;
}
`;

fs.writeFileSync("./client/src/utils/formatters.js", formattersCode, "utf8");
console.log("Successfully generated enhanced formatters.js!");
