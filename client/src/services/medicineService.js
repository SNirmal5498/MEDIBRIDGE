import api from "./api";

/**
 * Normalizes medicine records at the service boundary so that frontend components
 * always receive consistent properties even if optional DB fields are omitted.
 */
export function normalizeMedicine(item) {
  if (!item || typeof item !== "object") return null;

  const id = item.id || (item._id ? String(item._id) : "");
  const _id = item._id ? String(item._id) : id;
  const brand = item.brand || item.name || "";
  const name = item.name || brand || "";
  const genericName = item.genericName || item.composition || "";
  const composition = item.composition || genericName || "";
  const strength = item.strength || "";
  const manufacturer = item.manufacturer || "";
  const category = item.category || "";
  const dosageForm = item.dosageForm || item.form || "";
  const packSize = item.packSize || "";
  const description = item.description || item.shortDescription || "";

  const isOtc = item.otc === true || item.prescriptionRequired === false;
  const prescriptionRequired = item.prescriptionRequired === true || item.otc === false;

  const price = typeof item.price === "number" ? item.price : parseFloat(item.price) || 0;
  const rating = typeof item.rating === "number" ? item.rating : 4.5;
  const popularity = typeof item.popularity === "number" ? item.popularity : 0;

  const badges =
    item.badges && typeof item.badges === "object"
      ? {
          bestSeller: Boolean(item.badges.bestSeller),
          topRated: Boolean(item.badges.topRated),
          lowestPrice: Boolean(item.badges.lowestPrice),
        }
      : {
          bestSeller: false,
          topRated: false,
          lowestPrice: false,
        };

  const uses = Array.isArray(item.uses) ? item.uses : [];
  const warnings = item.warnings && typeof item.warnings === "object" ? item.warnings : {};
  const sideEffects = item.sideEffects && typeof item.sideEffects === "object" ? item.sideEffects : {};
  const dosage = item.dosage && typeof item.dosage === "object" ? item.dosage : {};
  const alternatives = Array.isArray(item.alternatives) ? item.alternatives : [];
  const activeIngredients = Array.isArray(item.activeIngredients) ? item.activeIngredients : [];

  return {
    ...item,
    id,
    _id,
    brand,
    name,
    genericName,
    composition,
    strength,
    manufacturer,
    category,
    dosageForm,
    packSize,
    description,
    otc: isOtc,
    isOtc,
    prescriptionRequired,
    price,
    rating,
    popularity,
    badges,
    uses,
    warnings,
    sideEffects,
    dosage,
    alternatives,
    activeIngredients,
  };
}

export const medicineService = {
  /**
   * Search and filter medicines with pagination
   * @param {Object|string} params Query string or params object { q, search, page, limit, category, filter, sort, manufacturer, lang, fields }
   */
  async search(params) {
    const queryParams = typeof params === "string" ? { q: params } : params || {};
    const response = await api.get("/medicines", { params: queryParams });
    const data = response.data || {};

    const rawList = Array.isArray(data.medicines)
      ? data.medicines
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];

    const medicines = rawList.map(normalizeMedicine).filter(Boolean);

    const total = data.total ?? data.pagination?.total ?? medicines.length;
    const page = data.page ?? data.pagination?.page ?? (queryParams.page || 1);
    const limit = data.limit ?? data.pagination?.limit ?? (queryParams.limit || 12);
    const totalPages = data.totalPages ?? data.pagination?.totalPages ?? (Math.ceil(total / limit) || 1);

    const pagination = {
      total,
      page,
      totalPages,
      limit,
    };

    return {
      medicines,
      data: medicines,
      pagination,
    };
  },

  /**
   * Get medicine by ID or slug
   * @param {string} id
   * @param {string} lang
   */
  async getById(id, lang = "en") {
    const response = await api.get(`/medicines/${id}`, { params: { lang } });
    const data = response.data || {};
    const raw = data.medicine || data.data || data;
    const medicine = normalizeMedicine(raw);
    return {
      medicine,
      data: medicine,
    };
  },

  /**
   * Get generic alternatives for a medicine
   * @param {string} id
   * @param {string} lang
   */
  async getAlternatives(id, lang = "en") {
    const response = await api.get(`/medicines/${id}/alternatives`, { params: { lang } });
    const data = response.data || {};
    const rawList = Array.isArray(data.alternatives)
      ? data.alternatives
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
    const alternatives = rawList.map(normalizeMedicine).filter(Boolean);
    return {
      alternatives,
      data: alternatives,
    };
  },

  /**
   * Get popular medicines
   * @param {number} limit
   * @param {string} lang
   */
  async getPopular(limit = 4, lang = "en") {
    const response = await api.get("/medicines/popular", { params: { limit, lang } });
    const data = response.data || {};
    const rawList = Array.isArray(data.medicines)
      ? data.medicines
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
    const medicines = rawList.map(normalizeMedicine).filter(Boolean);
    return {
      medicines,
      data: medicines,
    };
  },

  /**
   * Get list of categories with active medicine counts
   */
  async getCategories() {
    const response = await api.get("/medicines/categories");
    const data = response.data || {};
    const categories = Array.isArray(data.categories) ? data.categories : [];
    return {
      categories,
      data: categories,
    };
  },

  /**
   * Compare two medicines
   * @param {string} idA
   * @param {string} idB
   * @param {string} lang
   */
  async compare(idA, idB, lang = "en") {
    const response = await api.get("/medicines/compare", { params: { a: idA, b: idB, lang } });
    const data = response.data || {};
    const rawList = Array.isArray(data.medicines)
      ? data.medicines
      : Array.isArray(data.data)
      ? data.data
      : Array.isArray(data)
      ? data
      : [];
    const medicines = rawList.map(normalizeMedicine).filter(Boolean);
    return {
      medicines,
      data: medicines,
    };
  },
};

export default medicineService;