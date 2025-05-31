import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class ListSubtasksUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(taskId: string): Promise<ITask[]> {
    return await this.taskRepository.findSubtasks(taskId);
  }
}
