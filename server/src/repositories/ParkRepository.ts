// import { Prisma } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/prisma/prismaClient';

interface ParkData {
    name: string;
    county?: string;
    owner_id?: number | null;
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


    // public async createPark(parkData: ParkData) {
    //     return prisma.park.create({
    //         data: {
    //             name: parkData.name,
    //             county: parkData.county!,
    //             owner_id: parkData.owner_id || null
    //         }
    //     });
    // }
    public async createPark(parkData: ParkData) {
        console.log('Creating park with data:', parkData);
        try {
            const result = await prisma.park.create({
                data: {
                    name: parkData.name,
                    county: parkData.county!,
                    // owner_id: parkData.owner_id || null,
                    // No need to include is_active as it has a default value
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
            const updateData: any = {};
            
            if (parkData.name !== undefined) {
                updateData.name = parkData.name;
            }
            
            if (parkData.county !== undefined) {
                updateData.county = parkData.county;
            }
            
            if (parkData.owner_id !== undefined) {
                updateData.owner_id = parkData.owner_id;
            }
            
            if (parkData.is_active !== undefined) {
                updateData.is_active = parkData.is_active;
            }
            
            return await prisma.park.update({
                where: { park_id: parkId },
                data: updateData
            });
        } catch (error) {
            if (isParkNotFoundError(error)) { return null; }
            throw error;
        }

    // public async createPark(newParkData : Prisma.ParkCreateInput) {
    //     return prisma.park.create({
    //         data: newParkData
    //     });

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
            if (isParkNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async deletePark(parkId: number) {
        try {
            await prisma.park.delete({ where: { park_id: parkId } });
            return true;
        } catch (error) {
            // Park id not found
            if (isParkNotFoundError(error)) { return false; }
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

// function isParkNotFoundError(error: unknown) {
//     return (error instanceof Prisma.PrismaClientKnownRequestError &&
//         (error.code === 'P2025' || error.code === 'P2016'));
// }
function isParkNotFoundError(error: unknown): boolean {
    if (!error || typeof error !== 'object') {
        return false;
    }
    
    const prismaError = error as { code?: string };
    if (prismaError.code === 'P2025' || prismaError.code === 'P2016') {
        return true;
    }
    
    return false;
}