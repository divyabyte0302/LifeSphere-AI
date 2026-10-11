import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  Activity,
  Bell,
  FileText,
  Sparkles,
  Server,
  HardDrive,
  LifeBuoy,
  Settings,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Lock,
  ArrowLeft,
  UserCheck,
  Shield,
  Key
} from 'lucide-react';
import { AdminRouteId, UserRole } from '../../types/admin';
import { CurrentAdminAuth } from '../../services/adminAuthService';
import { AdminRouteGuard } from './AdminRouteGuard';

interface AdminLayoutProps {
  currentRoute: AdminRouteId;
  onNavigate: (route: AdminRouteId) => void;
  currentAuth: CurrentAdminAuth;
  onRoleSwitch: (role: UserRole) => void;
  onExitAdminPortal: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  currentAuth,
  onRoleSwitch,
  onExitAdminPortal,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const adminNavItems: Array<{
    id: AdminRouteId;
    label: string;
    icon: React.ReactNode;
    category?: string;
  }> = [
    { id: 'admin_dashboard', label: 'Admin Dashboard', icon: <LayoutDashboard className="w-4 h-4 text-indigo-400" /> },
    { id: 'admin_users', label: 'User Management', icon: <Users className="w-4 h-4 text-blue-400" /> },
    { id: 'admin_system_monitoring', label: 'System Monitoring', icon: <Activity className="w-4 h-4 text-emerald-400" /> },
    { id: 'admin_notifications', label: 'Notification Hub', icon: <Bell className="w-4 h-4 text-amber-400" /> },
    { id: 'admin_audit_logs', label: 'Audit-Log Monitoring', icon: <FileText className="w-4 h-4 text-purple-400" /> },
    { id: 'admin_ai_services', label: 'AI Service Monitoring', icon: <Sparkles className="w-4 h-4 text-teal-400" /> },
    { id: 'admin_api_health', label: 'API Health', icon: <Server className="w-4 h-4 text-cyan-400" /> },
    { id: 'admin_storage', label: 'Storage Monitoring', icon: <HardDrive className="w-4 h-4 text-purple-400" /> },
    { id: 'admin_security_events', label: 'Security Events', icon: <ShieldAlert className="w-4 h-4 text-rose-400" /> },
    { id: 'admin_support_tickets', label: 'Support Tickets', icon: <LifeBuoy className="w-4 h-4 text-teal-400" /> },
    { id: 'admin_configuration', label: 'System Configuration', icon: <Settings className="w-4 h-4 text-slate-400" /> },
  ];

  const currentItem = adminNavItems.find((n) => n.id === currentRoute);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden select-none">
      
      {/* 1. Left Sidebar for Admin Features */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-white block">
                LIFESPHERE <span className="text-indigo-400">ADMIN</span>
              </span>
              <span className="text-[10px] text-slate-400 block -mt-0.5">Control Plane & Telemetry</span>
            </div>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white md:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto flex-1 no-scrollbar">
          <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
            Administration Features
          </div>

          {adminNavItems.map((item) => {
            const active = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-600/20'
                    : 'text-slate-300 hover:bg-slate-850 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Return to App & Active Role Claim Badge */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 text-[10px]">Active Role Claim:</span>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
              currentAuth.role === 'ADMIN'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : currentAuth.role === 'DOCTOR'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
            }`}>
              {currentAuth.role}
            </span>
          </div>

          <button
            onClick={onExitAdminPortal}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Patient Portal</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Top Header with Interactive Role Switcher */}
        <header className="h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-850 md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>{currentItem?.label || 'Administration'}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 hidden sm:inline">
                  /admin/{currentRoute.replace('admin_', '')}
                </span>
              </h1>
            </div>
          </div>

          {/* Interactive Role Switcher & Claims Tester (Mandated RBAC) */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <span className="text-slate-500 text-[10px] px-2 font-sans font-bold">RBAC Role:</span>
              <button
                onClick={() => onRoleSwitch('ADMIN')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currentAuth.role === 'ADMIN'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Administrator (Full Admin Portal access with Least Privilege medical redactions)"
              >
                ADMIN
              </button>
              <button
                onClick={() => onRoleSwitch('DOCTOR')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currentAuth.role === 'DOCTOR'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to DOCTOR (Test 403 Forbidden screen on Admin Portal)"
              >
                DOCTOR
              </button>
              <button
                onClick={() => onRoleSwitch('USER')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  currentAuth.role === 'USER'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to USER (Test 403 Forbidden screen on Admin Portal)"
              >
                USER
              </button>
            </div>

            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* 3. Protected Content Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950">
          <div className="max-w-7xl mx-auto">
            <AdminRouteGuard
              currentAuth={currentAuth}
              onRoleSwitch={onRoleSwitch}
            >
              {children}
            </AdminRouteGuard>
          </div>
        </main>

      </div>

    </div>
  );
};
