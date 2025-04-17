import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';

router.post('/', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Referrer-Policy', 'no-referrer-when-downgrade');

    // SECURITY: Has to match google console redirect url
    const redirectUrl = 'http://localhost:5173/auth/google/callback';

    const oAuth2Client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        redirectUrl
    );

    const authorizeURL = oAuth2Client.generateAuthUrl({
        // SECURITY: offline access only for testing, forces token refresh
        access_type: 'offline',
        scope: 'https://www.googleapis.com/auth/userinfo.profile openid',
        prompt: 'consent'
    });

    res.json({ url: authorizeURL });
});

export { router as authenticationRouter };