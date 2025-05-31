import { injectable } from 'tsyringe';
import { EmailVerification, IEmailVerification } from '../models/EmailVerification';
import mongoose from 'mongoose';
import LOG from '../../../library/logging';

@injectable()
export class EmailVerificationRepository {
  /**
   * Create a new email verification entry
   * @param userId The ID of the user to verify
   * @param expiresInHours Number of hours until the verification code expires
   * @returns The created email verification document
   */
  async createVerification(userId: mongoose.Types.ObjectId, expiresInHours: number = 24): Promise<IEmailVerification> {
    // Delete all previous verifications for this user
    await this.deleteUserVerifications(userId);
    
    // Set expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    // Generate a unique verification code
    let verificationCode = this.generateVerificationCode();
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 5;

    // Try to generate a unique code
    while (!isUnique && attempts < maxAttempts) {
      // Check if the code already exists
      const existingCode = await EmailVerification.findOne({ verificationCode });
      if (!existingCode) {
        isUnique = true;
      } else {
        attempts++;
        LOG.warn(`Duplicate verification code generated: ${verificationCode}. Attempt ${attempts} of ${maxAttempts}`);
        verificationCode = this.generateVerificationCode();
      }
    }

    // If we couldn't generate a unique code after max attempts, use a timestamp-based code
    if (!isUnique) {
      verificationCode = this.generateTimestampBasedCode();
      LOG.info(`Using timestamp-based verification code: ${verificationCode}`);
    }

    // Create new verification
    const verification = new EmailVerification({
      userId,
      verificationCode,
      expiresAt
    });

    try {
      return await verification.save();
    } catch (error: any) {
      // Handle potential race condition where the code was created by another process
      if (error.code === 11000) { // MongoDB duplicate key error
        LOG.error(`Duplicate key error when saving verification code: ${verificationCode}`);
        // Generate a new code with timestamp to ensure uniqueness
        verification.verificationCode = this.generateTimestampBasedCode();
        return await verification.save();
      }
      throw error;
    }
  }

  /**
   * Generate a 6-digit verification code
   * @returns A 6-digit verification code
   */
  private generateVerificationCode(): string {
    // Generate a random 6-digit number
    const min = 100000;
    const max = 999999;
    const code = Math.floor(Math.random() * (max - min + 1)) + min;
    return code.toString();
  }

  /**
   * Generate a verification code based on timestamp to ensure uniqueness
   * @returns A unique verification code
   */
  private generateTimestampBasedCode(): string {
    // Use timestamp + random number to ensure uniqueness
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${timestamp}${random}`.slice(0, 6);
  }

  /**
   * Delete all verifications for a user
   * @param userId The ID of the user
   * @returns The number of deleted verifications
   */
  async deleteUserVerifications(userId: mongoose.Types.ObjectId): Promise<number> {
    const result = await EmailVerification.deleteMany({ userId });
    return result.deletedCount || 0;
  }

  /**
   * Find a verification by code
   * @param verificationCode The verification code
   * @returns The email verification document or null if not found
   */
  async findByCode(verificationCode: string): Promise<IEmailVerification | null> {
    return await EmailVerification.findOne({ 
      verificationCode,
      expiresAt: { $gt: new Date() } // Only return non-expired verifications
    });
  }

  /**
   * Delete a verification by code
   * @param verificationCode The verification code
   * @returns The deleted email verification document or null if not found
   */
  async deleteByCode(verificationCode: string): Promise<IEmailVerification | null> {
    return await EmailVerification.findOneAndDelete({ verificationCode });
  }

  /**
   * Delete expired verifications
   * @returns The number of deleted documents
   */
  async deleteExpiredVerifications(): Promise<number> {
    const result = await EmailVerification.deleteMany({
      expiresAt: { $lt: new Date() }
    });
    return result.deletedCount || 0;
  }
} 