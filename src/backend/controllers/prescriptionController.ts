import { Request, Response } from 'express';
import { PrescriptionService } from '../services/prescriptionService.js';

export class PrescriptionController {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await PrescriptionService.getAllPrescriptions();
      return res.json(items);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await PrescriptionService.getPrescriptionById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Prescription not found' });
      return res.json(item);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { patientName, doctorName, diagnosis } = req.body;
      if (!patientName || !doctorName || !diagnosis) {
        return res.status(400).json({ success: false, message: 'patientName, doctorName and diagnosis required' });
      }
      const created = await PrescriptionService.createPrescription(req.body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await PrescriptionService.updatePrescription(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await PrescriptionService.deletePrescription(req.params.id);
      return res.json({ success: true, message: 'Prescription deleted' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
