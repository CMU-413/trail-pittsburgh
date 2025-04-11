import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class TrailRepository {
    public async getTrail(trailId: number) {
        return prisma.trail.findUnique({
            where: { trail_id: trailId },
            include: {
                park: true,
                issues: true
            }
        });
    }

    public async createTrail(
        name: string,
        parkId: number,
        isActive: boolean = true,
        isOpen: boolean = true
    ) {
        return prisma.trail.create({
            data: {
                name,
                park_id: parkId,
                is_active: isActive,
                is_open: isOpen
            },
            include: {
                park: true,
                issues: true
            }
        });
    }

    public async getAllTrails() {
        return prisma.trail.findMany({
            include: {
                park: true,
                issues: true
            }
        });
    }

    public async deleteTrail(trailId: number) {
        try {
            await prisma.trail.delete({
                where: { trail_id: trailId }
            });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            throw error;
        }
    }

    public async getTrailsByPark(parkId: number) {
        return prisma.trail.findMany({
            where: { park_id: parkId },
            include: {
                park: true,
                issues: true
            }
        });
    }

    public async updateTrailStatus(trailId: number, isOpen: boolean) {
        return prisma.trail.update({
            where: { trail_id: trailId },
            data: { is_open: isOpen },
            include: {
                park: true,
                issues: true
            }
        });
    }
}

function isNotFoundError(error: unknown) {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2025' || error.code === 'P2016')
    );
}
