import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function createFakeData() {
  for (let i = 0; i < 5; i++) {
    const clerkId = `user_${faker.string.uuid()}`;

    await prisma.user.create({
      data: {
        clerkId,
        Profil: {
          create: {
            prenom: faker.person.firstName(),
            nom: faker.person.lastName(),
            dateNaissance: faker.date.past({ years: 30 }),
            sexe: faker.helpers.arrayElement(['M', 'F', 'Autre']),
            telephone: faker.phone.number(),
            email: faker.internet.email(),
            ville: faker.location.city(),
            assuranceMaladie: `RAMQ${faker.string.numeric(12)}`,
            cin: faker.string.alphanumeric(10),
            profession: faker.person.jobTitle(),
          },
        },
        Favoris: {
          create: [
            {
              medecinId: `med_${faker.string.uuid()}`,
            },
            {
              medecinId: `med_${faker.string.uuid()}`,
            },
          ],
        },
        Historique: {
          create: [
            {
              rendezVousId: `rdv_${faker.string.uuid()}`,
            },
            {
              rendezVousId: `rdv_${faker.string.uuid()}`,
            },
          ],
        },
      },
    });
  }
}

async function main() {
  console.log('Création des données fictives...');

  // Nettoyage initial
  await prisma.historique.deleteMany();
  await prisma.favoris.deleteMany();
  await prisma.profil.deleteMany();
  await prisma.user.deleteMany();

  // Création des données
  await createFakeData();

  // Vérification
  const users = await prisma.user.findMany({
    include: {
      Profil: true,
      Favoris: true,
      Historique: true,
    },
  });

  console.log('\n Détail des utilisateurs:');
  users.forEach((user) => {
    console.log(`\n Utilisateur ${user.clerkId}:`);
    console.log(`    Profil: ${user.Profil[0].prenom} ${user.Profil[0].nom}`);
    console.log(`    Favoris (${user.Favoris.length}):`);
    user.Favoris.forEach((fav) => console.log(`      - ${fav.medecinId}`));
    console.log(`    Historique (${user.Historique.length}):`);
    user.Historique.forEach((hist) =>
      console.log(`      - ${hist.rendezVousId}`)
    );
  });
  console.log('Données créées avec succès:');
  console.log(`Utilisateurs: ${users.length}`);
  console.log(
    `Profils: ${users.reduce((acc, user) => acc + (user.Profil ? 1 : 0), 0)}`
  );
  console.log(
    `Favoris: ${users.reduce((acc, user) => acc + user.Favoris.length, 0)}`
  );
  console.log(
    `Historiques: ${users.reduce((acc, user) => acc + user.Historique.length, 0)}`
  );
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
