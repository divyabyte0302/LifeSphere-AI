import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class LifestyleScreen extends StatelessWidget {
  const LifestyleScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final vitals = context.watch<HealthProvider>().vitals;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Circadian Sleep & Recovery'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Sleep Score', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('${vitals?.sleepScore.toInt() ?? 86}/100', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryEmerald, fontSize: 18)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  Text('Total Sleep: ${vitals?.totalSleepHours ?? 7.8} hours', style: const TextStyle(fontWeight: FontWeight.w600)),
                  Text('Deep Sleep: ${vitals?.deepSleepHours ?? 2.1}h • REM Sleep: ${vitals?.remSleepHours ?? 1.9}h', style: const TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 16),
                  const Text('Environmental Sleep Hygiene Tip: Ambient bedroom humidity is 52% (ideal). Keep noise levels below 35 dB for uninterrupted delta-wave sleep.', style: TextStyle(fontSize: 12, color: Colors.grey)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text('Daily Activity & Step Target', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('${vitals?.stepCount ?? 8420} / 10,000 steps', style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.infoBlue)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: ((vitals?.stepCount ?? 8420) / 10000).clamp(0.0, 1.0),
                    backgroundColor: AppTheme.infoBlue.withOpacity(0.15),
                    color: AppTheme.infoBlue,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(5),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
