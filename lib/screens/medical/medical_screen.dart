import 'package:flutter/material.dart';
import '../../core/theme/app_theme.dart';

class MedicalScreen extends StatelessWidget {
  const MedicalScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Clinical History & EHR'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: const [
          Card(
            child: ListTile(
              leading: Icon(Icons.assignment, color: AppTheme.primaryEmerald),
              title: Text('Comprehensive Metabolic Panel', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Analyzed 12 days ago • Normal fasting glucose & electrolytes'),
              trailing: Icon(Icons.chevron_right),
            ),
          ),
          SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: Icon(Icons.vaccines, color: AppTheme.infoBlue),
              title: Text('Immunization Records', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('Influenza (Annual), Tdap, COVID-19 mRNA Updated'),
              trailing: Icon(Icons.chevron_right),
            ),
          ),
          SizedBox(height: 12),
          Card(
            child: ListTile(
              leading: Icon(Icons.air, color: AppTheme.accentAmber),
              title: Text('Spirometry & Pulmonary Function Test', style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text('FEV1/FVC Ratio: 82% (Mild obstruction under high particulate load)'),
              trailing: Icon(Icons.chevron_right),
            ),
          ),
        ],
      ),
    );
  }
}
