import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', AppointmentController.getAll);
router.get('/:id', AppointmentController.getById);
router.post('/', AppointmentController.create);
router.put('/:id', AppointmentController.update);
router.delete('/:id', requireRole(['ADMIN', 'DOCTOR']), AppointmentController.delete);

export default router;
