const {
  formatCompositionPhrase,
  formatGenericName,
  formatStrength,
} = require("../client/src/utils/formatters.js");

const testPhrases = [
  "Multi B-Complex + Vit C",
  "B-Complex + Vit C + Zinc",
  "Iron + B12",
  "Povidone Iodine Antiseptic",
  "Chloroxylenol",
];

const languages = ["ta", "hi", "te", "ml", "kn"];

console.log("=== COMPOSITION PHRASE LOCALIZATION TEST ===");

let hasFailure = false;

languages.forEach((lang) => {
  console.log(`\n--- Language: ${lang} ---`);
  testPhrases.forEach((phrase) => {
    const formatted = formatCompositionPhrase(phrase, lang);
    console.log(`[${lang}] "${phrase}" -> "${formatted}"`);
    if (formatted === phrase) {
      console.error(`❌ FAILED: Phrase "${phrase}" was not localized for language ${lang}!`);
      hasFailure = true;
    }
  });
});

if (hasFailure) {
  console.error("\n❌ TESTS FAILED: Some composition phrases are missing localizations!");
  process.exit(1);
} else {
  console.log("\n✅ ALL COMPOSITION PHRASES SUCCESSFULLY LOCALIZED ACROSS ALL 5 LANGUAGES!");
}
