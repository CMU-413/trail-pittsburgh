import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class TrailRepository {
    public async getTrail(trailId: number) {
        return prisma.trails.findUnique({
            where: { trail_id: trailId },
        });
    }

    public async createTrail(trailName: string, location?: string) {
        return prisma.trails.create({
            data: { trail_name: trailName, location },
        });
    }

    public async getAllTrails() {
        return prisma.trails.findMany();
    }

    public async deleteTrail(trailId: number) {
        try {
            await prisma.trails.delete({ where: { trail_id: trailId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            throw error;
        }
    }
}

function isNotFoundError(error: unknown) {
    return (error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2025' || error.code === 'P2016'));
}
