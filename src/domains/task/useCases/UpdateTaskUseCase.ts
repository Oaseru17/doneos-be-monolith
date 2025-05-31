import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(taskId: string, taskData: Partial<ITask>): Promise<ITask | null> {
    return await this.taskRepository.update(taskId, taskData);
  }
}