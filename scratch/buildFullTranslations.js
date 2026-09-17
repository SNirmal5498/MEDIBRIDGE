const fs = require('fs');
const path = require('path');

const targetPath = 'd:/Projects/MEDIBRIDGE/client/src/i18n/translations.js';

let content = fs.readFileSync(targetPath, 'utf8');

const extraKeys = {
  // Steps
  "steps.searchDesc": {
    en: "Type a medicine name",
    hi: "दवा का नाम टाइप करें",
    ta: "மருந்தின் பெயரைத் தட்டச்சு செய்யவும்",
    te: "మందు పేరును టైప్ చేయండి",
    ml: "മരുന്നിന്റെ പേര് ടൈപ്പ് ചെയ്യുക",
    kn: "ಔಷಧಿಯ ಹೆಸರನ್ನು ಟೈಪ್ ಮಾಡಿ"
  },
  "steps.selectDesc": {
    en: "Choose the exact match",
    hi: "सटीक मिलान चुनें",
    ta: "சரியான மருந்தைத் தேர்ந்தெடுக்கவும்",
    te: "సరైన మ్యాచ్‌ను ఎంచుకోండి",
    ml: "കൃത്യമായ മരുന്ന് തിരഞ്ഞെടുക്കുക",
    kn: "ಸರಿಯಾದ ಔಷಧಿಯನ್ನು ಆಯ್ಕೆಮಾಡಿ"
  },
  "steps.compareBrandsDesc": {
    en: "See alternate brands side by side",
    hi: "वैकल्पिक ब्रांडों को अगल-बगल देखें",
    ta: "மாற்று பிராண்டுகளை பக்கவாட்டில் காண்க",
    te: "ప్రత్యామ్నాయ బ్రాండ్‌లను పక్కపక్కనే చూడండి",
    ml: "മറ്റ് ബ്രാൻഡുകൾ ഒപ്പത്തിനൊപ്പം കാണുക",
    kn: "ಪರ್ಯಾಯ ಬ್ರಾಂಡ್‌ಗಳನ್ನು ಅಕ್ಕಪಕ್ಕದಲ್ಲಿ ನೋಡಿ"
  },
  "steps.comparePricesDesc": {
    en: "Check price per brand",
    hi: "प्रति ब्रांड कीमत जांचें",
    ta: "பிராண்ட் வாரியாக விலையை சரிபார்க்கவும்",
    te: "బ్రాండ్ ఆధారంగా ధరను తనిఖీ చేయండి",
    ml: "ബ്രാൻഡ് വക വില പരിശോധിക്കുക",
    kn: "ಪ್ರತಿ ಬ್ರಾಂಡ್ ಬೆಲೆಯನ್ನು ಪರಿಶೀಲಿಸಿ"
  },
  "steps.findPharmacyDesc": {
    en: "Locate stock near you",
    hi: "अपने पास स्टॉक खोजें",
    ta: "உங்களுக்கு அருகில் இருப்பில் உள்ளதை கண்டறிக",
    te: "మీ దగ్గర ఉన్న స్టాక్‌ను కనుగొనండి",
    ml: "അടുത്തുള്ള സ്റ്റോക്ക് കണ്ടെത്തുക",
    kn: "ನಿಮ್ಮ ಹತ್ತಿರದ ಸ್ಟಾಕ್ ಹುಡುಕಿ"
  },
  "steps.orderOtcDesc": {
    en: "Only OTC medicines can be ordered",
    hi: "केवल ओटीसी दवाएं ही ऑर्डर की जा सकती हैं",
    ta: "OTC மருந்துகளை மட்டுமே ஆர்டர் செய்ய முடியும்",
    te: "OTC మందులను మాత్రమే ఆర్డర్ చేయవచ్చు",
    ml: "OTC മരുന്നുകൾ മാത്രമേ ഓർഡർ ചെയ്യാനാകൂ",
    kn: "OTC ಔಷಧಿಗಳನ್ನು ಮಾತ್ರ ಆರ್ಡರ್ ಮಾಡಬಹುದು"
  },

  // Testimonials
  "testimonials.t1.name": {
    en: "Ananya R.",
    hi: "अनन्या आर.",
    ta: "அனன்யா ஆர்.",
    te: "అనన్య ఆర్.",
    ml: "അനന്യ ആർ.",
    kn: "ಅನನ್ಯಾ ಆರ್."
  },
  "testimonials.t1.role": {
    en: "Caregiver",
    hi: "देखभालकर्ता",
    ta: "பராமரிப்பாளர்",
    te: "సంరక్షకులు",
    ml: "പരിപാലക",
    kn: "ಆರೈಕೆದಾರರು"
  },
  "testimonials.t1.quote": {
    en: "Finding a cheaper alternative for my mother's medicine used to take three pharmacy calls. Now it takes ten seconds.",
    hi: "मेरी मां की दवा का सस्ता विकल्प खोजने में पहले तीन फार्मेसी कॉल लगते थे। अब इसमें दस सेकंड लगते हैं।",
    ta: "எனது தாயாரின் மருந்துக்கு குறைந்த விலையிலான மாற்றைக் கண்டுபிடிக்க முன்பு மூன்று பார்மசிகளுக்கு அழைக்க வேண்டியிருந்தது. இப்போது பத்து வினாடிகளில் முடிகிறது.",
    te: "నా తల్లి మందుల కోసం తక్కువ ధర ప్రత్యామ్నాయాన్ని కనుగొనడం మునుపు మూడు ఫార్మసీ కాల్స్ తీసుకునేది. ఇప్పుడు పది సెకన్లు పడుతుంది.",
    ml: "അമ്മയുടെ മരുന്നിന് വില കുറഞ്ഞ പകരക്കാരനെ കണ്ടെത്താൻ പണ്ട് മൂന്ന് ഫാർമസികളിൽ വിളിക്കണമായിരുന്നു. ഇപ്പോൾ പത്ത് സെക്കൻഡ് മതി.",
    kn: "ನನ್ನ ತಾಯಿಯ ಔಷಧಿಗೆ ಅಗ್ಗದ ಪರ್ಯಾಯವನ್ನು ಹುಡುಕಲು ಮೊದಲು ಮೂರು ಫಾರ್ಮಸಿಗಳಿಗೆ ಕರೆ ಮಾಡಬೇಕಾಗಿತ್ತು. ಈಗ ಹತ್ತು ಸೆಕೆಂಡುಗಳು ಸಾಕು."
  },
  "testimonials.t2.name": {
    en: "Rahul K.",
    hi: "राहुल के.",
    ta: "ராகுல் கே.",
    te: "రాహుల్ కె.",
    ml: "രാഹുൽ കെ.",
    kn: "ರಾಹುಲ್ ಕೆ."
  },
  "testimonials.t2.role": {
    en: "Patient",
    hi: "मरीज़",
    ta: "நோயாளி",
    te: "రోగి",
    ml: "രോഗി",
    kn: "ರೋಗಿ"
  },
  "testimonials.t2.quote": {
    en: "The nearby pharmacy locator saved me a late-night drive to three different stores.",
    hi: "पास की फार्मेसी लोकेटर ने मुझे देर रात तीन अलग-अलग दुकानों पर जाने से बचा लिया।",
    ta: "அருகிலுள்ள பார்மசி கண்டறிவான் இரவில் மூன்று கடைகளுக்கு அலைவதிலிருந்து என்னை காப்பாற்றியது.",
    te: "దగ్గరలోని ఫార్మసీ లోకేటర్ నన్ను అర్థరాత్రి మూడు వేర్వేరు షాపులకు వెళ్లకుండా కాపాడింది.",
    ml: "അടുത്തുള്ള ഫാർമസി ലൊക്കേറ്റർ രാത്രി വൈകി മൂന്ന് കടകളിൽ കയറി ഇറങ്ങുന്നതിൽ നിന്നും എന്നെ രക്ഷിച്ചു.",
    kn: "ಹತ್ತಿರದ ಫಾರ್ಮಸಿ ಶೋಧಕವು ತಡರಾತ್ರಿ ಮೂರು ಬೇರೆ ಬೇರೆ ಅಂಗಡಿಗಳಿಗೆ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಿತು."
  },
  "testimonials.t3.name": {
    en: "Dr. Meera S.",
    hi: "डॉ. मीरा एस.",
    ta: "டாக்டர் மீரா எஸ்.",
    te: "డాక్టర్ మీరా ఎస్.",
    ml: "ഡോ. മീര എസ്.",
    kn: "ಡಾ. ಮೀರಾ ಎಸ್."
  },
  "testimonials.t3.role": {
    en: "General Physician",
    hi: "सामान्य चिकित्सक",
    ta: "பொது மருத்துவர்",
    te: "సాధారణ వైద్యులు",
    ml: "ജനറൽ ഫിസിഷ്യൻ",
    kn: "ಸಾಮಾನ್ಯ ವೈದ್ಯರು"
  },
  "testimonials.t3.quote": {
    en: "I like that prescription drugs are clearly separated from OTC — it keeps patients safe by default.",
    hi: "मुझे पसंद है कि डॉक्टर के पर्चे की दवाएं ओटीसी से स्पष्ट रूप से अलग की गई हैं - यह डिफ़ॉल्ट रूप से रोगियों को सुरक्षित रखती हैं।",
    ta: "மருத்துவ சீட்டு மருந்துகள் OTC இலிருந்து தெளிவாகப் பிரிக்கப்பட்டிருப்பது எனக்குப் பிடித்துள்ளது — இது நோயாளிகளைப் பாதுகாப்பாக வைக்கிறது.",
    te: "ప్రిస్క్రిప్షన్ డ్రగ్స్ OTC నుండి స్పష్టంగా వేరు చేయబడటం నాకు నచ్చింది - ఇది డిఫాల్ట్‌గా రోగులను సురక్షితంగా ఉంచుతుంది.",
    ml: "പ്രെയിസ്ക്രിപ്ഷൻ മരുന്നുകൾ ഒടിസിയിൽ നിന്ന് കൃത്യമായി വേർതിരിച്ചിരിക്കുന്നത് നന്നായിരിക്കുന്നു - ഇത് രോഗികളുടെ സുരക്ഷ ഉറപ്പാക്കുന്നു.",
    kn: "ಪ್ರಿಸ್ಕ್ರಿಪ್ಷನ್ ಔಷಧಿಗಳನ್ನು ಒಟಿಸಿಯಿಂದ ಸ್ಪಷ್ಟವಾಗಿ ಬೇರ್ಪಡಿಸಿರುವುದು ನನಗೆ ಇಷ್ಟವಾಗಿದೆ - ಇದು ರೋಗಿಗಳನ್ನು ಸುರಕ್ಷಿತವಾಗಿರಿಸುತ್ತದೆ."
  }
};

const langs = ['en', 'hi', 'ta', 'te', 'ml', 'kn'];

langs.forEach(lang => {
  const marker = `  ${lang}: {`;
  let idx = content.indexOf(marker);
  if (idx !== -1) {
    let insertPos = content.indexOf('{', idx) + 1;
    let newEntries = '\n';
    Object.keys(extraKeys).forEach(key => {
      const val = extraKeys[key][lang] || extraKeys[key].en;
      newEntries += `    "${key}": "${val.replace(/"/g, '\\"')}",\n`;
    });
    content = content.slice(0, insertPos) + newEntries + content.slice(insertPos);
  }
});

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully injected extra keys into translations.js');
