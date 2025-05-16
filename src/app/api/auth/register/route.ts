import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Registration attempt for:', body.email);
    
    // Add error handling and logging
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });
    
    if (existingUser) {
      console.log('User already exists:', body.email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    
    // Log before password hashing
    console.log('Hashing password...');
    
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // Log before database operation
    console.log('Creating new user...');
    
    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password: hashedPassword
      }
    });
    
    console.log('User created successfully:', user.id);
    
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error : any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed', message: error.message },
      { status: 500 }
    );
  }
}