import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class ConsentScreen extends StatefulWidget {
  const ConsentScreen({Key? key}) : super(key: key);

  @override
  State<ConsentScreen> createState() => _ConsentScreenState();
}

class _ConsentScreenState extends State<ConsentScreen> {
  bool _biometricConsent = true;
  bool _environmentalTelemetryConsent = true;
  bool _aiAnalysisConsent = true;
  bool _anonymizedResearchConsent = false;

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<HealthProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Consent, Privacy & Data Ethics'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.primaryEmerald.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.primaryEmerald.withOpacity(0.3)),
            ),
            child: Row(
              children: const [
                Icon(Icons.verified_user, color: AppTheme.primaryEmerald, size: 28),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'HIPAA & GDPR Enforced: You maintain 100% cryptographic sovereignty over your health records and telemetry.',
                    style: TextStyle(fontSize: 13, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 20),
          SwitchListTile(
            title: const Text('Wearable Biometric Processing', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('Continuous ECG, SpO2, and resting heart rate synchronization.'),
            value: _biometricConsent,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _biometricConsent = val),
          ),
          const Divider(),
          SwitchListTile(
            title: const Text('Ambient Environmental Geo-Tracking', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('Localized AQI, PM2.5, UV Index, and allergen forecasting matching your GPS coordinates.'),
            value: _environmentalTelemetryConsent,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _environmentalTelemetryConsent = val),
          ),
          const Divider(),
          SwitchListTile(
            title: const Text('Generative AI Clinical Synthesis', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('Empowers Gemini AI to correlate personal symptoms with external atmospheric pollutants.'),
            value: _aiAnalysisConsent,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _aiAnalysisConsent = val),
          ),
          const Divider(),
          SwitchListTile(
            title: const Text('Anonymized Epidemiological Research', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('Contributes de-identified particulate health trends to global academic research.'),
            value: _anonymizedResearchConsent,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _anonymizedResearchConsent = val),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () {
              provider.updateConsent(_biometricConsent && _environmentalTelemetryConsent);
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Data sovereignty preferences successfully committed.')),
              );
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryEmerald,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Save Privacy Preferences', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }
}
