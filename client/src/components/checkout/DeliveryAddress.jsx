import { MapPin, Phone, Save } from "lucide-react";
import Button from "../common/Button";
import { useLanguage } from "../../context/LanguageContext";

export default function DeliveryAddress({ address, onChange, onSave, user }) {
  const { t } = useLanguage();

  const handleChange = (field, value) => {
    onChange({ ...address, [field]: value });
  };

  const handleSave = () => {
    onSave(address);
  };

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">{t("checkout.deliveryAddress")}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.fullName")}</label>
          <input
            type="text"
            value={address.fullName || user?.name || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder={t("checkout.enterFullName")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.phone")}</label>
          <input
            type="tel"
            value={address.phone || user?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder={t("checkout.enterPhone")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.houseFlat")}</label>
          <input
            type="text"
            value={address.houseFlat || user?.address?.houseFlat || ""}
            onChange={(e) => handleChange("houseFlat", e.target.value)}
            placeholder={t("checkout.enterHouse")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.streetRoad")}</label>
          <input
            type="text"
            value={address.streetRoad || user?.address?.streetRoad || ""}
            onChange={(e) => handleChange("streetRoad", e.target.value)}
            placeholder={t("checkout.enterStreet")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.area")}</label>
          <input
            type="text"
            value={address.area || user?.address?.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            placeholder={t("checkout.enterArea")}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.city")}</label>
            <input
              type="text"
              value={address.city || user?.address?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder={t("checkout.city")}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.state")}</label>
            <input
              type="text"
              value={address.state || user?.address?.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder={t("checkout.state")}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">{t("checkout.pincode")}</label>
          <input
            type="text"
            value={address.pincode || user?.address?.pincode || ""}
            onChange={(e) => handleChange("pincode", e.target.value)}
            placeholder={t("checkout.enterPincode")}
            maxLength={6}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button onClick={handleSave} variant="secondary" size="sm" icon={Save} className="w-full">
          {t("checkout.saveAddress")}
        </Button>
      </div>
    </div>
  );
}

