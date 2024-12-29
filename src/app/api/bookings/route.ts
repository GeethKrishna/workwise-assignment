// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { findBestAvailableSeats } from '@/lib/helpers';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { checkauth } from '@/lib/authHelper';

interface BookSeatsRequest {
    userId: string;
    seatCount: number;
}

// POST /api/bookings - Book seats
export async function POST(request: NextRequest) {
  try {
    const session = await checkauth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const body: BookSeatsRequest = await request.json();
    const { userId, seatCount } = body;

    if(!userId || !seatCount) {
      return NextResponse.json(
        { error: "User ID and seat count are required" },
        { status: 400 }
      );
    }

    if (seatCount < 1 || seatCount > 7) {
      return NextResponse.json(
        { error: "Seat count must be between 1 and 7" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const bestAvailableSeats = await findBestAvailableSeats(seatCount);
    if (bestAvailableSeats.length < seatCount) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    const booking = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        const newBooking = await tx.booking.create({
            data: {
            userId: parseInt(userId),
            seats: {
                connect: bestAvailableSeats.map((seat) => ({ id: seat.id }))
            }
            },
            include: { seats: true }
        });

        await tx.seat.updateMany({
            where: { id: { in: bestAvailableSeats.map((seat) => seat.id) } },
            data: { isBooked: true }
        });

        return newBooking;
    });
    
    return NextResponse.json({
      message: "Seats booked successfully",
      booking,
      seats: booking.seats.map((s) => s.seatNumber).sort()
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to book seats" },
      { status: 500 }
    );
  }
}