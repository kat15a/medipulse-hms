import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const router = Router();

router.use(verifyToken);

router.post('/symptom-checker', AIController.symptomChecker);
router.post('/predict-disease', AIController.predictDisease);
router.post('/explain-prescription', AIController.explainPrescription);
router.post('/summarize-report', AIController.summarizeReport);
router.post('/chat', AIController.chatbot);

export default router;
