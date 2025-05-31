import { Schema, model, Document, Types } from 'mongoose';
import { encrypt, decrypt } from '../../common/utils/encryption';

export interface ICalendarIntegration extends Document {
  programId: Types.ObjectId;
  provider: 'GOOGLE' | 'OUTLOOK' | 'ICLOUD';
  accessToken: string;
  refreshToken: string;
  expiration: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarIntegrationSchema = new Schema<ICalendarIntegration>(
  {
    programId: {
      type: Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
      unique: true
    },
    provider: {
      type: String,
      enum: ['GOOGLE', 'OUTLOOK', 'ICLOUD'],
      required: true
    },
    accessToken: {
      type: String,
      required: true,
      get: (token: string) => decrypt(token),
      set: (token: string) => encrypt(token)
    },
    refreshToken: {
      type: String,
      required: true,
      get: (token: string) => decrypt(token),
      set: (token: string) => encrypt(token)
    },
    expiration: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
  }
);

// Indexes
CalendarIntegrationSchema.index({ programId: 1 }, { unique: true });
CalendarIntegrationSchema.index({ provider: 1 });

export const CalendarIntegration = model<ICalendarIntegration>('CalendarIntegration', CalendarIntegrationSchema); 