import { injectable } from 'tsyringe';
import { User, IUser } from '../models/User';
import { BaseRepository } from '../../common/repositories/BaseRepository';

@injectable()
export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async verifyEmail(userId: string): Promise<IUser | null> {
    return this.update(userId, { isEmailVerified: true });
  }
} 