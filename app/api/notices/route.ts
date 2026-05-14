import { NextRequest, NextResponse } from 'next/server';
import { readDB, insertRecord, generateId } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const audience = searchParams.get('audience');
  const classes = searchParams.get('classes');
  const category = searchParams.get('category');

  let notices = readDB<any>('notices');
  const classList = classes ? classes.split(',').map(c => c.trim()).filter(Boolean) : [];

  if (audience || classList.length > 0) {
    notices = notices.filter((n: any) => {
      const audienceMatch = !audience || n.targetAudience === 'all' || n.targetAudience === audience;
      const classMatch = classList.length === 0 || n.targetAudience === 'all' || classList.includes(n.targetAudience);
      return audienceMatch && classMatch;
    });
  }

  if (category) notices = notices.filter((n: any) => n.category === category);

  notices.sort((a: any, b: any) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  return NextResponse.json({ notices });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const notice = insertRecord('notices', {
    ...body,
    id: generateId('n'),
    publishedDate: new Date().toISOString().split('T')[0],
  });
  return NextResponse.json({ notice }, { status: 201 });
}
