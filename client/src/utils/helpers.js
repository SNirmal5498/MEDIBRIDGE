// Shared formatting and data-shaping helpers used across pages/components.

/**
 * Format a number as an Indian Rupee amount, e.g. 18 -> "₹18".
 */
export function formatINR(amount) {
  if (amount === undefined || amount === null) return "—";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

/**
 * Group a flat list of medicines by their generic `name`, so brand
 * alternatives (e.g. Crocin / Dolo / Calpol, all "Paracetamol") sit together.
 * Returns a Map<genericName, medicine[]>.
 */
export function groupByGeneric(medicines) {
  const map = new Map();
  for (const med of medicines) {
    const key = med.name;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(med);
  }
  return map;
}

/**
 * Given one medicine and the full list it came from, return the other
 * brands that share the same generic name (i.e. the "compare" set).
 */
export function getAlternatives(medicine, allMedicines) {
  if (!medicine) return [];
  return allMedicines.filter(
    (m) => m.name === medicine.name && m.id !== medicine.id
  );
}

/**
 * Case-insensitive substring match across a medicine's searchable fields.
 */
export function matchesQuery(medicine, query) {
  if (!query?.trim()) return true;
  const q = query.trim().toLowerCase();
  return (
    medicine.name.toLowerCase().includes(q) ||
    medicine.brand.toLowerCase().includes(q) ||
    medicine.manufacturer.toLowerCase().includes(q)
  );
}