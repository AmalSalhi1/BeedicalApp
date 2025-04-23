import { NextResponse, NextRequest } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const { userId } = getAuth(request);
  if (!userId) {
    return NextResponse.json({ message: 'Non authentifié' }, { status: 401 });
  }

  const body = await request.json();
  const { prenom, nom, email } = body;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: { Profil: true }
    });

    if (!existingUser) {
      await prisma.user.create({
        data: {
          clerkId: userId,
          Profil: {
            create: {
              prenom,
              nom,
              email,
              dateNaissance: new Date('2000-01-01'),
              sexe: '',
              telephone: '',
              ville: '',
              lieuNaissance: '',
              adresse: '',
              codePostal: '',
              assuranceMaladie: '',
              cin: '',
              profession: ''
            }
          }
        }
      });
    } else if (!existingUser.Profil) {
      await prisma.profil.create({
        data: {
          userId: userId,
          prenom,
          nom,
          email,
          dateNaissance: new Date('2000-01-01'),
          sexe: '',
          telephone: '',
          ville: '',
          lieuNaissance: '',
          adresse: '',
          codePostal: '',
          assuranceMaladie: '',
          cin: '',
          profession: ''
        }
      });
    } else {
      await prisma.profil.update({
        where: { userId },
        data: {
          prenom: prenom ?? existingUser.Profil.prenom,
          nom: nom ?? existingUser.Profil.nom,
          email: email ?? existingUser.Profil.email
        }
      });
    }

    return NextResponse.json({ message: 'Utilisateur synchronisé' });
  } catch (error) {
    console.error('Erreur lors de la synchronisation : ', error);
    return NextResponse.json(
      { error: 'Erreur lors de la synchronisation' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}