import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

interface UpdateSubtaskOrderDTO {
  mainTaskId: string;
  subtaskId: string;
  order: number;
  userId: string;
}

@injectable()
export class UpdateSubtaskOrderUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: UpdateSubtaskOrderDTO): Promise<ITask> {
    // Verify that the main task exists and belongs to the user
    const mainTask = await this.taskRepository.findById(data.mainTaskId);
    if (!mainTask) {
      throw new Error('Main task not found');
    }

    if (mainTask.userId.toString() !== data.userId) {
      throw new Error('Unauthorized to modify this task');
    }

    // Verify that the subtask exists in the main task
    const subtaskExists = mainTask.subtasks.some(
      subtask => subtask.subtaskId.toString() === data.subtaskId
    );

    if (!subtaskExists) {
      throw new Error('Subtask not found in main task');
    }

    // Update the subtask order
    const updatedTask = await this.taskRepository.updateSubtaskOrder(
      data.mainTaskId,
      data.subtaskId,
      data.order
    );

    if (!updatedTask) {
      throw new Error('Failed to update subtask order');
    }

    return updatedTask;
  }
}