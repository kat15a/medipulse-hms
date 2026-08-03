import { Request, Response } from 'express';
import { AuthService } from '../services/authService.js';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const { email, password, fullName, role } = req.body;
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required' });
      }
      const user = await AuthService.registerUser({ email, password, fullName, role });
      return res.status(201).json({ success: true, message: 'User registered successfully', user });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { email, username, role } = req.body;
      const targetEmail = email || (username ? `${username}@medipulse.com` : 'admin@medipulse.com');
      const result = await AuthService.loginUser(targetEmail, role);
      return res.json({ success: true, ...result });
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, message: 'Email required' });
      const result = await AuthService.resetPassword(email);
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }

  static async logout(req: Request, res: Response) {
    return res.json({ success: true, message: 'Logged out successfully' });
  }
}
