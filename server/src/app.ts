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

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Trail Pittsburgh API' });
});

// Basic health check route - register this first
app.get('/healthz', (req: express.Request, res: express.Response) => {
    console.log('Health check endpoint called');
    res.status(200).json({ status: 'ok' });
});

// Echo route with optional message parameter
app.get('/echo/:message?', (req: express.Request, res: express.Response) => {
    const message = req.params.message || 'No message provided';
    res.status(200).json({ message, status: 'ok', check: true });
});

// Register API routes
app.use('/api/parks', parkRouter);
app.use('/api/issues', issueRouter);
app.use('/api/trails', trailRouter);


// 404 handler
app.use((req: express.Request, res: express.Response) => {
    res.status(404).json({ error: 'Not Found' });
});

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

export { app };
