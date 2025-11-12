"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, GraduationCap, CreditCard, TrendingUp, 
  Calendar, Bell, BookOpen, Award, ArrowUp, ArrowDown,
  CheckCircle, Clock
} from "lucide-react"
import ParentDashboard from './parent-dashboard'

const stats = [
  {
    title: "Total Students",
    value: "2,847",
    change: "+12%",
    trend: "up",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Active Classes",
    value: "156",
    change: "+3%",
    trend: "up", 
    icon: BookOpen,
    color: "text-green-600"
  },
  {
    title: "Fee Collection",
    value: "₹45.2L",
    change: "+8%",
    trend: "up",
    icon: CreditCard,
    color: "text-purple-600"
  },
  {
    title: "Attendance Rate",
    value: "94.5%",
    change: "-2%",
    trend: "down",
    icon: TrendingUp,
    color: "text-orange-600"
  }
]

const recentActivities = [
  { type: "admission", message: "New student admission: Rahul Sharma", time: "2 hours ago" },
  { type: "fee", message: "Fee payment received from Class 10-A", time: "4 hours ago" },
  { type: "exam", message: "Mid-term exam results published", time: "1 day ago" },
  { type: "event", message: "Annual sports day scheduled", time: "2 days ago" }
]

const upcomingEvents = [
  { title: "Parent-Teacher Meeting", date: "Dec 15, 2024", type: "meeting" },
  { title: "Winter Break Starts", date: "Dec 20, 2024", type: "holiday" },
  { title: "Annual Function", date: "Jan 5, 2025", type: "event" },
  { title: "Board Exam Registration", date: "Jan 10, 2025", type: "exam" }
]

export default function DashboardPage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [parentData, setParentData] = useState<any>(null)
  const [parentLoading, setParentLoading] = useState(true)

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        setCurrentUser(userData)
        
        if (userData.role === 'student') {
          fetchStudentDashboard()
        } else {
          setLoading(false)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        setCurrentUser({ role: 'admin', name: 'Admin User', email: 'admin@school.edu' })
        setLoading(false)
      }
    } else {
      // Set default user for demo purposes
      setCurrentUser({ role: 'admin', name: 'Admin User', email: 'admin@school.edu' })
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (currentUser?.role === 'parent') {
      fetchParentDashboard()
    }
  }, [currentUser])

  const fetchStudentDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/profile/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const fetchParentDashboard = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/parents/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setParentData(data)
      }
    } catch (error) {
      console.error('Failed to fetch parent dashboard:', error)
    } finally {
      setParentLoading(false)
    }
  }

  if (currentUser?.role === 'parent') {

    if (parentLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading parent dashboard...</p>
          </div>
        </div>
      )
    }

    const totalPendingFees = parentData?.children?.reduce((sum: number, child: any) => sum + (child.feeStatus?.totalPending || 0), 0) || 0
    const avgAttendance = parentData?.children?.length > 0 ? 
      parentData.children.reduce((sum: number, child: any) => sum + (child.attendanceStats?.percentage || 0), 0) / parentData.children.length : 0

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your children's academic progress and school activities
            </p>
          </div>
          <Button asChild>
            <a href="/dashboard/notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </a>
          </Button>
        </div>
        
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Children</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parentData?.totalChildren || 0}</div>
              <p className="text-xs text-muted-foreground">Enrolled students</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgAttendance.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all children</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
              <CreditCard className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalPendingFees.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total pending</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{parentData?.openComplaints || 0}</div>
              <p className="text-xs text-muted-foreground">Complaints pending</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Children Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parentData?.children?.map((child: any) => (
                  <div key={child.student?.id || Math.random()} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{child.student?.user?.firstName || 'N/A'} {child.student?.user?.lastName || ''}</p>
                      <p className="text-sm text-gray-500">
                        Class {child.student?.class || 'N/A'}-{child.student?.section || 'N/A'} • Attendance: {child.attendanceStats?.percentage?.toFixed(1) || '0'}%
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/dashboard/fees?child=${child.student?.id || ''}`}>View Details</a>
                    </Button>
                  </div>
                )) || (
                  <p className="text-center text-gray-500 py-4">No children found</p>
                )}
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
                  <a href="/dashboard/fees">
                    <CreditCard className="mr-2 h-4 w-4" />
                    View Fee Status
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/dashboard/complaints">
                    <Bell className="mr-2 h-4 w-4" />
                    File Complaint
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/dashboard/notifications">
                    <Calendar className="mr-2 h-4 w-4" />
                    View Notifications
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentUser?.role === 'student' && dashboardData) {
    return (
      <div className="space-y-6">
        {/* Student Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {dashboardData.student?.user?.firstName || 'Student'}!
            </h1>
            <p className="text-gray-600">
              Class {dashboardData.student?.class || 'N/A'}-{dashboardData.student?.section || 'N/A'} • Roll No: {dashboardData.student?.admissionNumber || 'N/A'}
            </p>
          </div>
          <Button>
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
        </div>

        {/* Student Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Attendance</CardTitle>
              <CheckCircle className="h-5 w-5 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.attendanceStats?.percentage?.toFixed(1) || '0'}%</div>
              <div className="flex items-center text-xs text-gray-600">
                <span>{dashboardData.attendanceStats?.present || 0} of {dashboardData.attendanceStats?.total || 0} days</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Recent Grade</CardTitle>
              <Award className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {dashboardData.recentGrades?.length > 0 ? dashboardData.recentGrades[0]?.grade || 'N/A' : 'N/A'}
              </div>
              <div className="flex items-center text-xs text-gray-600">
                <span>{dashboardData.recentGrades?.length || 0} subjects graded</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Fee Status</CardTitle>
              <CreditCard className="h-5 w-5 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{dashboardData.feeStatus?.totalPending?.toLocaleString() || '0'}</div>
              <div className="flex items-center text-xs text-gray-600">
                <span>Pending amount</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Class</CardTitle>
              <GraduationCap className="h-5 w-5 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.student?.class || 'N/A'}</div>
              <div className="flex items-center text-xs text-gray-600">
                <span>Section {dashboardData.student?.section || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest academic performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentGrades?.slice(0, 5).map((grade: any, index: number) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{grade?.subject || 'N/A'}</p>
                      <p className="text-xs text-gray-500">{grade?.examType || 'N/A'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{grade?.marksObtained || 0}/{grade?.totalMarks || 0}</p>
                      <p className="text-xs text-gray-500">Grade: {grade?.grade || 'N/A'}</p>
                    </div>
                  </div>
                )) || []}
                {(!dashboardData.recentGrades || dashboardData.recentGrades.length === 0) && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No grades available yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Frequently used features</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start" asChild>
                  <a href="/dashboard/grades">
                    <Award className="mr-2 h-4 w-4" />
                    View All Grades
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/dashboard/schedule">
                    <Calendar className="mr-2 h-4 w-4" />
                    Class Schedule
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/dashboard/fees">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Fee Details
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Default dashboard for other roles
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening at your school.</p>
        </div>
        <Button>
          <Calendar className="h-4 w-4 mr-2" />
          View Calendar
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-gray-600">
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your school</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>Important dates and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-gray-500">{event.date}</p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'holiday' ? 'bg-green-100 text-green-800' :
                    event.type === 'event' ? 'bg-purple-100 text-purple-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {event.type}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              Add Student
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <BookOpen className="h-6 w-6 mb-2" />
              Create Class
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <CreditCard className="h-6 w-6 mb-2" />
              Collect Fee
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Bell className="h-6 w-6 mb-2" />
              Send Notice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}