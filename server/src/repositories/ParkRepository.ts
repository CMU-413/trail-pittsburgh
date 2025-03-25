import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.park.findUnique({
            where: {
                park_id: parkId,
            }
        });
    }

    public async createPark(parkName: string) {
        return prisma.park.create({
            data: {
                name: parkName,
                county: 'Random Temp County'
            }
        });
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
}

function isParkNotFoundError(error: unknown) {
    return (error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2025' || error.code === 'P2016'));
}
