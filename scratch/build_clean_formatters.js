import fs from "fs";

const fileContent = `// Centralized locale-aware location, medicine, and date/time formatting system for MediBridge.

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
    "Peelamedu": "ಪೀಳಮೇಡು",
    "Saibaba Colony": "ಸಾಯಿಬಾಬಾ ಕಾಲೋನಿ",
    "Sitra": "ಸಿತ್ರಾ",
    "Trichy Road": "ಟ್ರಿಚಿ ರಸ್ತೆ",
    "Mettupalayam Road": "ಮೆಟ್ಟುಪಾಳಯಂ ರಸ್ತೆ",
    "Avinashi Road": "ಅವಿನಾಶಿ ರಸ್ತೆ",
    "Coimbatore": "ಕೊಯಮತ್ತೂರು",
    "Tamil Nadu": "ತಮಿಳುನಾಡು",
    "India": "ಭಾರತ",
  },
};

const MEDICINE_BRAND_MAPS = {
  ta: {
    "Crocin 500": "க்ரோசின் 500",
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
    "Clavam 625": "க்ளவாம் 625",
    "Clavam 375": "க்ளவாம் 375",
    "Clavam Dry Syrup": "க்ளவாம் உலர் சிரப்",
    "Clavam": "க்ளவாம்",
    "Augmentin 625 Duo": "ஆக்மென்டின் 625 டுவோ",
    "Augmentin 1000 Duo": "ஆக்மென்டின் 1000 டுவோ",
    "Augmentin DDS Syrup": "ஆக்மென்டின் டிடிஎஸ் சிரப்",
    "Augmentin": "ஆக்மென்டின்",
    "Moxikind-CV 625": "மாக்சிகைண்ட்-சிவி 625",
    "Moxikind-CV Dry Syrup": "மாக்சிகைண்ட்-சிவி உலர் சிரப்",
    "Moxikind": "மாக்சிகைண்ட்",
    "Electral Powder": "எலக்ட்ரால் பவுடர்",
    "Electral": "எலக்ட்ரால்",
    "Eno Fruit Salt Lemon": "ஈனோ ஃப்ரூட் சால்ட் லெமன்",
    "Eno Fruit Salt Regular": "ஈனோ ஃப்ரூட் சால்ட் ரெகுலர்",
    "Eno": "ஈனோ",
    "Evion 400": "ஈவியான் 400",
    "Evion": "ஈவியான்",
    "Foracort 200 Inhaler": "ஃபோராகார்ட் 200 இன்ஹேலர்",
    "Foracort": "ஃபோராகார்ட்",
    "Glycomet-SR 500": "கிளைகோமெட்-எஸ்ஆர் 500",
    "Glycomet": "கிளைகோமெட்",
    "Moov Pain Relief Cream": "மூவ் வலி நிவாரணி கிரீம்",
    "Moov": "மூவ்",
    "Neurobion Forte": "நியூரோபியான் ஃபோர்ட்",
    "Neurobion": "நியூரோபியான்",
    "Becosules Capsules": "பிகோசூல்ஸ் கேப்சூல்",
    "Becosules Z": "பிகோசூல்ஸ் இசட்",
    "Becosules": "பிகோசூல்ஸ்",
    "Betadine 5% Ointment": "பெட்டாடின் 5% ஒயின்ட்மென்ட்",
    "Betadine": "பெட்டாடின்",
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
    "Clavam 625": "क्लैवम 625",
    "Clavam 375": "क्लैवम 375",
    "Clavam Dry Syrup": "क्लैवम ड्राई सिरप",
    "Clavam": "क्लैवम",
    "Augmentin 625 Duo": "ऑगमेंटिन 625 डुओ",
    "Augmentin 1000 Duo": "ऑगमेंटिन 1000 डुओ",
    "Augmentin DDS Syrup": "ऑगमेंटिन डीडीएस सिरप",
    "Augmentin": "ऑगमेंटिन",
    "Moxikind-CV 625": "मोक्सीकाइंड-सीवी 625",
    "Moxikind-CV Dry Syrup": "मोक्सीकाइंड-सीवी ड्राई सिरप",
    "Moxikind": "मोक्सीकाइंड",
  },
  te: {
    "Electral Powder": "ఎలక్ట్రాల్ పౌడర్",
    "Electral": "ఎలక్ట్రాల్",
    "Eno Fruit Salt Lemon": "ఈనో ఫ్రూట్ సాల్ట్ లెమన్",
    "Eno Fruit Salt Regular": "ఈనో ఫ్రూట్ సాల్ట్ రెగ్యులర్",
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
    "Clavam 625": "క్లావమ్ 625",
    "Clavam 375": "క్లావమ్ 375",
    "Clavam Dry Syrup": "క్లావమ్ డ్రై సిరప్",
    "Clavam": "క్లావమ్",
    "Augmentin 625 Duo": "ఆగ్మెంటిన్ 625 డుఓ",
    "Augmentin 1000 Duo": "ఆగ్మెంటిన్ 1000 డుఓ",
    "Augmentin DDS Syrup": "ఆగ్మెంటిన్ డిడిఎస్ సిరప్",
    "Augmentin": "ఆగ్మెంటిన్",
    "Moxikind-CV 625": "మోక్సికైండ్-సివి 625",
    "Moxikind-CV Dry Syrup": "మోక్సికైండ్-సివి డ్రై సిరప్",
    "Moxikind": "మోక్సికైండ్",
  },
  ml: {
    "Electral Powder": "ഇലക്ട്രൽ പൗഡർ",
    "Electral": "ഇലക്ട്രൽ",
    "Eno Fruit Salt Lemon": "ഈനോ ഫ്രൂട്ട് സാൾട്ട് ലെമൺ",
    "Eno Fruit Salt Regular": "ഈനോ ഫ്രൂട്ട് സാൾട്ട് റെഗുലർ",
    "Eno": "ഈനോ",
    "Evion 400": "എവിയോൺ 400",
    "Evion": "എവിയോൺ",
    "Foracort 200 Inhaler": "ഫോറാകോർട്ട് 200 ഇൻഹേലർ",
    "Foracort": "ഫോറാകോർട്ട്",
    "Glycomet-SR 500": "ഗ്ലൈക്കോമെറ്റ്-എസ്ആർ 500",
    "Glycomet": "ഗ്ലൈക്കോമെറ്റ്",
    "Clavam 625": "ക്ലാവം 625",
    "Clavam 375": "ക്ലാവം 375",
    "Clavam Dry Syrup": "ക്ലാവം ഡ്രൈ സിറപ്പ്",
    "Clavam": "ക്ലാവം",
    "Augmentin 625 Duo": "ഓഗ്മെന്റിൻ 625 ഡ്യുവോ",
    "Augmentin 1000 Duo": "ഓഗ്മെന്റിൻ 1000 ഡ്യുവോ",
    "Augmentin DDS Syrup": "ഓഗ്മെന്റിൻ ഡിഡിഎസ് സിറപ്പ്",
    "Augmentin": "ഓഗ്മെന്റിൻ",
    "Moxikind-CV 625": "മോക്സികൈൻഡ്-സിവി 625",
    "Moxikind-CV Dry Syrup": "മോക്സികൈൻഡ്-സിവി ഡ്രൈ സിറപ്പ്",
    "Moxikind": "മോക്സികൈൻഡ്",
  },
  kn: {
    "Electral Powder": "ಎಲೆಕ್ಟ್ರಾಲ್ ಪೌಡರ್",
    "Electral": "ಎಲೆಕ್ಟ್ರಾಲ್",
    "Eno Fruit Salt Lemon": "ಇನೋ ಫ್ರೂಟ್ ಸಾಲ್ಟ್ ಲೆಮನ್",
    "Eno Fruit Salt Regular": "ಇನೋ ಫ್ರೂಟ್ ಸಾಲ್ಟ್ ರೆಗ್ಯುಲರ್",
    "Eno": "ಇನೋ",
    "Evion 400": "ಎವಿಯಾನ್ 400",
    "Evion": "ಎವಿಯಾನ್",
    "Foracort 200 Inhaler": "ಫೊರಾಕಾರ್ಟ್ 200 ಇನ್ಹೇಲರ್",
    "Foracort": "ಫೊರಾಕಾರ್ಟ್",
    "Glycomet-SR 500": "ಗ್ಲೈಕೋಮೆಟ್-ಎಸ್ಆರ್ 500",
    "Glycomet": "ಗ್ಲೈಕೋಮೆಟ್",
    "Clavam 625": "ಕ್ಲಾವಮ್ 625",
    "Clavam 375": "ಕ್ಲಾವಮ್ 375",
    "Clavam Dry Syrup": "ಕ್ಲಾವಮ್ ಡ್ರೈ ಸಿಲಪ್",
    "Clavam": "ಕ್ಲಾವಮ್",
    "Augmentin 625 Duo": "ಆಗ್ಮೆಂಟಿನ್ 625 ಡ್ಯುಯೊ",
    "Augmentin 1000 Duo": "ಆಗ್ಮೆಂಟಿನ್ 1000 ಡ್ಯುಯೊ",
    "Augmentin DDS Syrup": "ಆಗ್ಮೆಂಟಿನ್ ಡಿಡಿಎಸ್ ಸಿರೆಪ್",
    "Augmentin": "ಆಗ್ಮೆಂಟಿನ್",
    "Moxikind-CV 625": "ಮೊಕ್ಸಿಕೈಂಡ್-ಸಿವಿ 625",
    "Moxikind-CV Dry Syrup": "ಮೊಕ್ಸಿಕೈಂಡ್-ಸಿವಿ ಡ್ರೈ ಸಿರೆಪ್",
    "Moxikind": "ಮೊಕ್ಸಿಕೈಂಡ್",
  },
};

const GENERIC_NAME_MAPS = {
  ta: {
    "Oral Rehydration Salts (WHO Formula)": "வாய்வழி நீர்சத்து உப்புகள் (WHO ஃபார்முலா)",
    "Oral Rehydration Salts": "வாய்வழி நீர்சத்து உப்புகள்",
    "Magaldrate + Simethicone": "மகால்ட்ரேட் + சிமெதிகோன்",
    "Vitamin E (Tocopheryl Acetate)": "வைட்டமின் E (டோகோஃபெரைல் அசிட்டேட்)",
    "Formoterol + Budesonide": "ஃபார்மோடேரால் + புடசோனைடு",
    "Metformin Hydrochloride": "மெட்ஃபோர்மின் ஹைட்ரோகுளோரைடு",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "டர்பன்டைன் எண்ணெய் + நீலகிரி எண்ணெய் + வின்டர்கிரீன் எண்ணெய்",
    "Vitamin B-Complex + Cyanocobalamin": "வைட்டமின் பி-காம்பளக்ஸ் + சயனோகோபாலமின்",
    "Vitamin B-Complex + Zinc": "வைட்டமின் பி-காம்பளக்ஸ் + துத்தநாகம்",
    "Amoxicillin and Potassium Clavulanate Tablets IP": "அமோக்சிசிலின் மற்றும் பொட்டாசியம் க்ளவுலானேட் மாத்திரைகள் IP",
    "Amoxicillin and Potassium Clavulanate": "அமோக்சிசிலின் மற்றும் பொட்டாசியம் க்ளவுலானேட்",
    "Amoxicillin + Clavulanic Acid": "அமோக்சிசிலின் + க்ளவுலானிக் அமிலம்",
    "Paracetamol": "பாரசிட்டமால்",
  },
  hi: {
    "Oral Rehydration Salts (WHO Formula)": "ओरल रीहाइड्रेशन साल्ट्स (WHO फार्मूला)",
    "Oral Rehydration Salts": "ओरल रीहाइड्रेशन साल्ट्स",
    "Magaldrate + Simethicone": "मगालड्रेट + सिमेथिकोन",
    "Vitamin E (Tocopheryl Acetate)": "विटामिन E (टोकोफेरिल एसीटेट)",
    "Formoterol + Budesonide": "फॉर्मोटेरोल + बुडेसोनाइड",
    "Metformin Hydrochloride": "मेटफॉर्मिन हाइड्रोक्लोराइड",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "तारपीन का तेल + नीलगिरी का तेल + विंटरग्रीन तेल",
    "Vitamin B-Complex + Cyanocobalamin": "विटामिन बी-कॉम्प्लेक्स + सायनोकोबालामिन",
    "Vitamin B-Complex + Zinc": "विटामिन बी-कॉम्प्लेक्स + जिंक",
    "Amoxicillin and Potassium Clavulanate Tablets IP": "अमोक्सीसिलिन और पोटेशियम क्लावुलानेट टैबलेट्स आईपी",
    "Amoxicillin and Potassium Clavulanate": "अमोक्सीसिलिन और पोटेशियम क्लावुलानेट",
    "Amoxicillin + Clavulanic Acid": "अमोक्सीसिलिन + क्लैवुलेनिक एसिड",
    "Paracetamol": "पैरासिटामोल",
  },
  te: {
    "Oral Rehydration Salts (WHO Formula)": "ఓరల్ రీహైడ్రేషన్ సాల్ట్స్ (WHO ఫార్ములా)",
    "Oral Rehydration Salts": "ఓరల్ రీహైడ్రేషన్ సాల్ట్స్",
    "Magaldrate + Simethicone": "మగాల్డ్రేట్ + సిమెథికోన్",
    "Vitamin E (Tocopheryl Acetate)": "విటమిన్ E (టోకోఫెరిల్ అసిటేట్)",
    "Formoterol + Budesonide": "ఫార్మోటెరోల్ + బుడెసోనైడ్",
    "Metformin Hydrochloride": "మెట్‌ఫార్మిన్ హైడ్రోక్లోరైడ్",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "టర్పెంటైన్ నూనె + నీలగిరి నూనె + వింటర్‌గ్రీన్ నూనె",
    "Vitamin B-Complex + Cyanocobalamin": "విటమిన్ B-కాంప్లెక్స్ + సయనోకోబాలమిన్",
    "Vitamin B-Complex + Zinc": "విటమిన్ B-కాంప్లెక్స్ + జింక్",
    "Amoxicillin and Potassium Clavulanate Tablets IP": "అమోక్సిసిలిన్ మరియు పొటాషియం క్లావులనేట్ టాబ్లెట్లు IP",
    "Amoxicillin and Potassium Clavulanate": "అమోక్సిసిలిన్ మరియు పొటాషియం క్లావులనేట్",
    "Amoxicillin + Clavulanic Acid": "అమోక్సిసిలిన్ + క్లావులనిక్ యాసిడ్",
    "Paracetamol": "పారాసిటమాల్",
  },
  ml: {
    "Oral Rehydration Salts (WHO Formula)": "ഓറൽ റീഹൈഡ്രേഷൻ സാൾട്ട്സ് (WHO ഫോർമുല)",
    "Oral Rehydration Salts": "ഓറൽ റീഹൈഡ്രേഷൻ സാൾട്ട്സ്",
    "Magaldrate + Simethicone": "മഗാൽഡ്രേറ്റ് + സിമെത്തിക്കോൺ",
    "Vitamin E (Tocopheryl Acetate)": "വിറ്റാമിൻ E (ടോക്കോഫെറിൽ അസറ്റേറ്റ്)",
    "Formoterol + Budesonide": "ഫോർമോട്ടെറോൾ + ബുഡെസോനൈഡ്",
    "Metformin Hydrochloride": "മെറ്റ്ഫോർമിൻ ഹൈഡ്രോക്ലോറൈഡ്",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "ടർപന്റൈൻ എണ്ണ + നീലഗിരി എണ്ണ + വിന്റർഗ്രീൻ എണ്ണ",
    "Vitamin B-Complex + Cyanocobalamin": "വിറ്റാമിൻ B-കോംപ്ലക്സ് + സയാനോകോബാലമിൻ",
    "Vitamin B-Complex + Zinc": "വിറ്റാമിൻ B-കോംപ്ലക്സ് + സിങ്ക്",
    "Amoxicillin and Potassium Clavulanate Tablets IP": "അമോക്സിസിലിൻ ഒപ്പം പൊട്ടാസ്യം ക്ലാവുലനേറ്റ് ഗുളികകൾ IP",
    "Amoxicillin and Potassium Clavulanate": "അമോക്സിസിലിൻ ഒപ്പം പൊട്ടാസ്യം ക്ലാവുലനേറ്റ്",
    "Amoxicillin + Clavulanic Acid": "അമോക്സിസിലിൻ + ക്ലാവുലനിക് ആസിഡ്",
    "Paracetamol": "പാരസിറ്റമോൾ",
  },
  kn: {
    "Oral Rehydration Salts (WHO Formula)": "ಓರಲ್ ರೀಹೈಡ್ರೇಷನ್ ಸಾಲ್ಟ್ಸ್ (WHO ಫಾರ್ಮುಲಾ)",
    "Oral Rehydration Salts": "ಓರಲ್ ರೀಹೈಡ್ರೇಷನ್ ಸಾಲ್ಟ್ಸ್",
    "Magaldrate + Simethicone": "ಮಗಾಲ್ಡ್ರೇಟ್ + ಸಿಮೆಥಿಕೋನ್",
    "Vitamin E (Tocopheryl Acetate)": "ವಿಟಮಿನ್ E (ಟೋಕೋಫೆರಿಲ್ ಅಸಿಟೇಟ್)",
    "Formoterol + Budesonide": "ಫಾರ್ಮೋಟೆರಾಲ್ + ಬುಡೆಸೊನೈಡ್",
    "Metformin Hydrochloride": "ಮೆಟ್‌ಫಾರ್ಮಿನ್ ಹೈಡ್ರೋಕ್ಲೋರೈಡ್",
    "Turpentine Oil + Nilgiri Oil + Wintergreen Oil": "ಟರ್ಪೆಂಟೈನ್ ಎಣ್ಣೆ + ನೀಲಗಿರಿ ಎಣ್ಣೆ + ವಿಂಟರ್‌ಗ್ರೀನ್ ಎಣ್ಣೆ",
    "Vitamin B-Complex + Cyanocobalamin": "ವಿಟಮಿನ್ B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ಸಯನೋಕೋಬಾಲಮಿನ್",
    "Vitamin B-Complex + Zinc": "ವಿಟಮಿನ್ B-ಕಾಂಪ್ಲೆಕ್ಸ್ + ಝಿಂಕ್",
    "Amoxicillin and Potassium Clavulanate Tablets IP": "ಅಮೊಕ್ಸಿಸಿಲಿನ್ ಮತ್ತು ಪೊಟ್ಯಾಸಿಯಮ್ ಕ್ಲಾವ್ಯುಲನೇಟ್ ಮಾತ್ರೆಗಳು IP",
    "Amoxicillin and Potassium Clavulanate": "ಅಮೊಕ್ಸಿಸಿಲಿನ್ ಮತ್ತು ಪೊಟ್ಯಾಸಿಯಮ್ ಕ್ಲಾವ್ಯುಲನೇಟ್",
    "Amoxicillin + Clavulanic Acid": "ಅಮೊಕ್ಸಿಸಿಲಿನ್ + ಕ್ಲಾವ್ಯುಲನಿಕ್ ಆಸಿಡ್",
    "Paracetamol": "ಪ್ಯಾರಾಸಿಟಮಾಲ್",
  },
};

const MANUFACTURER_MAPS = {
  ta: {
    "Alkem Laboratories": "அல்கெம் லேபரட்டரீஸ்",
    "Alkem Laboratories Ltd": "அல்கெம் லேபரட்டரீஸ் லிமிடெட்",
    "Alkem": "அல்கெம்",
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
    "Mankind Pharma": "மேன்கைண்ட் பார்மா",
  },
  hi: {
    "Alkem Laboratories": "अल्केम लेबोरेटरीज",
    "Alkem Laboratories Ltd": "अल्केम लेबोरेटरीज लिमिटेड",
    "Alkem": "अल्केम",
    "FDC Limited": "एफडीसी लिमिटेड",
    "GSK": "जीएसके",
    "GlaxoSmithKline": "ग्लेक्सोस्मिथक्लाइन",
    "Merck / P&G Health": "मर्क / पीएंडजी हेल्थ",
    "P&G Health": "पीएंडजी हेल्थ",
    "Cipla": "सिप्ला",
    "USV Private Limited": "यूएसवी प्राइवेट लिमिटेड",
    "Reckitt Benckiser": "रेकिट बेंकिजर",
    "Pfizer": "फाइजर",
    "Win-Medicare": "विन-मेडीकेयर",
    "Alembic": "अलेम्बिक",
    "Sun Pharma": "सन फार्मा",
    "Dr. Reddy's": "डॉ. रेड्डीज",
    "Lupin": "लुपिन",
    "Mankind": "मैनकाइंड",
    "Mankind Pharma": "मैनकाइंड फार्मा",
  },
  te: {
    "Alkem Laboratories": "అల్కెమ్ ల్యాబొరేటరీస్",
    "Alkem Laboratories Ltd": "అల్కెమ్ ల్యాబొరేటరీస్ లిమిటెడ్",
    "Alkem": "అల్కెమ్",
    "FDC Limited": "ఎఫ్‌డిసి లిమిటెడ్",
    "GSK": "జీఎస్‌కే",
    "GlaxoSmithKline": "గ్లాక్సోస్మిత్‌క్లైన్",
    "Merck / P&G Health": "మెర్క్ / పి&జి హెల్త్",
    "Cipla": "సిప్లా",
    "USV Private Limited": "యుఎస్‌వి ప్రైవేట్ లిమిటెడ్",
    "Reckitt Benckiser": "రెకిట్ బెంకిజర్",
    "Pfizer": "ఫైజర్",
    "Win-Medicare": "విన్-మెడికేర్",
    "Alembic": "అలెంబిక్",
    "Mankind": "మ్యాన్‌కైండ్",
  },
  ml: {
    "Alkem Laboratories": "അൽകെം ലബോറട്ടറീസ്",
    "Alkem Laboratories Ltd": "അൽകെം ലബോറട്ടറീസ് ലിമിറ്റഡ്",
    "Alkem": "അൽകെം",
    "FDC Limited": "എഫ്ഡിസി ലിമിറ്റഡ്",
    "GSK": "ജിഎസ്കെ",
    "GlaxoSmithKline": "ഗ്ലാക്സോസ്മിത്ത്ക്ലൈൻ",
    "Merck / P&G Health": "മെർക്ക് / പി&ജി ഹെൽത്ത്",
    "Cipla": "സിപ്ല",
    "USV Private Limited": "യുഎസ്വി പ്രൈവറ്റ് ലിമിറ്റഡ്",
    "Reckitt Benckiser": "റെക്കിറ്റ് ബെൻകിസർ",
    "Pfizer": "ഫൈസർ",
    "Win-Medicare": "വിൻ-മെഡിക്കെയർ",
    "Alembic": "അലെംബിക്",
    "Mankind": "മാൻകൈൻഡ്",
  },
  kn: {
    "Alkem Laboratories": "ಅಲ್ಕೆಮ್ ಲ್ಯಾಬೊರೇಟರೀಸ್",
    "Alkem Laboratories Ltd": "ಅಲ್ಕೆಮ್ ಲ್ಯಾಬೊರೇಟರೀಸ್ ಲಿಮಿಟೆಡ್",
    "Alkem": "ಅಲ್ಕೆಮ್",
    "FDC Limited": "ಎಫ್‌ಡಿಸಿ ಲಿಮಿಟೆಡ್",
    "GSK": "ಜಿಎಸ್‌ಕೆ",
    "GlaxoSmithKline": "ಗ್ಲಾಕ್ಸೋಸ್ಮಿತ್‌ಕ್ಲೈನ್",
    "Merck / P&G Health": "ಮೆರ್ಕ್ / ಪಿ&ಜಿ ಹೆಲ್ತ್",
    "Cipla": "ಸಿಪ್ಲಾ",
    "USV Private Limited": "ಯುಎಸ್ವಿ ಪ್ರೈವೇಟ್ ಲಿಮಿಟೆಡ್",
    "Reckitt Benckiser": "ರೆಕಿಟ್ ಬೆಂಕಿಸರ್",
    "Pfizer": "ಫೈಜರ್",
    "Win-Medicare": "ವಿನ್-ಮೆಡಿಕೇರ್",
    "Alembic": "ಅಲೆಂಬಿಕ್",
    "Mankind": "ಮ್ಯಾನ್‌ಕೈಂಡ್",
  },
};

const STRENGTH_MAPS = {
  ta: {
    "21.8g sachet": "21.8 கிராம் பாக்கெட்",
    "5g sachet": "5 கிராம் பாக்கெட்",
    "400mg": "400 மி.கி",
    "200mcg": "200 மைக்ரோகிராம்",
    "500mg": "500 மி.கி",
    "625mg": "625 மி.கி",
    "1000mg": "1000 மி.கி",
    "50g tube": "50 கிராம் டியூப்",
    "Standard": "தரநிலையானது",
    "Standard Strength": "தரமான அளவு",
    "5% w/w": "5% w/w",
  },
  hi: {
    "21.8g sachet": "21.8 ग्राम पाउच",
    "5g sachet": "5 ग्राम पाउच",
    "400mg": "400 मिग्रा",
    "200mcg": "200 एमसीजी",
    "500mg": "500 मिग्रा",
    "625mg": "625 मिग्रा",
    "1000mg": "1000 मिग्रा",
    "50g tube": "50 ग्राम ट्यूब",
    "Standard": "मानक",
    "Standard Strength": "मानक शक्ति",
    "5% w/w": "5% w/w",
  },
  te: {
    "21.8g sachet": "21.8గ్రా ప్యాకెట్",
    "5g sachet": "5గ్రా ప్యాకెట్",
    "400mg": "400మి.గ్రా",
    "200mcg": "200మైక్రోగ్రామ్",
    "500mg": "500మి.గ్రా",
    "625mg": "625మి.గ్రా",
    "1000mg": "1000మి.గ్రా",
    "50g tube": "50గ్రా ట్యూబ్",
    "Standard": "ప్రామాణికం",
    "Standard Strength": "ప్రామాణిక బలం",
    "5% w/w": "5% w/w",
  },
  ml: {
    "21.8g sachet": "21.8 ഗ്രാം പാക്കറ്റ്",
    "5g sachet": "5 ഗ്രാം പാക്കറ്റ്",
    "400mg": "400 മി.ഗ്രാം",
    "200mcg": "200 മൈക്രോ ഗ്രാം",
    "500mg": "500 മി.ഗ്രാം",
    "625mg": "625 മി.ഗ്രാം",
    "1000mg": "1000 മി.ഗ്രാം",
    "50g tube": "50 ഗ്രാം ട്യൂബ്",
    "Standard": "സ്റ്റാൻഡേർഡ്",
    "Standard Strength": "സ്റ്റാൻഡേർഡ് അളവ്",
    "5% w/w": "5% w/w",
  },
  kn: {
    "21.8g sachet": "21.8 ಗ್ರಾಂ ಸ್ಯಾಚೆಟ್",
    "5g sachet": "5 ಗ್ರಾಂ ಸ್ಯಾಚೆಟ್",
    "400mg": "400 ಮಿ.ಗ್ರಾಂ",
    "200mcg": "200 ಮೈಕ್ರೋಗ್ರಾಂ",
    "500mg": "500 ಮಿ.ಗ್ರಾಂ",
    "625mg": "625 ಮಿ.ಗ್ರಾಂ",
    "1000mg": "1000 ಮಿ.ಗ್ರಾಂ",
    "50g tube": "50 ಗ್ರಾಂ ಟ್ಯೂಬ್",
    "Standard": "ಸ್ಟ್ಯಾಂಡರ್ಡ್",
    "Standard Strength": "ಸ್ಟ್ಯಾಂಡರ್ಡ್ ಶಕ್ತಿ",
    "5% w/w": "5% w/w",
  },
};

const PACK_SIZE_MAPS = {
  ta: {
    "Strip of 10 tablets": "10 மாத்திரைகள் கொண்ட அட்டைகள்",
    "Strip of 15 tablets": "15 மாத்திரைகள் கொண்ட அட்டைகள்",
    "Strip of 10 capsules": "10 கேப்சூல்கள் கொண்ட அட்டைகள்",
    "Bottle of 100ml": "100மி.லி பாட்டில்",
    "Bottle of 60ml": "60மி.லி பாட்டில்",
  },
  hi: {
    "Strip of 10 tablets": "10 गोलियों की स्ट्रिप",
    "Strip of 15 tablets": "15 गोलियों की स्ट्रिप",
    "Strip of 10 capsules": "10 कैप्सूल की स्ट्रिप",
    "Bottle of 100ml": "100 मि.ली. की बोतल",
    "Bottle of 60ml": "60 मि.ली. की बोतल",
  },
  te: {
    "Strip of 10 tablets": "10 మాత్రల స్ట్రిప్",
    "Strip of 15 tablets": "15 మాత్రల స్ట్రిప్",
    "Strip of 10 capsules": "10 క్యాప్సూల్స్ స్ట్రిప్",
    "Bottle of 100ml": "100మి.లీ సీసా",
    "Bottle of 60ml": "60మి.లీ సీసా",
  },
  ml: {
    "Strip of 10 tablets": "10 ഗുളികകളുടെ സ്ട്രിപ്പ്",
    "Strip of 15 tablets": "15 ഗുളികകളുടെ സ്ട്രിപ്പ്",
    "Strip of 10 capsules": "10 ക്യാപ്സൂളുകളുടെ സ്ട്രിപ്പ്",
    "Bottle of 100ml": "100 മില്ലി കുപ്പി",
    "Bottle of 60ml": "60 മില്ലി കുപ്പി",
  },
  kn: {
    "Strip of 10 tablets": "10 ಮಾತ್ರೆಗಳ ಸ್ಟ್ರಿಪ್",
    "Strip of 15 tablets": "15 ಮಾತ್ರೆಗಳ ಸ್ಟ್ರಿಪ್",
    "Strip of 10 capsules": "10 ಕ್ಯಾಪ್ಸೂಲ್ಗಳ ಸ್ಟ್ರಿಪ್",
    "Bottle of 100ml": "100ಮಿ.ಲೀ ಬಾಟಲ್",
    "Bottle of 60ml": "60ಮಿ.ಲೀ ಬಾಟಲ್",
  },
};

const DOSAGE_FORM_MAPS = {
  ta: {
    Powder: "பவுடர்",
    Capsule: "கேப்சூல்",
    Tablet: "மாத்திரை",
    Inhaler: "இன்ஹேலர்",
    Cream: "கிரீம்",
    Ointment: "ஒயின்ட்மென்ட்",
    Syrup: "சிரப்",
    Suspension: "சஸ்பென்ஷன்",
    "Dry Syrup": "உலர் சிரப்",
    Drops: "சொட்டு மருந்து",
    Gel: "ஜெல்",
    Injection: "ஊசி",
  },
  hi: {
    Powder: "पाउडर",
    Capsule: "कैप्सूल",
    Tablet: "टैबलेट",
    Inhaler: "इनहेलर",
    Cream: "क्रीम",
    Ointment: "ऑइंटमेंट",
    Syrup: "सिरप",
    Suspension: "सस्पेंशन",
    "Dry Syrup": "ड्राई सिरप",
    Drops: "ड्रॉप्स",
    Gel: "जेल",
    Injection: "इंजेक्शन",
  },
  te: {
    Powder: "పౌడర్",
    Capsule: "క్యాప్సూల్",
    Tablet: "మాత్ర",
    Inhaler: "ఇన్హేలర్",
    Cream: "క్రీమ్",
    Ointment: "ఆయింట్మెంట్",
    Syrup: "సిరప్",
    Suspension: "సస్పెన్షన్",
    "Dry Syrup": "డ్రై సిరప్",
    Drops: "డ్రాప్స్",
    Gel: "జెల్",
    Injection: "ఇంజెక్షన్",
  },
  ml: {
    Powder: "പൗഡർ",
    Capsule: "ക്യാപ്സൂൾ",
    Tablet: "ഗുളിക",
    Inhaler: "ഇൻഹേലർ",
    Cream: "ക്രീം",
    Ointment: "ഒയിന്റ്മെന്റ്",
    Syrup: "സിറപ്പ്",
    Suspension: "സസ്പെൻഷൻ",
    "Dry Syrup": "ഡ്രൈ സിറപ്പ്",
    Drops: "ഡ്രോപ്സ്",
    Gel: "ജെൽ",
    Injection: "ഇഞ്ചക്ഷൻ",
  },
  kn: {
    Powder: "ಪೌಡರ್",
    Capsule: "ಕ್ಯಾಪ್ಸೂಲ್",
    Tablet: "ಮಾತ್ರೆ",
    Inhaler: "ಇನ್ಹೇಲರ್",
    Cream: "ಕ್ರೀಮ್",
    Ointment: "ಆಯಿಂಟ್‌ಮೆಂಟ್",
    Syrup: "ಸಿರಪ್",
    Suspension: "ಸಸ್ಪೆನ್ಷನ್",
    "Dry Syrup": "ಡ್ರೈ ಸಿರಪ್",
    Drops: "ಡ್ರಾಪ್ಸ್",
    Gel: "ಜೆಲ್",
    Injection: "ಇಂಜೆಕ್ಷನ್",
  },
};

const COMPOSITION_TERM_MAPS = {
  ta: {
    Amoxicillin: "அமோக்சிசிலின்",
    "Clavulanic Acid": "க்ளவுலானிக் அமிலம்",
    "Potassium Clavulanate": "பொட்டாசியம் க்ளவுலானேட்",
    Paracetamol: "பாரசிட்டமால்",
    Azithromycin: "அசித்ரோமைசின்",
    Metformin: "மெட்ஃபோர்மின்",
    Hydrochloride: "ஹைட்ரோகுளோரைடு",
    Tablets: "மாத்திரைகள்",
    Tablet: "மாத்திரை",
    Capsules: "கேப்சூல்கள்",
    Capsule: "கேப்சூல்",
    Syrup: "சிரப்",
    Suspension: "சஸ்பென்ஷன்",
    Powder: "பவுடர்",
    Cream: "கிரீம்",
    Ointment: "ஒயின்ட்மென்ட்",
    Inhaler: "இன்ஹேலர்",
    IP: "IP",
    BP: "BP",
    USP: "USP",
  },
  hi: {
    Amoxicillin: "अमोक्सीसिलिन",
    "Clavulanic Acid": "क्लैवुलेनिक एसिड",
    "Potassium Clavulanate": "पोटेशियम क्लावुलानेट",
    Paracetamol: "पैरासिटामोल",
    Azithromycin: "अजिथ्रोमाइसिन",
    Metformin: "मेटफॉर्मिन",
    Hydrochloride: "हाइड्रोक्लोराइड",
    Tablets: "टैबलेट्स",
    Tablet: "टैबलेट",
    Capsules: "कैप्सूल",
    Capsule: "कैप्सूल",
    Syrup: "सिरप",
    Suspension: "सस्पेंशन",
    Powder: "पाउडर",
    Cream: "क्रीम",
    Ointment: "ऑइंटमेंट",
    Inhaler: "इनहेलर",
    IP: "IP",
    BP: "BP",
    USP: "USP",
  },
  te: {
    Amoxicillin: "అమోక్సిసిలిన్",
    "Clavulanic Acid": "క్లావులనిక్ యాసిడ్",
    "Potassium Clavulanate": "పొటాషియం క్లావులనేట్",
    Paracetamol: "పారాసిటమాల్",
    Azithromycin: "అజిత్రోమైసిన్",
    Metformin: "మెట్‌ఫార్మిన్",
    Hydrochloride: "హైడ్రోక్లోరైడ్",
    Tablets: "మాత్రలు",
    Tablet: "మాత్ర",
    Capsules: "క్యాప్సూల్స్",
    Capsule: "క్యాప్సూల్",
    Syrup: "సిరప్",
    Suspension: "సస్పెన్షన్",
    Powder: "పౌడర్",
    Cream: "క్రీమ్",
    Ointment: "ఆయింట్మెంట్",
    Inhaler: "ఇన్హేలర్",
    IP: "IP",
    BP: "BP",
    USP: "USP",
  },
  ml: {
    Amoxicillin: "അമോക്സിസിലിൻ",
    "Clavulanic Acid": "ക്ലാവുലനിക് ആസിഡ്",
    "Potassium Clavulanate": "പൊട്ടാസ്യം ക്ലാവുലനേറ്റ്",
    Paracetamol: "പാരസിറ്റമോൾ",
    Azithromycin: "അസിത്രോമൈസിൻ",
    Metformin: "മെറ്റ്ഫോർമിൻ",
    Hydrochloride: "ഹൈഡ്രോക്ലോറൈഡ്",
    Tablets: "ഗുളികകൾ",
    Tablet: "ഗുളിക",
    Capsules: "ക്യാപ്സൂളുകൾ",
    Capsule: "ക്യാപ്സൂൾ",
    Syrup: "സിറപ്പ്",
    Suspension: "സസ്പെൻഷൻ",
    Powder: "പൗഡർ",
    Cream: "ക്രീം",
    Ointment: "ഒയിന്റ്മെന്റ്",
    Inhaler: "ഇൻഹേലർ",
    IP: "IP",
    BP: "BP",
    USP: "USP",
  },
  kn: {
    Amoxicillin: "ಅಮೊಕ್ಸಿಸಿಲಿನ್",
    "Clavulanic Acid": "ಕ್ಲಾವ್ಯುಲನಿಕ್ ಆಸಿಡ್",
    "Potassium Clavulanate": "ಪೊಟ್ಯಾಸಿಯಮ್ ಕ್ಲಾವ್ಯುಲನೇಟ್",
    Paracetamol: "ಪ್ಯಾರಾಸಿಟಮಾಲ್",
    Azithromycin: "ಅಜಿತ್ರೋಮೈಸಿನ್",
    Metformin: "ಮೆಟ್‌ಫಾರ್ಮಿನ್",
    Hydrochloride: "ಹೈಡ್ರೋಕ್ಲೋರೈಡ್",
    Tablets: "ಮಾತ್ರೆಗಳು",
    Tablet: "ಮಾತ್ರೆ",
    Capsules: "ಕ್ಯಾಪ್ಸೂಲ್ಗಳು",
    Capsule: "ಕ್ಯಾಪ್ಸೂಲ್",
    Syrup: "ಸಿರಪ್",
    Suspension: "ಸಸ್ಪೆನ್ಷನ್",
    Powder: "ಪೌಡರ್",
    Cream: "ಕ್ರೀಮ್",
    Ointment: "ಆಯಿಂಟ್‌ಮೆಂಟ್",
    Inhaler: "ಇನ್ಹೇಲರ್",
    IP: "IP",
    BP: "BP",
    USP: "USP",
  },
};

const SENTENCE_MAPS = {};

export function formatCompositionPhrase(phrase, langCode = "en") {
  if (!phrase || langCode === "en") return phrase || "";
  const map = COMPOSITION_TERM_MAPS[langCode];
  if (!map) return phrase;

  if (map[phrase]) return map[phrase];

  let result = String(phrase);

  if (result.includes("+")) {
    const parts = result.split("+").map((p) => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" + ");
  }

  if (result.includes("/")) {
    const parts = result.split("/").map((p) => formatCompositionPhrase(p.trim(), langCode));
    return parts.join(" / ");
  }

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

  return brandName;
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

  return mfg;
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

fs.writeFileSync("client/src/utils/formatters.js", fileContent);
console.log("Successfully updated formatters.js!");
