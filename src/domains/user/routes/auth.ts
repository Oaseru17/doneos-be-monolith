import express from 'express';
import { container } from 'tsyringe';
import { AuthController } from '../controllers/AuthController';
import { validateRequest } from '../../../infrastructure/middleware/validateRequest';
import { registerSchema, verifyEmailSchema } from '../validation/registerSchemas';
import { loginSchema } from '../validation/loginSchemas';
import { isAuthorized } from '../../../infrastructure/middleware/isAuthorized';
import { isAuthenticated } from '../../../infrastructure/middleware/isAuthenticated';

const router = express.Router();
const controller = container.resolve(AuthController);

router.post('/register', [isAuthorized, validateRequest(registerSchema)], controller.register.bind(controller));
router.post('/verify-email',[isAuthorized, validateRequest(verifyEmailSchema)], controller.verifyEmail.bind(controller));
router.post('/resend-verification', [isAuthorized, isAuthenticated], controller.resendVerification.bind(controller));

router.post('/login', [isAuthorized,validateRequest(loginSchema)], controller.login.bind(controller));

export = router; 