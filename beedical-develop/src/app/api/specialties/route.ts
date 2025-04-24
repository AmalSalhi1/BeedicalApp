import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    
    const specialties = await prisma.specialite.findMany({
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
    
    return NextResponse.json(specialties);
  } catch (error) {
    console.error('Erreur lors de la récupération des spécialités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des spécialités' },
      { status: 500 }
    );
  }
}
