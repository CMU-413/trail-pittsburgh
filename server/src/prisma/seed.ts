import {
    PrismaClient, UserRoleEnum, IssueStatusEnum, IssueTypeEnum, IssueRiskEnum
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE 
            "Issue", "IssueGroup", "Park", "User", "Notification" 
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

    const groupedIssue = await prisma.issueGroup.create({
        data: {
            status: IssueStatusEnum.OPEN,
        }
    });

    const primaryGroupedIssue = await prisma.issue.create({
        data: {
            parkId: parkRecords[0].parkId,
            issueGroupId: groupedIssue.issueGroupId,
            issueType: IssueTypeEnum.OBSTRUCTION,
            safetyRisk: IssueRiskEnum.NO_RISK,
            passible: true,
            latitude: 40.87,
            longitude: -79.92,
            description: 'Heavy rainfall caused water pooling on the trail.',
            isPublic: true,
            isImagePublic: false,
            status: IssueStatusEnum.OPEN,
            notifyReporter: true,
            reporterEmail: 'john@example.com'
        }
    });

    await prisma.issue.create({
        data: {
            parkId: parkRecords[0].parkId,
            issueGroupId: groupedIssue.issueGroupId,
            issueType: IssueTypeEnum.OBSTRUCTION,
            safetyRisk: IssueRiskEnum.MINOR_RISK,
            passible: false,
            latitude: 40.8712,
            longitude: -79.9211,
            description: 'A second report of the same obstruction farther along the same park trail.',
            isPublic: true,
            isImagePublic: false,
            status: IssueStatusEnum.OPEN,
            notifyReporter: true,
            reporterEmail: 'jane@example.com'
        }
    });

    await prisma.issueGroup.update({
        where: { issueGroupId: groupedIssue.issueGroupId },
        data: {
            primaryIssueId: primaryGroupedIssue.issueId,
        }
    });

    await prisma.issue.create({
        data: {
            parkId: parkRecords[2].parkId,
            issueType: IssueTypeEnum.OBSTRUCTION,
            safetyRisk: IssueRiskEnum.SERIOUS_RISK,
            passible: false,
            latitude: 40.44,
            longitude: -79.68,
            description: 'Severe erosion has made the path unsafe for bikers.',
            isPublic: true,
            isImagePublic: false,
            status: IssueStatusEnum.OPEN,
            notifyReporter: true,
            reporterEmail: 'mike@example.com'
        }
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
        // eslint-disable-next-line no-console
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
