"use client"

import { useState } from "react"
import { addWeeks, subWeeks, format } from "date-fns"
import { type User, type TimeSlot, type EventCategory, getWeekDays, formatDate } from "../../utils/eventUtils"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import EventSlot from "./EventSlot"
import { log } from "console"

interface CalendarViewProps {
  timeSlots: TimeSlot[]
  currentUser: User | null
  bookTimeSlot: (slotId: string, userId: string) => void
  cancelBooking: (slotId: string) => void
}

const CalendarView: React.FC<CalendarViewProps> = ({ timeSlots, currentUser, bookTimeSlot, cancelBooking }) => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | "All">("All")

  const weekDays = getWeekDays(currentDate)

  const filteredSlots = timeSlots.filter((slot) => {
    const slotDate = formatDate(slot.start)
    const isInCurrentWeek = weekDays.some((day) => formatDate(day) === slotDate)
    const matchesCategory = selectedCategory === "All" || slot.category === selectedCategory
    const matchesUserPreferences =
      currentUser?.preferences && currentUser?.preferences.includes(slot.category)
    return isInCurrentWeek && matchesCategory && matchesUserPreferences
  })
  // console.log(currentUser?.preferences)

  const handlePrevWeek = () => setCurrentDate(subWeeks(currentDate, 1))
  const handleNextWeek = () => setCurrentDate(addWeeks(currentDate, 1))

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
        <Button onClick={handlePrevWeek} variant="outline">
          &lt; Prev Week
        </Button>
        <h2 className="text-2xl font-semibold text-gray-800">
          {format(weekDays[0], "MMM d")} - {format(weekDays[6], "MMM d, yyyy")}
        </h2>
        <Button onClick={handleNextWeek} variant="outline">
          Next Week &gt;
        </Button>
      </div>
      <Select onValueChange={(value) => setSelectedCategory(value as EventCategory | "All")}>
        <SelectTrigger className="w-full sm:w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All">All Categories</SelectItem>
          <SelectItem value="Cat 1">Cat 1</SelectItem>
          <SelectItem value="Cat 2">Cat 2</SelectItem>
          <SelectItem value="Cat 3">Cat 3</SelectItem>
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <div key={formatDate(day)} className="border rounded-lg p-3 sm:p-4 bg-white shadow">
            <h3 className="text-lg font-semibold mb-2 text-gray-700">{format(day, "EEE, MMM d")}</h3>
            {filteredSlots
              .filter((slot) => formatDate(slot.start) === formatDate(day))
              .map((slot) => (
                <EventSlot
                  key={slot.id}
                  slot={slot}
                  currentUser={currentUser}
                  bookTimeSlot={bookTimeSlot}
                  cancelBooking={cancelBooking}
                />
              ))}
            {filteredSlots.filter((slot) => formatDate(slot.start) === formatDate(day)).length === 0 && (
              <p className="text-sm text-gray-500">No events scheduled</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CalendarView

