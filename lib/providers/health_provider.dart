import 'package:flutter/material.dart';
import '../models/environmental_model.dart';
import '../models/health_metrics_model.dart';
import '../models/medication_model.dart';
import '../models/recommendation_model.dart';
import '../models/user_model.dart';
import '../repositories/health_repository.dart';

class HealthProvider extends ChangeNotifier {
  final HealthRepository _repository;

  HealthProvider({HealthRepository? repository})
      : _repository = repository ?? HealthRepository();

  bool _isLoading = false;
  String? _errorMessage;
  HealthMetricsModel? _vitals;
  EnvironmentalModel? _environment;
  List<MedicationModel> _medications = [];
  List<RecommendationModel> _recommendations = [];
  String? _aiAnalysisResult;
  bool _isAnalyzingAi = false;

  UserModel _currentUser = const UserModel(
    id: 'usr_001',
    name: 'Dr. Jordan Vance',
    email: 'jordan.vance@lifesphere.ai',
    age: 34,
    gender: 'Male',
    heightCm: 180,
    weightKg: 74,
    bloodType: 'O+',
    chronicConditions: ['Mild Asthma', 'Pollen Allergy'],
    allergies: ['Ragweed', 'Penicillin'],
    hasGivenConsent: true,
  );

  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  HealthMetricsModel? get vitals => _vitals;
  EnvironmentalModel? get environment => _environment;
  List<MedicationModel> get medications => _medications;
  List<RecommendationModel> get recommendations => _recommendations;
  String? get aiAnalysisResult => _aiAnalysisResult;
  bool get isAnalyzingAi => _isAnalyzingAi;
  UserModel get currentUser => _currentUser;

  Future<void> initializeData() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      _vitals = await _repository.getLatestVitals();
      _environment = await _repository.getAmbientEnvironment();
      _medications = await _repository.getMedications();
      _recommendations = _repository.getActiveRecommendations();
      _isLoading = false;
      notifyListeners();
    } catch (e) {
      _errorMessage = 'Failed to load telemetry: $e';
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> triggerAiCorrelationAnalysis() async {
    if (_vitals == null || _environment == null) return;
    _isAnalyzingAi = true;
    notifyListeners();

    try {
      _aiAnalysisResult = await _repository.getAiSynergyAnalysis(
        health: _vitals!,
        env: _environment!,
        chronicConditions: _currentUser.chronicConditions,
      );
    } catch (e) {
      _aiAnalysisResult = 'Error generating AI assessment: $e';
    } finally {
      _isAnalyzingAi = false;
      notifyListeners();
    }
  }

  void toggleMedicationTaken(String id) {
    _medications = _medications.map((med) {
      if (med.id == id) {
        return MedicationModel(
          id: med.id,
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          scheduledTimes: med.scheduledTimes,
          isTakenToday: !med.isTakenToday,
          notes: med.notes,
          environmentalWarning: med.environmentalWarning,
        );
      }
      return med;
    }).toList();
    notifyListeners();
  }

  void updateConsent(bool granted) {
    _currentUser = UserModel(
      id: _currentUser.id,
      name: _currentUser.name,
      email: _currentUser.email,
      age: _currentUser.age,
      gender: _currentUser.gender,
      heightCm: _currentUser.heightCm,
      weightKg: _currentUser.weightKg,
      bloodType: _currentUser.bloodType,
      chronicConditions: _currentUser.chronicConditions,
      allergies: _currentUser.allergies,
      hasGivenConsent: granted,
      consentDate: granted ? DateTime.now() : null,
    );
    notifyListeners();
  }
}
