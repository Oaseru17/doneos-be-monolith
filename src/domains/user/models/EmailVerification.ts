import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailVerification extends Document {
  userId: mongoose.Types.ObjectId;
  verificationCode: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<IEmailVerification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    verificationCode: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Create a compound index for efficient queries
EmailVerificationSchema.index({ userId: 1, expiresAt: 1 });

// Ensure verification code is unique
EmailVerificationSchema.index({ verificationCode: 1 }, { unique: true });

export const EmailVerification = mongoose.model<IEmailVerification>('EmailVerification', EmailVerificationSchema); 