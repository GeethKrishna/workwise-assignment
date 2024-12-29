"use client";
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { BookingForm } from './form';
import BookingHistory from './history';
import useUserStore from '@/stores/UserStore';
import useSeatsStore from '@/stores/SeatsStore';
import Spinner from '@/components/Spinner';

const Page = () => {
  const { data: session, status } = useSession();
  const {user, userLoading, error, setUser} = useUserStore();
  const { seats, seatsLoading, bookedSeats, fetchSeats } = useSeatsStore();

  useEffect(() => {
    fetchSeats();
  }, []);

  useEffect(() => {
    if(status === 'authenticated' && session.user.email && session.user.name) {
      setUser({id: session.user.id, email: session.user.email, name: session.user.name});
    }
  }, [status]);

  if (status === 'loading' || !user) {
    return (
      <Spinner background="white"/>
    );
  }

  // Group seats into rows
  const rows = [];
  for (let i = 0; i < seats.length; i += 7) {
    rows.push(seats.slice(i, i + 7));
  }

  return (
    <div className='flex items-center justify-evenly'>
      {(seatsLoading ||  userLoading) && <Spinner background="" />}
        <div className="p-8">            
            {session && (
                <div className="mb-2 text-center">
                <p className="text-gray-800 text-2xl font-bold">Seats Available</p>
                </div>
            )}

            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="grid gap-1">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} className="flex gap-2 justify-center">
                    {row.map((seat) => (
                        <div
                        key={seat.id}
                        className={`
                            w-8 h-8 rounded-lg flex items-center justify-center
                            font-semibold text-xs transition-colors duration-200
                            ${seat.isBooked 
                            ? 'bg-yellow-200 cursor-not-allowed' 
                            : 'bg-green-200 hover:bg-green-300 cursor-pointer'
                            }
                        `}
                        title={`Seat ${seat.seatNumber}`}
                        >
                        {seat.seatNumber}
                        </div>
                    ))}
                    </div>
                ))}
                </div>

                <div className="mt-8 flex justify-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-200 rounded"></div>
                    <span className="text-sm text-gray-600">Available: {seats.length - bookedSeats}</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span className="text-sm text-gray-600">Booked: {bookedSeats}</span>
                </div>
                </div>
            </div>
        </div>
        <div className=''>
          <BookingForm/>
        </div>
        <div className='h-screen w-1/4'>
          <BookingHistory/>
        </div>
    </div>
  );
};

export default Page;