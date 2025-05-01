import { UserRepository } from '@/repositories';
import { UserService } from '@/services';
import { UserRoleEnum } from '@prisma/client';


jest.mock('@/repositories/UserRepository');

describe('UserService', () => {
    let userService: UserService;
    let userRepositoryMock: jest.Mocked<UserRepository>;

    const mockUser = {
        userId: 1,
        username: 'test_user',
        email: 'test@example.com',
        role: UserRoleEnum.ROLE_USER,
        profileImage: 'default.jpg',
        isActive: true,
        createdAt: new Date(),
        profileImageKey: 'default.jpg',
    };

    beforeEach(() => {
        userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
        userService = new UserService(userRepositoryMock);
    });

    test('should create a new user with default values', async () => {
        userRepositoryMock.createUser.mockResolvedValue(mockUser);

        const result = await userService.createUser('test_user', 'test@example.com');

        expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
            'test_user',
            'test@example.com',
            UserRoleEnum.ROLE_USER,
            'default.jpg',
            true
        );
        expect(result).toEqual(mockUser);
    });

    test('should create a new user with custom values', async () => {
        const customUser = {
            ...mockUser,
            role: UserRoleEnum.ROLE_ADMIN,
            profileImage: 'custom.jpg',
            isActive: false
        };

        userRepositoryMock.createUser.mockResolvedValue(customUser);

        const result = await userService.createUser(
            'test_user',
            'test@example.com',
            UserRoleEnum.ROLE_ADMIN,
            'custom.jpg',
            false
        );

        expect(userRepositoryMock.createUser).toHaveBeenCalledWith(
            'test_user',
            'test@example.com',
            UserRoleEnum.ROLE_ADMIN,
            'custom.jpg',
            false
        );
        expect(result).toEqual(customUser);
    });

    test('should get a user by ID', async () => {
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

    test('should update user if they exist', async () => {
        const updateData = { username: 'updated_user', isActive: false };
        const updatedUser = { ...mockUser, ...updateData };

        userRepositoryMock.getUser.mockResolvedValue(mockUser);
        userRepositoryMock.updateUser.mockResolvedValue(updatedUser);

        const result = await userService.updateUser(1, updateData);

        expect(userRepositoryMock.getUser).toHaveBeenCalledWith(1);
        expect(userRepositoryMock.updateUser).toHaveBeenCalledWith(1, updateData);
        expect(result).toEqual(updatedUser);
    });

    test('should not update user if not found', async () => {
        userRepositoryMock.getUser.mockResolvedValue(null);

        const result = await userService.updateUser(999, { username: 'ghost' });

        expect(userRepositoryMock.getUser).toHaveBeenCalledWith(999);
        expect(result).toBeNull();
    });

    test('should get user by email', async () => {
        userRepositoryMock.getUserByEmail.mockResolvedValue(mockUser);

        const result = await userService.getUserByEmail('test@example.com');

        expect(userRepositoryMock.getUserByEmail).toHaveBeenCalledWith('test@example.com');
        expect(result).toEqual(mockUser);
    });
});
