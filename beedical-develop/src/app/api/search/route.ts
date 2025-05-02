import { NextRequest, NextResponse } from 'next/server';
import doctorsData from '@/app/data/medcinsList.json';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';

  try {
    const filteredDoctors = doctorsData.filter((doctor) => {
      const matchesNameOrSpecialty = query
        ? doctor.nom.toLowerCase().includes(query.toLowerCase()) ||
          doctor.specialite.toLowerCase().includes(query.toLowerCase())
        : true;

      const matchesLocation = location
        ? doctor.location.toLowerCase().includes(location.toLowerCase())
        : true;

      return matchesNameOrSpecialty && matchesLocation;
    });

    return NextResponse.json(filteredDoctors);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la recherche' },
      { status: 500 }
    );
  }
}