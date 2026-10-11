import 'package:flutter/material.dart';

class WebSidebar extends StatelessWidget {
  final String activeRoute;
  final Function(String route) onNavigate;

  const WebSidebar({
    Key? key,
    required this.activeRoute,
    required this.onNavigate,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final items = [
      {'route': '/dashboard', 'label': 'Dashboard', 'icon': Icons.dashboard_outlined, 'activeIcon': Icons.dashboard},
      {'route': '/health', 'label': 'Health Overview', 'icon': Icons.monitor_heart_outlined, 'activeIcon': Icons.monitor_heart},
      {'route': '/medical-records', 'label': 'Medical Records', 'icon': Icons.folder_shared_outlined, 'activeIcon': Icons.folder_shared},
      {'route': '/reports', 'label': 'Reports', 'icon': Icons.description_outlined, 'activeIcon': Icons.description},
      {'route': '/medications', 'label': 'Medications', 'icon': Icons.medication_outlined, 'activeIcon': Icons.medication},
      {'route': '/lifestyle', 'label': 'Lifestyle', 'icon': Icons.nights_stay_outlined, 'activeIcon': Icons.nights_stay},
      {'route': '/environment', 'label': 'Environment', 'icon': Icons.wb_sunny_outlined, 'activeIcon': Icons.wb_sunny},
      {'route': '/wearables', 'label': 'Wearables', 'icon': Icons.watch_outlined, 'activeIcon': Icons.watch},
      {'route': '/trends', 'label': 'Health Trends', 'icon': Icons.trending_up_outlined, 'activeIcon': Icons.trending_up},
      {'route': '/recommendations', 'label': 'Recommendations', 'icon': Icons.auto_awesome_outlined, 'activeIcon': Icons.auto_awesome},
      {'route': '/checkups', 'label': 'Check-ups', 'icon': Icons.medical_services_outlined, 'activeIcon': Icons.medical_services},
      {'route': '/diet-plan', 'label': 'Health & Diet Plan', 'icon': Icons.restaurant_outlined, 'activeIcon': Icons.restaurant},
      {'route': '/emergency', 'label': 'Emergency Support', 'icon': Icons.emergency_outlined, 'activeIcon': Icons.emergency},
      {'route': '/settings', 'label': 'Settings', 'icon': Icons.settings_outlined, 'activeIcon': Icons.settings},
    ];

    return Container(
      width: 260,
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(right: BorderSide(color: theme.colorScheme.outlineVariant.withOpacity(0.4))),
      ),
      child: Column(
        children: [
          // Logo & Branding
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            child: Row(
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: theme.colorScheme.primary,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(Icons.pulse_alert, color: Colors.white, size: 24),
                ),
                const SizedBox(width: 12),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'LIFESPHERE AI',
                      style: theme.textTheme.titleMedium?.copyWith(
                        fontWeight: FontWeight.bold,
                        letterSpacing: 0.8,
                      ),
                    ),
                    Text(
                      'Health Intelligence',
                      style: theme.textTheme.labelSmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const Divider(height: 1),

          // Navigation Links
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
              itemCount: items.length,
              separatorBuilder: (_, __) => const SizedBox(height: 4),
              itemBuilder: (context, index) {
                final item = items[index];
                final isSelected = activeRoute == item['route'];
                final color = isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurfaceVariant;

                return InkWell(
                  onTap: () => onNavigate(item['route'] as String),
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
                    decoration: BoxDecoration(
                      color: isSelected ? theme.colorScheme.primary.withOpacity(0.12) : Colors.transparent,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Row(
                      children: [
                        Icon(
                          isSelected ? item['activeIcon'] as IconData : item['icon'] as IconData,
                          size: 20,
                          color: color,
                        ),
                        const SizedBox(width: 14),
                        Text(
                          item['label'] as String,
                          style: theme.textTheme.bodyMedium?.copyWith(
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                            color: isSelected ? theme.colorScheme.primary : theme.colorScheme.onSurface,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),

          // User Profile Status in Sidebar footer
          Container(
            padding: const EdgeInsets.all(16),
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: theme.colorScheme.surfaceVariant.withOpacity(0.3),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 18,
                  child: Text('JV', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Dr. Jordan Vance',
                        style: theme.textTheme.labelMedium?.copyWith(fontWeight: FontWeight.bold),
                        overflow: TextOverflow.ellipsis,
                      ),
                      Text(
                        'Patient ID: #LS-8842',
                        style: theme.textTheme.labelSmall?.copyWith(color: theme.colorScheme.onSurfaceVariant),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
