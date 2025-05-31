import { Router } from 'express';
import { container } from 'tsyringe';
import { ValueZoneController } from '../controllers/ValueZoneController';
import { isAuthenticated } from '../../../infrastructure/middleware/isAuthenticated';
import { isAuthorized } from '../../../infrastructure/middleware/isAuthorized';
import { validateRequest } from '../../../infrastructure/middleware/validateRequest';
import { valueZoneCreateSchema } from '../validation/valueZoneScheme';

const router = Router();
const valueZoneController = container.resolve(ValueZoneController);

// Create a new value zone
router.post('/', [isAuthenticated, isAuthorized, validateRequest(valueZoneCreateSchema)], valueZoneController.create.bind(valueZoneController));
router.get('/', [isAuthorized, isAuthenticated], valueZoneController.list.bind(valueZoneController));
router.get('/:id', [isAuthorized, isAuthenticated], valueZoneController.get.bind(valueZoneController));
router.patch('/:id', [isAuthorized, isAuthenticated], valueZoneController.update.bind(valueZoneController));
router.delete('/:id', [isAuthorized, isAuthenticated], valueZoneController.delete.bind(valueZoneController));

export default router; 