import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

console.log('Environment check:');
console.log('DATABASE_URL configured:', !!process.env.DATABASE_URL);
console.log('NEXTAUTH_SECRET configured:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXTAUTH_URL configured:', !!process.env.NEXTAUTH_URL);

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login" 
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
   
      async authorize(credentials) {
        console.log('=== AUTH DEBUG START ===');
        console.log('Credentials received:', {
          email: credentials?.email,
          passwordProvided: !!credentials?.password
        });
        
        try {
          // Test DB connection first
          console.log('Testing database connection...');
          try {
            await prisma.$queryRaw`SELECT 1 as result`;
            console.log('Database connection successful');
          } catch (dbError) {
            console.error('DATABASE CONNECTION ERROR:', dbError);
            throw new Error('Database connection failed');
          }
          
          // Find user
          console.log('Looking up user with email:', credentials?.email);
          const user = await prisma.user.findUnique({
            where: { email: credentials?.email }
          });
          
          console.log('User lookup result:', user ? {
            id: user.id,
            email: user.email,
            hasPassword: !!user.password,
            passwordLength: user.password?.length
          } : 'No user found');
          
          if (!user) {
            console.log('Authentication failed: No user found');
            return null;
          }
          
          // Check password
          console.log('Verifying password...');
          const passwordMatch = await bcrypt.compare(
            credentials?.password || '',
            user.password
          );
          
          console.log('Password verification result:', passwordMatch);
          
          if (passwordMatch) {
            console.log('Authentication successful for user:', user.email);
            return user;
          } else {
            console.log('Authentication failed: Incorrect password');
            return null;
          }
        } catch (error : any) {
          console.error('=== AUTH ERROR ===', error);
          // Log the full error with stack trace
          console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
          });
          return null;
        } finally {
          console.log('=== AUTH DEBUG END ===');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session, token } : any) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET
}