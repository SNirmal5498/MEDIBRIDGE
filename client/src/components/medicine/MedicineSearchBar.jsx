import MedicineAutocompleteSearch from "./MedicineAutocompleteSearch";
import { useLanguage } from "../../hooks/useLanguage";

export default function MedicineSearchBar({ value, onChange, onSelect, resultCount }) {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <MedicineAutocompleteSearch
        value={value}
        onChange={onChange}
        onSelect={onSelect}
        onSubmit={(q) => onChange(q)}
      />
      {value && resultCount !== undefined && (
        <p className="ml-1 text-xs text-text-muted">
          {resultCount} {t("medicine.resultsFound")}
        </p>
      )}
    </div>
  );
}