import 'reflect-metadata';
import { container } from 'tsyringe';
import { UserRepository } from '../domains/user/repositories/UserRepository';
import { UserService } from '../domains/user/services/UserService';
import { EmailVerificationRepository } from '../domains/user/repositories/EmailVerificationRepository';
import { AuthController } from '../domains/user/controllers/AuthController';
import { TaskRepository } from '../domains/task/repositories/TaskRepository';
import { TaskController } from '../domains/task/controllers/TaskController';
import { CreateTaskUseCase } from '../domains/task/useCases/CreateTaskUseCase';
import { GetTaskUseCase } from '../domains/task/useCases/GetTaskUseCase';
import { ListTasksUseCase } from '../domains/task/useCases/ListTasksUseCase';
import { UpdateTaskUseCase } from '../domains/task/useCases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../domains/task/useCases/DeleteTaskUseCase';

// Register repositories
container.registerSingleton(UserRepository);
container.registerSingleton(EmailVerificationRepository);
container.registerSingleton('ITaskRepository', TaskRepository);

// Register services
container.registerSingleton(UserService);

// Register use cases
container.registerSingleton(CreateTaskUseCase);
container.registerSingleton(GetTaskUseCase);
container.registerSingleton(ListTasksUseCase);
container.registerSingleton(UpdateTaskUseCase);
container.registerSingleton(DeleteTaskUseCase);

// Register controllers
container.registerSingleton(AuthController);
container.registerSingleton(TaskController);

export { container };