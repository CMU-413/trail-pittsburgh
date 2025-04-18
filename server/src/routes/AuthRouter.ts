// src/routes/authentication.routes.ts
import express from 'express';

import {
    startGoogleOAuth,
    handleGoogleCallback,
    logout,
    getCurrentUser
} from '@/controllers/AuthController';
import { errorHandlerWrapper } from '@/middlewares';
import { authenticateToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { startOAuthSchema } from '@/schemas/authSchema';

const router = express.Router();

// Step 1: Begin Google OAuth
router.post(
    '/',
    validateRequest(startOAuthSchema),
    errorHandlerWrapper(startGoogleOAuth)
);

// Step 2: Handle Google OAuth callback
router.get('/google/callback', errorHandlerWrapper(handleGoogleCallback));

// Logout
router.post('/logout', errorHandlerWrapper(logout));

// Get current user
router.get('/me', authenticateToken, errorHandlerWrapper(getCurrentUser));

export { router as authenticationRouter };
