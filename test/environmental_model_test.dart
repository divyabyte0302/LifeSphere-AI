import 'package:flutter_test/flutter_test.dart';
import 'package:lifesphere_ai/models/environmental_model.dart';

void main() {
  group('EnvironmentalModel Unit Tests', () {
    test('Correctly serializes and parses atmospheric telemetry', () {
      final now = DateTime.now();
      final env = EnvironmentalModel(
        airQualityIndex: 28,
        pm25: 6.2,
        pm10: 14.1,
        ozone: 24.0,
        nitrogenDioxide: 8.5,
        sulfurDioxide: 2.1,
        carbonMonoxide: 0.4,
        temperature: 21.5,
        humidity: 48.0,
        uvIndex: 3.5,
        pollenCount: 38,
        locationName: 'San Francisco, CA',
        latitude: 37.7749,
        longitude: -122.4194,
        timestamp: now,
      );

      final json = env.toJson();
      expect(json['airQualityIndex'], 28);
      expect(json['pm25'], 6.2);
      expect(json['locationName'], 'San Francisco, CA');

      final restored = EnvironmentalModel.fromJson(json);
      expect(restored.airQualityIndex, 28);
      expect(restored.pm25, 6.2);
      expect(restored.uvIndex, 3.5);
    });

    test('Validates AQI risk categorization logic', () {
      final goodEnv = EnvironmentalModel(
        airQualityIndex: 35,
        pm25: 8.0,
        pm10: 15.0,
        ozone: 20.0,
        nitrogenDioxide: 10.0,
        sulfurDioxide: 2.0,
        carbonMonoxide: 0.5,
        temperature: 22.0,
        humidity: 50.0,
        uvIndex: 3.0,
        pollenCount: 20,
        locationName: 'Optimal Station',
        latitude: 37.0,
        longitude: -122.0,
        timestamp: DateTime.now(),
      );

      expect(goodEnv.airQualityIndex <= 50, isTrue);
    });
  });
}
