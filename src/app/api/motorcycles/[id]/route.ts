
import { executeQuery } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET a specific motorcycle by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const motorcycle = await executeQuery({
      query: 'SELECT * FROM immatric WHERE id = ?',
      values: [id],
    });
    
    if (!motorcycle || (Array.isArray(motorcycle) && motorcycle.length === 0)) {
      return NextResponse.json({ error: 'Motorcycle not found' }, { status: 404 });
    }
    
    return NextResponse.json({ motorcycle: Array.isArray(motorcycle) ? motorcycle[0] : motorcycle });
  } catch (error) {
    console.error('Failed to fetch motorcycle:', error);
    return NextResponse.json({ error: 'Failed to fetch motorcycle' }, { status: 500 });
  }
}

// PUT (update) a specific motorcycle
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { framenumber, color, nfacture, modele, marque } = await request.json();
    
    const result = await executeQuery({
      query: 'UPDATE immatric SET framenumber = ?, color = ?, nfacture = ?, modele = ?, marque = ? WHERE id = ?',
      values: [framenumber, color, nfacture, modele, marque, id],
    });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to update motorcycle:', error);
    return NextResponse.json({ error: 'Failed to update motorcycle' }, { status: 500 });
  }
}

// DELETE a specific motorcycle
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const result = await executeQuery({
      query: 'DELETE FROM immatric WHERE id = ?',
      values: [id],
    });
    
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Failed to delete motorcycle:', error);
    return NextResponse.json({ error: 'Failed to delete motorcycle' }, { status: 500 });
  }
}
