import { UserRepository } from '@/repositories';

interface UserData {
    username?: string;
    email?: string;
    isAdmin?: boolean;
    permission?: string;
    profileImage?: string;
    isActive?: boolean;
}

export class UserService {
    private readonly userRepository: UserRepository;
    private readonly DEFAULT_PROFILE_IMAGE = 'https://via.placeholder.com/150';

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
        profileImage: string = this.DEFAULT_PROFILE_IMAGE,
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
    
        // Use picture URL if provided
        const profileImage = userData.picture || this.DEFAULT_PROFILE_IMAGE;
        
        if (!user) {
            // Create new user
            user = await this.createUser(
                userData.name,
                userData.email,
                false,
                'View',
                profileImage,
                true
            );
        } else if (userData.picture && user.profileImage !== profileImage) {
            // Update existing user's profile image if needed
            await this.updateUser(user.userId, {
                profileImage
            });
            // Refresh user data
            user = await this.getUserByEmail(userData.email);
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
