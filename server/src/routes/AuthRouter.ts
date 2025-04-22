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

// Proxy for Google profile images (to handle CORS)
router.get(
    '/profile-image-proxy',
    errorHandlerWrapper(async (req: express.Request, res: express.Response) => {
        const imageUrl = req.query.url as string;
        
        if (!imageUrl) {
            return res.status(400).json({ error: 'Missing image URL' });
        }
        
        try {
            // Only allow Google profile image URLs for security
            if (!imageUrl.includes('googleusercontent.com')) {
                return res.status(403).json({ error: 'Only Google image URLs are allowed' });
            }
            
            const response = await fetch(imageUrl);
            
            if (!response.ok) {
                throw new Error(`Image fetch failed: ${response.status}`);
            }
            
            // Get the content type and set it in the response
            const contentType = response.headers.get('content-type');
            if (contentType) {
                res.setHeader('Content-Type', contentType);
            }
            
            // Set caching headers
            res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
            
            // Set CORS headers
            res.setHeader('Access-Control-Allow-Origin', '*');
            
            // Get the response body as a buffer and send it
            const buffer = await response.arrayBuffer();
            res.end(Buffer.from(buffer));
        } catch (error) {
            // Return a default avatar instead of an error
            res.redirect(`https://ui-avatars.com/api/?background=random&color=fff&size=400&name=User`);
        }
    })
);

export { router as authenticationRouter };
