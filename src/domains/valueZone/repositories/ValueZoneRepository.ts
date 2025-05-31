import { injectable } from 'tsyringe';
import { Types } from 'mongoose';
import { ValueZone } from '../models/ValueZone';
import { IValueZone } from '../interfaces/IValueZone';
import { BaseRepository } from '../../common/repositories/BaseRepository';
import { Priority } from '../enums/Priority';
import mongoose from 'mongoose';

@injectable()
export class ValueZoneRepository extends BaseRepository<IValueZone> {
  constructor() {
    super(ValueZone);
  }

  async findByUserId(userId: string): Promise<IValueZone[]> {
    return this.find({ userId: new Types.ObjectId(userId) });
  }

  async findByIdAndUserId(id: string, userId: string): Promise<IValueZone | null> {
    return this.findOne({ 
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId)
    });
  }

  async updateCalendarIntegration(valueZoneId: string, calendarIntegrationId: string): Promise<IValueZone | null> {
    return this.update(
      valueZoneId, 
      { calendarIntegrationId: new Types.ObjectId(calendarIntegrationId) }
    );
  }

  /**
   * Create a new value zone
   * @param data Value zone data
   * @returns The created value zone
   */
  async create(data: Partial<IValueZone>): Promise<IValueZone> {
    const valueZoneData = {
      ...data,
      userId: typeof data.userId === 'string' ? new Types.ObjectId(data.userId) : data.userId,
      calendarIntegrationId: data.calendarIntegrationId 
        ? typeof data.calendarIntegrationId === 'string' 
          ? new Types.ObjectId(data.calendarIntegrationId)
          : data.calendarIntegrationId
        : null
    };
    return await ValueZone.create(valueZoneData);
  }

  /**
   * Find a value zone by ID
   * @param id Value zone ID
   * @returns The value zone or null if not found
   */
  async findById(id: string): Promise<IValueZone | null> {
    return await ValueZone.findById(id);
  }

  /**
   * Update a value zone
   * @param id Value zone ID
   * @param data Update data
   * @returns The updated value zone or null if not found
   */
  async update(
    id: string,
    data: Partial<IValueZone>
  ): Promise<IValueZone | null> {
    const updateData = {
      ...data,
      userId: data.userId 
        ? typeof data.userId === 'string' 
          ? new Types.ObjectId(data.userId)
          : data.userId
        : undefined,
      calendarIntegrationId: data.calendarIntegrationId 
        ? typeof data.calendarIntegrationId === 'string'
          ? new Types.ObjectId(data.calendarIntegrationId)
          : data.calendarIntegrationId
        : null,
    };
    return await ValueZone.findByIdAndUpdate(
      new Types.ObjectId(id),
      { $set: updateData },
      { new: true }
    );
  }

  /**
   * Delete a value zone
   * @param id Value zone ID
   * @returns The deleted value zone or null if not found
   */
  async delete(id: string): Promise<boolean> {
    return await ValueZone.findByIdAndDelete(id) != null;
  }

  /**
   * Delete all value zones for a user
   * @param userId User ID
   * @returns Number of deleted value zones
   */
  async deleteByUserId(userId: string): Promise<number> {
    const result = await ValueZone.deleteMany({ userId });
    return result.deletedCount || 0;
  }
} 