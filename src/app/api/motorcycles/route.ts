
import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
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
      const { framenumber, color, nfacture, modele, marque } = motorcycle;
      
      const result = await executeQuery({
        query: 'INSERT INTO immatric (framenumber, color, nfacture, modele, marque) VALUES (?, ?, ?, ?, ?)',
        values: [framenumber, color, nfacture, modele, marque],
      });
      
      results.push(result);
    }
    
    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('Failed to create motorcycles:', error);
    return NextResponse.json({ error: 'Failed to create motorcycles' }, { status: 500 });
  }
}
