import React from 'react';
import {
  LayoutDashboard,
  HeartPulse,
  CloudSun,
  Stethoscope,
  Pill,
  Watch,
  TrendingUp,
  Apple,
  FileText,
  AlertOctagon,
  ShieldCheck,
  Settings,
  Sparkles,
  Calendar,
  Lock,
  Download,
  Trash2,
  LogOut,
  FolderOpen,
  Bell,
  Activity,
  Layers
} from 'lucide-react';
import { ScreenModule } from '../types';

interface SidebarProps {
  currentTab: ScreenModule;
  setTab: (tab: ScreenModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setTab }) => {
  const sections = [
    {
      title: 'Core & Overview',
      items: [
        { id: 'dashboard' as ScreenModule, label: '8. Health Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-emerald-400" /> },
        { id: 'splash' as ScreenModule, label: '1. Splash Screen', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
        { id: 'onboarding' as ScreenModule, label: '2. Onboarding', icon: <Layers className="w-4 h-4 text-cyan-400" /> },
      ],
    },
    {
      title: 'Clinical & Biometrics',
      items: [
        { id: 'measurements' as ScreenModule, label: '9. Health Measurements', icon: <HeartPulse className="w-4 h-4 text-rose-400" /> },
        { id: 'wearable' as ScreenModule, label: '10. Wearable Data', icon: <Watch className="w-4 h-4 text-cyan-400" /> },
        { id: 'medical_records' as ScreenModule, label: '11. Medical Records', icon: <FolderOpen className="w-4 h-4 text-purple-400" /> },
        { id: 'reports' as ScreenModule, label: '12. Health Reports', icon: <FileText className="w-4 h-4 text-purple-400" /> },
        { id: 'medications' as ScreenModule, label: '13. Medication Management', icon: <Pill className="w-4 h-4 text-indigo-400" /> },
        { id: 'lifestyle' as ScreenModule, label: '14. Lifestyle Data', icon: <Activity className="w-4 h-4 text-teal-400" /> },
        { id: 'environment' as ScreenModule, label: '15. Environmental Exposure', icon: <CloudSun className="w-4 h-4 text-amber-400" /> },
        { id: 'trends' as ScreenModule, label: '16. Health Trends', icon: <TrendingUp className="w-4 h-4 text-blue-400" /> },
      ],
    },
    {
      title: 'AI Intelligence & Check-ups',
      items: [
        { id: 'ai_insights' as ScreenModule, label: '17. AI Insights', icon: <Sparkles className="w-4 h-4 text-emerald-400" /> },
        { id: 'recommendations' as ScreenModule, label: '18. Preventive Directives', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
        { id: 'checkup' as ScreenModule, label: '19. Monthly Check-up', icon: <Stethoscope className="w-4 h-4 text-purple-400" /> },
        { id: 'post_checkup' as ScreenModule, label: '20. Post Check-up Update', icon: <FileText className="w-4 h-4 text-purple-400" /> },
        { id: 'checkup_comparison' as ScreenModule, label: '21. Check-up Comparison', icon: <TrendingUp className="w-4 h-4 text-blue-400" /> },
        { id: 'health_plan' as ScreenModule, label: '22. Personalized Health Plan', icon: <Calendar className="w-4 h-4 text-emerald-400" /> },
        { id: 'diet_plan' as ScreenModule, label: '23. Personalized Diet Plan', icon: <Apple className="w-4 h-4 text-green-400" /> },
      ],
    },
    {
      title: 'Alerts, Safety & Privacy',
      items: [
        { id: 'notifications' as ScreenModule, label: '24. Notifications', icon: <Bell className="w-4 h-4 text-amber-400" /> },
        { id: 'emergency' as ScreenModule, label: '25. Emergency Support', icon: <AlertOctagon className="w-4 h-4 text-rose-500" /> },
        { id: 'profile' as ScreenModule, label: '6. User Profile', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        { id: 'consent' as ScreenModule, label: '7. Consent Management', icon: <ShieldCheck className="w-4 h-4 text-cyan-400" /> },
        { id: 'privacy' as ScreenModule, label: '26. Privacy Settings', icon: <Lock className="w-4 h-4 text-slate-400" /> },
        { id: 'data_export' as ScreenModule, label: '27. Data Export', icon: <Download className="w-4 h-4 text-purple-400" /> },
        { id: 'account_deletion' as ScreenModule, label: '28. Account Deletion', icon: <Trash2 className="w-4 h-4 text-rose-500" /> },
        { id: 'logout' as ScreenModule, label: '29. Logout', icon: <LogOut className="w-4 h-4 text-slate-500" /> },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-full select-none">
      {/* Patient header */}
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/30 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-sm">
          JV
        </div>
        <div className="overflow-hidden">
          <h4 className="text-sm font-semibold text-white truncate">Dr. Jordan Vance</h4>
          <p className="text-[11px] text-slate-400 truncate">LifeSphere Patient ID: #LS-8842</p>
        </div>
      </div>

      {/* Nav list with all 29 modules */}
      <nav className="p-2 space-y-4 overflow-y-auto flex-1">
        {sections.map((sec, idx) => (
          <div key={idx} className="space-y-1">
            <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {sec.title}
            </div>
            {sec.items.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/10'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <span className={isActive ? 'text-slate-950' : ''}>{item.icon}</span>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center gap-1 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Android API 34
        </span>
        <span className="font-mono text-[10px]">29 Modules</span>
      </div>
    </aside>
  );
};
