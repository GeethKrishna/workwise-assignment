"use client";
import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import useUserStore from '@/stores/UserStore';

type Booking = {
  id: number;
  userId: number;
  seats: {seatNumber: number}[];
  createdAt: string; // Updated to string since API responses typically return ISO strings
};

function BookingHistory() {
  const {user, cancelBooking} = useUserStore();
  return (
    <div className="flex flex-col h-screen">
      <h1 className="text-2xl font-bold mb-4 mt-8">Booking History</h1>
      <div className="flex flex-col gap-4 overflow-auto border-t border-gray-300 pt-2">
        {!user || !user.bookings || user.bookings.length === 0 
          ? 
          <p className='text-gray-600 text-sm'>You have no bookings.</p> 
          :
          user.bookings.map((booking: Booking) => (
            <div
              key={booking.id}
              className="bg-white shadow-md rounded-lg p-3 border border-gray-200 flex flex-row justify-between items-end"
            >
              <div>
                <p className="text-md font-semibold">Booking ID: {booking.id}</p>
                <p className="text-gray-600 text-sm">
                  Date: <span className='text-black'>{format(new Date(booking.createdAt), 'dd/MM/yyyy')}</span>
                </p>
                <p className="text-gray-600 text-sm">
                  Seats Booked:{' '}
                  <span className="font-medium text-black">
                    {booking.seats.map((seat) => seat.seatNumber).sort((a,b) => a-b).join(', ')}
                  </span>
                </p>
              </div>
              <Button variant={"destructive"} size={"sm"} onClick={() => cancelBooking(booking.id)}>Cancel</Button>
            </div>
        )).reverse()}
      </div>
    </div>
  );
}

export default BookingHistory;
