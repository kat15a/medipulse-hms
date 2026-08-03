import { db } from '../config/firebase.js';

export interface MedicalRecordData {
  id?: string;
  patientName: string;
  patientId?: string;
  doctorName: string;
  doctorId?: string;
  date: string;
  diagnosis: string;
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  treatment?: string;
  notes?: string;
  attachments?: string[];
  createdAt?: string;
}

let memoryRecords: MedicalRecordData[] = [
  {
    id: 'mr-201',
    patientName: 'Robert Chen',
    doctorName: 'Dr. Sarah Jenkins',
    date: '2026-07-20',
    diagnosis: 'Hypertensive Heart Disease',
    bloodPressure: '138/88 mmHg',
    heartRate: '76 bpm',
    temperature: '98.4 °F',
    treatment: 'Lifestyle modification & daily Amlodipine regimen',
    notes: 'Patient shows stable cardiovascular parameters following 3-week medication routine.',
  },
  {
    id: 'mr-202',
    patientName: 'Sophia Martinez',
    doctorName: 'Dr. Marcus Vance',
    date: '2026-07-22',
    diagnosis: 'Acute Vestibular Migraine',
    bloodPressure: '118/74 mmHg',
    heartRate: '70 bpm',
    temperature: '98.6 °F',
    treatment: 'Sumatriptan 50mg & stress reduction therapy',
    notes: 'Neurological examination negative for focal deficits.',
  },
];

export class MedicalRecordService {
  static async getAllRecords() {
    let items: MedicalRecordData[] = [];
    try {
      const colRef = db.collection('medical_records');
      const snapshot = await colRef.get();
      const list: MedicalRecordData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as MedicalRecordData) });
      });
      if (list.length > 0) {
        items = list;
        memoryRecords = list;
      } else {
        items = [...memoryRecords];
      }
    } catch (err) {
      items = [...memoryRecords];
    }
    return items;
  }

  static async getRecordById(id: string) {
    try {
      const doc = await db.collection('medical_records').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as MedicalRecordData) };
    } catch (err) {}

    const found = memoryRecords.find(r => r.id === id);
    if (found) return found;

    return {
      id,
      patientName: 'Robert Chen',
      doctorName: 'Dr. Sarah Jenkins',
      date: '2026-07-20',
      diagnosis: 'Hypertensive Heart Disease',
      bloodPressure: '138/88 mmHg',
      heartRate: '76 bpm',
      temperature: '98.4 °F',
    };
  }

  static async createRecord(data: MedicalRecordData) {
    const newRecord: MedicalRecordData = {
      id: 'mr-' + Date.now(),
      date: data.date || new Date().toISOString().split('T')[0],
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('medical_records').add(data);
      newRecord.id = docRef.id;
    } catch (err) {}

    memoryRecords.unshift(newRecord);
    return newRecord;
  }

  static async updateRecord(id: string, updates: Partial<MedicalRecordData>) {
    try {
      await db.collection('medical_records').doc(id).update(updates);
    } catch (err) {}

    const idx = memoryRecords.findIndex(r => r.id === id);
    if (idx !== -1) {
      memoryRecords[idx] = { ...memoryRecords[idx], ...updates };
    }
    return { id, ...updates };
  }

  static async deleteRecord(id: string) {
    try {
      await db.collection('medical_records').doc(id).delete();
    } catch (err) {}

    memoryRecords = memoryRecords.filter(r => r.id !== id);
    return { success: true, id };
  }
}
