import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

export const validateRequest = (schema: ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const { error } = schema.validate(req.body, { abortEarly: false, allowUnknown: true });
        if (error) {
            return res.status(400).json({
                message: 'Validation error',
                details: error.details.map(detail => detail.message)
            });
        }
        next();
    };
};
