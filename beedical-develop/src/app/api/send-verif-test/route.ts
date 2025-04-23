import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { identifier } = await request.json();

    // Simulation de réponse en mode test
    return NextResponse.json(
      {
        success: true,
        code: '123456',
        message: `Code envoyé à ${identifier} (mode test)`,
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Requête invalide',
      },
      {
        status: 400,
      }
    );
  }
}