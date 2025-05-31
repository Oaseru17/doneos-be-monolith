import { Schema, model, Document, Types } from 'mongoose';

export interface IUserPreferences extends Document {
  userId: Types.ObjectId;
  multitaskDuringMeetings: boolean;
  defaultTaskDuration: number;
  schedulingWindowDays: number;
  workingHours: {
    start: string;
    end: string;
  };
  timeZone: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    multitaskDuringMeetings: {
      type: Boolean,
      default: false
    },
    defaultTaskDuration: {
      type: Number,
      default: 60 // minutes
    },
    schedulingWindowDays: {
      type: Number,
      default: 7
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00'
      },
      end: {
        type: String,
        default: '17:00'
      }
    },
    timeZone: {
      type: String,
      default: 'UTC'
    }
  },
  {
    timestamps: true
  }
);

// Indexes
UserPreferencesSchema.index({ userId: 1 }, { unique: true });

export const UserPreferences = model<IUserPreferences>('UserPreferences', UserPreferencesSchema); 