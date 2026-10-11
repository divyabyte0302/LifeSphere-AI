import '../../models/environmental_model.dart';
import '../../models/health_metrics_model.dart';
import '../../models/medication_model.dart';

class HealthApiService {
  // Returns real-time synthesized vitals from wearable & internal sensors
  Future<HealthMetricsModel> fetchLatestHealthMetrics() async {
    await Future.delayed(const Duration(milliseconds: 150));
    return HealthMetricsModel(
      heartRate: 72.0,
      restingHeartRate: 64.0,
      heartRateVariability: 58.0,
      bloodOxygen: 98.4,
      bloodPressure: '118/76',
      systolic: 118,
      diastolic: 76,
      bodyTemperature: 36.6,
      respiratoryRate: 14.5,
      stressLevel: 32.0,
      sleepScore: 86.0,
      totalSleepHours: 7.8,
      deepSleepHours: 2.1,
      remSleepHours: 1.9,
      stepCount: 8420,
      activeCalories: 485.0,
      timestamp: DateTime.now(),
    );
  }

  // Returns ambient environmental sensor data for user geo-coordinates
  Future<EnvironmentalModel> fetchEnvironmentalData() async {
    await Future.delayed(const Duration(milliseconds: 150));
    return EnvironmentalModel(
      locationName: 'Metropolitan Biosphere Hub',
      airQualityIndex: 68.0,
      airQualityCategory: 'Moderate',
      pm25: 18.4,
      pm10: 34.2,
      ozone: 42.0,
      uvIndex: 4.8,
      uvCategory: 'Moderate',
      pollenCount: 142.0,
      pollenCategory: 'Medium',
      temperature: 23.5,
      humidity: 52.0,
      noiseDecibels: 48.0,
      atmosphericPressure: 1013.25,
      timestamp: DateTime.now(),
    );
  }

  // Returns current active prescription medications
  Future<List<MedicationModel>> fetchMedications() async {
    return [
      const MedicationModel(
        id: 'med_01',
        name: 'Montelukast Sodium',
        dosage: '10mg',
        frequency: 'Once daily at bedtime',
        scheduledTimes: ['09:00 PM'],
        isTakenToday: true,
        notes: 'Leukotriene receptor antagonist for asthma & seasonal allergic rhinitis.',
      ),
      const MedicationModel(
        id: 'med_02',
        name: 'Omega-3 EPA/DHA',
        dosage: '1000mg',
        frequency: 'Twice daily with meals',
        scheduledTimes: ['08:00 AM', '07:00 PM'],
        isTakenToday: false,
        notes: 'Cardiovascular cellular membrane support.',
      ),
      const MedicationModel(
        id: 'med_03',
        name: 'Doxycycline Hyclate',
        dosage: '100mg',
        frequency: 'Once daily',
        scheduledTimes: ['10:00 AM'],
        isTakenToday: true,
        notes: 'Short course antibiotic.',
        environmentalWarning: 'High photosensitivity: extreme sensitivity to sunlight and UV index above 4.0.',
      ),
    ];
  }
}
