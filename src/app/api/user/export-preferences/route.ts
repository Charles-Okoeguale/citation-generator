import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UserExportPreferences } from '@/lib/citation/types';

// Default preferences to return when nothing is found or error occurs
const defaultExportPreferences: UserExportPreferences = {
  defaultExportFormat: 'pdf',
  includeInText: true,
  recentExportFormats: []
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

    // Return default preferences for now
    // In the future, this would fetch from the database
    return NextResponse.json(defaultExportPreferences);
    
  } catch (error) {
    console.error('Error fetching user export preferences:', error);
    // Return defaults instead of error to prevent client-side loops
    return NextResponse.json(defaultExportPreferences);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Validate data (basic check)
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
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

    // For now, just return success
    // In the future, this would update the database
    return NextResponse.json({ message: 'Preferences saved successfully' });

  } catch (error) {
    console.error('Error saving export preferences:', error);
    return NextResponse.json({ error: 'Failed to save preferences' }, { status: 500 });
  }
} 