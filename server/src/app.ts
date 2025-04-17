import cors from 'cors';
import express from 'express';

import { errorHandler } from '@/middlewares';
import {
    authenticationRouter,
    issueRouter,
    oauthRouter,
    parkRouter,
    trailRouter
} from '@/routes';

const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Middleware
app.use(express.json());

app.use('/api/auth', authenticationRouter);
app.use('/api/oauth', oauthRouter);
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
