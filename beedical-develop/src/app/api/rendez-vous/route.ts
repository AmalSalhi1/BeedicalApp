import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

// GET - Récupérer les rendez-vous d'un utilisateur
export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const medecinId = searchParams.get('medecinId');
    const date = searchParams.get('date');
    const status = searchParams.get('status');
    
    let whereClause: any = {};
    
    // Filtrer par médecin si spécifié
    if (medecinId) {
      whereClause.medecinId = parseInt(medecinId);
    }
    
    // Filtrer par date si spécifiée
    if (date) {
      const dateObj = new Date(date);
      whereClause.date = {
        gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        lt: new Date(dateObj.setHours(23, 59, 59, 999))
      };
    }
    
    // Filtrer par statut si spécifié
    if (status) {
      whereClause.status = status;
    }
    
    // Si aucun filtre spécifique, récupérer les rendez-vous de l'utilisateur
    if (!medecinId && !date && !status) {
      whereClause.OR = [
        { patientId: userId },
        { 
          proche: {
            gerants: {
              some: {
                userId: userId
              }
            }
          }
        }
      ];
    }
    
    const rendezVous = await prisma.rendezVous.findMany({
      where: whereClause,
      include: {
        medecin: {
          include: {
            ville: true,
            specialites: {
              include: {
                specialite: true
              }
            }
          }
        },
        proche: true
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    return NextResponse.json(rendezVous);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau rendez-vous
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const { date, heureDebut, heureFin, medecinId, procheId } = body;
    
    // Vérifier si le rendez-vous est disponible
    const existingRendezVous = await prisma.rendezVous.findFirst({
      where: {
        date: new Date(date),
        heureDebut,
        heureFin,
        medecinId: parseInt(medecinId),
        status: 'disponible'
      }
    });
    
    if (!existingRendezVous) {
      return NextResponse.json(
        { error: 'Ce créneau n\'est pas disponible' },
        { status: 400 }
      );
    }
    
    // Mettre à jour le rendez-vous
    const updatedRendezVous = await prisma.rendezVous.update({
      where: {
        id: existingRendezVous.id
      },
      data: {
        patientId: userId,
        procheId: procheId ? parseInt(procheId) : null,
        status: 'reservé'
      }
    });
    
    return NextResponse.json(updatedRendezVous);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du rendez-vous' },
      { status: 500 }
    );
  }
}
