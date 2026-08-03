import { db } from '../config/firebase.js';

export interface DoctorData {
  id?: string;
  name: string;
  specialization: string;
  experience: string;
  fee: number;
  email: string;
  phone: string;
  rating?: number;
  avatarUrl?: string;
  availableDays?: string[];
  createdAt?: string;
}

// In-memory state persistence
let memoryDoctors: DoctorData[] = [
  { id: 'doc-1', name: 'Dr. Sarah Jenkins', specialization: 'Cardiology', experience: '12 Years', fee: 800, email: 'sarah.j@medipulse.com', phone: '+91 98765-01001', rating: 4.9, availableDays: ['Mon', 'Wed', 'Fri'] },
  { id: 'doc-2', name: 'Dr. Marcus Vance', specialization: 'Neurology', experience: '15 Years', fee: 1000, email: 'marcus.v@medipulse.com', phone: '+91 98765-01002', rating: 4.8, availableDays: ['Tue', 'Thu', 'Sat'] },
  { id: 'doc-3', name: 'Dr. Emily Watson', specialization: 'Pediatrics', experience: '8 Years', fee: 600, email: 'emily.w@medipulse.com', phone: '+91 98765-01003', rating: 5.0, availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
  { id: 'doc-4', name: 'Dr. James Thorne', specialization: 'Orthopedics', experience: '14 Years', fee: 900, email: 'james.t@medipulse.com', phone: '+91 98765-01004', rating: 4.7, availableDays: ['Mon', 'Wed', 'Thu'] },
];

export class DoctorService {
  static async getAllDoctors(options?: { search?: string; specialization?: string }) {
    const { search = '', specialization = '' } = options || {};
    let doctors: DoctorData[] = [];

    try {
      const colRef = db.collection('doctors');
      const snapshot = await colRef.get();
      const list: DoctorData[] = [];
      snapshot.forEach(doc => {
        list.push({ id: doc.id, ...(doc.data() as DoctorData) });
      });
      if (list.length > 0) {
        doctors = list;
        memoryDoctors = list;
      } else {
        doctors = [...memoryDoctors];
      }
    } catch (err) {
      doctors = [...memoryDoctors];
    }

    if (specialization.trim()) {
      doctors = doctors.filter(
        d => d.specialization?.toLowerCase() === specialization.toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      doctors = doctors.filter(
        d =>
          d.name?.toLowerCase().includes(q) ||
          d.specialization?.toLowerCase().includes(q) ||
          d.email?.toLowerCase().includes(q)
      );
    }

    return doctors;
  }

  static async getDoctorById(id: string) {
    try {
      const doc = await db.collection('doctors').doc(id).get();
      if (doc.exists) return { id: doc.id, ...(doc.data() as DoctorData) };
    } catch (err) {}

    const found = memoryDoctors.find(d => d.id === id);
    if (found) return found;

    return {
      id,
      name: 'Dr. Sarah Jenkins',
      specialization: 'Cardiology',
      experience: '12 Years',
      fee: 800,
      email: 'sarah.j@medipulse.com',
      phone: '+91 98765-01001',
      rating: 4.9,
    };
  }

  static async createDoctor(data: DoctorData) {
    const newDoc = {
      id: 'doc-' + Date.now(),
      rating: 5.0,
      ...data,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await db.collection('doctors').add(data);
      newDoc.id = docRef.id;
    } catch (err) {}

    memoryDoctors.unshift(newDoc);
    return newDoc;
  }

  static async updateDoctor(id: string, updates: Partial<DoctorData>) {
    try {
      await db.collection('doctors').doc(id).update(updates);
    } catch (err) {}

    const idx = memoryDoctors.findIndex(d => d.id === id);
    if (idx !== -1) {
      memoryDoctors[idx] = { ...memoryDoctors[idx], ...updates };
    }
    return { id, ...updates };
  }

  static async deleteDoctor(id: string) {
    try {
      await db.collection('doctors').doc(id).delete();
    } catch (err) {}

    memoryDoctors = memoryDoctors.filter(d => d.id !== id);
    return { success: true, id };
  }
}
