import { isNotFoundError, prisma } from '@/prisma/prismaClient';
import { ParkData } from '@/utils/types';

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.park.findUnique({
            where: {
                parkId: parkId,
            }
        });
    }

    public async createPark(parkData: ParkData) {
        try {
            const result = await prisma.park.create({
                data: {
                    name: parkData.name,
                    county: parkData.county ?? '', // fallback if undefined
                    isActive: parkData.isActive ?? true
                }
            });
            return result;
        } catch (error) {
            console.error('Error creating park:', error);
            throw error;
        }
    }

    public async updatePark(parkId: number, parkData: Partial<ParkData>) {
        try {
            return await prisma.park.update({
                where: { parkId: parkId },
                data: parkData
            });
        } catch (error) {
            if (isNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async getAllParks() {
        return prisma.park.findMany();
    }

    public async setParkStatus(parkId: number, isActive: boolean) {
        try {
            return await prisma.park.update({
                where: { parkId: parkId },
                data: { isActive: isActive }
            });
        } catch (error) {
            if (isNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async deletePark(parkId: number) {
        try {
            await prisma.park.delete({ where: { parkId: parkId } });
            return true;
        } catch (error) {
            // Park id not found
            if (isNotFoundError(error)) { return false; }
            throw error;
        }
    }

    public async getTrailsByPark(parkId: number) {
        try {
            const trails = await prisma.trail.findMany({
                where: {
                    parkId: parkId,
                }
            });
            return trails;
        } catch (error) {
            console.error('Repository: Error getting trails:', error);
            throw error;
        }
    }
}
