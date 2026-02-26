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
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        // eslint-disable-next-line
        console.log("No token found");
        req.user = null;
        return next();
    }
  
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);

        // eslint-disable-next-line
        console.log("JWT VERIFIED SUCCESSFULLY");
        // eslint-disable-next-line
        console.log("Decoded payload:", decoded);
        // eslint-disable-next-line
        req.user = decoded as any;
        next();
    } catch (err) {
        // eslint-disable-next-line
        console.log("JWT VERIFY FAILED:");
        req.user = null;
        next();
    }
}
