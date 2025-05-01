import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from '../../src/app';
import { prisma } from '../../src/prisma/prismaClient';
import { UserRoleEnum } from '@prisma/client';

describe('Auth Router Integration Tests', () => {
    const testUser = {
        userId: 1,
        username: 'Test User',
        email: 'test@example.com',
        role: UserRoleEnum.ROLE_USER,
        profileImage: 'default.jpg',
        isActive: true
    };

    const generateValidToken = (userId: number) => {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'test-secret', {
            expiresIn: '1h'
        });
    };

    beforeAll(async () => {
        await prisma.$executeRaw`BEGIN`;
        await prisma.user.deleteMany();
        await prisma.user.create({
            data: testUser
        });
    });

    afterAll(async () => {
        await prisma.$executeRaw`ROLLBACK`;
        await prisma.$disconnect();
    });

    describe('GET /api/auth/me', () => {
        it('should return null when no token is provided', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ user: null });
        });

        it('should return null when an invalid token is provided', async () => {
            const response = await request(app)
                .get('/api/auth/me')
                .set('Cookie', ['token=invalid-token'])
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ user: null });
        });

        it('should return user information when a valid token is provided', async () => {
            const token = generateValidToken(testUser.userId);
            
            const response = await request(app)
                .get('/api/auth/me')
                .set('Cookie', [`token=${token}`])
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body.user).toMatchObject({
                id: testUser.userId,
                email: testUser.email,
                name: testUser.username,
                role: testUser.role
            });
        });

        it('should return null if user does not exist in database', async () => {
            const token = generateValidToken(999);
            
            const response = await request(app)
                .get('/api/auth/me')
                .set('Cookie', [`token=${token}`])
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ user: null });
        });

        it('should proxy Google profile images correctly', async () => {
            const googleImageUrl = 'https://lh3.googleusercontent.com/test-image';
            await prisma.user.update({
                where: { userId: testUser.userId },
                data: { profileImage: googleImageUrl }
            });
            
            const token = generateValidToken(testUser.userId);
            
            const response = await request(app)
                .get('/api/auth/me')
                .set('Cookie', [`token=${token}`])
                .send();
            
            expect(response.status).toBe(200);
            expect(response.body.user.picture).toContain('/api/auth/profile-image-proxy');
            expect(response.body.user.picture).toContain(encodeURIComponent(googleImageUrl));
        });
    });
});