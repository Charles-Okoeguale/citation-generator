import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// GET - Fetch a single citation by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session: any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Citation ID is required' },
        { status: 400 }
      );
    }

    // Fetch the citation and verify ownership
    const citation = await db.savedCitation.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!citation) {
      return NextResponse.json(
        { error: 'Citation not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json(citation);
  } catch (error) {
    console.error('Failed to fetch citation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch citation' },
      { status: 500 }
    );
  }
} 