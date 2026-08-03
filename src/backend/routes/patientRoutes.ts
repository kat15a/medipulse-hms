import { Router } from 'express';
import { PatientController } from '../controllers/patientController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', PatientController.getAll);
router.get('/:id', PatientController.getById);
router.post('/', requireRole(['ADMIN', 'DOCTOR']), PatientController.create);
router.put('/:id', requireRole(['ADMIN', 'DOCTOR']), PatientController.update);
router.delete('/:id', requireRole(['ADMIN']), PatientController.delete);

export default router;
