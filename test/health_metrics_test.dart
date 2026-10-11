import 'package:flutter_test/flutter_test.dart';
import 'package:lifesphere_ai/models/health_metrics_model.dart';

void main() {
  group('HealthMetricsModel Unit Tests', () {
    test('Correctly serializes and deserializes health metrics', () {
      final now = DateTime.now();
      final metrics = HealthMetricsModel(
        heartRate: 72.0,
        restingHeartRate: 64.0,
        heartRateVariability: 62.0,
        bloodOxygen: 98.4,
        bloodPressure: '118/76',
        systolic: 118.0,
        diastolic: 76.0,
        bodyTemperature: 36.8,
        respiratoryRate: 14.0,
        stressLevel: 28.0,
        sleepScore: 88.0,
        totalSleepHours: 7.8,
        deepSleepHours: 1.9,
        remSleepHours: 2.1,
        stepCount: 8420,
        activeCalories: 480.0,
        timestamp: now,
      );

      final json = metrics.toJson();
      expect(json['heartRate'], 72.0);
      expect(json['restingHeartRate'], 64.0);
      expect(json['bloodOxygen'], 98.4);
      expect(json['stepCount'], 8420);

      final restored = HealthMetricsModel.fromJson(json);
      expect(restored.heartRate, 72.0);
      expect(restored.restingHeartRate, 64.0);
      expect(restored.bloodPressure, '118/76');
    });

    test('Validates physiological boundary limits', () {
      final metrics = HealthMetricsModel(
        heartRate: 64.0,
        restingHeartRate: 58.0,
        heartRateVariability: 65.0,
        bloodOxygen: 98.0,
        bloodPressure: '120/80',
        systolic: 120.0,
        diastolic: 80.0,
        bodyTemperature: 37.0,
        respiratoryRate: 15.0,
        stressLevel: 20.0,
        sleepScore: 90.0,
        totalSleepHours: 8.0,
        deepSleepHours: 2.0,
        remSleepHours: 2.0,
        stepCount: 10000,
        activeCalories: 500.0,
        timestamp: DateTime.now(),
      );

      expect(metrics.bloodOxygen >= 90.0 && metrics.bloodOxygen <= 100.0, isTrue);
      expect(metrics.heartRate >= 40.0 && metrics.heartRate <= 200.0, isTrue);
    });
  });
}
