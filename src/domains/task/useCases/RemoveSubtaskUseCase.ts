import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../interfaces/ITaskRepository';

interface RemoveSubtaskDTO {
  mainTaskId: string;
  subtaskId: string;
  userId: string;
  deleteTask: boolean;
}

@injectable()
export class RemoveSubtaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: RemoveSubtaskDTO): Promise<boolean> {
    // Verify that the main task exists and belongs to the user
    const mainTask = await this.taskRepository.findById(data.mainTaskId);
    if (!mainTask) {
      throw new Error('Main task not found');
    }

    if (mainTask.userId.toString() !== data.userId) {
      throw new Error('Unauthorized to modify this task');
    }

    // Verify that the subtask exists and belongs to the user
    const subtask = await this.taskRepository.findById(data.subtaskId);
    if (!subtask) {
      throw new Error('Subtask not found');
    }

    if (subtask.userId.toString() !== data.userId) {
      throw new Error('Unauthorized to modify this subtask');
    }

    // Remove the subtask reference from the main task
    const success = await this.taskRepository.removeSubtask(data.mainTaskId, data.subtaskId);
    if (!success) {
      throw new Error('Failed to remove subtask reference');
    }

    // If deleteTask flag is true, delete the actual task
    if (data.deleteTask) {
      const deleteSuccess = await this.taskRepository.delete(data.subtaskId);
      if (!deleteSuccess) {
        throw new Error('Failed to delete subtask');
      }
    }

    return true;
  }
}