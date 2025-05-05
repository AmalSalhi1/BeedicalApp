import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cities = await prisma.ville.findMany({
      select: {
        id: true,
        nom: true,
        region: true
      }
    });
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error fetching cities:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des villes' },
      { status: 500 }
    );
  }
}