import type express from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) =>
    async (
        req: express.Request, res: express.Response, next: express.NextFunction
    ) => {
        try {
            await schema.parseAsync({
                body: req.body,
                params: req.params,
            });
            next();
        } catch (error) {
            next(error);
        }
    };
