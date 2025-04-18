// src/services/AuthService.ts
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { getGoogleUserData } from '@/utils/googleAuth';
import { UserService } from './UserService';
import { UserRepository } from '@/repositories';

export class AuthService {
    private oAuth2Client: OAuth2Client;
    private userService: UserService;

    constructor() {
        this.oAuth2Client = new OAuth2Client(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            `${process.env.SERVER_URL}/api/auth/google/callback`
        );

        this.userService = new UserService(new UserRepository());
    }

    generateAuthUrl(redirectPath: string = '/') {
        return this.oAuth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: 'https://www.googleapis.com/auth/userinfo.profile openid email',
            state: redirectPath,
            prompt: 'consent'
        });
    }

    async handleGoogleCallback(code: string) {
        const { tokens } = await this.oAuth2Client.getToken(code);
        this.oAuth2Client.setCredentials(tokens);

        const userData = await getGoogleUserData(tokens.access_token!);

        const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
        if (allowedDomain && !userData.email.endsWith(`@${allowedDomain}`)) {
            throw new Error('Unauthorized domain');
        }

        const user = await this.userService.findOrCreateFromGoogle({
            email: userData.email,
            name: userData.name,
            picture: userData.picture
        });

        const token = jwt.sign(
            { id: user.user_id, email: user.email },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        return { token, user };
    }
}