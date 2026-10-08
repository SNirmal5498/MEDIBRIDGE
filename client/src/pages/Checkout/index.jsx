import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useLanguage } from "../../context/LanguageContext";
import { orderService } from "../../services/orderService";
import { authService } from "../../services/authService";
import OrderSummary from "../../components/checkout/OrderSummary";
import DeliveryAddress from "../../components/checkout/DeliveryAddress";
import PharmacySummary from "../../components/checkout/PharmacySummary";
import PaymentMethod from "../../components/checkout/PaymentMethod";
import PriceSummary from "../../components/checkout/PriceSummary";
import PrescriptionWarning from "../../components/checkout/PrescriptionWarning";
import Button from "../../components/common/Button";
import { getMedicineById } from "../../utils/medicineData";

import { formatDate } from "../../utils/formatters";

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, selectedPharmacy, updateQuantity, removeFromCart, clearCart } = useCart();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    houseFlat: user?.address?.houseFlat || "",
    streetRoad: user?.address?.streetRoad || "",
    area: user?.address?.area || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "",
    pincode: user?.address?.pincode || "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [createdOrder, setCreatedOrder] = useState(null);
  const [attachedPrescription, setAttachedPrescription] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/medicine");
    }
  }, [cartItems.length, navigate]);

  const handleSaveAddress = async (address) => {
    try {
      await authService.updateProfile({ address });
      setDeliveryAddress(address);
    } catch (err) {
      console.error("Failed to save address:", err);
    }
  };

  const validateForm = () => {
    if (!deliveryAddress.fullName?.trim()) {
      setError(t("checkout.enterFullName"));
      return false;
    }
    if (!deliveryAddress.phone?.trim()) {
      setError(t("checkout.enterPhone"));
      return false;
    }
    if (!deliveryAddress.houseFlat?.trim()) {
      setError(t("checkout.enterHouse"));
      return false;
    }
    if (!deliveryAddress.city?.trim()) {
      setError(t("checkout.city"));
      return false;
    }
    if (!deliveryAddress.state?.trim()) {
      setError(t("checkout.state"));
      return false;
    }
    if (!deliveryAddress.pincode?.trim() || deliveryAddress.pincode.length !== 6) {
      setError(t("checkout.enterPincode"));
      return false;
    }
    if (!paymentMethod) {
      setError(t("checkout.paymentMethod"));
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateForm()) return;

    // Check for prescription medicines
    const hasPrescriptionMedicine = cartItems.some((item) => {
      const medicine = getMedicineById(item.medicineId);
      return medicine && !medicine.otc;
    });

    if (hasPrescriptionMedicine && !attachedPrescription) {
      setError("Doctor's prescription must be uploaded before placing an order containing prescription medicines.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          medicineId: item.medicineId,
          medicineName: item.medicineName,
          genericName: item.genericName,
          strength: item.strength,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
          otc: item.otc,
        })),
        pharmacy: {
          id: selectedPharmacy?.id || "pharm-001",
          name: selectedPharmacy?.name || "MedPlus Pharmacy",
          address: selectedPharmacy?.address || "Coimbatore",
          phone: selectedPharmacy?.phone || "+91 98421 10001",
          rating: selectedPharmacy?.rating || 4.8,
          distance: selectedPharmacy?.distance || "0.8 km",
        },
        deliveryAddress: {
          fullName: deliveryAddress.fullName,
          phone: deliveryAddress.phone,
          houseFlat: deliveryAddress.houseFlat,
          streetRoad: deliveryAddress.streetRoad,
          area: deliveryAddress.area,
          city: deliveryAddress.city,
          state: deliveryAddress.state,
          pincode: deliveryAddress.pincode,
        },
        paymentMethod,
        prescriptionId: attachedPrescription?._id || null,
      };

      const response = await orderService.createOrder(orderData);
      setCreatedOrder(response.order);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || t("common.error"));
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const hasPrescriptionMedicine = cartItems.some((item) => {
    const medicine = getMedicineById(item.medicineId);
    return medicine && !medicine.otc;
  });

  if (orderSuccess && createdOrder) {
    const deliveryDate = formatDate(createdOrder.estimatedDelivery, language.code);

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card p-8 text-center">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-primary-50 text-primary-hover mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text mb-2">{t("checkout.orderSuccess")}</h1>
          <p className="text-text-muted mb-6">{t("checkout.orderSuccessDesc")}</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-text-muted mb-1">{t("checkout.orderId")}</p>
            <p className="font-display font-bold text-lg text-text">{createdOrder.id}</p>
            <p className="text-sm text-text-muted mt-3 mb-1">{t("checkout.estimatedDelivery")}</p>
            <p className="font-semibold text-text">{deliveryDate}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/orders")} variant="primary">
              {t("checkout.trackOrder")}
            </Button>
            <Button onClick={() => navigate("/medicine")} variant="secondary">
              {t("checkout.continueShopping")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">{t("checkout.title")}</h1>
        <p className="mt-1.5 text-text-muted">{t("checkout.subtitle")}</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 text-danger text-sm">
          {error}
        </div>
      )}

      {hasPrescriptionMedicine && (
        <div className="mb-6">
          <PrescriptionWarning onPrescriptionUploaded={(rx) => setAttachedPrescription(rx)} />
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DeliveryAddress
            address={deliveryAddress}
            onChange={setDeliveryAddress}
            onSave={handleSaveAddress}
            user={user}
          />
          {selectedPharmacy && <PharmacySummary pharmacy={selectedPharmacy} />}
          <PaymentMethod selectedMethod={paymentMethod} onChange={setPaymentMethod} />
        </div>

        <div className="space-y-6">
          <OrderSummary
            items={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemove={removeFromCart}
          />
          <PriceSummary subtotal={subtotal} />
          <Button
            onClick={handlePlaceOrder}
            disabled={loading || (hasPrescriptionMedicine && !attachedPrescription)}
            className="w-full"
            size="lg"
          >
            {loading ? t("checkout.placingOrder") : t("checkout.placeOrder")}
          </Button>
        </div>
      </div>
    </div>
  );
}

