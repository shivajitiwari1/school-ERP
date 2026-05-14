import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const cls = searchParams.get('class');
    const section = searchParams.get('section');
    const search = searchParams.get('search');
    
    let students = readDB<any>('students');
    if (cls) students = students.filter((s: any) => s.class === cls);
    if (section) students = students.filter((s: any) => s.section === section);
    if (search) {
      const q = search.toLowerCase();
      students = students.filter((s: any) =>
        s.name.toLowerCase().includes(q) ||
        s.studentId.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q)
      );
    }
    return NextResponse.json({ students, total: students.length });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const student = insertRecord('students', {
      ...body,
      id: generateId('s'),
      studentId: `SCH${Date.now()}`,
      admissionDate: new Date().toISOString().split('T')[0],
    });
    return NextResponse.json({ student }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
