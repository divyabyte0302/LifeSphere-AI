import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class RecommendationsScreen extends StatelessWidget {
  const RecommendationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final recs = context.watch<HealthProvider>().recommendations;

    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Health Recommendations'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: recs.length,
        itemBuilder: (context, index) {
          final rec = recs[index];
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryEmerald.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          rec.category.toUpperCase(),
                          style: const TextStyle(color: AppTheme.primaryEmerald, fontSize: 10, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const Spacer(),
                      Text(
                        'Priority: ${rec.priority.toUpperCase()}',
                        style: TextStyle(
                          color: rec.priority == 'high' ? AppTheme.alertRose : AppTheme.accentAmber,
                          fontWeight: FontWeight.bold,
                          fontSize: 11,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),
                  Text(
                    rec.title,
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    rec.description,
                    style: const TextStyle(fontSize: 13, height: 1.4, color: Colors.grey),
                  ),
                  const SizedBox(height: 10),
                  Text(
                    'Trigger: ${rec.triggerSource}',
                    style: const TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.grey),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
