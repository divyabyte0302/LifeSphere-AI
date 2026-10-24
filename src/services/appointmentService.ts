import { db } from '../lib/firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import {
  Appointment,
  ReminderDeliveryLog,
  ReminderFrequency,
} from '../types';

const STORAGE_KEY = 'lifesphere_appointments_v1';
const LOGS_KEY = 'lifesphere_reminder_logs_v1';

// Seed appointments demonstrating active monthly checkup cycle
const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: 'appt-seed-1',
    userId: 'LS-8842',
    title: 'Monthly Pulmonology & Spirometry Review',
    description: 'Evaluate peak bronchial flow under autumn ragweed and review rescue albuterol usage.',
    doctorOrSpecialist: 'Dr. Jordan Vance, MD (Pulmonology)',
    category: 'pulmonology',
    scheduledDateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 30,
    status: 'scheduled',
    frequency: 'monthly',
    nextRecurrenceDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'St. Jude Respiratory & Preventive Clinic, Suite 402',
    isTelehealth: false,
    reminderPreferences: {
      leadTimeHours: 24,
      pushEnabled: true,
      emailEnabled: true,
      inAppEnabled: true,
    },
    notificationDeliveryStatus: 'scheduled',
    notes: 'Bring baseline peak flow meter logs and smart inhaler dose telemetry.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'appt-seed-2',
    userId: 'LS-8842',
    title: 'Monthly Cardiovascular & BP Follow-up',
    description: 'Check autonomic HRV stabilization against ambient high-AQI exposure days.',
    doctorOrSpecialist: 'Dr. Sarah Chen, MD (Preventive Cardiology)',
    category: 'cardiology',
    scheduledDateTime: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    status: 'scheduled',
    frequency: 'monthly',
    nextRecurrenceDate: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Telehealth Room 3B',
    isTelehealth: true,
    telehealthLink: 'https://telehealth.lifesphere.ai/room/cardio-vance-492',
    reminderPreferences: {
      leadTimeHours: 2,
      pushEnabled: true,
      emailEnabled: false,
      inAppEnabled: true,
    },
    notificationDeliveryStatus: 'scheduled',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'appt-seed-3',
    userId: 'LS-8842',
    title: 'Routine Comprehensive Metabolic Panel & CBC',
    description: 'Fasting lipid and liver panel for preventive longitudinal health charting.',
    doctorOrSpecialist: 'Quest Diagnostics Metro Lab',
    category: 'lab_work',
    scheduledDateTime: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 20,
    status: 'completed',
    frequency: 'quarterly',
    completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    location: 'Quest Diagnostics Midtown',
    isTelehealth: false,
    reminderPreferences: {
      leadTimeHours: 24,
      pushEnabled: true,
      emailEnabled: true,
      inAppEnabled: true,
    },
    notificationDeliveryStatus: 'delivered',
    deliveryTimestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'All markers optimal. Serum electrolytes normal.',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'appt-seed-4',
    userId: 'LS-8842',
    title: 'Annual Comprehensive Skin & Allergy Checkup',
    description: 'Dermatological and allergen scratch screening.',
    doctorOrSpecialist: 'Dr. Michael Rodriguez, MD',
    category: 'allergy_immunology',
    scheduledDateTime: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    durationMinutes: 45,
    status: 'missed',
    frequency: 'annual',
    location: 'Metro Allergy Center',
    isTelehealth: false,
    reminderPreferences: {
      leadTimeHours: 24,
      pushEnabled: true,
      emailEnabled: false,
      inAppEnabled: true,
    },
    notificationDeliveryStatus: 'delivered',
    deliveryTimestamp: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
    notes: 'Missed due to emergency hospital duty. Needs reschedule.',
    createdAt: new Date(Date.now() - 70 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const DEFAULT_LOGS: ReminderDeliveryLog[] = [
  {
    id: 'log-1',
    appointmentId: 'appt-seed-3',
    appointmentTitle: 'Routine Comprehensive Metabolic Panel & CBC',
    channel: 'browser_push',
    status: 'delivered',
    timestamp: new Date(Date.now() - 26 * 24 * 60 * 60 * 1000).toISOString(),
    leadTimeHours: 24,
  },
  {
    id: 'log-2',
    appointmentId: 'appt-seed-4',
    appointmentTitle: 'Annual Comprehensive Skin & Allergy Checkup',
    channel: 'in_app',
    status: 'delivered',
    timestamp: new Date(Date.now() - 41 * 24 * 60 * 60 * 1000).toISOString(),
    leadTimeHours: 24,
  },
];

export class AppointmentService {
  /**
   * Safely calculates the next recurrence date handling month-end bounds.
   */
  static calculateNextDate(dateStr: string, frequency: ReminderFrequency): string | undefined {
    if (frequency === 'once') return undefined;
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return undefined;

      const monthsToAdd = frequency === 'monthly' ? 1 : frequency === 'quarterly' ? 3 : 12;
      const targetMonth = d.getMonth() + monthsToAdd;
      const targetYear = d.getFullYear() + Math.floor(targetMonth / 12);
      const normalizedMonth = ((targetMonth % 12) + 12) % 12;

      // Handle leap year and short month bounds
      const daysInTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
      const targetDay = Math.min(d.getDate(), daysInTargetMonth);

      const nextDate = new Date(d);
      nextDate.setFullYear(targetYear);
      nextDate.setMonth(normalizedMonth);
      nextDate.setDate(targetDay);
      return nextDate.toISOString();
    } catch {
      return undefined;
    }
  }

  /**
   * Get all appointments for user.
   */
  static async getAppointments(userId: string): Promise<Appointment[]> {
    let list: Appointment[] = [];

    // Try Firestore first
    if (db) {
      try {
        const colRef = collection(db, 'users', userId, 'appointments');
        const snap = await getDocs(colRef);
        if (!snap.empty) {
          list = snap.docs.map((d) => d.data() as Appointment);
        }
      } catch (err) {
        console.warn('Firestore getAppointments fallback to local storage:', err);
      }
    }

    if (list.length === 0) {
      const raw = localStorage.getItem(`${STORAGE_KEY}_${userId}`);
      if (raw) {
        try {
          list = JSON.parse(raw);
        } catch {
          list = [];
        }
      }
    }

    if (list.length === 0) {
      list = DEFAULT_APPOINTMENTS.map((a) => ({ ...a, userId }));
      localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(list));
    }

    // Sort upcoming first, chronologically
    return list.sort(
      (a, b) => new Date(a.scheduledDateTime).getTime() - new Date(b.scheduledDateTime).getTime()
    );
  }

  /**
   * Create a new appointment with recurrence calculation.
   */
  static async createAppointment(
    userId: string,
    data: Omit<Appointment, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'notificationDeliveryStatus' | 'status'>
  ): Promise<Appointment> {
    const id = `appt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();
    const nextRecurrence = this.calculateNextDate(data.scheduledDateTime, data.frequency);

    const newAppt: Appointment = {
      ...data,
      id,
      userId,
      status: 'scheduled',
      nextRecurrenceDate: nextRecurrence,
      notificationDeliveryStatus: 'scheduled',
      createdAt: now,
      updatedAt: now,
    };

    // Save to Firestore
    if (db) {
      try {
        await setDoc(doc(db, 'users', userId, 'appointments', id), newAppt);
      } catch (err) {
        console.warn('Firestore setDoc appointment failed, saving locally:', err);
      }
    }

    // Save locally
    const existing = await this.getAppointments(userId);
    const updated = [newAppt, ...existing];
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updated));

    return newAppt;
  }

  /**
   * Update an existing appointment.
   */
  static async updateAppointment(
    userId: string,
    id: string,
    updates: Partial<Appointment>
  ): Promise<Appointment | null> {
    const existing = await this.getAppointments(userId);
    const index = existing.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updatedAppt: Appointment = {
      ...existing[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    if (updates.scheduledDateTime || updates.frequency) {
      updatedAppt.nextRecurrenceDate = this.calculateNextDate(
        updatedAppt.scheduledDateTime,
        updatedAppt.frequency
      );
    }

    if (db) {
      try {
        await updateDoc(doc(db, 'users', userId, 'appointments', id), updatedAppt as any);
      } catch (err) {
        console.warn('Firestore updateDoc appointment failed:', err);
      }
    }

    existing[index] = updatedAppt;
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(existing));
    return updatedAppt;
  }

  /**
   * Delete an appointment after explicit confirmation.
   */
  static async deleteAppointment(userId: string, id: string): Promise<boolean> {
    const existing = await this.getAppointments(userId);
    const target = existing.find((a) => a.id === id);
    if (!target) return false;

    if (db) {
      try {
        await deleteDoc(doc(db, 'users', userId, 'appointments', id));
      } catch (err) {
        console.warn('Firestore deleteDoc appointment failed:', err);
      }
    }

    const filtered = existing.filter((a) => a.id !== id);
    localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(filtered));
    return true;
  }

  /**
   * Mark checkup completed idempotently and automatically provision exactly one next recurring cycle.
   */
  static async completeAppointment(
    userId: string,
    id: string,
    consultationNotes?: string
  ): Promise<{ completed: Appointment; nextAppt?: Appointment }> {
    const existing = await this.getAppointments(userId);
    const target = existing.find((a) => a.id === id);
    if (!target) throw new Error('Appointment not found');

    // 1. Idempotency Guard: If already completed, do NOT duplicate recurrence
    if (target.status === 'completed') {
      const existingNext = existing.find(
        (a) => a.parentAppointmentId === target.id || (a.title === target.title && a.status === 'scheduled')
      );
      return { completed: target, nextAppt: existingNext };
    }

    const now = new Date().toISOString();
    const updatedNotes = consultationNotes
      ? `${target.notes ? `${target.notes}\n` : ''}[Physician Consultation Note]: ${consultationNotes}`
      : target.notes;

    const completed = await this.updateAppointment(userId, id, {
      status: 'completed',
      completedAt: now,
      notes: updatedNotes,
    });

    let nextAppt: Appointment | undefined;

    // 2. If recurring, provision exactly one next checkup cycle using deterministic ID
    if (target.frequency !== 'once') {
      const nextDate = target.nextRecurrenceDate || this.calculateNextDate(target.scheduledDateTime, target.frequency);
      if (nextDate) {
        const deterministicId = `appt_rec_${target.id}_${nextDate.substring(0, 10).replace(/-/g, '')}`;

        // Check if duplicate exists by deterministic ID or parent lineage
        const isDuplicate = existing.some(
          (a) =>
            a.id === deterministicId ||
            a.parentAppointmentId === target.id ||
            (a.title === target.title && a.status === 'scheduled' && Math.abs(new Date(a.scheduledDateTime).getTime() - new Date(nextDate).getTime()) < 24 * 60 * 60 * 1000)
        );

        if (!isDuplicate) {
          const nextCycle = (target.recurrenceCycle || 1) + 1;
          const newAppt: Appointment = {
            id: deterministicId,
            userId,
            title: target.title,
            description: `Monthly recurring checkup scheduled following completion on ${new Date().toLocaleDateString()}`,
            doctorOrSpecialist: target.doctorOrSpecialist,
            category: target.category,
            scheduledDateTime: nextDate,
            durationMinutes: target.durationMinutes,
            status: 'scheduled',
            frequency: target.frequency,
            nextRecurrenceDate: this.calculateNextDate(nextDate, target.frequency),
            parentAppointmentId: target.id,
            recurrenceCycle: nextCycle,
            location: target.location,
            isTelehealth: target.isTelehealth,
            telehealthLink: target.telehealthLink,
            reminderPreferences: target.reminderPreferences,
            notificationDeliveryStatus: 'scheduled',
            notes: `Auto-recurrence (Cycle ${nextCycle}) from checkup: ${target.title}`,
            createdAt: now,
            updatedAt: now,
          };

          if (db) {
            try {
              await setDoc(doc(db, 'users', userId, 'appointments', deterministicId), newAppt);
            } catch (err) {
              console.warn('Firestore setDoc recurring appointment failed:', err);
            }
          }

          const currentList = await this.getAppointments(userId);
          const updatedList = [newAppt, ...currentList];
          localStorage.setItem(`${STORAGE_KEY}_${userId}`, JSON.stringify(updatedList));
          nextAppt = newAppt;
        }
      }
    }

    return { completed: completed || target, nextAppt };
  }

  /**
   * Deliver browser notification and track delivery confirmation with duplicate prevention.
   */
  static async deliverNotification(
    appointment: Appointment,
    channel: 'browser_push' | 'in_app' = 'browser_push',
    forceTest: boolean = false
  ): Promise<ReminderDeliveryLog> {
    // 1. Duplicate Prevention: Do not re-deliver already confirmed notification unless force testing
    if (appointment.notificationDeliveryStatus === 'delivered' && !forceTest) {
      return {
        id: `log_dup_${Date.now()}`,
        appointmentId: appointment.id,
        appointmentTitle: appointment.title,
        channel,
        status: 'failed',
        failureReason: 'DUPLICATE_DELIVERY_PREVENTED: Reminder already delivered',
        timestamp: appointment.deliveryTimestamp || new Date().toISOString(),
        leadTimeHours: appointment.reminderPreferences.leadTimeHours,
      };
    }

    let deliveryStatus: 'delivered' | 'failed' = 'failed';
    let failureReason: string | undefined;

    // 2. Permission and Platform Verification
    if (channel === 'browser_push') {
      if (typeof window === 'undefined' || !('Notification' in window)) {
        deliveryStatus = 'failed';
        failureReason = 'BROWSER_UNSUPPORTED_NO_NOTIFICATION_API';
      } else if (Notification.permission === 'denied') {
        deliveryStatus = 'failed';
        failureReason = 'NOTIFICATION_PERMISSION_DENIED_BY_USER';
      } else {
        try {
          let currentPerm: NotificationPermission = Notification.permission;
          if (currentPerm === 'default') {
            currentPerm = await Notification.requestPermission();
          }

          if (currentPerm === 'granted') {
            new Notification(`LifeSphere Checkup Reminder: ${appointment.title}`, {
              body: `Scheduled for ${new Date(appointment.scheduledDateTime).toLocaleString()} with ${appointment.doctorOrSpecialist}.`,
              icon: '/vite.svg',
            });
            deliveryStatus = 'delivered';
          } else {
            deliveryStatus = 'failed';
            failureReason = 'NOTIFICATION_PERMISSION_NOT_GRANTED';
          }
        } catch (err) {
          deliveryStatus = 'failed';
          failureReason = err instanceof Error ? err.message : 'DELIVERY_DISPATCH_EXCEPTION';
        }
      }
    } else {
      deliveryStatus = 'delivered';
    }

    const log: ReminderDeliveryLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      appointmentId: appointment.id,
      appointmentTitle: appointment.title,
      channel,
      status: deliveryStatus,
      failureReason,
      timestamp: new Date().toISOString(),
      leadTimeHours: appointment.reminderPreferences.leadTimeHours,
    };

    // Record delivery log
    this.saveDeliveryLog(appointment.userId, log);

    // Update appointment delivery status
    await this.updateAppointment(appointment.userId, appointment.id, {
      notificationDeliveryStatus: deliveryStatus,
      deliveryTimestamp: deliveryStatus === 'delivered' ? log.timestamp : undefined,
    });

    return log;
  }

  /**
   * Save a delivery log record.
   */
  static saveDeliveryLog(userId: string, log: ReminderDeliveryLog): void {
    const raw = localStorage.getItem(`${LOGS_KEY}_${userId}`);
    let logs: ReminderDeliveryLog[] = raw ? JSON.parse(raw) : DEFAULT_LOGS;
    logs = [log, ...logs.slice(0, 49)];
    localStorage.setItem(`${LOGS_KEY}_${userId}`, JSON.stringify(logs));
  }

  /**
   * Retrieve reminder delivery history logs.
   */
  static getDeliveryLogs(userId: string): ReminderDeliveryLog[] {
    const raw = localStorage.getItem(`${LOGS_KEY}_${userId}`);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return DEFAULT_LOGS;
      }
    }
    localStorage.setItem(`${LOGS_KEY}_${userId}`, JSON.stringify(DEFAULT_LOGS));
    return DEFAULT_LOGS;
  }

  /**
   * Scan pending scheduled appointments and deliver lead time reminders.
   */
  static async processPendingReminders(userId: string): Promise<ReminderDeliveryLog[]> {
    const appointments = await this.getAppointments(userId);
    const now = Date.now();
    const deliveredLogs: ReminderDeliveryLog[] = [];

    for (const appt of appointments) {
      if (appt.status === 'scheduled' && appt.notificationDeliveryStatus === 'scheduled') {
        const apptTime = new Date(appt.scheduledDateTime).getTime();
        const leadMs = appt.reminderPreferences.leadTimeHours * 60 * 60 * 1000;
        const timeUntilAppt = apptTime - now;

        // If within lead time window or overdue by less than 1 hour
        if (timeUntilAppt <= leadMs && timeUntilAppt > -60 * 60 * 1000) {
          const log = await this.deliverNotification(
            appt,
            appt.reminderPreferences.pushEnabled ? 'browser_push' : 'in_app'
          );
          deliveredLogs.push(log);
        } else if (timeUntilAppt < -60 * 60 * 1000) {
          // Flag past appointment as missed if not marked completed
          await this.updateAppointment(userId, appt.id, { status: 'missed' });
        }
      }
    }

    return deliveredLogs;
  }
}

export const appointmentService = AppointmentService;
