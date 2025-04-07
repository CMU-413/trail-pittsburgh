import { Prisma } from '@prisma/client';

import { isNotFoundError, prisma } from '@/prisma/prismaClient';

export class UserRepository {
    public async getUser(userId: number) {
        return prisma.user.findUnique({
            where: { user_id: userId },
            include: {
                permissions: true,
                notifications: true
            }
        });
    }

    public async createUser(
        username: string,
        email: string,
        isAdmin: boolean = false,
        isHubspotUser: boolean = false,
        profileImageKey: string = 'default.jpg',
        isActive: boolean = true
    ) {
        return prisma.user.create({
            data: {
                username,
                email,
                is_admin: isAdmin,
                is_hubspot_user: isHubspotUser,
                profile_image_key: profileImageKey,
                is_active: isActive
            },
            include: {
                permissions: true,
                notifications: true
            }
        });
    }

    public async getAllUsers() {
        return prisma.user.findMany({
            include: {
                permissions: true,
                notifications: true
            }
        });
    }

    public async deleteUser(userId: number) {
        try {
            await prisma.user.delete({ where: { user_id: userId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) { return false; }
            throw error;
        }
    }

    public async updateUser(
        userId: number,
        data: {
            username?: string;
            email?: string;
            is_admin?: boolean;
            is_hubspot_user?: boolean;
            profile_image_key?: string;
            is_active?: boolean;
        }
    ) {
        try {
            return await prisma.user.update({
                where: { user_id: userId },
                data: data,
                include: {
                    permissions: true,
                    notifications: true
                }
            });
        } catch (error) {
            if (isNotFoundError(error)) { return null; }
            throw error;
        }
    }

    public async getUserByEmail(email: string) {
        return prisma.user.findUnique({
            where: { email },
            include: {
                permissions: true,
                notifications: true
            }
        });
    }

    public async getUserByUsername(username: string) {
        return prisma.user.findUnique({
            where: { username },
            include: {
                permissions: true,
                notifications: true
            }
        });
    }
}
