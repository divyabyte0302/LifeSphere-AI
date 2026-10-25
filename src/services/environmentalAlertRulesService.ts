/**
 * LifeSphere AI-X — Configurable Environmental Alert Rules Service
 * 
 * Allows users to set opt-in environmental alert threshold rules:
 * - AQI Thresholds (e.g. notify if AQI > 100)
 * - PM2.5 Exposure Alerts (e.g. notify if PM2.5 > 35 µg/m³)
 * - Extreme UV Index Warnings (e.g. notify if UV > 8)
 * - Pollen Spike Alerts
 * - Rule creation, modification, pause, revocation, and deduplication
 */

export interface EnvironmentalAlertRule {
  id: string;
  userId: string;
  ruleName: string;
  metric: 'aqi' | 'pm25' | 'uv_index' | 'pollen';
  thresholdValue: number;
  condition: 'GREATER_THAN' | 'LESS_THAN';
  enabled: boolean;
  notificationType: 'in_app' | 'push' | 'email';
  createdAt: string;
}

class EnvironmentalAlertRulesService {
  private storageKey = 'lifesphere_env_alert_rules';

  /**
   * Get all active rules for user.
   */
  getRules(userId: string): EnvironmentalAlertRule[] {
    try {
      const saved = localStorage.getItem(`${this.storageKey}_${userId}`);
      if (saved) return JSON.parse(saved);
    } catch {}

    // Default baseline rules
    return [
      {
        id: `rule-1-${userId}`,
        userId,
        ruleName: 'Air Quality Safety Threshold',
        metric: 'aqi',
        thresholdValue: 100,
        condition: 'GREATER_THAN',
        enabled: true,
        notificationType: 'push',
        createdAt: new Date().toISOString(),
      },
      {
        id: `rule-2-${userId}`,
        userId,
        ruleName: 'High UV Radiation Protection',
        metric: 'uv_index',
        thresholdValue: 8,
        condition: 'GREATER_THAN',
        enabled: true,
        notificationType: 'in_app',
        createdAt: new Date().toISOString(),
      },
    ];
  }

  /**
   * Save or update an environmental alert rule.
   */
  saveRule(userId: string, rule: EnvironmentalAlertRule): EnvironmentalAlertRule[] {
    const rules = this.getRules(userId);
    const existingIdx = rules.findIndex((r) => r.id === rule.id);

    if (existingIdx >= 0) {
      rules[existingIdx] = rule;
    } else {
      rules.push(rule);
    }

    localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(rules));
    return rules;
  }

  /**
   * Toggle or delete rule.
   */
  deleteRule(userId: string, ruleId: string): EnvironmentalAlertRule[] {
    const rules = this.getRules(userId).filter((r) => r.id !== ruleId);
    localStorage.setItem(`${this.storageKey}_${userId}`, JSON.stringify(rules));
    return rules;
  }
}

export const environmentalAlertRulesService = new EnvironmentalAlertRulesService();
