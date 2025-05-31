import { injectable } from 'tsyringe';
import { ValueZoneRepository } from '../repositories/ValueZoneRepository';

@injectable()
export class DeleteValueZoneUseCase {
  constructor(private valueZoneRepository: ValueZoneRepository) {}

  async execute(id: string, userId: string): Promise<void> {
    const valueZone = await this.valueZoneRepository.findByIdAndUserId(id, userId);
    if (!valueZone) {
      throw new Error('Value zone not found');
    }
    await this.valueZoneRepository.delete(id);
  }
} 