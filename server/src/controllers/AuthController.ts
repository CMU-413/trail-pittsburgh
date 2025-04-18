// src/controllers/AuthController.ts
import { Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export const startGoogleOAuth = (req: Request, res: Response) => {
    const redirectPath = req.body.redirectPath || '/';
    const url = authService.generateAuthUrl(redirectPath);
    res.json({ url });
};

export const handleGoogleCallback = async (req: Request, res: Response) => {
    const { code, state } = req.query;

    try {
        const { token, user } = await authService.handleGoogleCallback(code as string);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        const redirectTarget = typeof state === 'string' ? state : '/';
        res.redirect(`${process.env.CLIENT_URL}${redirectTarget}`);
    } catch (err) {
        res.redirect(`${process.env.CLIENT_URL}/unauthorized`);
    }
};

export const logout = (req: Request, res: Response) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({ message: 'Logged out successfully' });
};

export const getCurrentUser = (req: Request, res: Response) => {
    const user = (req as any).user;
    res.status(200).json({
        user: {
            id: user.id,
            email: user.email
        }
    });
};