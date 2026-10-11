import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';
import '../../widgets/metric_card.dart';

class HealthScreen extends StatelessWidget {
  const HealthScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final healthProvider = context.watch<HealthProvider>();
    final vitals = healthProvider.vitals;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Physiological Vitals & Health'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Card for Live Continuous Heart Rate & ECG
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Electrocardiogram / Heart Rate Rhythm',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryEmerald.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Text('Normal Sinus', style: TextStyle(color: AppTheme.primaryEmerald, fontSize: 12, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    Row(
                      children: [
                        Text(
                          '${vitals?.heartRate.toInt() ?? 72}',
                          style: const TextStyle(fontSize: 42, fontWeight: FontWeight.bold, color: AppTheme.alertRose),
                        ),
                        const SizedBox(width: 8),
                        const Text('BPM (Live)', style: TextStyle(color: Colors.grey)),
                        const Spacer(),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text('HRV: ${vitals?.heartRateVariability.toInt() ?? 58} ms', style: const TextStyle(fontWeight: FontWeight.w600)),
                            Text('Resting: ${vitals?.restingHeartRate.toInt() ?? 64} BPM', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                          ],
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),
                    // Simulated waveform indicator
                    Container(
                      height: 48,
                      width: double.infinity,
                      decoration: BoxDecoration(
                        color: Colors.black.withOpacity(0.04),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Center(
                        child: Text(
                          '• • • ╱╲_╱╲___╱╲_╱╲___ Continuous Telemetry Active • • •',
                          style: TextStyle(fontFamily: 'monospace', color: AppTheme.primaryEmerald, fontSize: 12),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            const Text('Comprehensive Biomarker Panel', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.25,
              children: [
                MetricCard(
                  title: 'SpO2 Oxygen',
                  value: '${vitals?.bloodOxygen ?? 98.4}',
                  unit: '%',
                  icon: Icons.water_drop,
                  iconColor: AppTheme.secondaryCyan,
                  subtitle: 'Arterial Blood Saturation',
                  statusColor: AppTheme.primaryEmerald,
                ),
                MetricCard(
                  title: 'Blood Pressure',
                  value: vitals?.bloodPressure ?? '118/76',
                  unit: 'mmHg',
                  icon: Icons.speed,
                  iconColor: AppTheme.infoBlue,
                  subtitle: 'Optimal Normotensive',
                  statusColor: AppTheme.primaryEmerald,
                ),
                MetricCard(
                  title: 'Core Temperature',
                  value: '${vitals?.bodyTemperature ?? 36.6}',
                  unit: '°C',
                  icon: Icons.thermostat,
                  iconColor: Colors.deepOrange,
                  subtitle: 'Afebrile',
                  statusColor: AppTheme.primaryEmerald,
                ),
                MetricCard(
                  title: 'Stress Index',
                  value: '${vitals?.stressLevel.toInt() ?? 32}',
                  unit: '/100',
                  icon: Icons.psychology,
                  iconColor: Colors.purple,
                  subtitle: 'Low Allostatic Load',
                  statusColor: AppTheme.primaryEmerald,
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
