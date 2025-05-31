import { injectable } from 'tsyringe';
import { User, IUser } from '../models/User';
import { UserRepository } from '../repositories/UserRepository';
import bcrypt from 'bcrypt';
import { EmailVerificationRepository } from '../repositories/EmailVerificationRepository';
import { RegisterUserDto } from '../interfaces/RegisterUserDto';
import LOG from '../../../library/logging';
import mongoose from 'mongoose';

@injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private emailVerificationRepository: EmailVerificationRepository
  ) {}

  async register(data: RegisterUserDto): Promise<IUser> {
    try {
      // Check if user exists
      const existingUser = await this.userRepository.findByEmail(data.email);
      if (existingUser) {
        throw new Error('Email already exists');
      }

      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Create new user
      const user = new User({
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        isEmailVerified: false
      });

      // Save user
      const savedUser = await this.userRepository.create(user);
      LOG.info(`User registered successfully: ${savedUser.email}`);

      try {
        // Create email verification entry with 6-digit code
        const verification = await this.emailVerificationRepository.createVerification(
          savedUser._id as mongoose.Types.ObjectId
        );
        LOG.info(`Created email verification for user: ${savedUser._id} with code: ${verification.verificationCode}`);
        
        // In a real application, you would send this code via email here
        // For development/testing purposes, we're logging it
        LOG.info(`Verification code for ${savedUser.email}: ${verification.verificationCode}`);
      } catch (error) {
        LOG.error(`Failed to create email verification for user: ${savedUser._id}`, error);
        // We don't throw here to avoid failing the registration process
        // The verification can be resent later
      }

      return savedUser;
    } catch (error) {
      LOG.error('Error in register service:', error);
      throw error;
    }
  }

  /**
   * Login a user with email and password
   * @param email User's email
   * @param password User's password
   * @returns The user if login successful, null otherwise
   */
  async login(email: string, password: string): Promise<IUser | null> {
    try {
      // Find user by email
      const user = await this.userRepository.findByEmail(email);
      
      if (!user) {
        LOG.warn(`Login attempt with non-existent email: ${email}`);
        return null;
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        LOG.warn(`Login attempt with invalid password for user: ${email}`);
        return null;
      }
      
      LOG.info(`User logged in successfully: ${email}`);
      
      // Return user without password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;
      
      return userWithoutPassword;
    } catch (error) {
      LOG.error('Error in login service:', error);
      throw error;
    }
  }

  /**
   * Verify a user's email with a verification code
   * @param verificationCode The 6-digit verification code
   * @returns The updated user or null if verification failed
   */
  async verifyEmail(verificationCode: string): Promise<IUser | null> {
    try {
      // Find the verification entry
      const verification = await this.emailVerificationRepository.findByCode(verificationCode);
      
      if (!verification) {
        LOG.warn(`Invalid verification code: ${verificationCode}`);
        return null;
      }
      
      // Delete the verification code
      await this.emailVerificationRepository.deleteByCode(verificationCode);
      
      // Update user's email verification status
      const updatedUser = await this.userRepository.verifyEmail(verification.userId.toString());
      
      if (updatedUser) {
        LOG.info(`Email verified for user: ${updatedUser._id}`);
      }
      
      return updatedUser;
    } catch (error) {
      LOG.error('Error in verifyEmail service:', error);
      throw error;
    }
  }

  /**
   * Resend verification email to a user
   * @param userId The ID of the user
   * @returns True if verification was sent, false if user not found or already verified
   */
  async resendVerification(userId: string): Promise<boolean> {
    try {
      // Find the user
      const user = await this.userRepository.findById(userId);
      
      if (!user) {
        LOG.warn(`User not found for resend verification: ${userId}`);
        return false;
      }
      
      // Check if email is already verified
      if (user.isEmailVerified) {
        LOG.info(`Email already verified for user: ${userId}`);
        return false;
      }
      
      // Create a new verification code
      const verification = await this.emailVerificationRepository.createVerification(
        new mongoose.Types.ObjectId(userId)
      );
      
      LOG.info(`Resent verification code for user: ${userId} with code: ${verification.verificationCode}`);
      
      // In a real application, you would send this code via email here
      // For development/testing purposes, we're logging it
      LOG.info(`Verification code for ${user.email}: ${verification.verificationCode}`);
      
      return true;
    } catch (error) {
      LOG.error(`Error resending verification for user: ${userId}`, error);
      throw error;
    }
  }
} 