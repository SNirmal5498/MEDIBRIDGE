// Realistic pharmacy dataset for the Nearby Pharmacy page.
// Swap getNearbyPharmacies() for a real geolocation-based API call later.

export const NEARBY_PHARMACIES = [];

export function getNearbyPharmacies() {
  return NEARBY_PHARMACIES;
}

export function getPharmacyById(id) {
  return NEARBY_PHARMACIES.find((p) => p.id === id) || null;
}

const SAVED_PHARMACIES_KEY = "medibridge_saved_pharmacies";

export function getSavedPharmacyIds() {
  return JSON.parse(localStorage.getItem(SAVED_PHARMACIES_KEY) || "null") ?? null;
}

export function setSavedPharmacyIds(ids) {
  localStorage.setItem(SAVED_PHARMACIES_KEY, JSON.stringify(ids));
  return ids;
}

export function removeSavedPharmacy(id) {
  const current = getSavedPharmacyIds() ?? [];
  const updated = current.filter((x) => x !== id);
  return setSavedPharmacyIds(updated);
}

export function getSavedPharmacies() {
  const ids = getSavedPharmacyIds();
  if (!ids) {
    return [];
  }
  return ids.map((id) => getPharmacyById(id)).filter(Boolean);
}