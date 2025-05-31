// loginSchemas.ts
import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
		'string.email': 'Please provide a valid email address',
		'string.empty': 'Email is required',
		'any.required': 'Email is required'
	}),
  password: Joi.string()
	.min(8)
	.max(100)
	.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
	.required().messages({
		'string.pattern.base': 'Password must be a 6-digit number',
		'string.empty': 'Password is required',
		'any.required': 'Password is required'
	})
});