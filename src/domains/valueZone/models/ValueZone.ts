import mongoose, { Schema } from 'mongoose';
import { IValueZone } from '../interfaces/IValueZone';
import { Priority } from '../enums/Priority';

const ValueZoneSchema = new Schema<IValueZone>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    priority: {
      type: String,
      enum: Object.values(Priority),
      required: true
    },
    calendarIntegrationId: {
      type: String,
      default: null
    },
    userId: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    _id: true
  }
);

ValueZoneSchema.index({ userId: 1, priority: 1 });

export const ValueZone = mongoose.model<IValueZone>('ValueZone', ValueZoneSchema); 