import { injectable, inject } from 'tsyringe';
import { ITask } from '../models/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';

@injectable()
export class ListTasksUseCase {
  constructor(
    @inject('ITaskRepository')
    private taskRepository: ITaskRepository
  ) {}

  async execute(filters: {
    userId: string;
    valueZoneId?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
    deadline?: Date;
    scheduledStart?: Date;
    scheduledEnd?: Date;
  }): Promise<ITask[]> {
    return await this.taskRepository.findWithFilters(filters);
  }
}