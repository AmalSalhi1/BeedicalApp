import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const doctorId = params.id;
    
    if (!doctorId) {
      return NextResponse.json(
        { error: 'ID du médecin manquant' },
        { status: 400 }
      );
    }

    const doctor = await prisma.listeMedecins.findUnique({
      where: { id: doctorId },
      include: {
        specialite: true,
        ville: true
      }
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Médecin non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(doctor);
  } catch (error) {
    console.error('Error fetching doctor:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du médecin' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
