import { injectable } from 'tsyringe';
import { ValueZoneRepository } from '../repositories/ValueZoneRepository';

@injectable()
export class ListValueZonesUseCase {
  constructor(private valueZoneRepository: ValueZoneRepository) {}

  async execute(userId: string): Promise<any[]> {
    return await this.valueZoneRepository.findByUserId(userId);
  }
} 