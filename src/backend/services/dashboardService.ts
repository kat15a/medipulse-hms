import { PatientService } from './patientService.js';
import { DoctorService } from './doctorService.js';
import { AppointmentService } from './appointmentService.js';
import { BillingService } from './billingService.js';
import { MedicalRecordService } from './medicalRecordService.js';

export class DashboardService {
  static async getSummaryStats() {
    const todayStr = new Date().toISOString().split('T')[0];

    const [patientsRes, doctors, appointments, revenueData, records] = await Promise.all([
      PatientService.getAllPatients({ limit: 1000 }),
      DoctorService.getAllDoctors(),
      AppointmentService.getAllAppointments(),
      BillingService.calculateRevenue(),
      MedicalRecordService.getAllRecords(),
    ]);

    const todayAppointments = appointments.filter(a => a.date === todayStr);

    const recentActivities = [
      ...appointments.slice(0, 5).map(a => ({
        type: 'APPOINTMENT',
        text: `Appointment for ${a.patientName} with ${a.doctorName} (${a.status})`,
        time: a.date,
      })),
      ...records.slice(0, 5).map(r => ({
        type: 'MEDICAL_RECORD',
        text: `Diagnosis recorded for ${r.patientName}: ${r.diagnosis}`,
        time: r.date,
      })),
    ].sort((a, b) => (a.time < b.time ? 1 : -1)).slice(0, 8);

    return {
      totalPatients: patientsRes.total,
      totalDoctors: doctors.length,
      totalAppointments: appointments.length,
      todayAppointmentsCount: todayAppointments.length,
      todayAppointments: todayAppointments,
      revenue: revenueData.totalRevenue,
      revenueMetrics: revenueData,
      totalMedicalRecords: records.length,
      recentActivities,
    };
  }
}
