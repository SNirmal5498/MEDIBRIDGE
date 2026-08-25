import { MapPin, Phone, Save } from "lucide-react";
import Button from "../common/Button";

export default function DeliveryAddress({ address, onChange, onSave, user }) {
  const handleChange = (field, value) => {
    onChange({ ...address, [field]: value });
  };

  const handleSave = () => {
    onSave(address);
  };

  return (
    <div className="card p-6">
      <h3 className="font-display font-bold text-lg text-text mb-4">Delivery Address</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">Full Name</label>
          <input
            type="text"
            value={address.fullName || user?.name || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">Phone Number</label>
          <input
            type="tel"
            value={address.phone || user?.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">House / Flat Number</label>
          <input
            type="text"
            value={address.houseFlat || user?.address?.houseFlat || ""}
            onChange={(e) => handleChange("houseFlat", e.target.value)}
            placeholder="Enter house/flat number"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">Street / Road</label>
          <input
            type="text"
            value={address.streetRoad || user?.address?.streetRoad || ""}
            onChange={(e) => handleChange("streetRoad", e.target.value)}
            placeholder="Enter street/road name"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">Area</label>
          <input
            type="text"
            value={address.area || user?.address?.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            placeholder="Enter area"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">City</label>
            <input
              type="text"
              value={address.city || user?.address?.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="City"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-text mb-1.5">State</label>
            <input
              type="text"
              value={address.state || user?.address?.state || ""}
              onChange={(e) => handleChange("state", e.target.value)}
              placeholder="State"
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-text mb-1.5">Pincode</label>
          <input
            type="text"
            value={address.pincode || user?.address?.pincode || ""}
            onChange={(e) => handleChange("pincode", e.target.value)}
            placeholder="Enter 6-digit pincode"
            maxLength={6}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-card text-text focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button onClick={handleSave} variant="secondary" size="sm" icon={Save} className="w-full">
          Save Address
        </Button>
      </div>
    </div>
  );
}
