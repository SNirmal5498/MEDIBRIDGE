import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
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

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const { cartItems, selectedPharmacy, updateQuantity, removeFromCart, clearCart } = useCart();
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
      setError("Please enter your full name");
      return false;
    }
    if (!deliveryAddress.phone?.trim()) {
      setError("Please enter your phone number");
      return false;
    }
    if (!deliveryAddress.houseFlat?.trim()) {
      setError("Please enter house/flat number");
      return false;
    }
    if (!deliveryAddress.city?.trim()) {
      setError("Please enter city");
      return false;
    }
    if (!deliveryAddress.state?.trim()) {
      setError("Please enter state");
      return false;
    }
    if (!deliveryAddress.pincode?.trim() || deliveryAddress.pincode.length !== 6) {
      setError("Please enter a valid 6-digit pincode");
      return false;
    }
    if (!paymentMethod) {
      setError("Please select a payment method");
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

    if (hasPrescriptionMedicine) {
      setError("Prescription medicines cannot be ordered directly");
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
          id: selectedPharmacy?.id || "default",
          name: selectedPharmacy?.name || "Pharmacy",
          address: selectedPharmacy?.address || "",
          phone: selectedPharmacy?.phone || "",
          rating: selectedPharmacy?.rating || 4.5,
          distance: selectedPharmacy?.distance || "1 km",
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
      };

      const response = await orderService.createOrder(orderData);
      setCreatedOrder(response.order);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
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
    const estimatedDelivery = new Date(createdOrder.estimatedDelivery);
    const deliveryDate = estimatedDelivery.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="card p-8 text-center">
          <div className="grid place-items-center w-16 h-16 rounded-full bg-primary-50 text-primary-hover mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-text mb-2">Order Placed Successfully!</h1>
          <p className="text-text-muted mb-6">Your order has been placed successfully.</p>
          <div className="bg-slate-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-text-muted mb-1">Order ID</p>
            <p className="font-display font-bold text-lg text-text">{createdOrder.id}</p>
            <p className="text-sm text-text-muted mt-3 mb-1">Estimated Delivery</p>
            <p className="font-semibold text-text">{deliveryDate}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/orders")} variant="primary">
              Track Order
            </Button>
            <Button onClick={() => navigate("/medicine")} variant="secondary">
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-text">Checkout</h1>
        <p className="mt-1.5 text-text-muted">Review your order and complete checkout.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-danger-50 text-danger text-sm">
          {error}
        </div>
      )}

      {hasPrescriptionMedicine && (
        <div className="mb-6">
          <PrescriptionWarning />
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
            disabled={loading || hasPrescriptionMedicine}
            className="w-full"
            size="lg"
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </div>
      </div>
    </div>
  );
}
