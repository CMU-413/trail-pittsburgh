import { 
    Request, 
    Response,
    NextFunction 
} from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    user?: any;
}

// Middleware to verify JWT from HTTP-only cookie
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const token = req.cookies?.token;

    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = user;
        next();
    } catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
    }
};
