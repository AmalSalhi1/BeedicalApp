import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { prisma } from '@/lib/prisma';

// GET - Récupérer un rendez-vous spécifique
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    
    const rendezVous = await prisma.rendezVous.findUnique({
      where: { id },
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
      }
    });
    
    if (!rendezVous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur a le droit d'accéder à ce rendez-vous
    if (rendezVous.patientId !== userId) {
      // Vérifier si le rendez-vous concerne un proche géré par l'utilisateur
      if (rendezVous.procheId) {
        const procheGere = await prisma.procheGere.findFirst({
          where: {
            userId,
            procheId: rendezVous.procheId
          }
        });
        
        if (!procheGere) {
          return NextResponse.json(
            { error: 'Vous n\'êtes pas autorisé à accéder à ce rendez-vous' },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Vous n\'êtes pas autorisé à accéder à ce rendez-vous' },
          { status: 403 }
        );
      }
    }
    
    return NextResponse.json(rendezVous);
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un rendez-vous
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    const body = await req.json();
    const { status, procheId } = body;
    
    // Vérifier que le rendez-vous existe et appartient à l'utilisateur
    const rendezVous = await prisma.rendezVous.findUnique({
      where: { id }
    });
    
    if (!rendezVous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur a le droit de modifier ce rendez-vous
    if (rendezVous.patientId !== userId) {
      // Vérifier si le rendez-vous concerne un proche géré par l'utilisateur
      if (rendezVous.procheId) {
        const procheGere = await prisma.procheGere.findFirst({
          where: {
            userId,
            procheId: rendezVous.procheId
          }
        });
        
        if (!procheGere) {
          return NextResponse.json(
            { error: 'Vous n\'êtes pas autorisé à modifier ce rendez-vous' },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Vous n\'êtes pas autorisé à modifier ce rendez-vous' },
          { status: 403 }
        );
      }
    }
    
    // Mettre à jour le rendez-vous
    const updatedRendezVous = await prisma.rendezVous.update({
      where: { id },
      data: {
        status,
        procheId: procheId ? parseInt(procheId) : null
      }
    });
    
    return NextResponse.json(updatedRendezVous);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

// DELETE - Annuler un rendez-vous
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const id = parseInt(params.id);
    
    // Vérifier que le rendez-vous existe et appartient à l'utilisateur
    const rendezVous = await prisma.rendezVous.findUnique({
      where: { id }
    });
    
    if (!rendezVous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }
    
    // Vérifier que l'utilisateur a le droit d'annuler ce rendez-vous
    if (rendezVous.patientId !== userId) {
      // Vérifier si le rendez-vous concerne un proche géré par l'utilisateur
      if (rendezVous.procheId) {
        const procheGere = await prisma.procheGere.findFirst({
          where: {
            userId,
            procheId: rendezVous.procheId
          }
        });
        
        if (!procheGere) {
          return NextResponse.json(
            { error: 'Vous n\'êtes pas autorisé à annuler ce rendez-vous' },
            { status: 403 }
          );
        }
      } else {
        return NextResponse.json(
          { error: 'Vous n\'êtes pas autorisé à annuler ce rendez-vous' },
          { status: 403 }
        );
      }
    }
    
    // Mettre à jour le statut du rendez-vous à "annulé"
    const updatedRendezVous = await prisma.rendezVous.update({
      where: { id },
      data: {
        status: 'annulé',
        patientId: null,
        procheId: null
      }
    });
    
    return NextResponse.json(updatedRendezVous);
  } catch (error) {
    console.error('Erreur lors de l\'annulation du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'annulation du rendez-vous' },
      { status: 500 }
    );
  }
}
