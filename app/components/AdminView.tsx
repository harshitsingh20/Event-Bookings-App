import { useState } from "react"
import { format } from "date-fns"
import type { User, TimeSlot, EventCategory } from "../../utils/eventUtils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface AdminViewProps {
  timeSlots: TimeSlot[]
  users: User[]
  addTimeSlot: (newSlot: TimeSlot) => void
  editTimeSlot: (editedSlot: TimeSlot) => void
  deleteTimeSlot: (slotId: string) => void
}

const AdminView: React.FC<AdminViewProps> = ({ timeSlots, users, addTimeSlot, editTimeSlot, deleteTimeSlot }) => {
  const [newSlot, setNewSlot] = useState<Partial<TimeSlot>>({
    category: "Cat 1",
    start: new Date().toISOString().slice(0, 16),
    end: new Date().toISOString().slice(0, 16),
  })
  const [editingSlot, setEditingSlot] = useState<TimeSlot | null>(null)

  const handleAddSlot = () => {
    if (newSlot.category && newSlot.start && newSlot.end) {
      addTimeSlot({
        id: Date.now().toString(),
        category: newSlot.category as EventCategory,
        start: new Date(newSlot.start),
        end: new Date(newSlot.end),
        userId: null,
      })
      setNewSlot({
        category: "Cat 1",
        start: new Date().toISOString().slice(0, 16),
        end: new Date().toISOString().slice(0, 16),
      })
    }
  }

  const handleEditSlot = () => {
    if (editingSlot) {
      editTimeSlot(editingSlot)
      setEditingSlot(null)
    }
  }

  const handleDeleteSlot = (slotId: string) => {
    if (confirm("Are you sure you want to delete this time slot?")) {
      deleteTimeSlot(slotId)
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-2xl font-semibold text-gray-800">Admin View</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select
          value={newSlot.category}
          onValueChange={(value) => setNewSlot({ ...newSlot, category: value as EventCategory })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Cat 1">Cat 1</SelectItem>
            <SelectItem value="Cat 2">Cat 2</SelectItem>
            <SelectItem value="Cat 3">Cat 3</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="datetime-local"
          value={newSlot.start}
          onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
        />
        <Input
          type="datetime-local"
          value={newSlot.end}
          onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
        />
        <Button onClick={handleAddSlot} className="w-full">
          Add Time Slot
        </Button>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">All Time Slots</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {timeSlots.map((slot) => (
            <li key={slot.id} className="border p-3 sm:p-4 rounded-md bg-white shadow-sm">
              <p className="font-medium text-gray-800">{slot.category}</p>
              <p className="text-sm text-gray-600">
                {format(slot.start, "MMM d, yyyy HH:mm")} - {format(slot.end, "HH:mm")}
              </p>
              <p className="text-sm text-gray-500">
                Booked by: {slot.user_id ? users.find((u) => u.id === slot.user_id)?.name || "Unknown" : "Not booked"}
              </p>
              <div className="mt-2 space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setEditingSlot(slot)}>
                      Edit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Time Slot</DialogTitle>
                    </DialogHeader>
                    {editingSlot && (
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="edit-category">Category</Label>
                          <Select
                            value={editingSlot.category}
                            onValueChange={(value) =>
                              setEditingSlot({ ...editingSlot, category: value as EventCategory })
                            }
                          >
                            <SelectTrigger id="edit-category" className="w-full">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cat 1">Cat 1</SelectItem>
                              <SelectItem value="Cat 2">Cat 2</SelectItem>
                              <SelectItem value="Cat 3">Cat 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="edit-start">Start Time</Label>
                          <Input
                            id="edit-start"
                            type="datetime-local"
                            value={editingSlot.start.toISOString().slice(0, 16)}
                            onChange={(e) => setEditingSlot({ ...editingSlot, start: new Date(e.target.value) })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="edit-end">End Time</Label>
                          <Input
                            id="edit-end"
                            type="datetime-local"
                            value={editingSlot.end.toISOString().slice(0, 16)}
                            onChange={(e) => setEditingSlot({ ...editingSlot, end: new Date(e.target.value) })}
                          />
                        </div>
                        <Button onClick={handleEditSlot}>Save Changes</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteSlot(slot.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AdminView

