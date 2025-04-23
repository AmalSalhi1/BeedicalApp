import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const FIXED_TEST_CODE = '123456'; // Code fixe pour tous les tests

  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Code manquant' },
        { status: 400 }
      );
    }

    if (code === FIXED_TEST_CODE) {
      return NextResponse.json(
        { success: true, message: 'Code vérifié avec succès' },
        {
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Code invalide' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}