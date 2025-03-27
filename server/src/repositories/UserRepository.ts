import { Prisma } from '@prisma/client';

import { prisma } from '@/prisma/prismaClient';

export class UserRepository {
    public async getUser(userId: number) {
        return prisma.users.findUnique({
            where: { user_id: userId },
        });
    }

    public async createUser(username: string, email: string) {
        return prisma.users.create({
            data: { username, email },
        });
    }

    public async getAllUsers() {
        return prisma.users.findMany();
    }

    public async deleteUser(userId: number) {
        try {
            await prisma.users.delete({ where: { user_id: userId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            throw error;
        }
    }

    // eslint-disable-next-line
    public async updateUser(userId: number, data: { username?: string; email?: string }) {
        try {
            return await prisma.users.update({
                where: { user_id: userId },
                data: data,
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            throw error;
        }
    }
}

function isNotFoundError(error: unknown) {
    return (error instanceof Prisma.PrismaClientKnownRequestError &&
        (error.code === 'P2025' || error.code === 'P2016'));
}
