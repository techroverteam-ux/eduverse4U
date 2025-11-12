"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, Users, Building2, IndianRupee, Activity, 
  Calendar, Download, Filter, BarChart3, PieChart, LineChart
} from "lucide-react"

const analyticsData = {
  overview: {
    totalRevenue: "₹2.4Cr",
    totalSchools: 1247,
    totalUsers: 89432,
    avgUsersPerSchool: 72,
    monthlyGrowth: 18.5,
    churnRate: 2.3
  },
  revenueByPlan: [
    { plan: "Premium", revenue: 1200000, schools: 342, percentage: 50 },
    { plan: "Standard", revenue: 800000, schools: 567, percentage: 33.3 },
    { plan: "Basic", revenue: 400000, schools: 338, percentage: 16.7 }
  ],
  userEngagement: {
    dailyActiveUsers: 45678,
    weeklyActiveUsers: 67890,
    monthlyActiveUsers: 89432,
    avgSessionDuration: "24 min",
    bounceRate: "12.5%"
  },
  geographicData: [
    { state: "Maharashtra", schools: 234, users: 16890, revenue: 450000 },
    { state: "Delhi", schools: 189, users: 13567, revenue: 380000 },
    { state: "Karnataka", schools: 156, users: 11234, revenue: 320000 },
    { state: "Tamil Nadu", schools: 143, users: 10987, revenue: 290000 },
    { state: "Gujarat", schools: 128, users: 9876, revenue: 260000 }
  ]
}

export default function SuperAdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [loading, setLoading] = useState(false)

  const exportData = () => {
    setLoading(true)
    // Simulate export
    setTimeout(() => {
      setLoading(false)
      alert('Analytics data exported successfully!')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Platform Analytics
          </h1>
          <p className="text-gray-600 text-lg">Comprehensive insights across all schools</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => setTimeRange('7d')} 
                  className={timeRange === '7d' ? 'bg-purple-50 border-purple-300' : ''}>
            7 Days
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('30d')}
                  className={timeRange === '30d' ? 'bg-purple-50 border-purple-300' : ''}>
            30 Days
          </Button>
          <Button variant="outline" onClick={() => setTimeRange('90d')}
                  className={timeRange === '90d' ? 'bg-purple-50 border-purple-300' : ''}>
            90 Days
          </Button>
          <Button onClick={exportData} disabled={loading}
                  className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Download className="h-4 w-4 mr-2" />
            {loading ? 'Exporting...' : 'Export Data'}
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
            <IndianRupee className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.overview.totalRevenue}</div>
            <p className="text-xs text-white/80">+{analyticsData.overview.monthlyGrowth}% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Active Schools</CardTitle>
            <Building2 className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.overview.totalSchools.toLocaleString()}</div>
            <p className="text-xs text-white/80">Avg {analyticsData.overview.avgUsersPerSchool} users per school</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
            <Users className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analyticsData.overview.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-white/80">Churn rate: {analyticsData.overview.churnRate}%</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Plan */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span>Revenue by Plan</span>
            </CardTitle>
            <CardDescription>Distribution of revenue across subscription plans</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.revenueByPlan.map((plan, index) => (
                <div key={plan.plan} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${
                      index === 0 ? 'bg-purple-500' : 
                      index === 1 ? 'bg-blue-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium">{plan.plan}</p>
                      <p className="text-sm text-gray-500">{plan.schools} schools</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{(plan.revenue / 100000).toFixed(1)}L</p>
                    <p className="text-sm text-gray-500">{plan.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-green-600" />
              <span>User Engagement</span>
            </CardTitle>
            <CardDescription>Platform usage and engagement metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Daily Active Users</span>
                <span className="font-bold">{analyticsData.userEngagement.dailyActiveUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Weekly Active Users</span>
                <span className="font-bold">{analyticsData.userEngagement.weeklyActiveUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Active Users</span>
                <span className="font-bold">{analyticsData.userEngagement.monthlyActiveUsers.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Session Duration</span>
                <span className="font-bold">{analyticsData.userEngagement.avgSessionDuration}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Bounce Rate</span>
                <span className="font-bold">{analyticsData.userEngagement.bounceRate}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <span>Geographic Distribution</span>
          </CardTitle>
          <CardDescription>Schools and users distribution across states</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">State</th>
                  <th className="text-right py-2">Schools</th>
                  <th className="text-right py-2">Users</th>
                  <th className="text-right py-2">Revenue</th>
                  <th className="text-right py-2">Avg Revenue/School</th>
                </tr>
              </thead>
              <tbody>
                {analyticsData.geographicData.map((state, index) => (
                  <tr key={state.state} className="border-b">
                    <td className="py-3 font-medium">{state.state}</td>
                    <td className="text-right py-3">{state.schools}</td>
                    <td className="text-right py-3">{state.users.toLocaleString()}</td>
                    <td className="text-right py-3">₹{(state.revenue / 100000).toFixed(1)}L</td>
                    <td className="text-right py-3">₹{Math.round(state.revenue / state.schools).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <LineChart className="h-5 w-5 text-orange-600" />
              <span>Revenue Trend</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Revenue trend chart</p>
                <p className="text-sm text-gray-400">Chart integration pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-red-600" />
              <span>User Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">User growth chart</p>
                <p className="text-sm text-gray-400">Chart integration pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}