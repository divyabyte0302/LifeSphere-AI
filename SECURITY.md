# LifeSphere AI — Security & Compliance Architecture

LifeSphere AI processes sensitive personal health data, wearable telemetry, and micro-climate environmental exposures. This document outlines our statutory compliance controls, cryptographic boundaries, and security policies.

---

## 🏛️ Statutory Compliance Standards

### 1. HIPAA Compliance (Health Insurance Portability and Accountability Act)
LifeSphere AI implements technical safeguards mandated by the **HIPAA Security Rule (45 CFR Part 160 and Part 164, Subparts A and C)**:

* **§ 164.312(a)(1) Access Control**: Unique user identification via Firebase Authentication JWTs. Least-privilege Role-Based Access Control (RBAC) ensures administrators cannot read private patient health charts by default.
* **§ 164.312(a)(2)(iv) Encryption and Decryption**: All personal health records (PHI) and diagnostic PDFs are encrypted at rest with AES-256 and in transit with TLS 1.3.
* **§ 164.312(b) Audit Controls**: An append-only immutable audit trail (`/audit_logs` and `/doctor_access_audit_logs`) records every clinical chart view, directive sign-off, emergency dispatch, and consent revocation with digital signature hashes.
* **§ 164.312(c)(1) Integrity**: Version vectors and digital payload checksums prevent unauthorized alteration of patient clinical records.
* **§ 164.312(e)(1) Transmission Security**: Zero plaintext communication. Strict Content Security Policy (CSP) and HTTP Strict Transport Security (HSTS) headers enforced.

### 2. GDPR Compliance (General Data Protection Regulation)
* **Article 9 (Special Categories of Data)**: Health biometrics are processed solely under explicit, revocable patient consent.
* **Article 17 (Right to Erasure / "Right to be Forgotten")**: Patients can execute permanent account and biometric data erasure via the in-app Data Deletion flow.
* **Article 20 (Right to Data Portability)**: Patients can export their complete longitudinal health vault in standardized JSON and HL7 FHIR-compatible formats.

---

## 🔐 Authentication & Role-Based Access Control (RBAC)

### User Role Hierarchy
| Role | Identifier | Permissions & Boundaries |
| :--- | :---: | :--- |
| **Patient (User)** | `USER` | Full sovereign ownership of personal vitals, documents, medications, and consent. Can grant or revoke doctor access at any time. |
| **Physician** | `DOCTOR` | Can view and write care directives **only** for patients who have granted active authorization. Directives are locked and cannot be silently overwritten by AI. |
| **System Admin** | `ADMIN` | Platform configuration, service health, and HIPAA compliance logs. **Excluded from viewing raw medical charts** by default under Least Privilege. |
| **Super Admin** | `SUPER_ADMIN` | Tenant administration and role assignment. Operates under mandatory two-person authorization policies. |

---

## 🛡️ Database & Storage Security Rules

### Firestore Rules Overview (`firestore.rules`)
```javascript
// Rule 1: Strict self-ownership
function isOwner(userId) {
  return isAuthenticated() && request.auth.uid == userId;
}

// Rule 2: Explicit doctor authorization check
function isDoctorAuthorized(patientId) {
  return isAuthenticated() &&
    request.auth.token.role == 'DOCTOR' &&
    exists(/databases/(default)/documents/patient_authorizations/$(patientId + '_' + request.auth.uid));
}

// Rule 3: Cross-tenant barrier on medical records
match /medical_records/{recordId} {
  allow read: if isOwner(resource.data.userId) || isDoctorAuthorized(resource.data.userId);
  allow write: if isOwner(request.resource.data.userId);
  allow delete: if isOwner(resource.data.userId);
}
```

### Storage Rules Overview (`storage.rules`)
- **25 MB limit** on diagnostic PDFs and DICOM medical imaging.
- MIME type restrictions enforced: `application/pdf`, `image/*`, `application/dicom`.
- Unauthenticated access is completely blocked (`allow read, write: if false;` on default paths).

---

## 🚫 No Secrets in Source Code Policy

1. **Zero Hardcoded Secrets**: All API keys, service account credentials, and signing keys are injected via environment variables (`.env`) or cloud secret managers.
2. **Pre-Commit Checks**: Automated scanning ensures no `.pem`, `.jks`, or private keys are committed to Git.
3. **Client-Side Google OAuth**: Uses standard OAuth client flows without exposing server secrets to browser or mobile runtimes.

---

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability or potential PHI exposure in LifeSphere AI:

1. **Do not disclose publicly** or file a public GitHub issue.
2. Email our Security Response Team at:  
   **`security@lifesphere.ai`**
3. Include:
   - Detailed description of the vulnerability.
   - Proof of Concept (PoC) or reproduction steps.
   - Potential impact assessment.
4. We acknowledge reports within **24 hours** and provide remediation patches within **72 hours** under our responsible disclosure program.
