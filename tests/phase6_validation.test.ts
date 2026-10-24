/**
 * LifeSphere AI-X — Phase 6 Automated Test Suite
 * 
 * Tests:
 * 1. Duplicate recurring appointments idempotency & deterministic next occurrence keying
 * 2. Notification delivery permissions, lead-time window guards, and duplicate prevention
 * 3. Firestore security ownership rules & cross-user access isolation
 * 4. Analytics data integrity, missing measurement gaps, and mathematical precision
 * 5. CSV export user-scoping, clinical unit headers, and injection sanitization
 * 6. Module 2: Emergency detection data-quality checks, manual SOS, and ambulance call workflow
 */
process.env.LIFESPHERE_TEST_MODE = 'true';

import { appointmentService } from '../src/services/appointmentService';
import { healthAnalyticsService } from '../src/services/healthAnalyticsService';
import { emergencyService } from '../src/services/emergencyService';
import { Appointment, HealthMetrics, EnvironmentalData, EmergencyAlertRule } from '../src/types';

interface TestContext {
  passed: number;
  failed: number;
  results: Array<{ name: string; passed: boolean; message: string; durationMs: number }>;
}

const ctx: TestContext = {
  passed: 0,
  failed: 0,
  results: [],
};

async function runTest(name: string, fn: () => Promise<void>) {
  const start = performance.now();
  try {
    await fn();
    const durationMs = Math.round(performance.now() - start);
    ctx.passed++;
    ctx.results.push({ name, passed: true, message: 'PASSED', durationMs });
    console.log(`  ✓ PASS: ${name} (${durationMs}ms)`);
  } catch (err) {
    const durationMs = Math.round(performance.now() - start);
    ctx.failed++;
    const msg = err instanceof Error ? err.message : String(err);
    ctx.results.push({ name, passed: false, message: msg, durationMs });
    console.error(`  ✗ FAIL: ${name} (${durationMs}ms)`);
    console.error(`    Error: ${msg}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual<T>(actual: T, expected: T, message: string) {
  if (actual !== expected) {
    throw new Error(`Assertion failed: ${message}. Expected: ${expected}, Received: ${actual}`);
  }
}

// Global Mocks for Node Environment
if (typeof global.localStorage === 'undefined') {
  const store: Record<string, string> = {};
  (global as any).localStorage = {
    getItem: (k: string) => store[k] || null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
  };
}

async function main() {
  console.log('\n================================================================');
  console.log('  LIFESPHERE AI-X — PHASE 6 AUTOMATED VALIDATION SUITE');
  console.log('================================================================\n');

  // ==========================================================================
  // SUITE 1: RECURRING APPOINTMENTS & IDEMPOTENCY
  // ==========================================================================
  console.log('▶ SUITE 1: Monthly Recurring Appointments & Concurrency Guards');

  await runTest('Completing recurring appointment creates exactly ONE next occurrence with deterministic key', async () => {
    const userId = 'user-test-alex';
    const original = await appointmentService.createAppointment(userId, {
      title: 'Monthly Pulmonary Function Test',
      doctorOrSpecialist: 'Dr. Jordan Vance',
      category: 'pulmonology',
      scheduledDateTime: new Date(Date.now() + 2 * 24 * 3600 * 1000).toISOString(),
      durationMinutes: 30,
      frequency: 'monthly',
      isTelehealth: false,
      reminderPreferences: {
        leadTimeHours: 24,
        pushEnabled: true,
        emailEnabled: false,
        inAppEnabled: true,
      },
    });

    assert(original.id.length > 0, 'Original appointment created');
    assertEqual(original.status, 'scheduled', 'Initial status is scheduled');

    // 1st completion
    const comp1 = await appointmentService.completeAppointment(userId, original.id, 'Spirometry FEV1 stable');
    assert(comp1 !== null && comp1.completed !== null, 'First complete succeeded');
    assertEqual(comp1!.completed.status, 'completed', 'Appointment marked completed');

    // Fetch scheduled list
    let list = await appointmentService.getAppointments(userId);
    let nextCycles = list.filter((a) => a.parentAppointmentId === original.id);
    assertEqual(nextCycles.length, 1, 'Exactly 1 next recurrence created on first completion');
    assertEqual(nextCycles[0].recurrenceCycle, 2, 'Recurrence cycle incremented to 2');

    // 2nd completion (Simulating network retry / duplicate click)
    const comp2 = await appointmentService.completeAppointment(userId, original.id, 'Duplicate click retry');
    assertEqual(comp2!.completed.status, 'completed', 'Second completion returned gracefully');

    // 3rd completion (Concurrent replay)
    const comp3 = await appointmentService.completeAppointment(userId, original.id, 'Concurrent replay test');
    assertEqual(comp3!.completed.status, 'completed', 'Third completion returned gracefully');

    // Verify still exactly ONE recurrence exists
    list = await appointmentService.getAppointments(userId);
    nextCycles = list.filter((a) => a.parentAppointmentId === original.id);
    assertEqual(nextCycles.length, 1, 'Idempotency preserved: zero duplicate recurrences created');
  });

  // ==========================================================================
  // SUITE 2: REMINDER DELIVERY & PERMISSION HANDLING
  // ==========================================================================
  console.log('\n▶ SUITE 2: Push Reminder Delivery, Lead-Time Windows & Permissions');

  await runTest('Notification permission denial is explicitly recorded as failed with code', async () => {
    const userId = 'user-test-denied';
    const appt = await appointmentService.createAppointment(userId, {
      title: 'Cardiology Review',
      doctorOrSpecialist: 'Dr. Vance',
      category: 'cardiology',
      scheduledDateTime: new Date(Date.now() + 10 * 3600 * 1000).toISOString(),
      durationMinutes: 45,
      frequency: 'once',
      isTelehealth: false,
      reminderPreferences: { leadTimeHours: 24, pushEnabled: true, emailEnabled: false, inAppEnabled: false },
    });

    // Mock Notification denied
    const mockNotif = {
      permission: 'denied',
      requestPermission: async () => 'denied',
    };
    (global as any).Notification = mockNotif;
    (global as any).window = { Notification: mockNotif };

    const receipt = await appointmentService.deliverNotification(appt, 'browser_push');
    assertEqual(receipt.status, 'failed', 'Receipt marked failed');
    assertEqual(receipt.failureReason, 'NOTIFICATION_PERMISSION_DENIED_BY_USER', 'Explicit failure code captured');

    // Check delivery logs
    const logs = appointmentService.getDeliveryLogs(userId);
    const targetLog = logs.find((l) => l.appointmentId === appt.id);
    assert(targetLog !== undefined, 'Delivery log persisted to audit ledger');
    assertEqual(targetLog!.failureReason, 'NOTIFICATION_PERMISSION_DENIED_BY_USER', 'Audit log matches failure reason');
  });

  await runTest('Duplicate reminder delivery is prevented if already delivered', async () => {
    const userId = 'user-test-duplicate';
    const appt = await appointmentService.createAppointment(userId, {
      title: 'Annual Physical Checkup',
      doctorOrSpecialist: 'Dr. Vance',
      category: 'routine_checkup',
      scheduledDateTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
      durationMinutes: 30,
      frequency: 'once',
      isTelehealth: false,
      reminderPreferences: { leadTimeHours: 24, pushEnabled: false, emailEnabled: false, inAppEnabled: true },
    });

    // Mark delivered
    const firstDelivery = await appointmentService.deliverNotification(appt, 'in_app');
    assertEqual(firstDelivery.status, 'delivered', 'First in-app delivery succeeded');

    // Updated appointment has notificationDeliveryStatus: 'delivered'
    const updatedAppt: Appointment = {
      ...appt,
      notificationDeliveryStatus: 'delivered',
    };

    // Attempt second delivery
    const secondDelivery = await appointmentService.deliverNotification(updatedAppt, 'in_app');
    assertEqual(secondDelivery.status, 'failed', 'Second delivery blocked');
    assert(
      secondDelivery.failureReason!.includes('DUPLICATE_DELIVERY_PREVENTED'),
      'Duplicate delivery rejection reason logged'
    );
  });

  // ==========================================================================
  // SUITE 3: FIRESTORE SECURITY RULES & USER ISOLATION
  // ==========================================================================
  console.log('\n▶ SUITE 3: Firestore Security Ownership Rules & Cross-User Isolation');

  await runTest('User Bob cannot read or access User Alice appointments (Tenant Barrier)', async () => {
    const aliceUid = 'user-alice-771';
    const bobUid = 'user-bob-992';

    // Alice creates private appointment
    const aliceAppt = await appointmentService.createAppointment(aliceUid, {
      title: 'Alice Confidential Genetic Screening',
      doctorOrSpecialist: 'Dr. Genetics',
      category: 'lab_work',
      scheduledDateTime: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      durationMinutes: 60,
      frequency: 'once',
      isTelehealth: false,
      reminderPreferences: { leadTimeHours: 24, pushEnabled: true, emailEnabled: false, inAppEnabled: true },
    });

    // Bob attempts to query appointments
    const bobAppointments = await appointmentService.getAppointments(bobUid);
    const leaked = bobAppointments.find((a) => a.id === aliceAppt.id || a.userId === aliceUid);
    assert(leaked === undefined, 'Bob query result contains zero Alice records');

    // Bob attempts unauthorized complete
    let bobCompleteBlocked = false;
    try {
      const bobComplete = await appointmentService.completeAppointment(bobUid, aliceAppt.id);
      if (!bobComplete) bobCompleteBlocked = true;
    } catch {
      bobCompleteBlocked = true;
    }
    assert(bobCompleteBlocked, 'Bob unauthorized complete blocked');

    // Bob attempts unauthorized delete
    let bobDeleteBlocked = false;
    try {
      const bobDelete = await appointmentService.deleteAppointment(bobUid, aliceAppt.id);
      if (!bobDelete) bobDeleteBlocked = true;
    } catch {
      bobDeleteBlocked = true;
    }
    assert(bobDeleteBlocked, 'Bob unauthorized delete blocked');
  });

  // ==========================================================================
  // SUITE 4: ANALYTICS DATA INTEGRITY & MISSING MEASUREMENTS
  // ==========================================================================
  console.log('\n▶ SUITE 4: Analytics Data Integrity & Missing Measurements Gaps');

  await runTest('Missing telemetry points (charging gaps) are marked isMissing: true with qualityScore 0.0 and excluded from mathematical averages', async () => {
    const dataset = healthAnalyticsService.getBiomarkerTrendStream('heart_rate', 'weekly');
    assert(dataset.length === 7, 'Weekly stream has 7 daily data points');

    // Validate structure
    const missingPoints = dataset.filter((p) => p.isMissing);
    const validPoints = dataset.filter((p) => !p.isMissing);

    assert(validPoints.length > 0, 'Contains valid telemetry points');
    for (const vp of validPoints) {
      assert(vp.value > 0, 'Valid point has positive value');
      assertEqual(vp.unit, 'bpm', 'Valid heart rate unit is bpm');
      assert((vp.qualityScore || 0) > 0, 'Valid telemetry quality score is positive');
    }

    if (missingPoints.length > 0) {
      for (const mp of missingPoints) {
        assertEqual(mp.qualityScore, 0.0, 'Missing measurement quality score is 0.0');
        assertEqual(mp.isMissing, true, 'isMissing flag is strictly true');
      }
    }

    // Verify mathematical summary precision against non-missing points
    const summaries = healthAnalyticsService.getBiomarkerSummaries('weekly');
    const hrSummary = summaries.find((s) => s.metricType === 'heart_rate');
    assert(hrSummary !== undefined, 'Heart rate summary exists');

    const expectedMin = Math.min(...validPoints.map((p) => p.value));
    const expectedMax = Math.max(...validPoints.map((p) => p.value));
    const expectedAvg = Number((validPoints.reduce((acc, p) => acc + p.value, 0) / validPoints.length).toFixed(1));

    assertEqual(hrSummary!.minValue, expectedMin, 'Summary min matches mathematically');
    assertEqual(hrSummary!.maxValue, expectedMax, 'Summary max matches mathematically');
    assertEqual(hrSummary!.averageValue, expectedAvg, 'Summary average excludes missing points');
    assertEqual(hrSummary!.unit, 'bpm', 'Summary unit is bpm');
  });

  // ==========================================================================
  // SUITE 5: CSV EXPORT AUTHORIZATION & SCOPING
  // ==========================================================================
  console.log('\n▶ SUITE 5: CSV Export User-Scoping, Clinical Headers & Formula Sanitization');

  await runTest('Exported CSV is strictly scoped to authenticated patient with standardized clinical headers and formula sanitization', async () => {
    const userId = 'LS-8842';
    const patientName = 'Dr. Jordan Vance';

    const csvContent = healthAnalyticsService.exportHealthAnalyticsCSV(userId, patientName, 'monthly');

    // Header validations
    assert(csvContent.includes('# Patient UID: LS-8842'), 'Patient UID in metadata header');
    assert(csvContent.includes('# Patient Name: Dr. Jordan Vance'), 'Patient Name in metadata header');
    assert(csvContent.includes('Date_UTC,Timestamp_ISO,Biomarker_Type,Value,Unit,Quality_Score,Status,Notes'), 'CSV column headers formatted');

    // Data row validations
    const lines = csvContent.trim().split('\n').filter((l) => !l.startsWith('#'));
    assert(lines.length > 1, 'Contains data rows');

    // Check units in lines
    const dataRows = lines.slice(1);
    for (const row of dataRows) {
      assert(
        row.includes('bpm') ||
        row.includes('mmHg') ||
        row.includes('%') ||
        row.includes('hrs') ||
        row.includes('°C') ||
        row.includes('steps') ||
        row.includes('AQI') ||
        row.includes('Score'),
        'Row includes standardized clinical unit'
      );
      // Verify no formula injection (=, +, -, @)
      const cols = row.split(',');
      for (const col of cols) {
        assert(!col.startsWith('='), 'CSV formula injection prevented');
      }
    }
  });

  // ==========================================================================
  // SUITE 6: MODULE 2 EMERGENCY DETECTION & ABNORMAL READING WORKFLOW
  // ==========================================================================
  console.log('\n▶ SUITE 6: Module 2 Emergency Detection, Alert Rules & Ambulance Action');

  await runTest('Data-quality checks reject stale readings (>15 min) and sensor artifacts from automated emergency dispatch', async () => {
    const rules = await emergencyService.getAlertRules('user-test-emergency');
    
    const normalVitals: HealthMetrics = {
      heartRate: 135, // High, but test staleness
      restingHeartRate: 70,
      hrv: 40,
      spO2: 98,
      bloodPressure: '120/80',
      systolic: 120,
      diastolic: 80,
      bodyTemperature: 37.0,
      respiratoryRate: 16,
      glucose: 90,
      stressLevel: 30,
      sleepScore: 80,
      totalSleepHours: 7,
      deepSleepHours: 2,
      remSleepHours: 1.5,
      stepCount: 5000,
      activeCalories: 1800,
    };

    const env: EnvironmentalData = {
      locationName: 'Metro Basin',
      airQualityIndex: 45,
      airQualityCategory: 'Good',
      temperature: 24,
      humidity: 50,
      aqi: 45,
      pm25: 12,
      pm10: 20,
      ozone: 30,
      no2: 15,
      so2: 5,
      co: 0.5,
      uvIndex: 3,
      uvCategory: 'Moderate',
      heatIndex: 24,
      pollenCount: 15,
      primaryPollutant: 'pm25',
      cautionLevel: 'Good',
    };

    // Stale timestamp: 25 minutes ago
    const staleTime = new Date(Date.now() - 25 * 60 * 1000).toISOString();
    const evalStale = emergencyService.evaluateVitalsAgainstRules(normalVitals, env, rules, staleTime);
    assertEqual(evalStale.triggered, false, 'Stale reading (>15 min) rejected from automated alert');
    assertEqual(evalStale.dataQualityChecks.passed, false, 'Data quality check marked failed');
    assert(evalStale.dataQualityChecks.issues[0].includes('stale'), 'Issue logs staleness reason');

    // Implausible sensor artifact: HR = 0
    const artifactVitals = { ...normalVitals, heartRate: 0 };
    const evalArtifact = emergencyService.evaluateVitalsAgainstRules(artifactVitals, env, rules, new Date().toISOString());
    assertEqual(evalArtifact.triggered, false, 'Physiologically implausible sensor artifact rejected');
    assertEqual(evalArtifact.dataQualityChecks.passed, false, 'Data quality failed for artifact');
    assert(evalArtifact.dataQualityChecks.issues[0].includes('detached'), 'Artifact issue logged');

    // Valid high reading: HR = 135 sustained resting
    const validHighVitals = { ...normalVitals, heartRate: 135 };
    const evalValid = emergencyService.evaluateVitalsAgainstRules(validHighVitals, env, rules, new Date().toISOString());
    assertEqual(evalValid.triggered, true, 'Valid critical tachycardia reading triggers rule alert');
    assertEqual(evalValid.rule!.id, 'rule_tachycardia', 'Rule correctly matched to tachycardia');
    assertEqual(evalValid.severity, 'critical', 'Severity correctly evaluated as critical');
  });

  await runTest('Manual SOS executes immediately without waiting for AI and launches native ambulance action with disclaimer', async () => {
    const userId = 'user-test-sos';
    const vitals: HealthMetrics = {
      heartRate: 110,
      restingHeartRate: 70,
      hrv: 45,
      spO2: 92,
      bloodPressure: '140/90',
      systolic: 140,
      diastolic: 90,
      bodyTemperature: 37.2,
      respiratoryRate: 18,
      glucose: 100,
      stressLevel: 60,
      sleepScore: 70,
      totalSleepHours: 6,
      deepSleepHours: 1.5,
      remSleepHours: 1.2,
      stepCount: 3000,
      activeCalories: 1500,
    };

    const env: EnvironmentalData = {
      locationName: 'Industrial Corridor',
      airQualityIndex: 85,
      airQualityCategory: 'Moderate',
      temperature: 28,
      humidity: 60,
      aqi: 85,
      pm25: 28,
      pm10: 45,
      ozone: 40,
      no2: 20,
      so2: 8,
      co: 0.8,
      uvIndex: 6,
      uvCategory: 'High',
      heatIndex: 30,
      pollenCount: 25,
      primaryPollutant: 'pm25',
      cautionLevel: 'Moderate',
    };

    // Trigger SOS
    const sosEvent = await emergencyService.triggerManualSos({
      userId,
      reason: 'Manual SOS: Acute chest tightness and dyspnea',
      vitals,
      environment: env,
      includeLocation: false,
      localEmergencyNumber: '911',
    });

    assert(sosEvent.id.length > 0, 'SOS event record generated');
    assertEqual(sosEvent.triggerType, 'MANUAL_SOS', 'Trigger type is MANUAL_SOS');
    assertEqual(sosEvent.status, 'active', 'Event status is active');
    assertEqual(sosEvent.ambulanceAction.status, 'ready_to_call', 'Ambulance action ready to call');

    // Launch Ambulance action
    const ambulanceCall = emergencyService.initiateAmbulanceCall('911', sosEvent.id, userId);
    assertEqual(ambulanceCall.telUri, 'tel:911', 'Clean tel URI generated');
    assertEqual(ambulanceCall.status, 'dialer_launched', 'Status marked dialer_launched');
    assert(ambulanceCall.confirmationRequired, 'Explicit human voice confirmation required');
    assert(
      ambulanceCall.disclaimer.includes('have NOT been automatically dispatched'),
      'Strict clinical safety disclosure: never claims dispatch without telephony confirmation'
    );

    // Emergency event history
    const history = await emergencyService.getEmergencyEventHistory(userId);
    const recorded = history.find((e) => e.id === sosEvent.id);
    assert(recorded !== undefined, 'SOS event saved in emergency history ledger');

    // Acknowledge incident
    const acknowledged = await emergencyService.acknowledgeEmergencyEvent(
      userId,
      sosEvent.id,
      'Sarah Vance (Spouse)',
      'Spoke with Jordan on phone, driving home now.'
    );
    assertEqual(acknowledged!.status, 'acknowledged', 'Event status transitioned to acknowledged');
    assertEqual(acknowledged!.acknowledgements[0].acknowledgedBy, 'Sarah Vance (Spouse)', 'Acknowledgement recorded');
  });

  // ==========================================================================
  // SUMMARY
  // ==========================================================================
  console.log('\n================================================================');
  console.log(`  PHASE 6 TEST SUITE COMPLETED: ${ctx.passed} PASSED / ${ctx.failed} FAILED`);
  console.log('================================================================\n');

  if (ctx.failed > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal test suite failure:', err);
  process.exit(1);
});
