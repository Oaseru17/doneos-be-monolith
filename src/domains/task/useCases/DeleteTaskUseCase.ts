import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../interfaces/ITaskRepository';

interface DeleteTaskDTO {
  taskId: string;
  userId: string;
	deleteSubtasks: boolean;
}

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: DeleteTaskDTO): Promise<boolean> {
    const { taskId, userId, deleteSubtasks } = data;

    // Verify that the task exists and belongs to the user
    const task = await this.taskRepository.findById(taskId);
		const taskIds = [taskId];
    if (!task) {
      throw new Error('Task not found');
    }

    if (task.userId.toString() !== userId) {
      throw new Error('Unauthorized to modify this task');
    }

		if (deleteSubtasks) {
			// Delete all subtasks
			const subtasks = await this.taskRepository.findSubtasks(taskId);
			taskIds.push(...subtasks.map(subtask => subtask._id.toString()));
		}

    return await this.taskRepository.deleteMany(taskIds);
  }
}