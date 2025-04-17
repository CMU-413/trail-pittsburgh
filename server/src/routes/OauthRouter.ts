import express from 'express';
const router = express.Router();
import dotenv from 'dotenv';
dotenv.config();
import { OAuth2Client } from 'google-auth-library';

async function getUserData(accessToken: string) {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
    const data = await response.json();
    console.log('SECURITY: User data:', data);
    return data;
}

router.post('/', async function (req, res) {
    const { code } = req.body;
    try {
        // SECURITY: Has to match google console redirect url
        const redirectUrl = 'http://localhost:5173/auth/google/callback';

        const oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            redirectUrl
        );

        const response = await oAuth2Client.getToken(code);
        await oAuth2Client.setCredentials(response.tokens);
        console.log('SECURITY: Tokens:', response.tokens);
        
        const user = oAuth2Client.credentials;
        console.log('SECURITY: User:', user);

        if (user.access_token) { await getUserData(user.access_token); } 
        else { throw new Error('No access token found'); }
    } catch (error) {
        console.log('SECURITY: Error:', error);
    }
});

export { router as oauthRouter };

