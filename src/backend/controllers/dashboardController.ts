import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboardService.js';

export class DashboardController {
  static async getSummary(req: Request, res: Response) {
    try {
      const summary = await DashboardService.getSummaryStats();
      return res.json(summary);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
