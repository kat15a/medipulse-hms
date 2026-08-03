import { Request, Response, NextFunction } from 'express';
import { auth, db } from '../config/firebase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: 'ADMIN' | 'DOCTOR' | 'PATIENT';
    fullName?: string;
  };
}

export const verifyToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Fallback for demo preview mode or unauthenticated requests where basic user context is needed
      req.user = {
        uid: 'demo-admin-uid',
        email: 'admin@medipulse.com',
        role: 'ADMIN',
        fullName: 'Admin User',
      };
      return next();
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      // Attempt Firebase Admin ID Token verification
      const decodedToken = await auth.verifyIdToken(token);
      
      // Fetch role from Firestore user document
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      const userData = userDoc.exists ? userDoc.data() : null;

      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: userData?.role || 'ADMIN',
        fullName: userData?.fullName || decodedToken.name || 'MediPulse User',
      };
      return next();
    } catch (tokenErr) {
      // Handle custom JWT or demo token
      if (token.startsWith('jwt-medipulse-') || token.startsWith('demo-token')) {
        req.user = {
          uid: 'demo-user-123',
          email: 'staff@medipulse.com',
          role: 'ADMIN',
          fullName: 'Demo Staff',
        };
        return next();
      }
      return res.status(401).json({ success: false, message: 'Invalid or expired authentication token.' });
    }
  } catch (err: any) {
    return res.status(401).json({ success: false, message: 'Authentication failed', error: err.message });
  }
};

export const requireRole = (allowedRoles: ('ADMIN' | 'DOCTOR' | 'PATIENT')[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized: User context missing.' });
    }

    if (allowedRoles.includes(req.user.role) || req.user.role === 'ADMIN') {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires one of roles: [${allowedRoles.join(', ')}]. Current role: ${req.user.role}`,
    });
  };
};
