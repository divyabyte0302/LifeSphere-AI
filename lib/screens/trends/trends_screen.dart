import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class TrendsScreen extends StatelessWidget {
  const TrendsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Longitudinal Trends & Correlations'),
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
                  const Text('Heart Rate Variability vs Air Quality (30 Days)', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  const SizedBox(height: 8),
                  const Text('Direct inverse correlation observed: On days with AQI > 120, your HRV drops by an average of 18%, indicating pulmonary sympathetic stress.', style: TextStyle(color: Colors.grey, fontSize: 13)),
                  const SizedBox(height: 20),
                  Container(
                    height: 140,
                    width: double.infinity,
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.04),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            _buildBar('Mon', 45, AppTheme.primaryEmerald),
                            _buildBar('Tue', 68, AppTheme.primaryEmerald),
                            _buildBar('Wed', 88, AppTheme.accentAmber),
                            _buildBar('Thu', 34, AppTheme.alertRose),
                            _buildBar('Fri', 60, AppTheme.primaryEmerald),
                            _buildBar('Sat', 75, AppTheme.primaryEmerald),
                            _buildBar('Sun', 80, AppTheme.primaryEmerald),
                          ],
                        ),
                      ],
                    ),
                  ),
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
                children: const [
                  Text('Circadian Sleep Latency vs Ambient Temperature', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  SizedBox(height: 8),
                  Text('Bedroom temperatures above 22°C increased awake transitions from 1.2 to 3.8 events per night.', style: TextStyle(color: Colors.grey, fontSize: 13)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBar(String day, double heightPct, Color color) {
    return Column(
      children: [
        Container(
          width: 18,
          height: heightPct,
          decoration: BoxDecoration(
            color: color,
            borderRadius: BorderRadius.circular(4),
          ),
        ),
        const SizedBox(height: 6),
        Text(day, style: const TextStyle(fontSize: 11, color: Colors.grey)),
      ],
    );
  }
}
