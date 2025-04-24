import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const location = searchParams.get('location') || '';

    console.log(`Recherche avec query: "${query}", location: "${location}"`);

    let whereClause: any = {};

    if (query && location) {
      whereClause = {
        AND: [
          {
            OR: [
              {
                OR: [
                  { prenom: { contains: query, mode: 'insensitive' } },
                  { nom: { contains: query, mode: 'insensitive' } }
                ]
              },
              {
                specialites: {
                  some: {
                    specialite: {
                      nom: { contains: query, mode: 'insensitive' }
                    }
                  }
                }
              }
            ]
          },
          {
            ville: {
              nom: { contains: location, mode: 'insensitive' }
            }
          }
        ]
      };
    }
    else if (query) {
      whereClause = {
        OR: [
          {
            OR: [
              { prenom: { contains: query, mode: 'insensitive' } },
              { nom: { contains: query, mode: 'insensitive' } }
            ]
          },
          {
            specialites: {
              some: {
                specialite: {
                  nom: { contains: query, mode: 'insensitive' }
                }
              }
            }
          }
        ]
      };
    }
    else if (location) {
      whereClause = {
        ville: {
          nom: { contains: location, mode: 'insensitive' }
        }
      };
    }

    const doctors = await prisma.medecin.findMany({
      where: whereClause,
      include: {
        ville: true,
        specialites: {
          include: {
            specialite: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      nom: `Dr. ${doctor.prenom} ${doctor.nom}`,
      specialite: doctor.specialites.map(s => s.specialite.nom).join(', '),
      disponibilite: doctor.disponibilite,
      image: doctor.image || '/images/default.png',
      location: `${doctor.ville.nom}, Maroc`,
      latitude: doctor.latitude,
      longitude: doctor.longitude,
      accepteNouveaux: doctor.accepteNouveaux,
      secteur: doctor.secteur,
      adresse: doctor.adresse,
      codePostal: doctor.codePostal,
      telephone: doctor.telephone
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Erreur lors de la recherche des médecins:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche des médecins' },
      { status: 500 }
    );
  }
}
