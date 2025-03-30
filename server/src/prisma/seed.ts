import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting database seeding...');
    
    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "Issue", "Park", "Trail", "User", "Permission", "Notification", "Anonymous_user" RESTART IDENTITY CASCADE;`);
        console.log('Tables truncated successfully');

        // Create Users
        const users = await prisma.user.createMany({
            data: [
                { 
                    username: 'john_doe', 
                    email: 'john@example.com',
                    is_admin: false,
                    is_hubspot_user: false,
                    profile_image_key: 'default.jpg',
                    is_active: true
                },
                { 
                    username: 'jane_smith', 
                    email: 'jane@example.com',
                    is_admin: true,
                    is_hubspot_user: false,
                    profile_image_key: 'default.jpg',
                    is_active: true
                },
                { 
                    username: 'mike_wilson', 
                    email: 'mike@example.com',
                    is_admin: false,
                    is_hubspot_user: false,
                    profile_image_key: 'default.jpg',
                    is_active: true
                },
                { 
                    username: 'sarah_jones', 
                    email: 'sarah@example.com',
                    is_admin: false,
                    is_hubspot_user: false,
                    profile_image_key: 'default.jpg',
                    is_active: true
                },
                { 
                    username: 'david_brown', 
                    email: 'david@example.com',
                    is_admin: false,
                    is_hubspot_user: false,
                    profile_image_key: 'default.jpg',
                    is_active: true
                }
            ]
        });

        // Create Parks
        const parks = await prisma.park.createMany({
            data: [
                { 
                    name: 'Point State Park', 
                    county: 'Allegheny',
                    is_active: true 
                },
                { 
                    name: 'Schenley Park', 
                    county: 'Allegheny',
                    is_active: true 
                },
                { 
                    name: 'Frick Park', 
                    county: 'Allegheny',
                    is_active: true 
                },
                { 
                    name: 'Highland Park', 
                    county: 'Allegheny',
                    is_active: true 
                },
                { 
                    name: 'Riverview Park', 
                    county: 'Allegheny',
                    is_active: true 
                }
            ]
        });

        // Fetch created parks
        const parkRecords = await prisma.park.findMany();

        // Create Trails
        const trails = await prisma.trail.createMany({
            data: [
                { 
                    name: 'Great Allegheny Passage', 
                    park_id: parkRecords[0].park_id,
                    is_active: true,
                    is_open: true
                },
                { 
                    name: 'Three Rivers Heritage Trail', 
                    park_id: parkRecords[1].park_id,
                    is_active: true,
                    is_open: true
                },
                { 
                    name: 'Frick Park Trails', 
                    park_id: parkRecords[2].park_id,
                    is_active: true,
                    is_open: true
                },
                { 
                    name: 'Schenley Park Trails', 
                    park_id: parkRecords[3].park_id,
                    is_active: true,
                    is_open: true
                },
                { 
                    name: 'Highland Park Trails', 
                    park_id: parkRecords[4].park_id,
                    is_active: true,
                    is_open: true
                }
            ]
        });

        // Fetch created trails
        const trailRecords = await prisma.trail.findMany();

        // Create Issues
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
                    notify_reporter: true
                },
                {
                    park_id: parkRecords[1].park_id,
                    trail_id: trailRecords[1].trail_id,
                    issue_type: 'Tree Obstruction',
                    urgency: 3,
                    description: 'A fallen tree is blocking the path near mile marker 5.',
                    is_public: true,
                    status: 'Open',
                    notify_reporter: true
                },
                {
                    park_id: parkRecords[2].park_id,
                    trail_id: trailRecords[2].trail_id,
                    issue_type: 'Erosion',
                    urgency: 5,
                    description: 'Severe erosion has made the path unsafe for bikers.',
                    is_public: true,
                    status: 'Open',
                    notify_reporter: true
                }
            ]
        });

        // Create Permissions
        const permissions = await prisma.permission.createMany({
            data: [
                {
                    user_id: 2, // jane_smith (admin)
                    resource_type: 'Park',
                    resource_id: parkRecords[0].park_id,
                    permission_type: 'Admin',
                    is_active: true
                },
                {
                    user_id: 1, // john_doe
                    resource_type: 'Park',
                    resource_id: parkRecords[1].park_id,
                    permission_type: 'View',
                    is_active: true
                }
            ]
        });

        // Create Notifications
        const notifications = await prisma.notification.createMany({
            data: [
                {
                    recipient_id: 1,
                    content: 'Your issue has been reported successfully.'
                },
                {
                    recipient_id: 2,
                    content: 'New issue reported in your assigned park.'
                }
            ]
        });

    } catch (error) {
        console.error('Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
