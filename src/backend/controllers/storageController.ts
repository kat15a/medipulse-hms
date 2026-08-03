import { Request, Response } from 'express';
import { StorageService } from '../services/storageService.js';

export class StorageController {
  static async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded' });
      }

      const folder = (req.body.folder as string) || 'medical_files';
      const result = await StorageService.uploadFileBuffer(
        {
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          buffer: req.file.buffer,
        },
        folder
      );

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
