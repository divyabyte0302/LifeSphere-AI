class UserModel {
  final String id;
  final String name;
  final String email;
  final int age;
  final String gender;
  final double heightCm;
  final double weightKg;
  final String bloodType;
  final List<String> chronicConditions; // e.g. Asthma, Hypertension
  final List<String> allergies; // Pollen, Penicillin, Dust
  final bool hasGivenConsent;
  final DateTime? consentDate;

  const UserModel({
    required this.id,
    required this.name,
    required this.email,
    required this.age,
    required this.gender,
    required this.heightCm,
    required this.weightKg,
    required this.bloodType,
    required this.chronicConditions,
    required this.allergies,
    required this.hasGivenConsent,
    this.consentDate,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'email': email,
    'age': age,
    'gender': gender,
    'heightCm': heightCm,
    'weightKg': weightKg,
    'bloodType': bloodType,
    'chronicConditions': chronicConditions,
    'allergies': allergies,
    'hasGivenConsent': hasGivenConsent,
    'consentDate': consentDate?.toIso8601String(),
  };

  factory UserModel.fromJson(Map<String, dynamic> json) => UserModel(
    id: json['id'] as String,
    name: json['name'] as String,
    email: json['email'] as String,
    age: (json['age'] as num).toInt(),
    gender: json['gender'] as String,
    heightCm: (json['heightCm'] as num).toDouble(),
    weightKg: (json['weightKg'] as num).toDouble(),
    bloodType: json['bloodType'] as String,
    chronicConditions: List<String>.from(json['chronicConditions'] ?? []),
    allergies: List<String>.from(json['allergies'] ?? []),
    hasGivenConsent: json['hasGivenConsent'] as bool? ?? false,
    consentDate: json['consentDate'] != null ? DateTime.parse(json['consentDate']) : null,
  );
}
