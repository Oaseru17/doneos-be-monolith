import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { Task, ITask } from '../models/Task';
import { BaseRepository } from '../../common/repositories/BaseRepository';
import { ITaskRepository } from '../interfaces/ITaskRepository';
@injectable()
export class TaskRepository extends BaseRepository<ITask> implements ITaskRepository {
  constructor() {
    super(Task);
  }

  async findWithFilters(filters: {
    userId: string;
    valueZoneId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    deadline?: Date;
    scheduledStart?: Date;
    scheduledEnd?: Date;
  }): Promise<ITask[]> {
    const { userId, valueZoneId, status, startDate, endDate, deadline, scheduledStart, scheduledEnd } = filters;
    const query: any = { userId: new Types.ObjectId(userId) };

    if (valueZoneId) {
      query.valueZoneId = new Types.ObjectId(valueZoneId);
    }

    if (status) {
      query.status = status;
    }

    if (startDate) {
      query.scheduledStart = { $gte: startDate };
    }

    if (endDate) {
      query.scheduledStart = { $lte: endDate };
    }

    if (deadline) {
      query.deadline = { $lte: deadline };
    }

    if (scheduledStart) {
      query.scheduledStart = { $gte: scheduledStart };
    }

    if (scheduledEnd) {
      query.scheduledStart = { $lte: scheduledEnd };
    }

    return this.find(query);
  }
  
  async removeSubtask(taskId: string, subtaskId: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(taskId, { $pull: { subtasks: { subtaskId: new Types.ObjectId(subtaskId) } } }, { new: true });
    return result !== null;
  }

  async updateSubtaskOrder(taskId: string, subtaskId: string, order: number): Promise<ITask | null> {
    // First find the task to get the current subtasks array
    const task = await this.model.findById(taskId);
    if (!task) {
      return null;
    }

    // Find the index of the subtask in the array
    const subtaskIndex = task.subtasks.findIndex(
      subtask => subtask.subtaskId.toString() === subtaskId
    );

    if (subtaskIndex === -1) {
      return null;
    }

    // Update the order of the specific subtask
    const result = await this.model.findByIdAndUpdate(
      taskId,
      {
        $set: {
          [`subtasks.${subtaskIndex}.order`]: order
        }
      },
      { new: true }
    );

    return result;
  }
  
  async findByUserId(userId: string): Promise<ITask[]> {
    return this.find({ userId: new Types.ObjectId(userId) });
  }

  async findByValueZoneId(valueZoneId: string): Promise<ITask[]> {
    return this.find({ 
      valueZoneId: new Types.ObjectId(valueZoneId)
    });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<ITask | null> {
    return this.findOne({ 
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    });
  }

  async findScheduledTasks(userId: string, startDate: Date, endDate: Date): Promise<ITask[]> {
    return this.find({
      userId: new Types.ObjectId(userId),
      scheduledStart: { $gte: startDate, $lte: endDate }
    });
  }

  async findTasksWithDeadline(userId: string, deadline: Date): Promise<ITask[]> {
    return this.find({
      userId: new Types.ObjectId(userId),
      deadline: { $lte: deadline },
      status: 'PENDING'
    });
  }

  async updateTaskStatus(id: string, status: 'PENDING' | 'COMPLETED' | 'MISSED'): Promise<ITask | null> {
    return this.update(id, { status });
  }

  async updateTaskSchedule(id: string, scheduledStart: Date, scheduledEnd: Date): Promise<ITask | null> {
    return this.update(id, { scheduledStart, scheduledEnd });
  }

  async findSubtasks(taskId: string): Promise<ITask[]> {
    // First get the main task to find its subtask references
    const mainTask = await Task.findById(taskId);
    if (!mainTask) {
      return [];
    }
  
    // Get all subtask IDs from the main task
    const subtaskIds = mainTask.subtasks.map(subtask => subtask.subtaskId);
  
    // Return all tasks that are referenced as subtasks
    return await Task.find({
      _id: { $in: subtaskIds }
    }).sort({ 'subtasks.order': 1 });
  }

  async addSubtask(taskId: string, subtaskId: string, order: number): Promise<ITask | null> {
    return this.model.findByIdAndUpdate(
      taskId,
      { $push: { subtasks: { subtaskId: new Types.ObjectId(subtaskId), order } } },
      { new: true }
    );
  }

  async updateSubtaskStatus(taskId: string, subtaskId: string, status: 'PENDING' | 'COMPLETED' | 'SKIPPED'): Promise<ITask | null> {
    return this.model.findByIdAndUpdate(
      taskId,
      { $set: { [`subtasks.${subtaskId}.status`]: status } },
      { new: true }
    );
  }

  async deleteMany(ids: string[]): Promise<boolean> {
    const result = await this.model.deleteMany({ _id: { $in: ids.map(id => new Types.ObjectId(id)) } });
    return result.deletedCount === ids.length;
  }
} 