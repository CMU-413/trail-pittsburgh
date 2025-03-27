import { UserRepository } from '@/repositories';
import { UserService } from '@/services';

jest.mock('@/repositories/UserRepository');

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(() => {
        // eslint-disable-next-line
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepositoryMock);
    });

    test('should create a new user', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            created_at: new Date()
        }; 
        userRepositoryMock.createUser.mockResolvedValue(mockUser);

        const result = await userService.createUser('test_user', 'test@example.com');

        expect(userRepositoryMock.createUser).toHaveBeenCalledWith('test_user', 'test@example.com');
        expect(result).toEqual(mockUser);
    });

    test('should get a user by ID', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            created_at: new Date()
        };
        userRepositoryMock.getUser.mockResolvedValue(mockUser);

        const result = await userService.getUser(1);

        expect(userRepositoryMock.getUser).toHaveBeenCalledWith(1);
        expect(result).toEqual(mockUser);
    });

    test('should return null if user is not found', async () => {
        userRepositoryMock.getUser.mockResolvedValue(null);

        const result = await userService.getUser(999);

        expect(userRepositoryMock.getUser).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should delete a user', async () => {
        userRepositoryMock.deleteUser.mockResolvedValue(true);

        const result = await userService.deleteUser(1);

        expect(userRepositoryMock.deleteUser).toHaveBeenCalledWith(1);
        expect(result).toBe(true);
    });
    
    test('should update user', async () => {
        const mockUser = {
            user_id: 1,
            username: 'updateduser',
            email: 'test@example.com',
            created_at: new Date()
        };
        const updateData = { username: 'updateduser' };
        userRepositoryMock.updateUser.mockResolvedValue(mockUser);

        const result = await userService.updateUser(1, updateData);
        // eslint-disable-next-line
        expect(userRepositoryMock.updateUser).toHaveBeenCalledWith(1, updateData);
        expect(result).toEqual(mockUser);
    });

});
