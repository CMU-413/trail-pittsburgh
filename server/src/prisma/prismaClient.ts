import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }
    
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025' || prismaError.code === 'P2016') {
        return true;
    }
    
    return false;
}


export { prisma, isNotFoundError };
