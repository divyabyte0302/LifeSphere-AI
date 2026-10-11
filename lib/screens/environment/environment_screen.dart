import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';
import '../../widgets/metric_card.dart';

class EnvironmentScreen extends StatelessWidget {
  const EnvironmentScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final healthProvider = context.watch<HealthProvider>();
    final env = healthProvider.environment;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Environmental Intelligence'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () => healthProvider.initializeData(),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Hero AQI Card
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppTheme.accentAmber.withOpacity(0.4)),
              ),
              child: Column(
                children: [
                  const Text('Ambient Air Quality Index (AQI)', style: TextStyle(color: Colors.white70)),
                  const SizedBox(height: 8),
                  Text(
                    '${env?.airQualityIndex.toInt() ?? 68}',
                    style: const TextStyle(fontSize: 48, fontWeight: FontWeight.bold, color: AppTheme.accentAmber),
                  ),
                  Text(
                    env?.airQualityCategory ?? 'Moderate',
                    style: const TextStyle(fontSize: 18, color: Colors.white, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(height: 12),
                  const Text(
                    'Sensitive individuals with asthma or COPD should consider limiting prolonged outdoor exertion.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Colors.white60, fontSize: 13),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Atmospheric Pollutants & Particulates',
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            GridView.count(
              crossAxisCount: 2,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.3,
              children: [
                MetricCard(
                  title: 'PM2.5 Fine Dust',
                  value: '${env?.pm25 ?? 18.4}',
                  unit: 'µg/m³',
                  icon: Icons.grain,
                  iconColor: Colors.deepOrange,
                  subtitle: 'Target: < 12 µg/m³',
                  statusColor: AppTheme.accentAmber,
                ),
                MetricCard(
                  title: 'PM10 Inhalable',
                  value: '${env?.pm10 ?? 34.2}',
                  unit: 'µg/m³',
                  icon: Icons.waves,
                  iconColor: Colors.amber,
                  subtitle: 'Target: < 50 µg/m³',
                  statusColor: AppTheme.primaryEmerald,
                ),
                MetricCard(
                  title: 'UV Radiation',
                  value: '${env?.uvIndex ?? 4.8}',
                  unit: 'Index',
                  icon: Icons.sunny,
                  iconColor: Colors.orange,
                  subtitle: 'Moderate Protection',
                  statusColor: Colors.orange,
                ),
                MetricCard(
                  title: 'Pollen Allergen',
                  value: '${env?.pollenCount.toInt() ?? 142}',
                  unit: 'gr/m³',
                  icon: Icons.local_florist,
                  iconColor: Colors.green,
                  subtitle: 'Tree & Grass Mix',
                  statusColor: Colors.orange,
                ),
                MetricCard(
                  title: 'Ambient Temp',
                  value: '${env?.temperature ?? 23.5}',
                  unit: '°C',
                  icon: Icons.thermostat,
                  iconColor: Colors.redAccent,
                  subtitle: 'Feels like 24°C',
                  statusColor: AppTheme.primaryEmerald,
                ),
                MetricCard(
                  title: 'Relative Humidity',
                  value: '${env?.humidity.toInt() ?? 52}',
                  unit: '%',
                  icon: Icons.water_drop_outlined,
                  iconColor: Colors.cyan,
                  subtitle: 'Comfort zone (40-60%)',
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
