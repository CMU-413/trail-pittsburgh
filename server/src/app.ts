import express from 'express';

import { errorHandler } from '@/middlewares';
import { issueRouter, parkRouter } from '@/routes';

const app = express();

// Middleware
app.use(express.json());

app.use('/api/issues', issueRouter);
app.use('/api/parks', parkRouter);

// Health check route
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export { app };
