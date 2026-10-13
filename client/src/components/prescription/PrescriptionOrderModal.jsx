import { useState } from "react";
import { X, CheckCircle, ShieldCheck, MapPin, CreditCard, Loader2, Building2 } from "lucide-react";
import prescriptionService from "../../services/prescriptionService";
import Button from "../common/Button";

export default function PrescriptionOrderModal({
  isOpen,
  onClose,
  prescription,
  medicine,
  user,
  onOrderSuccess,
}) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    houseFlat: "",
    streetRoad: "",
    area: "",
    city: "Coimbatore",
    state: "Tamil Nadu",
    pincode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !prescription) return null;

  const unitPrice = medicine?.price || 100;
  const deliveryFee = 40;
  const subtotal = unitPrice * quantity;
  const totalAmount = subtotal + deliveryFee;

  const handleAddressChange = (field, val) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: val }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!deliveryAddress.fullName || !deliveryAddress.phone || !deliveryAddress.pincode) {
      setError("Please provide your full name, contact phone, and delivery pincode.");
      return;
    }

    if (!deliveryAddress.houseFlat || !deliveryAddress.streetRoad) {
      setError("Please fill in your delivery street address.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        quantity,
        paymentMethod,
        deliveryAddress,
      };

      const res = await prescriptionService.requestOrder(prescription._id, payload);
      if (res?.success) {
        if (onOrderSuccess) {
          onOrderSuccess(res.order, res.message);
        }
        onClose();
      } else {
        setError(res?.message || "Failed to submit prescription order request.");
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "Failed to submit prescription order request."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div>
            <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <span>Request Prescription Dispensing</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Verified Rx
              </span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Order request directly mediated by your assigned partner pharmacy.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 font-semibold text-xs">
              {error}
            </div>
          )}

          {/* Pharmacy & Medicine Details Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600">Prescription Medicine:</span>
              <span className="font-extrabold text-teal-800 text-sm">
                {prescription.medicineName || medicine?.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-600 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Dispensing Partner:
              </span>
              <span className="font-semibold text-slate-800">
                {prescription.pharmacyName || "Assigned Partner Pharmacy"}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-600">Dispensing Quantity:</span>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 5].map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuantity(q)}
                    className={`w-7 h-7 rounded-lg font-bold border transition-colors ${
                      quantity === q
                        ? "bg-teal-700 text-white border-teal-700"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-3">
            <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              Delivery Address
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Recipient Name</span>
                <input
                  type="text"
                  required
                  value={deliveryAddress.fullName}
                  onChange={(e) => handleAddressChange("fullName", e.target.value)}
                  placeholder="Full Name"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Phone Number</span>
                <input
                  type="tel"
                  required
                  value={deliveryAddress.phone}
                  onChange={(e) => handleAddressChange("phone", e.target.value)}
                  placeholder="+91 Mobile number"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Flat / House No.</span>
                <input
                  type="text"
                  required
                  value={deliveryAddress.houseFlat}
                  onChange={(e) => handleAddressChange("houseFlat", e.target.value)}
                  placeholder="Flat 101, Oak Apartments"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Street / Colony</span>
                <input
                  type="text"
                  required
                  value={deliveryAddress.streetRoad}
                  onChange={(e) => handleAddressChange("streetRoad", e.target.value)}
                  placeholder="Gandhi Road, RS Puram"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] font-semibold text-slate-500">City</span>
                <input
                  type="text"
                  value={deliveryAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500">State</span>
                <input
                  type="text"
                  value={deliveryAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
              <div>
                <span className="text-[11px] font-semibold text-slate-500">Pincode</span>
                <input
                  type="text"
                  required
                  value={deliveryAddress.pincode}
                  onChange={(e) => handleAddressChange("pincode", e.target.value)}
                  placeholder="641002"
                  className="w-full mt-1 p-2 border border-slate-200 rounded-lg font-medium focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-teal-600" />
              Payment Preference
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                  paymentMethod === "cod"
                    ? "bg-teal-50 border-teal-600 text-teal-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 font-medium"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  className="accent-teal-700"
                />
                <span>Cash on Delivery</span>
              </label>

              <label
                className={`p-3 rounded-xl border flex items-center gap-2.5 cursor-pointer transition-colors ${
                  paymentMethod === "upi"
                    ? "bg-teal-50 border-teal-600 text-teal-900 font-bold"
                    : "bg-white border-slate-200 text-slate-600 font-medium"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={() => setPaymentMethod("upi")}
                  className="accent-teal-700"
                />
                <span>UPI / Online</span>
              </label>
            </div>
          </div>

          {/* Cost Summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Medicine Total ({quantity} unit{quantity > 1 ? "s" : ""})</span>
              <span className="font-bold text-slate-800">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Pharmacy Delivery Fee</span>
              <span className="font-bold text-slate-800">₹{deliveryFee}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-extrabold text-slate-900 text-sm">
              <span>Total Payable</span>
              <span className="text-teal-800">₹{totalAmount}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> Submitting Request...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-1.5" /> Confirm Dispensing Order
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
