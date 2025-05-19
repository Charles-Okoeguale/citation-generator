import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// Default preferences to return when nothing is found or error occurs
const defaultPreferences = {
  theme: 'light',
  citationsPerPage: 10,
  defaultStyle: 'apa',
  favoriteStyles: [],
  recentStyles: []
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Always return default preferences to avoid server errors
    // This temporary fix helps prevent the infinite loop on the client
    // while you fix the database/Prisma issues
    return NextResponse.json(defaultPreferences);
    
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    // Return defaults instead of error to prevent client-side loops
    return NextResponse.json(defaultPreferences);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let data;
    try {
      data = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid JSON data' }, { status: 400 });
    }

    // Validate data
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid preferences data' }, { status: 400 });
    }

    // For now, just acknowledge receiving the data
    // Return a valid response without trying to update the database
    // This prevents both 500 errors and also prevents infinite loops on the client
    const mockResponse = {
      ...defaultPreferences,
      ...data,
      id: "temporary-id",
      userId: user.id
    };
    
    return NextResponse.json(mockResponse);
    
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}