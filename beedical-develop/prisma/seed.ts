import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Villes marocaines
const villes = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kenitra',
  'Tétouan',
  'El Jadida',
  'Safi',
  'Mohammedia',
  'Béni Mellal',
  'Nador',
  'Essaouira',
  'Chefchaouen',
  'Ouarzazate',
  'Ifrane',
  'Errachidia',
  'Laâyoune',
  'Dakhla',
  'Taza',
  'Settat',
  'Berrechid',
  'Khouribga',
  'Larache',
  'Al Hoceima',
  'Tiznit',
  'Taroudant',
  'Guelmim',
  'Khemisset',
  'Taourirt',
  'Berkane',
  'Sidi Kacem'
];

// Spécialités médicales
const specialites = [
  'Médecin généraliste',
  '       ',
  'Dermatologue',
  'Gynécologue',
  'Ophtalmologue',
  'Pédiatre',
  'Psychiatre',
  'Neurologue',
  'Dentiste',
  'ORL',
  'Rhumatologue',
  'Urologue',
  'Endocrinologue',
  'Gastro-entérologue',
  'Pneumologue'
];

async function createFakeData() {
  // Créer des utilisateurs
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
            lieuNaissance: faker.location.city(),
            adresse: faker.location.streetAddress(),
            codePostal: faker.location.zipCode(),
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

// Fonction pour créer les villes
async function createVilles() {
  const villeEntities = [];

  for (const ville of villes) {
    const createdVille = await prisma.ville.create({
      data: {
        nom: ville
      }
    });
    villeEntities.push(createdVille);
  }

  return villeEntities;
}

// Fonction pour créer les spécialités
async function createSpecialites() {
  const specialiteEntities = [];

  for (const specialite of specialites) {
    const createdSpecialite = await prisma.specialite.create({
      data: {
        nom: specialite
      }
    });
    specialiteEntities.push(createdSpecialite);
  }

  return specialiteEntities;
}

// Fonction pour créer les disponibilités et rendez-vous
async function createDisponibilitesEtRendezVous(medecins) {
  // Récupérer les utilisateurs pour les rendez-vous
  const users = await prisma.user.findMany();

  // Pour chaque médecin, créer des disponibilités et quelques rendez-vous
  for (const medecin of medecins) {
    // Créer des disponibilités pour les 14 prochains jours
    const today = new Date();

    // Heures de travail possibles
    const heuresPossibles = [
      { debut: '09:00', fin: '10:00' },
      { debut: '10:00', fin: '11:00' },
      { debut: '11:00', fin: '12:00' },
      { debut: '14:00', fin: '15:00' },
      { debut: '15:00', fin: '16:00' },
      { debut: '16:00', fin: '17:00' },
    ];

    // Pour chaque jour
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      // Sauter les dimanches (jour 0)
      if (date.getDay() === 0) continue;

      // Choisir aléatoirement 3-5 créneaux horaires pour ce jour
      const nombreCreneaux = Math.floor(Math.random() * 3) + 3; // 3 à 5 créneaux
      const creneauxChoisis = [];

      for (let j = 0; j < nombreCreneaux; j++) {
        let index;
        do {
          index = Math.floor(Math.random() * heuresPossibles.length);
        } while (creneauxChoisis.includes(index));

        creneauxChoisis.push(index);
      }

      // Trier les créneaux pour qu'ils soient dans l'ordre
      creneauxChoisis.sort();

      // Créer les disponibilités pour ce jour
      for (const index of creneauxChoisis) {
        const { debut, fin } = heuresPossibles[index];

        // Créer la disponibilité
        const disponibilite = await prisma.disponibilite.create({
          data: {
            date,
            heureDebut: debut,
            heureFin: fin,
            medecinId: medecin.id
          }
        });

        // 30% de chance de créer un rendez-vous pour cette disponibilité
        if (Math.random() < 0.3 && users.length > 0) {
          // Choisir un utilisateur aléatoire
          const user = users[Math.floor(Math.random() * users.length)];

          // Créer le rendez-vous
          await prisma.rendezVous.create({
            data: {
              date,
              heureDebut: debut,
              heureFin: fin,
              medecinId: medecin.id,
              patientId: user.clerkId,
              status: 'reservé'
            }
          });
        } else {
          // Créer un rendez-vous disponible
          await prisma.rendezVous.create({
            data: {
              date,
              heureDebut: debut,
              heureFin: fin,
              medecinId: medecin.id,
              status: 'disponible'
            }
          });
        }
      }
    }
  }
}

async function createMedecins(villes, specialites) {
  const medecins = [];

  // Coordonnées approximatives des villes marocaines pour la carte
  const coordonnees = {
    'Casablanca': { lat: 33.5731, lng: -7.5898 },
    'Rabat': { lat: 34.0209, lng: -6.8416 },
    'Marrakech': { lat: 31.6295, lng: -7.9811 },
    'Fès': { lat: 34.0181, lng: -5.0078 },
    'Tanger': { lat: 35.7595, lng: -5.8340 },
    'Agadir': { lat: 30.4278, lng: -9.5981 },
    'Meknès': { lat: 33.8833, lng: -5.5500 },
    'Oujda': { lat: 34.6816, lng: -1.9086 },
    'Kenitra': { lat: 34.2541, lng: -6.5890 },
    'Tétouan': { lat: 35.5764, lng: -5.3684 },
    'El Jadida': { lat: 33.2316, lng: -8.5004 },
    'Safi': { lat: 32.2833, lng: -9.2333 },
    'Mohammedia': { lat: 33.6861, lng: -7.3850 },
    'Béni Mellal': { lat: 32.3424, lng: -6.3758 },
    'Nador': { lat: 35.1688, lng: -2.9286 },
    'Essaouira': { lat: 31.5125, lng: -9.7700 },
    'Chefchaouen': { lat: 35.1689, lng: -5.2636 },
    'Ouarzazate': { lat: 30.9335, lng: -6.9370 },
    'Ifrane': { lat: 33.5333, lng: -5.1000 },
    'Errachidia': { lat: 31.9314, lng: -4.4247 },
    'Laâyoune': { lat: 27.1418, lng: -13.1867 },
    'Dakhla': { lat: 23.6848, lng: -15.9579 },
    'Taza': { lat: 34.2100, lng: -4.0100 },
    'Settat': { lat: 33.0000, lng: -7.6167 },
    'Berrechid': { lat: 33.2655, lng: -7.5871 },
    'Khouribga': { lat: 32.8800, lng: -6.9100 },
    'Larache': { lat: 35.1933, lng: -6.1561 },
    'Al Hoceima': { lat: 35.2494, lng: -3.9278 },
    'Tiznit': { lat: 29.6974, lng: -9.7369 },
    'Taroudant': { lat: 30.4700, lng: -8.8800 },
    'Guelmim': { lat: 28.9870, lng: -10.0574 },
    'Khemisset': { lat: 33.8242, lng: -6.0658 },
    'Taourirt': { lat: 34.4100, lng: -2.8900 },
    'Berkane': { lat: 34.9200, lng: -2.3200 },
    'Sidi Kacem': { lat: 34.2200, lng: -5.7100 }
  };

  // Créer 30 médecins
  for (let i = 0; i < 30; i++) {
    // Choisir une ville aléatoire
    const villeIndex = Math.floor(Math.random() * villes.length);
    const ville = villes[villeIndex];

    // Choisir 1 à 3 spécialités aléatoires
    const numSpecialites = Math.floor(Math.random() * 2) + 1; // 1 ou 2 spécialités
    const selectedSpecialites = [];

    for (let j = 0; j < numSpecialites; j++) {
      let specialiteIndex;
      do {
        specialiteIndex = Math.floor(Math.random() * specialites.length);
      } while (selectedSpecialites.includes(specialiteIndex));

      selectedSpecialites.push(specialiteIndex);
    }

    // Générer des disponibilités aléatoires
    const jours = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const disponibilites = [];

    const numDispos = Math.floor(Math.random() * 3) + 1; // 1 à 3 disponibilités
    for (let j = 0; j < numDispos; j++) {
      const jour = jours[Math.floor(Math.random() * jours.length)];
      const heureDebut = Math.floor(Math.random() * 8) + 8; // 8h à 15h
      const heureFin = heureDebut + Math.floor(Math.random() * 4) + 2; // 2 à 5 heures plus tard
      disponibilites.push(`${jour}: ${heureDebut}h-${heureFin}h`);
    }

    // Créer le médecin avec des noms arabes
    // Liste de prénoms arabes
    const prenomsArabes = [
      'Mohammed', 'Ahmed', 'Ali', 'Omar', 'Youssef',
      'Ibrahim', 'Hamza', 'Amir', 'Hassan', 'Hussein',
      'Karim', 'Mustafa', 'Samir', 'Tariq', 'Ziad',
      'Bilal', 'Jamal', 'Malik', 'Nasser', 'Rachid',
      'Fatima', 'Aisha', 'Layla', 'Nour', 'Amina',
      'Mariam', 'Zahra', 'Samira', 'Leila', 'Yasmin',
      'Salma', 'Zainab', 'Hanan', 'Rania', 'Farida'
    ];

    // Liste de noms de famille arabes
    const nomsArabes = [
      'El Mansouri', 'Benani', 'Alaoui', 'El Fassi', 'Benjelloun',
      'Tazi', 'Bennani', 'Chaoui', 'El Amrani', 'Berrada',
      'Lahlou', 'Tahiri', 'Idrissi', 'Benmoussa', 'Ziani',
      'Belkadi', 'Chraibi', 'Ouazzani', 'Sebti', 'Lamrani',
      'El Khattabi', 'Bensouda', 'Cherkaoui', 'Kadiri', 'Filali'
    ];

    const prenom = prenomsArabes[Math.floor(Math.random() * prenomsArabes.length)];
    const nom = nomsArabes[Math.floor(Math.random() * nomsArabes.length)];

    // Utiliser le nom de la ville comme clé pour obtenir les coordonnées
    const coords = coordonnees[ville.nom as keyof typeof coordonnees] || { lat: 33.5731, lng: -7.5898 }; // Default to Casablanca if not found

    const medecin = await prisma.medecin.create({
      data: {
        prenom,
        nom,
        email: faker.internet.email({ firstName: prenom, lastName: nom }),
        telephone: faker.phone.number(),
        adresse: faker.location.streetAddress(),
        codePostal: faker.location.zipCode(),
        image: `/images/doctor${(i % 15) + 1}.png`,
        latitude: coords.lat + (Math.random() * 0.05 - 0.025),
        longitude: coords.lng + (Math.random() * 0.05 - 0.025),
        disponibilite: disponibilites,
        villeId: ville.id,
        accepteNouveaux: Math.random() > 0.2,
        secteur: Math.random() > 0.5 ? 1 : 2,
      }
    });

    // Associer les spécialités au médecin
    for (const specialiteIndex of selectedSpecialites) {
      await prisma.medecinSpecialite.create({
        data: {
          medecinId: medecin.id,
          specialiteId: specialites[specialiteIndex].id
        }
      });
    }

    medecins.push(medecin);
  }

  return medecins;
}

async function main() {
  console.log('Création des données fictives...');

  // Nettoyage initial
  await prisma.rendezVous.deleteMany();
  await prisma.disponibilite.deleteMany();
  await prisma.medecinSpecialite.deleteMany();
  await prisma.medecin.deleteMany();
  await prisma.specialite.deleteMany();
  await prisma.ville.deleteMany();
  await prisma.historique.deleteMany();
  await prisma.favoris.deleteMany();
  await prisma.profil.deleteMany();
  await prisma.user.deleteMany();

  // Création des données de base
  console.log('Création des utilisateurs...');
  await createFakeData();

  // Création des villes
  console.log('Création des villes...');
  const villeEntities = await createVilles();

  // Création des spécialités
  console.log('Création des spécialités...');
  const specialiteEntities = await createSpecialites();

  // Création des médecins
  console.log('Création des médecins...');
  const medecinEntities = await createMedecins(villeEntities, specialiteEntities);

  // Création des disponibilités et rendez-vous
  console.log('Création des disponibilités et rendez-vous...');
  await createDisponibilitesEtRendezVous(medecinEntities);

  // Vérification des utilisateurs
  const users = await prisma.user.findMany({
    include: {
      Profil: true,
      Favoris: true,
      Historique: true,
    },
  });

  // Vérification des médecins
  const medecins = await prisma.medecin.findMany({
    include: {
      ville: true,
      specialites: {
        include: {
          specialite: true
        }
      }
    }
  });

  // Affichage des résultats
  console.log('\nDonnées créées avec succès:');
  console.log(`Utilisateurs: ${users.length}`);
  console.log(`Profils: ${users.reduce((acc, user) => acc + (user.Profil ? 1 : 0), 0)}`);
  console.log(`Favoris: ${users.reduce((acc, user) => acc + user.Favoris.length, 0)}`);
  console.log(`Historiques: ${users.reduce((acc, user) => acc + user.Historique.length, 0)}`);
  console.log(`Villes: ${villeEntities.length}`);
  console.log(`Spécialités: ${specialiteEntities.length}`);
  console.log(`Médecins: ${medecins.length}`);

  // Vérification des disponibilités et rendez-vous
  const disponibilites = await prisma.disponibilite.findMany();
  const rendezVous = await prisma.rendezVous.findMany();
  console.log(`Disponibilités: ${disponibilites.length}`);
  console.log(`Rendez-vous: ${rendezVous.length}`);

  // Afficher quelques médecins pour vérification
  console.log('\nExemple de médecins:');
  for (let i = 0; i < Math.min(3, medecins.length); i++) {
    const medecin = medecins[i];
    console.log(`\nMédecin: Dr. ${medecin.prenom} ${medecin.nom}`);
    console.log(`  Ville: ${medecin.ville.nom}`);
    console.log(`  Spécialités: ${medecin.specialites.map(s => s.specialite.nom).join(', ')}`);
    console.log(`  Disponibilités: ${medecin.disponibilite.join(', ')}`);
  }
}

main()
  .catch((e) => {
    console.error('Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
