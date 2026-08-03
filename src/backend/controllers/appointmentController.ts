import { Request, Response } from 'express';
import { AppointmentService } from '../services/appointmentService.js';

export class AppointmentController {
  static async getAll(req: Request, res: Response) {
    try {
      const status = req.query.status as string;
      const doctorId = req.query.doctorId as string;
      const patientId = req.query.patientId as string;
      const date = req.query.date as string;

      const items = await AppointmentService.getAllAppointments({ status, doctorId, patientId, date });
      return res.json(items);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await AppointmentService.getAppointmentById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Appointment not found' });
      return res.json(item);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { patientName, doctorName, date } = req.body;
      if (!patientName || !doctorName || !date) {
        return res.status(400).json({ success: false, message: 'patientName, doctorName and date required' });
      }
      const created = await AppointmentService.createAppointment(req.body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const updated = await AppointmentService.updateAppointment(req.params.id, req.body);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await AppointmentService.deleteAppointment(req.params.id);
      return res.json({ success: true, message: 'Appointment deleted' });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
