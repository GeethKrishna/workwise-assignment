import { checkauth } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT() {
    const session = await checkauth();
    
      if (!session) {
        return NextResponse.json(
          { error: "Unauthorized" },
          { status: 401 }
        );
      }
    try {
      // Using a transaction to ensure both operations succeed or fail together
      await prisma.$transaction([
        prisma.seat.updateMany({
          data: { isBooked: false }
        }),
        prisma.booking.deleteMany()
      ]);
  
      return NextResponse.json({
        message: "All seats and bookings reset"
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Failed to reset seats" },
        { status: 500 }
      );
    }
}