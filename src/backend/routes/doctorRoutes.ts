import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', DoctorController.getAll);
router.get('/:id', DoctorController.getById);
router.post('/', requireRole(['ADMIN']), DoctorController.create);
router.put('/:id', requireRole(['ADMIN', 'DOCTOR']), DoctorController.update);
router.delete('/:id', requireRole(['ADMIN']), DoctorController.delete);

export default router;
