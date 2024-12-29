import { Seat } from "@prisma/client";
import { prisma } from "./prisma";

const SEATS_PER_ROW = 7;
const LAST_ROW_SEATS = 3;
const TOTAL_ROWS = 12;

export async function getAvailableSeatsInRow(rowNumber: number) {
  const startSeat = (rowNumber - 1) * SEATS_PER_ROW + 1;
  const endSeat = 
    rowNumber === TOTAL_ROWS 
      ? startSeat + LAST_ROW_SEATS - 1 
      : startSeat + SEATS_PER_ROW - 1;

  return await prisma.seat.findMany({
    where: {
      seatNumber: { gte: startSeat, lte: endSeat },
      isBooked: false,
    },
    orderBy: { seatNumber: "asc" },
  });
}

export async function findBestAvailableSeats(seatCount: number) {
  // Try finding seats in a single row first
  for (let rowNum = 1; rowNum <= TOTAL_ROWS; rowNum++) {
    const availableSeats = await getAvailableSeatsInRow(rowNum);

    // Skip the last row if requesting more than LAST_ROW_SEATS
    if (rowNum === TOTAL_ROWS && seatCount > LAST_ROW_SEATS) continue;

    if (availableSeats.length >= seatCount) {
      return availableSeats.slice(0, seatCount);
    }
  }

  // Fallback: Find nearby seats in multiple rows
  const allAvailableSeats = await prisma.seat.findMany({
    where: { isBooked: false },
    orderBy: { seatNumber: "asc" },
  });

  if (allAvailableSeats.length >= seatCount) {
    let bestSeats: Seat[] = [];
    let minGap = Infinity;

    for (let i = 0; i <= allAvailableSeats.length - seatCount; i++) {
      const seats = allAvailableSeats.slice(i, i + seatCount);
      const totalGap = seats[seats.length - 1].seatNumber - seats[0].seatNumber;

      if (totalGap < minGap) {
        minGap = totalGap;
        bestSeats = seats;
      }
    }
    return bestSeats;
  }

  return [];
}
