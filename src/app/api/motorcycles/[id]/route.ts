
import { executeQuery } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET a specific motorcycle by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const motorcycles = await executeQuery({
      query: 'SELECT * FROM immatric WHERE id = ?',
      values: [id],
    });
    
    if (!motorcycles || Array.isArray(motorcycles) && motorcycles.length === 0) {
      return NextResponse.json({ error: 'Motorcycle not found' }, { status: 404 });
    }
    
    return NextResponse.json({ motorcycle: motorcycles[0] });
  } catch (error) {
    console.error('Failed to fetch motorcycle:', error);
    return NextResponse.json({ error: 'Failed to fetch motorcycle' }, { status: 500 });
  }
}

// UPDATE a specific motorcycle
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data = await request.json();
    
    const { framenumber, color, nfacture, modele, marque } = data;
    
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
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
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
