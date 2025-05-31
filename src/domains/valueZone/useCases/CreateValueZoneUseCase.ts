import { injectable } from 'tsyringe';
import { ValueZoneRepository } from '../repositories/ValueZoneRepository';
import { Priority } from '../enums/Priority';

@injectable()
export class CreateValueZoneUseCase {
  constructor(private valueZoneRepository: ValueZoneRepository) {}

  async execute(data: {
    name: string;
    description?: string;
    priority: Priority;
    userId: string;
  }): Promise<any> {
    return await this.valueZoneRepository.create(data);
  }
} 