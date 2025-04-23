import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer le profil utilisateur
export async function GET(request: NextRequest) {
  try {
    const { userId: clerkId } = getAuth(request);
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const userWithProfile = await prisma.user.findUnique({
      where: { clerkId },
      include: { 
        Profil: {
          select: {
            sexe: true,
            prenom: true,
            nom: true,
            dateNaissance: true,
            lieuNaissance: true,
            ville: true,
            adresse: true,
            codePostal: true,
            telephone: true,
            email: true,
            assuranceMaladie: true,
            cin: true,
            profession: true,
            photoProfil: true
          }
        }
      }
    });

    if (!userWithProfile?.Profil) {
      return NextResponse.json(
        { error: 'Profil non trouvé' },
        { status: 404 }
      );
    }

    // Formater la date pour le frontend
    const formattedProfile = {
      ...userWithProfile.Profil,
      dateNaissance: userWithProfile.Profil.dateNaissance?.toISOString().split('T')[0]
    };

    return NextResponse.json(formattedProfile);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Créer ou mettre à jour le profil
export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = getAuth(request);
    if (!clerkId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validation des champs requis
    const requiredFields = {
      prenom: 'Prénom',
      nom: 'Nom',
      email: 'Email',
      sexe: 'Sexe',
      dateNaissance: 'Date de naissance',
      telephone: 'Téléphone',
      ville: 'Ville',
      lieuNaissance: 'Lieu de naissance',
      assuranceMaladie: 'Assurance maladie',
      cin: 'CIN'
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !body[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Champs manquants: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Vérifier l'unicité du CIN
    const existingUser = await prisma.user.findUnique({
      where: { clerkId },
      include: { Profil: true }
    });

    if (existingUser?.Profil?.cin !== body.cin) {
      const cinExists = await prisma.profil.findFirst({
        where: { cin: body.cin }
      });
      if (cinExists) {
        return NextResponse.json(
          { error: 'Ce CIN est déjà utilisé' },
          { status: 400 }
        );
      }
    }

    // Créer ou mettre à jour
    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId,
          Profil: {
            create: {
              ...body,
              dateNaissance: new Date(body.dateNaissance)
            }
          }
        }
      });
    } else if (!existingUser.Profil) {
      await prisma.profil.create({
        data: {
          userId: existingUser.clerkId,
          ...body,
          dateNaissance: new Date(body.dateNaissance)
        }
      });
    } else {
      await prisma.profil.update({
        where: { userId: existingUser.clerkId },
        data: {
          ...body,
          dateNaissance: new Date(body.dateNaissance)
        }
      });
    }

    return NextResponse.json(
      { success: true, message: 'Profil mis à jour' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}