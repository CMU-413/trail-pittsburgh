import {
    PrismaClient, UserRoleEnum, IssueStatusEnum, IssueTypeEnum, IssueUrgencyEnum 
} from '@prisma/client';

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
                role: UserRoleEnum.ROLE_USER,
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'jane_smith', 
                email: 'jane@example.com',
                role: UserRoleEnum.ROLE_ADMIN,
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'mike_wilson', 
                email: 'mike@example.com',
                role: UserRoleEnum.ROLE_USER,
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'sarah_jones', 
                email: 'sarah@example.com',
                role: UserRoleEnum.ROLE_USER,
                profileImage: 'default.jpg',
                isActive: true
            },
            { 
                username: 'david_brown', 
                email: 'david@example.com',
                role: UserRoleEnum.ROLE_SUPERADMIN,
                profileImage: 'default.jpg',
                isActive: true
            }
        ]
    });

    // Create Parks
    //eslint-disable-next-line
    const parks = await prisma.park.createMany({
        data: [
            { name: 'Alameda Park', county: 'Butler' },
            { name: 'Bavington - Hillman State Park', county: 'Washington' },
            { name: 'Boyce Park', county: 'Allegheny' },
            { name: 'Deer Lakes Park', county: 'Allegheny' },
            { name: 'Frick Park', county: 'Allegheny' },
            { name: 'Hartwood Acres', county: 'Allegheny' },
            { name: 'Highland Park', county: 'Allegheny' },
            { name: 'Moraine State Park', county: 'Butler' },
            { name: 'North Park', county: 'Allegheny' },
            { name: 'Oakmont Trails', county: 'Allegheny' },
            { name: 'Riverview Park', county: 'Allegheny' },
            { name: 'Settlers Cabin Park', county: 'Allegheny' },
            { name: 'South Park', county: 'Allegheny' },
            { name: 'White Oak Park', county: 'Allegheny' }
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
                issueType: IssueTypeEnum.FLOODING,
                urgency: IssueUrgencyEnum.HIGH,
                description: 'Heavy rainfall caused water pooling on the trail.',
                isPublic: true,
                status: IssueStatusEnum.OPEN,
                notifyReporter: true,
                reporterEmail: 'john@example.com'
            },
            {
                parkId: parkRecords[1].parkId,
                trailId: trailRecords[1].trailId,
                issueType: IssueTypeEnum.OBSTRUCTION,
                urgency: IssueUrgencyEnum.MEDIUM,
                description: 'A fallen tree is blocking the path near mile marker 5.',
                isPublic: true,
                status: IssueStatusEnum.OPEN,
                notifyReporter: true,
                reporterEmail: 'jane@example.com'
            },
            {
                parkId: parkRecords[2].parkId,
                trailId: trailRecords[2].trailId,
                issueType: IssueTypeEnum.EROSION,
                urgency: IssueUrgencyEnum.HIGH,
                description: 'Severe erosion has made the path unsafe for bikers.',
                isPublic: true,
                status: IssueStatusEnum.OPEN,
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
