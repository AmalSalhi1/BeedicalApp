import { NextRequest, NextResponse } from 'next/server';
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const procheId = req.nextUrl.pathname.split('/').pop();
    if (!procheId) return NextResponse.json({ error: 'ID du proche manquant' }, { status: 400 });

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

    const gestionnaire = await prisma.procheGere.findFirst({
      where: {
        userId,
        procheId: parseInt(procheId),
      },
    });

    if (!gestionnaire) {
      return NextResponse.json({ error: 'Non autorisé à modifier ce proche' }, { status: 403 });
    }

    const updatedProche = await prisma.proche.update({
      where: { id: parseInt(procheId) },
      data: {
        prenom,
        nom,
        dateNaissance: new Date(dateNaissance),
        sexe,
        telephone,
        lieuNaissance,
        ville,
        photoProfil: photoProfil ?? null,
        adresse: adresse ?? null,
        codePostal: codePostal ?? null,
      },
    });

    return NextResponse.json(updatedProche);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur lors de la modification du proche' }, { status: 500 });
  }
}