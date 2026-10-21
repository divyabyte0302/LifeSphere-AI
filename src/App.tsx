import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AndroidFrame } from './components/AndroidFrame';
import { AuthenticatedWebLayout } from './components/web/AuthenticatedWebLayout';
import { PublicWebsite } from './components/public/PublicWebsite';
import { DashboardView } from './components/DashboardView';
import { CheckupView } from './components/CheckupView';
import { EnvironmentView } from './components/EnvironmentView';
import { HealthView } from './components/HealthView';
import { MedicationsView } from './components/MedicationsView';
import { WearablesView } from './components/WearablesView';
import { TrendsView } from './components/TrendsView';
import { DietView } from './components/DietView';
import { ConsentView } from './components/ConsentView';
import { EmergencyModal } from './components/EmergencyModal';
import { EmergencySupportView } from './components/EmergencySupportView';
import { ReportsModal } from './components/ReportsModal';
import { firebaseSyncService } from './services/firebaseSyncService';

// LifeSphere AI-X Dedicated Modules
import { DigitalTwinView } from './components/views/DigitalTwinView';
import { FusionEngineView } from './components/views/FusionEngineView';
import { MlPredictionView } from './components/views/MlPredictionView';
import { LifeRiskScoreView } from './components/views/LifeRiskScoreView';
import { SafeRoutesView } from './components/views/SafeRoutesView';
import { CommunityHazardsView } from './components/views/CommunityHazardsView';
import { CityAnalyticsView } from './components/views/CityAnalyticsView';
import { HydrationTrackerView } from './components/views/HydrationTrackerView';

// Secure Admin Web Portal Components
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsersView } from './components/admin/AdminUsersView';
import { AdminSystemMonitoringView } from './components/admin/AdminSystemMonitoringView';
import { AdminNotificationsView } from './components/admin/AdminNotificationsView';
import { AdminAuditLogsView } from './components/admin/AdminAuditLogsView';
import { AdminAiMonitoringView } from './components/admin/AdminAiMonitoringView';
import { AdminApiHealthView } from './components/admin/AdminApiHealthView';
import { AdminStorageView } from './components/admin/AdminStorageView';
import { AdminSecurityEventsView } from './components/admin/AdminSecurityEventsView';
import { AdminSupportTicketsView } from './components/admin/AdminSupportTicketsView';
import { AdminConfigView } from './components/admin/AdminConfigView';

// Doctor Portal Components
import { DoctorLayout } from './components/doctor/DoctorLayout';

// Cross-Platform Test Runner & Certification Dashboard
import { CrossPlatformTestDashboard } from './components/testing/CrossPlatformTestDashboard';

import {
  AdminRouteId,
  AdminUser,
  UserRole,
  SystemHealthMetrics,
  ApiEndpointHealth,
  AiServiceStatus,
  StorageMetrics,
  SecurityEvent,
  SupportTicket,
  SystemConfig,
  AdminNotification
} from './types/admin';

import {
  AdminAuthService,
  initialAdminUsers,
  initialSystemHealth,
  initialApiEndpoints,
  initialAiServices,
  initialStorageMetrics,
  initialSecurityEvents,
  initialSupportTickets,
  initialSystemConfig,
  initialAdminNotifications
} from './services/adminAuthService';

// Specialized screens for all 29 modules
import { AuthScreens } from './components/screens/AuthScreens';
import { OnboardingSplashScreen } from './components/screens/OnboardingSplashScreen';
import { MeasurementsScreen } from './components/screens/MeasurementsScreen';
import { MedicalRecordsScreen } from './components/screens/MedicalRecordsScreen';
import { CheckupScreens } from './components/screens/CheckupScreens';
import { PlansScreens } from './components/screens/PlansScreens';
import { SettingsAndAccountScreens } from './components/screens/SettingsAndAccountScreens';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { AiInsightsScreen } from './components/screens/AiInsightsScreen';
import { LifestyleScreen } from './components/screens/LifestyleScreen';

import {
  HealthMetrics,
  EnvironmentalData,
  Medication,
  Recommendation,
  ScreenModule,
  ViewMode,
  UserProfile,
  MeasurementRecord
} from './types';
import { CheckCircle2 } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('authenticated_web'); // Default to Desktop SaaS platform
  const [showTopHeader, setShowTopHeader] = useState(false); // Hidden from website by default per user request
  const [currentModule, setModule] = useState<ScreenModule>('dashboard');
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  // Allow developers to toggle top toolbar with Alt+D if needed, while remaining hidden from website by default
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'd' || e.key === 'D')) {
        setShowTopHeader((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setTimeout(() => {
      setSnackbarMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Secure Admin Portal State & Management
  const [adminRoute, setAdminRoute] = useState<AdminRouteId>('admin_dashboard');
  const [adminAuth, setAdminAuth] = useState(AdminAuthService.getCurrentAuth());
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdminUsers);
  const [adminSystemHealth, setAdminSystemHealth] = useState<SystemHealthMetrics>(initialSystemHealth);
  const [adminApiEndpoints, setAdminApiEndpoints] = useState<ApiEndpointHealth[]>(initialApiEndpoints);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotification[]>(initialAdminNotifications);
  const [adminStorage, setAdminStorage] = useState<StorageMetrics>(initialStorageMetrics);
  const [adminAiServices, setAdminAiServices] = useState<AiServiceStatus[]>(initialAiServices);
  const [adminSecurityEvents, setAdminSecurityEvents] = useState<SecurityEvent[]>(initialSecurityEvents);
  const [adminSupportTickets, setAdminSupportTickets] = useState<SupportTicket[]>(initialSupportTickets);
  const [adminConfig, setAdminConfig] = useState<SystemConfig>(initialSystemConfig);

  const handleAdminRoleSwitch = (role: UserRole) => {
    const updated = AdminAuthService.switchRole(role);
    setAdminAuth(updated);
    showSnackbar(`Role claim switched to ${role}. ${role === 'ADMIN' ? 'Admin Access Granted.' : 'Admin Access Denied (HTTP 403).'}`);
  };

  const handleUpdateUserRole = (userId: string, newRole: UserRole) => {
    setAdminUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    showSnackbar(`User role updated to ${newRole}.`);
  };

  const handleToggleUserStatus = (userId: string) => {
    setAdminUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const newStatus = u.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
          showSnackbar(`Account status changed to ${newStatus}.`);
          return { ...u, status: newStatus };
        }
        return u;
      })
    );
  };

  const handleDispatchAdminNotification = (notif: AdminNotification) => {
    setAdminNotifications((prev) => [notif, ...prev]);
    showSnackbar(`Broadcast "${notif.title}" dispatched via FCM.`);
  };

  const handleUpdateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setAdminSupportTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status } : t))
    );
    showSnackbar(`Ticket status updated to ${status}.`);
  };

  const handleSaveAdminConfig = (newConfig: SystemConfig) => {
    setAdminConfig(newConfig);
    showSnackbar('System configuration updated across cluster nodes.');
  };

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    id: 'LS-8842',
    name: 'Dr. Jordan Vance',
    email: 'jordan.vance@lifesphere.ai',
    age: 34,
    gender: 'Male',
    heightCm: 180,
    weightKg: 74,
    bloodType: 'O+ Positive',
    chronicConditions: ['Mild Allergic Asthma'],
    allergies: ['Tree Pollen', 'Penicillin', 'Dust Mites'],
    hasGivenConsent: true,
    emergencyContact: {
      name: 'Sarah Vance',
      relationship: 'Spouse',
      phone: '+1 (555) 019-2834',
    },
  });

  // Simulated Telemetry State
  const [vitals, setVitals] = useState<HealthMetrics>({
    heartRate: 72,
    restingHeartRate: 64,
    hrv: 58,
    spO2: 98.4,
    bloodPressure: '118/76',
    systolic: 118,
    diastolic: 76,
    bodyTemperature: 36.6,
    respiratoryRate: 14.5,
    glucose: 94,
    stressLevel: 32,
    sleepScore: 86,
    totalSleepHours: 7.8,
    deepSleepHours: 2.1,
    remSleepHours: 1.9,
    stepCount: 8420,
    activeCalories: 485,
  });

  const [environment, setEnvironment] = useState<EnvironmentalData>({
    locationName: 'Metropolitan Biosphere Hub',
    airQualityIndex: 68,
    airQualityCategory: 'Moderate',
    pm25: 18.4,
    pm10: 34.2,
    ozone: 42.0,
    uvIndex: 4.8,
    uvCategory: 'Moderate',
    pollenCount: 142,
    pollenCategory: 'Medium',
    temperature: 23.5,
    humidity: 52,
    noiseDecibels: 48,
    atmosphericPressure: 1013.25,
  });

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'med_01',
      name: 'Montelukast Sodium',
      dosage: '10mg',
      frequency: 'Once daily at bedtime',
      scheduledTimes: ['09:00 PM'],
      isTakenToday: true,
      notes: 'Leukotriene receptor antagonist for asthma & seasonal allergic rhinitis.',
    },
    {
      id: 'med_02',
      name: 'Omega-3 EPA/DHA',
      dosage: '1000mg',
      frequency: 'Twice daily with meals',
      scheduledTimes: ['08:00 AM', '07:00 PM'],
      isTakenToday: false,
      notes: 'Cardiovascular cellular membrane support & anti-inflammatory.',
    },
    {
      id: 'med_03',
      name: 'Doxycycline Hyclate',
      dosage: '100mg',
      frequency: 'Once daily with full glass of water',
      scheduledTimes: ['10:00 AM'],
      isTakenToday: true,
      notes: 'Short course antibiotic.',
      environmentalWarning: 'Photosensitivity: Avoid prolonged sun exposure while UV index exceeds 4.0.',
    },
  ]);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([
    {
      id: 'rec_01',
      title: 'Ambient PM2.5 Elevated: Indoor Workout Advised',
      description: 'Air Quality Index is 68 with particulate dust at 18.4 µg/m³. For individuals with allergic asthma, shift high-intensity cardio indoors.',
      category: 'respiratory',
      priority: 'high',
      triggerSource: 'AQI & Mild Asthma Synergy',
      timestamp: '15m ago',
    },
    {
      id: 'rec_02',
      title: 'UV Index 4.8: Photo-Protection Protocol',
      description: 'Your active prescription Doxycycline sensitizes skin cells to solar radiation. Apply mineral SPF 50+ if outdoors over 20 minutes.',
      category: 'uv_protection',
      priority: 'high',
      triggerSource: 'Medication × Ambient UV Correlation',
      timestamp: '1h ago',
    },
    {
      id: 'rec_03',
      title: 'Hydration Target Raised (+500mL)',
      description: 'Ambient temperature 23.5°C and low relative humidity elevate respiratory vapor loss. Target 3,000 mL water today.',
      category: 'hydration',
      priority: 'moderate',
      triggerSource: 'Ambient Heat & Fluid Index',
      timestamp: '2h ago',
    },
  ]);

  // Pull-to-refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setVitals((prev) => ({
      ...prev,
      heartRate: 70 + Math.floor(Math.random() * 6),
      spO2: 98.2 + parseFloat((Math.random() * 0.6).toFixed(1)),
    }));
    setIsRefreshing(false);
    showSnackbar('Biometric and atmospheric telemetry refreshed.');
  };

  const handleSetAqi = (newAqi: number) => {
    let cat: EnvironmentalData['airQualityCategory'] = 'Good';
    if (newAqi > 150) cat = 'Unhealthy';
    else if (newAqi > 100) cat = 'Unhealthy for Sensitive Groups';
    else if (newAqi > 50) cat = 'Moderate';

    setEnvironment((prev) => ({
      ...prev,
      airQualityIndex: newAqi,
      pm25: parseFloat((newAqi * 0.28).toFixed(1)),
      airQualityCategory: cat,
    }));
  };

  const handleSetHeartRate = (newHr: number) => {
    setVitals((prev) => ({
      ...prev,
      heartRate: newHr,
      hrv: Math.max(30, Math.round(75 - (newHr - 60) * 0.4)),
    }));
  };

  const handleResetSimulation = () => {
    setEnvironment((prev) => ({
      ...prev,
      airQualityIndex: 68,
      pm25: 18.4,
      airQualityCategory: 'Moderate',
    }));
    setVitals((prev) => ({
      ...prev,
      heartRate: 72,
      hrv: 58,
    }));
    showSnackbar('Sensor feeds restored to normal baseline.');
  };

  // Synchronized Medications Listener across Android & Web
  useEffect(() => {
    const unsub = firebaseSyncService.subscribeToMedications((liveMeds) => {
      setMedications(liveMeds);
    });
    return () => unsub();
  }, []);

  const handleToggleMedication = async (id: string) => {
    const origin = viewMode === 'android' ? 'android' : 'web';
    const res = await firebaseSyncService.updateMedication({
      origin,
      medicationId: id,
    });
    showSnackbar(res.message);
  };

  const handleLogMeasurement = (record: MeasurementRecord) => {
    if (record.type === 'Heart Rate') {
      setVitals((v) => ({ ...v, heartRate: parseInt(record.value) || v.heartRate }));
    } else if (record.type === 'Blood Pressure') {
      setVitals((v) => ({ ...v, bloodPressure: record.value }));
    } else if (record.type === 'SpO2') {
      setVitals((v) => ({ ...v, spO2: parseFloat(record.value) || v.spO2 }));
    } else if (record.type === 'Blood Glucose') {
      setVitals((v) => ({ ...v, glucose: parseInt(record.value) || v.glucose }));
    } else if (record.type === 'Body Temperature') {
      setVitals((v) => ({ ...v, bodyTemperature: parseFloat(record.value) || v.bodyTemperature }));
    }
  };

  // Central Router for all 29 modules
  const renderModuleScreen = (isMobileLayout = false) => {
    switch (currentModule) {
      case 'splash':
        return <OnboardingSplashScreen type="splash" setScreen={setModule} showSnackbar={showSnackbar} />;

      case 'onboarding':
        return <OnboardingSplashScreen type="onboarding" setScreen={setModule} showSnackbar={showSnackbar} />;

      case 'login':
        return <AuthScreens type="login" setScreen={setModule} showSnackbar={showSnackbar} />;

      case 'registration':
        return <AuthScreens type="registration" setScreen={setModule} showSnackbar={showSnackbar} />;

      case 'forgot_password':
        return <AuthScreens type="forgot_password" setScreen={setModule} showSnackbar={showSnackbar} />;

      case 'profile':
        return <SettingsAndAccountScreens type="profile" user={user} setScreen={setModule} showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'consent':
        return <ConsentView isMobile={isMobileLayout} />;

      case 'dashboard':
        return (
          <DashboardView
            vitals={vitals}
            environment={environment}
            medications={medications}
            recommendations={recommendations}
            setScreen={setModule}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            isMobile={isMobileLayout}
            user={user}
          />
        );

      case 'digital_twin':
        return <DigitalTwinView vitals={vitals} environment={environment} isMobile={isMobileLayout} />;

      case 'fusion_engine':
        return <FusionEngineView vitals={vitals} environment={environment} isMobile={isMobileLayout} />;

      case 'ml_prediction':
        return <MlPredictionView vitals={vitals} environment={environment} isMobile={isMobileLayout} />;

      case 'life_risk_score':
        return <LifeRiskScoreView vitals={vitals} environment={environment} isMobile={isMobileLayout} />;

      case 'safe_routes':
        return <SafeRoutesView isMobile={isMobileLayout} />;

      case 'community_hazards':
        return <CommunityHazardsView isMobile={isMobileLayout} />;

      case 'city_analytics':
        return <CityAnalyticsView isMobile={isMobileLayout} />;

      case 'hydration':
        return (
          <HydrationTrackerView
            user={user}
            vitals={vitals}
            environment={environment}
            onNavigate={setModule}
            showSnackbar={showSnackbar}
          />
        );

      case 'measurements':
        return (
          <MeasurementsScreen
            vitals={vitals}
            onLogMeasurement={handleLogMeasurement}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
            onNavigateToHydration={() => setModule('hydration')}
          />
        );

      case 'wearable':
        return (
          <WearablesView
            isMobile={isMobileLayout}
            onUpdateHeartRate={handleSetHeartRate}
            showSnackbar={showSnackbar}
          />
        );

      case 'medical_records':
        return <MedicalRecordsScreen showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'reports':
        return (
          <div className="p-6 text-center space-y-4">
            <h3 className="text-base font-bold text-white">Clinical Health Reports & Analytics</h3>
            <p className="text-xs text-slate-400">View and download your monthly clinical summaries and FHIR HL7 JSON packages.</p>
            <button
              onClick={() => setReportsOpen(true)}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-purple-600/30"
            >
              Open Full Report & FHIR Exporter
            </button>
          </div>
        );

      case 'medications':
        return (
          <MedicationsView
            medications={medications}
            onToggleTaken={handleToggleMedication}
            isMobile={isMobileLayout}
          />
        );

      case 'lifestyle':
        return <LifestyleScreen vitals={vitals} setScreen={setModule} isMobile={isMobileLayout} />;

      case 'environment':
        return <EnvironmentView environment={environment} isMobile={isMobileLayout} />;

      case 'trends':
        return <TrendsView isMobile={isMobileLayout} />;

      case 'ai_insights':
        return (
          <AiInsightsScreen
            type="ai_insights"
            vitals={vitals}
            environment={environment}
            recommendations={recommendations}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'recommendations':
        return (
          <AiInsightsScreen
            type="recommendations"
            vitals={vitals}
            environment={environment}
            recommendations={recommendations}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'checkup':
        return (
          <CheckupScreens
            type="checkup"
            vitals={vitals}
            environment={environment}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'post_checkup':
        return (
          <CheckupScreens
            type="post_checkup"
            vitals={vitals}
            environment={environment}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'checkup_comparison':
        return (
          <CheckupScreens
            type="checkup_comparison"
            vitals={vitals}
            environment={environment}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'health_plan':
        return (
          <PlansScreens
            type="health_plan"
            vitals={vitals}
            environment={environment}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'diet_plan':
        return (
          <PlansScreens
            type="diet_plan"
            vitals={vitals}
            environment={environment}
            setScreen={setModule}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'notifications':
        return <NotificationsScreen setScreen={setModule} showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'emergency':
        return (
          <EmergencySupportView
            vitals={vitals}
            environment={environment}
            userId={user.id}
            showSnackbar={showSnackbar}
            isMobile={isMobileLayout}
          />
        );

      case 'privacy':
      case 'settings':
        return <SettingsAndAccountScreens type="privacy" user={user} setScreen={setModule} showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'data_export':
        return <SettingsAndAccountScreens type="data_export" user={user} setScreen={setModule} showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'account_deletion':
        return <SettingsAndAccountScreens type="account_deletion" user={user} setScreen={setModule} showSnackbar={showSnackbar} isMobile={isMobileLayout} />;

      case 'logout':
        return <AuthScreens type="logout" setScreen={setModule} showSnackbar={showSnackbar} />;

      default:
        return (
          <DashboardView
            vitals={vitals}
            environment={environment}
            medications={medications}
            recommendations={recommendations}
            setScreen={setModule}
            onRefresh={handleRefresh}
            isRefreshing={isRefreshing}
            isMobile={isMobileLayout}
          />
        );
    }
  };

  const renderAdminScreen = () => {
    switch (adminRoute) {
      case 'admin_dashboard':
        return (
          <AdminDashboard
            users={adminUsers}
            systemHealth={adminSystemHealth}
            apiEndpoints={adminApiEndpoints}
            notifications={adminNotifications}
            storage={adminStorage}
            aiServices={adminAiServices}
            securityEvents={adminSecurityEvents}
            onNavigate={setAdminRoute}
          />
        );

      case 'admin_users':
        return (
          <AdminUsersView
            users={adminUsers}
            onUpdateUserRole={handleUpdateUserRole}
            onToggleUserStatus={handleToggleUserStatus}
          />
        );

      case 'admin_system_monitoring':
        return <AdminSystemMonitoringView metrics={adminSystemHealth} />;

      case 'admin_notifications':
        return (
          <AdminNotificationsView
            notifications={adminNotifications}
            onDispatchNotification={handleDispatchAdminNotification}
          />
        );

      case 'admin_audit_logs':
        return <AdminAuditLogsView />;

      case 'admin_ai_services':
        return <AdminAiMonitoringView aiServices={adminAiServices} />;

      case 'admin_api_health':
        return <AdminApiHealthView apiEndpoints={adminApiEndpoints} />;

      case 'admin_storage':
        return <AdminStorageView storage={adminStorage} />;

      case 'admin_security_events':
        return <AdminSecurityEventsView securityEvents={adminSecurityEvents} />;

      case 'admin_support_tickets':
        return (
          <AdminSupportTicketsView
            tickets={adminSupportTickets}
            onUpdateTicketStatus={handleUpdateTicketStatus}
          />
        );

      case 'admin_configuration':
        return (
          <AdminConfigView
            config={adminConfig}
            onSaveConfig={handleSaveAdminConfig}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      {/* Universal Top Header with View Switcher (Hidden from website by default per user request) */}
      {showTopHeader && (
        <Header
          viewMode={viewMode}
          setViewMode={setViewMode}
          onTriggerSos={() => setEmergencyOpen(true)}
          aqi={environment.airQualityIndex}
          setAqi={handleSetAqi}
          heartRate={vitals.heartRate}
          setHeartRate={handleSetHeartRate}
          onResetSimulation={handleResetSimulation}
          onClose={() => setShowTopHeader(false)}
        />
      )}

      {/* Main Viewport matching selected viewMode */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {viewMode === 'public_web' ? (
          // 1. Public Marketing SaaS Website (18 Comprehensive Sections)
          <div className="flex-1 overflow-y-auto">
            <PublicWebsite
              onEnterApp={() => setViewMode('authenticated_web')}
              onOpenLogin={() => {
                setViewMode('authenticated_web');
                setModule('login');
              }}
              onOpenRegister={() => {
                setViewMode('authenticated_web');
                setModule('registration');
              }}
              onOpenDoctorPortal={() => setViewMode('doctor_portal')}
              onOpenAdminPortal={() => setViewMode('admin_portal')}
            />
          </div>
        ) : viewMode === 'android' ? (
          // 2. Android Google Pixel Frame Simulator
          <div className="flex-1 overflow-y-auto bg-slate-950/95 flex flex-col items-center py-4">
            <button
              onClick={() => setViewMode('authenticated_web')}
              className="mb-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium transition-colors"
            >
              ← Return to Desktop Web
            </button>
            <AndroidFrame currentTab={currentModule} setTab={setModule}>
              {renderModuleScreen(true)}
            </AndroidFrame>
          </div>
        ) : viewMode === 'tablet_web' ? (
          // 3. Tablet Web Layout
          <AuthenticatedWebLayout
            currentRoute={currentModule}
            onNavigate={setModule}
            onTriggerSos={() => setEmergencyOpen(true)}
            deviceTier="tablet"
            user={user}
            onOpenAdmin={() => setViewMode('admin_portal')}
            onOpenDoctor={() => setViewMode('doctor_portal')}
            onNavigateToPublic={() => setViewMode('public_web')}
          >
            {renderModuleScreen(false)}
          </AuthenticatedWebLayout>
        ) : viewMode === 'mobile_web' ? (
          // 4. Mobile Web Browser Layout
          <AuthenticatedWebLayout
            currentRoute={currentModule}
            onNavigate={setModule}
            onTriggerSos={() => setEmergencyOpen(true)}
            deviceTier="mobile"
            user={user}
            onOpenAdmin={() => setViewMode('admin_portal')}
            onOpenDoctor={() => setViewMode('doctor_portal')}
            onNavigateToPublic={() => setViewMode('public_web')}
          >
            {renderModuleScreen(true)}
          </AuthenticatedWebLayout>
        ) : viewMode === 'admin_portal' ? (
          // 5. Secure Admin Web Portal (RBAC, Role Claims Protected, Least Privilege)
          <AdminLayout
            currentRoute={adminRoute}
            onNavigate={setAdminRoute}
            currentAuth={adminAuth}
            onRoleSwitch={handleAdminRoleSwitch}
            onExitAdminPortal={() => setViewMode('authenticated_web')}
          >
            {renderAdminScreen()}
          </AdminLayout>
        ) : viewMode === 'doctor_portal' ? (
          // 6. Optional Doctor Portal (Authorized Patients Only, Timeline, Trends, Care Plans, Visual Distinction, Immutable Directives)
          <DoctorLayout
            onExitDoctorPortal={() => setViewMode('authenticated_web')}
            showSnackbar={showSnackbar}
          />
        ) : viewMode === 'cross_platform_test' ? (
          // 7. Cross-Platform Automated Test Runner & Certification Hub
          <div className="flex-1 overflow-y-auto">
            <CrossPlatformTestDashboard
              onBackToApp={() => setViewMode('authenticated_web')}
            />
          </div>
        ) : (
          // 8. Desktop / Laptop Web Layout (Default SaaS)
          <AuthenticatedWebLayout
            currentRoute={currentModule}
            onNavigate={setModule}
            onTriggerSos={() => setEmergencyOpen(true)}
            deviceTier="desktop"
            user={user}
            onOpenAdmin={() => setViewMode('admin_portal')}
            onOpenDoctor={() => setViewMode('doctor_portal')}
            onNavigateToPublic={() => setViewMode('public_web')}
          >
            {renderModuleScreen(false)}
          </AuthenticatedWebLayout>
        )}
      </main>

      {/* Floating Material 3 Snackbar */}
      {snackbarMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 border border-emerald-500/40 text-slate-100 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-medium animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{snackbarMessage}</span>
        </div>
      )}

      {/* Emergency SOS Modal */}
      <EmergencyModal
        isOpen={emergencyOpen}
        onClose={() => setEmergencyOpen(false)}
        vitals={vitals}
        environment={environment}
      />

      {/* Clinical Reports Modal */}
      <ReportsModal
        isOpen={reportsOpen}
        onClose={() => setReportsOpen(false)}
        vitals={vitals}
        environment={environment}
      />
    </div>
  );
}
