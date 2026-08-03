import { Request, Response } from 'express';
import { AIService } from '../services/aiService.js';

export class AIController {
  static async symptomChecker(req: Request, res: Response) {
    try {
      const { symptoms, patientAge, patientGender } = req.body;
      if (!symptoms) return res.status(400).json({ success: false, message: 'Symptoms required' });
      const result = await AIService.checkSymptoms(symptoms, patientAge, patientGender);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async predictDisease(req: Request, res: Response) {
    try {
      const { vitalSigns } = req.body;
      const result = await AIService.predictDisease(vitalSigns || req.body);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async explainPrescription(req: Request, res: Response) {
    try {
      const { diagnosis, medicines } = req.body;
      if (!diagnosis || !medicines) {
        return res.status(400).json({ success: false, message: 'Diagnosis and medicines required' });
      }
      const result = await AIService.explainPrescription(diagnosis, medicines);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async summarizeReport(req: Request, res: Response) {
    try {
      const { reportText } = req.body;
      if (!reportText) return res.status(400).json({ success: false, message: 'reportText required' });
      const result = await AIService.summarizeReport(reportText);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async chatbot(req: Request, res: Response) {
    try {
      const { message, history } = req.body;
      if (!message) return res.status(400).json({ success: false, message: 'Message required' });
      const result = await AIService.chat(message, history);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
}
