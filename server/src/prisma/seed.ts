import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    await prisma.trails.createMany({
        data: [
            { trail_name: 'Great Allegheny Passage', location: 'Pittsburgh, PA' },
            { trail_name: 'Three Rivers Heritage Trail', location: 'Pittsburgh, PA' },
            { trail_name: "Vicky's Wonderland", location: 'LalaLand, Utopia' }
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
