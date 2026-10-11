import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final user = context.watch<HealthProvider>().currentUser;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Patient Biometric Profile'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Center(
            child: CircleAvatar(
              radius: 40,
              backgroundColor: AppTheme.primaryEmerald.withOpacity(0.2),
              child: const Icon(Icons.person, size: 48, color: AppTheme.primaryEmerald),
            ),
          ),
          const SizedBox(height: 12),
          Center(
            child: Text(
              user.name,
              style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
            ),
          ),
          Center(
            child: Text(
              user.email,
              style: const TextStyle(color: Colors.grey, fontSize: 13),
            ),
          ),
          const SizedBox(height: 24),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.cake_outlined),
                  title: const Text('Age & Gender'),
                  subtitle: Text('${user.age} Years • ${user.gender}'),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.height),
                  title: const Text('Height & Weight'),
                  subtitle: Text('${user.heightCm} cm • ${user.weightKg} kg (BMI: 22.8)'),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.bloodtype_outlined, color: AppTheme.alertRose),
                  title: const Text('Blood Group'),
                  subtitle: Text(user.bloodType),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.medical_services_outlined, color: AppTheme.accentAmber),
                  title: const Text('Chronic Conditions'),
                  subtitle: Text(user.chronicConditions.join(', ')),
                ),
                const Divider(),
                ListTile(
                  leading: const Icon(Icons.spa_outlined, color: AppTheme.secondaryCyan),
                  title: const Text('Documented Allergies'),
                  subtitle: Text(user.allergies.join(', ')),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
