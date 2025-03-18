import type express from 'express';

const errorHandler = (
    err: Error,
    req: express.Request,
    res: express.Response,
    _next: express.NextFunction
) => {
    res.status(500).json({
        error: err.message,
        cause: err.cause
    });
};

function errorHandlerWrapper(
    fn: (req: express.Request, res: express.Response) => void
) {
    return async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        Promise.resolve(fn(req, res)).catch(next);
    };
}

export { errorHandler, errorHandlerWrapper };
