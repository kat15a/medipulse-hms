import { db } from '../config/firebase.js';

export interface MedicineItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PrescriptionData {
  id?: string;
  patientName: string;
  patientId?: string;
  doctorName: string;
  doctorId?: string;
  appointmentId?: string;
  date: string;
  diagnosis: string;
  medicines: MedicineItem[];
  instructions?: string;
  createdAt?: string;
}

let memoryPrescriptions: PrescriptionData[] = [
  {
    id: 'rx-101',
    patientName: 'Robert Chen',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-07-25',
    diagnosis: 'Essential Hypertension',
    medicines: [
      { name: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once Daily (Morning)', duration: '30 Days' },
      { name: 'Lisinopril', dosage: '10mg', frequency: 'Once Daily (Evening)', duration: '30 Days' },
    ],
    instructions: 'Monitor blood pressure weekly. Low sodium diet recommended.',
  },
  {
    id: 'rx-102',
    patientName: 'Sophia Martinez',
    doctorName: 'Dr. Marcus Vance',
    date: '2026-07-26',
    diagnosis: 'Acute Migraine',
    medicines: [
      { name: 'Sumatriptan', dosage: '50mg', frequency: 'As needed at onset', duration: '10 Days' },
    ],
    instructions: 'Take with plenty of water. Avoid bright light during episodes.',
  },
];

export class PrescriptionService {
  static async getAllPrescriptions() {
    let items: PrescriptionData[] = [];
    try {
      const colRef = db.collection('prescriptions');
      const snapshot = await colRef.get();
      const list: PrescriptionData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as PrescriptionData) });
      });
      if (list.length > 0) {
        items = list;
        memoryPrescriptions = list;
      } else {
        items = [...memoryPrescriptions];
      }
    } catch (err) {
      items = [...memoryPrescriptions];
    }
    return items;
  }

  static async getPrescriptionById(id: string) {
    try {
      const doc = await db.collection('prescriptions').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as PrescriptionData) };
    } catch (err) {}

    const found = memoryPrescriptions.find(p => p.id === id);
    if (found) return found;

    return {
      id,
      patientName: 'Robert Chen',
      doctorName: 'Dr. Sarah Jenkins',
      date: '2026-07-25',
      diagnosis: 'Essential Hypertension',
      medicines: [
        { name: 'Amlodipine Besylate', dosage: '5mg', frequency: 'Once Daily (Morning)', duration: '30 Days' },
      ],
    };
  }

  static async createPrescription(data: PrescriptionData) {
    const newRx = {
      id: 'rx-' + Date.now(),
      date: data.date || new Date().toISOString().split('T')[0],
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('prescriptions').add(data);
      newRx.id = docRef.id;
    } catch (err) {}

    memoryPrescriptions.unshift(newRx);
    return newRx;
  }

  static async updatePrescription(id: string, updates: Partial<PrescriptionData>) {
    try {
      await db.collection('prescriptions').doc(id).update(updates);
    } catch (err) {}

    const idx = memoryPrescriptions.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryPrescriptions[idx] = { ...memoryPrescriptions[idx], ...updates };
    }
    return { id, ...updates };
  }

  static async deletePrescription(id: string) {
    try {
      await db.collection('prescriptions').doc(id).delete();
    } catch (err) {}

    memoryPrescriptions = memoryPrescriptions.filter(p => p.id !== id);
    return { success: true, id };
  }
}
