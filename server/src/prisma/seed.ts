import {
    PrismaClient, UserRoleEnum, IssueStatusEnum, IssueTypeEnum, IssueRiskEnum
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRawUnsafe(`
        TRUNCATE TABLE 
            "Issue", "Park", "User", "Notification" 
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
            { name: 'Alameda Park', county: 'Butler', 
			  minLatitude: 40.866, minLongitude: -79.945,
			  maxLatitude: 40.884, maxLongitude: -79.916 },
            { name: 'Bavington - Hillman State Park', county: 'Washington',
			  minLatitude: 40.366, minLongitude: -80.472,
			  maxLatitude: 40.4015, maxLongitude: -80.417, },
            { name: 'Boyce Park', county: 'Allegheny',
			  minLatitude: 40.431, minLongitude: -79.706,
			  maxLatitude: 40.4615, maxLongitude: -79.662, },
            { name: 'Deer Lakes Park', county: 'Allegheny',
			  minLatitude: 40.5955, minLongitude: -79.784,
			  maxLatitude: 40.6315, maxLongitude: -79.735, },
            { name: 'Frick Park', county: 'Allegheny',
			  minLatitude: 40.4095, minLongitude: -79.9275,
			  maxLatitude: 40.4435, maxLongitude: -79.8895, },
            { name: 'Hartwood Acres', county: 'Allegheny',
			  minLatitude: 40.5555, minLongitude: -79.9385,
			  maxLatitude: 40.5805, maxLongitude: -79.8965, },
            { name: 'Highland Park', county: 'Allegheny',
			  minLatitude: 40.468, minLongitude: -79.935,
			  maxLatitude: 40.4865, maxLongitude: -79.902, },
            { name: 'Moraine State Park', county: 'Butler',
			  minLatitude: 40.905, minLongitude: -80.175,
			  maxLatitude: 40.995, maxLongitude: -80.03, },
            { name: 'North Park', county: 'Allegheny',
			  minLatitude: 40.578, minLongitude: -80.05246,
			  maxLatitude: 40.62718, maxLongitude: -79.97361, },
            { name: 'Oakmont Trails', county: 'Allegheny',
			  minLatitude: 40.5135, minLongitude: -79.845,
			  maxLatitude: 40.5325, maxLongitude: -79.8155, },
            { name: 'Riverview Park', county: 'Allegheny',
			  minLatitude: 40.4795, minLongitude: -80.0225,
			  maxLatitude: 40.5035, maxLongitude: -79.9985, },
            { name: 'Settlers Cabin Park', county: 'Allegheny',
			  minLatitude: 40.43, minLongitude: -80.2,
			  maxLatitude: 40.4755, maxLongitude: -80.14, },
            { name: 'South Park', county: 'Allegheny',
			  minLatitude: 40.265, minLongitude: -80.05,
			  maxLatitude: 40.33, maxLongitude: -79.975, },
            { name: 'White Oak Park', county: 'Allegheny',
			  minLatitude: 40.3425, minLongitude: -79.8235,
			  maxLatitude: 40.3695, maxLongitude: -79.7925, }
        ]
    });

    const parkRecords = await prisma.park.findMany();

    // Create Issues
    //eslint-disable-next-line
    const issues = await prisma.issue.createMany({
        data: [
            {
                parkId: parkRecords[0].parkId,
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
            },
            {
                parkId: parkRecords[1].parkId,
                issueType: IssueTypeEnum.OBSTRUCTION,
                safetyRisk: IssueRiskEnum.MINOR_RISK,
                passible: false,
                latitude: 40.37,
                longitude: -80.42,
                description: 'A fallen tree is blocking the path near mile marker 5.',
                isPublic: true,
                isImagePublic: false,
                status: IssueStatusEnum.OPEN,
                notifyReporter: true,
                reporterEmail: 'jane@example.com'
            },
            {
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
        // eslint-disable-next-line no-console
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
