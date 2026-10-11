abstract class Failure {
  final String message;
  const Failure(this.message);

  @override
  String toString() => message;
}

class ServerFailure extends Failure {
  const ServerFailure([String message = 'A server error occurred. Please try again.'])
      : super(message);
}

class NetworkFailure extends Failure {
  const NetworkFailure([String message = 'Please check your internet connection.'])
      : super(message);
}

class AuthFailure extends Failure {
  const AuthFailure([String message = 'Authentication failed. Please verify credentials.'])
      : super(message);
}

class SensorFailure extends Failure {
  const SensorFailure([String message = 'Unable to read wearable or environmental sensor data.'])
      : super(message);
}
