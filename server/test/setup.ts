import { prisma } from '../src/prisma/prismaClient';

// This runs before each test file
beforeAll(async () => {
    // Start a transaction for the test file
    await prisma.$executeRaw`BEGIN`;
});

// This runs after each test file
afterAll(async () => {
    // Rollback the transaction for the test file
    await prisma.$executeRaw`ROLLBACK`;
});

// This runs after all test files
afterAll(async () => {
    // Clean up any remaining data and disconnect
    await prisma.notification.deleteMany();
    await prisma.issue.deleteMany();
    await prisma.trail.deleteMany();
    await prisma.park.deleteMany();
    await prisma.$disconnect();
}); 