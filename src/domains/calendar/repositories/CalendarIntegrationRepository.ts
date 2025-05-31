import { Model } from 'mongoose';
import { ICalendarIntegration } from '../models/CalendarIntegration';
import { BaseRepository } from '../../../common/repositories/BaseRepository';

export class CalendarIntegrationRepository extends BaseRepository<ICalendarIntegration> {
  constructor(model: Model<ICalendarIntegration>) {
    super(model);
  }

  async findByProgramId(programId: string): Promise<ICalendarIntegration | null> {
    return this.model.findOne({ programId });
  }

  async findByProvider(provider: string): Promise<ICalendarIntegration[]> {
    return this.model.find({ provider });
  }

  async updateTokens(
    id: string,
    accessToken: string,
    refreshToken: string,
    expiration: Date
  ): Promise<ICalendarIntegration | null> {
    return this.model.findByIdAndUpdate(
      id,
      {
        accessToken,
        refreshToken,
        expiration,
      },
      { new: true }
    );
  }

  async deleteByProgramId(programId: string): Promise<boolean> {
    const result = await this.model.deleteOne({ programId });
    return result.deletedCount === 1;
  }
} 