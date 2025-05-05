import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const doctors = await prisma.listeMedecins.findMany({
      select: {
        id: true,
        nom: true,
        specialite: {
          select: {
            nom: true
          }
        }
      }
    });
    

    const formattedDoctors = doctors.map(doctor => ({
      id: doctor.id,
      nom: doctor.nom,
      specialite: doctor.specialite.nom
    }));
    
    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des médecins' },
      { status: 500 }
    );
  }
}