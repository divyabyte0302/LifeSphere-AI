class MeasurementInvolved {
  final String name;
  final String value;
  final String unit;
  final String threshold;
  final String status;

  MeasurementInvolved({
    required this.name,
    required this.value,
    required this.unit,
    required this.threshold,
    required this.status,
  });

  Map<String, dynamic> toJson() => {
    'name': name,
    'value': value,
    'unit': unit,
    'threshold': threshold,
    'status': status,
  };

  factory MeasurementInvolved.fromJson(Map<String, dynamic> json) => MeasurementInvolved(
    name: json['name'] ?? '',
    value: json['value']?.toString() ?? '',
    unit: json['unit'] ?? '',
    threshold: json['threshold'] ?? '',
    status: json['status'] ?? 'critical',
  );
}

class EmergencyEvidence {
  final String whyAlertAppeared;
  final List<MeasurementInvolved> measurementsInvolved;
  final String timeOfMeasurements;
  final String possibleSignificance;
  final String uncertaintyExplanation;

  EmergencyEvidence({
    required this.whyAlertAppeared,
    required this.measurementsInvolved,
    required this.timeOfMeasurements,
    required this.possibleSignificance,
    required this.uncertaintyExplanation,
  });

  Map<String, dynamic> toJson() => {
    'whyAlertAppeared': whyAlertAppeared,
    'measurementsInvolved': measurementsInvolved.map((m) => m.toJson()).toList(),
    'timeOfMeasurements': timeOfMeasurements,
    'possibleSignificance': possibleSignificance,
    'uncertaintyExplanation': uncertaintyExplanation,
  };

  factory EmergencyEvidence.fromJson(Map<String, dynamic> json) => EmergencyEvidence(
    whyAlertAppeared: json['whyAlertAppeared'] ?? '',
    measurementsInvolved: (json['measurementsInvolved'] as List? ?? [])
        .map((item) => MeasurementInvolved.fromJson(item))
        .toList(),
    timeOfMeasurements: json['timeOfMeasurements'] ?? '',
    possibleSignificance: json['possibleSignificance'] ?? '',
    uncertaintyExplanation: json['uncertaintyExplanation'] ?? '',
  );
}

class EmergencyAlertModel {
  final String alertId;
  final String userId;
  final String trigger;
  final EmergencyEvidence evidence;
  final DateTime createdAt;
  final DateTime shownAt;
  final DateTime? confirmedAt;
  final DateTime? cancelledAt;
  final String actionResult;

  EmergencyAlertModel({
    required this.alertId,
    required this.userId,
    required this.trigger,
    required this.evidence,
    required this.createdAt,
    required this.shownAt,
    this.confirmedAt,
    this.cancelledAt,
    required this.actionResult,
  });

  EmergencyAlertModel copyWith({
    DateTime? confirmedAt,
    DateTime? cancelledAt,
    String? actionResult,
  }) {
    return EmergencyAlertModel(
      alertId: alertId,
      userId: userId,
      trigger: trigger,
      evidence: evidence,
      createdAt: createdAt,
      shownAt: shownAt,
      confirmedAt: confirmedAt ?? this.confirmedAt,
      cancelledAt: cancelledAt ?? this.cancelledAt,
      actionResult: actionResult ?? this.actionResult,
    );
  }

  Map<String, dynamic> toJson() => {
    'alertId': alertId,
    'userId': userId,
    'trigger': trigger,
    'evidence': evidence.toJson(),
    'createdAt': createdAt.toIso8601String(),
    'shownAt': shownAt.toIso8601String(),
    'confirmedAt': confirmedAt?.toIso8601String(),
    'cancelledAt': cancelledAt?.toIso8601String(),
    'actionResult': actionResult,
  };

  factory EmergencyAlertModel.fromJson(Map<String, dynamic> json) => EmergencyAlertModel(
    alertId: json['alertId'] ?? '',
    userId: json['userId'] ?? '',
    trigger: json['trigger'] ?? '',
    evidence: EmergencyEvidence.fromJson(json['evidence'] ?? {}),
    createdAt: DateTime.tryParse(json['createdAt'] ?? '') ?? DateTime.now(),
    shownAt: DateTime.tryParse(json['shownAt'] ?? '') ?? DateTime.now(),
    confirmedAt: json['confirmedAt'] != null ? DateTime.tryParse(json['confirmedAt']) : null,
    cancelledAt: json['cancelledAt'] != null ? DateTime.tryParse(json['cancelledAt']) : null,
    actionResult: json['actionResult'] ?? 'PENDING_USER_CONFIRMATION',
  );
}

class EmergencyAuditLogModel {
  final String id;
  final String alertId;
  final String userId;
  final String action;
  final DateTime timestamp;
  final String details;
  final String clientPlatform;

  EmergencyAuditLogModel({
    required this.id,
    required this.alertId,
    required this.userId,
    required this.action,
    required this.timestamp,
    required this.details,
    required this.clientPlatform,
  });

  Map<String, dynamic> toJson() => {
    'id': id,
    'alertId': alertId,
    'userId': userId,
    'action': action,
    'timestamp': timestamp.toIso8601String(),
    'details': details,
    'clientPlatform': clientPlatform,
  };
}
