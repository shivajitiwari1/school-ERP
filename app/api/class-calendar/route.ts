import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const className = searchParams.get('className');

  let events = readDB<any>('classCalendar');
  if (className) {
    events = events.filter((event: any) => event.className === className || event.className === 'all');
  }

  events.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
  return NextResponse.json({ events });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = insertRecord('classCalendar', {
    ...body,
    id: generateId('e'),
  });
  return NextResponse.json({ event }, { status: 201 });
}
