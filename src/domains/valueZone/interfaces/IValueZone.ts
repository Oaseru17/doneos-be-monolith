import { Priority } from '../enums/Priority';
import { Document, Types } from 'mongoose';

export interface IValueZone extends Document {
  name: string;
  description?: string;
  priority: Priority;
  calendarIntegrationId?: Types.ObjectId | string | null;
  userId: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
} 