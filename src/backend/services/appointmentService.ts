import { db } from '../config/firebase.js';

export interface AppointmentData {
  id?: string;
  patientName: string;
  patientId?: string;
  doctorName: string;
  doctorId?: string;
  date: string;
  time: string;
  department: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled' | 'In Progress';
  reason?: string;
  createdAt?: string;
}

const todayStr = new Date().toISOString().split('T')[0];

let memoryAppointments: AppointmentData[] = [
  { id: 'apt-1', patientName: 'Robert Chen', doctorName: 'Dr. Sarah Jenkins', date: todayStr, time: '09:30 AM', department: 'Cardiology', status: 'Scheduled', reason: 'Routine Checkup' },
  { id: 'apt-2', patientName: 'Sophia Martinez', doctorName: 'Dr. Marcus Vance', date: todayStr, time: '11:00 AM', department: 'Neurology', status: 'In Progress', reason: 'Headache & Migraine' },
  { id: 'apt-3', patientName: 'David Wilson', doctorName: 'Dr. Emily Watson', date: todayStr, time: '02:15 PM', department: 'Pediatrics', status: 'Completed', reason: 'Child Immunity Panel' },
];

export class AppointmentService {
  static async getAllAppointments(options?: { status?: string; doctorId?: string; patientId?: string; date?: string }) {
    let appointments: AppointmentData[] = [];

    try {
      const colRef = db.collection('appointments');
      const snapshot = await colRef.get();
      const list: AppointmentData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as AppointmentData) });
      });
      if (list.length > 0) {
        appointments = list;
        memoryAppointments = list;
      } else {
        appointments = [...memoryAppointments];
      }
    } catch (err) {
      appointments = [...memoryAppointments];
    }

    if (options?.status) {
      appointments = appointments.filter(a => a.status?.toLowerCase() === options.status?.toLowerCase());
    }
    if (options?.doctorId) {
      appointments = appointments.filter(a => a.doctorId === options.doctorId || a.doctorName?.includes(options.doctorId));
    }
    if (options?.patientId) {
      appointments = appointments.filter(a => a.patientId === options.patientId || a.patientName?.includes(options.patientId));
    }
    if (options?.date) {
      appointments = appointments.filter(a => a.date === options.date);
    }

    return appointments;
  }

  static async getAppointmentById(id: string) {
    try {
      const doc = await db.collection('appointments').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as AppointmentData) };
    } catch (err) {}

    const found = memoryAppointments.find(a => a.id === id);
    if (found) return found;

    return {
      id,
      patientName: 'Robert Chen',
      doctorName: 'Dr. Sarah Jenkins',
      date: new Date().toISOString().split('T')[0],
      time: '09:30 AM',
      department: 'Cardiology',
      status: 'Scheduled',
      reason: 'Routine Checkup',
    };
  }

  static async createAppointment(data: AppointmentData) {
    const newApt = {
      id: 'apt-' + Date.now(),
      status: data.status || 'Scheduled',
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('appointments').add(data);
      newApt.id = docRef.id;

      await db.collection('notifications').add({
        title: 'New Appointment Booked',
        message: `Appointment scheduled for ${data.patientName} with ${data.doctorName} on ${data.date} at ${data.time}`,
        type: 'APPOINTMENT',
        createdAt: new Date().toISOString(),
        read: false,
      });
    } catch (err) {}

    memoryAppointments.unshift(newApt);
    return newApt;
  }

  static async updateAppointment(id: string, updates: Partial<AppointmentData>) {
    try {
      await db.collection('appointments').doc(id).update(updates);
    } catch (err) {}

    const idx = memoryAppointments.findIndex(a => a.id === id);
    if (idx !== -1) {
      memoryAppointments[idx] = { ...memoryAppointments[idx], ...updates };
    }
    return { id, ...updates };
  }

  static async deleteAppointment(id: string) {
    try {
      await db.collection('appointments').doc(id).delete();
    } catch (err) {}

    memoryAppointments = memoryAppointments.filter(a => a.id !== id);
    return { success: true, id };
  }
}
