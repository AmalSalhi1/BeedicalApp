import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const proches = await prisma.proche.findMany({
      where: {
        gerants: {
          some: {
            userId: userId,
          },
        },
      },
      orderBy: {
        nom: 'asc',
      },
    });

    return NextResponse.json(proches);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la récupération des proches' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const {
      prenom,
      nom,
      dateNaissance,
      sexe,
      telephone,
      lieuNaissance,
      photoProfil,
      adresse,
      codePostal,
      ville,
    } = body;

    const newProche = await prisma.proche.create({
      data: {
        prenom,
        nom,
        dateNaissance: new Date(dateNaissance),
        sexe,
        telephone,
        lieuNaissance,
        photoProfil,
        adresse,
        codePostal,
        ville,
        gerants: {
          create: {
            userId,
            role: 'Responsable légal',
          },
        },
      },
    });

    return NextResponse.json(newProche);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la création du proche' }, { status: 500 });
  }
}
