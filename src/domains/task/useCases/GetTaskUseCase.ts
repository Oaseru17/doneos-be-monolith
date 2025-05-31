import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class GetTaskUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(taskId: string): Promise<ITask | null> {
    return await this.taskRepository.findById(taskId);
  }
}