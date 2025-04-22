import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class TrailRepository {
    public async getTrail(trailId: number) {
        return prisma.trail.findUnique({
            where: { trailId: trailId },
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
                parkId: parkId,
                isActive: isActive,
                isOpen: isOpen
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
                where: { trailId: trailId }
            });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            throw error;
        }
    }

    public async getTrailsByPark(parkId: number) {
        return prisma.trail.findMany({
            where: { parkId: parkId },
            include: {
                park: true,
                issues: true
            }
        });
    }

    public async updateTrailStatus(trailId: number, isOpen: boolean, isActive: boolean) {
        return prisma.trail.update({
            where: { trailId: trailId },
            data: { isOpen: isOpen, isActive: isActive },
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
