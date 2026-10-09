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
  formatMedicineText,
} from "../utils/formatters";
import { useDynamicTranslation } from "./useDynamicTranslation";

/**
 * Single, unified medicine-card localization hook.
 * Processes all card display fields using the active language pipeline.
 */
export function useMedicineCardLocalization(medicine) {
  const { language, t } = useLanguage();
  const langCode = language?.code || "en";

  // Dynamic translation call for API medicine objects
  const { data: dynamicMed } = useDynamicTranslation(medicine, "medicine");

  // Determine active medicine object, guarding against stale cross-language objects
  const activeMed = useMemo(() => {
    if (!medicine || typeof medicine !== "object") return {};
    if (dynamicMed && typeof dynamicMed === "object") {
      return dynamicMed;
    }
    return medicine;
  }, [medicine, dynamicMed]);

  const localized = useMemo(() => {
    if (!activeMed || typeof activeMed !== "object") {
      return {};
    }

    const sourceBrand = activeMed.brand || activeMed.name || medicine?.brand || medicine?.name || "";
    let brand = formatBrandName(sourceBrand, langCode);
    if (brand === sourceBrand && langCode !== "en") {
      if (activeMed.brand && activeMed.brand !== sourceBrand) {
        brand = activeMed.brand;
      } else if (activeMed.name && activeMed.name !== sourceBrand) {
        brand = activeMed.name;
      }
    }

    const sourceGeneric =
      activeMed.genericName ||
      activeMed.composition ||
      medicine?.genericName ||
      medicine?.composition ||
      "";
    let genericName = formatGenericName(sourceGeneric, langCode);
    if (genericName === sourceGeneric && langCode !== "en") {
      if (activeMed.genericName && activeMed.genericName !== sourceGeneric) {
        genericName = activeMed.genericName;
      } else if (activeMed.composition && activeMed.composition !== sourceGeneric) {
        genericName = activeMed.composition;
      }
    }

    const sourceCategory = activeMed.category || medicine?.category || "";
    const category = getCategoryTranslation(langCode, sourceCategory);

    const sourceForm = activeMed.dosageForm || activeMed.form || medicine?.dosageForm || medicine?.form || "";
    let dosageForm = formatDosageForm(sourceForm, langCode);
    if (dosageForm === sourceForm && langCode !== "en") {
      if (activeMed.dosageForm && activeMed.dosageForm !== sourceForm) {
        dosageForm = activeMed.dosageForm;
      }
    }

    const sourceStrength = activeMed.strength || medicine?.strength || "";
    const strength = formatStrength(sourceStrength, langCode);

    const sourceMfg = activeMed.manufacturer || medicine?.manufacturer || "";
    let manufacturer = formatManufacturer(sourceMfg, langCode);
    if (manufacturer === sourceMfg && langCode !== "en" && activeMed.manufacturer && activeMed.manufacturer !== sourceMfg) {
      manufacturer = activeMed.manufacturer;
    }

    const sourcePack = activeMed.packSize || medicine?.packSize || "";
    const packSize = formatPackSize(sourcePack, langCode);

    const isOtc =
      activeMed.otc === true ||
      activeMed.prescriptionRequired === false ||
      medicine?.otc === true ||
      medicine?.prescriptionRequired === false;

    const otcLabel = isOtc ? t("medicine.otc") : t("medicine.prescriptionRequired");

    return {
      id: activeMed.id || activeMed._id || medicine?.id || medicine?._id,
      brand,
      genericName,
      category,
      dosageForm,
      strength,
      manufacturer,
      packSize,
      isOtc,
      otcLabel,
      price: activeMed.price ?? medicine?.price,
      rating: activeMed.rating ?? medicine?.rating,
      badges: activeMed.badges || medicine?.badges,
      raw: activeMed,
    };
  }, [activeMed, medicine, langCode, t]);

  return localized;
}
