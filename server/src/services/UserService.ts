import { UserRepository } from '@/repositories';

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
        isHubspotUser: boolean = false,
        profileImageKey: string = 'default.jpg',
        isActive: boolean = true
    ) {
        return this.userRepository.createUser(
            username,
            email,
            isAdmin,
            isHubspotUser,
            profileImageKey,
            isActive
        );
    }

    public async deleteUser(userId: number) {
        return this.userRepository.deleteUser(userId);
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
        return this.userRepository.updateUser(userId, data);
    }

    public async getUserByEmail(email: string) {
        return this.userRepository.getUserByEmail(email);
    }

    public async getUserByUsername(username: string) {
        return this.userRepository.getUserByUsername(username);
    }

}
