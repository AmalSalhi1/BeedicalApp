import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const medecinId = searchParams.get('medecinId');
    const date = searchParams.get('date');
    
    if (!medecinId) {
      return NextResponse.json(
        { error: 'L\'ID du médecin est requis' },
        { status: 400 }
      );
    }
    
    let whereClause: any = {
      medecinId: parseInt(medecinId)
    };
    
    // Filtrer par date si spécifiée
    if (date) {
      const dateObj = new Date(date);
      whereClause.date = {
        gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        lt: new Date(dateObj.setHours(23, 59, 59, 999))
      };
    } else {
      // Par défaut, récupérer les disponibilités à partir d'aujourd'hui
      whereClause.date = {
        gte: new Date(new Date().setHours(0, 0, 0, 0))
      };
    }
    
    const disponibilites = await prisma.disponibilite.findMany({
      where: whereClause,
      orderBy: {
        date: 'asc'
      }
    });
    
    // Récupérer les rendez-vous disponibles pour ce médecin
    const rendezVousDisponibles = await prisma.rendezVous.findMany({
      where: {
        medecinId: parseInt(medecinId),
        status: 'disponible',
        date: whereClause.date
      },
      orderBy: {
        date: 'asc'
      }
    });
    
    // Formater les résultats par date
    const disponibilitesParDate: Record<string, any[]> = {};
    
    rendezVousDisponibles.forEach(rdv => {
      const dateStr = rdv.date.toISOString().split('T')[0];
      
      if (!disponibilitesParDate[dateStr]) {
        disponibilitesParDate[dateStr] = [];
      }
      
      disponibilitesParDate[dateStr].push({
        id: rdv.id,
        date: rdv.date,
        heureDebut: rdv.heureDebut,
        heureFin: rdv.heureFin
      });
    });
    
    return NextResponse.json(disponibilitesParDate);
  } catch (error) {
    console.error('Erreur lors de la récupération des disponibilités:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des disponibilités' },
      { status: 500 }
    );
  }
}
