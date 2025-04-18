import express from 'express';
import { OAuth2Client } from 'google-auth-library';

import { AuthController } from '@/controllers/AuthController';
import { errorHandlerWrapper } from '@/middlewares';
import { authenticateToken } from '@/middlewares/auth';
import { validateRequest } from '@/middlewares/validateRequest';
import { UserRepository } from '@/repositories';
import { startOAuthSchema } from '@/schemas/authSchema';
import { AuthService } from '@/services/AuthService';
import { UserService } from '@/services/UserService';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    `${process.env.SERVER_URL}/api/auth/google/callback`
);
const authService = new AuthService(userService, oAuth2Client);
const authController = new AuthController(authService);

const router = express.Router();

// Step 1: Begin Google OAuth
router.post(
    '/',
    validateRequest(startOAuthSchema),
    errorHandlerWrapper(authController.startGoogleOAuth)
);

// Step 2: Handle Google OAuth callback
router.get(
    '/google/callback',
    errorHandlerWrapper(authController.handleGoogleCallback)
);

// Logout
router.post(
    '/logout',
    errorHandlerWrapper(authController.logout)
);

// Get current user
router.get(
    '/me',
    authenticateToken,
    errorHandlerWrapper(authController.getCurrentUser)
);

export { router as authenticationRouter };
