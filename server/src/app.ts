import express from 'express';
import cors from 'cors';

import { errorHandler } from '@/middlewares';
import { issueRouter, parkRouter, trailRouter } from '@/routes';

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Middleware
app.use(express.json());

app.use('/api/issues', issueRouter);
app.use('/api/parks', parkRouter);
app.use('/api/trails', trailRouter);
app.use('/api/issues', issueRouter);

// Health check route
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export { app };
