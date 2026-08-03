import { Request, Response } from 'express';
import { DoctorService } from '../services/doctorService.js';

export class DoctorController {
  static async getAll(req: Request, res: Response) {
    try {
      const search = (req.query.search as string) || '';
      const specialization = (req.query.specialization as string) || '';
      const doctors = await DoctorService.getAllDoctors({ search, specialization });
      return res.json(doctors);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const doc = await DoctorService.getDoctorById(req.params.id);
      if (!doc) return res.status(404).json({ success: false, message: 'Doctor not found' });
      return res.json(doc);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { name, specialization, email } = req.body;
      if (!name || !specialization || !email) {
        return res.status(400).json({ success: false, message: 'Name, specialization and email required' });
      }
      const newDoc = await DoctorService.createDoctor(req.body);
      return res.status(201).json(newDoc);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await DoctorService.updateDoctor(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await DoctorService.deleteDoctor(req.params.id);
      return res.json({ success: true, message: 'Doctor deleted' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
