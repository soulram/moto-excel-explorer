
import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';
import { Motorcycle } from '@/lib/types';

// GET all motorcycles
export async function GET() {
  try {
    const motorcycles = await executeQuery({
      query: 'SELECT * FROM immatric',
    });
    
    return NextResponse.json({ motorcycles });
  } catch (error) {
    console.error('Failed to fetch motorcycles:', error);
    return NextResponse.json({ error: 'Failed to fetch motorcycles' }, { status: 500 });
  }
}

// POST new motorcycle
export async function POST(request: Request) {
  try {
    const motorcycles: Motorcycle[] = await request.json();
    
    if (!Array.isArray(motorcycles)) {
      return NextResponse.json({ error: 'Invalid data format' }, { status: 400 });
    }
    
    const results = [];
    
    for (const motorcycle of motorcycles) {
      const { 
        FrameNumber,
        Marque,
        DateArrivage,
        MODELE,
        NFacture,
        Color,
        revendeur,
        client,
        DateVenteRevendeur,
        DateVenteClient,
        cnie,
        observation,
        DateNaissance,
        Sexe,
        VilleVente,
        ProvinceVente,
        VilleAffectation,
        ProvinceAffectation
      } = motorcycle;
      
      const result = await executeQuery({
        query: `
          INSERT INTO immatric (
            FrameNumber, Marque, DateArrivage, MODELE, NFacture,
            Color, revendeur, client, DateVenteRevendeur, DateVenteClient,
            cnie, observation, DateNaissance, Sexe, VilleVente,
            ProvinceVente, VilleAffectation, ProvinceAffectation
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        values: [
          FrameNumber,
          Marque,
          DateArrivage,
          MODELE,
          NFacture,
          Color,
          revendeur || null,
          client || null,
          DateVenteRevendeur || null,
          DateVenteClient || null,
          cnie || null,
          observation || null,
          DateNaissance || null,
          Sexe || null,
          VilleVente || null,
          ProvinceVente || null,
          VilleAffectation || null,
          ProvinceAffectation || null
        ],
      });
      
      results.push(result);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Motorcycles added successfully',
      results 
    });
  } catch (error) {
    console.error('Failed to create motorcycles:', error);
    return NextResponse.json({ 
      error: 'Failed to create motorcycles',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}