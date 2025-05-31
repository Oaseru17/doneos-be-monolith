import { injectable } from 'tsyringe';
import { ValueZoneRepository } from '../repositories/ValueZoneRepository';
import { Priority } from '../enums/Priority';

@injectable()
export class UpdateValueZoneUseCase {
  constructor(private valueZoneRepository: ValueZoneRepository) {}

  async execute(
    id: string,
    userId: string,
    data: {
      name?: string;
      description?: string;
      priority?: Priority;
    }
  ): Promise<any> {
    const valueZone = await this.valueZoneRepository.findByIdAndUserId(id, userId);
    if (!valueZone) {
      throw new Error('Value zone not found');
    }
    return await this.valueZoneRepository.update(id, data);
  }
} 