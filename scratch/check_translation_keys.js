import translations from "../client/src/i18n/translations.js";

const langs = ['en', 'hi', 'ta', 'te', 'ml', 'kn'];
const keysToCheck = [
  'medicine.title', 'medicine.loading', 'medicine.otc', 'medicine.prescriptionRequired',
  'medicine.orderNow', 'medicine.compare', 'medicine.bestSeller', 'medicine.topRated',
  'medicine.lowestPrice', 'medicine.viewDetails', 'medicine.selected',
  'details.brand', 'details.genericName', 'details.manufacturer', 'details.rating',
  'details.price', 'details.uses', 'details.dosage', 'details.adults', 'details.children',
  'details.missedDose', 'details.overdose', 'details.sideEffects', 'details.commonSideEffects',
  'details.rareSideEffects', 'details.warnings', 'details.pregnancy', 'details.breastfeeding',
  'details.kidneyDisease', 'details.liverDisease', 'details.alcohol', 'details.driving',
  'details.drugInteractions', 'details.noInteractions', 'details.foodInteractions',
  'details.beforeFood', 'details.afterFood', 'details.foodsToAvoid', 'details.storage',
  'details.alternatives', 'details.nearbyPharmacies'
];

let missingCount = 0;
for (const key of keysToCheck) {
  const [ns, k] = key.split('.');
  const missing = [];
  for (const lang of langs) {
    if (!translations[lang] || !translations[lang][ns] || !translations[lang][ns][k]) {
      missing.push(lang);
    }
  }
  if (missing.length > 0) {
    console.log('KEY MISSING:', key, '--> in languages:', missing.join(', '));
    missingCount++;
  }
}
if (missingCount === 0) {
  console.log('ALL KEYS PRESENT ACROSS ALL 6 LANGUAGES!');
}
