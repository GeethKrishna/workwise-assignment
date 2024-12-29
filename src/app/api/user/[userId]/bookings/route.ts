import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkauth } from "@/lib/authHelper";

// Get User Bookings Handler
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
    const session = await checkauth();
    if (!session) {
        return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
        );
    }
    try {
        const {userId} = await params;
        if(userId === null) {
            return NextResponse.json(
                { error: "User ID is required" },
                { status: 400 }
            );
        }
        const bookings = await prisma.booking.findMany({
            where: { userId: parseInt(userId) },
            include: {
            seats: {
                select: { seatNumber: true }
            }
            }
        });
  
        if (!bookings.length) {
            return NextResponse.json(
            { error: "No bookings found for this user" },
            { status: 202 }
            );
        }
  
        return NextResponse.json(bookings);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch bookings" },
            { status: 500 }
        );
    }
}