import { NextResponse } from 'next/server';
import { citationService } from '@/lib/citation/citation-service';
import type { CitationInput, CitationStyle } from '@/lib/citation/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { input, style = 'apa' } = body;

    if (!input) {
      return NextResponse.json(
        { error: 'Citation input is required' },
        { status: 400 }
      );
    }

    const citation = await citationService.generateCitation(
      input as CitationInput | string,
      style as CitationStyle
    );

    return NextResponse.json({ citation });
  } catch (error) {
    console.error('Citation API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate citation' },
      { status: 500 }
    );
  }
}