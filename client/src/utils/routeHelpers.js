/**
 * Centralized route helpers for MediBridge application.
 * Ensures consistent URL patterns and proper identifier encoding across all features.
 */

/**
 * Generates the canonical URL path for a medicine details page.
 * Accepts either a medicine object (with id or _id) or an identifier string.
 *
 * @param {Object|string} medicineOrId
 * @returns {string} Path like "/medicine/allegra-120-120mg"
 */
export function getMedicineDetailsPath(medicineOrId) {
  if (!medicineOrId) return "/medicine";

  const rawId =
    typeof medicineOrId === "object"
      ? (medicineOrId.id || medicineOrId._id || medicineOrId.slug || "")
      : String(medicineOrId || "");

  const id = rawId.trim();
  if (!id) return "/medicine";

  return `/medicine/${encodeURIComponent(id)}`;
}
