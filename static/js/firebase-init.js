import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy,
  onSnapshot
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';

const firebaseConfig = {
  projectId: "regal-station-420318",
  appId: "1:632380931610:web:d558d64bb5cc3834b1dba3",
  apiKey: "AIzaSyDRM3IAUMXEiZcwuOw_qEeIPUi2ZBtKfZY",
  authDomain: "regal-station-420318.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-medipulsehospita-5cf8200a-2233-4c5b-9a5a-c4e420a16b83",
  storageBucket: "regal-station-420318.firebasestorage.app",
  messagingSenderId: "632380931610"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific database ID
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Firebase Auth
const auth = getAuth(app);

window.FirebaseService = {
  app,
  db,
  auth,
  
  // Generic Collection Fetcher
  async getCollection(collectionName) {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      const data = [];
      snapshot.forEach(docSnap => {
        data.push({ id: docSnap.id, ...docSnap.data() });
      });
      return data;
    } catch (err) {
      console.warn(`[Firebase Client] Note for ${collectionName}: using backend API routes instead (${err.message})`);
      return [];
    }
  },

  // Add Item to Collection
  async addItem(collectionName, item) {
    try {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, {
        ...item,
        createdAt: new Date().toISOString()
      });
      return { id: docRef.id, ...item };
    } catch (err) {
      console.error(`Firebase Error adding to ${collectionName}:`, err);
      throw err;
    }
  },

  // Update Item in Collection
  async updateItem(collectionName, docId, updates) {
    try {
      const docRef = doc(db, collectionName, String(docId));
      await updateDoc(docRef, updates);
      return { id: docId, ...updates };
    } catch (err) {
      console.error(`Firebase Error updating ${collectionName}/${docId}:`, err);
      throw err;
    }
  },

  // Delete Item from Collection
  async deleteItem(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, String(docId));
      await deleteDoc(docRef);
      return true;
    } catch (err) {
      console.error(`Firebase Error deleting ${collectionName}/${docId}:`, err);
      throw err;
    }
  },

  // Seed Initial Firestore Collections if Empty
  async seedInitialDataIfNeeded() {
    try {
      const patientsCol = collection(db, 'patients');
      const snap = await getDocs(patientsCol);
      if (snap.empty) {
        console.log('[Firebase] Seeding initial hospital database into Firestore...');
        
        // Seed Patients
        const initialPatients = [
          { name: "Eleanor Vance", age: 34, gender: "Female", phone: "+91 98765 23456", email: "eleanor.vance@example.com", bloodGroup: "O+", address: "742 Evergreen Terrace, Springfield", medicalHistory: "Mild asthma, penicillin allergy" },
          { name: "Robert Sterling", age: 52, gender: "Male", phone: "+91 98765 87654", email: "r.sterling@example.com", bloodGroup: "A+", address: "10880 Wilshire Blvd, Los Angeles", medicalHistory: "Hypertension, Type-2 Diabetes" },
          { name: "Sophia Martinez", age: 28, gender: "Female", phone: "+91 98765 34567", email: "sophia.m@example.com", bloodGroup: "B-", address: "420 Beacon Street, Boston", medicalHistory: "Routine prenatal checkups" },
          { name: "Marcus Brody", age: 61, gender: "Male", phone: "+91 98765 90123", email: "marcus.brody@example.com", bloodGroup: "AB+", address: "123 University Ave, Chicago", medicalHistory: "Post-op knee surgery recovery" },
          { name: "Aria Montgomery", age: 24, gender: "Female", phone: "+91 98765 45678", email: "aria.m@example.com", bloodGroup: "O-", address: "88 Rosewood Lane, Philadelphia", medicalHistory: "Migraine headaches" }
        ];
        for (const p of initialPatients) { await addDoc(patientsCol, p); }

        // Seed Doctors
        const doctorsCol = collection(db, 'doctors');
        const initialDoctors = [
          { name: "Dr. Arthur Pendelton", specialization: "Cardiology", experience: "14 Years", fee: 800, email: "dr.arthur@medipulse.com", phone: "+91 98765 11122", rating: 4.9 },
          { name: "Dr. Evelyn Reed", specialization: "Neurology", experience: "10 Years", fee: 1000, email: "dr.evelyn@medipulse.com", phone: "+91 98765 22233", rating: 4.8 },
          { name: "Dr. Marcus Thorne", specialization: "Orthopedics", experience: "12 Years", fee: 750, email: "dr.marcus@medipulse.com", phone: "+91 98765 33344", rating: 4.9 },
          { name: "Dr. Sarah Lin", specialization: "Pediatrics", experience: "8 Years", fee: 600, email: "dr.sarah@medipulse.com", phone: "+91 98765 44455", rating: 5.0 },
          { name: "Dr. David Vance", specialization: "Dermatology", experience: "15 Years", fee: 900, email: "dr.david@medipulse.com", phone: "+91 98765 55566", rating: 4.7 }
        ];
        for (const d of initialDoctors) { await addDoc(doctorsCol, d); }

        // Seed Appointments
        const apptsCol = collection(db, 'appointments');
        const initialAppointments = [
          { patientName: "Eleanor Vance", doctorName: "Dr. Arthur Pendelton", date: "2026-07-28", time: "10:30 AM", department: "Cardiology", status: "Scheduled", reason: "Annual ECG and Cardiac Checkup" },
          { patientName: "Robert Sterling", doctorName: "Dr. Evelyn Reed", date: "2026-07-28", time: "02:00 PM", department: "Neurology", status: "In Progress", reason: "Persistent numbness in fingers" },
          { patientName: "Sophia Martinez", doctorName: "Dr. Sarah Lin", date: "2026-07-29", time: "09:15 AM", department: "Pediatrics", status: "Scheduled", reason: "Childhood immunizations consultation" },
          { patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", time: "11:00 AM", department: "Orthopedics", status: "Completed", reason: "Follow-up knee MRI review" },
          { patientName: "Aria Montgomery", doctorName: "Dr. David Vance", date: "2026-07-24", time: "03:30 PM", department: "Dermatology", status: "Cancelled", reason: "Skin allergy follow-up" }
        ];
        for (const a of initialAppointments) { await addDoc(apptsCol, a); }

        // Seed Billing
        const billingCol = collection(db, 'billing');
        const initialBilling = [
          { invoiceNo: "INV-2026-001", patientName: "Marcus Brody", date: "2026-07-25", consultationFee: 500, medicineFee: 250, labFee: 800, tax: 100, total: 1650, status: "PAID", paymentMethod: "UPI / GPay" },
          { invoiceNo: "INV-2026-002", patientName: "Robert Sterling", date: "2026-07-28", consultationFee: 800, medicineFee: 350, labFee: 0, tax: 90, total: 1240, status: "PENDING", paymentMethod: "Pending" },
          { invoiceNo: "INV-2026-003", patientName: "Eleanor Vance", date: "2026-07-20", consultationFee: 600, medicineFee: 450, labFee: 1200, tax: 150, total: 2400, status: "PAID", paymentMethod: "Insurance Claim" }
        ];
        for (const b of initialBilling) { await addDoc(billingCol, b); }

        // Seed Prescriptions
        const presCol = collection(db, 'prescriptions');
        const initialPrescriptions = [
          { patientName: "Eleanor Vance", doctorName: "Dr. Arthur Pendelton", date: "2026-07-20", diagnosis: "Mild Hypertension", medicines: [{ name: "Atorvastatin", dosage: "10mg", frequency: "0-0-1", duration: "30 Days" }, { name: "Amlodipine", dosage: "5mg", frequency: "1-0-0", duration: "30 Days" }], instructions: "Low sodium diet, regular light morning walks." },
          { patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", diagnosis: "Post-op Inflammation", medicines: [{ name: "Ibuprofen", dosage: "400mg", frequency: "1-0-1", duration: "7 Days" }, { name: "Calcium + Vit D3", dosage: "500mg", frequency: "1-0-0", duration: "60 Days" }], instructions: "Ice therapy 15 mins daily." }
        ];
        for (const pr of initialPrescriptions) { await addDoc(presCol, pr); }

        // Seed Medical Records
        const recordsCol = collection(db, 'medical_records');
        const initialRecords = [
          { patientName: "Robert Sterling", doctorName: "Dr. Evelyn Reed", date: "2026-07-22", diagnosis: "Type-2 Diabetes Check", bloodPressure: "130/85 mmHg", heartRate: "76 bpm", temperature: "98.6 °F", treatment: "Adjusted Insulin therapy and diet plan", notes: "Patient reported reduced fatigue." },
          { patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", diagnosis: "Post-Knee Arthroscopy", bloodPressure: "120/80 mmHg", heartRate: "72 bpm", temperature: "98.4 °F", treatment: "Physiotherapy twice weekly", notes: "Sutures healing normally." }
        ];
        for (const r of initialRecords) { await addDoc(recordsCol, r); }

        console.log('[Firebase] Hospital database successfully seeded to Firestore!');
      }
    } catch (err) {
      console.warn('[Firebase] Seeding check skipped/failed:', err);
    }
  }
};

// Auto-seed on load
window.FirebaseService.seedInitialDataIfNeeded();
