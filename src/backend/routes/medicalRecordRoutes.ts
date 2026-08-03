import { Router } from 'express';
import { MedicalRecordController } from '../controllers/medicalRecordController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', MedicalRecordController.getAll);
router.get('/:id', MedicalRecordController.getById);
router.post('/', requireRole(['ADMIN', 'DOCTOR']), MedicalRecordController.create);
router.put('/:id', requireRole(['ADMIN', 'DOCTOR']), MedicalRecordController.update);
router.delete('/:id', requireRole(['ADMIN']), MedicalRecordController.delete);

export default router;
