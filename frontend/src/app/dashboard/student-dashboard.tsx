"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Award, Calendar, CreditCard, CheckCircle, 
  GraduationCap, Bell, Clock, TrendingUp
} from "lucide-react"

interface StudentDashboardData {
  student: {
    id: string
    admissionNumber: string
    class: string
    section: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
  }
  recentGrades: Array<{
    subject: string
    marksObtained: number
    totalMarks: number
    percentage: number
    grade: string
    examType: string
  }>
  attendanceStats: {
    total: number
    present: number
    percentage: number
  }
  feeStatus: {
    totalPaid: number
    totalPending: number
  }
}

export default function StudentDashboard() {
  const [dashboardData, setDashboardData] = useState<StudentDashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStudentDashboard()
  }, [])

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

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Unable to load dashboard data</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, {dashboardData.student.user.firstName}!
          </h1>
          <p className="text-muted-foreground">
            Class {dashboardData.student.class}-{dashboardData.student.section} • Roll No: {dashboardData.student.admissionNumber}
          </p>
        </div>
        <Button>
          <Bell className="mr-2 h-4 w-4" />
          Notifications
        </Button>
      </div>

      {/* Student Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.attendanceStats.percentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.attendanceStats.present} of {dashboardData.attendanceStats.total} days
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Grades</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.recentGrades.length > 0 ? dashboardData.recentGrades[0].grade : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              {dashboardData.recentGrades.length} subjects graded
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Status</CardTitle>
            <CreditCard className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{dashboardData.feeStatus.totalPending.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Pending amount
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class</CardTitle>
            <GraduationCap className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.student.class}</div>
            <p className="text-xs text-muted-foreground">
              Section {dashboardData.student.section}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades & Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentGrades.slice(0, 5).map((grade, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{grade.subject}</p>
                    <p className="text-xs text-muted-foreground">{grade.examType}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{grade.marksObtained}/{grade.totalMarks}</p>
                    <p className="text-xs text-muted-foreground">Grade: {grade.grade}</p>
                  </div>
                </div>
              ))}
              {dashboardData.recentGrades.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No grades available yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
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