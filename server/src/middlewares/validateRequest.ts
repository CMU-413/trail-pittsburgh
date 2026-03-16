import type express from 'express';
import type { AnyZodObject } from 'zod';

export const validateRequest = (schema: AnyZodObject) =>
    async (
        req: express.Request, res: express.Response, next: express.NextFunction
    ) => {
        try {
            const resolvedReq = await schema.parseAsync({
                body: req.body,
                params: req.params,
                query: req.query,
            });
            req.body = resolvedReq.body;
            req.params = resolvedReq.params;
            req.query = resolvedReq.query;
            next();
        } catch (error) {
            next(error);
        }
    };
