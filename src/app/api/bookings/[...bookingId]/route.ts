import { checkauth } from "@/lib/authHelper";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { bookingId: string } }
) {
  try {
    const session = await checkauth();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    const { bookingId } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(bookingId) },
      include: { seats: true }
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    await prisma.$transaction([
      prisma.seat.updateMany({
        where: { id: { in: booking.seats.map((seat) => seat.id) } },
        data: { isBooked: false }
      }),
      prisma.booking.delete({
        where: { id: parseInt(bookingId) }
      })
    ]);

    return NextResponse.json({
      message: "Booking canceled successfully"
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to cancel booking" },
      { status: 500 }
    );
  }
}