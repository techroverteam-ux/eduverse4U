'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import { TrendingUp, Users, CreditCard, Calendar, BarChart3, PieChart } from "lucide-react"

export default function AnalyticsPage() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFees: 0,
    attendanceRate: 0,
    monthlyGrowth: 0
  })

  const [chartData, setChartData] = useState<{
    feeCollection: Array<{ month: string; amount: number }>
    attendanceTrend: Array<{ date: string; rate: number }>
    classDistribution: Array<{ class: string; students: number }>
  }>({
    feeCollection: [],
    attendanceTrend: [],
    classDistribution: []
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json()
      setStats(data)

      // Mock chart data
      setChartData({
        feeCollection: [
          { month: 'Jan', amount: 250000 },
          { month: 'Feb', amount: 280000 },
          { month: 'Mar', amount: 320000 },
          { month: 'Apr', amount: 290000 },
          { month: 'May', amount: 350000 },
          { month: 'Jun', amount: 380000 }
        ],
        attendanceTrend: [
          { date: '2024-01-01', rate: 92 },
          { date: '2024-01-02', rate: 88 },
          { date: '2024-01-03', rate: 95 },
          { date: '2024-01-04', rate: 91 },
          { date: '2024-01-05', rate: 94 }
        ],
        classDistribution: [
          { class: 'Class 1', students: 45 },
          { class: 'Class 2', students: 52 },
          { class: 'Class 3', students: 48 },
          { class: 'Class 4', students: 55 },
          { class: 'Class 5', students: 42 }
        ]
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Insights and trends for data-driven decisions</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalStudents}</div>
                <p className="text-xs text-green-600">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Fee Collection</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{(stats.totalFees / 100000).toFixed(1)}L</div>
                <p className="text-xs text-green-600">+8% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
                <p className="text-xs text-green-600">+2% from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15.2%</div>
                <p className="text-xs text-green-600">Steady growth</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Fee Collection Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.feeCollection.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.month}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${(item.amount / 400000) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">₹{(item.amount / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Class Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.classDistribution.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.class}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full" 
                            style={{ width: `${(item.students / 60) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{item.students}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Attendance Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">94.2%</div>
                  <p className="text-sm text-gray-600">Average Attendance</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">1,180</div>
                  <p className="text-sm text-gray-600">Present Today</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600">70</div>
                  <p className="text-sm text-gray-600">Absent Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}