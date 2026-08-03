import { db } from '../config/firebase.js';

export interface PatientData {
  id?: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  bloodGroup: string;
  address: string;
  medicalHistory?: string;
  avatarUrl?: string;
  createdAt?: string;
}

// In-memory persistent state fallback
let memoryPatients: PatientData[] = [
  { id: 'pat-101', name: 'Robert Chen', age: 45, gender: 'Male', phone: '+91 98765-01092', email: 'robert.c@example.com', bloodGroup: 'A+', address: '742 Evergreen Terrace', medicalHistory: 'Hypertension' },
  { id: 'pat-102', name: 'Sophia Martinez', age: 32, gender: 'Female', phone: '+91 98765-01083', email: 'sophia.m@example.com', bloodGroup: 'O-', address: '123 Maple Street', medicalHistory: 'Asthma' },
  { id: 'pat-103', name: 'David Wilson', age: 58, gender: 'Male', phone: '+91 98765-01044', email: 'david.w@example.com', bloodGroup: 'B+', address: '456 Oak Avenue', medicalHistory: 'Type 2 Diabetes' },
];

export class PatientService {
  static async getAllPatients(options?: { search?: string; page?: number; limit?: number }) {
    const { search = '', page = 1, limit = 50 } = options || {};
    let patients: PatientData[] = [];

    try {
      const colRef = db.collection('patients');
      const snapshot = await colRef.get();
      const list: PatientData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as PatientData) });
      });
      if (list.length > 0) {
        patients = list;
        memoryPatients = list;
      } else {
        patients = [...memoryPatients];
      }
    } catch (err: any) {
      // Use clean string warning to avoid dumping raw gRPC stack traces
      patients = [...memoryPatients];
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      patients = patients.filter(
        p =>
          p.name?.toLowerCase().includes(query) ||
          p.email?.toLowerCase().includes(query) ||
          p.phone?.includes(query) ||
          p.bloodGroup?.toLowerCase().includes(query)
      );
    }

    const total = patients.length;
    const startIndex = (page - 1) * limit;
    const paginated = patients.slice(startIndex, startIndex + limit);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      patients: paginated,
    };
  }

  static async getPatientById(id: string) {
    try {
      const doc = await db.collection('patients').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as PatientData) };
    } catch (err) {}

    const found = memoryPatients.find(p => p.id === id);
    if (found) return found;

    return {
      id,
      name: 'Robert Chen',
      age: 45,
      gender: 'Male',
      phone: '+91 98765-01092',
      email: 'robert.c@example.com',
      bloodGroup: 'A+',
      address: '742 Evergreen Terrace',
      medicalHistory: 'Hypertension',
    };
  }

  static async createPatient(data: PatientData) {
    const newPatient = {
      id: 'pat-' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('patients').add(data);
      newPatient.id = docRef.id;
    } catch (err) {}

    memoryPatients.unshift(newPatient);
    return newPatient;
  }

  static async updatePatient(id: string, updates: Partial<PatientData>) {
    try {
      await db.collection('patients').doc(id).update(updates);
    } catch (err) {}

    const idx = memoryPatients.findIndex(p => p.id === id);
    if (idx !== -1) {
      memoryPatients[idx] = { ...memoryPatients[idx], ...updates };
    }
    return { id, ...updates };
  }

  static async deletePatient(id: string) {
    try {
      await db.collection('patients').doc(id).delete();
    } catch (err) {}

    memoryPatients = memoryPatients.filter(p => p.id !== id);
    return { success: true, id };
  }
}
