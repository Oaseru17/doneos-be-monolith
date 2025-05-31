import { Request, Response } from 'express';
import { injectable, inject } from 'tsyringe';
import { CreateTaskUseCase } from '../useCases/CreateTaskUseCase';
import { GetTaskUseCase } from '../useCases/GetTaskUseCase';
import { ListTasksUseCase } from '../useCases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../useCases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../useCases/DeleteTaskUseCase';
import { createTaskSchema, updateTaskSchema } from '../validation/taskValidation';
import { CreateSubtaskUseCase } from '../useCases/CreateSubtaskUseCase';
import { AddExistingSubtaskUseCase } from '../useCases/AddExistingSubtaskUseCase';
import { RemoveSubtaskUseCase } from '../useCases/RemoveSubtaskUseCase';
import { UpdateSubtaskOrderUseCase } from '../useCases/UpdateSubtaskOrderUseCase';
import { createSubtaskSchema } from '../validation/taskValidation';
import { ListSubtasksUseCase } from '../useCases/ListSubtasksUseCase';

@injectable()
export class TaskController {
  constructor(
    @inject(CreateTaskUseCase)
    private createTaskUseCase: CreateTaskUseCase,
    @inject(GetTaskUseCase)
    private getTaskUseCase: GetTaskUseCase,
    @inject(ListTasksUseCase)
    private listTasksUseCase: ListTasksUseCase,
    @inject(UpdateTaskUseCase)
    private updateTaskUseCase: UpdateTaskUseCase,
    @inject(DeleteTaskUseCase)
    private deleteTaskUseCase: DeleteTaskUseCase,
		@inject(CreateSubtaskUseCase)
		private createSubtaskUseCase: CreateSubtaskUseCase,
		@inject(ListSubtasksUseCase)
		private listSubtasksUseCase: ListSubtasksUseCase,
    @inject(AddExistingSubtaskUseCase)
    private addExistingSubtaskUseCase: AddExistingSubtaskUseCase,
    @inject(RemoveSubtaskUseCase)
    private removeSubtaskUseCase: RemoveSubtaskUseCase,
    @inject(UpdateSubtaskOrderUseCase)
    private updateSubtaskOrderUseCase: UpdateSubtaskOrderUseCase
  ) {}

  async create(req: Request, res: Response): Promise<void> {
    try {
      const { error } = createTaskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const task = await this.createTaskUseCase.execute({
        ...req.body,
        userId: req.currentUser
      });
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const task = await this.getTaskUseCase.execute(req.params.id);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get task' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await this.listTasksUseCase.execute({
        userId: req.currentUser,
        ...req.query
      });
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list tasks' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { error } = updateTaskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const task = await this.updateTaskUseCase.execute(req.params.id, req.body);
      if (!task) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update task' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
			const { deleteSubtasks } = req.body;
      const success = await this.deleteTaskUseCase.execute({
        taskId: req.params.id,
        userId: req.currentUser,
				deleteSubtasks: deleteSubtasks || false
      });
      if (!success) {
        res.status(404).json({ error: 'Task not found' });
        return;
      }
      res.status(204).json({ message: 'Task deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  }

	async listSubtasks(req: Request, res: Response): Promise<void> {
		try {
			const subtasks = await this.listSubtasksUseCase.execute(req.params.taskId);
			res.json(subtasks);
		} catch (error) {
			res.status(500).json({ error: 'Failed to list subtasks' });
		}
	}
	
	async createSubtask(req: Request, res: Response): Promise<void> {
    try {
      const { error } = createSubtaskSchema.validate(req.body);
      if (error) {
        res.status(400).json({ error: error.details[0].message });
        return;
      }

      const subtask = await this.createSubtaskUseCase.execute({
        ...req.body,
        mainTaskId: req.params.taskId,
        userId: req.currentUser
      });
      res.status(201).json(subtask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create subtask' });
    }
  }

	async addExistingSubtask(req: Request, res: Response): Promise<void> {
    try {
      const result = await this.addExistingSubtaskUseCase.execute({
        mainTaskId: req.params.taskId,
        subtaskId: req.params.subtaskId,
        userId: req.currentUser
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add existing subtask' });
    }
  }

	async removeSubtask(req: Request, res: Response): Promise<void> {
    try {
			const { deleteTask } = req.body;
      const success = await this.removeSubtaskUseCase.execute({
        mainTaskId: req.params.taskId,
        subtaskId: req.params.subtaskId,
        userId: req.currentUser,
				deleteTask: deleteTask || false
      });
      if (!success) {
        res.status(404).json({ error: 'Subtask not found' });
        return;
      }
      res.status(204).json({ message: 'Subtask removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove subtask' });
    }
  }

	async updateSubtaskOrder(req: Request, res: Response): Promise<void> {
    try {
      const { order } = req.body;
      if (typeof order !== 'number' || order < 0) {
        res.status(400).json({ error: 'Invalid order value' });
        return;
      }

      const result = await this.updateSubtaskOrderUseCase.execute({
        mainTaskId: req.params.taskId,
        subtaskId: req.params.subtaskId,
        order,
        userId: req.currentUser
      });
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update subtask order' });
    }
  }
}