import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'core/constants/app_constants.dart';
import 'core/routes/app_routes.dart';
import 'core/theme/app_theme.dart';
import 'providers/health_provider.dart';
import 'screens/auth/auth_screen.dart';
import 'screens/checkup/checkup_screen.dart';
import 'screens/consent/consent_screen.dart';
import 'screens/dashboard/dashboard_screen.dart';
import 'screens/diet/diet_screen.dart';
import 'screens/emergency/emergency_screen.dart';
import 'screens/environment/environment_screen.dart';
import 'screens/health/health_screen.dart';
import 'screens/lifestyle/lifestyle_screen.dart';
import 'screens/medical/medical_screen.dart';
import 'screens/medications/medications_screen.dart';
import 'screens/notifications/notifications_screen.dart';
import 'screens/onboarding/onboarding_screen.dart';
import 'screens/profile/profile_screen.dart';
import 'screens/recommendations/recommendations_screen.dart';
import 'screens/reports/reports_screen.dart';
import 'screens/settings/settings_screen.dart';
import 'screens/trends/trends_screen.dart';
import 'screens/wearable/wearable_screen.dart';

class LifeSphereApp extends StatelessWidget {
  const LifeSphereApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => HealthProvider()),
      ],
      child: MaterialApp(
        title: AppConstants.appName,
        debugShowCheckedModeBanner: false,
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.darkTheme,
        themeMode: ThemeMode.dark, // Default high-tech dark theme
        initialRoute: AppRoutes.dashboard,
        routes: {
          AppRoutes.initial: (context) => const DashboardScreen(),
          AppRoutes.dashboard: (context) => const DashboardScreen(),
          AppRoutes.onboarding: (context) => const OnboardingScreen(),
          AppRoutes.auth: (context) => const AuthScreen(),
          AppRoutes.consent: (context) => const ConsentScreen(),
          AppRoutes.health: (context) => const HealthScreen(),
          AppRoutes.medical: (context) => const MedicalScreen(),
          AppRoutes.reports: (context) => const ReportsScreen(),
          AppRoutes.medications: (context) => const MedicationsScreen(),
          AppRoutes.lifestyle: (context) => const LifestyleScreen(),
          AppRoutes.environment: (context) => const EnvironmentScreen(),
          AppRoutes.wearable: (context) => const WearableScreen(),
          AppRoutes.trends: (context) => const TrendsScreen(),
          AppRoutes.recommendations: (context) => const RecommendationsScreen(),
          AppRoutes.checkup: (context) => const CheckupScreen(),
          AppRoutes.diet: (context) => const DietScreen(),
          AppRoutes.emergency: (context) => const EmergencyScreen(),
          AppRoutes.notifications: (context) => const NotificationsScreen(),
          AppRoutes.settings: (context) => const SettingsScreen(),
          AppRoutes.profile: (context) => const ProfileScreen(),
        },
      ),
    );
  }
}
