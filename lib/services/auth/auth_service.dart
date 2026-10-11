import '../../models/user_model.dart';

abstract class AuthService {
  Future<UserModel?> getCurrentUser();
  Future<UserModel> signInWithEmailPassword(String email, String password);
  Future<UserModel> registerWithEmailPassword(String name, String email, String password);
  Future<void> signOut();
  Future<void> updateConsent(bool granted);
}

class MockAuthService implements AuthService {
  UserModel? _currentUser = const UserModel(
    id: 'user_101',
    name: 'Alex Morgan',
    email: 'alex.morgan@lifesphere.ai',
    age: 32,
    gender: 'Non-binary',
    heightCm: 175,
    weightKg: 68.5,
    bloodType: 'O+',
    chronicConditions: ['Mild Allergic Asthma'],
    allergies: ['Tree Pollen', 'Penicillin', 'Dust Mites'],
    hasGivenConsent: true,
  );

  @override
  Future<UserModel?> getCurrentUser() async {
    await Future.delayed(const Duration(milliseconds: 200));
    return _currentUser;
  }

  @override
  Future<UserModel> signInWithEmailPassword(String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _currentUser = UserModel(
      id: 'user_101',
      name: email.split('@').first.capitalize(),
      email: email,
      age: 30,
      gender: 'Other',
      heightCm: 172,
      weightKg: 65,
      bloodType: 'A+',
      chronicConditions: ['Seasonal Allergies'],
      allergies: ['Grass Pollen'],
      hasGivenConsent: true,
      consentDate: DateTime.now(),
    );
    return _currentUser!;
  }

  @override
  Future<UserModel> registerWithEmailPassword(String name, String email, String password) async {
    await Future.delayed(const Duration(milliseconds: 400));
    _currentUser = UserModel(
      id: 'user_${DateTime.now().millisecondsSinceEpoch}',
      name: name,
      email: email,
      age: 28,
      gender: 'Prefer not to say',
      heightCm: 170,
      weightKg: 64,
      bloodType: 'O+',
      chronicConditions: [],
      allergies: [],
      hasGivenConsent: false,
    );
    return _currentUser!;
  }

  @override
  Future<void> signOut() async {
    await Future.delayed(const Duration(milliseconds: 200));
    _currentUser = null;
  }

  @override
  Future<void> updateConsent(bool granted) async {
    if (_currentUser != null) {
      _currentUser = UserModel(
        id: _currentUser!.id,
        name: _currentUser!.name,
        email: _currentUser!.email,
        age: _currentUser!.age,
        gender: _currentUser!.gender,
        heightCm: _currentUser!.heightCm,
        weightKg: _currentUser!.weightKg,
        bloodType: _currentUser!.bloodType,
        chronicConditions: _currentUser!.chronicConditions,
        allergies: _currentUser!.allergies,
        hasGivenConsent: granted,
        consentDate: granted ? DateTime.now() : null,
      );
    }
  }
}

extension StringExtension on String {
  String capitalize() {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1)}';
  }
}
