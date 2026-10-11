class HealthMetricsModel {
  final double heartRate; // BPM
  final double restingHeartRate;
  final double heartRateVariability; // ms (HRV)
  final double bloodOxygen; // % (SpO2)
  final String bloodPressure; // e.g. 118/76 mmHg
  final double systolic;
  final double diastolic;
  final double bodyTemperature; // Celsius
  final double respiratoryRate; // breaths/min
  final double stressLevel; // 0-100
  final double sleepScore; // 0-100
  final double totalSleepHours;
  final double deepSleepHours;
  final double remSleepHours;
  final int stepCount;
  final double activeCalories;
  final DateTime timestamp;

  const HealthMetricsModel({
    required this.heartRate,
    required this.restingHeartRate,
    required this.heartRateVariability,
    required this.bloodOxygen,
    required this.bloodPressure,
    required this.systolic,
    required this.diastolic,
    required this.bodyTemperature,
    required this.respiratoryRate,
    required this.stressLevel,
    required this.sleepScore,
    required this.totalSleepHours,
    required this.deepSleepHours,
    required this.remSleepHours,
    required this.stepCount,
    required this.activeCalories,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'heartRate': heartRate,
    'restingHeartRate': restingHeartRate,
    'heartRateVariability': heartRateVariability,
    'bloodOxygen': bloodOxygen,
    'bloodPressure': bloodPressure,
    'systolic': systolic,
    'diastolic': diastolic,
    'bodyTemperature': bodyTemperature,
    'respiratoryRate': respiratoryRate,
    'stressLevel': stressLevel,
    'sleepScore': sleepScore,
    'totalSleepHours': totalSleepHours,
    'deepSleepHours': deepSleepHours,
    'remSleepHours': remSleepHours,
    'stepCount': stepCount,
    'activeCalories': activeCalories,
    'timestamp': timestamp.toIso8601String(),
  };

  factory HealthMetricsModel.fromJson(Map<String, dynamic> json) => HealthMetricsModel(
    heartRate: (json['heartRate'] as num).toDouble(),
    restingHeartRate: (json['restingHeartRate'] as num).toDouble(),
    heartRateVariability: (json['heartRateVariability'] as num).toDouble(),
    bloodOxygen: (json['bloodOxygen'] as num).toDouble(),
    bloodPressure: json['bloodPressure'] as String,
    systolic: (json['systolic'] as num).toDouble(),
    diastolic: (json['diastolic'] as num).toDouble(),
    bodyTemperature: (json['bodyTemperature'] as num).toDouble(),
    respiratoryRate: (json['respiratoryRate'] as num).toDouble(),
    stressLevel: (json['stressLevel'] as num).toDouble(),
    sleepScore: (json['sleepScore'] as num).toDouble(),
    totalSleepHours: (json['totalSleepHours'] as num).toDouble(),
    deepSleepHours: (json['deepSleepHours'] as num).toDouble(),
    remSleepHours: (json['remSleepHours'] as num).toDouble(),
    stepCount: (json['stepCount'] as num).toInt(),
    activeCalories: (json['activeCalories'] as num).toDouble(),
    timestamp: DateTime.parse(json['timestamp']),
  );
}
