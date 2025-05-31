import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

interface AddExistingSubtaskDTO {
  mainTaskId: string;
  subtaskId: string;
  userId: string;
}

@injectable()
export class AddExistingSubtaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(data: AddExistingSubtaskDTO): Promise<ITask> {
    // Verify that both tasks exist and belong to the user
    const [mainTask, subtask] = await Promise.all([
      this.taskRepository.findById(data.mainTaskId),
      this.taskRepository.findById(data.subtaskId)
    ]);

    if (!mainTask || !subtask) {
      throw new Error('Task not found');
    }

    if (mainTask.userId.toString() !== data.userId || subtask.userId.toString() !== data.userId) {
      throw new Error('Unauthorized to modify these tasks');
    }

		// Check if the subtask is already a subtask of the main task
		if (mainTask.subtasks.some(st => st.subtaskId.toString() === subtask._id.toString())) {
			throw new Error('Subtask already exists');
		}

    // Get the current highest order in the main task's subtasks
    const currentSubtasks = mainTask.subtasks || [];
    const maxOrder = currentSubtasks.length > 0 
      ? Math.max(...currentSubtasks.map(st => st.order))
      : -1;

    // Add the subtask with the next order number
    const updatedMainTask = await this.taskRepository.addSubtask(
      data.mainTaskId,
      data.subtaskId,
      maxOrder + 1
    );

    if (!updatedMainTask) {
      throw new Error('Failed to add subtask');
    }

    return updatedMainTask;
  }
}