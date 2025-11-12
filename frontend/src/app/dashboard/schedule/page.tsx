"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, BookOpen, MapPin, User } from "lucide-react"

interface ScheduleItem {
  id: string
  subject: string
  teacher: string
  classroom: string
  startTime: string
  endTime: string
  day: string
  type: 'class' | 'exam' | 'event'
}

const mockSchedule: ScheduleItem[] = [
  {
    id: '1',
    subject: 'Mathematics',
    teacher: 'Mr. Sharma',
    classroom: 'Room 101',
    startTime: '09:00',
    endTime: '09:45',
    day: 'Monday',
    type: 'class'
  },
  {
    id: '2',
    subject: 'English',
    teacher: 'Ms. Patel',
    classroom: 'Room 102',
    startTime: '09:45',
    endTime: '10:30',
    day: 'Monday',
    type: 'class'
  },
  {
    id: '3',
    subject: 'Science',
    teacher: 'Dr. Kumar',
    classroom: 'Lab 1',
    startTime: '11:00',
    endTime: '11:45',
    day: 'Monday',
    type: 'class'
  },
  {
    id: '4',
    subject: 'Social Studies',
    teacher: 'Mrs. Singh',
    classroom: 'Room 103',
    startTime: '11:45',
    endTime: '12:30',
    day: 'Monday',
    type: 'class'
  },
  {
    id: '5',
    subject: 'Hindi',
    teacher: 'Mr. Gupta',
    classroom: 'Room 104',
    startTime: '13:30',
    endTime: '14:15',
    day: 'Monday',
    type: 'class'
  }
]

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const timeSlots = [
  '09:00-09:45',
  '09:45-10:30',
  '10:30-11:00', // Break
  '11:00-11:45',
  '11:45-12:30',
  '12:30-13:30', // Lunch
  '13:30-14:15',
  '14:15-15:00'
]

export default function SchedulePage() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(mockSchedule)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [currentWeek, setCurrentWeek] = useState(new Date())

  const getTodaySchedule = () => {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    return schedule.filter(item => item.day === today)
  }

  const getScheduleForDay = (day: string) => {
    return schedule.filter(item => item.day === day)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'class': return 'bg-blue-100 text-blue-800'
      case 'exam': return 'bg-red-100 text-red-800'
      case 'event': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const isCurrentClass = (startTime: string, endTime: string) => {
    const now = getCurrentTime()
    return now >= startTime && now <= endTime
  }

  const todaySchedule = getTodaySchedule()
  const selectedDaySchedule = getScheduleForDay(selectedDay)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
          <p className="text-muted-foreground">
            Your daily class timetable and upcoming events
          </p>
        </div>
        <Button>
          <Calendar className="mr-2 h-4 w-4" />
          View Calendar
        </Button>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Clock className="h-5 w-5" />
            <span>Today's Classes</span>
          </CardTitle>
          <CardDescription>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {todaySchedule.length > 0 ? (
            <div className="space-y-4">
              {todaySchedule.map((item) => (
                <div 
                  key={item.id} 
                  className={`flex items-center justify-between p-4 rounded-lg border ${
                    isCurrentClass(item.startTime, item.endTime) 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-bold">{item.startTime}</div>
                      <div className="text-xs text-gray-500">{item.endTime}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold">{item.subject}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{item.teacher}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{item.classroom}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <CardDescription>Complete timetable for the week</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Day Selector */}
          <div className="flex space-x-2 mb-6 overflow-x-auto">
            {days.map((day) => (
              <Button
                key={day}
                variant={selectedDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDay(day)}
                className="whitespace-nowrap"
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Schedule for Selected Day */}
          <div className="space-y-3">
            {selectedDaySchedule.length > 0 ? (
              selectedDaySchedule.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-3 border rounded-lg">
                  <div className="text-center min-w-[80px]">
                    <div className="text-sm font-bold">{item.startTime}</div>
                    <div className="text-xs text-gray-500">{item.endTime}</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <BookOpen className="h-4 w-4 text-blue-600" />
                      <h3 className="font-semibold">{item.subject}</h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{item.teacher}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{item.classroom}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {item.type}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No classes scheduled for {selectedDay}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Time Table Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Complete Timetable</CardTitle>
          <CardDescription>Full week overview</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 bg-gray-50">Time</th>
                  {days.map(day => (
                    <th key={day} className="border p-2 bg-gray-50 min-w-[120px]">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((timeSlot, index) => (
                  <tr key={timeSlot}>
                    <td className="border p-2 font-medium text-sm bg-gray-50">{timeSlot}</td>
                    {days.map(day => {
                      const classForSlot = schedule.find(item => 
                        item.day === day && 
                        `${item.startTime}-${item.endTime}` === timeSlot
                      )
                      
                      if (timeSlot === '10:30-11:00') {
                        return <td key={day} className="border p-2 bg-yellow-50 text-center text-sm">Break</td>
                      }
                      
                      if (timeSlot === '12:30-13:30') {
                        return <td key={day} className="border p-2 bg-orange-50 text-center text-sm">Lunch</td>
                      }
                      
                      return (
                        <td key={day} className="border p-2">
                          {classForSlot ? (
                            <div className="text-xs">
                              <div className="font-medium">{classForSlot.subject}</div>
                              <div className="text-gray-500">{classForSlot.teacher}</div>
                              <div className="text-gray-400">{classForSlot.classroom}</div>
                            </div>
                          ) : (
                            <div className="text-center text-gray-400">-</div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}