import { BaseRepository } from '../../../common/repositories/BaseRepository';
import { ICalendarEvent } from '../models/CalendarEvent';
import { Types } from 'mongoose';

export class CalendarEventRepository extends BaseRepository<ICalendarEvent> {
  async findByValueZoneId(valueZoneId: Types.ObjectId, userId: Types.ObjectId): Promise<ICalendarEvent[]> {
    return this.find({ valueZoneId, userId });
  }

  async findByDateRange(
    userId: Types.ObjectId,
    startDate: Date,
    endDate: Date
  ): Promise<ICalendarEvent[]> {
    return this.find({
      userId,
      startTime: { $gte: startDate },
      endTime: { $lte: endDate }
    });
  }
} 