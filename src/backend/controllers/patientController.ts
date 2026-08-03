import { Request, Response } from 'express';
import { PatientService } from '../services/patientService.js';

export class PatientController {
  static async getAll(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || '';
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const result = await PatientService.getAllPatients({ search, page, limit });
      return res.json(result.patients);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const patient = await PatientService.getPatientById(req.params.id);
      if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
      return res.json(patient);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, email } = req.body;
      if (!name || !email) {
        return res.status(400).json({ success: false, message: 'Name and email are required' });
      }
      const newPatient = await PatientService.createPatient(req.body);
      return res.status(201).json(newPatient);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await PatientService.updatePatient(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await PatientService.deletePatient(req.params.id);
      return res.json({ success: true, message: 'Patient deleted successfully' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
