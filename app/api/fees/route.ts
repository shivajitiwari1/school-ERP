import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, updateRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const studentId = searchParams.get('studentId');

  let fees = readDB<any>('fees');
  if (status) fees = fees.filter((f: any) => f.paymentStatus === status);
  if (studentId) fees = fees.filter((f: any) => f.studentId === studentId);

  const total = fees.reduce((sum: number, f: any) => sum + f.amount, 0);
  const paid = fees.filter((f: any) => f.paymentStatus === 'paid').reduce((sum: number, f: any) => sum + f.amount, 0);
  const pending = fees.filter((f: any) => f.paymentStatus === 'pending').reduce((sum: number, f: any) => sum + f.amount, 0);

  return NextResponse.json({ fees, summary: { total, paid, pending } });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const fee = insertRecord('fees', { ...body, id: generateId('f') });
  return NextResponse.json({ fee }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;
  if (updates.paymentStatus === 'paid') {
    updates.paidDate = new Date().toISOString().split('T')[0];
    updates.transactionId = `TXN${Date.now()}`;
  }
  const updated = updateRecord('fees', id, updates);
  return NextResponse.json({ fee: updated });
}
