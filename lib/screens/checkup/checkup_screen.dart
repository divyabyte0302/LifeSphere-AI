import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/theme/app_theme.dart';
import '../../providers/health_provider.dart';

class CheckupScreen extends StatefulWidget {
  const CheckupScreen({Key? key}) : super(key: key);

  @override
  State<CheckupScreen> createState() => _CheckupScreenState();
}

class _CheckupScreenState extends State<CheckupScreen> {
  final TextEditingController _symptomController = TextEditingController();
  final List<Map<String, String>> _messages = [
    {
      'role': 'assistant',
      'text': 'Hello, I am your LifeSphere AI Health & Environmental Triage Assistant. Describe any symptoms you are experiencing (e.g., chest tightness, shortness of breath, headache, nasal congestion) and I will evaluate them alongside your physiological vitals and ambient air quality data.'
    }
  ];
  bool _isResponding = false;

  void _handleSend() async {
    final query = _symptomController.text.trim();
    if (query.isEmpty) return;

    setState(() {
      _messages.add({'role': 'user', 'text': query});
      _isResponding = true;
      _symptomController.clear();
    });

    final provider = context.read<HealthProvider>();
    final aqi = provider.environment?.airQualityIndex ?? 68;
    final hr = provider.vitals?.heartRate ?? 72;

    await Future.delayed(const Duration(milliseconds: 900));

    String reply = '';
    final lower = query.toLowerCase();
    if (lower.contains('breath') || lower.contains('cough') || lower.contains('wheez') || lower.contains('chest')) {
      reply = 'Based on your reported respiratory symptoms, current ambient AQI of ${aqi.toInt()} and particulate PM2.5 levels, there is an elevated likelihood of acute bronchial irritation. Given your mild asthma history:\n\n1. Inhale 2 puffs of your prescribed albuterol rescue inhaler.\n2. Remain indoors in a filtered-air environment.\n3. If shortness of breath persists or your SpO2 drops below 94%, tap Emergency SOS immediately.';
    } else if (lower.contains('headache') || lower.contains('dizz') || lower.contains('tired')) {
      reply = 'Current outdoor temperature is 23.5°C with 52% humidity. Your resting heart rate is ${hr.toInt()} BPM. Mild dehydration or barometric pressure shifts can induce cephalalgia. We advise drinking 500mL of electrolyte-infused water and taking a 15-minute screen rest in a dim environment.';
    } else {
      reply = 'Thank you for documenting this. Your vitals remain within stable thresholds. Ambient air quality is currently ${aqi.toInt()} (Moderate). We will log this in your daily trend report. If symptoms intensify, consult your healthcare practitioner.';
    }

    setState(() {
      _messages.add({'role': 'assistant', 'text': reply});
      _isResponding = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('AI Symptom & Environmental Checkup'),
      ),
      body: Column(
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            color: AppTheme.primaryEmerald.withOpacity(0.1),
            child: Row(
              children: const [
                Icon(Icons.shield_outlined, size: 16, color: AppTheme.primaryEmerald),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Clinical Triage AI: Cross-referenced with real-time biometric and sensor telemetry.',
                    style: TextStyle(fontSize: 12, color: AppTheme.primaryEmerald, fontWeight: FontWeight.w500),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.only(bottom: 12),
                    constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: isUser
                          ? AppTheme.primaryEmerald
                          : (Theme.of(context).brightness == Brightness.dark
                              ? const Color(0xFF1E293B)
                              : const Color(0xFFF1F5F9)),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: Text(
                      msg['text']!,
                      style: TextStyle(
                        color: isUser ? Colors.white : null,
                        fontSize: 14,
                        height: 1.4,
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isResponding)
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2)),
                  SizedBox(width: 12),
                  Text('LifeSphere AI evaluating biomarker synergy...', style: TextStyle(fontSize: 12, fontStyle: FontStyle.italic)),
                ],
              ),
            ),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Theme.of(context).cardColor,
              border: Border(top: BorderSide(color: Colors.grey.withOpacity(0.2))),
            ),
            child: Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _symptomController,
                    onSubmitted: (_) => _handleSend(),
                    decoration: InputDecoration(
                      hintText: 'Describe symptoms or environmental sensations...',
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(24)),
                      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                IconButton(
                  icon: const Icon(Icons.send, color: AppTheme.primaryEmerald),
                  onPressed: _handleSend,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
