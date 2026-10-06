# MediBridge Translation Architecture & Translation API Integration

MediBridge uses a **hybrid internationalization architecture**:
- **Static UI Strings** (Navigation labels, buttons, headers, settings titles): Managed via static dictionaries in [`client/src/i18n/translations.js`](file:///d:/Projects/MEDIBRIDGE/client/src/i18n/translations.js) & [`LanguageContext.jsx`](file:///d:/Projects/MEDIBRIDGE/client/src/context/LanguageContext.jsx).
- **Dynamic Data Content** (Medicine descriptions, uses, dosage instructions, side effects, warnings, drug interactions, pharmacy details, first aid steps): Dynamically translated via MediBridge's backend Translation API Service with multi-level caching.

---

## Supported Languages
| Code | Language | Source/Target |
| :--- | :--- | :--- |
| `en` | English | **Source Language** (Default) |
| `hi` | Hindi | Target |
| `ta` | Tamil | Target |
| `te` | Telugu | Target |
| `ml` | Malayalam | Target |
| `kn` | Kannada | Target |

---

## System Architecture

```
React Frontend (useDynamicTranslation / translationService)
       ↓
MediBridge Node/Express Backend (/api/translation)
       ↓
Multi-tiered Cache (In-Memory Map → MongoDB TranslationCache collection)
       ↓ (if cache miss)
External Translation API Provider (Google Cloud / LibreTranslate / MyMemory / Fallback)
       ↓
Cache result in MongoDB & Memory
       ↓
Return translated JSON payload to React
```

---

## Translation API Providers & Configuration

The translation engine supports multiple providers via backend environment variables in [`server/.env`](file:///d:/Projects/MEDIBRIDGE/server/.env):

```env
# Optional Translation Provider ('auto', 'google', 'libretranslate', 'mymemory')
TRANSLATION_PROVIDER=auto

# Option 1: Google Cloud Translation API
GOOGLE_TRANSLATE_API_KEY=your_google_cloud_translate_api_key_here

# Option 2: LibreTranslate (Self-hosted or Cloud)
LIBRETRANSLATE_API_URL=https://libretranslate.com
LIBRETRANSLATE_API_KEY=your_libretranslate_key_here
```

### Fallback Engine (No Secret Key Required)
If no API keys are provided in `.env`, MediBridge automatically uses **MyMemory Translation API** (`https://api.mymemory.translated.net/get`) and Google Translate's free web endpoint, backed by MongoDB translation caching. If external network is offline, the system safely falls back to English source content without crashing the application.

---

## Backend Translation API Endpoints

### 1. Single & Batch Translation
- **Endpoint**: `POST /api/translation/translate`
- **Body**:
  ```json
  {
    "text": "Paracetamol is used to reduce fever and relieve mild pain.",
    "targetLang": "ta",
    "sourceLang": "en"
  }
  ```
- **Response**:
  ```json
  {
    "success": true,
    "targetLang": "ta",
    "translated": "பாராசிட்டமால் காய்ச்சலைக் குறைக்கவும் லேசான வலியைக் போக்கவும் பயன்படுகிறது."
  }
  ```

### 2. Dynamic Object Field Translation
- **Endpoint**: `POST /api/translation/object`
- **Body**:
  ```json
  {
    "object": {
      "id": "dolo-650",
      "description": "High strength paracetamol tablet for fever.",
      "uses": ["Fever", "Body ache"]
    },
    "fields": ["description", "uses"],
    "targetLang": "hi"
  }
  ```

### 3. Translation Engine Stats & Status
- **Endpoint**: `GET /api/translation/stats`
- **Response**:
  ```json
  {
    "success": true,
    "supportedLanguages": ["en", "hi", "ta", "te", "ml", "kn"],
    "totalCachedTranslations": 142,
    "activeProvider": "Google Cloud Translation API"
  }
  ```

---

## Technical Values Preserved (Non-Translatable)
The translation engine automatically preserves technical, non-user-facing identifiers:
- Database ObjectIDs (`_id`, `id`)
- Product codes & dosage numeric values (e.g. `500mg`, `650mg`, `10ml`)
- Currency values & symbols (`₹35`, `$10`)
- URLs, emails, and phone numbers
- Boolean flags (`otc`, `prescriptionRequired`, `isActive`)

---

## Caching & Performance Strategy

1. **Client-Side Cache**: React `translationService` stores translated responses in browser `sessionStorage` and an in-memory `Map`.
2. **Node Server Memory Cache**: Fast in-memory hash map lookup for instant microsecond response times.
3. **MongoDB Database Cache**: Persistent `TranslationCache` collection indexed by SHA-256 hash (`sha256(sourceLang:targetLang:text)`).

---

## Error Handling & Fallbacks
- If target language is `en`, translation is bypassed entirely with zero delay.
- If external API calls fail or timeout, the system gracefully returns original English text.
- Page layouts, components, and search functionality remain fully responsive and functional regardless of API availability.
