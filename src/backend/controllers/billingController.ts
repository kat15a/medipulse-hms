import { Request, Response } from 'express';
import { BillingService } from '../services/billingService.js';

export class BillingController {
  static async getAll(req: Request, res: Response) {
    try {
      const items = await BillingService.getAllBills();
      return res.json(items);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getById(req: Request, res: Response) {
    try {
      const item = await BillingService.getBillById(req.params.id);
      if (!item) return res.status(404).json({ success: false, message: 'Invoice not found' });
      return res.json(item);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const { patientName, consultationFee } = req.body;
      if (!patientName) {
        return res.status(400).json({ success: false, message: 'patientName required' });
      }
      const created = await BillingService.createBill(req.body);
      return res.status(201).json(created);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async updateStatus(req: Request, res: Response) {
    try {
      const { status, paymentMethod } = req.body;
      if (!status) return res.status(400).json({ success: false, message: 'Status required' });
      const updated = await BillingService.updateBillStatus(req.params.id, status, paymentMethod);
      return res.json(updated);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async getRevenue(req: Request, res: Response) {
    try {
      const revenue = await BillingService.calculateRevenue();
      return res.json(revenue);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
