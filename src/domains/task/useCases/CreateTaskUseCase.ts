import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(taskData: Partial<ITask>): Promise<ITask> {
    return await this.taskRepository.create(taskData);
  }
}