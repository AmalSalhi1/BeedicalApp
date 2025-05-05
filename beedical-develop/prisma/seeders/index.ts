import { PrismaClient } from '@prisma/client';
import { seedSpecialites } from './specialites';
import { seedVilles } from './villes';
import { seedMedecins } from './medecins';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seeding process...');
  
  await prisma.listeMedecins.deleteMany();
  await prisma.specialite.deleteMany();
  await prisma.ville.deleteMany();
  
  await seedSpecialites();
  await seedVilles();
  await seedMedecins();
  
  console.log('All seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });