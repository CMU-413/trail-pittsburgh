import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import { errorHandler } from '@/middlewares';
import { limiter } from '@/middlewares/rateLimiter';
import { securityHeaders } from '@/middlewares/securityHeaders';
import {
    authenticationRouter,
    issueRouter,
    parkRouter,
    trailRouter
} from '@/routes';

const app = express();

// Security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
    origin: 'https://trail-pgh-issue-tracker.web.app',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400
}));

// Parse cookies
app.use(cookieParser());

// Rate limiting
app.use('/api/', limiter);

// Parse JSON
app.use(express.json());

// Public routes
app.use('/api/auth', authenticationRouter);

// Protected routes
app.use('/api/issues', issueRouter);
app.use('/api/parks', parkRouter);
app.use('/api/trails', trailRouter);

// Health check
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

export { app };
