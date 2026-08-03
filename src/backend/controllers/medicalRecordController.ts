import { Request, Response } from 'express';
import { MedicalRecordService } from '../services/medicalRecordService.js';

export class MedicalRecordController {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await MedicalRecordService.getAllRecords();
      return res.json(items);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await MedicalRecordService.getRecordById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Record not found' });
      return res.json(item);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { patientName, doctorName, diagnosis } = req.body;
      if (!patientName || !diagnosis) {
        return res.status(400).json({ success: false, message: 'patientName and diagnosis required' });
      }
      const created = await MedicalRecordService.createRecord(req.body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await MedicalRecordService.updateRecord(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await MedicalRecordService.deleteRecord(req.params.id);
      return res.json({ success: true, message: 'Medical record deleted' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
