import { Schema, model, Document, Types } from 'mongoose';

export interface ICalendarEvent extends Document {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  valueZoneId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  calendarId: Types.ObjectId;
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const CalendarEventSchema = new Schema<ICalendarEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    startTime: {
      type: Date,
      required: true
    },
    endTime: {
      type: Date,
      required: true
    },
    valueZoneId: {
      type: Schema.Types.ObjectId,
      ref: 'ValueZone'
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes
CalendarEventSchema.index({ userId: 1, valueZoneId: 1 });
CalendarEventSchema.index({ userId: 1, startTime: 1, endTime: 1 });

export const CalendarEvent = model<ICalendarEvent>('CalendarEvent', CalendarEventSchema); 