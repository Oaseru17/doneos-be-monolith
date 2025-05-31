import { CONFIG } from '../../config/config';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Define the JWT payload structure
interface JwtPayload {
  userId: string;
  [key: string]: any;
}

declare global{
	namespace Express{
		interface Request{
			currentUser: string;
		}
	}
}
	

export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, CONFIG.JWT_SECRET) as JwtPayload;
    req.currentUser = decoded.userId;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
