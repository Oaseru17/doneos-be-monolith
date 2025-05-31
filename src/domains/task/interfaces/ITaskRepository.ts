import { ITask } from '../models/Task';
import { Types } from 'mongoose';

export interface ITaskRepository {
  create(task: Partial<ITask>): Promise<ITask>;
  findById(id: string): Promise<ITask | null>;
  findByUserId(userId: string): Promise<ITask[]>;
  findByValueZoneId(valueZoneId: string): Promise<ITask[]>;
  update(id: string, task: Partial<ITask>): Promise<ITask | null>;
  delete(id: string): Promise<boolean>;
	deleteMany(ids: string[]): Promise<boolean>;
  findWithFilters(filters: {
    userId: string;
    valueZoneId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    deadline?: Date;
    scheduledStart?: Date;
    scheduledEnd?: Date;
  }): Promise<ITask[]>;
	findSubtasks(taskId: string): Promise<ITask[]>;
	addSubtask(taskId: string, subtaskId: any, order: number): Promise<ITask | null>;
	removeSubtask(taskId: string, subtaskId: string): Promise<boolean>;
	updateSubtaskOrder(taskId: string, subtaskId: string, order: number): Promise<ITask | null>;
	updateSubtaskStatus(taskId: string, subtaskId: string, status: string): Promise<ITask | null>;
}