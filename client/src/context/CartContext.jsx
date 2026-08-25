import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext(null);

const CART_KEY = "medibridge_cart";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const stored = localStorage.getItem(CART_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (medicine, pharmacy, quantity = 1) => {
    if (!medicine.otc) {
      throw new Error("Prescription medicines cannot be added to cart");
    }

    const existingIndex = cartItems.findIndex(
      (item) => item.medicineId === medicine.id && item.pharmacyId === pharmacy.id
    );

    if (existingIndex >= 0) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].totalPrice = updated[existingIndex].quantity * medicine.price;
      setCartItems(updated);
    } else {
      setCartItems([
        ...cartItems,
        {
          medicineId: medicine.id,
          medicineName: medicine.brand,
          genericName: medicine.genericName,
          strength: medicine.strength,
          quantity,
          unitPrice: medicine.price,
          totalPrice: medicine.price * quantity,
          otc: medicine.otc,
          pharmacyId: pharmacy.id,
          pharmacyName: pharmacy.name,
          pharmacyAddress: pharmacy.address,
          pharmacyPhone: pharmacy.phone,
          pharmacyRating: pharmacy.rating,
          pharmacyDistance: pharmacy.distance,
        },
      ]);
    }

    setSelectedPharmacy(pharmacy);
  };

  const removeFromCart = (medicineId, pharmacyId) => {
    setCartItems(cartItems.filter((item) => !(item.medicineId === medicineId && item.pharmacyId === pharmacyId)));
  };

  const updateQuantity = (medicineId, pharmacyId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(medicineId, pharmacyId);
      return;
    }

    setCartItems(
      cartItems.map((item) =>
        item.medicineId === medicineId && item.pharmacyId === pharmacyId
          ? { ...item, quantity, totalPrice: quantity * item.unitPrice }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedPharmacy(null);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedPharmacy,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
