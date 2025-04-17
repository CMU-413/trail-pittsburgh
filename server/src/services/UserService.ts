import { UserRepository } from '@/repositories';

interface UserData {
    username?: string;
    email?: string;
    is_admin?: boolean;
    permission?: string;
    profile_image?: string;
    is_active?: boolean;
}

export class UserService {
    private readonly userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async getUser(userId: number) {
        return this.userRepository.getUser(userId);
    }

    public async getAllUsers() {
        return this.userRepository.getAllUsers();
    }

    public async createUser(
        username: string,
        email: string,
        isAdmin: boolean = false,
        permission: string = 'read',
        profileImage: string = 'default.jpg',
        isActive: boolean = true
    ) {
        return this.userRepository.createUser(
            username,
            email,
            isAdmin,
            permission,
            profileImage,
            isActive
        );
    }

    public async findOrCreateFromGoogle(userData: {
        email: string;
        name: string;
        picture?: string;
    }) {
        let user = await this.getUserByEmail(userData.email);
    
        if (!user) {
            user = await this.createUser(
                userData.name,
                userData.email,
                false,
                'View',
                userData.picture || 'default.jpg',
                true
            );
        }
    
        return user;
    }

    public async deleteUser(userId: number) {
        return this.userRepository.deleteUser(userId);
    }

    public async updateUser(userId: number, data: UserData) {
        const existingUser = await this.userRepository.getUser(userId);
        if (!existingUser) {
            return null;
        }

        return this.userRepository.updateUser(userId, data);
    }

    public async getUserByEmail(email: string) {
        return this.userRepository.getUserByEmail(email);
    }

    public async getUserByUsername(username: string) {
        return this.userRepository.getUserByUsername(username);
    }
}
