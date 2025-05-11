import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedMedecins() {
  console.log('Seeding medecins...');
  
  const specialites = await prisma.specialite.findMany();
  const villes = await prisma.ville.findMany();
  
  if (specialites.length === 0 || villes.length === 0) {
    console.error('Please seed specialites and villes first!');
    return;
  }
  
  const medecins = [
    {
      nom: "Dr. Ahmed Ali",
      adresse: "123 Avenue Hassan II",
      specialiteId: specialites.find(s => s.nom === "Cardiologie")?.id,
      villeId: villes.find(v => v.nom === "Casablanca")?.id
    },
    {
      nom: "Dr. Karim Bennani",
      adresse: "45 Rue Mohammed V",
      specialiteId: specialites.find(s => s.nom === "Pédiatrie")?.id,
      villeId: villes.find(v => v.nom === "Rabat")?.id
    },
    {
      nom: "Dr. Fatima Zahra",
      adresse: "78 Avenue Allal Ben Abdellah",
      specialiteId: specialites.find(s => s.nom === "Neurologie")?.id,
      villeId: villes.find(v => v.nom === "Marrakech")?.id
    },
    {
      nom: "Dr. Amine Saidi",
      adresse: "12 Boulevard Zerktouni",
      specialiteId: specialites.find(s => s.nom === "ORL")?.id,
      villeId: villes.find(v => v.nom === "Fès")?.id
    },
    {
      nom: "Dr. Leila El Mansouri",
      adresse: "56 Rue Ibn Batouta",
      specialiteId: specialites.find(s => s.nom === "Dermatologie")?.id,
      villeId: villes.find(v => v.nom === "Tanger")?.id
    },
    {
      nom: "Dr. Youssef Hachimi",
      adresse: "34 Avenue Mohammed VI",
      specialiteId: specialites.find(s => s.nom === "Dentisterie")?.id,
      villeId: villes.find(v => v.nom === "Casablanca")?.id
    },
    {
      nom: "Dr. Nadia Boussaid",
      adresse: "90 Rue Abou Bakr Seddik",
      specialiteId: specialites.find(s => s.nom === "Ophtalmologie")?.id,
      villeId: villes.find(v => v.nom === "Rabat")?.id
    },
    {
      nom: "Dr. Mehdi Touzani",
      adresse: "23 Boulevard Anfa",
      specialiteId: specialites.find(s => s.nom === "Gynécologie")?.id,
      villeId: villes.find(v => v.nom === "Marrakech")?.id
    },
    {
      nom: "Dr. Hajar Idrissi",
      adresse: "67 Avenue Hassan II",
      specialiteId: specialites.find(s => s.nom === "Psychologie")?.id,
      villeId: villes.find(v => v.nom === "Fès")?.id
    },
    {
      nom: "Dr. Mohamed Fadili",
      adresse: "45 Rue Ibn Sina",
      specialiteId: specialites.find(s => s.nom === "Médecine générale")?.id,
      villeId: villes.find(v => v.nom === "Tanger")?.id
    }
  ];
  
  for (const medecin of medecins) {
    if (!medecin.specialiteId || !medecin.villeId) {
      console.error(`Missing specialite or ville for ${medecin.nom}`);
      continue;
    }
    
    await prisma.listeMedecins.create({
      data: {
        ...medecin,
        specialiteId: medecin.specialiteId as string,
        villeId: medecin.villeId as string
      }
    });
  }
  
  console.log('Medecins seeded successfully!');
}

export { seedMedecins };