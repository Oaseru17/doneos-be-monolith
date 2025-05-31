import { Router } from 'express';
import { container } from 'tsyringe';
import { TaskController } from '../controllers/TaskController';
import { isAuthenticated } from '../../../infrastructure/middleware/isAuthenticated';
import { isAuthorized } from '../../../infrastructure/middleware/isAuthorized';

const router = Router();
const taskController = container.resolve(TaskController);

router.use([isAuthenticated, isAuthorized]);

router.post('/', taskController.create.bind(taskController));
router.get('/', taskController.list.bind(taskController));
router.get('/:id', taskController.get.bind(taskController));
router.patch('/:id', taskController.update.bind(taskController));
router.delete('/:id', taskController.delete.bind(taskController));

// Subtask routes
router.get('/:taskId/subtasks', taskController.listSubtasks.bind(taskController));
router.post('/:taskId/subtasks', taskController.createSubtask.bind(taskController));
router.post('/:taskId/subtasks/:subtaskId', taskController.addExistingSubtask.bind(taskController));
router.delete('/:taskId/subtasks/:subtaskId', taskController.removeSubtask.bind(taskController));
router.patch('/:taskId/subtasks/:subtaskId/order', taskController.updateSubtaskOrder.bind(taskController));

export default router;