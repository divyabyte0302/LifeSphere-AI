import '../models/environmental_model.dart';
import '../models/health_metrics_model.dart';
import '../models/medication_model.dart';
import '../models/recommendation_model.dart';
import '../services/ai/gemini_ai_service.dart';
import '../services/api/health_api_service.dart';

class HealthRepository {
  final HealthApiService _apiService;
  final GeminiAiService _aiService;

  HealthRepository({
    HealthApiService? apiService,
    GeminiAiService? aiService,
  })  : _apiService = apiService ?? HealthApiService(),
        _aiService = aiService ?? GeminiAiService();

  Future<HealthMetricsModel> getLatestVitals() async {
    return await _apiService.fetchLatestHealthMetrics();
  }

  Future<EnvironmentalModel> getAmbientEnvironment() async {
    return await _apiService.fetchEnvironmentalData();
  }

  Future<List<MedicationModel>> getMedications() async {
    return await _apiService.fetchMedications();
  }

  Future<String> getAiSynergyAnalysis({
    required HealthMetricsModel health,
    required EnvironmentalModel env,
    required List<String> chronicConditions,
  }) async {
    return await _aiService.analyzeHealthAndEnvironment(
      health: health,
      env: env,
      chronicConditions: chronicConditions,
    );
  }

  List<RecommendationModel> getActiveRecommendations() {
    return [
      RecommendationModel(
        id: 'rec_01',
        title: 'High PM2.5 Alert: Reschedule Outdoor Cardio',
        description: 'Ambient PM2.5 is 18.4 µg/m³. Given your allergic asthma profile, shift running to an indoor air-filtered track.',
        category: 'respiratory',
        priority: 'high',
        triggerSource: 'AQI & Asthma Correlation',
        createdAt: DateTime.now().subtract(const Duration(hours: 1)),
      ),
      RecommendationModel(
        id: 'rec_02',
        title: 'UV Index 4.8: Doxycycline Photosensitivity Warning',
        description: 'Current prescription medication sensitizes your skin cells. Apply broad-spectrum SPF 50+ mineral sunscreen.',
        category: 'uv_protection',
        priority: 'high',
        triggerSource: 'Medication × Ambient UV Synergy',
        createdAt: DateTime.now().subtract(const Duration(hours: 3)),
      ),
      RecommendationModel(
        id: 'rec_03',
        title: 'Optimal Sleep Preparation Window',
        description: 'Bedroom ambient temp is 23.5°C. Lowering thermostat to 19°C will optimize deep REM sleep cycle transitions.',
        category: 'lifestyle',
        priority: 'moderate',
        triggerSource: 'Ambient Temp & Sleep Score Engine',
        createdAt: DateTime.now().subtract(const Duration(hours: 5)),
      ),
    ];
  }
}
