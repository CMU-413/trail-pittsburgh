import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.parks.findUnique({
            where: {
                park_id: parkId,
            }
        });
    }

    public async createPark(parkName: string) {
        return prisma.parks.create({
            data: {
                park_name: parkName,
            }
        });
    }

    public async getAllParks() {
        return prisma.parks.findMany();
    }

    public async deletePark(parkId: number) {
        try {
            await prisma.parks.delete({
                where: {
                    park_id: parkId,
                },
            });
        } catch (error) {
            // Park id not found
            if (error instanceof Prisma.PrismaClientKnownRequestError &&
                (error.code === 'P2025' || error.code === 'P2016')
            ) {
                return false;
            }
            throw error;
        }
        return true;
    }
}
