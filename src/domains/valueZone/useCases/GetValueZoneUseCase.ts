import { injectable } from 'tsyringe';
import { ValueZoneRepository } from '../repositories/ValueZoneRepository';

@injectable()
export class GetValueZoneUseCase {
  constructor(private valueZoneRepository: ValueZoneRepository) {}

  async execute(id: string, userId: string): Promise<any> {
    return await this.valueZoneRepository.findByIdAndUserId(id, userId);
  }
} 