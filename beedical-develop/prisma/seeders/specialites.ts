import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSpecialites() {
  const specialites = [
    { nom: "Cardiologie" },
    { nom: "Pédiatrie" },
    { nom: "Neurologie" },
    { nom: "ORL" },
    { nom: "Dermatologie" },
    { nom: "Dentisterie" },
    { nom: "Ophtalmologie" },
    { nom: "Gynécologie" },
    { nom: "Psychologie" },
    { nom: "Médecine générale" }
  ];

  console.log('Seeding specialites...');
  
  for (const specialite of specialites) {
    await prisma.specialite.create({
      data: specialite
    });
  }
  
  console.log('Specialites seeded successfully!');
}

export { seedSpecialites };