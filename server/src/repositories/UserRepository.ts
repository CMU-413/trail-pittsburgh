import { isNotFoundError, prisma } from '@/prisma/prismaClient';

interface UserUpdateData {
    username?: string;
    email?: string;
    is_admin?: boolean;
    permission?: string;
    profile_image?: string;
    is_active?: boolean;
}

export class UserRepository {
    public async getUser(userId: number) {
        try {
            return await prisma.user.findUnique({
                where: { user_id: userId }
            });
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    }

    public async createUser(
        username: string,
        email: string,
        isAdmin: boolean = false,
        permission: string = 'read',
        profileImage: string = 'default.jpg',
        isActive: boolean = true
    ) {
        try {
            const result = await prisma.user.create({
                data: {
                    username,
                    email,
                    is_admin: isAdmin,
                    permission,
                    profile_image: profileImage,
                    is_active: isActive
                }
            });
            console.log('User created successfully:', result);
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
            await prisma.user.delete({ where: { user_id: userId } });
            return true;
        } catch (error) {
            if (isNotFoundError(error)) {return false;}
            console.error('Error deleting user:', error);
            throw error;
        }
    }

    public async updateUser(userId: number, data: UserUpdateData) {
        try {
            return await prisma.user.update({
                where: { user_id: userId },
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
}
