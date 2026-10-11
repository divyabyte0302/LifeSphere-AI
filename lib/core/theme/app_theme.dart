import 'package:flutter/material.dart';

class AppTheme {
  // Brand Color Palette - Health (Emerald) & Environmental (Cyan & Slate)
  static const Color primaryEmerald = Color(0xFF10B981);
  static const Color primaryDarkEmerald = Color(0xFF059669);
  static const Color primaryLightEmerald = Color(0xFF34D399);

  static const Color secondaryCyan = Color(0xFF06B6D4);
  static const Color accentAmber = Color(0xFFF59E0B);
  static const Color alertRose = Color(0xFFF43F5E);
  static const Color infoBlue = Color(0xFF3B82F6);

  static const Color darkBackground = Color(0xFF0B132B);
  static const Color darkSurface = Color(0xFF1C2541);
  static const Color darkSurfaceContainer = Color(0xFF243054);
  static const Color lightBackground = Color(0xFFF8FAFC);
  static const Color lightSurface = Color(0xFFFFFFFF);
  static const Color lightSurfaceContainer = Color(0xFFF1F5F9);

  static ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    colorScheme: const ColorScheme(
      brightness: Brightness.light,
      primary: primaryEmerald,
      onPrimary: Colors.white,
      primaryContainer: Color(0xFFD1FAE5),
      onPrimaryContainer: Color(0xFF065F46),
      secondary: secondaryCyan,
      onSecondary: Colors.white,
      secondaryContainer: Color(0xFFCFFAFE),
      onSecondaryContainer: Color(0xFF155E75),
      error: alertRose,
      onError: Colors.white,
      background: lightBackground,
      onBackground: Color(0xFF0F172A),
      surface: lightSurface,
      onSurface: Color(0xFF1E293B),
      surfaceVariant: lightSurfaceContainer,
      onSurfaceVariant: Color(0xFF64748B),
    ),
    scaffoldBackgroundColor: lightBackground,
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: false,
      backgroundColor: lightSurface,
      foregroundColor: Color(0xFF0F172A),
    ),
    cardTheme: CardTheme(
      elevation: 0,
      color: lightSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
    ),
  );

  static ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    colorScheme: const ColorScheme(
      brightness: Brightness.dark,
      primary: primaryEmerald,
      onPrimary: Color(0xFF064E3B),
      primaryContainer: Color(0xFF065F46),
      onPrimaryContainer: Color(0xFFA7F3D0),
      secondary: secondaryCyan,
      onSecondary: Color(0xFF164E63),
      secondaryContainer: Color(0xFF155E75),
      onSecondaryContainer: Color(0xFFA5F3FC),
      error: alertRose,
      onError: Colors.white,
      background: darkBackground,
      onBackground: Color(0xFFF8FAFC),
      surface: darkSurface,
      onSurface: Color(0xFFF1F5F9),
      surfaceVariant: darkSurfaceContainer,
      onSurfaceVariant: Color(0xFF94A3B8),
    ),
    scaffoldBackgroundColor: darkBackground,
    appBarTheme: const AppBarTheme(
      elevation: 0,
      centerTitle: false,
      backgroundColor: darkSurface,
      foregroundColor: Color(0xFFF8FAFC),
    ),
    cardTheme: CardTheme(
      elevation: 0,
      color: darkSurface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFF334155)),
      ),
    ),
  );
}
