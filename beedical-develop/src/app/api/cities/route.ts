import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    const cities = await prisma.ville.findMany({
      where: query ? {
        nom: {
          contains: query,
          mode: 'insensitive'
        }
      } : {},
      orderBy: {
        nom: 'asc'
      }
    });
    
    return NextResponse.json(cities);
  } catch (error) {
    console.error('Erreur lors de la récupération des villes:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des villes' },
      { status: 500 }
    );
  }
}
