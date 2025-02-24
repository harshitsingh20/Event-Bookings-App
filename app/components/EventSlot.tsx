import { format } from "date-fns"
import type { User, TimeSlot } from "../../utils/eventUtils"
import { Button } from "@/components/ui/button"
import type React from "react"

interface EventSlotProps {
  slot: TimeSlot
  currentUser: User | null
  bookTimeSlot: (slotId: string, userId: string) => void
  cancelBooking: (slotId: string) => void
}

const EventSlot: React.FC<EventSlotProps> = ({ slot, currentUser, bookTimeSlot, cancelBooking }) => {
  const isBooked = slot.user_id !== null
  const isBookedByCurrentUser = isBooked && currentUser && slot.user_id === currentUser.id
console.log(slot, currentUser)
  const handleClick = () => {
    if (isBookedByCurrentUser) {
      cancelBooking(slot.id)
    } else if (!isBooked && currentUser) {
      bookTimeSlot(slot.id, currentUser.id)
    }
  }

  return (
    <div
      className={`p-2 sm:p-3 mb-2 rounded-md ${isBooked ? "bg-gray-100" : "bg-green-100"} transition-colors duration-200`}
    >
      <p className="text-xs sm:text-sm font-medium">
        {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
      </p>
      <p className="text-xs font-semibold text-gray-600 mb-1 sm:mb-2">{slot.category}</p>
      {currentUser && (
        <Button
          onClick={handleClick}
          disabled={isBooked && !isBookedByCurrentUser}
          variant={isBookedByCurrentUser ? "destructive" : isBooked ? "secondary" : "default"}
          size="sm"
          className="w-full"
        >
          {isBookedByCurrentUser ? "Cancel" : isBooked ? "Unavailable" : "Book"}
        </Button>
      )}
    </div>
  )
}

export default EventSlot

