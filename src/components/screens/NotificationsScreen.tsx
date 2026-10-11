import React, { useState } from 'react';
import { Bell, AlertTriangle, Pill, FileText, CheckCircle2, Trash2 } from 'lucide-react';
import { ScreenModule } from '../../types';

interface NotificationsScreenProps {
  setScreen: (module: ScreenModule) => void;
  showSnackbar: (msg: string) => void;
  isMobile?: boolean;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Hazard' | 'Medication' | 'Report';
  time: string;
  read: boolean;
  urgent: boolean;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  setScreen,
  showSnackbar,
  isMobile,
}) => {
  const [filter, setFilter] = useState<'All' | 'Hazard' | 'Medication' | 'Report'>('All');
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Elevated PM2.5 Micro-Dust Alert',
      message: 'Ambient air quality degraded to AQI 68. Sensitive asthma profiles advised to reschedule outdoor aerobic activity.',
      category: 'Hazard',
      time: '12m ago',
      read: false,
      urgent: true,
    },
    {
      id: 'notif_2',
      title: 'Prescription Schedule: Montelukast 10mg',
      message: 'Evening dose is scheduled for 09:00 PM. Take with water before bedtime.',
      category: 'Medication',
      time: '1h ago',
      read: false,
      urgent: false,
    },
    {
      id: 'notif_3',
      title: 'September 2026 Health Report Ready',
      message: 'Your monthly biometric summary and environmental cross-correlation report is compiled and signed.',
      category: 'Report',
      time: '4h ago',
      read: true,
      urgent: false,
    },
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showSnackbar('All notifications marked as read.');
  };

  const clearAll = () => {
    setNotifications([]);
    showSnackbar('All notifications cleared.');
  };

  const filtered = filter === 'All' ? notifications : notifications.filter((n) => n.category === filter);

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-4xl mx-auto'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base md:text-lg font-bold text-white">Notifications & Alerts</h2>
            <p className="text-xs text-slate-400">Clinical triggers and atmospheric hazard warnings</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={markAllRead}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Mark all read
          </button>
          <span className="text-slate-600">•</span>
          <button
            onClick={clearAll}
            className="text-xs text-rose-400 hover:text-rose-300 font-medium"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['All', 'Hazard', 'Medication', 'Report'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === tab
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            <p className="text-xs text-slate-400">No active alerts in this category.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                item.read
                  ? 'bg-slate-900/60 border-slate-800 text-slate-400'
                  : 'bg-slate-900 border-slate-700 shadow-md text-slate-200'
              }`}
            >
              <div className="p-2 rounded-xl bg-slate-800 shrink-0 mt-0.5">
                {item.category === 'Hazard' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                {item.category === 'Medication' && <Pill className="w-4 h-4 text-indigo-400" />}
                {item.category === 'Report' && <FileText className="w-4 h-4 text-purple-400" />}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs md:text-sm font-bold text-white">{item.title}</h4>
                    {item.urgent && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 font-bold uppercase">
                        Urgent
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{item.time}</span>
                </div>
                <p className="text-xs leading-relaxed">{item.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
