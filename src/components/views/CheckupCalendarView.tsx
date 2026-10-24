import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Bell,
  Stethoscope,
  Video,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Trash2,
  Edit3,
  ExternalLink,
  ShieldCheck,
  Check,
  X,
  Send,
  AlertCircle
} from 'lucide-react';
import { Appointment, AppointmentCategory, ReminderFrequency, ReminderDeliveryLog } from '../../types';
import { AppointmentService } from '../../services/appointmentService';

interface CheckupCalendarViewProps {
  userId?: string;
  isMobile?: boolean;
  onNavigateToCheckupChat?: () => void;
  showSnackbar?: (msg: string) => void;
}

export const CheckupCalendarView: React.FC<CheckupCalendarViewProps> = ({
  userId = 'LS-8842',
  isMobile = false,
  onNavigateToCheckupChat,
  showSnackbar = () => {},
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [deliveryLogs, setDeliveryLogs] = useState<ReminderDeliveryLog[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<'all' | 'scheduled' | 'monthly' | 'completed' | 'missed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [completingAppointment, setCompletingAppointment] = useState<Appointment | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<Appointment | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [pushPermissionStatus, setPushPermissionStatus] = useState<string>('default');

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDoctor, setFormDoctor] = useState('');
  const [formCategory, setFormCategory] = useState<AppointmentCategory>('routine_checkup');
  const [formDateTime, setFormDateTime] = useState('');
  const [formDuration, setFormDuration] = useState(30);
  const [formFrequency, setFormFrequency] = useState<ReminderFrequency>('monthly');
  const [formLocation, setFormLocation] = useState('St. Jude Respiratory & Preventive Clinic');
  const [formIsTelehealth, setFormIsTelehealth] = useState(false);
  const [formTelehealthLink, setFormTelehealthLink] = useState('');
  const [formLeadHours, setFormLeadHours] = useState(24);
  const [formPushEnabled, setFormPushEnabled] = useState(true);
  const [formNotes, setFormNotes] = useState('');

  // Load appointments and delivery logs
  const refreshData = async () => {
    const list = await AppointmentService.getAppointments(userId);
    setAppointments(list);
    const logs = AppointmentService.getDeliveryLogs(userId);
    setDeliveryLogs(logs);

    // Process pending reminders automatically
    await AppointmentService.processPendingReminders(userId);
  };

  useEffect(() => {
    refreshData();
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPushPermissionStatus(Notification.permission);
    }
  }, [userId]);

  const handleTestBrowserNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      showSnackbar('Browser Web Notifications API is not supported in this environment.');
      return;
    }

    try {
      let perm = Notification.permission;
      if (perm === 'default') {
        perm = await Notification.requestPermission();
        setPushPermissionStatus(perm);
      }

      if (perm === 'granted') {
        new Notification('LifeSphere AI-X • Verified Checkup Reminder', {
          body: 'Your monthly pulmonary spirometry review is confirmed. Ambient AQI is currently favorable (48 AQI).',
          icon: '/vite.svg',
        });
        showSnackbar('Push notification delivered successfully to your device.');
      } else {
        showSnackbar('Notification permission was blocked in browser settings.');
      }
    } catch (e) {
      showSnackbar('Notification request encountered an error.');
    }
  };

  // Open Schedule Modal for creation
  const handleOpenSchedule = () => {
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setHours(10, 0, 0, 0);

    setFormTitle('Monthly Preventive Pulmonology Checkup');
    setFormDoctor('Dr. Jordan Vance, MD');
    setFormCategory('pulmonology');
    setFormDateTime(defaultDate.toISOString().slice(0, 16));
    setFormDuration(30);
    setFormFrequency('monthly');
    setFormLocation('St. Jude Respiratory & Preventive Clinic, Suite 402');
    setFormIsTelehealth(false);
    setFormTelehealthLink('');
    setFormLeadHours(24);
    setFormPushEnabled(true);
    setFormNotes('Bring smart inhaler telemetry logs and blood pressure cuffs.');
    setEditingAppointment(null);
    setIsScheduleModalOpen(true);
  };

  // Open Schedule Modal for editing
  const handleOpenEdit = (appt: Appointment) => {
    setEditingAppointment(appt);
    setFormTitle(appt.title);
    setFormDoctor(appt.doctorOrSpecialist);
    setFormCategory(appt.category);
    setFormDateTime(new Date(appt.scheduledDateTime).toISOString().slice(0, 16));
    setFormDuration(appt.durationMinutes);
    setFormFrequency(appt.frequency);
    setFormLocation(appt.location || '');
    setFormIsTelehealth(appt.isTelehealth);
    setFormTelehealthLink(appt.telehealthLink || '');
    setFormLeadHours(appt.reminderPreferences.leadTimeHours);
    setFormPushEnabled(appt.reminderPreferences.pushEnabled);
    setFormNotes(appt.notes || '');
    setIsScheduleModalOpen(true);
  };

  // Save creation or edit
  const handleSaveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDoctor.trim() || !formDateTime) {
      showSnackbar('Please complete all required fields.');
      return;
    }

    const scheduledIso = new Date(formDateTime).toISOString();

    if (editingAppointment) {
      await AppointmentService.updateAppointment(userId, editingAppointment.id, {
        title: formTitle,
        doctorOrSpecialist: formDoctor,
        category: formCategory,
        scheduledDateTime: scheduledIso,
        durationMinutes: Number(formDuration),
        frequency: formFrequency,
        location: formLocation,
        isTelehealth: formIsTelehealth,
        telehealthLink: formTelehealthLink,
        reminderPreferences: {
          leadTimeHours: Number(formLeadHours),
          pushEnabled: formPushEnabled,
          emailEnabled: true,
          inAppEnabled: true,
        },
        notes: formNotes,
      });
      showSnackbar(`Updated checkup "${formTitle}".`);
    } else {
      await AppointmentService.createAppointment(userId, {
        title: formTitle,
        doctorOrSpecialist: formDoctor,
        category: formCategory,
        scheduledDateTime: scheduledIso,
        durationMinutes: Number(formDuration),
        frequency: formFrequency,
        location: formLocation,
        isTelehealth: formIsTelehealth,
        telehealthLink: formTelehealthLink,
        reminderPreferences: {
          leadTimeHours: Number(formLeadHours),
          pushEnabled: formPushEnabled,
          emailEnabled: true,
          inAppEnabled: true,
        },
        notes: formNotes,
      });
      showSnackbar(`Scheduled ${formFrequency} checkup "${formTitle}".`);
    }

    setIsScheduleModalOpen(false);
    refreshData();
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!deletingAppointment) return;
    await AppointmentService.deleteAppointment(userId, deletingAppointment.id);
    showSnackbar(`Cancelled checkup "${deletingAppointment.title}".`);
    setDeletingAppointment(null);
    refreshData();
  };

  // Confirm completion
  const handleConfirmComplete = async () => {
    if (!completingAppointment) return;
    const res = await AppointmentService.completeAppointment(
      userId,
      completingAppointment.id,
      completionNotes
    );
    if (res.nextAppt) {
      showSnackbar(
        `Checkup completed! Next monthly checkup scheduled for ${new Date(res.nextAppt.scheduledDateTime).toLocaleDateString()}.`
      );
    } else {
      showSnackbar('Checkup marked as completed.');
    }
    setCompletingAppointment(null);
    setCompletionNotes('');
    refreshData();
  };

  // Filtered Appointments
  const filteredAppointments = appointments.filter((appt) => {
    // Status filter
    if (statusFilter === 'scheduled' && appt.status !== 'scheduled') return false;
    if (statusFilter === 'completed' && appt.status !== 'completed') return false;
    if (statusFilter === 'missed' && appt.status !== 'missed') return false;
    if (statusFilter === 'monthly' && appt.frequency !== 'monthly') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = appt.title.toLowerCase().includes(q);
      const matchDoctor = appt.doctorOrSpecialist.toLowerCase().includes(q);
      const matchCat = appt.category.toLowerCase().includes(q);
      if (!matchTitle && !matchDoctor && !matchCat) return false;
    }

    return true;
  });

  // Calendar calculations
  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonthDays = new Date(year, month, 0).getDate();
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Calendar cells
  const calendarCells = [];
  // Prefix blanks from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarCells.push({
      day: prevMonthDays - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, prevMonthDays - i),
    });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: true,
      date: new Date(year, month, d),
    });
  }
  // Suffix blanks for complete rows
  const remainingCells = 42 - calendarCells.length;
  for (let d = 1; d <= remainingCells && calendarCells.length % 7 !== 0; d++) {
    calendarCells.push({
      day: d,
      isCurrentMonth: false,
      date: new Date(year, month + 1, d),
    });
  }

  // Get appointments for a specific date
  const getApptsForDate = (date: Date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    return appointments.filter((a) => {
      const ad = new Date(a.scheduledDateTime);
      return ad.getFullYear() === y && ad.getMonth() === m && ad.getDate() === d;
    });
  };

  const selectedDateAppts = getApptsForDate(selectedDate);

  // Timezone display
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <div className={`p-4 ${isMobile ? 'space-y-4' : 'p-6 space-y-6 max-w-7xl mx-auto'}`}>
      
      {/* Top Header & Quick Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Monthly Health Checkup Reminders</h2>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Phase 6 Ready
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated recurring checkup scheduling, browser push alerts & duplicate-safe recurrence
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleTestBrowserNotification}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Verify real browser push notification delivery"
          >
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Test Push Reminder</span>
            <span className={`w-2 h-2 rounded-full ${pushPermissionStatus === 'granted' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
          </button>

          <button
            onClick={handleOpenSchedule}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Checkup</span>
          </button>
        </div>
      </div>

      {/* Recurrence Status & System Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Upcoming Checkups</span>
            <p className="text-xl font-bold text-white mt-1">
              {appointments.filter((a) => a.status === 'scheduled').length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Monthly Recurring</span>
            <p className="text-xl font-bold text-cyan-400 mt-1">
              {appointments.filter((a) => a.frequency === 'monthly' && a.status === 'scheduled').length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-500/10 text-cyan-400">
            <RotateCcw className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Completed Cycles</span>
            <p className="text-xl font-bold text-emerald-400 mt-1">
              {appointments.filter((a) => a.status === 'completed').length}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">Timezone & Delivery</span>
            <p className="text-xs font-mono text-slate-300 mt-1 truncate" title={userTimezone}>
              {userTimezone}
            </p>
          </div>
          <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Interactive Calendar + Selected Day Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Calendar Grid (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {monthNames[calendarMonth.getMonth()]} {calendarMonth.getFullYear()}
              </h3>
              <button
                onClick={() => {
                  const now = new Date();
                  setCalendarMonth(now);
                  setSelectedDate(now);
                }}
                className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              >
                Today
              </button>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                aria-label="Previous Month"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                aria-label="Next Month"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400 uppercase tracking-wider py-1 border-b border-slate-800">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Cells */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              const cellAppts = getApptsForDate(cell.date);
              const isToday =
                cell.date.toDateString() === new Date().toDateString();
              const isSelected =
                cell.date.toDateString() === selectedDate.toDateString();

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDate(cell.date)}
                  className={`min-h-[64px] p-1.5 rounded-xl border flex flex-col justify-between cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-950/60 border-blue-500 shadow-md shadow-blue-500/20'
                      : isToday
                      ? 'bg-slate-800/80 border-slate-600'
                      : cell.isCurrentMonth
                      ? 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/50'
                      : 'bg-slate-950/20 border-slate-900/60 opacity-40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-[11px]'
                          : isSelected
                          ? 'text-blue-400 font-bold'
                          : cell.isCurrentMonth
                          ? 'text-slate-200'
                          : 'text-slate-500'
                      }`}
                    >
                      {cell.day}
                    </span>
                    {cellAppts.length > 0 && (
                      <span className="text-[10px] font-bold font-mono px-1 rounded bg-blue-500/20 text-blue-300">
                        {cellAppts.length}
                      </span>
                    )}
                  </div>

                  {/* Dot Markers */}
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {cellAppts.slice(0, 3).map((a, i) => (
                      <span
                        key={i}
                        className={`w-2 h-2 rounded-full ${
                          a.status === 'completed'
                            ? 'bg-emerald-400'
                            : a.status === 'missed'
                            ? 'bg-rose-500'
                            : a.frequency === 'monthly'
                            ? 'bg-cyan-400 animate-pulse'
                            : 'bg-blue-400'
                        }`}
                        title={`${a.title} (${a.status})`}
                      />
                    ))}
                    {cellAppts.length > 3 && (
                      <span className="text-[9px] text-slate-400 font-bold">+</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800">
            <span className="font-semibold">Legend:</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Monthly Recurring</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span> Scheduled</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span> Completed</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Missed</span>
            </div>
          </div>
        </div>

        {/* Right Column: Selected Date Agenda & Next Monthly Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Day Agenda:</span>
                  <span className="text-blue-400">{selectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {selectedDateAppts.length} {selectedDateAppts.length === 1 ? 'checkup' : 'checkups'} scheduled for this date
                </p>
              </div>

              <button
                onClick={handleOpenSchedule}
                className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
                title="Add Checkup on this Date"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {selectedDateAppts.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CalendarIcon className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400">No appointments scheduled for this day.</p>
                <button
                  onClick={handleOpenSchedule}
                  className="text-xs text-blue-400 hover:text-blue-300 font-bold inline-flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Schedule checkup
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateAppts.map((appt) => (
                  <div
                    key={appt.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                            appt.status === 'completed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : appt.status === 'missed'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                          }`}>
                            {appt.status}
                          </span>
                          {appt.frequency === 'monthly' && (
                            <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-1">
                              <RotateCcw className="w-3 h-3" /> Monthly Recurrence
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">{appt.title}</h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(appt)}
                          className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                          title="Edit checkup"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAppointment(appt)}
                          className="p-1 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Cancel checkup"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div className="flex items-center gap-2 text-slate-400">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{appt.doctorOrSpecialist}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{new Date(appt.scheduledDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appt.durationMinutes} min)</span>
                      </div>
                      {appt.isTelehealth ? (
                        <div className="flex items-center gap-2 text-purple-400">
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">Telehealth Consultation</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{appt.location || 'Clinic'}</span>
                        </div>
                      )}
                    </div>

                    {appt.status === 'scheduled' && (
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">
                          Reminder: {appt.reminderPreferences.leadTimeHours}h before
                        </span>
                        <button
                          onClick={() => setCompletingAppointment(appt)}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Mark Completed</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reminder Delivery Confirmation Feed */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-400" /> Reminder Delivery Confirmation Log
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Real-Time Sync</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {deliveryLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="space-y-0.5 truncate pr-2">
                    <p className="font-semibold text-slate-200 truncate">{log.appointmentTitle}</p>
                    <span className="text-[10px] text-slate-400">
                      Channel: {log.channel} • {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                    log.status === 'delivered'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {log.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Appointments Table & Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Full Checkup Records & History</h3>
            <p className="text-xs text-slate-400">View upcoming, recurring, and past monthly clinical checkups</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 w-48"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'scheduled', 'monthly', 'completed', 'missed'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1 rounded-lg font-semibold capitalize transition-colors ${
                    statusFilter === tab
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab === 'monthly' ? 'Monthly Recur' : tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Checkup Title</th>
                <th className="py-3 px-3">Physician / Clinic</th>
                <th className="py-3 px-3">Scheduled Date & Time</th>
                <th className="py-3 px-3">Recurrence</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Notification Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white">
                      <div>
                        <span>{appt.title}</span>
                        {appt.notes && (
                          <p className="text-[11px] text-slate-400 truncate max-w-xs">{appt.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate">{appt.doctorOrSpecialist}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {new Date(appt.scheduledDateTime).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        appt.frequency === 'monthly'
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {appt.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                        appt.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : appt.status === 'missed'
                          ? 'bg-rose-500/20 text-rose-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {appt.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${
                          appt.notificationDeliveryStatus === 'delivered'
                            ? 'bg-emerald-400'
                            : 'bg-amber-400'
                        }`} />
                        <span className="capitalize text-slate-300">{appt.notificationDeliveryStatus}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {appt.status === 'scheduled' && (
                          <button
                            onClick={() => setCompletingAppointment(appt)}
                            className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 rounded-lg text-[11px] font-bold transition-colors"
                          >
                            Complete
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(appt)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingAppointment(appt)}
                          className="p-1.5 bg-slate-800 hover:bg-rose-900/40 text-rose-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* SCHEDULE / EDIT MODAL */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">
                  {editingAppointment ? 'Edit Checkup Appointment' : 'Schedule Health Checkup'}
                </h3>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAppointment} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Appointment Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Monthly Spirometry & Bronchial Review"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Physician / Specialist *
                  </label>
                  <input
                    type="text"
                    required
                    value={formDoctor}
                    onChange={(e) => setFormDoctor(e.target.value)}
                    placeholder="e.g. Dr. Jordan Vance, MD"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as AppointmentCategory)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="routine_checkup">Routine Checkup</option>
                    <option value="pulmonology">Pulmonology & Respiratory</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="allergy_immunology">Allergy & Immunology</option>
                    <option value="annual_physical">Annual Physical</option>
                    <option value="lab_work">Lab Work & Blood Panel</option>
                    <option value="telehealth">Telehealth</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Scheduled Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formDateTime}
                    onChange={(e) => setFormDateTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Recurrence Selection */}
              <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-500/20 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-blue-300 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" /> Recurring Checkup Frequency
                  </label>
                  <span className="text-[10px] text-cyan-400 font-semibold">Recommended for Preventive Care</span>
                </div>
                <select
                  value={formFrequency}
                  onChange={(e) => setFormFrequency(e.target.value as ReminderFrequency)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="monthly">Monthly Checkup (Every 30 days automatically)</option>
                  <option value="quarterly">Quarterly Checkup (Every 3 months)</option>
                  <option value="annual">Annual Checkup (Once a year)</option>
                  <option value="once">Once (Single occurrence)</option>
                </select>
                <p className="text-[11px] text-slate-400">
                  When a recurring checkup is completed, LifeSphere automatically provisions the next monthly cycle while preventing duplicate appointments.
                </p>
              </div>

              {/* Reminder Preferences */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <label className="block text-xs font-bold text-slate-300">
                  Reminder Preferences
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400">Advance Notice</label>
                    <select
                      value={formLeadHours}
                      onChange={(e) => setFormLeadHours(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value={1}>1 hour before</option>
                      <option value={2}>2 hours before</option>
                      <option value={24}>24 hours before (1 day)</option>
                      <option value={48}>48 hours before (2 days)</option>
                      <option value={168}>1 week before</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input
                      type="checkbox"
                      id="pushEnabled"
                      checked={formPushEnabled}
                      onChange={(e) => setFormPushEnabled(e.target.checked)}
                      className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                    />
                    <label htmlFor="pushEnabled" className="text-xs text-slate-300">
                      Browser Push Alert
                    </label>
                  </div>
                </div>
              </div>

              {/* Location or Telehealth */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isTelehealth"
                    checked={formIsTelehealth}
                    onChange={(e) => setFormIsTelehealth(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-0"
                  />
                  <label htmlFor="isTelehealth" className="text-xs text-slate-300">
                    This is a Virtual Telehealth Consultation
                  </label>
                </div>

                {formIsTelehealth ? (
                  <input
                    type="url"
                    value={formTelehealthLink}
                    onChange={(e) => setFormTelehealthLink(e.target.value)}
                    placeholder="https://telehealth.lifesphere.ai/room/..."
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                ) : (
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Clinic address or hospital wing"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Preparation Notes
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Fasting instructions, inhaler usage notes, lab requests..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  {editingAppointment ? 'Save Changes' : 'Schedule Checkup'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COMPLETE CHECKUP MODAL */}
      {completingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Complete Health Checkup</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Marking <strong className="text-white">"{completingAppointment.title}"</strong> as completed.
              {completingAppointment.frequency === 'monthly' && (
                <span className="block mt-2 text-cyan-400 font-medium">
                  • Because this is configured with a Monthly Recurrence, LifeSphere will automatically schedule the next checkup for next month and start the new reminder countdown.
                </span>
              )}
            </p>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Consultation Outcome Notes (Optional)
              </label>
              <textarea
                rows={3}
                value={completionNotes}
                onChange={(e) => setCompletionNotes(e.target.value)}
                placeholder="Physician feedback, adjusted inhaler dosage, follow-up recommendations..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setCompletingAppointment(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmComplete}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-emerald-600/30"
              >
                Confirm Completion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL / DELETE CONFIRMATION MODAL */}
      {deletingAppointment && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Cancel Appointment?</h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete or cancel the checkup appointment{' '}
              <strong className="text-white">"{deletingAppointment.title}"</strong>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingAppointment(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
              >
                Keep Appointment
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-rose-600/30"
              >
                Yes, Delete Checkup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
