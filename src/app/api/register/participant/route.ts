import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { signIn } from "@/lib/auth";
import { cookies } from "next/headers";

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const validatedData = registerSchema.parse(body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'PARTICIPANT',
        interests: validatedData.interests,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        interests: true,
        createdAt: true,
      },
    });

    // Sign in the user
    const signInResult = await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (signInResult?.error) {
      return NextResponse.json(
        { error: 'Failed to sign in after registration' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        user,
        message: 'Account created and signed in successfully' 
      },
      { 
        status: 201,
        headers: {
          'Set-Cookie': cookies().toString()
        }
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Something went wrong during registration' },
      { status: 500 }
    );
  }
} 