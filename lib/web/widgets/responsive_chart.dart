import 'package:flutter/material.dart';

class ResponsiveChart extends StatelessWidget {
  final String title;
  final String? subtitle;
  final Widget chart;
  final Widget? action;
  final double height;

  const ResponsiveChart({
    Key? key,
    required this.title,
    this.subtitle,
    required this.chart,
    this.action,
    this.height = 260,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: theme.colorScheme.surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: theme.colorScheme.outlineVariant.withOpacity(0.4)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle!,
                      style: theme.textTheme.bodySmall?.copyWith(
                        color: theme.colorScheme.onSurfaceVariant,
                      ),
                    ),
                  ],
                ],
              ),
              if (action != null) action!,
            ],
          ),
          const SizedBox(height: 16),
          SizedBox(
            height: height,
            width: double.infinity,
            child: chart,
          ),
        ],
      ),
    );
  }
}
