# 🏥 MediPulse HMS — Healthcare & Hospital Management System

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin_&_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.4-8E75B2?logo=google&logoColor=white)](https://ai.google.dev/)

**MediPulse HMS** is an end-to-end, full-stack Hospital Management System designed to streamline clinical workflows, patient care, appointment scheduling, electronic medical records (EHR), billing, and AI-driven clinical insights powered by **Google Gemini AI**.

---

## ✨ Features & Capabilities

### 🩺 1. Patient Management & Electronic Health Records (EHR)
* **Patient Profiles**: Comprehensive demographics, blood group, emergency contacts, insurance information, and medical background.
* **Medical Records**: Digital record tracking with lab reports, diagnosis history, treatment history, and document attachments.

### 👨‍⚕️ 2. Doctor & Staff Directory
* **Specialist Management**: Real-time listing of doctors, departments, room numbers, experience, and consultation fees.
* **Work Schedules**: Doctor availability slots and dynamic queue management.

### 📅 3. Appointment Scheduling & Management
* **Instant Booking**: Simple appointment workflow for patients and receptionists.
* **Status Workflows**: Scheduled, Completed, Cancelled, and In-Progress statuses with automated notifications.

### 💊 4. Digital Prescriptions
* **E-Prescribing**: Instant electronic prescription creation with dosages, instructions, frequency, and duration.
* **Pharmacy Sync**: Direct record linkage between clinical notes and patient prescriptions.

### 💳 5. Billing & Invoices
* **Automated Invoicing**: Detailed breakdown of consultation fees, medicine costs, and lab procedures.
* **Payment Tracking**: Paid/Pending invoice tracking with receipt generation.

### 🤖 6. AI Clinical Assistant (Powered by Google Gemini)
* **Symptom & Triage Analysis**: Gemini AI analyzes symptoms and offers preliminary triage suggestions and recommendations.
* **Medical Record Summarization**: Summarizes lengthy clinical histories into quick actionable summaries for doctors.
* **Patient Notes Assistant**: AI-assisted drafting of prescriptions and follow-up care instructions.

### 📊 7. Executive Hospital Analytics Dashboard
* **Real-time Metrics**: Total active patients, doctors on duty, pending appointments, revenue summaries, and bed utilization.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Framer Motion |
| **Backend** | Node.js, Express.js, TypeScript (`tsx` dev runner, `esbuild` production bundler) |
| **Database & Auth** | Firebase Firestore (NoSQL), Firebase Authentication, Firebase Admin SDK |
| **AI Integration** | `@google/genai` (Google Gemini 2.4 SDK) |

---

## 📁 Directory Structure

```
medipulse-hms/
├── src/
│   ├── backend/
│   │   ├── config/          # Firebase Admin & SDK setup
│   │   ├── controllers/     # Route request handlers
│   │   ├── middleware/      # Auth & error handling middlewares
│   │   ├── routes/          # Express API route declarations
│   │   └── services/        # Firebase Firestore CRUD & Gemini AI services
│   ├── App.tsx              # Main React Application
│   ├── index.css            # Global Tailwind CSS entry
│   └── main.tsx             # React DOM root entry
├── static/                  # Static frontend modules & assets
├── firebase-applet-config.json # Firebase project environment configuration
├── firebase-blueprint.json # Firestore initial schema blueprint
├── firestore.rules          # Firestore security rules
├── server.ts                # Full-stack Express server entry point
├── vite.config.ts           # Vite configuration
├── package.json             # NPM dependencies and scripts
└── .env.example             # Environment variables template
```

## 📡 Backend API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/patients` | `GET`, `POST` | List or register patients |
| `/api/doctors` | `GET`, `POST` | Fetch or add doctor profiles |
| `/api/appointments` | `GET`, `POST` | Schedule and view appointments |
| `/api/medical-records` | `GET`, `POST` | Manage patient medical records |
| `/api/prescriptions` | `GET`, `POST` | Generate & view digital prescriptions |
| `/api/billing` | `GET`, `POST` | Generate patient invoices & payment tracking |
| `/api/ai/analyze` | `POST` | Gemini AI clinical symptom & record triage analysis |
| `/api/dashboard/stats` | `GET` | Get real-time hospital operational analytics |

