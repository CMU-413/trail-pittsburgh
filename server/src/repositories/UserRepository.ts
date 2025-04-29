import { User, UserRoleEnum } from '@prisma/client';

import { isNotFoundError, prisma } from '@/prisma/prismaClient';

export class UserRepository {
    public async getUser(userId: number) {
        try {
            return await prisma.user.findUnique({
                where: { userId: userId }
            });
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    public async createUser(
        username: string,
        email: string,
        role: UserRoleEnum = UserRoleEnum.ROLE_USER,
        profileImage: string = 'default.jpg',
        isActive: boolean = true
    ) {
        try {
            const result = await prisma.user.create({
                data: {
                    username,
                    email,
                    role,
                    profileImage: profileImage,
                    isActive: isActive
                }
            });
            return result;
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    public async getAllUsers() {
        try {
            return await prisma.user.findMany();
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    }

    public async deleteUser(userId: number) {
        try {
            await prisma.user.delete({ where: { userId: userId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    public async updateUser(userId: number, data: Partial<User>) {
        try {
            return await prisma.user.update({
                where: { userId: userId },
                data
            });
        } catch (error) {
            if (isNotFoundError(error)) {return null;}
            console.error('Error updating user:', error);
            throw error;
        }
    }

    public async getUserByEmail(email: string) {
        try {
            return await prisma.user.findUnique({
                where: { email }
            });
        } catch (error) {
            console.error('Error getting user by email:', error);
            throw error;
        }
    }

    public async getUserByUsername(username: string) {
        try {
            return await prisma.user.findUnique({
                where: { username }
            });
        } catch (error) {
            console.error('Error getting user by username:', error);
            throw error;
        }
    }

    public async getUserRole(userId: number) {
        try {
            const user = await this.getUser(userId);
            return user?.role;
        } catch (error) {
            console.error('Error getting user role:', error);
            throw error;
        }
    }
}
