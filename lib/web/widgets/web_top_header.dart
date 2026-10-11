import 'package:flutter/material.dart';

class WebTopHeader extends StatelessWidget {
  final String title;
  final ValueChanged<String>? onSearch;
  final VoidCallback? onNotificationsTap;
  final VoidCallback? onProfileTap;
  final VoidCallback? onEmergencyTap;

  const WebTopHeader({
    Key? key,
    required this.title,
    this.onSearch,
    this.onNotificationsTap,
    this.onProfileTap,
    this.onEmergencyTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Container(
      height: 70,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        border: Border(bottom: BorderSide(color: theme.colorScheme.outlineVariant.withOpacity(0.4))),
      ),
      child: Row(
        children: [
          // Section Title
          Text(
            title,
            style: theme.textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(width: 32),

          // Search Field
          Expanded(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: SizedBox(
                height: 40,
                child: TextField(
                  onChanged: onSearch,
                  style: const TextStyle(fontSize: 13),
                  decoration: InputDecoration(
                    hintText: 'Search biomarkers, medications, reports...',
                    prefixIcon: const Icon(Icons.search, size: 18),
                    filled: true,
                    fillColor: theme.colorScheme.surfaceVariant.withOpacity(0.3),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
              ),
            ),
          ),
          const Spacer(),

          // Actions
          Row(
            children: [
              // Emergency SOS Button
              ElevatedButton.icon(
                onPressed: onEmergencyTap,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.red.shade700,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                ),
                icon: const Icon(Icons.emergency, size: 16),
                label: const Text('SOS', style: TextStyle(fontWeight: FontWeight.bold)),
              ),
              const SizedBox(width: 16),

              // Notifications
              IconButton(
                onPressed: onNotificationsTap,
                icon: const Badge(
                  label: Text('3'),
                  child: Icon(Icons.notifications_none),
                ),
                tooltip: 'Notifications',
              ),
              const SizedBox(width: 8),

              // User Profile Avatar
              InkWell(
                onTap: onProfileTap,
                borderRadius: BorderRadius.circular(24),
                child: Padding(
                  padding: const EdgeInsets.all(4.0),
                  child: Row(
                    children: [
                      const CircleAvatar(
                        radius: 16,
                        child: Text('JV', style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                      ),
                      const SizedBox(width: 8),
                      const Icon(Icons.keyboard_arrow_down, size: 18),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
