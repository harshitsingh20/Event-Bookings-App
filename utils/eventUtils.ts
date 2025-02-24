import { startOfWeek, endOfWeek, eachDayOfInterval, format } from "date-fns"
import axios from "axios"

export type EventCategory = "Cat 1" | "Cat 2" | "Cat 3"

export interface TimeSlot {
  id: string
  category: EventCategory
  start: Date
  end: Date
  userId: string | null
}

export interface TimeSlotCreate {
  category: EventCategory
  start: Date
  end: Date
}

export interface User {
  id: string
  name: string
  email: string
  preferences: EventCategory[]
}

const API_URL = "http://localhost:8000"

let token: string | null = null

export const setToken = (newToken: string) => {
  token = newToken
}

const api = axios.create({
  baseURL: API_URL,
})

api.interceptors.request.use(
  (config) => {
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

export const login = async (email: string, password: string): Promise<string> => {
  const response = await api.post("/token", { email, password })
  setToken(response.data.access_token)
  return response.data.access_token
}

export const register = async (name: string, email: string, password: string): Promise<User> => {
  const response = await api.post("/register", { name, email, password })
  return response.data
}

export const getTimeSlots = async (): Promise<TimeSlot[]> => {
  const response = await api.get("/timeslots")
  return response.data.map((slot: any) => ({
    ...slot,
    start: new Date(slot.start),
    end: new Date(slot.end),
  }))
}

export const saveTimeSlots = async (slots: TimeSlot[]): Promise<void> => {
  await Promise.all(slots.map((slot) => api.put(`/timeslots/${slot.id}`, slot)))
}

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get("/users/me")
  return [response.data]
}

export const saveUsers = async (users: User[]): Promise<void> => {
  await Promise.all(users.map((user) => api.put(`/users/${user.id}`, user)))
}

export const updateUserPreferences = async (userId: string, preferences: EventCategory[]): Promise<User> => {
  const response = await api.put(`/users/${userId}/preferences`, { preferences: preferences.join(",") })
  return response.data
}

export const bookTimeSlot = async (slotId: string): Promise<TimeSlot> => {
  const response = await api.post(`/book/${slotId}`)
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: new Date(response.data.end),
  }
}

export const cancelBooking = async (slotId: string): Promise<TimeSlot> => {
  const response = await api.post(`/cancel/${slotId}`)
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: new Date(response.data.end),
  }
}

export const addTimeSlot = async (slot: Omit<TimeSlot, "id">): Promise<TimeSlot> => {
  const response = await api.post("/timeslots", slot)
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: new Date(response.data.end),
  }
}

export const editTimeSlot = async (slot: TimeSlot): Promise<TimeSlot> => {
  const response = await api.put(`/timeslots/${slot.id}`, slot)
  return {
    ...response.data,
    start: new Date(response.data.start),
    end: new Date(response.data.end),
  }
}

export const deleteTimeSlot = async (slotId: string): Promise<void> => {
  await api.delete(`/timeslots/${slotId}`)
}

// Keep these utility functions
export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Start week on Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export const formatDate = (date: Date) => {
  return format(date, "yyyy-MM-dd")
}

