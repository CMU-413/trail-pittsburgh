import { isNotFoundError, prisma } from '@/prisma/prismaClient';
import { Trail } from '@prisma/client';

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

    public async createTrail(trailData: Trail) {
        try {
            const result = await prisma.trail.create({
                data: {
                    name: trailData.name,
                    parkId: trailData.parkId,
                    isActive: trailData.isActive ?? true,
                    isOpen: trailData.isOpen ?? true
                }
            });
            return result;
        } catch (error) {
            console.error('Error creating trail:', error);
            throw error;
        }
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
            if (isNotFoundError(error)) { return false; }
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

    public async updateTrail(trailId: number, trailData: Partial<Trail>) {
        try {
            return await prisma.trail.update({
                where: { trailId: trailId },
                data: trailData
            });
        } catch (error) {
            if (isNotFoundError(error)) { return null; }
            throw error;
        }
    }
}
