export type TestPlatform = 'android' | 'flutter_web' | 'desktop_browser' | 'mobile_browser' | 'cross_platform';

export type TestCategory =
  | 'authentication'
  | 'core_modules'
  | 'cross_platform_sync'
  | 'security_rbac'
  | 'resilience_network'
  | 'edge_cases'
  | 'accessibility_responsive';

export type TestStatus = 'PASS' | 'FAIL' | 'RUNNING' | 'PENDING' | 'SKIPPED';

export interface TestAssertion {
  description: string;
  expected: string;
  actual: string;
  passed: boolean;
}

export interface TestCaseResult {
  id: string;
  name: string;
  category: TestCategory;
  platform: TestPlatform;
  status: TestStatus;
  durationMs: number;
  timestamp: string;
  description: string;
  assertions: TestAssertion[];
  logs: string[];
  error?: string;
}

export interface TestSummaryReport {
  generatedAt: string;
  testSuiteVersion: string;
  environment: {
    firebaseProjectId: string;
    database: string;
    activeUser: string;
    targetUser: string;
  };
  totalTests: number;
  passed: number;
  failed: number;
  passRatePercentage: number;
  avgLatencyMs: number;
  totalDurationMs: number;
  platformsTested: {
    android: { total: number; passed: number; failed: number };
    flutter_web: { total: number; passed: number; failed: number };
    desktop_browser: { total: number; passed: number; failed: number };
    mobile_browser: { total: number; passed: number; failed: number };
    cross_platform: { total: number; passed: number; failed: number };
  };
  categoriesTested: Record<TestCategory, { total: number; passed: number; failed: number }>;
  results: TestCaseResult[];
}
