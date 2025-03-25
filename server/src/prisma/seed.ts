import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // eslint-disable-next-line
    console.log('Starting database seeding...');
    
    try {
        await prisma.$executeRawUnsafe(`TRUNCATE TABLE "issues", "parks", "trails", "users" RESTART IDENTITY CASCADE;`);
        // eslint-disable-next-line
        console.log('Tables truncated successfully');

        // Create Users
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const users = await prisma.users.createMany({
            data: [
                { username: 'john_doe', email: 'john@example.com' },
                { username: 'jane_smith', email: 'jane@example.com' },
                { username: 'mike_wilson', email: 'mike@example.com' },
                { username: 'sarah_jones', email: 'sarah@example.com' },
                { username: 'david_brown', email: 'david@example.com' },
                { username: 'emma_davis', email: 'emma@example.com' },
                { username: 'alex_taylor', email: 'alex@example.com' },
                { username: 'lisa_anderson', email: 'lisa@example.com' },
                { username: 'tom_miller', email: 'tom@example.com' },
                { username: 'anna_white', email: 'anna@example.com' }
            ]
        });

        // Create Trails
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const trails = await prisma.trails.createMany({
            data: [
                { trail_name: 'Great Allegheny Passage', location: 'Pittsburgh, PA' },
                { trail_name: 'Three Rivers Heritage Trail', location: 'Pittsburgh, PA' },
                { trail_name: 'Frick Park Trails', location: 'Pittsburgh, PA' },
                { trail_name: 'Schenley Park Trails', location: 'Pittsburgh, PA' },
                { trail_name: 'Highland Park Trails', location: 'Pittsburgh, PA' },
                { trail_name: 'Riverview Park Trails', location: 'Pittsburgh, PA' },
                { trail_name: 'Mount Washington Trails', location: 'Pittsburgh, PA' },
                { trail_name: 'South Side Riverfront Trail', location: 'Pittsburgh, PA' },
                { trail_name: 'North Shore Riverfront Trail', location: 'Pittsburgh, PA' },
                { trail_name: 'Allegheny Commons Trails', location: 'Pittsburgh, PA' }
            ]
        });

        // Create Parks
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const parks = await prisma.parks.createMany({
            data: [
                { park_name: 'Point State Park', is_active: true },
                { park_name: 'Schenley Park', is_active: true },
                { park_name: 'Frick Park', is_active: true },
                { park_name: 'Highland Park', is_active: true },
                { park_name: 'Riverview Park', is_active: true },
                { park_name: 'Mount Washington Park', is_active: true },
                { park_name: 'South Side Park', is_active: true },
                { park_name: 'North Shore Park', is_active: true },
                { park_name: 'Allegheny Commons', is_active: true },
                { park_name: 'West End Overlook Park', is_active: true }
            ]
        });

        // Fetch created parks and trails
        const trailRecords = await prisma.trails.findMany();
        const parkRecords = await prisma.parks.findMany();

        // Create Issues
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const issues = await prisma.issues.createMany({
            data: [
                {
                    park_id: parkRecords[0].park_id,
                    trail_id: trailRecords[0].trail_id,
                    type: 'Flooding',
                    urgency: 4,
                    description: 'Heavy rainfall caused water pooling on the trail.',
                },
                {
                    park_id: parkRecords[1].park_id,
                    trail_id: trailRecords[1].trail_id,
                    type: 'Tree Obstruction',
                    urgency: 3,
                    description: 'A fallen tree is blocking the path near mile marker 5.',
                },
                {
                    park_id: parkRecords[2].park_id,
                    trail_id: trailRecords[2].trail_id,
                    type: 'Erosion',
                    urgency: 5,
                    description: 'Severe erosion has made the path unsafe for bikers.',
                },
                {
                    park_id: parkRecords[3].park_id,
                    trail_id: trailRecords[3].trail_id,
                    type: 'Littering',
                    urgency: 2,
                    description: 'Excessive trash and debris along the trail entrance.',
                },
                {
                    park_id: parkRecords[4].park_id,
                    trail_id: trailRecords[4].trail_id,
                    type: 'Vandalism',
                    urgency: 3,
                    description: 'Graffiti on park benches and signs near the trailhead.',
                },
                {
                    park_id: parkRecords[5].park_id,
                    trail_id: trailRecords[5].trail_id,
                    type: 'Surface Damage',
                    urgency: 4,
                    description: 'Large potholes and cracks in the trail surface.',
                },
                {
                    park_id: parkRecords[6].park_id,
                    trail_id: trailRecords[6].trail_id,
                    type: 'Vegetation Overgrowth',
                    urgency: 2,
                    description: 'Overgrown bushes encroaching on the trail path.',
                },
                {
                    park_id: parkRecords[7].park_id,
                    trail_id: trailRecords[7].trail_id,
                    type: 'Safety Hazard',
                    urgency: 5,
                    description: 'Broken guardrail near steep drop-off.',
                },
                {
                    park_id: parkRecords[8].park_id,
                    trail_id: trailRecords[8].trail_id,
                    type: 'Lighting Issue',
                    urgency: 3,
                    description: 'Non-functioning street lights along the trail.',
                },
                {
                    park_id: parkRecords[9].park_id,
                    trail_id: trailRecords[9].trail_id,
                    type: 'Bridge Maintenance',
                    urgency: 4,
                    description: 'Wooden bridge needs repair and reinforcement.',
                }
            ]
        });

    } catch (error) {
        // eslint-disable-next-line
        console.error('Error during seeding:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        // eslint-disable-next-line
        console.error('Fatal error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
