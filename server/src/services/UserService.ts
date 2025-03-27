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

    public async createUser(username: string, email: string) {
        return this.userRepository.createUser(username, email);
    }

    public async deleteUser(userId: number) {
        return this.userRepository.deleteUser(userId);
    }

    public async updateUser(
        userId: number, 
        data: { username?: string; email?: string }
    ) {
        return this.userRepository.updateUser(userId, data);
    }

}
