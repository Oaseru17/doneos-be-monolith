import { Schema, model, Document } from 'mongoose';

export interface IAIChatHistory extends Document {
  userId: string;
  message: string;
  role: 'user' | 'assistant';
  context: {
    currentProgram?: string;
    currentTask?: string;
  };
  createdAt: Date;
}

const AIChatHistorySchema = new Schema<IAIChatHistory>(
  {
    userId: {
      type: String,
      required: true,
      index: true
    },
    message: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true
    },
    context: {
      currentProgram: String,
      currentTask: String
    }
  },
  {
    timestamps: true
  }
);

// Indexes
AIChatHistorySchema.index({ userId: 1, createdAt: -1 });

export const AIChatHistory = model<IAIChatHistory>('AIChatHistory', AIChatHistorySchema); 