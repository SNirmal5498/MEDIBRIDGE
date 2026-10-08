# MediBridge 🚀 — Multilingual Healthcare & OTC Medicine Platform

MediBridge is an intelligent healthcare platform providing **Multilingual Medicine Information**, **Medicine Comparison**, **Nearby Pharmacy Discovery**, **Emergency Assistance**, and **Safe OTC & Prescription Medicine Ordering**.

---

## 🌟 Key Features

1. **Multilingual Architecture (6 Languages)**
   - **Supported Languages**: English (`en`), Hindi (`hi`), Tamil (`ta`), Telugu (`te`), Malayalam (`ml`), Kannada (`kn`).
   - **Hybrid System**: Fixed UI labels use fast local static i18n dictionaries (`translations.js`), while dynamic MongoDB medicine & pharmacy data route through the MediBridge Backend Translation API with a multi-tier cache hierarchy (Client Memory $\rightarrow$ SessionStorage $\rightarrow$ Node.js Memory Map $\rightarrow$ MongoDB `TranslationCache` $\rightarrow$ External API Cascade).

2. **Medicine Search & Autocomplete**
   - 1,000+ indexed medicine records with brand names, generic compositions, uses, dosages, side effects, warnings, and storage rules.
   - Fast debounced autocomplete search with priority scoring and Levenshtein typo-tolerance.

3. **Medicine Comparison & Detailed Insights**
   - Side-by-side spec comparison table comparing active compositions, strength, pricing, manufacturer, uses, side effects, and warnings in the user's active language.

4. **Pharmacy System & Real Inventory**
   - Discover nearby pharmacies by distance, travel time, and open/closed state.
   - Real pharmacy-level stock inventory and availability mapping.

5. **Prescription Upload & Healthcare Safety Workflow**
   - Prescription medicine validation (Rx required).
   - Secure Multer file upload (JPEG, PNG, WEBP, PDF up to 5MB) with protected authorization checks.
   - Admin & Pharmacy review panel (Approve / Reject with reason).

6. **Order Management & Visual Tracking**
   - Real-time order state machine: `placed` $\rightarrow$ `confirmed` $\rightarrow$ `packed` $\rightarrow$ `out-for-delivery` $\rightarrow$ `delivered`.
   - Visual timeline progress bar localized into the active language.

7. **Admin Portal**
   - System overview metrics (Users, Revenue, Orders, Prescriptions, Translation stats).
   - Catalog management (Add/Edit medicines, toggle active state).
   - User account moderation (Suspend/Activate).
   - Prescription verification review console.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons, React Router.
- **Backend**: Node.js, Express.js, MongoDB Atlas / Mongoose, JWT, Bcrypt.
- **Translation Provider Engine**: Google Cloud Translation API / LibreTranslate / MyMemory Public API Engine / Google Free Translation Endpoint.
- **Payment Architecture**: Razorpay integration with HMAC-SHA256 signature verification and sandbox fallback.

---

## 🚀 Quick Start & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance at `mongodb://127.0.0.1:27017/medibridge` or MongoDB Atlas URI)

### 1. Server Setup
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

---

## 🔒 Security & Privacy

- Secret credentials (JWT secrets, translation keys) remain strictly server-side.
- File uploads are validated by MIME type and file size.
- Uploaded prescription files are protected and restricted to the patient and authorized admin accounts.
