import { UserRepository } from '@/repositories';
import { UserService } from '@/services';

jest.mock('@/repositories/UserRepository');

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepositoryMock);
    });

    test('should create a new user with default values', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            is_admin: false,
            is_hubspot_user: false,
            profile_image_key: 'default.jpg',
            is_active: true,
            created_at: new Date(),
            permissions: [],
            notifications: []
        };
        userRepositoryMock.createUser.mockResolvedValue(mockUser);

        const result = await userService.createUser('test_user', 'test@example.com');

        expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
            'test_user',
            'test@example.com',
            false,
            false,
            'default.jpg',
            true
        );
        expect(result).toEqual(mockUser);
    });

    test('should create a new user with custom values', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            is_admin: true,
            is_hubspot_user: true,
            profile_image_key: 'custom.jpg',
            is_active: false,
            created_at: new Date(),
            permissions: [],
            notifications: []
        };
        userRepositoryMock.createUser.mockResolvedValue(mockUser);

        const result = await userService.createUser(
            'test_user',
            'test@example.com',
            true,
            true,
            'custom.jpg',
            false
        );

        expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
            'test_user',
            'test@example.com',
            true,
            true,
            'custom.jpg',
            false
        );
        expect(result).toEqual(mockUser);
    });

    test('should get a user by ID', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            is_admin: false,
            is_hubspot_user: false,
            profile_image_key: 'default.jpg',
            is_active: true,
            created_at: new Date(),
            permissions: [],
            notifications: []
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
            is_admin: false,
            is_hubspot_user: false,
            profile_image_key: 'default.jpg',
            is_active: true,
            created_at: new Date(),
            permissions: [],
            notifications: []
        };
        const updateData = {
            username: 'updateduser',
            is_active: false
        };
        userRepositoryMock.updateUser.mockResolvedValue(mockUser);

        const result = await userService.updateUser(1, updateData);
        expect(userRepositoryMock.updateUser).toHaveBeenCalledWith(1, updateData);
        expect(result).toEqual(mockUser);
    });

    test('should get user by email', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            is_admin: false,
            is_hubspot_user: false,
            profile_image_key: 'default.jpg',
            is_active: true,
            created_at: new Date(),
            permissions: [],
            notifications: []
        };
        userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);

        const result = await userService.getUserByEmail('test@example.com');

        expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(result).toEqual(mockUser);
    });

    test('should get user by username', async () => {
        const mockUser = {
            user_id: 1,
            username: 'test_user',
            email: 'test@example.com',
            is_admin: false,
            is_hubspot_user: false,
            profile_image_key: 'default.jpg',
            is_active: true,
            created_at: new Date(),
            permissions: [],
            notifications: []
        };
        userRepositoryMock.getUserByUsername.mockResolvedValue(mockUser);

        const result = await userService.getUserByUsername('test_user');

        expect(userRepositoryMock.getUserByUsername).toHaveBeenCalledWith('test_user');
        expect(result).toEqual(mockUser);
    });
});
