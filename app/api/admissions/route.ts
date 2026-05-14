import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, updateRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  let admissions = readDB<any>('admissions');
  if (status) admissions = admissions.filter((a: any) => a.status === status);
  admissions.sort((a: any, b: any) => new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime());
  return NextResponse.json({ admissions, total: admissions.length });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const admission = insertRecord('admissions', {
    ...body,
    id: generateId('adm'),
    applicationNo: `APP${Date.now()}`,
    status: 'pending',
    appliedDate: new Date().toISOString().split('T')[0],
  });
  return NextResponse.json({ admission }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  updates.reviewedDate = new Date().toISOString().split('T')[0];
  const updated = updateRecord('admissions', id, updates);
  return NextResponse.json({ admission: updated });
}
