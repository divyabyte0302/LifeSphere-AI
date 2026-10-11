import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class NotificationsScreen extends StatelessWidget {
  const NotificationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clinical & Environmental Alerts'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _buildAlertTile(
            title: 'Ozone & UV Exceedance Alert',
            body: 'Ground-level ozone elevated to 42 ppb. Avoid prolonged outdoor exertion.',
            time: '14 minutes ago',
            color: AppTheme.accentAmber,
            icon: Icons.wb_sunny,
          ),
          _buildAlertTile(
            title: 'Medication Adherence Due',
            body: 'Montelukast Sodium 10mg scheduled for 09:00 PM.',
            time: '1 hour ago',
            color: AppTheme.primaryEmerald,
            icon: Icons.medication,
          ),
          _buildAlertTile(
            title: 'Wearable Sync Verified',
            body: 'Continuous ECG, HRV and SpO2 synced with LifeSphere cloud.',
            time: '2 hours ago',
            color: AppTheme.secondaryCyan,
            icon: Icons.cloud_done,
          ),
        ],
      ),
    );
  }

  Widget _buildAlertTile({
    required String title,
    required String body,
    required String time,
    required Color color,
    required IconData icon,
  }) {
    return Card(
      margin: const EdgeInsets.only(bottom: 12),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(color: color.withOpacity(0.15), shape: BoxShape.circle),
          child: Icon(icon, color: color, size: 20),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 4),
            Text(body, style: const TextStyle(fontSize: 12)),
            const SizedBox(height: 4),
            Text(time, style: const TextStyle(fontSize: 11, color: Colors.grey)),
          ],
        ),
      ),
    );
  }
}
