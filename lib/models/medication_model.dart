class MedicationModel {
  final String id;
  final String name;
  final String dosage;
  final String frequency; // e.g. "Twice daily", "Every 8 hours"
  final List<String> scheduledTimes; // e.g. ["08:00 AM", "08:00 PM"]
  final bool isTakenToday;
  final String notes;
  final String? environmentalWarning; // e.g. "Increases sun sensitivity: avoid high UV index"

  const MedicationModel({
    required this.id,
    required this.name,
    required this.dosage,
    required this.frequency,
    required this.scheduledTimes,
    this.isTakenToday = false,
    this.notes = '',
    this.environmentalWarning,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'dosage': dosage,
    'frequency': frequency,
    'scheduledTimes': scheduledTimes,
    'isTakenToday': isTakenToday,
    'notes': notes,
    'environmentalWarning': environmentalWarning,
  };

  factory MedicationModel.fromJson(Map<String, dynamic> json) => MedicationModel(
    id: json['id'] as String,
    name: json['name'] as String,
    dosage: json['dosage'] as String,
    frequency: json['frequency'] as String,
    scheduledTimes: List<String>.from(json['scheduledTimes'] ?? []),
    isTakenToday: json['isTakenToday'] as bool? ?? false,
    notes: json['notes'] as String? ?? '',
    environmentalWarning: json['environmentalWarning'] as String?,
  );
}

class RecommendationModel {
  final String id;
  final String title;
  final String description;
  final String category; // 'respiratory', 'cardiovascular', 'hydration', 'uv_protection', 'fitness'
  final String priority; // 'high', 'moderate', 'low'
  final String triggerSource; // e.g., "AQI Spike (142)", "Elevated Resting HR (89 BPM)"
  final DateTime createdAt;

  const RecommendationModel({
    required this.id,
    required this.title,
    required this.description,
    required this.category,
    required this.priority,
    required this.triggerSource,
    required this.createdAt,
  });
}
