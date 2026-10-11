# LifeSphere AI — Personal Health & Environmental Intelligence Platform

[![Build Status](https://img.shields.io/badge/Build-Passing-emerald)](https://github.com)
[![Version](https://img.shields.io/badge/Version-1.0.0%2B1-teal)](pubspec.yaml)
[![License](https://img.shields.io/badge/License-Proprietary-blue)](LICENSE)
[![Compliance](https://img.shields.io/badge/Compliance-HIPAA%20%7C%20GDPR-indigo)](SECURITY.md)

LifeSphere AI brings together your authorized health, lifestyle, wearable, and environmental information into a continuously updated personal health profile. It is engineered with dual-platform parity, offering both a native **Android Material 3 Application** and an enterprise-grade **Responsive Web SaaS Application**.

---

## ⚡ Exact Commands Quick-Start

### Run Applications
```bash
# Run Android Mobile App (Connected Device or Pixel Emulator)
flutter run -d android

# Run Web SaaS Application (React + Vite, Port 3000)
npm run dev

# Run Flutter Web Application (Google Chrome, CanvasKit Engine)
flutter run -d chrome --web-renderer canvaskit
```

### Build Distribution Packages
```bash
# Build Android Debug APK
flutter build apk --debug

# Build Android Release APK (Split by ABI for minimal download size)
flutter build apk --release --split-per-abi

# Build Android App Bundle (AAB for Google Play Store)
flutter build appbundle --release

# Build Production Web Distribution (Flutter Web CanvasKit)
flutter build web --release --web-renderer canvaskit

# Build Production Web Distribution (React SaaS Bundle)
npm run build
```

### Deploy Web
```bash
# Deploy to Firebase Hosting & publish Firestore / Storage rules
firebase deploy --only hosting,firestore:rules,storage
```

---

## 📚 Documentation Index

| Guide | Description |
| :--- | :--- |
| **[SETUP.md](SETUP.md)** | Local development environment setup, Flutter SDK, Android Studio, and Firebase setup. |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Production release signing, ProGuard optimization, Google Play Store AAB, and Web hosting. |
| **[SECURITY.md](SECURITY.md)** | HIPAA § 164.312 safeguards, GDPR Art. 9/17, custom claims RBAC, and zero-secrets policy. |
| **[TESTING.md](TESTING.md)** | Comprehensive test guide, static analysis, and the 40 automated cross-platform test cases. |
| **[FIREBASE_SCHEMA.md](FIREBASE_SCHEMA.md)** | Complete Firestore collection definitions, version vectors, and document schemas. |

---

## 🌟 Core System Modules

1. **Professional Landing Page (18 Sections)**:
   Hero with live telemetry simulation, Problem, Solution, How It Works, Features, Continuous Health Profile, AI Trends, Monthly Check-up, Post Check-up Updates, Personalized Health Plan, Environmental Intelligence, Privacy & Consent, Emergency Support, Technology, FAQ, Contact, Login, and Register.
2. **Continuous Physiological Telemetry**:
   Real-time ingestion of resting heart rate (BPM), pulse oximetry ($SpO_2$), heart rate variability (HRV SDNN), and blood pressure.
3. **Hyperlocal Environmental Micro-Climate Sensing**:
   Continuous synchronization with atmospheric monitoring stations tracking $PM_{2.5}$, $PM_{10}$, ground-level ozone, allergen pollen grain counts, and solar UV radiation.
4. **Physician Collaboration Portal**:
   Explicit patient authorization governance under HIPAA § 164.508 with non-overwrite care directive locks and tamper-proof clinical access audit logging.
5. **Standardized Monthly Check-Up**:
   Validated symptom survey (Asthma Control Test ACT compatible) with month-over-month trajectory analysis.
6. **Emergency Support Protocol**:
   Evidence-backed safety workflow with algorithmic uncertainty disclosures, explicit confirmation gates, and zero unauthorized auto-dials.
7. **Cross-Platform Test Suite (40 Tests)**:
   In-app test runner verifying authentication, real-time bi-directional synchronization, offline resilience, and RBAC cross-tenant barriers with 100% pass rates.

---

## 🔒 Clinical & Regulatory Disclaimer

LifeSphere AI is designed strictly as an assistive continuous personal health intelligence and decision-support system. LifeSphere AI **does not replace doctors**, provide definitive diagnoses, **prevent all diseases**, or **guarantee health outcomes**. In medical emergencies, immediately contact local emergency services (911).
