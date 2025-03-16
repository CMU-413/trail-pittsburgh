import { prisma } from '@/prisma/prismaClient';

export class ParkRepository {
    public async getPark(parkId: number) {
        return prisma.parks.findUniqueOrThrow({
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
                }
            });
        } catch (error) {
            throw new Error('Failed to delete park');
        }
    }
}
