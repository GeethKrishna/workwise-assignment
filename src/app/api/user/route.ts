import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import bcrypt from 'bcrypt';

// Types
interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

// Create User Handler
export async function POST(request: NextRequest) {
  
  try {
    const body: CreateUserRequest = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}