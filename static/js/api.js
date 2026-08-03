/**
 * MediPulse HMS - Central API Client & Seed State Management
 */

// Determine base URL dynamically (default to relative path for current origin full-stack server)
let customApiBase = localStorage.getItem('medipulse_api_base');
if (!customApiBase || customApiBase.includes('localhost:8080')) {
  customApiBase = '';
  localStorage.setItem('medipulse_api_base', '');
}

const API_CONFIG = {
  // Configured Backend URL
  baseURL: customApiBase,
  
  // Get Auth Token
  getToken() {
    return localStorage.getItem('medipulse_jwt_token');
  },

  // Save Token & User Session
  setSession(token, user) {
    localStorage.setItem('medipulse_jwt_token', token);
    localStorage.setItem('medipulse_user', JSON.stringify(user));
  },

  // Clear Session
  clearSession() {
    localStorage.removeItem('medipulse_jwt_token');
    localStorage.removeItem('medipulse_user');
  },

  // Get Current Logged In User
  getUser() {
    const userStr = localStorage.getItem('medipulse_user');
    return userStr ? JSON.parse(userStr) : null;
  }
};

// Seed Mock Local Database for seamless interactive testing if Spring Boot backend is offline
function initMockDatabase() {
  const formatToIndianPhone = (ph) => {
    if (!ph || ph.startsWith('+91')) return ph || '+91 98765 01001';
    // Replace +1 (555) or similar with +91 98765
    return ph.replace(/\+1\s*\(?555\)?/g, '+91 98765').replace(/\+1\s*/g, '+91 ');
  };

  if (!localStorage.getItem('medipulse_db_patients')) {
    const initialPatients = [
      { id: 1, name: "Eleanor Vance", age: 34, gender: "Female", phone: "+91 98765 23456", email: "eleanor.vance@example.com", bloodGroup: "O+", address: "742 Evergreen Terrace, Springfield", medicalHistory: "Mild asthma, penicillin allergy" },
      { id: 2, name: "Robert Sterling", age: 52, gender: "Male", phone: "+91 98765 87654", email: "r.sterling@example.com", bloodGroup: "A+", address: "10880 Wilshire Blvd, Los Angeles", medicalHistory: "Hypertension, Type-2 Diabetes" },
      { id: 3, name: "Sophia Martinez", age: 28, gender: "Female", phone: "+91 98765 34567", email: "sophia.m@example.com", bloodGroup: "B-", address: "420 Beacon Street, Boston", medicalHistory: "Routine prenatal checkups" },
      { id: 4, name: "Marcus Brody", age: 61, gender: "Male", phone: "+91 98765 90123", email: "marcus.brody@example.com", bloodGroup: "AB+", address: "123 University Ave, Chicago", medicalHistory: "Post-op knee surgery recovery" },
      { id: 5, name: "Aria Montgomery", age: 24, gender: "Female", phone: "+91 98765 45678", email: "aria.m@example.com", bloodGroup: "O-", address: "88 Rosewood Lane, Philadelphia", medicalHistory: "Migraine headaches" }
    ];
    localStorage.setItem('medipulse_db_patients', JSON.stringify(initialPatients));
  } else {
    try {
      const stored = JSON.parse(localStorage.getItem('medipulse_db_patients') || '[]');
      let updated = false;
      stored.forEach(p => {
        if (p.phone && p.phone.includes('+1')) {
          p.phone = formatToIndianPhone(p.phone);
          updated = true;
        }
      });
      if (updated) localStorage.setItem('medipulse_db_patients', JSON.stringify(stored));
    } catch (e) {}
  }

  if (!localStorage.getItem('medipulse_db_doctors')) {
    const initialDoctors = [
      { id: 1, name: "Dr. Arthur Pendelton", specialization: "Cardiology", experience: "14 Years", fee: 800, email: "dr.arthur@medipulse.com", phone: "+91 98765 11122", rating: 4.9 },
      { id: 2, name: "Dr. Evelyn Reed", specialization: "Neurology", experience: "10 Years", fee: 1000, email: "dr.evelyn@medipulse.com", phone: "+91 98765 22233", rating: 4.8 },
      { id: 3, name: "Dr. Marcus Thorne", specialization: "Orthopedics", experience: "12 Years", fee: 750, email: "dr.marcus@medipulse.com", phone: "+91 98765 33344", rating: 4.9 },
      { id: 4, name: "Dr. Sarah Lin", specialization: "Pediatrics", experience: "8 Years", fee: 600, email: "dr.sarah@medipulse.com", phone: "+91 98765 44455", rating: 5.0 },
      { id: 5, name: "Dr. David Vance", specialization: "Dermatology", experience: "15 Years", fee: 900, email: "dr.david@medipulse.com", phone: "+91 98765 55566", rating: 4.7 }
    ];
    localStorage.setItem('medipulse_db_doctors', JSON.stringify(initialDoctors));
  } else {
    try {
      const stored = JSON.parse(localStorage.getItem('medipulse_db_doctors') || '[]');
      let updated = false;
      stored.forEach(d => {
        if (d.phone && d.phone.includes('+1')) {
          d.phone = formatToIndianPhone(d.phone);
          updated = true;
        }
        if (d.fee && d.fee < 300) {
          d.fee = d.fee * 5;
          updated = true;
        }
      });
      if (updated) localStorage.setItem('medipulse_db_doctors', JSON.stringify(stored));
    } catch (e) {}
  }

  if (!localStorage.getItem('medipulse_db_appointments')) {
    const initialAppointments = [
      { id: 101, patientName: "Eleanor Vance", doctorName: "Dr. Arthur Pendelton", date: "2026-07-28", time: "10:30 AM", department: "Cardiology", status: "Scheduled", reason: "Annual ECG and Cardiac Checkup" },
      { id: 102, patientName: "Robert Sterling", doctorName: "Dr. Evelyn Reed", date: "2026-07-28", time: "02:00 PM", department: "Neurology", status: "In Progress", reason: "Persistent numbness in fingers" },
      { id: 103, patientName: "Sophia Martinez", doctorName: "Dr. Sarah Lin", date: "2026-07-29", time: "09:15 AM", department: "Pediatrics", status: "Scheduled", reason: "Childhood immunizations consultation" },
      { id: 104, patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", time: "11:00 AM", department: "Orthopedics", status: "Completed", reason: "Follow-up knee MRI review" },
      { id: 105, patientName: "Aria Montgomery", doctorName: "Dr. David Vance", date: "2026-07-24", time: "03:30 PM", department: "Dermatology", status: "Cancelled", reason: "Skin allergy follow-up" }
    ];
    localStorage.setItem('medipulse_db_appointments', JSON.stringify(initialAppointments));
  }

  if (!localStorage.getItem('medipulse_db_prescriptions')) {
    const initialPrescriptions = [
      { id: 201, patientName: "Eleanor Vance", doctorName: "Dr. Arthur Pendelton", date: "2026-07-20", diagnosis: "Mild Hypertension", medicines: [{ name: "Atorvastatin", dosage: "10mg", frequency: "0-0-1", duration: "30 Days" }, { name: "Amlodipine", dosage: "5mg", frequency: "1-0-0", duration: "30 Days" }], instructions: "Low sodium diet, regular light morning walks." },
      { id: 202, patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", diagnosis: "Post-op Inflammation", medicines: [{ name: "Ibuprofen", dosage: "400mg", frequency: "1-0-1", duration: "7 Days" }, { name: "Calcium + Vit D3", dosage: "500mg", frequency: "1-0-0", duration: "60 Days" }], instructions: "Ice therapy 15 mins daily." }
    ];
    localStorage.setItem('medipulse_db_prescriptions', JSON.stringify(initialPrescriptions));
  }

  if (!localStorage.getItem('medipulse_db_billing')) {
    const initialBilling = [
      { id: 301, invoiceNo: "INV-2026-001", patientName: "Marcus Brody", date: "2026-07-25", consultationFee: 500, medicineFee: 250, labFee: 800, tax: 100, total: 1650, status: "PAID", paymentMethod: "UPI / GPay" },
      { id: 302, invoiceNo: "INV-2026-002", patientName: "Robert Sterling", date: "2026-07-28", consultationFee: 800, medicineFee: 350, labFee: 0, tax: 90, total: 1240, status: "PENDING", paymentMethod: "Pending" },
      { id: 303, invoiceNo: "INV-2026-003", patientName: "Eleanor Vance", date: "2026-07-20", consultationFee: 600, medicineFee: 450, labFee: 1200, tax: 150, total: 2400, status: "PAID", paymentMethod: "Insurance Claim" }
    ];
    localStorage.setItem('medipulse_db_billing', JSON.stringify(initialBilling));
  }

  if (!localStorage.getItem('medipulse_db_records')) {
    const initialRecords = [
      { id: 401, patientName: "Robert Sterling", doctorName: "Dr. Evelyn Reed", date: "2026-07-22", diagnosis: "Type-2 Diabetes Check", bloodPressure: "130/85 mmHg", heartRate: "76 bpm", temperature: "98.6 °F", treatment: "Adjusted Insulin therapy and diet plan", notes: "Patient reported reduced fatigue." },
      { id: 402, patientName: "Marcus Brody", doctorName: "Dr. Marcus Thorne", date: "2026-07-25", diagnosis: "Post-Knee Arthroscopy", bloodPressure: "120/80 mmHg", heartRate: "72 bpm", temperature: "98.4 °F", treatment: "Physiotherapy twice weekly", notes: "Sutures healing normally." }
    ];
    localStorage.setItem('medipulse_db_records', JSON.stringify(initialRecords));
  }
}

initMockDatabase();

/**
 * Universal Fetch Helper with JWT Header Attachment
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  const token = API_CONFIG.getToken();
  const url = `${API_CONFIG.baseURL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401 || response.status === 403) {
      // Token expired or unauthorized
      API_CONFIG.clearSession();
      if (!window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = '/resources/templates/login.html?expired=1';
      }
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errRes = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(errRes.message || 'API Request failed');
    }

    return await response.json();
  } catch (err) {
    console.warn(`[MediPulse API] Real backend at ${url} unavailable or error occurred (${err.message}). Using client mock engine.`);
    
    // Smooth fallback to client mock DB
    return handleMockFallback(endpoint, method, data);
  }
}

/**
 * Firestore / Local Fallback Data Engine for seamless real-time cloud data persistence
 */
async function handleMockFallback(endpoint, method, data) {
  const fs = window.FirebaseService;

  // Auth endpoints
  if (endpoint === '/api/users/login') {
    const identity = data.username || data.email || 'admin';
    let role = 'ADMIN';
    if (identity.toLowerCase().includes('doctor')) role = 'DOCTOR';
    if (identity.toLowerCase().includes('patient')) role = 'PATIENT';

    const mockUser = {
      token: 'jwt-medipulse-' + Math.random().toString(36).substring(2),
      username: identity,
      email: data.email || `${identity}@medipulse.com`,
      role: role,
      fullName: identity.charAt(0).toUpperCase() + identity.slice(1) + ' (Demo)'
    };
    API_CONFIG.setSession(mockUser.token, mockUser);
    return mockUser;
  }

  if (endpoint === '/api/users/register') {
    return { message: 'User registered successfully!', success: true };
  }

  // Patients Endpoints
  if (endpoint.startsWith('/api/patients')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('patients');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        return await fs.addItem('patients', data);
      }
      if (method === 'PUT') {
        const id = endpoint.split('/').pop();
        await fs.updateItem('patients', id, data);
        return { message: 'Patient updated successfully' };
      }
      if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        await fs.deleteItem('patients', id);
        return { message: 'Patient deleted' };
      }
    }
    
    // Fallback to localStorage if Firebase loading
    let patients = JSON.parse(localStorage.getItem('medipulse_db_patients') || '[]');
    if (method === 'GET') return patients;
    if (method === 'POST') {
      const newPatient = { id: Date.now(), ...data };
      patients.unshift(newPatient);
      localStorage.setItem('medipulse_db_patients', JSON.stringify(patients));
      return newPatient;
    }
    if (method === 'PUT') {
      const id = parseInt(endpoint.split('/').pop());
      patients = patients.map(p => p.id === id ? { ...p, ...data } : p);
      localStorage.setItem('medipulse_db_patients', JSON.stringify(patients));
      return { message: 'Patient updated successfully' };
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/').pop());
      patients = patients.filter(p => p.id !== id);
      localStorage.setItem('medipulse_db_patients', JSON.stringify(patients));
      return { message: 'Patient deleted' };
    }
  }

  // Doctors Endpoints
  if (endpoint.startsWith('/api/doctors')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('doctors');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        return await fs.addItem('doctors', { rating: 5.0, ...data });
      }
      if (method === 'PUT') {
        const id = endpoint.split('/').pop();
        await fs.updateItem('doctors', id, data);
        return { message: 'Doctor updated' };
      }
      if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        await fs.deleteItem('doctors', id);
        return { message: 'Doctor deleted' };
      }
    }

    let doctors = JSON.parse(localStorage.getItem('medipulse_db_doctors') || '[]');
    if (method === 'GET') return doctors;
    if (method === 'POST') {
      const newDoc = { id: Date.now(), rating: 5.0, ...data };
      doctors.unshift(newDoc);
      localStorage.setItem('medipulse_db_doctors', JSON.stringify(doctors));
      return newDoc;
    }
    if (method === 'PUT') {
      const id = parseInt(endpoint.split('/').pop());
      doctors = doctors.map(d => d.id === id ? { ...d, ...data } : d);
      localStorage.setItem('medipulse_db_doctors', JSON.stringify(doctors));
      return { message: 'Doctor updated' };
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/').pop());
      doctors = doctors.filter(d => d.id !== id);
      localStorage.setItem('medipulse_db_doctors', JSON.stringify(doctors));
      return { message: 'Doctor deleted' };
    }
  }

  // Appointments Endpoints
  if (endpoint.startsWith('/api/appointments')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('appointments');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        return await fs.addItem('appointments', { status: 'Scheduled', ...data });
      }
      if (method === 'PUT') {
        const id = endpoint.split('/').pop();
        await fs.updateItem('appointments', id, data);
        return { message: 'Appointment updated' };
      }
      if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        await fs.deleteItem('appointments', id);
        return { message: 'Appointment deleted' };
      }
    }

    let list = JSON.parse(localStorage.getItem('medipulse_db_appointments') || '[]');
    if (method === 'GET') return list;
    if (method === 'POST') {
      const item = { id: 100 + list.length + 1, status: 'Scheduled', ...data };
      list.unshift(item);
      localStorage.setItem('medipulse_db_appointments', JSON.stringify(list));
      return item;
    }
    if (method === 'PUT') {
      const id = parseInt(endpoint.split('/').pop());
      list = list.map(a => a.id === id ? { ...a, ...data } : a);
      localStorage.setItem('medipulse_db_appointments', JSON.stringify(list));
      return { message: 'Appointment updated' };
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/').pop());
      list = list.filter(a => a.id !== id);
      localStorage.setItem('medipulse_db_appointments', JSON.stringify(list));
      return { message: 'Appointment deleted' };
    }
  }

  // Prescriptions Endpoints
  if (endpoint.startsWith('/api/prescriptions')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('prescriptions');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        return await fs.addItem('prescriptions', { date: new Date().toISOString().split('T')[0], ...data });
      }
      if (method === 'DELETE') {
        const id = endpoint.split('/').pop();
        await fs.deleteItem('prescriptions', id);
        return { message: 'Prescription deleted' };
      }
    }

    let list = JSON.parse(localStorage.getItem('medipulse_db_prescriptions') || '[]');
    if (method === 'GET') return list;
    if (method === 'POST') {
      const item = { id: 200 + list.length + 1, date: new Date().toISOString().split('T')[0], ...data };
      list.unshift(item);
      localStorage.setItem('medipulse_db_prescriptions', JSON.stringify(list));
      return item;
    }
    if (method === 'DELETE') {
      const id = parseInt(endpoint.split('/').pop());
      list = list.filter(x => x.id !== id);
      localStorage.setItem('medipulse_db_prescriptions', JSON.stringify(list));
      return { message: 'Prescription deleted' };
    }
  }

  // Billing Endpoints
  if (endpoint.startsWith('/api/billing')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('billing');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        const invoiceNo = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;
        return await fs.addItem('billing', { 
          invoiceNo, 
          date: new Date().toISOString().split('T')[0], 
          ...data 
        });
      }
    }

    let list = JSON.parse(localStorage.getItem('medipulse_db_billing') || '[]');
    if (method === 'GET') return list;
    if (method === 'POST') {
      const item = { 
        id: 300 + list.length + 1, 
        invoiceNo: `INV-2026-${String(list.length + 1).padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        ...data 
      };
      list.unshift(item);
      localStorage.setItem('medipulse_db_billing', JSON.stringify(list));
      return item;
    }
  }

  // Medical Records Endpoints
  if (endpoint.startsWith('/api/medical-records')) {
    if (fs) {
      if (method === 'GET') {
        const items = await fs.getCollection('medical_records');
        if (items.length > 0) return items;
      }
      if (method === 'POST') {
        return await fs.addItem('medical_records', { date: new Date().toISOString().split('T')[0], ...data });
      }
    }

    let list = JSON.parse(localStorage.getItem('medipulse_db_records') || '[]');
    if (method === 'GET') return list;
    if (method === 'POST') {
      const item = { id: 400 + list.length + 1, date: new Date().toISOString().split('T')[0], ...data };
      list.unshift(item);
      localStorage.setItem('medipulse_db_records', JSON.stringify(list));
      return item;
    }
  }

  return [];
}

// Toast Notification Helper
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container-custom');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container-custom';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast-custom toast-${type}`;
  
  let icon = 'bi-check-circle-fill text-success';
  if (type === 'error') icon = 'bi-exclamation-triangle-fill text-danger';
  if (type === 'warning') icon = 'bi-exclamation-circle-fill text-warning';

  toast.innerHTML = `
    <i class="bi ${icon} fs-5"></i>
    <div class="flex-grow-1 font-medium">${message}</div>
    <button type="button" class="btn-close ms-2" onclick="this.parentElement.remove()"></button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

function getStatusBadgeClass(status) {
  if (!status) return 'badge-info';
  const s = status.toLowerCase();
  if (s === 'scheduled' || s === 'completed' || s === 'paid') return 'badge-success';
  if (s === 'in progress' || s === 'pending') return 'badge-pending';
  if (s === 'cancelled' || s === 'overdue') return 'badge-danger';
  return 'badge-info';
}

// Universal Download & Print Document Helper
async function downloadDocument(elementId, filename = 'MediPulse_Document') {
  const content = document.getElementById(elementId);
  if (!content) {
    showToast('Document content not found.', 'error');
    return;
  }

  const cleanName = filename.replace(/[^a-zA-Z0-9_-]/g, '_');

  // Try html2pdf if available or dynamically loaded
  if (typeof html2pdf !== 'undefined') {
    const opt = {
      margin: 12,
      filename: `${cleanName}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    try {
      await html2pdf().set(opt).from(content).save();
      return;
    } catch (err) {
      console.warn('html2pdf generation failed, using HTML document download fallback:', err);
    }
  }

  // Fallback: Formatted Printable Document File Download
  const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>${cleanName}</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #f8fafc; padding: 40px 20px; color: #0f172a; }
    .document-card { max-width: 820px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 36px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); }
    .print-bar { max-width: 820px; margin: 0 auto 20px auto; display: flex; justify-content: flex-end; }
    @media print {
      body { background: #fff; padding: 0; }
      .document-card { border: none; box-shadow: none; padding: 0; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-bar no-print">
    <button onclick="window.print()" style="background:#0d6efd; color:#fff; border:none; padding:10px 20px; border-radius:8px; font-weight:600; cursor:pointer;">
      <i class="bi bi-printer"></i> Print Document
    </button>
  </div>
  <div class="document-card">
    ${content.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${cleanName}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function printDocument(elementId, title = 'MediPulse Hospital Document') {
  const content = document.getElementById(elementId);
  if (!content) return;

  // First trigger direct download so user always gets the document file
  downloadDocument(elementId, title.replace(/\s+/g, '_'));

  // Also try browser print frame
  let printFrame = document.getElementById('medipulse_print_frame');
  if (printFrame) {
    printFrame.remove();
  }

  printFrame = document.createElement('iframe');
  printFrame.id = 'medipulse_print_frame';
  printFrame.style.position = 'fixed';
  printFrame.style.right = '0';
  printFrame.style.bottom = '0';
  printFrame.style.width = '0px';
  printFrame.style.height = '0px';
  printFrame.style.border = '0';
  printFrame.style.zIndex = '-9999';
  document.body.appendChild(printFrame);

  const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
  const doc = frameDoc.document || frameDoc;

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
        <style>
          @page { size: auto; margin: 15mm; }
          body {
            font-family: system-ui, -apple-system, sans-serif;
            background: #ffffff !important;
            color: #000000 !important;
            padding: 24px;
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .printable-document { max-width: 800px; margin: 0 auto; }
        </style>
      </head>
      <body>
        <div class="printable-document">
          ${content.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  setTimeout(() => {
    try {
      printFrame.contentWindow.focus();
      printFrame.contentWindow.print();
    } catch (err) {
      console.warn("Frame print failed inside iframe environment:", err);
    }
  }, 400);
}



