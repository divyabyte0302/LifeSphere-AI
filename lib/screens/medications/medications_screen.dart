import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class MedicationsScreen extends StatelessWidget {
  const MedicationsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<HealthProvider>();
    final meds = provider.medications;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Prescription & Environmental Warnings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.accentAmber.withOpacity(0.12),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: AppTheme.accentAmber.withOpacity(0.3)),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Icon(Icons.warning_amber_rounded, color: AppTheme.accentAmber, size: 24),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Environmental Contraindication Engine: Automatically flags medications with photosensitivity, thermoregulatory, or dehydration risks when outdoor UV or heat spikes.',
                    style: TextStyle(fontSize: 13, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          ...meds.map((med) => Card(
                margin: const EdgeInsets.only(bottom: 12),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            med.name,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                          Checkbox(
                            value: med.isTakenToday,
                            activeColor: AppTheme.primaryEmerald,
                            onChanged: (_) => provider.toggleMedicationTaken(med.id),
                          ),
                        ],
                      ),
                      Text(
                        'Dosage: ${med.dosage} • ${med.frequency}',
                        style: const TextStyle(color: Colors.grey, fontSize: 13),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Scheduled: ${med.scheduledTimes.join(', ')}',
                        style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500),
                      ),
                      if (med.environmentalWarning != null) ...[
                        const SizedBox(height: 10),
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: AppTheme.alertRose.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.wb_sunny_outlined, size: 16, color: AppTheme.alertRose),
                              const SizedBox(width: 6),
                              Expanded(
                                child: Text(
                                  med.environmentalWarning!,
                                  style: const TextStyle(color: AppTheme.alertRose, fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ),
              )),
        ],
      ),
    );
  }
}
