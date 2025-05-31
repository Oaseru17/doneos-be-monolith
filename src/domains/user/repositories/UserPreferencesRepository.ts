import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { UserPreferences, IUserPreferences } from '../models/UserPreferences';
import { BaseRepository } from '../../common/repositories/BaseRepository';

@injectable()
export class UserPreferencesRepository extends BaseRepository<IUserPreferences> {
  constructor() {
    super(UserPreferences);
  }

  async findByUserId(userId: string): Promise<IUserPreferences | null> {
    return this.findOne({ userId: new Types.ObjectId(userId) });
  }

  async getOrCreateDefault(userId: string): Promise<IUserPreferences> {
    const existing = await this.findByUserId(userId);
    if (existing) return existing;
    
    return this.create({ userId: new Types.ObjectId(userId) });
  }
} 