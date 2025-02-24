"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getUsers,
  getTimeSlots,
  updateUserPreferences,
  bookTimeSlot,
  cancelBooking,
  addTimeSlot,
  editTimeSlot,
  deleteTimeSlot,
  type User,
  type TimeSlot,
  login,
  register,
  setToken,
  type EventCategory,
} from "../utils/eventUtils"
import UserPreferences from "./components/UserPreferences"
import CalendarView from "./components/CalendarView"
import AdminView from "./components/AdminView"
import LoginForm from "./components/LoginForm"
import RegisterForm from "./components/RegisterForm"

export default function Home() {
  const [users, setUsers] = useState<User[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      setToken(token)
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const fetchData = async () => {
    try {
      const [fetchedUsers, fetchedTimeSlots] = await Promise.all([getUsers(), getTimeSlots()])
      setUsers(fetchedUsers)
      setTimeSlots(fetchedTimeSlots)
      if (fetchedUsers.length > 0) {
        setCurrentUser(fetchedUsers[0])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      const token = await login(email, password)
      localStorage.setItem("token", token)
      setIsAuthenticated(true)
      fetchData()
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password)
      handleLogin(email, password)
    } catch (error) {
      console.error("Registration failed:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    setToken(null)
    setIsAuthenticated(false)
    setCurrentUser(null)
  }

  const updateUserPreferencesHandler = async (userId: string, preferences: string[]) => {
    try {
      const updatedUser = await updateUserPreferences(userId, preferences as EventCategory[])
      setUsers(users.map((user) => (user.id === userId ? updatedUser : user)))
      if (currentUser && currentUser.id === userId) {
        setCurrentUser(updatedUser)
      }
    } catch (error) {
      console.error("Error updating user preferences:", error)
    }
  }

  const bookTimeSlotHandler = async (slotId: string) => {
    try {
      const updatedSlot = await bookTimeSlot(slotId)
      setTimeSlots(timeSlots.map((slot) => (slot.id === slotId ? updatedSlot : slot)))
    } catch (error) {
      console.error("Error booking time slot:", error)
    }
  }

  const cancelBookingHandler = async (slotId: string) => {
    try {
      const updatedSlot = await cancelBooking(slotId)
      setTimeSlots(timeSlots.map((slot) => (slot.id === slotId ? updatedSlot : slot)))
    } catch (error) {
      console.error("Error canceling booking:", error)
    }
  }

  const addTimeSlotHandler = async (newSlot: Omit<TimeSlot, "id">) => {
    try {
      const addedSlot = await addTimeSlot(newSlot)
      setTimeSlots([...timeSlots, addedSlot])
    } catch (error) {
      console.error("Error adding time slot:", error)
    }
  }

  const editTimeSlotHandler = async (editedSlot: TimeSlot) => {
    try {
      const updatedSlot = await editTimeSlot(editedSlot)
      setTimeSlots(timeSlots.map((slot) => (slot.id === editedSlot.id ? updatedSlot : slot)))
    } catch (error) {
      console.error("Error editing time slot:", error)
    }
  }

  const deleteTimeSlotHandler = async (slotId: string) => {
    try {
      await deleteTimeSlot(slotId)
      setTimeSlots(timeSlots.filter((slot) => slot.id !== slotId))
    } catch (error) {
      console.error("Error deleting time slot:", error)
    }
  }

  const handleUserChange = (userId: string) => {
    const selectedUser = users.find((user) => user.id == userId)
    if (selectedUser) {
      setCurrentUser(selectedUser)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Event Booking App</h1>
          <Tabs defaultValue="login" className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm onLogin={handleLogin} />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm onRegister={handleRegister} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Event Booking App</h1>
        <div className="mb-6 flex justify-between items-center">
          <Select onValueChange={handleUserChange} value={currentUser?.id} disabled={true}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select user" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        </div>
        <Tabs defaultValue="calendar" className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-2 mb-6">
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="preferences">User Preferences</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar">
            <CalendarView
              timeSlots={timeSlots}
              currentUser={currentUser}
              bookTimeSlot={bookTimeSlotHandler}
              cancelBooking={cancelBookingHandler}
            />
          </TabsContent>
          <TabsContent value="preferences">
            <UserPreferences currentUser={currentUser} updatePreferences={updateUserPreferencesHandler} />
          </TabsContent>
          <TabsContent value="admin">
            <AdminView
              timeSlots={timeSlots}
              users={users}
              addTimeSlot={addTimeSlotHandler}
              editTimeSlot={editTimeSlotHandler}
              deleteTimeSlot={deleteTimeSlotHandler}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

