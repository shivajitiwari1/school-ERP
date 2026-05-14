import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');
  const teachers = readDB<any>('teachers');

  if (email) {
    const teacher = teachers.find(t => t.email === email) || null;
    return NextResponse.json({ teacher });
  }

  return NextResponse.json({ teachers, total: teachers.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const teacher = insertRecord('teachers', {
    ...body,
    id: generateId('t'),
    teacherId: `TCH${Date.now()}`,
    joinDate: new Date().toISOString().split('T')[0],
  });
  return NextResponse.json({ teacher }, { status: 201 });
}
