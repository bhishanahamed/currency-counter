# Currency Counter 💵

> **Professional Cash Denomination, Drawer Reconciliation & Multi-Currency Counter Web App**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.3.1-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4.18-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline%20Ready-5A0FC8?logo=pwa&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**Currency Counter** is a modern, high-performance web application designed for retail shops, kirana stores, banks, petrol pumps, cashiers, and accountants. It streamlines daily cash tallying, drawer audits, denomination counting, and receipt generation with 100% offline client-side privacy.

---

## 🌟 Key Features

### 1. ⚡ Fast & Accurate Denomination Counting
- **Instant Tallying**: Type or step quantities with `+`, `-`, `+5`, `+10` quick buttons.
- **Large Capacity Support**: Supports quantities up to **9,999,999** notes/coins per denomination without truncation or lag.
- **Dynamic Subtotals & Totals**: Instant recalculation of line totals, item counts, grand totals, and difference metrics.
- **Amount in Words**: Converts figures into text automatically using localized conventions:
  - **Indian Numbering System** (Lakhs & Crores) for INR.
  - **Western Numbering System** (Millions & Billions) for USD, EUR, GBP, AUD, CAD, etc.

### 2. 🌍 Multi-Currency Support (10 Currencies)
Supports world currencies with accurate symbols, decimal precision rules, and embedded country flag icons:
- **INR (₹)** — Indian Rupee
- **USD ($)** — US Dollar
- **EUR (€)** — Euro
- **GBP (£)** — British Pound
- **JPY (¥)** — Japanese Yen
- **AUD (A$)** — Australian Dollar
- **CAD (C$)** — Canadian Dollar
- **AED (د.إ)** — UAE Dirham
- **SAR (﷼)** — Saudi Riyal
- **SGD (S$)** — Singapore Dollar

### 3. ⚖️ Cash Drawer Audit & Reconciliation (Expected Cash)
- Enter your **Expected Cash** (opening balance + sales).
- Live audit comparison displays:
  - **Matched** (Green) — Expected cash matches physical cash drawer exactly.
  - **Excess** (Amber) — Surplus cash detected.
  - **Short** (Red) — Cash deficit detected.
- Built-in layout containment prevents visual overflow even with large values.

### 4. ➕ Custom Denominations
- Add up to **50 custom denominations** per currency (e.g., ₹2000 discontinued note, $2 bill, or 0.25 / 0.50 coins).
- Attach custom labels (e.g., *"Old note"*, *"Collector coin"*).
- Custom denominations automatically persist to `localStorage` and merge into receipts and WhatsApp reports.

### 5. 🗂️ Multi-Counter Management
- Run multiple independent tills/counters (e.g., *Counter 1*, *Till 2*, *Safe Deposit*).
- Switch, rename, or delete counters effortlessly.
- **Combined Currency Aggregation**: Live summary grouping totals and items by currency across all active counters.

### 6. 📱 WhatsApp Sharing with Interactive Modal
- **Smart Customization Dialog**: Choose exactly what to include before sharing:
  - ✅ Denomination breakdown (e.g. `₹500 × 10 = ₹5,000`)
  - ✅ Expected Cash & Difference tally
  - ✅ Amount in Words
  - ✅ Timestamp & custom notes
  - ✅ Active counter or all-counters summary
- **Recipient Phone Number (Optional)**: Type a direct phone number or leave blank to choose any contact/group inside WhatsApp.
- **Live WhatsApp Chat Preview**: View a simulated WhatsApp message bubble with Markdown bolding (`*...*`), emojis, and clean dividers.
- **1-Click Copy**: Copy the formatted message directly to your clipboard.

### 7. 🧾 Receipt & Export Tools
- **Digital Cash Slip**: Authentic POS thermal-style receipt preview.
- **Export Options**:
  - 📷 **PNG Image**: Generates a high-resolution downloadable receipt image.
  - 📄 **TXT File**: Download standard plain-text receipt.
  - 📋 **Copy to Clipboard**: Instant ASCII receipt text copying.
  - 📊 **CSV Export**: Full audit spreadsheet breakdown compatible with Excel and Google Sheets.

### 8. 📜 History Sessions & Safe Clear
- Save snapshots of counting sessions with date and time.
- Restore previous sessions to view or continue counting.
- **Safe Confirmation Modal**: Prevents accidental data loss when deleting individual sessions or clearing all history.

### 9. 🔒 100% Offline & Private (PWA)
- **Zero Server Tracking**: All calculations, counters, custom denominations, and history are stored locally in your browser (`localStorage`).
- **Progressive Web App**: Installable on Windows, macOS, Android, and iOS. Includes service worker caching (`sw.js`) for full offline availability.

### 10. 🎨 Premium UI & Responsive Navigation
- **Dual Themes**: Polished Dark Mode and clean Light Mode.
- **Bottom Navigation**: Mobile and tablet bottom navigation bar for quick access across *Home*, *Counter*, *Report*, *History*, *Settings*, and *About*.

---

## 🏗️ Project Architecture

```
currency-counter/
├── public/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── icon.svg
│   ├── icon-*.png                # Multi-resolution PWA icons (16px to 512px)
│   ├── icon-maskable-*.png       # Android adaptive maskable icons
│   ├── logo.png                  # Primary app branding logo
│   ├── manifest.webmanifest      # PWA Web App Manifest
│   └── sw.js                     # Offline Service Worker cache
├── src/
│   ├── components/
│   │   ├── BottomNav.jsx         # Mobile & tablet bottom tab bar
│   │   ├── ConfirmModal.jsx      # Safe deletion & confirmation dialog
│   │   ├── FlagIcon.jsx          # Country flag renderer (base64 SVG/PNG)
│   │   ├── Navbar.jsx            # Top desktop navigation header
│   │   ├── ReceiptModal.jsx      # Thermal-style digital cash receipt modal
│   │   ├── Toast.jsx             # Non-intrusive action feedback toasts
│   │   ├── WhatsAppShareModal.jsx# WhatsApp report customization dialog
│   │   └── tabs/
│   │       ├── AboutTab.jsx      # App guide, keyboard shortcuts & specs
│   │       ├── CounterTab.jsx    # Primary cash counting workstation
│   │       ├── HistoryTab.jsx    # Saved tally sessions & management
│   │       ├── HomeTab.jsx       # Welcome dashboard & quick launch
│   │       ├── ReportTab.jsx     # Aggregated analytics & currency charts
│   │       └── SettingsTab.jsx   # Currency defaults & data reset
│   ├── data/
│   │   └── currencies.js         # Currency registry, flags, denoms & locales
│   ├── utils/
│   │   ├── currencyUtils.js      # Financial math, formatting & WhatsApp builders
│   │   ├── numberToWords.js      # Indian & International number-to-words engines
│   │   └── storage.js            # LocalStorage keys, migration & sanitization
│   ├── App.jsx                   # Root application state & router
│   ├── index.css                 # Tailwind directives & design tokens
│   └── main.jsx                  # React DOM mount point
├── package.json
├── tailwind.config.js
├── test_suite.mjs                # Node.js automated verification test suite
└── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- `npm` (v9.0.0 or higher)

### Installation
Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/currency-counter.git
cd currency-counter
npm install
```

### Running Locally
Start the Vite development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the port specified in terminal).

### Running Tests
Execute the automated test suite verifying calculations, numbering systems, storage validation, and WhatsApp builders:

```bash
npm test
```

### Building for Production
Create an optimized production bundle:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

## 🧪 Testing & Validation Summary

The project includes automated and visual browser tests covering:

| Component / Utility | Test Verification | Status |
| :--- | :--- | :---: |
| **`currencyUtils.calculateCounterTotals`** | Accurate multiplication, notes tally, and expected difference | Passed |
| **`currencyUtils.formatCurrencyAmount`** | Indian comma grouping (`₹6,67,28,000`) & International commas (`$1,234,567`) | Passed |
| **`numberToWords.amountInWords`** | Lakh/Crore words engine for INR; Million/Billion engine for USD/EUR | Passed |
| **`currencyUtils.buildWhatsAppShareText`**| Markdown headers, notes breakdown, tally comparisons, and word generation | Passed |
| **`storage.validateAndSanitizeCounters`** | Capacity boundary clamping up to `MAX_QUANTITY` (9,999,999) | Passed |
| **`storage.validateAndSanitizeCustomDenoms`**| Backwards-compatible custom denomination parsing and label safety | Passed |
| **Input Boundary Validation** | Strict clamping preventing layout overflows on custom values & expected cash | Passed |
| **PWA Service Worker** | Cache registration, offline shell, and manifest validation | Passed |

---

## 🛡️ Privacy & Security

- **No Analytics / No Tracking**: No cookies or third-party telemetry.
- **Client-Side Only**: All counting data stays in browser `localStorage`.
- **Offline Capable**: Works without an internet connection after the initial visit.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
