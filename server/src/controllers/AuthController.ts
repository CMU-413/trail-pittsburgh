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
            // eslint-disable-next-line
            const { token, user } = await this.authService.handleGoogleCallback(code as string);

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 24 * 60 * 60 * 1000
            });

            const redirectTarget = typeof state === 'string' ? state : '/';
            res.redirect(`${process.env.CLIENT_URL}${redirectTarget}`);
        } catch (err) {
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

        res.status(200).json({
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
}
