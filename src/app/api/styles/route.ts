import { loadStylesServer } from '@/lib/citation/style-loader';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const styles = await loadStylesServer();
    return NextResponse.json(styles);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load citation styles' },
      { status: 500 }
    );
  }
}