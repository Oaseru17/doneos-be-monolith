import { Request, Response } from 'express';
import { injectable } from 'tsyringe';
import { UserService } from '../services/UserService';
import LOG from '../../../library/logging';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../../../config/config';

// Extend the Express Request type to include the user property
interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    [key: string]: any;
  };
}

@injectable()
export class AuthController {
  constructor(private readonly userService: UserService) {}

  /**
   * Register a new user
   * @param req Request object
   * @param res Response object
   */
  async register(req: Request, res: Response): Promise<void> {
    try {
      console.log(req.headers);
      const user = await this.userService.register(req.body);
      const token = this.generateToken(user._id as string);
      res.status(201).json({
        user,
        token
      });
    } catch (error) {
      LOG.error('Error in register controller:', error);
      res.status(400).json({ 
        code: 'VALIDATION_ERROR', 
        message: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  }

  /**
   * Login a user
   * @param req Request object
   * @param res Response object
   */
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      
      const user = await this.userService.login(email, password);
      
      if (!user) {
        res.status(401).json({ 
          code: 'UNAUTHORIZED', 
          message: 'Invalid email or password' 
        });
        return;
      }
      
      // Generate JWT token
      const token = this.generateToken(user._id as string);
      
      res.status(200).json({
        user,
        token
      });
    } catch (error) {
      LOG.error('Error in login controller:', error);
      res.status(400).json({ 
        code: 'VALIDATION_ERROR', 
        message: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  }

  /**
   * Verify a user's email with a verification code
   * @param req Request object
   * @param res Response object
   */
  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { verificationCode } = req.body;
      
      if (!verificationCode || typeof verificationCode !== 'string') {
        res.status(400).json({ 
          code: 'VALIDATION_ERROR', 
          message: 'Verification code is required' 
        });
        return;
      }

      const user = await this.userService.verifyEmail(verificationCode);
      
      if (!user) {
        res.status(400).json({ 
          code: 'VALIDATION_ERROR', 
          message: 'Invalid or expired verification code' 
        });
        return;
      }

      res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
      LOG.error('Error in verifyEmail controller:', error);
      res.status(400).json({ 
        code: 'VALIDATION_ERROR', 
        message: error instanceof Error ? error.message : 'Email verification failed' 
      });
    }
  }

  /**
   * Resend verification email to a user
   * @param req Request object
   * @param res Response object
   */
  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.currentUser
      console.log(userId);
      
      if (!userId) {
        res.status(401).json({ 
          code: 'UNAUTHORIZED', 
          message: 'User not authenticated' 
        });
        return;
      }

      const result = await this.userService.resendVerification(userId);
      
      if (!result) {
        res.status(400).json({ 
          code: 'VALIDATION_ERROR', 
          message: 'Email already verified or user not found' 
        });
        return;
      }

      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      LOG.error('Error in resendVerification controller:', error);
      res.status(400).json({ 
        code: 'VALIDATION_ERROR', 
        message: error instanceof Error ? error.message : 'Failed to resend verification email' 
      });
    }
  }

  /**
   * Generate a JWT token for a user
   * @param userId The ID of the user
   * @returns The JWT token
   */
  private generateToken(userId: string): string {
    if (!CONFIG.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    
    return jwt.sign(
      { userId: userId },
      CONFIG.JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
} 