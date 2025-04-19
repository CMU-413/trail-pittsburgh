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
                is_admin: false,
                permission: 'View',
                profile_image: 'default.jpg',
                is_active: true
            },
            { 
                username: 'jane_smith', 
                email: 'jane@example.com',
                is_admin: true,
                permission: 'Admin',
                profile_image: 'default.jpg',
                is_active: true
            },
            { 
                username: 'mike_wilson', 
                email: 'mike@example.com',
                is_admin: false,
                permission: 'View',
                profile_image: 'default.jpg',
                is_active: true
            },
            { 
                username: 'sarah_jones', 
                email: 'sarah@example.com',
                is_admin: false,
                permission: 'View',
                profile_image: 'default.jpg',
                is_active: true
            },
            { 
                username: 'david_brown', 
                email: 'david@example.com',
                is_admin: false,
                permission: 'View',
                profile_image: 'default.jpg',
                is_active: true
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
            { name: 'Great Allegheny Passage', park_id: parkRecords[0].park_id, is_open: true },
            { name: 'Three Rivers Heritage Trail', park_id: parkRecords[1].park_id, is_open: true },
            { name: 'Frick Park Trails', park_id: parkRecords[2].park_id, is_open: true },
            { name: 'Schenley Park Trails', park_id: parkRecords[3].park_id, is_open: true },
            { name: 'Highland Park Trails', park_id: parkRecords[4].park_id, is_open: true }
        ]
    });

    const trailRecords = await prisma.trail.findMany();

    // Create Issues
    //eslint-disable-next-line
    const issues = await prisma.issue.createMany({
        data: [
            {
                park_id: parkRecords[0].park_id,
                trail_id: trailRecords[0].trail_id,
                issue_type: 'Flooding',
                urgency: 4,
                description: 'Heavy rainfall caused water pooling on the trail.',
                is_public: true,
                status: 'Open',
                notify_reporter: true,
                reporter_email: 'john@example.com'
            },
            {
                park_id: parkRecords[1].park_id,
                trail_id: trailRecords[1].trail_id,
                issue_type: 'Tree Obstruction',
                urgency: 3,
                description: 'A fallen tree is blocking the path near mile marker 5.',
                is_public: true,
                status: 'Open',
                notify_reporter: true,
                reporter_email: 'jane@example.com'
            },
            {
                park_id: parkRecords[2].park_id,
                trail_id: trailRecords[2].trail_id,
                issue_type: 'Erosion',
                urgency: 5,
                description: 'Severe erosion has made the path unsafe for bikers.',
                is_public: true,
                status: 'Open',
                notify_reporter: true,
                reporter_email: 'mike@example.com'
            }
        ]
    });

    const issueRecords = await prisma.issue.findMany();

    // Create Notifications
    //eslint-disable-next-line
    const notifications = await prisma.notification.createMany({
        data: [
            {
                issue_id: issueRecords[0].issue_id,
                recipient_email: 'john@example.com',
                content: 'Your issue has been reported successfully.'
            },
            {
                issue_id: issueRecords[1].issue_id,
                recipient_email: 'jane@example.com',
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
