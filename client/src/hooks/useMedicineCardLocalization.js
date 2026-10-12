import { useMemo } from "react";
import { useLanguage } from "./useLanguage";
import { getCategoryTranslation } from "../i18n/i18n";
import {
  formatBrandName,
  formatGenericName,
  formatStrength,
  formatManufacturer,
  formatPackSize,
  formatDosageForm,
} from "../utils/formatters";
import { useDynamicTranslation } from "./useDynamicTranslation";

function pickLocalizedField(dynamicVal, staticVal, rawVal, langCode) {
  if (langCode === "en") return rawVal || "";

  // 1. If backend already provided translated text in target script
  if (rawVal && typeof rawVal === "string" && /[^\x00-\x7F]/.test(rawVal)) {
    return rawVal;
  }

  // 2. Prefer dynamic translation if it contains target non-ASCII script
  if (dynamicVal && typeof dynamicVal === "string" && dynamicVal.trim()) {
    if (/[^\x00-\x7F]/.test(dynamicVal) || dynamicVal.trim() !== String(rawVal).trim()) {
      return dynamicVal;
    }
  }

  // 3. Use static dictionary translation
  if (staticVal && typeof staticVal === "string" && staticVal.trim()) {
    return staticVal;
  }

  return rawVal || "";
}

/**
 * Single, unified medicine-card localization hook.
 * Establishes one authoritative display object per medicine card.
 */
export function useMedicineCardLocalization(medicine) {
  const { language, t } = useLanguage();
  const langCode = language?.code || "en";

  // Dynamic translation call for API medicine objects (background enhancement)
  const { data: dynamicMed, loading: dynamicLoading } = useDynamicTranslation(medicine, "medicine");

  const localized = useMemo(() => {
    if (!medicine || typeof medicine !== "object") {
      return { loading: false, isOtc: true, otcLabel: t("medicine.otc") };
    }

    const medId = medicine.id || medicine._id || "";
    const isOtc = medicine.otc === true || medicine.prescriptionRequired === false;
    const otcLabel = isOtc ? t("medicine.otc") : t("medicine.prescriptionRequired");

    if (langCode === "en") {
      return {
        id: medId,
        brand: medicine.brand || medicine.name || "",
        genericName: medicine.genericName || medicine.composition || "",
        category: medicine.category || "",
        dosageForm: medicine.dosageForm || medicine.form || "",
        strength: medicine.strength || "",
        manufacturer: medicine.manufacturer || "",
        packSize: medicine.packSize || "",
        description: medicine.description || medicine.shortDescription || "",
        uses: medicine.uses || [],
        isOtc,
        otcLabel,
        price: medicine.price,
        rating: medicine.rating,
        badges: medicine.badges,
        raw: medicine,
        loading: false,
      };
    }

    const rawBrand = medicine.brand || medicine.name || "";
    const rawGeneric = medicine.genericName || medicine.composition || "";
    const rawCategory = medicine.category || "";
    const rawForm = medicine.dosageForm || medicine.form || "";
    const rawStrength = medicine.strength || "";
    const rawMfg = medicine.manufacturer || "";
    const rawPack = medicine.packSize || "";
    const rawDesc = medicine.description || medicine.shortDescription || "";

    const staticBrand = formatBrandName(rawBrand, langCode);
    const brand = pickLocalizedField(dynamicMed?.brand || dynamicMed?.name, staticBrand, rawBrand, langCode);

    const staticGeneric = formatGenericName(rawGeneric, langCode);
    const genericName = pickLocalizedField(dynamicMed?.genericName || dynamicMed?.composition, staticGeneric, rawGeneric, langCode);

    const staticCategory = getCategoryTranslation(langCode, rawCategory);
    const category = pickLocalizedField(dynamicMed?.category, staticCategory, rawCategory, langCode);

    const staticForm = formatDosageForm(rawForm, langCode);
    const dosageForm = pickLocalizedField(dynamicMed?.dosageForm || dynamicMed?.form, staticForm, rawForm, langCode);

    const staticStrength = formatStrength(rawStrength, langCode);
    const strength = pickLocalizedField(dynamicMed?.strength, staticStrength, rawStrength, langCode);

    const staticMfg = formatManufacturer(rawMfg, langCode);
    const manufacturer = pickLocalizedField(dynamicMed?.manufacturer, staticMfg, rawMfg, langCode);

    const staticPack = formatPackSize(rawPack, langCode);
    const packSize = pickLocalizedField(dynamicMed?.packSize, staticPack, rawPack, langCode);

    const description = pickLocalizedField(dynamicMed?.description || dynamicMed?.shortDescription, null, rawDesc, langCode);

    const uses = (Array.isArray(dynamicMed?.uses) && dynamicMed.uses.length > 0)
      ? dynamicMed.uses
      : (medicine.uses || []);

    const resolvedOtc =
      medicine.otc === true ||
      medicine.prescriptionRequired === false ||
      dynamicMed?.otc === true ||
      dynamicMed?.prescriptionRequired === false;

    // A card is only "loading" if we literally have no brand or generic name ready yet
    const hasData = Boolean(brand || genericName || rawBrand);
    const isPending = !hasData && dynamicLoading;

    return {
      id: medId || dynamicMed?.id || dynamicMed?._id,
      brand,
      genericName,
      category,
      dosageForm,
      strength,
      manufacturer,
      packSize,
      description,
      uses,
      isOtc: resolvedOtc,
      otcLabel: resolvedOtc ? t("medicine.otc") : t("medicine.prescriptionRequired"),
      price: medicine.price ?? dynamicMed?.price,
      rating: medicine.rating ?? dynamicMed?.rating,
      badges: medicine.badges || dynamicMed?.badges,
      raw: dynamicMed || medicine,
      loading: isPending,
    };
  }, [medicine, dynamicMed, dynamicLoading, langCode, t]);

  return localized;
}
