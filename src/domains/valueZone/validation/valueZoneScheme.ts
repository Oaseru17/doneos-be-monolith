// valueZoneScheme.ts
import Joi from 'joi';

export const valueZoneCreateSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().optional(),
  priority: Joi.string().required()
});