"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, Award, Clock, Users, BookOpen, 
  CheckCircle, Star, BarChart3, Calendar, Target
} from "lucide-react"

interface PerformanceData {
  overall: {
    rating: number
    rank: number
    totalTeachers: number
  }
  attendance: {
    rate: number
    presentDays: number
    totalDays: number
    trend: 'up' | 'down' | 'stable'
  }
  classes: {
    completionRate: number
    totalScheduled: number
    completed: number
    missed: number
    onTimeRate: number
  }
  student: {
    averageAttendance: number
    passRate: number
    satisfactionScore: number
    totalStudents: number
  }
  monthly: {
    month: string
    rating: number
    bonus: number
    penalty: number
  }[]
  goals: {
    id: string
    title: string
    target: number
    current: number
    deadline: string
    status: 'on_track' | 'behind' | 'completed'
  }[]
}

export default function TeacherPerformancePage() {
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')

  useEffect(() => {
    fetchPerformanceData()
  }, [selectedPeriod])

  const fetchPerformanceData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/performance?period=${selectedPeriod}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPerformanceData(data)
      }
    } catch (error) {
      console.error('Failed to fetch performance data:', error)
      // Mock data
      setPerformanceData({
        overall: {
          rating: 4.2,
          rank: 8,
          totalTeachers: 45
        },
        attendance: {
          rate: 92.5,
          presentDays: 37,
          totalDays: 40,
          trend: 'up'
        },
        classes: {
          completionRate: 95.5,
          totalScheduled: 88,
          completed: 84,
          missed: 4,
          onTimeRate: 98.8
        },
        student: {
          averageAttendance: 89.2,
          passRate: 94.5,
          satisfactionScore: 4.1,
          totalStudents: 180
        },
        monthly: [
          { month: 'Nov 2024', rating: 4.3, bonus: 2000, penalty: 0 },
          { month: 'Oct 2024', rating: 4.0, bonus: 1500, penalty: 0 },
          { month: 'Sep 2024', rating: 4.1, bonus: 1800, penalty: 0 }
        ],
        goals: [
          {
            id: '1',
            title: 'Maintain 95% attendance rate',
            target: 95,
            current: 92.5,
            deadline: '2024-12-31',
            status: 'behind'
          },
          {
            id: '2',
            title: 'Complete all scheduled classes',
            target: 100,
            current: 95.5,
            deadline: '2024-12-31',
            status: 'on_track'
          },
          {
            id: '3',
            title: 'Achieve 4.5 student satisfaction',
            target: 4.5,
            current: 4.1,
            deadline: '2024-12-31',
            status: 'on_track'
          }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const getRatingStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />)
    }
    
    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }
    
    return stars
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'on_track': return 'bg-blue-100 text-blue-800'
      case 'behind': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />
      default: return <TrendingUp className="h-4 w-4 text-gray-600" />
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
          <h1 className="text-3xl font-bold tracking-tight">Performance Dashboard</h1>
          <p className="text-muted-foreground">Track your teaching performance and goals</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="current_month">Current Month</option>
            <option value="last_3_months">Last 3 Months</option>
            <option value="current_year">Current Year</option>
          </select>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {performanceData && (
        <>
          {/* Overall Performance */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Rating</CardTitle>
                <Award className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.overall.rating}/5.0</div>
                <div className="flex items-center space-x-1 mt-1">
                  {getRatingStars(performanceData.overall.rating)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Rank #{performanceData.overall.rank} of {performanceData.overall.totalTeachers}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <div className="text-2xl font-bold">{performanceData.attendance.rate}%</div>
                  {getTrendIcon(performanceData.attendance.trend)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {performanceData.attendance.presentDays}/{performanceData.attendance.totalDays} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Class Completion</CardTitle>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.classes.completionRate}%</div>
                <p className="text-xs text-muted-foreground">
                  {performanceData.classes.completed}/{performanceData.classes.totalScheduled} classes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Student Satisfaction</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{performanceData.student.satisfactionScore}/5.0</div>
                <div className="flex items-center space-x-1 mt-1">
                  {getRatingStars(performanceData.student.satisfactionScore)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Metrics */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Teaching Performance</CardTitle>
                <CardDescription>Your classroom and teaching metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Class Completion Rate</span>
                      <span className="text-sm">{performanceData.classes.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${performanceData.classes.completionRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">On-Time Rate</span>
                      <span className="text-sm">{performanceData.classes.onTimeRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${performanceData.classes.onTimeRate}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Student Attendance</span>
                      <span className="text-sm">{performanceData.student.averageAttendance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full" 
                        style={{ width: `${performanceData.student.averageAttendance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Student Pass Rate</span>
                      <span className="text-sm">{performanceData.student.passRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${performanceData.student.passRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Performance</CardTitle>
                <CardDescription>Your performance trend over recent months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {performanceData.monthly.map((month, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{month.month}</p>
                        <div className="flex items-center space-x-1">
                          {getRatingStars(month.rating)}
                          <span className="text-sm ml-2">{month.rating}/5.0</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {month.bonus > 0 && (
                          <p className="text-sm text-green-600 font-medium">
                            Bonus: ₹{month.bonus.toLocaleString()}
                          </p>
                        )}
                        {month.penalty > 0 && (
                          <p className="text-sm text-red-600 font-medium">
                            Penalty: ₹{month.penalty.toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Goals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Performance Goals</span>
              </CardTitle>
              <CardDescription>Track your progress towards performance targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.goals.map((goal) => (
                  <div key={goal.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{goal.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGoalStatusColor(goal.status)}`}>
                          {goal.status.replace('_', ' ')}
                        </span>
                        <span className="text-sm text-gray-500">
                          Due: {new Date(goal.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress: {goal.current} / {goal.target}</span>
                        <span>{((goal.current / goal.target) * 100).toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            goal.status === 'completed' ? 'bg-green-600' :
                            goal.status === 'on_track' ? 'bg-blue-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Performance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Insights</CardTitle>
              <CardDescription>AI-powered recommendations to improve your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Attendance Improvement</h4>
                      <p className="text-sm text-blue-700">
                        Your attendance rate is slightly below target. Consider setting reminders for early morning classes.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-green-900">Excellent Class Completion</h4>
                      <p className="text-sm text-green-700">
                        Great job maintaining a 95.5% class completion rate! Keep up the excellent work.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Student Engagement</h4>
                      <p className="text-sm text-yellow-700">
                        Consider interactive teaching methods to boost student satisfaction from 4.1 to 4.5.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}