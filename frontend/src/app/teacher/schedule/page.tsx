"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, Clock, BookOpen, Users, CheckCircle, 
  XCircle, AlertCircle, ChevronLeft, ChevronRight, Filter
} from "lucide-react"

interface ScheduleItem {
  id: string
  subject: string
  class: string
  section: string
  startTime: string
  endTime: string
  duration: number
  room: string
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled'
  attendanceMarked: boolean
  studentCount: number
  date: string
}

interface WeeklySchedule {
  [key: string]: ScheduleItem[]
}

export default function TeacherSchedulePage() {
  const [schedule, setSchedule] = useState<WeeklySchedule>({})
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    fetchSchedule()
  }, [currentWeek])

  const fetchSchedule = async () => {
    try {
      const token = localStorage.getItem('token')
      const startDate = getWeekStart(currentWeek)
      const endDate = getWeekEnd(currentWeek)
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/schedule?startDate=${startDate}&endDate=${endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSchedule(data)
      }
    } catch (error) {
      console.error('Failed to fetch schedule:', error)
      // Mock data
      const mockSchedule: WeeklySchedule = {
        '2024-12-09': [
          {
            id: '1',
            subject: 'Mathematics',
            class: '10',
            section: 'A',
            startTime: '09:00',
            endTime: '09:45',
            duration: 45,
            room: 'Room 101',
            status: 'completed',
            attendanceMarked: true,
            studentCount: 35,
            date: '2024-12-09'
          },
          {
            id: '2',
            subject: 'Physics',
            class: '11',
            section: 'B',
            startTime: '11:00',
            endTime: '11:45',
            duration: 45,
            room: 'Lab 201',
            status: 'scheduled',
            attendanceMarked: false,
            studentCount: 28,
            date: '2024-12-09'
          }
        ],
        '2024-12-10': [
          {
            id: '3',
            subject: 'Mathematics',
            class: '9',
            section: 'C',
            startTime: '10:00',
            endTime: '10:45',
            duration: 45,
            room: 'Room 102',
            status: 'scheduled',
            attendanceMarked: false,
            studentCount: 32,
            date: '2024-12-10'
          }
        ]
      }
      setSchedule(mockSchedule)
    } finally {
      setLoading(false)
    }
  }

  const getWeekStart = (date: Date) => {
    const start = new Date(date)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    return start.toISOString().split('T')[0]
  }

  const getWeekEnd = (date: Date) => {
    const end = new Date(date)
    const day = end.getDay()
    const diff = end.getDate() - day + (day === 0 ? 0 : 7)
    end.setDate(diff)
    return end.toISOString().split('T')[0]
  }

  const getWeekDays = () => {
    const start = new Date(currentWeek)
    const day = start.getDay()
    const diff = start.getDate() - day + (day === 0 ? -6 : 1)
    start.setDate(diff)
    
    const days = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(start)
      date.setDate(start.getDate() + i)
      days.push(date)
    }
    return days
  }

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(newWeek.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const markClassCompleted = async (scheduleId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/schedule/${scheduleId}/complete`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        fetchSchedule()
        alert('Class marked as completed!')
      }
    } catch (error) {
      console.error('Failed to mark class completed:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'scheduled': return <Clock className="h-4 w-4 text-blue-600" />
      case 'missed': return <XCircle className="h-4 w-4 text-red-600" />
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'missed': return 'bg-red-100 text-red-800 border-red-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const weekDays = getWeekDays()
  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">Manage your weekly class schedule</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button onClick={() => setCurrentWeek(new Date())}>
            Today
          </Button>
        </div>
      </div>

      {/* Week Navigation */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-xl font-semibold">
              Week of {weekDays[0].toLocaleDateString()} - {weekDays[6].toLocaleDateString()}
            </h2>
            <Button variant="outline" onClick={() => navigateWeek('next')}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Schedule Grid */}
      <div className="grid gap-4 md:grid-cols-7">
        {weekDays.map((day, index) => {
          const dateStr = day.toISOString().split('T')[0]
          const daySchedule = schedule[dateStr] || []
          const isToday = dateStr === new Date().toISOString().split('T')[0]
          
          return (
            <Card key={dateStr} className={isToday ? 'ring-2 ring-blue-500' : ''}>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">
                  {dayNames[index]}
                </CardTitle>
                <CardDescription className="text-xs">
                  {day.toLocaleDateString()}
                  {isToday && <span className="ml-2 text-blue-600 font-medium">(Today)</span>}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {daySchedule.length > 0 ? (
                    daySchedule.map((item) => (
                      <div
                        key={item.id}
                        className={`p-2 rounded-lg border text-xs ${getStatusColor(item.status)}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.subject}</span>
                          {getStatusIcon(item.status)}
                        </div>
                        <div className="space-y-1">
                          <p>Class {item.class}-{item.section}</p>
                          <p>{item.startTime} - {item.endTime}</p>
                          <p>{item.room}</p>
                          <p className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {item.studentCount} students
                          </p>
                        </div>
                        {item.status === 'scheduled' && (
                          <div className="mt-2 space-y-1">
                            <Button
                              size="sm"
                              className="w-full text-xs h-6"
                              onClick={() => markClassCompleted(item.id)}
                            >
                              Mark Completed
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full text-xs h-6"
                              onClick={() => window.location.href = `/teacher/attendance?session=${item.id}`}
                            >
                              Take Attendance
                            </Button>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-xs text-center py-4">No classes</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Schedule Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(() => {
                const allClasses = Object.values(schedule).flat()
                const completed = allClasses.filter(c => c.status === 'completed').length
                const scheduled = allClasses.filter(c => c.status === 'scheduled').length
                const missed = allClasses.filter(c => c.status === 'missed').length
                const total = allClasses.length
                
                return (
                  <>
                    <div className="flex justify-between">
                      <span>Total Classes</span>
                      <span className="font-bold">{total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        Completed
                      </span>
                      <span className="font-bold text-green-600">{completed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 text-blue-600 mr-2" />
                        Scheduled
                      </span>
                      <span className="font-bold text-blue-600">{scheduled}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        Missed
                      </span>
                      <span className="font-bold text-red-600">{missed}</span>
                    </div>
                    <div className="pt-2 border-t">
                      <div className="flex justify-between">
                        <span>Completion Rate</span>
                        <span className="font-bold">
                          {total > 0 ? ((completed / total) * 100).toFixed(1) : 0}%
                        </span>
                      </div>
                    </div>
                  </>
                )
              })()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <a href="/teacher/attendance">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Attendance
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/teacher/classes">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Manage Classes
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/teacher/performance">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Performance
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}