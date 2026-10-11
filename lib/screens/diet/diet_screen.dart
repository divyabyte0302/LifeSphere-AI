import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class DietScreen extends StatelessWidget {
  const DietScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Anti-Inflammatory Diet & Hydration'),
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
                    children: const [
                      Text('Hydration Target', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                      Text('2,100 / 3,000 mL', style: TextStyle(color: AppTheme.secondaryCyan, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  LinearProgressIndicator(
                    value: 0.7,
                    backgroundColor: AppTheme.secondaryCyan.withOpacity(0.15),
                    color: AppTheme.secondaryCyan,
                    minHeight: 10,
                    borderRadius: BorderRadius.circular(5),
                  ),
                  const SizedBox(height: 10),
                  const Text('High temperature (23.5°C) & UV index require +500mL fluid compensation today.', style: TextStyle(color: Colors.grey, fontSize: 12)),
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
                  Text('Environmental Antioxidant Nutrition Protocol', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  SizedBox(height: 8),
                  Text('To counteract oxidative stress from particulate matter (PM2.5), prioritize foods rich in Vitamin C, Sulforaphane (broccoli sprouts), and Polyphenols (green tea, berries).', style: TextStyle(fontSize: 13, height: 1.4)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
