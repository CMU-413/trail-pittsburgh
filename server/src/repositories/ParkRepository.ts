// import { Prisma } from '@prisma/client';
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '@/prisma/prismaClient';

interface ParkData {
    name?: string;
    county?: string;
    owner_id?: number | null;
    is_active?: boolean;
}

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.parks.findUnique({
            where: {
                park_id: parkId,
            }
        });
    }

    public async createPark(parkData: ParkData) {
        return prisma.parks.create({
            data: {
                park_name: parkData.name!,
                county: parkData.county!,
                owner_id: parkData.owner_id || null,
                is_active: parkData.is_active !== undefined ? parkData.is_active : true
            }
        });
    }

    public async updatePark(parkId: number, parkData: ParkData) {
        try {
            const updateData: any = {};
            
            if (parkData.name !== undefined) {
                updateData.park_name = parkData.name;
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
            
            return await prisma.parks.update({
                where: { park_id: parkId },
                data: updateData
            });
        } catch (error) {
            if (isParkNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async getAllParks() {
        return prisma.parks.findMany();
    }

    public async setParkStatus(parkId: number, isActive: boolean) {
        try {
            return await prisma.parks.update({
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
            await prisma.parks.delete({ where: { park_id: parkId } });
            return true;
        } catch (error) {
            // Park id not found
            if (isParkNotFoundError(error)) { return false; }
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