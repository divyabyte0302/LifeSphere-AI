import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/constants/app_constants.dart';

class LocalStorageService {
  Future<void> saveString(String key, String value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(key, value);
  }

  Future<String?> getString(String key) async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(key);
  }

  Future<void> saveConsent(bool consent) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(AppConstants.consentKey, consent);
  }

  Future<bool> getConsent() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(AppConstants.consentKey) ?? false;
  }
}
