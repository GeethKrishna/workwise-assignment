import { create } from 'zustand';
import useSeatsStore from './SeatsStore';

type User = {
  id: string
  name: string
  email: string
  bookings: Booking[]
}

type Booking = {
  id: number
  userId: number
  seats: { seatNumber: number }[]
  createdAt: string
}

type BookingResponse = {
  message: string
  booking: Booking
  seats: number[]
}

interface UserState {
  user: User | null
  userLoading: boolean
  error: string | null
  setUser: (userDetails: Omit<User, 'bookings'>) => Promise<void>
  cancelBooking: (bookingId: number) => Promise<void>
  bookSeats: (seatCount: number) => Promise<void>
}

const useUserStore = create<UserState>()(
    (set, get) => ({
      user: null,
      userLoading: true,
      error: null,

      setUser: async (userDetails) => {
        try {
          set({ userLoading: true, error: null })
          
          const response = await fetch(`/api/user/booking/${userDetails.id}`,
            {
              method: 'GET'
            },
          )
          if(!response.ok) {
            throw new Error('Failed to fetch user bookings')
          }

          const data = response.status === 202 ? [] : await response.json()
          
          const userWithBookings: User = {
            ...userDetails,
            bookings: data
          }
          
          set({ 
            user: userWithBookings,
            userLoading: false 
          })
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch user bookings',
            userLoading: false 
          })
        }
      },

      cancelBooking: async (bookingId: number) => {
        try {
          set({ userLoading: true, error: null })
          
          const response = await fetch(`/api/bookings/${bookingId}`,
            {
              method: 'DELETE'
            }
          );
          if(!response.ok) {
            throw new Error('Failed to cancel booking')
          }
          
          const currentUser = get().user
          if (currentUser) {
            const deletedBooking = currentUser.bookings.find(
              booking => booking.id === bookingId
            )
            const deletedSeats = deletedBooking?.seats.map(seat => seat.seatNumber)
            const updatedBookings = currentUser.bookings.filter(
              booking => booking.id !== bookingId
            )
            set({
              user: {
                ...currentUser,
                bookings: updatedBookings
              },
              userLoading: false
            })

            const seatsStore = useSeatsStore.getState();
            const updatedSeats = seatsStore.seats.map(seat => {
              if (deletedSeats?.includes(seat.seatNumber)) {
                return {
                  ...seat,
                  isBooked: false,
                  bookingId: null
                }
              }
              return seat
            })
            useSeatsStore.setState({ seats: updatedSeats });
            useSeatsStore.getState().updateBookedSeats()
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to cancel booking',
            userLoading: false 
          })
        }
      },

      bookSeats: async (seatCount: number) => {
        try {

          if(seatCount < 1 || seatCount > 7) {
            throw new Error('Seat count must be between 1 and 7')
          }
          set({ userLoading: true, error: null })
          
          const currentUser = get().user
          if (!currentUser) {
            throw new Error('No user logged in')
          }

          const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: currentUser.id,
              seatCount
            })
          })

          if (!response.ok) {
            throw new Error('Failed to book seats')
          }

          const data: BookingResponse = await response.json()
          set({
            user: {
              ...currentUser,
              bookings: [...currentUser.bookings, data.booking]
            },
            userLoading: false
          })

          const seatsStore = useSeatsStore.getState();
          const bookedSeats = data.seats;
          const updatedSeats = seatsStore.seats.map(seat => {
              if (bookedSeats.includes(seat.seatNumber)) {
                return {
                  ...seat,
                  isBooked: true,
                  bookingId: data.booking.id
                }
              }
              return seat
          })
          
          useSeatsStore.setState({ seats: updatedSeats })
          useSeatsStore.getState().updateBookedSeats()

        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to book seats',
            userLoading: false 
          })
        }
      }
    })
)

export default useUserStore;