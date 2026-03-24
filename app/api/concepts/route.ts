import { NextResponse } from 'next/server';
import { getConcepts } from '@/api/concepts';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const concepts = await getConcepts();
    return NextResponse.json(concepts);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch concepts' });
  }
}