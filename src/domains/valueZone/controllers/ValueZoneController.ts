import { injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { CreateValueZoneUseCase } from '../useCases/CreateValueZoneUseCase';
import { GetValueZoneUseCase } from '../useCases/GetValueZoneUseCase';
import { ListValueZonesUseCase } from '../useCases/ListValueZonesUseCase';
import { UpdateValueZoneUseCase } from '../useCases/UpdateValueZoneUseCase';
import { DeleteValueZoneUseCase } from '../useCases/DeleteValueZoneUseCase';
import { Priority } from '../enums/Priority';

@injectable()
export class ValueZoneController {
  constructor(
    private createValueZoneUseCase: CreateValueZoneUseCase,
    private getValueZoneUseCase: GetValueZoneUseCase,
    private listValueZonesUseCase: ListValueZonesUseCase,
    private updateValueZoneUseCase: UpdateValueZoneUseCase,
    private deleteValueZoneUseCase: DeleteValueZoneUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { name, description, priority } = req.body;
      const userId = req.currentUser;

      const valueZone = await this.createValueZoneUseCase.execute({
        name,
        description,
        priority: priority as Priority,
        userId
      });

      res.status(201).json(valueZone);
    } catch (error: any) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.currentUser;

      const valueZone = await this.getValueZoneUseCase.execute(id, userId);
      if (!valueZone) {
        res.status(404).json({
          code: 'NOT_FOUND',
          message: 'Value zone not found'
        });
        return;
      }

      res.json(valueZone);
    } catch (error: any) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.currentUser;
      const valueZones = await this.listValueZonesUseCase.execute(userId);
      res.json(valueZones);
    } catch (error: any) {
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { name, description, priority } = req.body;
      const userId = req.currentUser;

      const valueZone = await this.updateValueZoneUseCase.execute(id, userId, {
        name,
        description,
        priority: priority as Priority
      });

      res.json(valueZone);
    } catch (error: any) {
      if (error.message === 'Value zone not found') {
        res.status(404).json({
          code: 'NOT_FOUND',
          message: error.message
        });
        return;
      }
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.currentUser;

      await this.deleteValueZoneUseCase.execute(id, userId);
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'Value zone not found') {
        res.status(404).json({
          code: 'NOT_FOUND',
          message: error.message
        });
        return;
      }
      res.status(400).json({
        code: 'VALIDATION_ERROR',
        message: error.message
      });
    }
  }
} 