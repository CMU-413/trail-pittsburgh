import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';

import {
    securityHeaders, limiter, morganMiddleware 
} from '@/middlewares/index';
import {
    authenticationRouter,
    issueRouter,
    parkRouter,
    trailRouter,
    userRouter
} from '@/routes';

const app = express();

// Security headers
app.use(securityHeaders);

// CORS configuration
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Set-Cookie'],
    credentials: true,
    maxAge: 86400
}));

// Parse cookies
app.use(cookieParser());

// Rate limiting
app.use('/api/', limiter);

// Parse JSON
app.use(express.json());
app.use(morganMiddleware);

// Public routes
app.use('/api/auth', authenticationRouter);

// Protected routes
app.use('/api/issues', issueRouter);
app.use('/api/parks', parkRouter);
app.use('/api/trails', trailRouter);
app.use('/api/users', userRouter);

// Health check
app.get('/healthz', (req: express.Request, res: express.Response) => {
    res.status(200).json({ status: 'ok' });
});

export { app };
