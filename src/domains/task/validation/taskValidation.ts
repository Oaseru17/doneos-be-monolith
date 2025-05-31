import Joi from 'joi';

// Common validation patterns
const commonValidation = {
  title: Joi.string().required().trim().min(1).max(200),
  description: Joi.string().trim().max(1000).allow('', null),
  valueZoneId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid value zone ID format'
  }),
  scheduledStart: Joi.date().iso().allow(null),
  scheduledEnd: Joi.date().iso().min(Joi.ref('scheduledStart')).allow(null).messages({
    'date.min': 'End date must be after start date'
  }),
  deadline: Joi.date().iso().allow(null),
  brainpower: Joi.string().valid('HIGH', 'MEDIUM', 'LOW').required(),
  timeFixed: Joi.boolean().default(false),
  multitaskAllowed: Joi.boolean().default(false),
  effortEstimateMinutes: Joi.number().required().min(1).max(1440).messages({
    'number.min': 'Effort estimate must be at least 1 minute',
    'number.max': 'Effort estimate cannot exceed 24 hours (1440 minutes)'
  }),
  priority: Joi.string().valid('AUTO', 'LOW', 'MEDIUM', 'HIGH').default('AUTO'),
  status: Joi.string().valid('PENDING', 'IN_PROGRESS', 'COMPLETED', 'MISSED', 'CLOSED').default('PENDING'),
  tags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).max(10).messages({
    'array.max': 'Maximum 10 tags allowed'
  }),
  isRecurring: Joi.boolean().default(false),
  recurrencePattern: Joi.string().when('isRecurring', {
    is: true,
    then: Joi.string().required(),
    otherwise: Joi.string().allow(null, '')
  }),
  dependencyIds: Joi.array().items(
    Joi.string().regex(/^[0-9a-fA-F]{24}$/)
  ).unique().messages({
    'array.unique': 'Duplicate dependencies are not allowed'
  }),
  metadata: Joi.object().default({})
};

// Subtask validation schema
const subtaskSchema = Joi.object({
  title: Joi.string().required().trim().min(1).max(200),
  description: Joi.string().trim().max(1000).allow('', null),
  order: Joi.number().required().min(0),
  scheduledStart: Joi.date().iso().allow(null),
  scheduledEnd: Joi.date().iso().min(Joi.ref('scheduledStart')).allow(null).messages({
    'date.min': 'End date must be after start date'
  }),
  status: Joi.string().valid('PENDING', 'COMPLETED', 'SKIPPED').default('PENDING'),
  tags: Joi.array().items(
    Joi.string().trim().min(1).max(50)
  ).max(5).messages({
    'array.max': 'Maximum 5 tags allowed for subtasks'
  }),
  estimatedFocusLevel: Joi.number().min(1).max(10).default(5),
  parentStepReference: Joi.string().allow(null, ''),
  metadata: Joi.object().default({})
});

// Create task validation schema
export const createTaskSchema = Joi.object({
  ...commonValidation,
  subtasks: Joi.array().items(subtaskSchema).max(50).messages({
    'array.max': 'Maximum 50 subtasks allowed'
  })
}).custom((obj, helpers) => {
  // Validate that if timeFixed is true, both scheduledStart and scheduledEnd are required
  if (obj.timeFixed && (!obj.scheduledStart || !obj.scheduledEnd)) {
    return helpers.error('any.invalid', {
      message: 'Both scheduledStart and scheduledEnd are required when timeFixed is true'
    });
  }

  // Validate that scheduledEnd is after scheduledStart
  if (obj.scheduledStart && obj.scheduledEnd && obj.scheduledEnd <= obj.scheduledStart) {
    return helpers.error('any.invalid', {
      message: 'scheduledEnd must be after scheduledStart'
    });
  }

  // Validate that deadline is after scheduledEnd if both are provided
  if (obj.scheduledEnd && obj.deadline && obj.deadline <= obj.scheduledEnd) {
    return helpers.error('any.invalid', {
      message: 'deadline must be after scheduledEnd'
    });
  }

  return obj;
});

// Update task validation schema
export const updateTaskSchema = Joi.object({
  ...Object.fromEntries(
    Object.entries(commonValidation).map(([key, value]) => [
      key,
      value.optional()
    ])
  ),
  subtasks: Joi.array().items(subtaskSchema).max(50).messages({
    'array.max': 'Maximum 50 subtasks allowed'
  })
}).custom((obj, helpers) => {
  // Only validate time constraints if the relevant fields are provided
  if (obj.timeFixed && obj.scheduledStart && obj.scheduledEnd) {
    if (obj.scheduledEnd <= obj.scheduledStart) {
      return helpers.error('any.invalid', {
        message: 'scheduledEnd must be after scheduledStart'
      });
    }
  }

  if (obj.scheduledEnd && obj.deadline && obj.deadline <= obj.scheduledEnd) {
    return helpers.error('any.invalid', {
      message: 'deadline must be after scheduledEnd'
    });
  }

  return obj;
});

// Query parameters validation schema
export const listTasksQuerySchema = Joi.object({
  valueZoneId: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  status: Joi.string().valid('PENDING', 'COMPLETED', 'MISSED'),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate')),
  deadline: Joi.date().iso(),
  scheduledStart: Joi.date().iso(),
  scheduledEnd: Joi.date().iso().min(Joi.ref('scheduledStart')),
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20)
});

export const createSubtaskSchema = Joi.object({
  ...commonValidation,
  order: Joi.number().required().min(0)
});

// Update subtask order validation schema
export const updateSubtaskOrderSchema = Joi.object({
  order: Joi.number().required().min(0)
});