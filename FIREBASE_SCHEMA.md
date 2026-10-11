# LifeSphere AI: Unified Firebase Architecture & Firestore Schema
## Shared Backend for Android Mobile (Kotlin/Flutter) & Responsive Web (Flutter Web)

This document provides the canonical schema reference for the Cloud Firestore database, Firebase Authentication, Firebase Storage, and Firebase Cloud Messaging (FCM) used concurrently by both the Android mobile application and the responsive web application.

---

## 1. Authentication & Session Persistence

Both Android and Web authenticate against the same Firebase Auth tenant:
- **Authentication Providers**: Email and Password with strict complexity rules.
- **Email Verification**: Triggered on registration (`sendEmailVerification()`).
- **Password Reset**: Automated password recovery challenge (`sendPasswordResetEmail()`).
- **Session Persistence**:
  - **Android**: Handled automatically via native SQLite keychain tokens.
  - **Web**: `Persistence.LOCAL` via IndexedDB across browser reloads.
- **Single Identity**: A patient registering on an Android device logs in with the identical email, credentials, and cryptographic UID on the Web SaaS platform.

---

## 2. Global Security Rules Principles

1. **Default Deny**: `match /{document=**} { allow read, write: if false; }`.
2. **Strict User Isolation**: All personal health information (PHI) queries require `request.auth.uid == resource.data.userId`.
3. **Zero Public Medical Assets**: All medical records and diagnostic files in Firebase Storage are private and encrypted.
4. **Server Timestamps**: Sensitive state changes (`createdAt`, `updatedAt`, `timestamp`) use `request.time` / `FieldValue.serverTimestamp()`.
5. **Immutable Audit Logs**: The `audit_logs` collection is append-only (`allow create: if isCreatingForSelf(); allow update, delete: if false;`) to ensure HIPAA § 164.312(b) audit trail integrity.

---

## 3. Firestore Collections Schema (18 Collections)

### 1. `users`
Primary user account profile, clinical demographics, and emergency contacts.
- **Document ID**: `{userId}` (matches Firebase Auth UID)
- **Fields**:
  - `userId` (string, required): Firebase Auth UID.
  - `email` (string, required): User email address.
  - `displayName` (string): Full legal or clinical name (e.g., "Dr. Jordan Vance").
  - `age` (number): Age in years.
  - `gender` (string): Biological sex / gender identity.
  - `heightCm` (number): Height in centimeters.
  - `weightKg` (number): Weight in kilograms.
  - `bloodType` (string): ABO/Rh blood group (e.g., "O+ Positive").
  - `chronicConditions` (array of strings): Known clinical diagnoses (e.g., `["Mild Allergic Asthma"]`).
  - `allergies` (array of strings): Drug, atmospheric, and contact allergies (e.g., `["Tree Pollen", "Penicillin"]`).
  - `emergencyContact` (map):
    - `name` (string): Contact name.
    - `relationship` (string): Spouse, parent, etc.
    - `phone` (string): E.164 phone number.
  - `fcmTokens` (array of strings): Registered push notification device tokens.
  - `createdAt` (timestamp, server): Account initialization time.
  - `updatedAt` (timestamp, server): Last profile edit.

### 2. `consents`
Granular user consent directives for HIPAA/GDPR compliance.
- **Document ID**: `{consentId}` (e.g., `{userId}_consent`)
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `biometricProcessing` (boolean): Continuous vitals collection consent.
  - `environmentalSync` (boolean): Hyperlocal GPS matching for air quality data.
  - `aiAnalysis` (boolean): Machine learning & clinical triage synthesis.
  - `clinicalSharing` (boolean): EHR HL7 FHIR interoperability authorization.
  - `version` (string): Terms of Service and Privacy Policy version (e.g., "v2.4").
  - `signedAt` (timestamp, server): Cryptographic signature timestamp.
  - `ipAddress` (string): Remote client IP at consent time.

### 3. `health_snapshots`
Consolidated physiological health snapshot computed periodically.
- **Document ID**: `{snapshotId}`
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `overallBioScore` (number): 0–100 health composite index.
  - `autonomicStability` (string): "Optimal", "Compensated", "Decompensated".
  - `restingHeartRate` (number): Beats per minute.
  - `bloodPressure` (string): e.g., "118/76".
  - `spO2` (number): Blood oxygen saturation percentage.
  - `bloodGlucose` (number): mg/dL.
  - `bodyTemperature` (number): Celsius.
  - `createdAt` (timestamp, server, indexed): Snapshot generation time.

### 4. `wearable_measurements`
High-frequency telemetry streamed from Bluetooth Low Energy (BLE) sensors.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `deviceSource` (string): "Apple Watch Ultra", "Oura Ring Gen 3", "Laser Counter".
  - `metricType` (string): "Heart Rate", "ECG", "HRV", "SpO2", "Steps", "Temperature".
  - `value` (number): Numeric measurement reading.
  - `unit` (string): "BPM", "ms", "%", "count", "°C".
  - `qualityScore` (number): 0.0–1.0 sensor contact quality.
  - `timestamp` (timestamp, server, indexed): Telemetry capture time.

### 5. `medical_records`
Clinical documents, diagnostic summaries, and physician reports.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `title` (string): e.g., "Annual Pulmonology Spirometry Panel".
  - `category` (string): "Cardiology", "Pulmonology", "Laboratory", "Imaging".
  - `facility` (string): Hospital or clinical provider name.
  - `storagePath` (string): Cloud Storage path (`/medical_records/{userId}/{fileName}`).
  - `fileMimeType` (string): "application/pdf", "image/png", "application/dicom".
  - `fileSizeBytes` (number): Size in bytes.
  - `recordDate` (timestamp): Date of examination.
  - `createdAt` (timestamp, server): Upload timestamp.

### 6. `health_reports`
Synthesized monthly clinical digests and FHIR HL7 JSON export packages.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `month` (string): e.g., "September 2026".
  - `summary` (string): Clinical narrative of monthly physiological equilibrium.
  - `pdfStoragePath` (string): Private Firebase Storage URI.
  - `fhirJsonStoragePath` (string): Private HL7 FHIR bundle URI.
  - `metricsCount` (number): Total datapoints analyzed.
  - `createdAt` (timestamp, server): Generation time.

### 7. `medications`
Active prescriptions, dosages, schedules, and photosensitivity warnings.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `name` (string): Brand or generic chemical name.
  - `dosage` (string): e.g., "10mg".
  - `frequency` (string): e.g., "Once daily at bedtime".
  - `scheduledTimes` (array of strings): `["09:00 PM"]`.
  - `isTakenToday` (boolean, indexed): Daily adherence toggle.
  - `lastTakenAt` (timestamp, nullable): Timestamp when marked taken.
  - `environmentalWarning` (string, nullable): Contraindication flag (e.g., UV photosensitivity).
  - `createdAt` (timestamp, server): Prescription entry time.

### 8. `lifestyle_records`
Daily physical activity, sleep staging, and hydration.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `date` (string): YYYY-MM-DD.
  - `stepCount` (number): Total daily steps.
  - `activeCalories` (number): Active kcal burned.
  - `totalSleepHours` (number): Total time asleep.
  - `deepSleepHours` (number): Deep slow-wave sleep duration.
  - `remSleepHours` (number): Rapid eye movement sleep duration.
  - `waterIntakeMl` (number): Logged fluid consumption.
  - `createdAt` (timestamp, server): Record logging time.

### 9. `environmental_measurements`
Hyperlocal atmospheric exposure metrics matched to patient coordinates.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `locationName` (string): City or sensor station name.
  - `airQualityIndex` (number): 0–500 US EPA AQI.
  - `airQualityCategory` (string): "Good", "Moderate", "Unhealthy for Sensitive Groups", "Hazardous".
  - `pm25` (number): Fine particulate matter in µg/m³.
  - `pm10` (number): Coarse particulate matter in µg/m³.
  - `ozone` (number): Ground-level O3 in ppb.
  - `uvIndex` (number): 0–12 solar ultraviolet radiation index.
  - `pollenCount` (number): Allergen grains per cubic meter.
  - `temperature` (number): Ambient temperature in Celsius.
  - `humidity` (number): Relative humidity percentage.
  - `noiseDecibels` (number): Ambient acoustic noise level in dB.
  - `timestamp` (timestamp, server, indexed): Reading time.

### 10. `health_trends`
Aggregated moving averages for autonomic nervous system and atmospheric stressors.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `period` (string): "7_day", "30_day", "90_day".
  - `metric` (string): "hrv_vs_aqi", "resting_hr", "sleep_score".
  - `trendDirection` (string): "improving", "stable", "declining".
  - `datapoints` (array of maps): `[{ date: "2026-09-21", value: 62 }, ...]`.
  - `computedAt` (timestamp, server): Computation time.

### 11. `risk_indicators`
Calculated predictive risk scores correlating vitals with environmental spikes.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `riskType` (string): "Respiratory Exacerbation", "Heat Exhaustion", "Cardiovascular Load".
  - `riskLevel` (string): "low", "moderate", "high", "critical".
  - `primaryDriver` (string): e.g., "Elevated PM2.5 (18.4 µg/m³) + Allergic Asthma".
  - `mitigationAdvice` (string): Actionable mitigation directive.
  - `createdAt` (timestamp, server): Risk score computation time.

### 12. `recommendations`
AI generated clinical recommendations and preventive directives.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `title` (string): Clinical headline.
  - `description` (string): Detailed actionable rationale.
  - `category` (string): "respiratory", "uv_protection", "hydration", "cardio", "sleep".
  - `priority` (string, indexed): "high", "moderate", "low".
  - `triggerSource` (string): Telemetry synergy factor.
  - `isDismissed` (boolean): Dismissal flag.
  - `createdAt` (timestamp, server, indexed): Generation timestamp.

### 13. `checkups`
Monthly symptom questionnaires and self-reported clinical surveys.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `month` (string): e.g., "September 2026".
  - `respiratoryScore` (number): 1–10.
  - `fatigueScore` (number): 1–10.
  - `chestTightness` (boolean): Self-reported chest tightness.
  - `coughSeverity` (string): "None", "Mild", "Moderate", "Severe".
  - `notes` (string): Patient notes.
  - `completedAt` (timestamp, server): Completion timestamp.

### 14. `checkup_comparisons`
Month-over-month differential comparisons and clinical delta metrics.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `previousMonth` (string): e.g., "August 2026".
  - `currentMonth` (string): e.g., "September 2026".
  - `hrvDeltaPercent` (number): Percentage change in HRV.
  - `restingHrDelta` (number): BPM change.
  - `symptomScoreDelta` (number): Subjective score difference.
  - `overallTrend` (string): "improved", "stable", "declined".
  - `createdAt` (timestamp, server): Analysis timestamp.

### 15. `diet_plans`
Personalized anti-particulate antioxidant food protocols and hydration plans.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `phase` (string): "Atmospheric Defense", "Post-Exposure Recovery".
  - `dailyWaterTargetMl` (number): Target hydration volume.
  - `recommendedFoods` (array of strings): High-polyphenol and antioxidant foods.
  - `avoidedFoods` (array of strings): Pro-inflammatory or allergenic foods.
  - `createdAt` (timestamp, server): Plan creation time.

### 16. `notifications`
In-app notification records and push alert dispatches.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `title` (string): Alert title.
  - `body` (string): Alert content.
  - `type` (string): "hazard", "medication", "checkup", "system".
  - `isRead` (boolean, indexed): Read state flag.
  - `createdAt` (timestamp, server, indexed): Dispatch time.

### 17. `emergency_alerts`
SOS alerts dispatched to emergency contacts and emergency services.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `status` (string, indexed): "active", "cancelled", "resolved".
  - `currentVitals` (map): Heart rate, SpO2, blood pressure snapshot.
  - `latitude` (number): GPS latitude.
  - `longitude` (number): GPS longitude.
  - `notifiedContacts` (array of strings): Contact phone numbers messaged.
  - `cancelCountdownSeconds` (number): Countdown duration.
  - `createdAt` (timestamp, server, indexed): Alert trigger time.

### 18. `audit_logs`
Immutable HIPAA compliance log tracking every PHI access, export, or consent change.
- **Document ID**: Auto-generated
- **Fields**:
  - `userId` (string, indexed): Firebase Auth UID.
  - `action` (string): e.g., "LOGIN", "EXPORT_FHIR_JSON", "CONSENT_UPDATED", "PASSWORD_RESET".
  - `resourceAffected` (string): Target collection or endpoint.
  - `clientPlatform` (string): "Android Native" or "Web Chrome / Safari".
  - `ipAddress` (string): Client IP address.
  - `timestamp` (timestamp, server, indexed): Server event time.

---

## 4. Deployment to Firebase CLI

When you are ready to deploy to your production Firebase project:
```bash
# 1. Login to Firebase
firebase login

# 2. Select your Firebase project
firebase use <YOUR_PROJECT_ID>

# 3. Deploy Firestore rules and indexes
firebase deploy --only firestore:rules,firestore:indexes

# 4. Deploy Storage rules
firebase deploy --only storage:rules
```
