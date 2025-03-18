import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    
    const park1 = await prisma.parks.create({
        data: {
            name: 'Grand Canyon National Park', 
            county: 'Coconino',
            is_active: true
        }
    });

    const park2 = await prisma.parks.create({
        data: {
            name: 'Yellowstone National Park',
            county: 'Teton',
            is_active:true
        }
    });

    await prisma.trails.createMany({
        data: [
            {
                park_id: park1.park_id, 
                name: 'Great Allegheny Passage',
                is_active: true, 
                is_open: true
            },
            {
                park_id: park1.park_id,
                name: 'Three Rivers Heritage Trail',
                is_active: true,
                is_open: false
            },
            {
                park_id: park2.park_id,
                name: 'Vicky\'s Wonderland',
                is_active: true,
                is_open: false
            }
           
        ]
    });
    // eslint-disable-next-line no-console
    console.log('Database seeding completed');
}

main() 
    .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
