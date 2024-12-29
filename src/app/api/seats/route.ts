import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { checkauth } from "@/lib/authHelper";

export async function GET() {
    const session = await checkauth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    try {
      const seats = await prisma.seat.findMany({
        orderBy: { id: 'asc' }
      });
  
      return NextResponse.json(seats);
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to fetch seats" },
        { status: 500 }
      );
    }
  }