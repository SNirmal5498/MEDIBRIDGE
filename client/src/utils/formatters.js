// Centralized locale-aware location, medicine, and date/time formatting system for MediBridge.

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
    "Sri Shakthi Hostel": "ஸ்ரீ சக்தி விடுதி",
    "Sri Shakthi Nagar": "ஸ்ரீ சக்தி நகர்",
    "Race Course Road": "ரேஸ் கோர்ஸ் சாலை",
    "Gandhipuram": "காந்திபுரம்",
    "RS Puram": "ஆர். எஸ். புரம்",
    "Peelamedu": "பீளமேடு",
    "Saibaba Colony": "சாயிபாபா காலனி",
    "Sitra": "சிட்ரா",
    "Trichy Road": "திருச்சி சாலை",
    "Mettupalayam Road": "மேட்டுப்பாளையம் சாலை",
    "Avinashi Road": "அவிநாசி சாலை",
    "Coimbatore": "கோயம்புத்தூர்",
    "Tamil Nadu": "தமிழ்நாடு",
    "TamilNadu": "தமிழ்நாடு",
    "TN": "தமிழ்நாடு",
    "India": "இந்தியா",
    "Near": "அருகில்",
    "Road": "சாலை",
    "Street": "தெரு",
    "Nagar": "நகர்",
    "Hostel": "விடுதி",
    "Colony": "காலனி",
  },
  hi: {
    "Sri Shakthi Hostel": "श्री शक्ति हॉस्टल",
    "Sri Shakthi Nagar": "श्री शक्ति नगर",
    "Race Course Road": "रेस कोर्स रोड",
    "Gandhipuram": "गांधीपुरम",
    "RS Puram": "आर. एस. पुरम",
    "Peelamedu": "पीलामेडू",
    "Saibaba Colony": "साईबाबा कॉलोनी",
    "Sitra": "सिट्रा",
    "Trichy Road": "त्रिची रोड",
    "Mettupalayam Road": "मेट्टुपालयम रोड",
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
    "Race Course Road": "రేస్ కోర్స్ రోడ్డు",
    "Gandhipuram": "గాంధీపురం",
    "RS Puram": "ఆర్. ఎస్. పురం",
    "Peelamedu": "పీలమేడు",
    "Saibaba Colony": "సాయిబాబా కాలనీ",
    "Sitra": "సిట్రా",
    "Trichy Road": "తిరుచ్చి రోడ్డు",
    "Mettupalayam Road": "మెట్టుపాళయం రోడ్డు",
    "Avinashi Road": "అవినాశి రోడ్డు",
    "Coimbatore": "కోయంబత్తూరు",
    "Tamil Nadu": "తమిళనాడు",
    "TamilNadu": "తమిళనాడు",
    "TN": "తమిళనాడు",
    "India": "భారతదేశం",
    "Near": "దగ్గర",
    "Road": "రోడ్డు",
    "Street": "వీధి",
    "Nagar": "నగర్",
  },
  ml: {
    "Sri Shakthi Hostel": "ശ്രീ ശക്തി ഹോസ്റ്റൽ",
    "Sri Shakthi Nagar": "ശ്രീ ശക്തി നഗർ",
    "Race Course Road": "റേസ് കോഴ്സ് റോഡ്",
    "Gandhipuram": "ഗാന്ധിപുരം",
    "RS Puram": "ആർ. എസ്. പുരം",
    "Peelamedu": "പീലമേട്",
    "Saibaba Colony": "സായിബാബ കോളനി",
    "Sitra": "സിട്ര",
    "Trichy Road": "തിരുച്ചി റോഡ്",
    "Mettupalayam Road": "മേട്ടുപ്പാളയം റോഡ്",
    "Avinashi Road": "അവിനാശി റോഡ്",
    "Coimbatore": "കോയമ്പത്തൂർ",
    "Tamil Nadu": "തമിഴ്‌നാട്",
    "TamilNadu": "തമിഴ്‌നാട്",
    "TN": "തമിഴ്‌നാട്",
    "India": "ഇന്ത്യ",
    "Near": "അടുത്ത്",
    "Road": "റോഡ്",
    "Street": "തെരുവ്",
    "Nagar": "നഗർ",
  },
  kn: {
    "Sri Shakthi Hostel": "ಶ್ರೀ ಶಕ್ತಿ ಹಾಸ್ಟೆಲ್",
    "Sri Shakthi Nagar": "ಶ್ರೀ ಶಕ್ತಿ ನಗರ",
    "Race Course Road": "ರೇಸ್ ಕೋರ್ಸ್ ರಸ್ತೆ",
    "Gandhipuram": "ಗಾಂಧಿಪುರಂ",
    "RS Puram": "ಆರ್. ಎಸ್. ಪುರಂ",
    "Peelamedu": "ಪೀಲಮೇಡು",
    "Saibaba Colony": "ಸಾಯಿಬಾಬಾ ಕಾಲೋನಿ",
    "Sitra": "ಸಿಟ್ರಾ",
    "Trichy Road": "ತಿರುಚಿ ರಸ್ತೆ",
    "Mettupalayam Road": "ಮೆಟ್ಟುಪಾಳಯಂ ರಸ್ತೆ",
    "Avinashi Road": "ಅವಿನಾಶಿ ರಸ್ತೆ",
    "Coimbatore": "ಕೊಯಮತ್ತೂರು",
    "Tamil Nadu": "ತಮಿಳುನಾಡು",
    "TamilNadu": "ತಮಿಳುನಾಡು",
    "TN": "ತಮಿಳುನಾಡು",
    "India": "ಭಾರತ",
    "Near": "ಹತ್ತಿರ",
    "Road": "ರಸ್ತೆ",
    "Street": "ಬೀದಿ",
    "Nagar": "ನಗರ",
  },
};

const MEDICINE_BRAND_MAPS = {
  ta: {
    "Crocin": "க்ரோசின்",
    "Dolo": "டோலோ",
    "Calpol": "கால்போல்",
    "Cetrizine-D": "செட்ரிசின்-டி",
    "Cetirizine": "செட்டிரிசின்",
    "Electral": "எலக்ட்ரால்",
    "Limcee": "லிம்சி",
    "Digene": "டைஜீன்",
    "Gelusil": "கெலுசில்",
    "Novamox": "நோவாமாக்ஸ்",
    "Glycomet": "கிளைகோமெட்",
    "Betadine": "பீட்டாடின்",
    "Allegra": "அலிகிரா",
    "Asthalin Inhaler": "ஆஸ்தாலின் இன்ஹேலர்",
    "Asthalin": "ஆஸ்தாலின்",
    "Augmentin 625 Duo": "ஆக்மென்டின் 625 டுயோ",
    "Augmentin": "ஆக்மென்டின்",
    "Band-Aid Washproof Strips": "பாண்ட்ஏய்ட் நீர்ப்புகா துண்டுகள்",
    "Dettol Antiseptic Liquid": "டெட்டால் கிருமிநாசினி திரவம்",
    "Soframycin Skin Cream": "சோஃப்ராமைசின் தோல் கிரீம்",
    "Povidone Iodine Antiseptic": "பொவிடோன் அயோடின் கிருமிநாசினி",
    "Johnson & Johnson": "ஜான்சன் & ஜான்சன்",
  },
  hi: {
    "Crocin": "क्रोसिन",
    "Dolo": "डोलो",
    "Calpol": "काल्पोल",
    "Cetrizine-D": "सेट्रिज़ाइन-डी",
    "Cetirizine": "सेटीरिज़िन",
    "Electral": "इलेक्ट्रा-एल",
    "Limcee": "लिम्सी",
    "Digene": "डाइजीन",
    "Gelusil": "जेलुसिल",
    "Novamox": "नोवामॉक्स",
    "Glycomet": "ग्लाइकोमेट",
    "Betadine": "बीटाडीन",
    "Allegra": "एलेग्रा",
    "Asthalin Inhaler": "एस्थालिन इनहेलर",
    "Asthalin": "एस्थालिन",
    "Augmentin 625 Duo": "ऑगमेंटिन 625 डुओ",
    "Augmentin": "ऑगमेंटिन",
    "Band-Aid Washproof Strips": "बैंड-एड वॉशप्रूफ पट्टियां",
    "Dettol Antiseptic Liquid": "डेटॉल एंटीसेप्टिक तरल",
    "Soframycin Skin Cream": "सोफ्रामिसिन स्किन क्रीम",
    "Povidone Iodine Antiseptic": "पोविडोन आयोडीन एंटीसेप्टिक",
    "Johnson & Johnson": "जॉनसन एंड जॉनसन",
  },
  te: {
    "Crocin": "క్రోసిన్",
    "Dolo": "డోలో",
    "Calpol": "కాల్పోల్",
    "Cetrizine-D": "సెట్రిజైన్-డి",
    "Cetirizine": "సెటిరిజైన్",
    "Electral": "ఎలక్ట్రాల్",
    "Limcee": "లిమ్సీ",
    "Digene": "డైజీన్",
    "Gelusil": "జెలుసిల్",
    "Novamox": "నోవామాక్స్",
    "Glycomet": "గ్లైకోమెట్",
    "Betadine": "బీటాడిన్",
    "Allegra": "అలెలెగ్రా",
    "Asthalin Inhaler": "ఆస్థాలిన్ ఇన్హేలర్",
    "Asthalin": "ఆస్థాలిన్",
    "Augmentin 625 Duo": "ఆగ్మెంటిన్ 625 డుయో",
    "Augmentin": "ఆగ్మెంటిన్",
    "Band-Aid Washproof Strips": "బాండ్-ఎయిడ్ వాటర్‌ప్రూఫ్ పట్టీలు",
    "Dettol Antiseptic Liquid": "డెట్టాల్ యాంటీసెప్టిక్ ద్రవం",
    "Soframycin Skin Cream": "సోఫ్రామైసిన్ స్కిన్ క్రీమ్",
    "Povidone Iodine Antiseptic": "పోవిడోన్ అయోడిన్ యాంటీసెప్టిక్",
    "Johnson & Johnson": "జాన్సన్ & జాన్సన్",
  },
  ml: {
    "Crocin": "ക്രോസിൻ",
    "Dolo": "ഡോളോ",
    "Calpol": "കാൽപോൾ",
    "Cetrizine-D": "സെട്രിസിൻ-ഡി",
    "Cetirizine": "സെറ്റിറിസിൻ",
    "Electral": "ഇലക്ട്രാൽ",
    "Limcee": "ലിംസി",
    "Digene": "ഡൈജീൻ",
    "Gelusil": "ജെലുസിൽ",
    "Novamox": "നോവാമോക്സ്",
    "Glycomet": "ഗ്ലൈക്കോമെറ്റ്",
    "Betadine": "ബീറ്റാഡിൻ",
    "Allegra": "അലെഗ്ര",
    "Asthalin Inhaler": "ആസ്താലിൻ ഇൻഹേലർ",
    "Asthalin": "ആസ്താലിൻ",
    "Augmentin 625 Duo": "ഓഗ്മെന്റിൻ 625 ഡ്യുവോ",
    "Augmentin": "ഓഗ്മെന്റിൻ",
    "Band-Aid Washproof Strips": "ബാൻഡ്-എയ്ഡ് വാട്ടർപ്രൂഫ് സ്ട്രിപ്പുകൾ",
    "Dettol Antiseptic Liquid": "ഡെറ്റോൾ ആന്റിസെപ്റ്റിക് ദ്രാവകം",
    "Soframycin Skin Cream": "സോഫ്രാമൈസിൻ സ്കിൻ ക്രീം",
    "Povidone Iodine Antiseptic": "പോവിഡോൺ അയഡിൻ ആന്റിസെപ്റ്റിക്",
    "Johnson & Johnson": "ജോൺസൺ & ജോൺസൺ",
  },
  kn: {
    "Crocin": "ಕ್ರೋಸಿನ್",
    "Dolo": "ಡೋಲೋ",
    "Calpol": "ಕಾಲ್ಪೋಲ್",
    "Cetrizine-D": "ಸೆಟ್ರಿಜಿನ್-ಡಿ",
    "Cetirizine": "ಸೆಟಿರಿಜಿನ್",
    "Electral": "ಎಲೆಕ್ಟ್ರಾಲ್",
    "Limcee": "ಲಿಮ್ಸಿ",
    "Digene": "ಡೈಜೀನ್",
    "Gelusil": "ಗೆಲುಸಿಲ್",
    "Novamox": "ನೋವಾಮಾಕ್ಸ್",
    "Glycomet": "ಗ್ಲೈಕೋಮೆಟ್",
    "Betadine": "ಬೀಟಾಡಿನ್",
    "Allegra": "ಅಲೆಗ್ರಾ",
    "Asthalin Inhaler": "ಆಸ್ಥಾಲಿನ್ ಇನ್‌ಹೇಲರ್",
    "Asthalin": "ಆಸ್ಥಾಲಿನ್",
    "Augmentin 625 Duo": "ಆಗ್‌ಮೆಂಟಿನ್ 625 ಡ್ಯುಯೊ",
    "Augmentin": "ಆಗ್‌ಮೆಂಟಿನ್",
    "Band-Aid Washproof Strips": "ಬ್ಯಾಂಡ್-ಏಡ್ ವಾಟರ್‌ಪ್ರೂಫ್ ಪಟ್ಟಿಗಳು",
    "Dettol Antiseptic Liquid": "ಡೆಟಾಲ್ ಆಂಟಿಸೆಪ್ಟಿಕ್ ದ್ರವ",
    "Soframycin Skin Cream": "ಸೋಫ್ರಾಮೈಸಿನ್ ಸ್ಕಿನ್ ಕ್ರೀಮ್",
    "Povidone Iodine Antiseptic": "ಪೋವಿಡೋನ್ ಅಯೋಡಿನ್ ಆಂಟಿಸೆಪ್ಟಿಕ್",
    "Johnson & Johnson": "ಜಾನ್ಸನ್ & ಜಾನ್ಸನ್",
  },
};

const GENERIC_NAME_MAPS = {
  ta: {
    "Paracetamol": "பாராசிட்டமால்",
    "Cetirizine": "செட்டிரிசின்",
    "ORS (Oral Rehydration Salts)": "ஓ.ஆர்.எஸ் (வாய்வழி நீரேற்ற உப்புகள்)",
    "Oral Rehydration Salts": "வாய்வழி நீரேற்ற உப்புகள்",
    "Vitamin C (Ascorbic Acid)": "வைட்டமின் சி (அஸ்கார்பிக் அமிலம்)",
    "Ascorbic Acid": "அஸ்கார்பிக் அமிலம்",
    "Antacid (Magaldrate + Simethicone)": "அமிலநீக்கி (மகால்ட்ரேட் + சிமெதிகோன்)",
    "Antacid (Aluminium + Magnesium Hydroxide)": "அமிலநீக்கி (அலுமினியம் + மெக்னீசியம் ஹைட்ராக்சைடு)",
    "Amoxicillin": "அமோக்சிசிலின்",
    "Metformin": "மெட்ஃபோர்மின்",
    "Povidone Iodine": "பொவிடோன் அயோடின்",
    "Fexofenadine": "ஃபெக்ஸோஃபெனாடின்",
    "Salbutamol": "சல்பியூட்டமால்",
    "Amoxicillin + Clavulanic Acid": "அமோக்சிசிலின் + கிளாவூலனிக் அமிலம்",
  },
  hi: {
    "Paracetamol": "पैरासिटामोल",
    "Cetirizine": "सेटीरिज़िन",
    "ORS (Oral Rehydration Salts)": "ओआरएस (मौखिक पुनर्जलीकरण लवण)",
    "Oral Rehydration Salts": "मौखिक पुनर्जलीकरण लवण",
    "Vitamin C (Ascorbic Acid)": "विटामिन सी (एस्कॉर्बिक एसिड)",
    "Ascorbic Acid": "एस्कॉर्बिक एसिड",
    "Antacid (Magaldrate + Simethicone)": "एंटासिड (मगाल्ड्रेट + सिमेथिकोन)",
    "Antacid (Aluminium + Magnesium Hydroxide)": "एंटासिड (एल्यूमीनियम + मैग्नीशियम हाइड्रॉक्साइड)",
    "Amoxicillin": "अमोक्सिसिलिन",
    "Metformin": "मेटफॉर्मिन",
    "Povidone Iodine": "पोविडोन आयोडीन",
    "Fexofenadine": "फेक्सोफेनाडाइन",
    "Salbutamol": "साल्बुटामोल",
    "Amoxicillin + Clavulanic Acid": "अमोक्सिसिलिन + क्लावुलैनिक एसिड",
  },
  te: {
    "Paracetamol": "పారాసిటమాల్",
    "Cetirizine": "సెటిరిజైన్",
    "ORS (Oral Rehydration Salts)": "ఓఆర్‌ఎస్ (నోటి పునరుజ్జీవన లవణాలు)",
    "Oral Rehydration Salts": "నోటి పునరుజ్జీవన లవణాలు",
    "Vitamin C (Ascorbic Acid)": "విటమిన్ సి (ఆస్కార్బిక్ యాసిడ్)",
    "Ascorbic Acid": "ఆస్కార్బిక్ యాసిడ్",
    "Antacid (Magaldrate + Simethicone)": "యాంటాసిడ్ (మగాల్డ్రేట్ + సిమెథికోన్)",
    "Antacid (Aluminium + Magnesium Hydroxide)": "యాంటాసిడ్ (అల్యూమినియం + మెగ్నీషియం హైడ్రాక్సైడ్)",
    "Amoxicillin": "అమోక్సిసిలిన్",
    "Metformin": "మెట్‌ఫార్మిన్",
    "Povidone Iodine": "పోవిడోన్ అయోడిన్",
    "Fexofenadine": "ఫెక్సోఫెనాడైన్",
    "Salbutamol": "సాల్బుటమాల్",
    "Amoxicillin + Clavulanic Acid": "అమోక్సిసిలిన్ + క్లావులానిక్ యాసిడ్",
  },
  ml: {
    "Paracetamol": "പാരാസിറ്റമോൾ",
    "Cetirizine": "സെറ്റിറിസിൻ",
    "ORS (Oral Rehydration Salts)": "ഒ.ആർ.എസ് (വായുവഴിയുള്ള റീഹൈഡ്രേഷൻ സാൾട്ടുകൾ)",
    "Oral Rehydration Salts": "വായുവഴിയുള്ള റീഹൈഡ്രേഷൻ സാൾട്ടുകൾ",
    "Vitamin C (Ascorbic Acid)": "വിറ്റാമിൻ സി (അസ്കോർബിക് ആസിഡ്)",
    "Ascorbic Acid": "അസ്കോർബിക് ആസിഡ്",
    "Antacid (Magaldrate + Simethicone)": "അന്റാസിഡ് (മഗൾഡ്രേറ്റ് + സിമെത്തിക്കോൺ)",
    "Antacid (Aluminium + Magnesium Hydroxide)": "അന്റാസിഡ് (അലുമിനിയം + മഗ്നീഷ്യം ഹൈഡ്രോക്സൈഡ്)",
    "Amoxicillin": "അമോക്സിസിലിൻ",
    "Metformin": "മെറ്റ്ഫോർമിൻ",
    "Povidone Iodine": "പോവിഡോൺ അയഡിൻ",
    "Fexofenadine": "ഫെക്സോഫെനാഡിൻ",
    "Salbutamol": "സാൽബുട്ടമോൾ",
    "Amoxicillin + Clavulanic Acid": "അമോക്സിസിലിൻ + ക്ലാവുലാനിക് ആസിഡ്",
  },
  kn: {
    "Paracetamol": "ಪ್ಯಾರಾಸಿಟಮಾಲ್",
    "Cetirizine": "ಸೆಟಿರಿಜಿನ್",
    "ORS (Oral Rehydration Salts)": "ಒಆರ್‌ಎಸ್ (ಮೌಖಿಕ ಪುನರ್ಜಲೀಕರಣ ಲವಣಗಳು)",
    "Oral Rehydration Salts": "ಮೌಖಿಕ ಪುನರ್ಜಲೀಕರಣ ಲವಣಗಳು",
    "Vitamin C (Ascorbic Acid)": "ವಿಟಮಿನ್ ಸಿ (ಆಸ್ಕೋರ್ಬಿಕ್ ಆಸಿಡ್)",
    "Ascorbic Acid": "ಆಸ್ಕೋರ್ಬಿಕ್ ಆಸಿಡ್",
    "Antacid (Magaldrate + Simethicone)": "ಆಂಟಾಸಿಡ್ (ಮಗಾಲ್ಡ್ರೇಟ್ + ಸಿಮೆಥಿಕೋನ್)",
    "Antacid (Aluminium + Magnesium Hydroxide)": "ಆಂಟಾಸಿಡ್ (ಅಲ್ಯೂಮಿನಿಯಂ + ಮೆಗ್ನೀಸಿಯಮ್ ಹೈಡ್ರಾಕ್ಸೈಡ್)",
    "Amoxicillin": "ಅಮೋಕ್ಸಿಸಿಲಿನ್",
    "Metformin": "ಮೆಟ್‌ಫಾರ್ಮಿನ್",
    "Povidone Iodine": "ಪೋವಿಡೋನ್ ಅಯೋಡಿನ್",
    "Fexofenadine": "ಫೆಕ್ಸೊಫೆನಾಡೈನ್",
    "Salbutamol": "ಸಾಲ್ಬುಟಮಾಲ್",
    "Amoxicillin + Clavulanic Acid": "ಅಮೋಕ್ಸಿಸಿಲಿನ್ + ಕ್ಲಾವ್ಯುಲಾನಿಕ್ ಆಸಿಡ್",
  },
};

const MANUFACTURER_MAPS = {
  ta: {
    "GSK": "ஜி.எஸ்.கே",
    "Micro Labs": "மைக்ரோ லேப்ஸ்",
    "Cipla": "சிப்லா",
    "FDC": "எஃப்.டி.சி",
    "Abbott": "அபோட்",
    "Zydus": "ஜைடஸ்",
    "USV": "யு.எஸ்.வி",
    "Win-Medicare": "வின்-மெடிகேர்",
    "Sanofi": "சனோஃபி",
    "Sun Pharma": "சன் பார்மா",
    "Johnson & Johnson": "ஜான்சன் & ஜான்சன்",
  },
  hi: {
    "GSK": "जीएसके",
    "Micro Labs": "माइक्रो लैब्स",
    "Cipla": "सिप्ला",
    "FDC": "एफडीसी",
    "Abbott": "एबॉट",
    "Zydus": "ज़ायडस",
    "USV": "यूएसवी",
    "Win-Medicare": "विन-मेडिकेयर",
    "Sanofi": "सनोफी",
    "Sun Pharma": "सन फार्मा",
    "Johnson & Johnson": "जॉनसन एंड जॉनसन",
  },
  te: {
    "GSK": "జి.ఎస్.కె",
    "Micro Labs": "మైక్రో ల్యాబ్స్",
    "Cipla": "సిప్లా",
    "FDC": "ఎఫ్‌.డి.సి",
    "Abbott": "అబాట్",
    "Zydus": "జైడస్",
    "USV": "యు.ఎస్.వి",
    "Win-Medicare": "విన్-మెడికేర్",
    "Sanofi": "సనోఫీ",
    "Sun Pharma": "సన్ ఫార్మా",
    "Johnson & Johnson": "జాన్సన్ & జాన్సన్",
  },
  ml: {
    "GSK": "ജി.എസ്.കെ",
    "Micro Labs": "മൈക്രോ ലാബ്സ്",
    "Cipla": "സിപ്ല",
    "FDC": "എഫ്.ഡി.സി",
    "Abbott": "അബോട്ട്",
    "Zydus": "സൈഡസ്",
    "USV": "യു.എസ്.വി",
    "Win-Medicare": "വിൻ-മെഡികെയർ",
    "Sanofi": "സനോഫി",
    "Sun Pharma": "സൺ ഫാർമ",
    "Johnson & Johnson": "ജോൺസൺ & ജോൺസൺ",
  },
  kn: {
    "GSK": "ಜಿ.ಎಸ್‌.ಕೆ",
    "Micro Labs": "ಮೈಕ್ರೋ ಲ್ಯಾಬ್ಸ್",
    "Cipla": "ಸಿಪ್ಲಾ",
    "FDC": "ಎಫ್.ಡಿ.ಸಿ",
    "Abbott": "ಅಬಾಟ್",
    "Zydus": "ಜೈಡಸ್",
    "USV": "ಯು.ಎಸ್.ವಿ",
    "Win-Medicare": "ವಿನ್-ಮೆಡಿಕೇರ್",
    "Sanofi": "ಸನೋಫಿ",
    "Sun Pharma": "ಸನ್ ಫಾರ್ಮಾ",
    "Johnson & Johnson": "ಜಾನ್ಸನ್ & ಜಾನ್ಸನ್",
  },
};

const PACK_SIZE_MAPS = {
  ta: {
    "Strip of 15 tablets": "15 மாத்திரைகள் கொண்ட ஒரு துண்டு",
    "Strip of 10 tablets": "10 மாத்திரைகள் கொண்ட ஒரு துண்டு",
    "Strip of 20 tablets": "20 மாத்திரைகள் கொண்ட ஒரு துண்டு",
    "Strip of 10 capsules": "10 கேப்சூல்கள் கொண்ட ஒரு துண்டு",
    "Box of 10 sachets": "10 பாக்கெட்டுகள் கொண்ட பெட்டி",
    "170ml bottle": "170 மி.லி. பாட்டில்",
    "20g tube": "20 கிராம் டியூப்",
    "Pack of 20": "20 பாக்கெட்",
  },
  hi: {
    "Strip of 15 tablets": "15 गोलियों की स्ट्रिप",
    "Strip of 10 tablets": "10 गोलियों की स्ट्रिप",
    "Strip of 20 tablets": "20 गोलियों की स्ट्रिप",
    "Strip of 10 capsules": "10 कैप्सूल की स्ट्रिप",
    "Box of 10 sachets": "10 पाउच का बॉक्स",
    "170ml bottle": "170 मि.ली. की बोतल",
    "20g tube": "20 ग्राम ट्यूब",
    "Pack of 20": "20 का पैक",
  },
  te: {
    "Strip of 15 tablets": "15 టాబ్లెట్ల స్ట్రిప్",
    "Strip of 10 tablets": "10 టాబ్లెట్ల స్ట్రిప్",
    "Strip of 20 tablets": "20 టాబ్లెట్ల స్ట్రిప్",
    "Strip of 10 capsules": "10 క్యాప్సూల్స్ స్ట్రిప్",
    "Box of 10 sachets": "10 ప్యాకెట్ల బాక్స్",
    "170ml bottle": "170 మి.లీ. బాటిల్",
    "20g tube": "20 గ్రాముల ట్యూబ్",
    "Pack of 20": "20 ప్యాక్",
  },
  ml: {
    "Strip of 15 tablets": "15 ഗുളികകളുടെ സ്ട്രിപ്പ്",
    "Strip of 10 tablets": "10 ഗുളികകളുടെ സ്ട്രിപ്പ്",
    "Strip of 20 tablets": "20 ഗുളികകളുടെ സ്ട്രിപ്പ്",
    "Strip of 10 capsules": "10 ക്യാപ്സ്യൂളുകളുടെ സ്ട്രിപ്പ്",
    "Box of 10 sachets": "10 സാച്ചെറ്റുകളുടെ ബോക്സ്",
    "170ml bottle": "170 മി.ലി. ബോട്ടിൽ",
    "20g tube": "20 ഗ്രാം ട്യൂബ്",
    "Pack of 20": "20 എണ്ണത്തിന്റെ പാക്ക്",
  },
  kn: {
    "Strip of 15 tablets": "15 ಮಾತ್ರೆಗಳ ಸ್ಟ್ರಿಪ್",
    "Strip of 10 tablets": "10 ಮಾತ್ರೆಗಳ ಸ್ಟ್ರಿಪ್",
    "Strip of 20 tablets": "20 ಮಾತ್ರೆಗಳ ಸ್ಟ್ರಿಪ್",
    "Strip of 10 capsules": "10 ಕ್ಯಾಪ್ಸುಲ್ಗಳ ಸ್ಟ್ರಿಪ್",
    "Box of 10 sachets": "10 ಪಾಕೆಟ್‌ಗಳ ಬಾಕ್ಸ್",
    "170ml bottle": "170 ಮಿ.ಲೀ. ಬಾಟಲ್",
    "20g tube": "20 ಗ್ರಾಂ ಟ್ಯೂಬ್",
    "Pack of 20": "20 ರ ಪ್ಯಾಕ್",
  },
};

const STRENGTH_MAPS = {
  ta: {
    "500mg": "500 மி.கி.",
    "650mg": "650 மி.கி.",
    "10mg": "10 மி.கி.",
    "120mg": "120 மி.கி.",
    "625mg": "625 மி.கி.",
    "21.8g sachet": "21.8 கிராம் பாக்கெட்",
    "10ml": "10 மி.லி.",
    "5% w/w": "5% எடை/எடை",
  },
  hi: {
    "500mg": "500 मिलीग्राम",
    "650mg": "650 मिलीग्राम",
    "10mg": "10 मिलीग्राम",
    "120mg": "120 मिलीग्राम",
    "625mg": "625 मिलीग्राम",
    "21.8g sachet": "21.8 ग्राम पाउच",
    "10ml": "10 मि.ली.",
    "5% w/w": "5% डब्लू/डब्लू",
  },
  te: {
    "500mg": "500 మి.గ్రా.",
    "650mg": "650 మి.గ్రా.",
    "10mg": "10 మి.గ్రా.",
    "120mg": "120 మి.గ్రా.",
    "625mg": "625 మి.గ్రా.",
    "21.8g sachet": "21.8 గ్రాముల ప్యాకెట్",
    "10ml": "10 మి.లీ.",
    "5% w/w": "5% w/w",
  },
  ml: {
    "500mg": "500 മില്ലിഗ്രാം",
    "650mg": "650 മില്ലിഗ്രാം",
    "10mg": "10 മില്ലിഗ്രാം",
    "120mg": "120 മില്ലിഗ്രാം",
    "625mg": "625 മില്ലിഗ്രാം",
    "21.8g sachet": "21.8 ഗ്രാം സാച്ചെറ്റ്",
    "10ml": "10 മി.ലി.",
    "5% w/w": "5% w/w",
  },
  kn: {
    "500mg": "500 ಮಿ.ಗ್ರಾಂ.",
    "650mg": "650 ಮಿ.ಗ್ರಾಂ.",
    "10mg": "10 ಮಿ.ಗ್ರಾಂ.",
    "120mg": "120 ಮಿ.ಗ್ರಾಂ.",
    "625mg": "625 ಮಿ.ಗ್ರಾಂ.",
    "21.8g sachet": "21.8 ಗ್ರಾಂ ಪಾಕೆಟ್",
    "10ml": "10 ಮಿ.ಲೀ.",
    "5% w/w": "5% w/w",
  },
};

const SENTENCE_MAPS = {
  ta: {
    "Cuts and scrapes": "வெட்டுகள் மற்றும் உராய்வுகள்",
    "Superficial burns": "மேலோட்டமான தீக்காயங்கள்",
    "Surgical wound care": "அறுவை சிகிச்சை காய பராமரிப்பு",
    "Throat gargle for infection": "தொற்றுநோய்க்கான தொண்டை வாய் கொப்பளிப்பு",
    "Apply ointment or solution 1–2 times daily to cleaned wound.": "சுத்தம் செய்யப்பட்ட காயத்தில் 1-2 முறை களிம்பு அல்லது கரைசலை தடவவும்.",
    "Under pediatric guidance.": "குழந்தை மருத்துவ வழிகாட்டுதலின் கீழ்.",
    "Take when remembered.": "நினைவில் வரும்போது எடுத்துக்கொள்ளவும்.",
    "Seek immediate medical evaluation.": "உடனடி மருத்துவ மதிப்பீட்டைப் பெறவும்.",
    "Mild gastrointestinal discomfort or local transient sensation.": "மிதமான இரைப்பை குடல் கோளாறு அல்லது உள்ளூர் தற்காலிக உணர்வு.",
    "Allergic reaction.": "ஒவ்வாமை எதிர்வினை.",
    "Nausea": "குமட்டல்",
    "Stomach upset": "வயிற்று உபாதை",
    "Skin rash": "தோல் தடிப்பு",
    "Drowsiness": "தூக்கம்",
    "Dry mouth": "வறண்ட வாய்",
    "Mild bloating": "மிதமான வயிற்று உப்பசம்",
    "Fever": "காய்ச்சல்",
    "Headache": "தலைவலி",
    "Body ache": "உடல் வலி",
    "Toothache": "பல் வலி",
    "Cold-related pain": "சளி சார்ந்த வலி",
    "Allergic rhinitis": "ஒவ்வாமை மூக்கடைப்பு",
    "Sneezing": "தும்மல்",
    "Runny nose": "மூக்கு ஒழுகுதல்",
    "Itchy/watery eyes": "அரிப்பு/நீர்வடியும் கண்கள்",
    "Dehydration": "நீரிழப்பு",
    "Diarrhea": "வயிற்றுப்போக்கு",
    "Heat exhaustion": "வெப்ப சோர்வு",
    "Vomiting": "வாந்தி",
    "Acidity": "அமிலத்தன்மை",
    "Heartburn": "நெஞ்செரிச்சல்",
    "Gas/bloating": "வாயு/வயிற்று உப்பசம்",
    "Indigestion": "செரியாமை",
    "Bacterial infections": "பாக்டீரியா தொற்றுகள்",
    "Respiratory tract infections": "சுவாசப்பாதை தொற்றுகள்",
    "Urinary tract infections": "சிறுநீரகப்பாதை தொற்றுகள்",
    "Type 2 diabetes management": "டைப் 2 நீரிழிவு மேலாண்மை",
    "Blood sugar control": "ரத்த சர்க்கரை கட்டுப்பாடு",
    "Minor cuts": "சிறிய வெட்டுகள்",
    "Wounds": "காயங்கள்",
    "Burns": "தீக்காயங்கள்",
    "Skin infections": "தோல் தொற்றுகள்",
    "Considered safe at recommended doses — consult your doctor.": "பரிந்துரைக்கப்பட்ட அளவுகளில் பாதுகாப்பானது — உங்கள் மருத்துவரை அணுகவும்.",
    "Generally considered safe.": "பொதுவாக பாதுகாப்பானதாக கருதப்படுகிறது.",
    "Consult your doctor before use.": "பயன்படுத்துவதற்கு முன் உங்கள் மருத்துவரை அணுகவும்.",
    "Avoid regular alcohol use — increases liver damage risk.": "வழக்கமான மது அருந்துவதைத் தவிர்க்கவும் — கல்லீரல் பாதிப்பு ஆபத்தை அதிகரிக்கும்.",
    "Does not typically impair driving ability.": "பொதுவாக வாகனம் ஓட்டும் திறனை பாதிக்காது.",
    "Store below 30°C in a dry place, away from direct sunlight.": "நேரடி சூரிய ஒளியில் இருந்து விலகி, 30°C க்கு கீழே உலர்ந்த இடத்தில் சேமிக்கவும்.",
  },
  hi: {
    "Cuts and scrapes": "कटना और छिलना",
    "Superficial burns": "सतही जलन",
    "Surgical wound care": "सर्जिकल घाव की देखभाल",
    "Throat gargle for infection": "संक्रमण के लिए गरारे",
    "Apply ointment or solution 1–2 times daily to cleaned wound.": "साफ किए गए घाव पर दिन में 1-2 बार मलम या घोल लगाएं।",
    "Under pediatric guidance.": "बाल रोग विशेषज्ञ के मार्गदर्शन में।",
    "Take when remembered.": "याद आने पर लें।",
    "Seek immediate medical evaluation.": "तुरंत चिकित्सा सहायता लें।",
    "Mild gastrointestinal discomfort or local transient sensation.": "हल्की गैस्ट्रोइंटेस्टाइनल परेशानी या स्थानीय क्षणिक प्रभाव।",
    "Allergic reaction.": "एलर्जिक रिएक्शन।",
    "Nausea": "जी मिचलाना",
    "Stomach upset": "पेट खराब होना",
    "Skin rash": "त्वचा पर चकत्ते",
    "Drowsiness": "सुस्ती/नींद आना",
    "Dry mouth": "सूखा मुंह",
    "Mild bloating": "हल्का पेट फूलना",
    "Fever": "बुखार",
    "Headache": "सिरदर्द",
    "Body ache": "बदन दर्द",
    "Toothache": "दांत दर्द",
    "Cold-related pain": "सर्दी का दर्द",
    "Allergic rhinitis": "एलर्जिक राइनाइटिस",
    "Sneezing": "छींकना",
    "Runny nose": "बहती नाक",
    "Itchy/watery eyes": "खुजली/पानी भरी आंखें",
    "Dehydration": "निर्जलीकरण",
    "Diarrhea": "दस्त",
    "Heat exhaustion": "गर्मी की थकान",
    "Vomiting": "उल्टी",
    "Acidity": "एसिडिटी",
    "Heartburn": "सीने में जलन",
    "Gas/bloating": "गैस/पेट फूलना",
    "Indigestion": "अपच",
    "Bacterial infections": "बैक्टीरियल संक्रमण",
    "Respiratory tract infections": "श्वसन पथ के संक्रमण",
    "Urinary tract infections": "मूत्र मार्ग के संक्रमण",
    "Type 2 diabetes management": "टाइप 2 मधुमेह प्रबंधन",
    "Blood sugar control": "ब्लड शुगर नियंत्रण",
    "Minor cuts": "छोटे कट",
    "Wounds": "घाव",
    "Burns": "जलन",
    "Skin infections": "त्वचा संक्रमण",
  },
  te: {
    "Cuts and scrapes": "కోతలు మరియు గీతలు",
    "Superficial burns": "పైపూత బొబ్బలు",
    "Surgical wound care": "సర్జికల్ గాయం సంరక్షణ",
    "Throat gargle for infection": "ఇన్ఫెక్షన్ కోసం గొంతు కొప్పళించడం",
    "Apply ointment or solution 1–2 times daily to cleaned wound.": "శుభ్రం చేసిన గాయంపై రోజుకు 1-2 సార్లు లేపనం లేదా ద్రావణాన్ని రాయండి.",
    "Under pediatric guidance.": "పిల్లల వైద్యుని మార్గదర్శకత్వంలో.",
    "Take when remembered.": "గుర్తుకు వచ్చినప్పుడు తీసుకోండి.",
    "Seek immediate medical evaluation.": "వెంటనే వైద్య సహాయం పొందండి.",
    "Mild gastrointestinal discomfort or local transient sensation.": "లేలిత గ్యాస్ట్రోఇంటెస్టినల్ అసౌకర్యం లేదా స్థానిక తాత్కాలిక సంచలనం.",
    "Allergic reaction.": "అలెర్జిక్ ప్రతిచర్య.",
    "Nausea": "వాంతులు వచ్చే భావన",
    "Stomach upset": "కడుపు కలత",
    "Skin rash": "చర్మంపై దద్దుర్లు",
    "Drowsiness": "మత్తు",
    "Dry mouth": "నోరు ఎండిపోవడం",
    "Fever": "జ్వరం",
    "Headache": "తలనొప్పి",
    "Body ache": "ఒళ్ళు నొప్పులు",
  },
  ml: {
    "Cuts and scrapes": "മുറിവുകളും ചുരണ്ടലുകളും",
    "Superficial burns": "ഉപരിതല പൊള്ളലുകൾ",
    "Surgical wound care": "ശസ്ത്രക്രിയ മുറിവ് പരിചരണം",
    "Throat gargle for infection": "അണുബാധയ്ക്കുള്ള തൊണ്ട കഴുകൽ",
    "Apply ointment or solution 1–2 times daily to cleaned wound.": "വൃത്തിയാക്കിയ മുറിവിൽ ദിവസം 1-2 തവണ തൈലം അല്ലെങ്കിൽ ലായനി പുരട്ടുക.",
    "Under pediatric guidance.": "ശിശുരോഗ വിദഗ്ദ്ധന്റെ നിർദ്ദേശപ്രകാരം.",
    "Take when remembered.": "ഓർമ്മ വരുമ്പോൾ കഴിക്കുക.",
    "Seek immediate medical evaluation.": "ഉടൻ തന്നെ വൈദ്യസഹായം തേടുക.",
    "Mild gastrointestinal discomfort or local transient sensation.": "ലഘുവായ ഗ്യാസ്ട്രോഇന്റസ്റ്റൈനൽ അസ്വസ്ഥത അല്ലെങ്കിൽ പ്രാദേശിക താത്കാലിക അസ്വസ്ഥത.",
    "Allergic reaction.": "അലർജി പ്രകടനങ്ങൾ.",
    "Nausea": "ഛർദ്ദി തോനൽ",
    "Stomach upset": "വയറുവേദന/അസ്വസ്ഥത",
    "Fever": "പനി",
    "Headache": "തലവേദന",
    "Body ache": "ശരീരവേദന",
  },
  kn: {
    "Cuts and scrapes": "ಗಾಯಗಳು ಮತ್ತು ಗೀಚುಗಳು",
    "Superficial burns": "ಮೇಲ್ಮೈ ಸುಟ್ಟಗಾಯಗಳು",
    "Surgical wound care": "ಶಸ್ತ್ರಚಿಕಿತ್ಸಾ ಗಾಯದ ಆರೈಕೆ",
    "Throat gargle for infection": "ಸೋಂಕಿಗೆ ಗಂಟಲು ಮುಕ್ಕಳಿಸುವುದು",
    "Apply ointment or solution 1–2 times daily to cleaned wound.": "ಶುಚಿಗೊಳಿಸಿದ ಗಾಯದ ಮೇಲೆ ದಿನಕ್ಕೆ 1-2 ಬಾರಿ ಮುಲಾಮು ಅಥವಾ ದ್ರಾವಣವನ್ನು ಹಚ್ಚಿ.",
    "Under pediatric guidance.": "ಮಕ್ಕಳ ವೈದ್ಯರ ಮಾರ್ಗದರ್ಶನದಲ್ಲಿ.",
    "Take when remembered.": "ನೆನಪಾದಾಗ ತೆಗೆದುಕೊಳ್ಳಿ.",
    "Seek immediate medical evaluation.": "ತಕ್ಷಣವೇ ವೈದ್ಯಕೀಯ ಮೌಲ್ಯಮಾಪನ ಪಡೆಯಿರಿ.",
    "Mild gastrointestinal discomfort or local transient sensation.": "ಸೌಮ್ಯವಾದ ಜಠರಗಾತ್ರದ ಅಸ್ವಸ್ಥತೆ ಅಥವಾ ಸ್ಥಳೀಯ ತಾತ್ಕಾಲಿಕ ಅನುಭವ.",
    "Allergic reaction.": "ಅಲರ್ಜಿ ಪ್ರತಿಕ್ರಿಯೆ.",
    "Nausea": "ವಾಕರಿಕೆ",
    "Stomach upset": "ಹೊಟ್ಟೆ ತೊಂದರೆ",
    "Fever": "ಜ್ವರ",
    "Headache": "ತಲೆನೋವು",
    "Body ache": "ಮೈ ಕೈ ನೋವು",
  },
};

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
  const match = str.match(/(\d+)\s*min\s*(drive|walk)/i);
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
    const key = `address.${result}`;
    const translated = t(key);
    if (translated && translated !== key) {
      return translated;
    }
  }

  const map = LOCATION_MAPS[lang];
  if (map) {
    Object.keys(map).forEach((term) => {
      const regex = new RegExp(`\\b${term}\\b`, "gi");
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
    const key = `hospital.name.${name}`;
    const translated = t(key);
    if (translated && translated !== key) return translated;
  }
  return name;
}

export function formatPharmacyName(name, t) {
  if (!name) return "";
  if (t && typeof t === "function") {
    const key = `pharmacy.name.${name}`;
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
  if (map && map[brandName]) return map[brandName];
  return brandName;
}

export function formatGenericName(genericName, langCode = "en") {
  if (!genericName || langCode === "en") return genericName || "";
  const map = GENERIC_NAME_MAPS[langCode];
  if (map && map[genericName]) return map[genericName];
  return genericName;
}

export function formatManufacturer(mfg, langCode = "en") {
  if (!mfg || langCode === "en") return mfg || "";
  const map = MANUFACTURER_MAPS[langCode];
  if (map && map[mfg]) return map[mfg];
  return mfg;
}

export function formatStrength(strength, langCode = "en") {
  if (!strength || langCode === "en") return strength || "";
  const map = STRENGTH_MAPS[langCode];
  if (map && map[strength]) return map[strength];
  return strength;
}

export function formatPackSize(packSize, langCode = "en") {
  if (!packSize || langCode === "en") return packSize || "";
  const map = PACK_SIZE_MAPS[langCode];
  if (map && map[packSize]) return map[packSize];
  return packSize;
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

