import express from 'express';

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

export { app };
