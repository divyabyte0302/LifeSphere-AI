import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  FileText,
  PhoneCall,
  RefreshCw,
  Info,
  ShieldCheck,
  MapPin,
  Heart,
  Droplets,
  Wind,
  Check,
  ChevronRight,
  Users,
  UserPlus,
  Bell,
  Settings2,
  Eye,
  EyeOff,
  Trash2,
  AlertOctagon,
  Navigation,
  Radio,
  Plus,
} from 'lucide-react';
import {
  HealthMetrics,
  EnvironmentalData,
  EmergencyContact,
  EmergencyAlertRule,
  EmergencyEventRecord,
  EmergencyRelationship,
  AlertSeverity,
} from '../types';
import { emergencyService } from '../services/emergencyService';

interface EmergencySupportViewProps {
  vitals: HealthMetrics;
  environment: EnvironmentalData;
  userId?: string;
  showSnackbar?: (msg: string) => void;
  isMobile?: boolean;
}

export const EmergencySupportView: React.FC<EmergencySupportViewProps> = ({
  vitals,
  environment,
  userId = 'LS-8842',
  showSnackbar,
  isMobile = false,
}) => {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'sos_active' | 'contacts' | 'rules' | 'history'>('sos_active');

  // SOS Countdown & Abort State
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [isActivatingSos, setIsActivatingSos] = useState(false);
  const [includeLocation, setIncludeLocation] = useState(true);
  const [currentGps, setCurrentGps] = useState<{ lat: number; lng: number } | null>(null);
  const [emergencyNumber, setEmergencyNumber] = useState('911');

  // Ambulance Action State
  const [ambulanceLaunched, setAmbulanceLaunched] = useState(false);
  const [dialerMessage, setDialerMessage] = useState<string | null>(null);

  // Active Emergency Event
  const [activeEvent, setActiveEvent] = useState<EmergencyEventRecord | null>(null);

  // Contacts State
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [showContactModal, setShowContactModal] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [revealedPhones, setRevealedPhones] = useState<Record<string, boolean>>({});

  // New Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactRelation, setContactRelation] = useState<EmergencyRelationship>('Spouse');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactIsPrimary, setContactIsPrimary] = useState(false);
  const [contactConsent, setContactConsent] = useState(true);
  const [contactPush, setContactPush] = useState(true);
  const [contactSms, setContactSms] = useState(true);
  const [contactInApp, setContactInApp] = useState(true);

  // Alert Rules State
  const [rules, setRules] = useState<EmergencyAlertRule[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<ReturnType<typeof emergencyService.evaluateVitalsAgainstRules> | null>(null);

  // History State
  const [eventHistory, setEventHistory] = useState<EmergencyEventRecord[]>([]);
  const [selectedEventForAck, setSelectedEventForAck] = useState<EmergencyEventRecord | null>(null);
  const [ackResponderName, setAckResponderName] = useState('Sarah Vance (Spouse)');
  const [ackNotes, setAckNotes] = useState('');

  // 1. Initial Load of Contacts, Rules, and Events
  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    const c = await emergencyService.getEmergencyContacts(userId);
    setContacts(c);

    const r = await emergencyService.getAlertRules(userId);
    setRules(r);

    const h = await emergencyService.getEmergencyEventHistory(userId);
    setEventHistory(h);

    const active = h.find((e) => e.status === 'active');
    if (active) setActiveEvent(active);
  };

  // 2. Real-time Rule Evaluation with Data-Quality Checks
  useEffect(() => {
    if (rules.length > 0) {
      const evalRes = emergencyService.evaluateVitalsAgainstRules(vitals, environment, rules);
      setEvaluationResult(evalRes);

      // If critical automated rule triggered and no active event, notify user
      if (evalRes.triggered && evalRes.rule && !activeEvent && evalRes.severity === 'critical') {
        // Automatically create alert record
        emergencyService.triggerAutomatedRuleAlert({
          userId,
          rule: evalRes.rule,
          reason: evalRes.reason || 'Critical vital threshold breached',
          vitals,
          environment,
        }).then((newEv) => {
          setActiveEvent(newEv);
          loadData();
          showSnackbar?.(`🚨 Automated Critical Alert: ${evalRes.rule?.name}`);
        });
      }
    }
  }, [vitals, environment, rules]);

  // 3. SOS Countdown Timer Hook
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sosCountdown !== null && sosCountdown > 0) {
      timer = setTimeout(() => {
        setSosCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
    } else if (sosCountdown === 0) {
      // Countdown expired: trigger emergency action
      executeManualSos();
      setSosCountdown(null);
    }
    return () => clearTimeout(timer);
  }, [sosCountdown]);

  // Handle Manual SOS Button Click
  const handleStartSosCountdown = () => {
    setSosCountdown(3); // 3 second safety countdown before auto-transmission
  };

  const handleCancelCountdown = () => {
    setSosCountdown(null);
    showSnackbar?.('SOS activation aborted by user.');
  };

  const executeManualSos = async () => {
    setIsActivatingSos(true);
    try {
      const event = await emergencyService.triggerManualSos({
        userId,
        reason: 'Manual SOS Triggered: User requested immediate medical/emergency assistance.',
        vitals,
        environment,
        includeLocation,
        localEmergencyNumber: emergencyNumber,
      });

      setActiveEvent(event);
      await loadData();
      showSnackbar?.('🚨 Emergency SOS Dispatched to Designated Contacts!');
    } catch (err) {
      showSnackbar?.(`SOS trigger error: ${err instanceof Error ? err.message : 'Unknown'}`);
    } finally {
      setIsActivatingSos(false);
    }
  };

  // Direct Ambulance Call Action
  const handleLaunchAmbulanceDialer = () => {
    const callResult = emergencyService.initiateAmbulanceCall(
      emergencyNumber,
      activeEvent?.id,
      userId
    );

    setAmbulanceLaunched(true);
    setDialerMessage(callResult.disclaimer);

    // Launch native phone dialer via browser window.location
    window.location.href = callResult.telUri;
    showSnackbar?.(`Launching native dialer (${emergencyNumber})...`);
  };

  // Contacts Management
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      showSnackbar?.('Name and phone number are required.');
      return;
    }

    if (!contactConsent) {
      showSnackbar?.('Explicit user consent is legally required to register emergency contacts.');
      return;
    }

    await emergencyService.saveEmergencyContact(userId, {
      id: editingContact?.id,
      name: contactName,
      relationship: contactRelation,
      phone: contactPhone,
      email: contactEmail || undefined,
      isPrimary: contactIsPrimary,
      notificationPreferences: {
        push: contactPush,
        sms: contactSms,
        inApp: contactInApp,
      },
      hasExplicitConsent: contactConsent,
      consentGrantedAt: new Date().toISOString(),
    });

    setShowContactModal(false);
    resetContactForm();
    await loadData();
    showSnackbar?.('Emergency contact saved successfully.');
  };

  const handleDeleteContact = async (id: string) => {
    await emergencyService.deleteEmergencyContact(userId, id);
    await loadData();
    showSnackbar?.('Emergency contact removed.');
  };

  const resetContactForm = () => {
    setEditingContact(null);
    setContactName('');
    setContactRelation('Spouse');
    setContactPhone('');
    setContactEmail('');
    setContactIsPrimary(false);
    setContactConsent(true);
    setContactPush(true);
    setContactSms(true);
    setContactInApp(true);
  };

  const openEditContact = (c: EmergencyContact) => {
    setEditingContact(c);
    setContactName(c.name);
    setContactRelation(c.relationship);
    setContactPhone(c.phone);
    setContactEmail(c.email || '');
    setContactIsPrimary(c.isPrimary);
    setContactConsent(c.hasExplicitConsent);
    setContactPush(c.notificationPreferences.push);
    setContactSms(c.notificationPreferences.sms);
    setContactInApp(c.notificationPreferences.inApp);
    setShowContactModal(true);
  };

  const togglePhoneMask = (id: string) => {
    setRevealedPhones((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskPhone = (phone: string, id: string) => {
    if (revealedPhones[id]) return phone;
    // Mask middle digits: +1 (555) 019-2834 -> +1 (555) ***-2834
    if (phone.length <= 6) return phone;
    return phone.replace(/(\d{3})[ -]?\d{3}[ -]?(\d{4})/, '$1 ***-$2');
  };

  // Rule Threshold Update
  const handleToggleRule = async (rule: EmergencyAlertRule) => {
    const updated = { ...rule, isEnabled: !rule.isEnabled };
    await emergencyService.updateAlertRule(userId, updated);
    await loadData();
    showSnackbar?.(`Rule "${rule.name}" ${updated.isEnabled ? 'enabled' : 'disabled'}.`);
  };

  const handleUpdateThreshold = async (rule: EmergencyAlertRule, newThreshold: number) => {
    const updated = { ...rule, threshold: newThreshold };
    await emergencyService.updateAlertRule(userId, updated);
    await loadData();
  };

  // Acknowledge Event
  const handleAcknowledgeEvent = async () => {
    if (!selectedEventForAck) return;
    await emergencyService.acknowledgeEmergencyEvent(
      userId,
      selectedEventForAck.id,
      ackResponderName,
      ackNotes || undefined
    );
    setSelectedEventForAck(null);
    setAckNotes('');
    await loadData();
    showSnackbar?.('Emergency incident acknowledged.');
  };

  // Resolve Active Event
  const handleResolveEvent = async (id: string) => {
    await emergencyService.resolveEmergencyEvent(userId, id);
    setActiveEvent(null);
    await loadData();
    showSnackbar?.('Emergency incident resolved.');
  };

  // Cancel False Alarm
  const handleCancelEvent = async (id: string) => {
    await emergencyService.cancelEmergencyEvent(userId, id);
    setActiveEvent(null);
    await loadData();
    showSnackbar?.('Emergency alert cancelled (marked false alarm).');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
              </span>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                  Emergency Detection & Response
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                    Module 2
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Real-time biomarker monitoring, one-tap SOS, registered contact escalation, and direct 911 dispatch guidance.
                </p>
              </div>
            </div>

            {/* Strict Regulatory & Clinical Disclaimers */}
            <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 max-w-3xl">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>CRITICAL SAFETY ADVICE:</strong> For suspected life-threatening medical emergencies, do not wait for AI assessment or telemetry relay.
                Contact local emergency services (<strong>{emergencyNumber}</strong>) immediately. Automated features notify your ICE contacts and assist with location sharing but do not replace municipal emergency dispatchers.
              </span>
            </div>
          </div>

          {/* Quick Stats / Status Pill */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-right">
              <div className="text-[10px] text-slate-400 font-medium">Registered ICE Contacts</div>
              <div className="text-sm font-bold text-white flex items-center justify-end gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                {contacts.length} Configured
              </div>
            </div>

            <div className="px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700/80 text-right">
              <div className="text-[10px] text-slate-400 font-medium">Data-Quality Filter</div>
              <div className="text-sm font-bold flex items-center justify-end gap-1.5 text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                15-Min Staleness Guard
              </div>
            </div>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-5 border-t border-slate-800">
          <button
            onClick={() => setActiveTab('sos_active')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'sos_active'
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            SOS & Active Response
            {activeEvent && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping ml-1" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'contacts'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Registered Contacts ({contacts.length})
          </button>

          <button
            onClick={() => setActiveTab('rules')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'rules'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            Health-Alert Rules ({rules.length})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Event & Delivery History ({eventHistory.length})
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* TAB 1: SOS & ACTIVE RESPONSE */}
      {/* ==================================================================== */}
      {activeTab === 'sos_active' && (
        <div className="space-y-6">
          {/* Active Emergency Banner if Active Event Exists */}
          {activeEvent && (
            <div className="bg-rose-950/40 border-2 border-rose-500 rounded-2xl p-6 relative overflow-hidden shadow-2xl animate-pulse">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <span className="p-3 bg-rose-500 text-white rounded-2xl shadow-lg">
                    <AlertTriangle className="w-8 h-8" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold tracking-wider text-rose-400">
                        {activeEvent.triggerType === 'MANUAL_SOS' ? 'Manual SOS Incident' : 'Automated Health Alert'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500 text-white font-mono uppercase">
                        Status: {activeEvent.status}
                      </span>
                    </div>
                    <h2 className="text-lg font-bold text-white mt-0.5">{activeEvent.title}</h2>
                    <p className="text-xs text-rose-200 mt-1 max-w-2xl">{activeEvent.reason}</p>
                    <div className="text-[11px] text-slate-400 font-mono mt-2">
                      Triggered: {new Date(activeEvent.triggeredAt).toLocaleString()} | ID: {activeEvent.id}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleLaunchAmbulanceDialer()}
                    className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Ambulance ({emergencyNumber})
                  </button>

                  <button
                    onClick={() => handleResolveEvent(activeEvent.id)}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </button>

                  <button
                    onClick={() => handleCancelEvent(activeEvent.id)}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel (False Alarm)
                  </button>
                </div>
              </div>

              {/* Delivery Status to Contacts for this event */}
              <div className="mt-4 pt-4 border-t border-rose-500/20">
                <div className="text-xs font-semibold text-rose-300 mb-2 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-rose-400 animate-spin" />
                  Dispatch Receipts to Designated Emergency Contacts:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {activeEvent.notificationsDispatched.map((receipt, idx) => (
                    <div key={idx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-slate-200">{receipt.contactName}</div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">{receipt.channel} relay</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        receipt.status === 'delivered'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : receipt.status === 'sent'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}>
                        {receipt.status.toUpperCase()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SOS Trigger Center Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1 & 2: Primary SOS Command Console */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <AlertOctagon className="w-5 h-5 text-rose-500" />
                    One-Tap Manual Emergency SOS
                  </h2>
                  <p className="text-xs text-slate-400">
                    Instantly notifies registered family, caregiver, and emergency contacts with verified telemetry.
                  </p>
                </div>

                <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  <span className="text-[11px] text-slate-300 font-medium">Emergency Number:</span>
                  <input
                    type="text"
                    value={emergencyNumber}
                    onChange={(e) => setEmergencyNumber(e.target.value)}
                    className="w-14 bg-slate-900 border border-slate-600 rounded px-1.5 py-0.5 text-center text-xs font-mono font-bold text-rose-400 focus:outline-none"
                    title="Change local emergency number (e.g. 911, 112, 999)"
                  />
                </div>
              </div>

              {/* Massive Central SOS Button */}
              <div className="flex flex-col items-center justify-center py-6 bg-slate-950/60 rounded-2xl border border-slate-800/80 relative">
                {sosCountdown !== null ? (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 rounded-full bg-rose-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl shadow-rose-600/50 animate-bounce">
                      {sosCountdown}
                    </div>
                    <div className="text-sm font-bold text-rose-400">
                      Transmitting SOS in {sosCountdown} seconds...
                    </div>
                    <div className="flex items-center gap-3 justify-center">
                      <button
                        onClick={handleCancelCountdown}
                        className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Abort SOS
                      </button>
                      <button
                        onClick={executeManualSos}
                        className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                      >
                        Send Immediately
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <button
                      onClick={handleStartSosCountdown}
                      disabled={isActivatingSos}
                      className="group relative w-36 h-36 rounded-full bg-gradient-to-br from-rose-500 to-red-700 hover:from-rose-600 hover:to-red-800 text-white flex flex-col items-center justify-center shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <span className="absolute inset-0 rounded-full border-4 border-rose-400/30 animate-ping pointer-events-none" />
                      <AlertTriangle className="w-10 h-10 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xl font-black tracking-wider">HOLD SOS</span>
                      <span className="text-[9px] uppercase tracking-widest text-rose-200">Tap to Initiate</span>
                    </button>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Activates 3-second safeguard countdown, then notifies all registered ICE contacts and launches 911 dialer.
                    </p>
                  </div>
                )}
              </div>

              {/* Location Sharing & Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="loc_consent"
                    checked={includeLocation}
                    onChange={(e) => setIncludeLocation(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-rose-600 focus:ring-0 bg-slate-800 border-slate-700"
                  />
                  <div>
                    <label htmlFor="loc_consent" className="text-xs font-bold text-white cursor-pointer flex items-center gap-1.5">
                      <Navigation className="w-3.5 h-3.5 text-rose-400" />
                      Attach GPS Coordinates
                    </label>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Queries real browser geolocation on SOS trigger. Requires explicit user consent.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                      Direct Ambulance Call
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Launches native device telephony for direct human dispatch verification.
                    </p>
                  </div>
                  <button
                    onClick={handleLaunchAmbulanceDialer}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Call {emergencyNumber}
                  </button>
                </div>
              </div>

              {dialerMessage && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-start gap-2">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{dialerMessage}</div>
                </div>
              )}
            </div>

            {/* Column 3: Live Telemetry & Data Quality Status */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                Live Telemetry Snapshot
              </h2>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Heart className="w-4 h-4 text-rose-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Heart Rate</div>
                      <div className="text-[10px] text-slate-500">Optical PPG continuous</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">{vitals.heartRate} bpm</div>
                    <div className={`text-[10px] ${vitals.heartRate > 120 || vitals.heartRate < 45 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {vitals.heartRate > 120 ? 'Tachycardia' : vitals.heartRate < 45 ? 'Bradycardia' : 'Normal Sinus'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-cyan-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Blood Oxygen (SpO2)</div>
                      <div className="text-[10px] text-slate-500">Red / IR optical ratio</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">{vitals.spO2}%</div>
                    <div className={`text-[10px] ${vitals.spO2 < 90 ? 'text-rose-400 font-bold' : 'text-emerald-400'}`}>
                      {vitals.spO2 < 90 ? 'Hypoxemia (<90%)' : 'Optimal Oxygenation'}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Wind className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="text-xs font-semibold text-slate-300">Atmospheric PM2.5</div>
                      <div className="text-[10px] text-slate-500">EPA Air Quality Index</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono">{environment.pm25} µg/m³</div>
                    <div className={`text-[10px] ${environment.pm25 > 35 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                      AQI {environment.aqi} ({environment.cautionLevel})
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Quality Verification Status Box */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    Data Quality Filter
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    evaluationResult?.dataQualityChecks.passed
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}>
                    {evaluationResult?.dataQualityChecks.passed ? 'PASSED' : 'FLAGGED'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Telemetry age: <strong>{evaluationResult?.dataQualityChecks.sensorAgeMinutes || 0} min</strong> (15-min staleness threshold).
                  Automated dispatches are blocked if sensor is detached or implausible values occur.
                </p>
                {evaluationResult && !evaluationResult.dataQualityChecks.passed && (
                  <div className="text-[11px] text-rose-400 font-medium">
                    Issue: {evaluationResult.dataQualityChecks.issues.join('; ')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 2: REGISTERED CONTACTS (ICE) */}
      {/* ==================================================================== */}
      {activeTab === 'contacts' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-emerald-400" />
                  In Case of Emergency (ICE) Contacts
                </h2>
                <p className="text-xs text-slate-400">
                  Designated family members, friends, and care team members notified during an emergency.
                </p>
              </div>

              <button
                onClick={() => {
                  resetContactForm();
                  setShowContactModal(true);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <UserPlus className="w-4 h-4" />
                Add Emergency Contact
              </button>
            </div>

            {/* Contacts Table / Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contacts.length === 0 ? (
                <div className="col-span-full p-8 text-center rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <Users className="w-10 h-10 text-slate-600 mx-auto" />
                  <h4 className="text-sm font-bold text-white">No emergency contacts registered.</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Add a contact to configure emergency notifications and ensure instant alerts during medical events.
                  </p>
                  <button
                    onClick={() => {
                      resetContactForm();
                      setShowContactModal(true);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add First Emergency Contact</span>
                  </button>
                </div>
              ) : (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className={`p-5 rounded-2xl bg-slate-950/60 border ${
                      contact.isPrimary ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5' : 'border-slate-800'
                    } space-y-3 relative`}
                  >
                    {contact.isPrimary && (
                      <span className="absolute top-4 right-4 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                        Primary Contact
                      </span>
                    )}

                    <div>
                      <h3 className="text-sm font-bold text-white">{contact.name}</h3>
                      <div className="text-xs text-slate-400 font-medium">{contact.relationship}</div>
                    </div>

                    {/* Phone with privacy masking toggle */}
                    <div className="flex items-center justify-between text-xs bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                      <span className="font-mono text-slate-300">{maskPhone(contact.phone, contact.id)}</span>
                      <button
                        onClick={() => togglePhoneMask(contact.id)}
                        className="text-slate-400 hover:text-white p-1"
                        title={revealedPhones[contact.id] ? 'Hide phone' : 'Show phone'}
                      >
                        {revealedPhones[contact.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    {contact.email && (
                      <div className="text-xs text-slate-400 truncate">
                        Email: <span className="text-slate-300">{contact.email}</span>
                      </div>
                    )}

                    {/* Channels */}
                    <div className="flex items-center gap-1.5 pt-1">
                      {contact.notificationPreferences.push && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">Push</span>
                      )}
                      {contact.notificationPreferences.sms && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">SMS</span>
                      )}
                      {contact.notificationPreferences.inApp && (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 border border-slate-700">In-App</span>
                      )}
                    </div>

                    {/* Consent Badge */}
                    <div className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Explicit Consent Verified
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                      <button
                        onClick={() => openEditContact(contact)}
                        className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-xs"
                        title="Edit Contact"
                      >
                        <Settings2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteContact(contact.id)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg text-xs"
                        title="Remove Contact"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 3: HEALTH-ALERT RULES */}
      {/* ==================================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-indigo-400" />
                Configurable Health-Alert Rules & Thresholds
              </h2>
              <p className="text-xs text-slate-400">
                Evidence-based alert triggers evaluated against real-time smartwatch PPG, accelerometer, and atmospheric telemetry.
              </p>
            </div>

            <div className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className={`p-4 rounded-2xl bg-slate-950/60 border ${
                    rule.isEnabled ? 'border-slate-800' : 'border-slate-800/40 opacity-60'
                  } flex flex-col md:flex-row md:items-center justify-between gap-4`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">{rule.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        rule.severity === 'critical' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {rule.severity}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Metric: <span className="font-mono text-slate-300">{rule.metric}</span> | Condition: <span className="font-mono text-slate-300">{rule.condition}</span> | Threshold: <span className="font-mono text-white font-bold">{rule.threshold}</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Required duration: {rule.durationSeconds}s | Data quality checks: {rule.rejectInvalidReadings ? 'Enabled (Rejects stale/artifacts)' : 'Disabled'}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Threshold:</span>
                      <input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => handleUpdateThreshold(rule, parseFloat(e.target.value) || 0)}
                        className="w-20 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono text-center"
                      />
                    </div>

                    <button
                      onClick={() => handleToggleRule(rule)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        rule.isEnabled
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {rule.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* TAB 4: EVENT & DELIVERY HISTORY */}
      {/* ==================================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                Emergency Incident & Notification Delivery History
              </h2>
              <p className="text-xs text-slate-400">
                Audited timeline of manual SOS triggers, automated alerts, contact deliveries, and responder acknowledgements.
              </p>
            </div>

            {eventHistory.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/40 rounded-2xl border border-slate-800">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2 opacity-80" />
                <h3 className="text-sm font-bold text-white">Zero Active Emergency Incidents</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                  No emergency alerts or SOS activations recorded in your telemetry ledger.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {eventHistory.map((event) => (
                  <div
                    key={event.id}
                    className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white">{event.title}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                            event.status === 'active'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : event.status === 'acknowledged'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{event.reason}</div>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono">
                        {new Date(event.triggeredAt).toLocaleString()}
                      </div>
                    </div>

                    {/* Vitals Snapshot at Trigger */}
                    <div className="flex flex-wrap gap-3 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      <span className="text-slate-400">
                        Heart Rate: <strong className="text-white font-mono">{event.vitalsSnapshot.heartRate || '--'} bpm</strong>
                      </span>
                      <span className="text-slate-400">
                        SpO2: <strong className="text-white font-mono">{event.vitalsSnapshot.spO2 || '--'}%</strong>
                      </span>
                      <span className="text-slate-400">
                        BP: <strong className="text-white font-mono">{event.vitalsSnapshot.bloodPressure || '--'}</strong>
                      </span>
                      <span className="text-slate-400">
                        PM2.5: <strong className="text-white font-mono">{event.environmentSnapshot.pm25 || '--'} µg/m³</strong>
                      </span>
                    </div>

                    {/* Notification Receipts */}
                    {event.notificationsDispatched.length > 0 && (
                      <div className="text-xs space-y-1">
                        <div className="text-slate-400 font-medium">Delivered Notifications:</div>
                        <div className="flex flex-wrap gap-2">
                          {event.notificationsDispatched.map((r, idx) => (
                            <span key={idx} className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 border border-slate-700 flex items-center gap-1.5">
                              <Check className="w-3 h-3 text-emerald-400" />
                              {r.contactName} ({r.channel}) — {r.status}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acknowledgement Records */}
                    {event.acknowledgements && event.acknowledgements.length > 0 && (
                      <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                        <strong>Acknowledged by:</strong> {event.acknowledgements.map((a) => `${a.acknowledgedBy} at ${new Date(a.acknowledgedAt).toLocaleTimeString()}${a.notes ? ` ("${a.notes}")` : ''}`).join(', ')}
                      </div>
                    )}

                    {/* Action buttons if active */}
                    {event.status === 'active' && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setSelectedEventForAck(event)}
                          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
                        >
                          Acknowledge Receipt
                        </button>
                        <button
                          onClick={() => handleResolveEvent(event.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs cursor-pointer"
                        >
                          Resolve Incident
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ADD / EDIT EMERGENCY CONTACT */}
      {/* ==================================================================== */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-400" />
              {editingContact ? 'Edit Emergency Contact' : 'Register Emergency Contact'}
            </h3>
            <p className="text-xs text-slate-400">
              Provide contact credentials and explicit consent for automated emergency notifications.
            </p>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="e.g. Sarah Vance"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Relationship</label>
                <select
                  value={contactRelation}
                  onChange={(e) => setContactRelation(e.target.value as EmergencyRelationship)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Child">Child</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Physician">Physician / Cardiologist</option>
                  <option value="Caregiver">Caregiver / Nurse</option>
                  <option value="Friend">Friend / Colleague</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email (Optional)</label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="sarah.vance@example.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-800">
                <div className="text-slate-300 font-semibold">Notification Channels:</div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={contactPush}
                      onChange={(e) => setContactPush(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-600"
                    />
                    Push
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={contactSms}
                      onChange={(e) => setContactSms(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-600"
                    />
                    SMS
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={contactInApp}
                      onChange={(e) => setContactInApp(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-emerald-600"
                    />
                    In-App
                  </label>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer text-slate-300 pt-1">
                <input
                  type="checkbox"
                  checked={contactIsPrimary}
                  onChange={(e) => setContactIsPrimary(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-emerald-600"
                />
                Designate as Primary Emergency Responder
              </label>

              {/* Explicit Legal Consent Checkbox */}
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <label className="flex items-start gap-2 cursor-pointer text-emerald-300 font-medium">
                  <input
                    type="checkbox"
                    required
                    checked={contactConsent}
                    onChange={(e) => setContactConsent(e.target.checked)}
                    className="mt-0.5 rounded bg-slate-950 border-emerald-500 text-emerald-600"
                  />
                  <span>
                    I confirm that this person has given explicit consent to be registered as an emergency contact and receive telemetry alerts.
                  </span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition-colors shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================================== */}
      {/* MODAL: ACKNOWLEDGE EMERGENCY EVENT */}
      {/* ==================================================================== */}
      {selectedEventForAck && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
              Acknowledge Emergency Alert
            </h3>
            <p className="text-xs text-slate-400">
              Confirm that you have received this alert and record responder action notes for clinical audit.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Acknowledged By (Responder Name):</label>
                <input
                  type="text"
                  value={ackResponderName}
                  onChange={(e) => setAckResponderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Action Notes / Status:</label>
                <textarea
                  rows={3}
                  value={ackNotes}
                  onChange={(e) => setAckNotes(e.target.value)}
                  placeholder="e.g. Spoke with patient on phone, administering inhaler, physician notified."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  onClick={() => setSelectedEventForAck(null)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcknowledgeEvent}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-amber-600/30 cursor-pointer"
                >
                  Confirm Acknowledgement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
