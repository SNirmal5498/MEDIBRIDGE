// Dummy order + tracking data for the Order Tracking page.
// Swap for a real orders API once the backend exposes one.

export const ORDER_STATUSES = [
  { key: "placed", label: "Order Placed", icon: "PackageCheck" },
  { key: "packed", label: "Packed", icon: "PackageOpen" },
  { key: "out-for-delivery", label: "Out for Delivery", icon: "Truck" },
  { key: "delivered", label: "Delivered", icon: "CheckCircle2" },
];

export const ORDERS = [
  {
    id: "MB-20260714-001",
    placedOn: "14 Jul 2026, 10:32 AM",
    estimatedDelivery: "16 Jul 2026",
    currentStatus: "out-for-delivery",
    address: "12, Race Course Road, Coimbatore, TN 641018",
    items: [
      { name: "Crocin (Paracetamol 500mg)", qty: 2, price: 18 },
      { name: "Electral (ORS)", qty: 1, price: 25 },
    ],
    timeline: [
      { status: "placed", timestamp: "14 Jul, 10:32 AM", done: true },
      { status: "packed", timestamp: "14 Jul, 2:10 PM", done: true },
      { status: "out-for-delivery", timestamp: "16 Jul, 8:05 AM", done: true },
      { status: "delivered", timestamp: null, done: false },
    ],
  },
  {
    id: "MB-20260710-004",
    placedOn: "10 Jul 2026, 6:14 PM",
    estimatedDelivery: "12 Jul 2026",
    currentStatus: "delivered",
    address: "12, Race Course Road, Coimbatore, TN 641018",
    items: [
      { name: "Digene Antacid", qty: 1, price: 45 },
      { name: "Limcee Vitamin C", qty: 1, price: 30 },
    ],
    timeline: [
      { status: "placed", timestamp: "10 Jul, 6:14 PM", done: true },
      { status: "packed", timestamp: "10 Jul, 8:40 PM", done: true },
      { status: "out-for-delivery", timestamp: "12 Jul, 9:02 AM", done: true },
      { status: "delivered", timestamp: "12 Jul, 1:47 PM", done: true },
    ],
  },
  {
    id: "MB-20260718-002",
    placedOn: "18 Jul 2026, 9:05 AM",
    estimatedDelivery: "20 Jul 2026",
    currentStatus: "placed",
    address: "12, Race Course Road, Coimbatore, TN 641018",
    items: [{ name: "Band-Aid (Pack of 10)", qty: 1, price: 55 }],
    timeline: [
      { status: "placed", timestamp: "18 Jul, 9:05 AM", done: true },
      { status: "packed", timestamp: null, done: false },
      { status: "out-for-delivery", timestamp: null, done: false },
      { status: "delivered", timestamp: null, done: false },
    ],
  },
];

export function getAllOrders() {
  return ORDERS;
}

export function getOrderById(id) {
  return ORDERS.find((o) => o.id === id) || null;
}