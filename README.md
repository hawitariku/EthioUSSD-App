# 🇪🇹 Ethio USSD Companion

**Ethio USSD Companion** is a premium, secure, and localized mobile application designed to simplify mobile banking and telecom interactions in Ethiopia. It provides a unified, automated interface for dialing complex USSD codes while maintaining the highest standards of security and user experience.

![App Dashboard](c:/Users/hp/Desktop/ussd/EthioUSSDApp-Expo/assets/images/icon.png)

## ✨ Major Features

### 🏦 Intelligent Bank Launcher (v2.0)
- **Massive Directory:** Support for 15+ Ethiopian banks and telecom services (CBE, Dashen, Awash, Abyssinia, TeleBirr, etc.).
- **Verified Templates:** Pre-configured USSD strings for Balance, Transfer, Airtime, and more.
- **Form-Based Input:** Human-friendly fields for account numbers and amounts—no more memorizing complex strings.

### 🤖 Native Automation Engine (Phase 15+)
- **Auto USSD Reading:** Uses an Android Accessibility Service to automatically read USSD response overlays.
- **In-App Receipts:** Captured responses are parsed and displayed as premium receipt cards directly inside the app.
- **Privacy-First:** All reading happens locally; no data ever leaves your device.

### 🌍 Multi-Language Support (v2.0)
- **Localized UI:** Full support for **English**, **Amharic (አማርኛ)**, and **Afaan Oromoo**.
- **Settings Toggle:** Easily switch languages on the fly without restarting the app.

### 📈 Usage Analytics & History
- **Smart Dashboard:** Visualize your transaction patterns with the "Usage Visualizer" bar chart.
- **Unified History:** Track all your USSD interactions in a searchable, filterable list.
- **CSV Export:** Export your history to spreadsheet format for person accounting.

### 🔒 Advanced Security
- **Biometric Protection:** Secure your financial history with Fingerprint/FaceID via `expo-local-authentication`.
- **Launcher Mode:** The app prepares the USSD code, but you initiate the final dial in the native phone app, ensuring your PIN remains private.
- **Safe Fallback:** Resilience built-in for devices without biometric hardware.

### 🎨 Premium UI/UX
- **Modern Design:** Vibrant gradients, glassmorphism, and haptic feedback.
- **Dark Mode:** Full system-adaptive dark theme for premium nighttime usage.

## 🛠 Tech Stack

- **Framework:** [Expo SDK 52](https://expo.dev/) (Managed Workflow)
- **Language:** TypeScript / Java (Native Plugin)
- **Native Bridge:** Custom Expo Config Plugin for Android Accessibility Service
- **Authentication:** `expo-local-authentication`
- **Analytics:** Custom D3-based Usage Visualizer
- **i18n:** `i18n-js` (v3) with `expo-localization`
- **Storage:** `@react-native-async-storage/async-storage`

## 🚀 Getting Started

### Prerequisites
- Node.js (Late LTS)
- Expo Go (for development)
- EAS CLI (for building native APKs)

### Setup
1. **Clone & Install**
   ```bash
   git clone https://github.com/wish628/EthioUSSD-App.git
   cd EthioUSSD-App
   npm install
   ```

2. **Run Development Server**
   ```bash
   npx expo start
   ```

3. **Generating the APK (Native Features)**
   Since this app uses a custom Native Automation Engine, you must generate a Development Client or a Preview APK:
   ```bash
   npx eas build --platform android --profile preview
   ```

## 🛡 Security & Privacy
This application is built with a **Security-First** philosophy:
1. **No Backend:** Your transaction history is stored locally on your device only.
2. **PIN Protection:** The app never asks for or stores your bank PIN. USSD sessions requiring a PIN are handled by the native Android telephony system.
3. **Accessibility Privacy:** The Accessibility Service is strictly limited to reading USSD overlays and only activates during active dial sessions.

## 📜 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Developed with ❤️ for the Ethiopian Fintech Community.*
