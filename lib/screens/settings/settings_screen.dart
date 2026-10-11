import 'package:flutter/material.dart';
import '../../core/routes/app_routes.dart';
import '../../core/theme/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({Key? key}) : super(key: key);

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _darkMode = true;
  bool _hapticFeedback = true;
  String _tempUnit = 'Celsius (°C)';
  String _pollInterval = '15 minutes';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Application Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const Text('Display & System', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryEmerald)),
          SwitchListTile(
            title: const Text('Material 3 Dark Theme'),
            subtitle: const Text('High-contrast OLED palette for battery saving'),
            value: _darkMode,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _darkMode = val),
          ),
          SwitchListTile(
            title: const Text('Haptic Biomarker Feedback'),
            subtitle: const Text('Subtle haptics on heart rate anomalies and AQI spikes'),
            value: _hapticFeedback,
            activeColor: AppTheme.primaryEmerald,
            onChanged: (val) => setState(() => _hapticFeedback = val),
          ),
          const Divider(),
          const Text('Sensors & Polling', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryEmerald)),
          ListTile(
            title: const Text('Sensor Polling Frequency'),
            subtitle: Text(_pollInterval),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          ListTile(
            title: const Text('Temperature Scale'),
            subtitle: Text(_tempUnit),
            trailing: const Icon(Icons.chevron_right),
            onTap: () {},
          ),
          const Divider(),
          const Text('Account & Privacy', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.primaryEmerald)),
          ListTile(
            leading: const Icon(Icons.person_outline),
            title: const Text('Personal Health Profile'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.pushNamed(context, AppRoutes.profile),
          ),
          ListTile(
            leading: const Icon(Icons.privacy_tip_outlined),
            title: const Text('Consent & HIPAA Controls'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.pushNamed(context, AppRoutes.consent),
          ),
          ListTile(
            leading: const Icon(Icons.watch_outlined),
            title: const Text('Connected Wearable Devices'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.pushNamed(context, AppRoutes.wearable),
          ),
          ListTile(
            leading: const Icon(Icons.download_outlined),
            title: const Text('Export Clinical FHIR / PDF Reports'),
            trailing: const Icon(Icons.chevron_right),
            onTap: () => Navigator.pushNamed(context, AppRoutes.reports),
          ),
        ],
      ),
    );
  }
}
