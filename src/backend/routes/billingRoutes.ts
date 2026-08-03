import { Router } from 'express';
import { BillingController } from '../controllers/billingController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.get('/', BillingController.getAll);
router.get('/revenue', requireRole(['ADMIN']), BillingController.getRevenue);
router.get('/:id', BillingController.getById);
router.post('/', requireRole(['ADMIN', 'DOCTOR']), BillingController.create);
router.put('/:id/status', requireRole(['ADMIN', 'DOCTOR']), BillingController.updateStatus);

export default router;
