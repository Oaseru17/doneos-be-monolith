import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import { Types } from 'mongoose';

interface CreateSubtaskDTO {
  title: string;
  description?: string;
  valueZoneId: string;
  scheduledStart?: Date;
  brainpower: 'HIGH' | 'MEDIUM' | 'LOW';
  timeFixed?: boolean;
  multitaskAllowed?: boolean;
  effortEstimateMinutes?: number;
  priority?: 'AUTO' | 'LOW' | 'MEDIUM' | 'HIGH';
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'MISSED' | 'CLOSED';
  tags?: string[];
  isRecurring?: boolean;
  recurrencePattern?: string;
  dependencyIds?: string[];
  metadata?: Record<string, any>;
  order: number;
  mainTaskId: string;
  userId: string;
}

@injectable()
export class CreateSubtaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: CreateSubtaskDTO): Promise<ITask> {
    // First, verify that the main task exists and belongs to the user
    const mainTask = await this.taskRepository.findById(data.mainTaskId);
    if (!mainTask) {
      throw new Error('Main task not found');
    }

    if (mainTask.userId.toString() !== data.userId) {
      throw new Error('Unauthorized to add subtask to this task');
    }

    // Create the subtask
    const subtask = await this.taskRepository.create({
			title: data.title,
			description: data.description,
			valueZoneId: new Types.ObjectId(data.valueZoneId),
			scheduledStart: data.scheduledStart,
			brainpower: data.brainpower,
			timeFixed: data.timeFixed,
			multitaskAllowed: data.multitaskAllowed,
			effortEstimateMinutes: data.effortEstimateMinutes,
			priority: data.priority,
			status: data.status,
			tags: data.tags,
			isRecurring: data.isRecurring,
			recurrencePattern: data.recurrencePattern,
			dependencyIds: data.dependencyIds?.map(id => new Types.ObjectId(id)) || [],
			metadata: data.metadata,
			subtasks: [],
			userId: new Types.ObjectId(data.userId),
			createdAt: new Date(),
			updatedAt: new Date()
		});

    // Add the subtask reference to the main task
    await this.taskRepository.addSubtask(data.mainTaskId, subtask._id, data.order);

    return subtask;
  }
}