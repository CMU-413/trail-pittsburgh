import { isNotFoundError, prisma } from '@/prisma/prismaClient';

interface ParkData {
    name: string;
    county?: string;
    is_active?: boolean;
}

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.park.findUnique({
            where: {
                park_id: parkId,
            }
        });
    }

    public async createPark(parkData: ParkData) {
        console.log('Creating park with data:', parkData);
        try {
            const result = await prisma.park.create({
                data: {
                    name: parkData.name,
                    county: parkData.county ?? '', // fallback if undefined
                    is_active: parkData.is_active ?? true
                }
            });
            console.log('Park created successfully:', result);
            return result;
        } catch (error) {
            console.error('Error creating park:', error);
            throw error;
        }
    }

    public async updatePark(parkId: number, parkData: Partial<ParkData>) {
        try {
            return await prisma.park.update({
                where: { park_id: parkId },
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
                where: { park_id: parkId },
                data: { is_active: isActive }
            });
        } catch (error) {
            if (isNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async deletePark(parkId: number) {
        try {
            await prisma.park.delete({ where: { park_id: parkId } });
            return true;
        } catch (error) {
            // Park id not found
            if (isNotFoundError(error)) { return false; }
            throw error;
        }
    }

    public async getTrailsByPark(parkId: number) {
        try {
            console.log('Repository: Getting trails for park ID:', parkId);
            const trails = await prisma.trail.findMany({
                where: {
                    park_id: parkId,
                }
            });
            console.log('Repository: Found trails:', trails);
            return trails;
        } catch (error) {
            console.error('Repository: Error getting trails:', error);
            throw error;
        }
    }
}
