import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);
router.get('/summary', DashboardController.getSummary);

export default router;
