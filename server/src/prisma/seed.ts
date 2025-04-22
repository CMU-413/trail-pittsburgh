import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE 
            "Issue", "Park", "Trail", "User", "Notification" 
        RESTART IDENTITY CASCADE;
    `);

    // Create Users
    //eslint-disable-next-line
    const users = await prisma.user.createMany({
        data: [
            { 
                username: 'john_doe', 
                email: 'john@example.com',
                isAdmin: false,
                permission: 'View',
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'jane_smith', 
                email: 'jane@example.com',
                isAdmin: true,
                permission: 'Admin',
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'mike_wilson', 
                email: 'mike@example.com',
                isAdmin: false,
                permission: 'View',
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'sarah_jones', 
                email: 'sarah@example.com',
                isAdmin: false,
                permission: 'View',
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'david_brown', 
                email: 'david@example.com',
                isAdmin: false,
                permission: 'View',
                profileImage: 'default.jpg',
                isActive: true
            }
        ]
    });

    // Create Parks
    //eslint-disable-next-line
    const parks = await prisma.park.createMany({
        data: [
            { name: 'Point State Park', county: 'Allegheny' },
            { name: 'Schenley Park', county: 'Allegheny' },
            { name: 'Frick Park', county: 'Allegheny' },
            { name: 'Highland Park', county: 'Allegheny' },
            { name: 'Riverview Park', county: 'Allegheny' }
        ]
    });

    const parkRecords = await prisma.park.findMany();

    // Create Trails
    //eslint-disable-next-line
    const trails = await prisma.trail.createMany({
        data: [
            { name: 'Great Allegheny Passage', parkId: parkRecords[0].parkId, isOpen: true },
            { name: 'Three Rivers Heritage Trail', parkId: parkRecords[1].parkId, isOpen: true },
            { name: 'Frick Park Trails', parkId: parkRecords[2].parkId, isOpen: true },
            { name: 'Schenley Park Trails', parkId: parkRecords[3].parkId, isOpen: true },
            { name: 'Highland Park Trails', parkId: parkRecords[4].parkId, isOpen: true }
        ]
    });

    const trailRecords = await prisma.trail.findMany();

    // Create Issues
    //eslint-disable-next-line
    const issues = await prisma.issue.createMany({
        data: [
            {
                parkId: parkRecords[0].parkId,
                trailId: trailRecords[0].trailId,
                issueType: 'Flooding',
                urgency: 4,
                description: 'Heavy rainfall caused water pooling on the trail.',
                isPublic: true,
                status: 'Open',
                notifyReporter: true,
                reporterEmail: 'john@example.com'
            },
            {
                parkId: parkRecords[1].parkId,
                trailId: trailRecords[1].trailId,
                issueType: 'Tree Obstruction',
                urgency: 3,
                description: 'A fallen tree is blocking the path near mile marker 5.',
                isPublic: true,
                status: 'Open',
                notifyReporter: true,
                reporterEmail: 'jane@example.com'
            },
            {
                parkId: parkRecords[2].parkId,
                trailId: trailRecords[2].trailId,
                issueType: 'Erosion',
                urgency: 5,
                description: 'Severe erosion has made the path unsafe for bikers.',
                isPublic: true,
                status: 'Open',
                notifyReporter: true,
                reporterEmail: 'mike@example.com'
            }
        ]
    });

    const issueRecords = await prisma.issue.findMany();

    // Create Notifications
    //eslint-disable-next-line
    const notifications = await prisma.notification.createMany({
        data: [
            {
                issueId: issueRecords[0].issueId,
                recipientEmail: 'john@example.com',
                content: 'Your issue has been reported successfully.'
            },
            {
                issueId: issueRecords[1].issueId,
                recipientEmail: 'jane@example.com',
                content: 'New issue reported in your assigned park.'
            }
        ]
    });
}

main()
    .catch((e) => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
