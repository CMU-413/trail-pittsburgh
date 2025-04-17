import express from 'express';
import dotenv from 'dotenv';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { UserService } from '@/services/UserService';
import { UserRepository } from '@/repositories';
import { authenticateToken, AuthRequest } from '@/middlewares/auth';

dotenv.config();
const router = express.Router();

const redirectUrl = 'http://localhost:3000/api/auth/google/callback';

const oAuth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUrl
);

// Fetch basic Google user profile
async function getUserData(accessToken: string) {
    console.log('Fetching user data with access token:', accessToken);
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const data = await response.json();
    console.log('User data received:', data);
    return data;
}

// Step 1: Create Google OAuth URL and send to frontend
router.post('/', (req, res) => {
    const redirectPath = req.body.redirectPath || '/';
    console.log('Received OAuth init request with redirectPath:', redirectPath);

    const authorizeURL = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
        state: redirectPath,
        prompt: 'consent'
    });

    console.log('Generated Google OAuth URL:', authorizeURL);
    res.json({ url: authorizeURL });
});

// Step 2: Handle Google callback after login
router.get('/google/callback', async (req, res) => {
    const { code, state } = req.query;

    console.log('Google callback received');
    console.log('Code:', code);
    console.log('State (redirectPath):', state);

    try {
        const { tokens } = await oAuth2Client.getToken(code as string);
        console.log('Received tokens:', tokens);

        oAuth2Client.setCredentials(tokens);

        const userData = await getUserData(tokens.access_token!);

        // This can be changed in the future to allow multiple domains
        const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
        const userEmail = userData.email;
        if (allowedDomain && !userEmail.endsWith(`@${allowedDomain}`)) {
            console.warn(`Unauthorized domain attempt: ${userEmail}`);
            return res.redirect(`${process.env.CLIENT_URL}/unauthorized`);
        }

        const userService = new UserService(new UserRepository());
        const user = await userService.findOrCreateFromGoogle({
            email: userData.email,
            name: userData.name,
            picture: userData.picture
        });

        console.log('User returned from DB or created:', user);

        const jwtToken = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        console.log('JWT created for user:', jwtToken);

        res.cookie('token', jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        const redirectTarget = typeof state === 'string' ? state : '/';
        console.log('Redirecting user to:', `${process.env.CLIENT_URL}${redirectTarget}`);
        res.redirect(`${process.env.CLIENT_URL}${redirectTarget}`);
    } catch (err) {
        console.error('OAuth callback error:', err);
        res.redirect(`${process.env.CLIENT_URL}/unauthorized`);
    }
});

// Logout route
router.post('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, (req: AuthRequest, res) => {
    res.status(200).json({
        user: {
            id: req.user.id,
            email: req.user.email
        }
    });
});

export { router as authenticationRouter };