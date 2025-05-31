import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import LOG from '../../library/logging';

export const validateRequest = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            LOG.warn('Validation error:', error.details);
            return res.status(400).json({
                code: 'VALIDATION_ERROR',
                message: 'Invalid request data',
                details: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message
                }))
            });
        }
        next();
    };
};
