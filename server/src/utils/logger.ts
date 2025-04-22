import {
    createLogger, transports, format 
} from 'winston';
const { combine, timestamp, printf, colorize } = format;

export const logger = createLogger({
    level: 'info',
    format: combine(
        colorize(),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console(),
    ],
});
