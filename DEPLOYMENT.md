# LifeSphere AI — Production Deployment Guide

This document describes the step-by-step procedures to build, package, sign, and deploy **LifeSphere AI** for **Android (Google Play Store)** and **Web (Cloud Run / Firebase Hosting / CDN)**.

---

## 🚀 Quick Command Reference

| Action | Target Platform | Command |
| :--- | :--- | :--- |
| **Run Android** | Emulator / Device | `flutter run -d android` |
| **Run Web** | Desktop Chrome | `flutter run -d chrome` *(Flutter)* or `npm run dev` *(SaaS)* |
| **Build Debug APK** | Android | `flutter build apk --debug` |
| **Build Release APK** | Android | `flutter build apk --release --split-per-abi` |
| **Build Play Store AAB** | Android (Play Store) | `flutter build appbundle --release` |
| **Build Web (Flutter)** | Production Web | `flutter build web --release --web-renderer canvaskit` |
| **Build Web (SaaS)** | Production Bundle | `npm run build` |
| **Deploy Web** | Firebase / Cloud | `firebase deploy --only hosting` |

---

## 📱 1. Android Release Packaging

### A. Generate Production Release Keystore

Execute `keytool` (included in JDK 17):

```bash
keytool -genkey -v \
  -keystore lifesphere_release.jks \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -alias lifesphere-release-key
```

Save `lifesphere_release.jks` in a secure location (e.g. your local user home or CI/CD secret manager). **Never commit the `.jks` file to Git.**

### B. Configure `key.properties`

Create `android/key.properties`:
```properties
storePassword=YOUR_SECURE_STORE_PASSWORD
keyPassword=YOUR_SECURE_KEY_PASSWORD
keyAlias=lifesphere-release-key
storeFile=/path/to/lifesphere_release.jks
```

### C. Build Release Artifacts

#### 1. Android Debug APK (for QA & Local Sideloading)
```bash
flutter build apk --debug
```
*Output Path:* `build/app/outputs/flutter-apk/app-debug.apk`

#### 2. Android Release APK (for Direct Enterprise Distribution)
```bash
flutter build apk --release --split-per-abi --obfuscate --split-debug-info=build/app/outputs/symbols
```
*Output Paths:*
- `build/app/outputs/flutter-apk/app-arm64-v8a-release.apk`
- `build/app/outputs/flutter-apk/app-armeabi-v7a-release.apk`
- `build/app/outputs/flutter-apk/app-x86_64-release.apk`

#### 3. Android App Bundle (AAB for Google Play Store)
```bash
flutter build appbundle --release --obfuscate --split-debug-info=build/app/outputs/symbols
```
*Output Path:* `build/app/outputs/bundle/release/app-release.aab`

---

## 🌐 2. Web Production Deployment

### A. Flutter Web Build

Compile the optimized web artifact using the CanvasKit engine for 60fps chart and UI rendering:

```bash
flutter build web --release \
  --web-renderer canvaskit \
  --pwa-strategy offline-first \
  --base-href "/"
```
*Output Directory:* `build/web/`

#### Local Verification
```bash
cd build/web
npx serve -s . -p 8080
```

### B. React SaaS Platform Build

Compile the production TypeScript bundle:

```bash
npm run build
```
*Output Directory:* `dist/`

### C. Deploy to Firebase Hosting

Ensure `firebase.json` specifies the hosting public directory:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

Deploy hosting and security rules simultaneously:
```bash
firebase deploy --only hosting,firestore:rules,storage
```

---

## 🛡️ Pre-Release Verification Checklist

Before publishing to production:

- [x] Version number updated in `pubspec.yaml` (e.g. `version: 1.0.0+1`)
- [x] Application ID matching in `android/app/build.gradle` (`ai.lifesphere.app`)
- [x] Android permissions reviewed in `AndroidManifest.xml` (no undeclared permissions)
- [x] ProGuard rules enabled with `shrinkResources true` and `minifyEnabled true`
- [x] Firestore security rules deployed and tested for cross-tenant isolation
- [x] Storage rules deployed with 25MB medical report limit
- [x] No API secrets, keys, or credentials stored in source code
- [x] Complete test suite passing: `npm run lint` and all 40 automated cross-platform tests
