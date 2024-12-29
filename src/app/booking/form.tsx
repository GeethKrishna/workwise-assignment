'use client'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import useSeatsStore from '@/stores/SeatsStore'
import useUserStore from '@/stores/UserStore'
import { useState } from 'react'

export const BookingForm = () => {
  const [numberOfTickets, setNumberOfTickets] = useState<number>(0);
  const {bookSeats, error} = useUserStore();
  const {clearSeats} = useSeatsStore();

  const handleRefreshSeats = async (e: React.FormEvent) => {
    e.preventDefault();
    clearSeats();
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    bookSeats(numberOfTickets);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full sm:w-[400px]">
      <div className="grid w-full items-center gap-1.5">
        <Label htmlFor="numberOfTickets">Enter number of tickets</Label>
        <div className='flex justify-center items-center gap-2'>
          <Input
            className="w-full"
            required
            value={numberOfTickets || ""}
            onChange={(e) => {
              const value = e.target.value;
              setNumberOfTickets(value ? parseInt(value) : 0); // Fallback to 0 if value is empty
            }}
            id="numberOfTickets"
            type="number"
            placeholder="1..7"
          />
          <Button type='submit'>Book</Button>
        </div>
      </div>
      {
        error && 
        <div className='flex flex-col gap-2'>
          <Label className='text-red-400 text-md'>Error</Label>
          <Alert className='text-red-400'>{error}</Alert>
        </div>
      }
      <Button 
        className='mt-8'   
        size={'lg'}
        onClick={handleRefreshSeats}
      >
        Refresh the seats
      </Button>
    </form>
  )
}