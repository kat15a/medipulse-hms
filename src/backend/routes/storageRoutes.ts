import { Router } from 'express';
import multer from 'multer';
import { StorageController } from '../controllers/storageController.js';
import { verifyToken } from '../middleware/authMiddleware.js';

const upload = multer({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

const router = Router();

router.use(verifyToken);
router.post('/upload', upload.single('file'), StorageController.uploadFile);

export default router;
