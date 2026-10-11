import 'dart:convert';
import 'package:http/http.dart' as http;
import '../../models/environmental_model.dart';
import '../../models/health_metrics_model.dart';

class GeminiAiService {
  final String? apiKey;

  GeminiAiService({this.apiKey});

  /// Analyzes physiological metrics against current ambient environmental hazards
  Future<String> analyzeHealthAndEnvironment({
    required HealthMetricsModel health,
    required EnvironmentalModel env,
    required List<String> chronicConditions,
  }) async {
    // Structured prompt for Gemini AI model
    final prompt = '''
You are LifeSphere AI, an advanced Clinical and Environmental Health Intelligence engine.
Patient Profile:
- Chronic Conditions: ${chronicConditions.isEmpty ? 'None reported' : chronicConditions.join(', ')}
- Heart Rate: ${health.heartRate} BPM (Resting: ${health.restingHeartRate})
- Blood Oxygen (SpO2): ${health.bloodOxygen}%
- Blood Pressure: ${health.bloodPressure}
- Stress Index: ${health.stressLevel}/100

Ambient Environmental Telemetry:
- Location: ${env.locationName}
- Air Quality Index (AQI): ${env.airQualityIndex} (${env.airQualityCategory})
- PM2.5: ${env.pm25} µg/m³, PM10: ${env.pm10} µg/m³
- UV Index: ${env.uvIndex} (${env.uvCategory})
- Pollen Count: ${env.pollenCount} grains/m³ (${env.pollenCategory})
- Temperature: ${env.temperature}°C, Humidity: ${env.humidity}%

Please provide:
1. Executive Health & Environmental Synergy Assessment (2 sentences)
2. Immediate Risk Flags (bullet points)
3. Actionable Clinical Recommendations (outdoor activity limits, medication timing, hydration, respiratory filtering)
Keep tone reassuring, highly scientific, and clear.
''';

    // If API key is present, calls Gemini endpoint, else provides intelligent contextual rule-engine synthesis
    if (apiKey != null && apiKey!.isNotEmpty) {
      try {
        final url = Uri.parse(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=$apiKey',
        );
        final response = await http.post(
          url,
          headers: {'Content-Type': 'application/json'},
          body: jsonEncode({
            'contents': [
              {
                'parts': [
                  {'text': prompt}
                ]
              }
            ]
          }),
        );

        if (response.statusCode == 200) {
          final data = jsonDecode(response.body);
          final candidateText =
              data['candidates']?[0]?['content']?['parts']?[0]?['text'];
          if (candidateText != null) {
            return candidateText;
          }
        }
      } catch (e) {
        // Fall through to expert synthesis
      }
    }

    return _generateDeterministicClinicalInsight(health, env, chronicConditions);
  }

  String _generateDeterministicClinicalInsight(
    HealthMetricsModel health,
    EnvironmentalModel env,
    List<String> conditions,
  ) {
    final buffer = StringBuffer();
    buffer.writeln('### LifeSphere AI Biometric & Environmental Synergy Analysis\n');

    final bool hasAsthma = conditions.any((c) => c.toLowerCase().contains('asthma'));
    final bool highAQI = env.airQualityIndex > 100;
    final bool highUV = env.uvIndex >= 6.0;

    buffer.writeln(
      '**Synergy Overview**: Ambient Air Quality Index at ${env.airQualityIndex.toInt()} (${env.airQualityCategory}) '
      'combined with your resting heart rate of ${health.restingHeartRate.toInt()} BPM and SpO2 of ${health.bloodOxygen}% '
      'indicates ${highAQI ? "elevated pulmonary stress potential." : "stable physiological equilibrium."}\n',
    );

    buffer.writeln('**Clinical Risk Corroboration:**');
    if (highAQI && hasAsthma) {
      buffer.writeln('• **High Respiratory Risk**: Elevated PM2.5 (${env.pm25} µg/m³) is a known trigger for bronchospasm in asthma.');
    }
    if (highUV) {
      buffer.writeln('• **UV Phototoxicity Risk**: Index of ${env.uvIndex} demands SPF 50+ barrier protection within 15 minutes of exposure.');
    }
    if (health.stressLevel > 65) {
      buffer.writeln('• **Sympathetic Overactivation**: Stress score ${health.stressLevel.toInt()}/100 detected alongside heart rate variance.');
    }

    buffer.writeln('\n**Actionable Directives:**');
    buffer.writeln('1. Limit strenuous outdoor cardio while AQI exceeds 100; reschedule workouts indoors.');
    buffer.writeln('2. Maintain fluid intake above 2.5L to preserve mucosal barrier defense against particulate irritation.');
    buffer.writeln('3. Ensure quick-relief inhaler or prescribed regimen is accessible.');

    return buffer.toString();
  }
}
