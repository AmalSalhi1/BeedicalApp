import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';

  try {
    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { nom: { contains: query, mode: 'insensitive' } },
        { specialite: { nom: { contains: query, mode: 'insensitive' } } }
      ];
    }

    if (location) {
      whereClause.ville = { nom: { contains: location, mode: 'insensitive' } };
    }

    const doctors = await prisma.listeMedecins.findMany({
      where: whereClause,
      include: {
        specialite: true,
        ville: true
      }
    });

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      nom: doctor.nom,
      specialite: doctor.specialite.nom,
      location: doctor.ville.nom,
      image: '/images/default.png', 
      disponibilite: [], 
      acceptsNewPatients: true 
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la recherche' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}