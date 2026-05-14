import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get('studentId');
  const cls = searchParams.get('class');

  let results = readDB<any>('results');
  if (studentId) results = results.filter((r: any) => r.studentId === studentId);
  if (cls) results = results.filter((r: any) => r.class === cls);

  return NextResponse.json({ results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = insertRecord('results', { ...body, id: generateId('r') });
  return NextResponse.json({ result }, { status: 201 });
}
