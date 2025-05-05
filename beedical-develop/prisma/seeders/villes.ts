import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedVilles() {
  const villes = [
    { nom: "Casablanca", region: "Casablanca-Settat" },
    { nom: "Rabat", region: "Rabat-Salé-Kénitra" },
    { nom: "Marrakech", region: "Marrakech-Safi" },
    { nom: "Fès", region: "Fès-Meknès" },
    { nom: "Tanger", region: "Tanger-Tétouan-Al Hoceïma" }
  ];

  console.log('Seeding villes...');
  
  for (const ville of villes) {
    await prisma.ville.create({
      data: ville
    });
  }
  
  console.log('Villes seeded successfully!');
}

export { seedVilles };