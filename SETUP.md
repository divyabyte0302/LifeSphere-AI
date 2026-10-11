# LifeSphere AI — Developer Setup Guide

This guide walks you through setting up your local development environment for **LifeSphere AI** across **Android**, **Flutter Web**, and the **React SaaS Platform**.

---

## 📋 Prerequisites

### Required Tools
| Tool | Minimum Version | Recommended | Purpose |
| :--- | :---: | :---: | :--- |
| **Flutter SDK** | `>= 3.19.0` | `3.24.x` | Cross-platform core runtime |
| **Dart SDK** | `>= 3.3.0` | `3.5.x` | Language compiler |
| **Node.js** | `>= 18.0.0` | `20.x LTS` | Web SaaS tooling & Firebase CLI |
| **Android Studio** | `Hedgehog` | `Koala / Ladybug` | Android build tools, SDK 34, Emulators |
| **JDK (Java)** | `17` | `OpenJDK 17` | Android Gradle build toolchain |
| **Firebase CLI** | `>= 13.0.0` | Latest | Firestore rules, Auth, and Hosting |

---

## 🛠️ Step-by-Step Local Setup

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/your-org/lifesphere-ai.git
cd lifesphere-ai

# Install Web dependencies
npm install

# Install Flutter & Dart dependencies
flutter pub get
```

---

### 2. Configure Environment Variables

Copy the example environment configuration:
```bash
cp .env.example .env
```

Edit `.env` with your project-specific variables:
```dotenv
# Gemini API Key (Clinical decision-support & trends)
GEMINI_API_KEY="your-gemini-api-key"

# App Deployment URL
APP_URL="http://localhost:3000"

# Firebase Client Configuration (Optional overrides)
VITE_FIREBASE_API_KEY="your-firebase-api-key"
VITE_FIREBASE_AUTH_DOMAIN="lifesphere-ai-production.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="lifesphere-ai-production"
VITE_FIREBASE_STORAGE_BUCKET="lifesphere-ai-production.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
VITE_FIREBASE_APP_ID="your-app-id"
```
> **Security Notice**: Never commit `.env` or any file containing live API keys to version control. The `.gitignore` is pre-configured to exclude all `.env*` files except `.env.example`.

---

### 3. Firebase Setup & Authentication

1. Log in to Firebase CLI:
   ```bash
   firebase login
   ```
2. Link your local directory to your Firebase project:
   ```bash
   firebase use lifesphere-ai-production
   ```
3. Deploy Firestore and Storage security rules:
   ```bash
   firebase deploy --only firestore:rules,storage
   ```
4. Enable the following authentication providers in the [Firebase Console](https://console.firebase.google.com/):
   - **Email/Password**
   - **Anonymous** (for emergency guest ICE cards)

---

### 4. Running the Applications

#### A. Web SaaS Application (React + Vite)
```bash
# Start development server on port 3000
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view:
- Landing Page (18 modules)
- Patient Health Dashboard
- Android Pixel Simulator
- Doctor Portal
- Admin RBAC Portal
- Cross-Platform Automated Test Suite

#### B. Android Native Application (Flutter)
```bash
# Verify connected devices or running emulators
flutter devices

# Run in debug mode on connected Android device or emulator
flutter run -d android
```

#### C. Flutter Web Application
```bash
# Run Flutter Web directly in Google Chrome
flutter run -d chrome --web-renderer canvaskit
```

---

## 🔍 Validation & Linting

Verify that your local codebase is clean:

```bash
# TypeScript & Web Linting
npm run lint

# Flutter Static Analysis
flutter analyze

# Execute Flutter Unit & Widget Tests
flutter test
```
