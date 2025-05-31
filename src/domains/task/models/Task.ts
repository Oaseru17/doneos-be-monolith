import { Schema, model, Document, Types } from 'mongoose';

export interface ISubtask extends Document {
  order: number;
  subtaskId: Types.ObjectId;
}

export interface ITask extends Document {
  _id: string;
  title: string;
  description?: string;
  valueZoneId: Types.ObjectId;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  deadline?: Date;
  brainpower: 'HIGH' | 'MEDIUM' | 'LOW';
  timeFixed: boolean;
  multitaskAllowed: boolean;
  effortEstimateMinutes: number;
  priority: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'CLOSED';
  tags: string[];
  isRecurring: boolean;
  recurrencePattern?: string;
  dependencyIds: Types.ObjectId[];
  metadata: Record<string, any>;
  subtasks: ISubtask[];
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const SubtaskSchema = new Schema<ISubtask>(
  {
    order: {
      type: Number,
      required: true
    },
    subtaskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const TaskSchema = new Schema<ITask>(
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
    valueZoneId: {
      type: Schema.Types.ObjectId,
      ref: 'ValueZone',
      required: true
    },
    scheduledStart: {
      type: Date
    },
    status: {
      type: String,
      enum: ['PENDING', 'COMPLETED', 'SKIPPED'],
      default: 'PENDING'
    },
    tags: [{
      type: String,
      trim: true
    }],
    isRecurring: {
      type: Boolean,
      default: false
    },
    recurrencePattern: {
      type: String
    },
    dependencyIds: [{
      type: Schema.Types.ObjectId,
      ref: 'Task'
    }],
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    },
    subtasks: [SubtaskSchema],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    brainpower: {
      type: String,
      enum: ['HIGH', 'MEDIUM', 'LOW'],
      default: 'MEDIUM'
    },
    timeFixed: {
      type: Boolean,
      default: false
    },
    multitaskAllowed: {
      type: Boolean,
      default: false
    },
    effortEstimateMinutes: {
      type: Number,
      min: 0
    },
    priority: {
      type: String,
      enum: ['AUTO', 'LOW', 'MEDIUM', 'HIGH'],
      default: 'AUTO'
    },
    
  },
  {
    timestamps: true,
    _id: true
  }
);

// Indexes
TaskSchema.index({ userId: 1, valueZoneId: 1 });
TaskSchema.index({ userId: 1, status: 1 });
TaskSchema.index({ userId: 1, deadline: 1 });
TaskSchema.index({ userId: 1, scheduledStart: 1 });

export const Task = model<ITask>('Task', TaskSchema); 