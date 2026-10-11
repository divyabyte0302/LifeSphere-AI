import React, { useState } from 'react';
import {
  Bell,
  Send,
  Users,
  CheckCircle2,
  Clock,
  Filter,
  AlertTriangle,
  Radio,
  FileText
} from 'lucide-react';
import { AdminNotification } from '../../types/admin';

interface AdminNotificationsViewProps {
  notifications: AdminNotification[];
  onDispatchNotification: (notif: AdminNotification) => void;
}

export const AdminNotificationsView: React.FC<AdminNotificationsViewProps> = ({
  notifications,
  onDispatchNotification,
}) => {
  const [isComposing, setIsComposing] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<AdminNotification['targetAudience']>('ALL_USERS');
  const [type, setType] = useState<AdminNotification['type']>('ENVIRONMENTAL_ADVISORY');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      title,
      message,
      targetAudience,
      type,
      sentAt: new Date().toISOString(),
      deliveryRatePercent: 99.8,
      openRatePercent: 78.4,
      status: 'SENT',
    };

    onDispatchNotification(newNotif);
    setTitle('');
    setMessage('');
    setIsComposing(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider font-mono">
              FCM Engine Active
            </span>
          </div>
          <h2 className="text-xl font-bold text-white">System Notification & Broadcast Management</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Dispatch critical environmental advisories, system alerts, and clinical notices across mobile and web devices.
          </p>
        </div>

        <button
          onClick={() => setIsComposing(!isComposing)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-colors self-start md:self-auto shadow-lg shadow-amber-600/20"
        >
          <Send className="w-3.5 h-3.5" />
          <span>{isComposing ? 'Cancel Broadcast' : 'Compose New Broadcast'}</span>
        </button>
      </div>

      {/* Composition Form */}
      {isComposing && (
        <form onSubmit={handleSubmit} className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl p-6 space-y-4 animate-in fade-in">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>Create Outbound Push Broadcast</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-slate-400">Target Audience Cohort</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ALL_USERS">All Registered Users (Mobile & Web)</option>
                <option value="ASTHMA_COHORT">Asthma & Respiratory Cohort</option>
                <option value="DOCTORS_ONLY">Licensed Medical Doctors Only</option>
                <option value="ADMINISTRATORS">System Administrators</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs text-slate-400">Notification Category</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              >
                <option value="ENVIRONMENTAL_ADVISORY">Environmental Hazard Advisory (PM2.5 / Ozone)</option>
                <option value="SYSTEM_MAINTENANCE">System Maintenance Window</option>
                <option value="CLINICAL_UPDATE">Clinical Guideline Bulletin</option>
                <option value="SECURITY_BULLETIN">Security Policy Update</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Broadcast Title</label>
            <input
              type="text"
              placeholder="e.g., Severe Ozone Spike: Outdoor Exercise Restriction"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-400">Message Content</label>
            <textarea
              rows={3}
              placeholder="Write the full advisory text..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsComposing(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-600/30"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Broadcast Now</span>
            </button>
          </div>
        </form>
      )}

      {/* Broadcast List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Dispatched System Broadcasts ({notifications.length})
        </h3>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-white text-sm">{notif.title}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-800 text-slate-300">
                    {notif.targetAudience.replace(/_/g, ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-amber-500/20 text-amber-300">
                    {notif.type.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {notif.message}
                </p>
                <div className="text-[10px] text-slate-500 font-mono">
                  Dispatched: {new Date(notif.sentAt).toLocaleString()}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 bg-slate-950 p-3 rounded-xl border border-slate-800 text-center font-mono">
                <div>
                  <span className="text-emerald-400 font-bold block text-sm">
                    {notif.deliveryRatePercent}%
                  </span>
                  <span className="text-[10px] text-slate-500">Delivered</span>
                </div>
                <div className="w-px h-6 bg-slate-800" />
                <div>
                  <span className="text-sky-400 font-bold block text-sm">
                    {notif.openRatePercent}%
                  </span>
                  <span className="text-[10px] text-slate-500">Opened</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
