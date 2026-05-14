import { NextRequest, NextResponse } from 'next/server';
import { findById, updateRecord, deleteRecord } from '@/lib/db';

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const student = findById('students', params.id);
  if (!student) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ student });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = updateRecord('students', params.id, body);
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ student: updated });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const deleted = deleteRecord('students', params.id);
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ message: 'Deleted' });
}
