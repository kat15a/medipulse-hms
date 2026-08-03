import { Router } from 'express';
import authRoutes from './authRoutes.js';
import patientRoutes from './patientRoutes.js';
import doctorRoutes from './doctorRoutes.js';
import appointmentRoutes from './appointmentRoutes.js';
import prescriptionRoutes from './prescriptionRoutes.js';
import billingRoutes from './billingRoutes.js';
import medicalRecordRoutes from './medicalRecordRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import aiRoutes from './aiRoutes.js';
import storageRoutes from './storageRoutes.js';

const apiRouter = Router();

apiRouter.use('/users', authRoutes);
apiRouter.use('/auth', authRoutes);
apiRouter.use('/patients', patientRoutes);
apiRouter.use('/doctors', doctorRoutes);
apiRouter.use('/appointments', appointmentRoutes);
apiRouter.use('/prescriptions', prescriptionRoutes);
apiRouter.use('/billing', billingRoutes);
apiRouter.use('/billings', billingRoutes);
apiRouter.use('/medical-records', medicalRecordRoutes);
apiRouter.use('/medicalRecords', medicalRecordRoutes);
apiRouter.use('/dashboard', dashboardRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/storage', storageRoutes);

export default apiRouter;
