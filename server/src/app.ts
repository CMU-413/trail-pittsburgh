import express from 'express';
import cors from 'cors';
import { parkRouter, issueRouter } from '@/routes';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: 'Trail Pittsburgh API' });
});

// Basic health check route - register this first
app.get('/healthz', (req: express.Request, res: express.Response) => {
    console.log('Health check endpoint called');
    res.status(200).json({ status: 'ok', check: true });
});

// Echo route with optional message parameter
app.get('/echo/:message?', (req: express.Request, res: express.Response) => {
    const message = req.params.message || 'No message provided';
    res.status(200).json({ message, status: 'ok', check: true });
});

// Register API routes
app.use('/api/parks', parkRouter);
app.use('/api/issues', issueRouter);

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
