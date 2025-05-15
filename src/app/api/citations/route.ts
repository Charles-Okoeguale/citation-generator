// src/app/api/citations/route.ts
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

// Validation schema for citation data
const citationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()).optional(),
  sourceType: z.string(),
  citationData: z.record(z.any()),
  style: z.string().default('apa'),
});

// GET - Fetch user's citations
export async function GET() {
  try {
    const session : any= await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const citations = await db.savedCitation.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(citations);
  } catch (error) {
    console.error('Failed to fetch citations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch citations' },
      { status: 500 }
    );
  }
}

// POST - Save a new citation
export async function POST(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = citationSchema.parse(body);

    const citation = await db.savedCitation.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(citation, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid citation data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Failed to save citation:', error);
    return NextResponse.json(
      { error: 'Failed to save citation' },
      { status: 500 }
    );
  }
}

// PUT - Update a citation
export async function PUT(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = citationSchema.parse(body);

    // Verify ownership
    const existingCitation = await db.savedCitation.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!existingCitation) {
      return NextResponse.json(
        { error: 'Citation not found or unauthorized' },
        { status: 404 }
      );
    }

    const updatedCitation = await db.savedCitation.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedCitation);
  } catch (error) {
    console.error('Failed to update citation:', error);
    return NextResponse.json(
      { error: 'Failed to update citation' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a citation
export async function DELETE(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Citation ID is required' },
        { status: 400 }
      );
    }

    // Verify ownership
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

    await db.savedCitation.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Citation deleted successfully' });
  } catch (error) {
    console.error('Failed to delete citation:', error);
    return NextResponse.json(
      { error: 'Failed to delete citation' },
      { status: 500 }
    );
  }
}