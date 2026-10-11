import React, { useState } from 'react';
import {
  Activity,
  Search,
  Bell,
  User,
  AlertTriangle,
  Menu,
  X,
  LayoutDashboard,
  HeartPulse,
  FolderOpen,
  FileText,
  Pill,
  Moon,
  CloudSun,
  Watch,
  TrendingUp,
  Sparkles,
  Stethoscope,
  Apple,
  ShieldAlert,
  Settings,
  Download,
  ChevronDown,
  Globe,
  Cpu,
  Layers,
  Calculator,
  Navigation,
  Flame,
  Building2,
  Compass
} from 'lucide-react';
import { ScreenModule, HealthMetrics, EnvironmentalData, UserProfile } from '../../types';
import { SyncStatusIndicator } from '../sync/SyncStatusIndicator';

interface AuthenticatedWebLayoutProps {
  currentRoute: ScreenModule;
  onNavigate: (route: ScreenModule) => void;
  onTriggerSos: () => void;
  deviceTier: 'desktop' | 'tablet' | 'mobile';
  user: UserProfile;
  onOpenAdmin?: () => void;
  onOpenDoctor?: () => void;
  onNavigateToPublic?: () => void;
  children: React.ReactNode;
}

export const AuthenticatedWebLayout: React.FC<AuthenticatedWebLayoutProps> = ({
  currentRoute,
  onNavigate,
  onTriggerSos,
  deviceTier,
  user,
  onOpenAdmin,
  onOpenDoctor,
  onNavigateToPublic,
  children,
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // The 15 LifeSphere AI-X Primary Modules organized into logical tiers
  const navItems: { id: ScreenModule; label: string; icon: React.ReactNode; category?: string }[] = [
    { id: 'dashboard', label: '1. Main Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" />, category: 'Core' },
    { id: 'digital_twin', label: '2. AI Digital Twin', icon: <Cpu className="w-4 h-4 text-cyan-400" />, category: 'Core' },
    { id: 'measurements', label: '3. Health Overview', icon: <HeartPulse className="w-4 h-4 text-rose-400" />, category: 'Core' },
    { id: 'medical_records', label: '4. Medical Records', icon: <FolderOpen className="w-4 h-4 text-purple-400" />, category: 'Core' },
    { id: 'wearable', label: '5. Wearables & IoT', icon: <Watch className="w-4 h-4 text-cyan-400" />, category: 'Sensors' },
    { id: 'environment', label: '6. Environment', icon: <CloudSun className="w-4 h-4 text-amber-400" />, category: 'Sensors' },
    { id: 'fusion_engine', label: '7. Fusion Engine', icon: <Layers className="w-4 h-4 text-emerald-400" />, category: 'AI & ML' },
    { id: 'ml_prediction', label: '8. ML Risk Prediction', icon: <TrendingUp className="w-4 h-4 text-purple-400" />, category: 'AI & ML' },
    { id: 'life_risk_score', label: '9. Life Risk Score', icon: <Calculator className="w-4 h-4 text-cyan-400" />, category: 'AI & ML' },
    { id: 'recommendations', label: '10. Recommendations', icon: <Sparkles className="w-4 h-4 text-amber-400" />, category: 'AI & ML' },
    { id: 'safe_routes', label: '11. Safe Routes', icon: <Navigation className="w-4 h-4 text-emerald-400" />, category: 'Spatial' },
    { id: 'community_hazards', label: '12. Community Hazards', icon: <Flame className="w-4 h-4 text-orange-400" />, category: 'Spatial' },
    { id: 'city_analytics', label: '13. City Analytics', icon: <Building2 className="w-4 h-4 text-cyan-400" />, category: 'Spatial' },
    { id: 'emergency', label: '14. Emergency SOS', icon: <AlertTriangle className="w-4 h-4 text-rose-500" />, category: 'Safety' },
    { id: 'settings', label: '15. Settings & Audits', icon: <Settings className="w-4 h-4 text-slate-400" />, category: 'Safety' },
  ];

  const getSectionTitle = () => {
    const found = navItems.find((n) => n.id === currentRoute);
    return found ? found.label : 'Health Dashboard';
  };

  const isDesktop = deviceTier === 'desktop';
  const isTablet = deviceTier === 'tablet';
  const isMobile = deviceTier === 'mobile';

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex ${isMobile ? 'flex-col' : 'flex-row'} overflow-hidden select-none`}>
      
      {/* 1. Left Sidebar (for Desktop and Tablet when expanded) */}
      {(isDesktop || (isTablet && !drawerOpen)) && (
        <aside className={`${isTablet ? 'w-20' : 'w-64'} bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen transition-all duration-300`}>
          {/* Logo & Platform Name */}
          <div
            onClick={onNavigateToPublic}
            className={`p-5 border-b border-slate-800 flex items-center gap-3 ${onNavigateToPublic ? 'cursor-pointer hover:opacity-90' : ''}`}
            title={onNavigateToPublic ? "Return to Public Website" : undefined}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <Activity className="w-5 h-5 text-slate-950 font-black" />
            </div>
            {!isTablet && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  LIFESPHERE <span className="text-cyan-400">AI-X</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5 truncate">Academic Preventive Health ML</span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto flex-1 no-scrollbar">
            {navItems.map((item) => {
              const active = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  title={item.label}
                  className={`w-full flex items-center ${isTablet ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'} rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                      : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                  }`}
                >
                  <span className={active ? 'text-slate-950' : ''}>{item.icon}</span>
                  {!isTablet && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          {/* Bottom Profile Widget & Admin / Doctor Portal Buttons */}
          {!isTablet ? (
            <div className="p-4 border-t border-slate-800 bg-slate-950/40 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {onOpenDoctor && (
                  <button
                    onClick={onOpenDoctor}
                    className="py-2 px-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">Doctor Portal</span>
                  </button>
                )}
                {onOpenAdmin && (
                  <button
                    onClick={onOpenAdmin}
                    className="py-2 px-2.5 rounded-xl bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span className="truncate">Admin Portal</span>
                  </button>
                )}
              </div>

              {onNavigateToPublic && (
                <button
                  onClick={onNavigateToPublic}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-750 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Public Website</span>
                </button>
              )}

              <div
                onClick={() => onNavigate('profile')}
                className="flex items-center gap-3 cursor-pointer hover:opacity-85 transition-opacity pt-1"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                  JV
                </div>
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate">{user.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">ID: #{user.id}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 border-t border-slate-800 flex flex-col items-center gap-2">
              {onOpenDoctor && (
                <button
                  onClick={onOpenDoctor}
                  title="Doctor Portal"
                  className="w-8 h-8 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 flex items-center justify-center cursor-pointer hover:bg-emerald-900"
                >
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                </button>
              )}
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  title="Admin Portal"
                  className="w-8 h-8 rounded-xl bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 flex items-center justify-center cursor-pointer hover:bg-indigo-900"
                >
                  <ShieldAlert className="w-4 h-4 text-indigo-400" />
                </button>
              )}
              <div
                onClick={() => onNavigate('profile')}
                className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                JV
              </div>
            </div>
          )}
        </aside>
      )}

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-18 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          
          <div className="flex items-center gap-4">
            {/* Drawer trigger for Mobile or Tablet */}
            {(isMobile || isTablet) && (
              <button
                onClick={() => setDrawerOpen(true)}
                className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <div>
              <h1 className="text-base md:text-lg font-bold text-white tracking-tight">
                {getSectionTitle()}
              </h1>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Continuous Physiological & Atmospheric Telemetry Active
              </p>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
              <input
                type="text"
                placeholder="Search biomarkers, active prescriptions, lab panels..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Right Controls: SOS, Notifications, User Profile */}
          <div className="flex items-center gap-3">
            <SyncStatusIndicator compact={true} />
            <button
              onClick={onTriggerSos}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-md shadow-rose-600/30"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>SOS</span>
            </button>

            {/* Notifications with counter */}
            <div className="relative">
              <button
                onClick={() => onNavigate('notifications')}
                className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 relative transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              </button>
            </div>

            {/* User Profile Trigger */}
            <button
              onClick={() => onNavigate('profile')}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 hover:opacity-85 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-emerald-400">
                JV
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Main Content Body */}
        <main className="flex-1 overflow-y-auto bg-slate-950">
          <div className={`${isMobile ? 'p-3' : isTablet ? 'p-5' : 'p-6'} max-w-7xl mx-auto space-y-6`}>
            {children}
          </div>
        </main>

        {/* Mobile Web Bottom Navigation Bar */}
        {isMobile && (
          <nav className="bg-slate-900 border-t border-slate-800 px-2 py-2 flex items-center justify-around shrink-0 select-none">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                currentRoute === 'dashboard' ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('measurements')}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                currentRoute === 'measurements' ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <HeartPulse className="w-4 h-4" />
              <span>Vitals</span>
            </button>

            <button
              onClick={() => onNavigate('environment')}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                currentRoute === 'environment' ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <CloudSun className="w-4 h-4" />
              <span>Eco</span>
            </button>

            <button
              onClick={() => onNavigate('checkup')}
              className={`flex flex-col items-center gap-1 text-[10px] ${
                currentRoute === 'checkup' ? 'text-emerald-400 font-bold' : 'text-slate-400'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Check-up</span>
            </button>

            <button
              onClick={() => setDrawerOpen(true)}
              className="flex flex-col items-center gap-1 text-[10px] text-slate-400 hover:text-white"
            >
              <Menu className="w-4 h-4" />
              <span>More</span>
            </button>
          </nav>
        )}

      </div>

      {/* Mobile / Tablet Drawer Navigation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-start animate-in fade-in duration-150">
          <div className="w-72 bg-slate-900 h-full p-4 flex flex-col border-r border-slate-800 shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-white">Platform Navigation</span>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="overflow-y-auto space-y-1 py-3 flex-1 no-scrollbar">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setDrawerOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-3 transition-colors ${
                    currentRoute === item.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {onOpenDoctor && (
                  <button
                    onClick={() => {
                      onOpenDoctor();
                      setDrawerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Doctor</span>
                  </button>
                )}
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      onOpenAdmin();
                      setDrawerOpen(false);
                    }}
                    className="p-2 rounded-xl bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Admin</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  onNavigate('profile');
                  setDrawerOpen(false);
                }}
                className="w-full text-left text-xs text-slate-400 flex items-center justify-between p-2 rounded-xl bg-slate-950"
              >
                <span>Dr. Jordan Vance</span>
                <span className="text-emerald-400 font-bold">Profile</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
