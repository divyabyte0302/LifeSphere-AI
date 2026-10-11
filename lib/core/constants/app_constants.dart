class AppConstants {
  static const String appName = 'LifeSphere AI';
  static const String appTagline = 'Personal Health & Environmental Intelligence';
  static const String appVersion = '1.0.0';

  // Breakpoints for Responsive Layouts
  static const double mobileBreakpoint = 600.0;
  static const double tabletBreakpoint = 1024.0;
  static const double desktopBreakpoint = 1440.0;

  // Storage Keys
  static const String tokenKey = 'lifesphere_auth_token';
  static const String userKey = 'lifesphere_user_profile';
  static const String consentKey = 'lifesphere_user_consent';
  static const String themeModeKey = 'lifesphere_theme_mode';

  // Health Norms
  static const double normalMinHeartRate = 60.0;
  static const double normalMaxHeartRate = 100.0;
  static const double normalSpO2 = 95.0;
  static const double safeAQIMax = 50.0;
  static const double moderateAQIMax = 100.0;
}
