import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  organizationName: z.string().min(2, 'Organization name must be at least 2 characters'),
  website: z.string().url().optional().nullable(),
  description: z.string().optional().nullable(),
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

    // Create user with organization in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user with role
      const user = await tx.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email,
          password: hashedPassword,
          role: 'ORGANIZATION',
          organization: {
            create: {
              name: validatedData.organizationName,
              website: validatedData.website,
              description: validatedData.description,
            },
          },
        },
        include: {
          organization: true,
        },
      });

      return user;
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = result;

    return NextResponse.json(
      { 
        user: userWithoutPassword,
        message: 'Organization created successfully' 
      },
      { status: 201 }
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