import { create } from 'zustand'
import useUserStore from './UserStore'

type Seat = {
  id: number
  seatNumber: number
  isBooked: boolean
  bookingId: number | null
}

interface SeatsState {
  seats: Seat[]
  bookedSeats: number
  seatsLoading: boolean
  error: string | null
  fetchSeats: () => Promise<void>
  clearSeats: () => Promise<void>
  updateBookedSeats: () => void
}

const useSeatsStore = create<SeatsState>((set) => ({
  seats: [],
  bookedSeats: 0,
  seatsLoading: false,
  error: null,

  fetchSeats: async () => {
    set({ seatsLoading: true, error: null })
    try {
      const response = await fetch('/api/seats')
      if (!response.ok) {
        throw new Error('Failed to fetch seats')
      }
      const seats = await response.json()
      set({ seats, seatsLoading: false, bookedSeats: seats.filter((seat: Seat) => seat.isBooked).length })
    } catch (error) {
      set({ error: (error as Error).message, seatsLoading: false })
    }
  },

  clearSeats: async () => {
    set({ seatsLoading: true, error: null })
    try {
      const response = await fetch('/api/seats/refresh', {
        method: 'PUT',
      })
      if (!response.ok) {
        throw new Error('Failed to reset seats')
      }
      
      // Update local state
      set(state => ({
        seats: state.seats.map(seat => ({
          ...seat,
          isBooked: false,
          bookingId: null
        }
        )),
        seatsLoading: false,
        bookedSeats: 0
      }))

      // Update user store
      const userState = useUserStore.getState();
      useUserStore.setState({
        ...userState,
        user:{
          id: userState.user?.id || "",
          name: userState.user?.name || "",
          email: userState.user?.email || "",
          bookings: []
        }
      })
    } catch (error) {
      set({ error: (error as Error).message, seatsLoading: false })
    }
  },

  updateBookedSeats: () => {
    set(state => ({
      bookedSeats: state.seats.filter((seat: Seat) => seat.isBooked).length
    }))
  }
}))

export default useSeatsStore;