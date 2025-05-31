import { container } from 'tsyringe';
import { TaskRepository } from '../domains/task/repositories/TaskRepository';
import { TaskController } from '../domains/task/controllers/TaskController';
import { CreateTaskUseCase } from '../domains/task/useCases/CreateTaskUseCase';
import { GetTaskUseCase } from '../domains/task/useCases/GetTaskUseCase';
import { ListTasksUseCase } from '../domains/task/useCases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../domains/task/useCases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../domains/task/useCases/DeleteTaskUseCase';
import { ListSubtasksUseCase } from '../domains/task/useCases/ListSubtasksUseCase';
import { CreateSubtaskUseCase } from '../domains/task/useCases/CreateSubtaskUseCase';
import { AddExistingSubtaskUseCase } from '../domains/task/useCases/AddExistingSubtaskUseCase';
import { RemoveSubtaskUseCase } from '../domains/task/useCases/RemoveSubtaskUseCase';
import { UpdateSubtaskOrderUseCase } from '../domains/task/useCases/UpdateSubtaskOrderUseCase';

// Register repositories
container.registerSingleton('ITaskRepository', TaskRepository);

// Register use cases
container.registerSingleton(CreateTaskUseCase);
container.registerSingleton(GetTaskUseCase);
container.registerSingleton(ListTasksUseCase);
container.registerSingleton(UpdateTaskUseCase);
container.registerSingleton(DeleteTaskUseCase);	
container.registerSingleton(ListSubtasksUseCase);
container.registerSingleton(CreateSubtaskUseCase);
container.registerSingleton(AddExistingSubtaskUseCase);
container.registerSingleton(RemoveSubtaskUseCase);
container.registerSingleton(UpdateSubtaskOrderUseCase);

// Register controllers
container.registerSingleton(TaskController);

export { container as taskContainer };