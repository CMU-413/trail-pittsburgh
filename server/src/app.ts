import express from 'express';

import { issueRouter } from '@/routes';

const app = express();

// Middleware
app.use(express.json());

app.use('/api/issues', issueRouter);

// Health check route
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

export { app };
