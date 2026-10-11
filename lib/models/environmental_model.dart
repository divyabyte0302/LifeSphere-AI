class EnvironmentalModel {
  final String locationName;
  final double airQualityIndex; // AQI
  final String airQualityCategory; // Good, Moderate, Unhealthy for Sensitive Groups, etc.
  final double pm25; // ug/m3
  final double pm10; // ug/m3
  final double ozone; // ppb
  final double uvIndex; // 0 - 12+
  final String uvCategory; // Low, Moderate, High, Extreme
  final double pollenCount; // grains/m3
  final String pollenCategory; // Low, Medium, High
  final double temperature; // Celsius
  final double humidity; // %
  final double noiseDecibels; // dB ambient
  final double atmosphericPressure; // hPa
  final DateTime timestamp;

  const EnvironmentalModel({
    required this.locationName,
    required this.airQualityIndex,
    required this.airQualityCategory,
    required this.pm25,
    required this.pm10,
    required this.ozone,
    required this.uvIndex,
    required this.uvCategory,
    required this.pollenCount,
    required this.pollenCategory,
    required this.temperature,
    required this.humidity,
    required this.noiseDecibels,
    required this.atmosphericPressure,
    required this.timestamp,
  });

  Map<String, dynamic> toJson() => {
    'locationName': locationName,
    'airQualityIndex': airQualityIndex,
    'airQualityCategory': airQualityCategory,
    'pm25': pm25,
    'pm10': pm10,
    'ozone': ozone,
    'uvIndex': uvIndex,
    'uvCategory': uvCategory,
    'pollenCount': pollenCount,
    'pollenCategory': pollenCategory,
    'temperature': temperature,
    'humidity': humidity,
    'noiseDecibels': noiseDecibels,
    'atmosphericPressure': atmosphericPressure,
    'timestamp': timestamp.toIso8601String(),
  };

  factory EnvironmentalModel.fromJson(Map<String, dynamic> json) => EnvironmentalModel(
    locationName: json['locationName'] as String,
    airQualityIndex: (json['airQualityIndex'] as num).toDouble(),
    airQualityCategory: json['airQualityCategory'] as String,
    pm25: (json['pm25'] as num).toDouble(),
    pm10: (json['pm10'] as num).toDouble(),
    ozone: (json['ozone'] as num).toDouble(),
    uvIndex: (json['uvIndex'] as num).toDouble(),
    uvCategory: json['uvCategory'] as String,
    pollenCount: (json['pollenCount'] as num).toDouble(),
    pollenCategory: json['pollenCategory'] as String,
    temperature: (json['temperature'] as num).toDouble(),
    humidity: (json['humidity'] as num).toDouble(),
    noiseDecibels: (json['noiseDecibels'] as num).toDouble(),
    atmosphericPressure: (json['atmosphericPressure'] as num).toDouble(),
    timestamp: DateTime.parse(json['timestamp']),
  );
}
