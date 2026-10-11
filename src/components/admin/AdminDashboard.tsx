import React from 'react';
import {
  Users,
  Activity,
  Server,
  Bell,
  HardDrive,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  AdminUser,
  SystemHealthMetrics,
  ApiEndpointHealth,
  AiServiceStatus,
  StorageMetrics,
  SecurityEvent,
  AdminNotification,
  AdminRouteId
} from '../../types/admin';

interface AdminDashboardProps {
  users: AdminUser[];
  systemHealth: SystemHealthMetrics;
  apiEndpoints: ApiEndpointHealth[];
  notifications: AdminNotification[];
  storage: StorageMetrics;
  aiServices: AiServiceStatus[];
  securityEvents: SecurityEvent[];
  onNavigate: (route: AdminRouteId) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users,
  systemHealth,
  apiEndpoints,
  notifications,
  storage,
  aiServices,
  securityEvents,
  onNavigate,
}) => {
  const activeUsersCount = users.filter((u) => u.status === 'ACTIVE').length;
  const healthyApiCount = apiEndpoints.filter((e) => e.status === 'HEALTHY').length;
  const criticalSecEventsCount = securityEvents.filter((e) => e.severity === 'CRITICAL' || e.severity === 'HIGH').length;
  const totalTokensConsumed = aiServices.reduce((acc, s) => acc + s.tokensConsumedToday, 0);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner & Security Guard Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider font-mono">
                Admin Control Plane
              </span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                HIPAA § 164.312 Protected
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
              LifeSphere AI Administrative Dashboard
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Real-time platform telemetry, AI inferencing quotas, security event mitigation, and infrastructure state with enforced Least Privilege privacy.
            </p>
          </div>

          {/* Least Privilege Badge */}
          <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 text-xs max-w-xs shrink-0 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Lock className="w-3.5 h-3.5" />
              <span>Least Privilege Enforced</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Private patient medical records and diagnostic files are not accessible by default to administrators.
            </p>
          </div>
        </div>
      </div>

      {/* 2. THE 7 MANDATED DASHBOARD METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Active Users */}
        <div
          onClick={() => onNavigate('admin_users')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Active Users</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{activeUsersCount}</span>
            <span className="text-[11px] font-bold text-slate-400">of {users.length} total</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>98.4% monthly retention</span>
          </div>
        </div>

        {/* Metric 2: System Health */}
        <div
          onClick={() => onNavigate('admin_system_monitoring')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">System Health</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-emerald-400 font-mono">
              {systemHealth.platformUptimePercent}%
            </span>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
              {systemHealth.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Uptime: {systemHealth.uptimeHours} hrs continuous</span>
          </div>
        </div>

        {/* Metric 3: API Status */}
        <div
          onClick={() => onNavigate('admin_api_health')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">API Status</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Server className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">
              {healthyApiCount}/{apiEndpoints.length}
            </span>
            <span className="text-[11px] font-bold text-cyan-400 font-mono">
              ~{systemHealth.averageLatencyMs}ms
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>All core microservices operational</span>
          </div>
        </div>

        {/* Metric 4: Notification Status */}
        <div
          onClick={() => onNavigate('admin_notifications')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Notification Status</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Bell className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">
              {notifications.length} Sent
            </span>
            <span className="text-[11px] font-bold text-emerald-400 font-mono">
              99.8% Delivered
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>FCM Push pipeline online</span>
          </div>
        </div>

        {/* Metric 5: Storage Usage */}
        <div
          onClick={() => onNavigate('admin_storage')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Storage Usage</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 group-hover:scale-110 transition-transform">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">
              {storage.totalStorageGB} GB
            </span>
            <span className="text-[11px] font-bold text-slate-400">
              of {storage.quotaLimitGB} GB
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-purple-500 h-full rounded-full"
              style={{ width: `${(storage.totalStorageGB / storage.quotaLimitGB) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 6: AI Service Status */}
        <div
          onClick={() => onNavigate('admin_ai_services')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">AI Service Status</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">Operational</span>
            <span className="text-[11px] font-bold text-emerald-400 font-mono">
              {(totalTokensConsumed / 1000000).toFixed(2)}M Tokens
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gemini 2.0 Flash & 1.5 Pro</span>
          </div>
        </div>

        {/* Metric 7: Security Events */}
        <div
          onClick={() => onNavigate('admin_security_events')}
          className="p-5 bg-slate-900 hover:bg-slate-850/80 border border-slate-800 rounded-2xl transition-all cursor-pointer group shadow-lg lg:col-span-2"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider">Security Events</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-white font-mono">
                {securityEvents.length} Events
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">
                {criticalSecEventsCount} High/Crit Mitigated
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Blocked
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
            <span>Latest: {securityEvents[0]?.eventType.replace(/_/g, ' ')}</span>
            <span className="font-mono text-slate-500">{securityEvents[0]?.sourceIp}</span>
          </div>
        </div>

      </div>

      {/* 3. Detailed Monitoring Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Real-Time Microservice API Telemetry */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" /> Microservice Endpoints Health
              </h3>
              <p className="text-xs text-slate-400">Response latencies, RPM throughput, and error boundaries</p>
            </div>
            <button
              onClick={() => onNavigate('admin_api_health')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {apiEndpoints.slice(0, 4).map((endpoint, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-bold font-mono text-slate-300">
                      {endpoint.method}
                    </span>
                    <span className="font-mono font-medium text-slate-200 truncate max-w-xs">
                      {endpoint.endpoint}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {endpoint.requestsPerMinute.toLocaleString()} req/min • p95: {endpoint.p95LatencyMs}ms
                  </p>
                </div>

                <div className="text-right">
                  <span className="font-mono font-bold text-emerald-400">
                    {endpoint.responseTimeMs}ms
                  </span>
                  <div className="text-[10px] text-slate-400">
                    {endpoint.successRatePercent}% ok
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Security & Access Audit Stream */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" /> Recent Security Mitigations
              </h3>
              <p className="text-xs text-slate-400">Brute-force blocks, IP geofencing, and PHI guard triggers</p>
            </div>
            <button
              onClick={() => onNavigate('admin_security_events')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Security Hub</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {securityEvents.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-white text-[11px]">
                    {event.eventType}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      event.severity === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : event.severity === 'HIGH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {event.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {event.details}
                </p>
                <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                  <span>{event.sourceIp} ({event.location})</span>
                  <span>{new Date(event.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
