import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';
import '../../models/emergency_alert_model.dart';
import '../../services/emergency_service.dart';

/// LifeSphere AI Emergency Support Module (Android & Web)
/// Implements clinical emergency alert detection workflow:
/// Potential critical pattern -> Emergency alert -> Show evidence ->
/// Explain uncertainty -> User confirmation -> Authorized emergency action.
class EmergencyScreen extends StatefulWidget {
  const EmergencyScreen({Key? key}) : super(key: key);

  @override
  State<EmergencyScreen> createState() => _EmergencyScreenState();
}

class _EmergencyScreenState extends State<EmergencyScreen> {
  EmergencyAlertModel? _currentAlert;
  String? _statusBanner;
  bool _simulateNetworkFailure = false;

  @override
  void initState() {
    super.initState();
    _loadInitialAlert();
  }

  void _loadInitialAlert() {
    setState(() {
      _currentAlert = EmergencyService.evaluatePattern(
        userId: 'LS-8842',
        spO2: 88.4,
        heartRate: 126,
        ambientPm25: 18.4,
        ambientTemp: 24.5,
      );
    });
  }

  Future<void> _handleConfirmAction() async {
    if (_currentAlert == null) return;

    EmergencyService.simulateNetworkFailure = _simulateNetworkFailure;
    final updated = await EmergencyService.confirmEmergencyAction(_currentAlert!);

    setState(() {
      _currentAlert = updated;
      if (updated.actionResult == 'NETWORK_FAILURE_SMS_QUEUED') {
        _statusBanner = 'Network Timeout: Cloud relay failed. Encrypted SOS packet queued locally for offline dispatch.';
      } else {
        _statusBanner = 'Emergency Action Confirmed: Authorized responder integration & ICE contacts notified.';
      }
    });
  }

  Future<void> _handleCancel() async {
    if (_currentAlert == null) return;
    final updated = await EmergencyService.cancelAlert(_currentAlert!);
    setState(() {
      _currentAlert = updated;
      _statusBanner = 'Alert Cancelled. No emergency services were contacted.';
    });
  }

  Future<void> _handleImSafe() async {
    if (_currentAlert == null) return;
    final updated = await EmergencyService.imSafe(_currentAlert!);
    setState(() {
      _currentAlert = updated;
      _statusBanner = 'Recorded as Safe. Duplicate alert suppression window activated for 10 minutes.';
    });
  }

  void _testDuplicateSuppression() {
    if (_currentAlert == null) return;
    final isSuppressed = EmergencyService.isDuplicateTrigger(_currentAlert!.trigger);
    setState(() {
      if (isSuppressed) {
        _statusBanner = 'Duplicate Alert Suppressed: Pattern was triggered recently and ignored to prevent alarm fatigue.';
      } else {
        _statusBanner = 'Pattern not in suppression cache. Would trigger new alert.';
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final alert = _currentAlert;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Emergency Support & Response'),
        backgroundColor: AppTheme.alertRose,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Status banner if present
            if (_statusBanner != null) ...[
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: AppTheme.alertRose.withOpacity(0.15),
                  border: Border.all(color: AppTheme.alertRose),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.info_outline, color: AppTheme.alertRose, size: 20),
                    const SizedBox(width: 8),
                    Expanded(
                      child: Text(
                        _statusBanner!,
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
            ],

            if (alert != null) ...[
              // CARD: ALERT DETECTED
              Card(
                elevation: 4,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: AppTheme.alertRose, width: 2),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Header
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: AppTheme.alertRose,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(Icons.warning_amber_rounded, color: Colors.white, size: 28),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                const Text(
                                  'ALERT DETECTED',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.w900,
                                    color: AppTheme.alertRose,
                                    letterSpacing: 0.5,
                                  ),
                                ),
                                Text(
                                  'Ref: ${alert.alertId} • User: ${alert.userId}',
                                  style: const TextStyle(fontSize: 11, color: Colors.grey),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),

                      // Why this alert appeared
                      const Text(
                        'Why this alert appeared',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.alertRose),
                      ),
                      const SizedBox(height: 6),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.cardDark,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: Colors.white10),
                        ),
                        child: Text(
                          alert.evidence.whyAlertAppeared,
                          style: const TextStyle(fontSize: 12, height: 1.4),
                        ),
                      ),
                      const SizedBox(height: 16),

                      // Measurements involved
                      const Text(
                        'Measurements involved',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.accentAmber),
                      ),
                      const SizedBox(height: 6),
                      Column(
                        children: alert.evidence.measurementsInvolved.map((m) {
                          return Container(
                            margin: const EdgeInsets.only(bottom: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: AppTheme.cardDark,
                              borderRadius: BorderRadius.circular(10),
                              border: Border.all(color: Colors.white10),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.between,
                              children: [
                                Text('${m.name} (${m.threshold})', style: const TextStyle(fontSize: 12, color: Colors.grey)),
                                Text('${m.value} ${m.unit}', style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white)),
                              ],
                            ),
                          );
                        }).toList(),
                      ),
                      const SizedBox(height: 16),

                      // Time of measurements
                      Row(
                        children: [
                          const Icon(Icons.access_time, size: 16, color: AppTheme.infoBlue),
                          const SizedBox(width: 6),
                          const Text('Time of measurements: ', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.infoBlue)),
                          Text(alert.evidence.timeOfMeasurements, style: const TextStyle(fontSize: 12, fontFamily: 'monospace')),
                        ],
                      ),
                      const SizedBox(height: 12),

                      // Possible significance
                      const Text(
                        'Possible significance',
                        style: TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.purpleAccent),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        alert.evidence.possibleSignificance,
                        style: const TextStyle(fontSize: 12, color: Colors.white70),
                      ),
                      const SizedBox(height: 16),

                      // Important AI Disclaimer Box
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: AppTheme.accentAmber.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: AppTheme.accentAmber, width: 1.5),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: const [
                                Icon(Icons.info, color: AppTheme.accentAmber, size: 18),
                                SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    'Important: This is an AI-assisted alert and may be incorrect.',
                                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12, color: AppTheme.accentAmber),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 6),
                            Text(
                              alert.evidence.uncertaintyExplanation,
                              style: const TextStyle(fontSize: 11, color: Colors.white70),
                            ),
                            const SizedBox(height: 6),
                            const Text(
                              'Standard Safety Rule: Never automatically contact emergency services without explicit user confirmation and an appropriately authorized integration.',
                              style: TextStyle(fontSize: 10, fontStyle: FontStyle.italic, color: Colors.grey),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 20),

                      // THREE BUTTONS
                      // 1. [Confirm Emergency Action]
                      ElevatedButton.icon(
                        onPressed: alert.actionResult == 'AUTHORIZED_EMERGENCY_DISPATCHED' ? null : _handleConfirmAction,
                        icon: const Icon(Icons.phone_in_talk, color: Colors.white),
                        label: const Text('Confirm Emergency Action', style: TextStyle(fontWeight: FontWeight.bold)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.alertRose,
                          foregroundColor: Colors.white,
                          minimumSize: const Size(double.infinity, 48),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                      const SizedBox(height: 8),

                      Row(
                        children: [
                          // 2. [Cancel]
                          Expanded(
                            child: OutlinedButton.icon(
                              onPressed: _handleCancel,
                              icon: const Icon(Icons.close, size: 16),
                              label: const Text('Cancel'),
                              style: OutlinedButton.styleFrom(
                                minimumSize: const Size(double.infinity, 44),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),

                          // 3. [I'm Safe]
                          Expanded(
                            child: ElevatedButton.icon(
                              onPressed: _handleImSafe,
                              icon: const Icon(Icons.verified_user, color: Colors.white, size: 16),
                              label: const Text("I'm Safe"),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppTheme.primaryEmerald,
                                foregroundColor: Colors.white,
                                minimumSize: const Size(double.infinity, 44),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // TEST NETWORK FAILURE & DUPLICATE ALERTS PANEL
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('QA Testing: Failure & Duplicate Resilience', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                      const SizedBox(height: 8),
                      SwitchListTile(
                        contentPadding: EdgeInsets.zero,
                        title: const Text('Simulate Network Failure', style: TextStyle(fontSize: 13)),
                        subtitle: const Text('Tests offline encrypted SMS outbox fallback queue', style: TextStyle(fontSize: 11)),
                        value: _simulateNetworkFailure,
                        onChanged: (val) => setState(() => _simulateNetworkFailure = val),
                      ),
                      const Divider(),
                      ListTile(
                        contentPadding: EdgeInsets.zero,
                        leading: const Icon(Icons.copy, color: AppTheme.infoBlue),
                        title: const Text('Test Duplicate Alert Suppression', style: TextStyle(fontSize: 13)),
                        subtitle: const Text('Checks 10-minute deduplication window', style: TextStyle(fontSize: 11)),
                        trailing: ElevatedButton(
                          onPressed: _testDuplicateSuppression,
                          child: const Text('Test'),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
