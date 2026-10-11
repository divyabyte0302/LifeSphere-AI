import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class WearableScreen extends StatelessWidget {
  const WearableScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wearable Devices & Sensors'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            child: ListTile(
              leading: const Icon(Icons.watch, color: AppTheme.primaryEmerald, size: 36),
              title: const Text('Apple Watch Series 9 / Ultra', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('Connected • Battery 84% • Last Sync: 2 min ago'),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppTheme.primaryEmerald.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                child: const Text('ACTIVE', style: TextStyle(color: AppTheme.primaryEmerald, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.ring_volume, color: AppTheme.secondaryCyan, size: 36),
              title: const Text('Oura Ring Gen 3 Horizon', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('Connected • Temperature & HRV Ring'),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppTheme.primaryEmerald.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                child: const Text('ACTIVE', style: TextStyle(color: AppTheme.primaryEmerald, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: const Icon(Icons.air, color: AppTheme.accentAmber, size: 36),
              title: const Text('Atmospheric Pocket Sensor (BLE)', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: const Text('Micro-particulate PM2.5 & VOC optical sensor'),
              trailing: Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                decoration: BoxDecoration(color: AppTheme.accentAmber.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                child: const Text('STANDBY', style: TextStyle(color: AppTheme.accentAmber, fontSize: 11, fontWeight: FontWeight.bold)),
              ),
            ),
          ),
          const SizedBox(height: 20),
          OutlinedButton.icon(
            icon: const Icon(Icons.bluetooth_searching),
            label: const Text('Pair New Wearable / Environmental Probe'),
            onPressed: () {},
            style: OutlinedButton.styleFrom(
              padding: const EdgeInsets.symmetric(vertical: 14),
            ),
          ),
        ],
      ),
    );
  }
}
