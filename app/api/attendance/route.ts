import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const studentId = searchParams.get('studentId');
  const cls = searchParams.get('class');

  let records = readDB<any>('attendance');
  if (date) records = records.filter((r: any) => r.date === date);
  if (studentId) records = records.filter((r: any) => r.studentId === studentId);
  if (cls) records = records.filter((r: any) => r.class === cls);

  return NextResponse.json({ records });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const records = readDB<any>('attendance');
  const { date, entries } = body; // entries: [{studentId, status, class, section}]

  const newRecords = entries.map((e: any) => ({
    id: generateId('a'),
    ...e,
    date,
  }));

  // Remove existing records for same date & class, add new
  const filtered = records.filter((r: any) => !(r.date === date && r.class === entries[0]?.class));
  writeDB('attendance', [...filtered, ...newRecords]);

  return NextResponse.json({ message: 'Attendance saved', count: newRecords.length });
}
