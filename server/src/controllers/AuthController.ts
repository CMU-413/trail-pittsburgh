import { Request, Response } from 'express';

import { AuthService } from '@/services/AuthService';

export class AuthController {
    private readonly authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;

        this.startGoogleOAuth = this.startGoogleOAuth.bind(this);
        this.handleGoogleCallback = this.handleGoogleCallback.bind(this);
        this.logout = this.logout.bind(this);
        this.getCurrentUser = this.getCurrentUser.bind(this);
    }

    public startGoogleOAuth(req: Request, res: Response) {
        const redirectPath = req.body.redirectPath || '/';
        const url = this.authService.generateAuthUrl(redirectPath);
        res.json({ url });
    }

    public async handleGoogleCallback(req: Request, res: Response) {
        const { code, state } = req.query;

        try {
            const { token } = await this.authService.handleGoogleCallback(code as string);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 24 * 60 * 60 * 1000
            });

            const redirectTarget = typeof state === 'string' ? state : '/';
            res.redirect(`${process.env.CLIENT_URL}/${redirectTarget}`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('OAuth callback error:', err);
            res.redirect(`${process.env.CLIENT_URL}/unauthorized`);
        }
    }

    public logout(req: Request, res: Response) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Logged out successfully' });
    }

    public getCurrentUser(req: Request, res: Response) {
        // eslint-disable-next-line
        const user = (req as any).user;

        if (!user) {
            return res.status(200).json({ user: null });
        }

        // Process the picture URL if it exists
        let pictureUrl = user.picture;
        
        // Check if it's a Google image and proxy it if needed
        if (pictureUrl && pictureUrl.includes('googleusercontent.com')) {
            // Use proxy to avoid CORS issues with Google images
            pictureUrl = `${process.env.SERVER_URL}/api/auth/profile-image-proxy?url=${encodeURIComponent(pictureUrl)}`;
        }

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                picture: pictureUrl
            }
        });
    }
}
