"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Calendar, Clock, Users, BookOpen, CheckCircle, 
  AlertCircle, IndianRupee, TrendingUp, Award, Bell
} from "lucide-react"

interface TeacherStats {
  totalClasses: number
  classesCompleted: number
  attendanceRate: number
  studentsCount: number
  pendingSalary: number
  monthlyHours: number
  performanceScore: number
}

interface ScheduleItem {
  id: string
  subject: string
  class: string
  section: string
  time: string
  duration: number
  status: 'scheduled' | 'completed' | 'missed' | 'cancelled'
  attendanceMarked: boolean
}

export default function TeacherDashboard() {
  const [stats, setStats] = useState<TeacherStats | null>(null)
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTeacherData()
  }, [])

  const fetchTeacherData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsResponse, scheduleResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/schedule/today`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (scheduleResponse.ok) {
        const scheduleData = await scheduleResponse.json()
        setTodaySchedule(scheduleData)
      }
    } catch (error) {
      console.error('Failed to fetch teacher data:', error)
      // Mock data
      setStats({
        totalClasses: 24,
        classesCompleted: 18,
        attendanceRate: 92.5,
        studentsCount: 180,
        pendingSalary: 45000,
        monthlyHours: 120,
        performanceScore: 4.2
      })
      setTodaySchedule([
        {
          id: '1',
          subject: 'Mathematics',
          class: '10',
          section: 'A',
          time: '09:00 AM',
          duration: 45,
          status: 'completed',
          attendanceMarked: true
        },
        {
          id: '2',
          subject: 'Physics',
          class: '11',
          section: 'B',
          time: '11:00 AM',
          duration: 45,
          status: 'scheduled',
          attendanceMarked: false
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const markAttendance = async (scheduleId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/attendance/mark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ scheduleId })
      })
      
      if (response.ok) {
        fetchTeacherData()
        alert('Attendance marked successfully!')
      }
    } catch (error) {
      console.error('Failed to mark attendance:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'scheduled': return 'bg-blue-100 text-blue-800'
      case 'missed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

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
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">Track your classes, attendance, and performance</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" asChild>
            <a href="/teacher/schedule">
              <Calendar className="mr-2 h-4 w-4" />
              View Schedule
            </a>
          </Button>
          <Button asChild>
            <a href="/teacher/attendance">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark Attendance
            </a>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Completed</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.classesCompleted}/{stats?.totalClasses}</div>
            <p className="text-xs text-muted-foreground">
              {((stats?.classesCompleted || 0) / (stats?.totalClasses || 1) * 100).toFixed(1)}% completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.attendanceRate}%</div>
            <p className="text-xs text-muted-foreground">Your attendance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.studentsCount}</div>
            <p className="text-xs text-muted-foreground">Total students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Award className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.performanceScore}/5.0</div>
            <p className="text-xs text-muted-foreground">Rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule & Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
            <CardDescription>Your classes for today</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaySchedule.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.subject}</p>
                    <p className="text-sm text-gray-500">
                      Class {item.class}-{item.section} • {item.time} • {item.duration}min
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                    {item.status === 'scheduled' && !item.attendanceMarked && (
                      <Button size="sm" onClick={() => markAttendance(item.id)}>
                        Mark Present
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {todaySchedule.length === 0 && (
                <p className="text-center text-gray-500 py-4">No classes scheduled for today</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <a href="/teacher/attendance">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark Student Attendance
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/teacher/schedule">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Schedule
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/teacher/salary">
                  <IndianRupee className="mr-2 h-4 w-4" />
                  Salary Details
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/teacher/performance">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Performance Report
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Summary */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Monthly Hours</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.monthlyHours} hrs</div>
            <p className="text-sm text-gray-600">Teaching hours this month</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${((stats?.monthlyHours || 0) / 160) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Target: 160 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IndianRupee className="h-5 w-5" />
              <span>Salary Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.pendingSalary.toLocaleString()}</div>
            <p className="text-sm text-gray-600">Pending for this month</p>
            <Button size="sm" variant="outline" className="mt-2" asChild>
              <a href="/teacher/salary">View Details</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-orange-500" />
                <span className="text-sm">2 classes need attendance</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Salary processed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}