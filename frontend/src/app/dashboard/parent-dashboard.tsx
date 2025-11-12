"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, Award, Calendar, CreditCard, Bell, 
  TrendingUp, AlertCircle, CheckCircle, MessageSquare,
  BookOpen, Clock, IndianRupee, User, GraduationCap
} from "lucide-react"

interface Child {
  student: {
    id: string
    admissionNumber: string
    class: string
    section: string
    user: {
      firstName: string
      lastName: string
    }
  }
  recentGrades: Array<{
    subject: string
    grade: string
    percentage: number
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

interface ParentDashboardData {
  parent: any
  children: Child[]
  recentComplaints: Array<{
    id: string
    subject: string
    status: string
    createdAt: string
  }>
  totalChildren: number
  openComplaints: number
}

export default function ParentDashboard() {
  const [dashboardData, setDashboardData] = useState<ParentDashboardData | null>(null)
  const [selectedChild, setSelectedChild] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchParentDashboard()
  }, [])

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
        setDashboardData(data)
        if (data.children.length > 0) {
          setSelectedChild(data.children[0].student.id)
        }
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

  const selectedChildData = dashboardData.children.find(child => child.student.id === selectedChild)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your children's academic progress and school activities
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Complaint
          </Button>
          <Button>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Children</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalChildren}</div>
            <p className="text-xs text-muted-foreground">Enrolled in school</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Complaints</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.openComplaints}</div>
            <p className="text-xs text-muted-foreground">Pending resolution</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.children.length > 0 ? 
                (dashboardData.children.reduce((sum, child) => sum + child.attendanceStats.percentage, 0) / dashboardData.children.length).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Average across children</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <IndianRupee className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{dashboardData.children.reduce((sum, child) => sum + child.feeStatus.totalPending, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total across children</p>
          </CardContent>
        </Card>
      </div>

      {/* Child Selection */}
      {dashboardData.children.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-2">
              {dashboardData.children.map((child) => (
                <Button
                  key={child.student.id}
                  variant={selectedChild === child.student.id ? "default" : "outline"}
                  onClick={() => setSelectedChild(child.student.id)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {child.student.user.firstName} {child.student.user.lastName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Child Details */}
      {selectedChildData && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Child Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>{selectedChildData.student.user.firstName} {selectedChildData.student.user.lastName}</span>
              </CardTitle>
              <CardDescription>
                Class {selectedChildData.student.class}-{selectedChildData.student.section} • 
                Roll No: {selectedChildData.student.admissionNumber}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Attendance</span>
                  <span className="font-bold">{selectedChildData.attendanceStats.percentage.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recent Grades</span>
                  <span className="font-bold">{selectedChildData.recentGrades.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pending Fees</span>
                  <span className="font-bold text-red-600">₹{selectedChildData.feeStatus.totalPending.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5" />
                <span>Recent Grades</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {selectedChildData.recentGrades.slice(0, 3).map((grade, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">{grade.subject}</span>
                    <div className="text-right">
                      <span className="font-bold">{grade.grade}</span>
                      <div className="text-xs text-gray-500">{grade.percentage}%</div>
                    </div>
                  </div>
                ))}
                {selectedChildData.recentGrades.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">No grades available</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <a href={`/dashboard/children/${selectedChild}/grades`}>
                    <Award className="mr-2 h-4 w-4" />
                    View All Grades
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href={`/dashboard/children/${selectedChild}/attendance`}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Attendance Report
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href={`/dashboard/children/${selectedChild}/fees`}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Fee Details
                  </a>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <a href="/dashboard/complaints">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    File Complaint
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Complaints */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Complaints</CardTitle>
          <CardDescription>Your recent complaints and their status</CardDescription>
        </CardHeader>
        <CardContent>
          {dashboardData.recentComplaints.length > 0 ? (
            <div className="space-y-4">
              {dashboardData.recentComplaints.map((complaint) => (
                <div key={complaint.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{complaint.subject}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                    complaint.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No complaints filed</p>
              <p className="text-sm text-gray-500">File a complaint if you have any concerns</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}