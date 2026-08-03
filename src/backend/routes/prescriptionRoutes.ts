import { Router } from 'express';
import { PrescriptionController } from '../controllers/prescriptionController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', PrescriptionController.getAll);
router.get('/:id', PrescriptionController.getById);
router.post('/', requireRole(['ADMIN', 'DOCTOR']), PrescriptionController.create);
router.put('/:id', requireRole(['ADMIN', 'DOCTOR']), PrescriptionController.update);
router.delete('/:id', requireRole(['ADMIN']), PrescriptionController.delete);

export default router;
