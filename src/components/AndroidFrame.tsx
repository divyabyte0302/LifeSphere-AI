import React, { useState } from 'react';
import {
  Wifi,
  BatteryCharging,
  Signal,
  LayoutDashboard,
  HeartPulse,
  CloudSun,
  Stethoscope,
  Menu,
  ChevronLeft,
  X,
  AlertTriangle,
  Bell,
  Grid
} from 'lucide-react';
import { ScreenModule } from '../types';

interface AndroidFrameProps {
  currentTab: ScreenModule;
  setTab: (tab: ScreenModule) => void;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  currentTab,
  setTab,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Friendly title mapping for Android Top AppBar
  const screenTitles: Record<ScreenModule, string> = {
    splash: 'Splash Screen',
    onboarding: 'Onboarding',
    login: 'Account Sign In',
    registration: 'Registration',
    forgot_password: 'Reset Password',
    profile: 'User Profile',
    consent: 'Consent Management',
    dashboard: 'Health Dashboard',
    measurements: 'Health Measurements',
    wearable: 'Wearable Data',
    medical_records: 'Medical Records',
    reports: 'Health Reports',
    medications: 'Medication Management',
    lifestyle: 'Lifestyle Data',
    environment: 'Environmental Exposure',
    trends: 'Health Trends',
    ai_insights: 'AI Insights',
    recommendations: 'Preventive Recommendations',
    checkup: 'Monthly Check-up',
    post_checkup: 'Post Check-up Update',
    checkup_comparison: 'Check-up Comparison',
    health_plan: 'Personalized Health Plan',
    diet_plan: 'Personalized Diet Plan',
    notifications: 'Notifications',
    emergency: 'Emergency Support',
    privacy: 'Privacy Settings',
    data_export: 'Data Export',
    account_deletion: 'Account Deletion',
    logout: 'Logout',
    settings: 'Settings',
    digital_twin: 'AI Digital Twin',
    fusion_engine: 'Fusion Engine',
    ml_prediction: 'ML Risk Prediction',
    life_risk_score: 'Life Risk Score',
    safe_routes: 'Safe Routes',
    community_hazards: 'Community Hazards',
    city_analytics: 'City Analytics',
    audit_logs: 'Audit Logs',
    hydration: 'Hydration Tracker',
    checkup_calendar: 'Monthly Checkup Calendar',
    health_analytics: 'Health Analytics & Charts',
  };

  const allModulesList: { id: ScreenModule; label: string; group: string }[] = [
    { id: 'splash', label: '1. Splash Screen', group: 'Auth & Entry' },
    { id: 'onboarding', label: '2. Onboarding', group: 'Auth & Entry' },
    { id: 'login', label: '3. Login', group: 'Auth & Entry' },
    { id: 'registration', label: '4. Registration', group: 'Auth & Entry' },
    { id: 'forgot_password', label: '5. Forgot Password', group: 'Auth & Entry' },
    { id: 'profile', label: '6. User Profile', group: 'Clinical & Bio' },
    { id: 'consent', label: '7. Consent Management', group: 'Privacy & Security' },
    { id: 'dashboard', label: '8. Health Dashboard', group: 'Core' },
    { id: 'hydration', label: 'Hydration Tracker', group: 'Clinical & Bio' },
    { id: 'measurements', label: '9. Health Measurements', group: 'Clinical & Bio' },
    { id: 'wearable', label: '10. Wearable Data', group: 'Clinical & Bio' },
    { id: 'medical_records', label: '11. Medical Records', group: 'Clinical & Bio' },
    { id: 'reports', label: '12. Health Reports', group: 'Clinical & Bio' },
    { id: 'medications', label: '13. Medication Management', group: 'Clinical & Bio' },
    { id: 'lifestyle', label: '14. Lifestyle Data', group: 'Clinical & Bio' },
    { id: 'environment', label: '15. Environmental Exposure', group: 'Environmental' },
    { id: 'trends', label: '16. Health Trends', group: 'Clinical & Bio' },
    { id: 'ai_insights', label: '17. AI Insights', group: 'AI & Triage' },
    { id: 'recommendations', label: '18. Preventive Recommendations', group: 'AI & Triage' },
    { id: 'checkup', label: '19. Monthly Check-up', group: 'AI & Triage' },
    { id: 'post_checkup', label: '20. Post Check-up Update', group: 'AI & Triage' },
    { id: 'checkup_comparison', label: '21. Check-up Comparison', group: 'AI & Triage' },
    { id: 'health_plan', label: '22. Personalized Health Plan', group: 'Care Plans' },
    { id: 'diet_plan', label: '23. Personalized Diet Plan', group: 'Care Plans' },
    { id: 'notifications', label: '24. Notifications', group: 'Alerts & Safety' },
    { id: 'emergency', label: '25. Emergency Support', group: 'Alerts & Safety' },
    { id: 'privacy', label: '26. Privacy Settings', group: 'Privacy & Security' },
    { id: 'data_export', label: '27. Data Export', group: 'Privacy & Security' },
    { id: 'account_deletion', label: '28. Account Deletion', group: 'Privacy & Security' },
    { id: 'logout', label: '29. Logout', group: 'Auth & Entry' },
  ];

  return (
    <div className="flex justify-center items-center py-6 px-2 min-h-[calc(100vh-70px)]">
      {/* Device Chassis (Pixel 8 / Galaxy S24 frame) */}
      <div className="relative w-full max-w-[400px] h-[820px] bg-slate-950 rounded-[46px] p-3.5 shadow-2xl shadow-emerald-950/40 border-4 border-slate-700/80 ring-1 ring-slate-600 flex flex-col overflow-hidden">
        
        {/* Android Top Bezel: Hole Punch & Status Bar */}
        <div className="relative z-20 pt-1 pb-1.5 px-6 flex items-center justify-between text-[11px] text-slate-300 font-medium select-none bg-slate-950">
          <span>9:41</span>
          
          <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950 ring-1 ring-emerald-500/30"></div>
          </div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3 h-3 text-slate-300" />
            <Wifi className="w-3 h-3 text-slate-300" />
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
          </div>
        </div>

        {/* Android Material 3 Top AppBar */}
        <div className="z-20 bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex items-center justify-between select-none">
          <div className="flex items-center gap-2">
            {currentTab !== 'dashboard' ? (
              <button
                onClick={() => setTab('dashboard')}
                className="p-1 -ml-1 rounded-lg text-slate-300 hover:text-white"
                title="Back to Home Dashboard"
              >
                <ChevronLeft className="w-5 h-5 text-emerald-400" />
              </button>
            ) : null}
            <h1 className="text-sm font-bold text-white truncate max-w-[190px]">
              {screenTitles[currentTab] || 'LifeSphere AI'}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setTab('notifications')}
              className="p-1.5 text-slate-300 hover:text-white"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTab('emergency')}
              className="p-1.5 text-rose-500 hover:text-rose-400"
              title="Emergency SOS"
            >
              <AlertTriangle className="w-4 h-4" />
            </button>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-1.5 text-emerald-400 hover:text-emerald-300"
              title="All 29 Modules"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Viewport Screen Content (Scrollable) */}
        <div className="flex-1 bg-slate-900 text-slate-100 overflow-y-auto overflow-x-hidden relative flex flex-col">
          {children}
        </div>

        {/* Android Material 3 Bottom NavigationBar */}
        <div className="z-20 bg-slate-950 border-t border-slate-800/90 px-2 py-2 flex items-center justify-around select-none">
          <button
            onClick={() => setTab('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="text-[10px]">Home</span>
          </button>

          <button
            onClick={() => setTab('measurements')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'measurements' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <HeartPulse className="w-4 h-4" />
            <span className="text-[10px]">Vitals</span>
          </button>

          <button
            onClick={() => setTab('environment')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'environment' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudSun className="w-4 h-4" />
            <span className="text-[10px]">Eco</span>
          </button>

          <button
            onClick={() => setTab('checkup')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              currentTab === 'checkup' || currentTab === 'post_checkup' || currentTab === 'checkup_comparison'
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Stethoscope className="w-4 h-4" />
            <span className="text-[10px]">Check-up</span>
          </button>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-4 h-4" />
            <span className="text-[10px]">All 29</span>
          </button>
        </div>

        {/* Android Gesture Bar */}
        <div className="w-full flex justify-center py-1 bg-slate-950">
          <div className="w-28 h-1 rounded-full bg-slate-600/70"></div>
        </div>

        {/* Material 3 BottomSheet Drawer listing all 29 modules */}
        {drawerOpen && (
          <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-sm flex flex-col justify-end p-2">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 max-h-[75%] flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Grid className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">All 29 LifeSphere Modules</span>
                </div>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-y-auto space-y-1 py-2 flex-1">
                {allModulesList.map((mod) => (
                  <button
                    key={mod.id}
                    onClick={() => {
                      setTab(mod.id);
                      setDrawerOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      currentTab === mod.id
                        ? 'bg-emerald-500 text-slate-950 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <span>{mod.label}</span>
                    <span className="text-[10px] text-slate-500 uppercase">{mod.group}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
