import expressRateLimit from 'express-rate-limit';

export const limiter = expressRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
}); 
