"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/hooks/useNavigation"
import { superAdminAPI } from "@/lib/api/super-admin"
import { 
  Building2, Users, IndianRupee, TrendingUp, 
  Globe, Activity, ArrowUp, ArrowDown, Crown, Zap, School, AlertCircle 
} from "lucide-react"

interface DashboardData {
  analytics: {
    overview: {
      totalSchools: number
      activeSchools: number
      totalUsers: number
      totalRevenue: number
      monthlyRevenue: number
    }
    usersByRole: Array<{ role: string; count: number }>
    revenueByPlan: Array<{ plan: string; schools: number; revenue: number }>
  }
  recentSchools: Array<{
    id: string
    name: string
    location: string
    status: string
    students: number
    selectedPackage: string
    joinedDate: string
  }>
}

export default function SuperAdminDashboard() {
  const navigation = useNavigation()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await superAdminAPI.getDashboardOverview()
        setDashboardData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err)
        setError('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  const { analytics } = dashboardData || { analytics: { overview: {}, usersByRole: [], revenueByPlan: [] } }
  const recentSchools = dashboardData?.recentSchools || []

  const platformStats = [
    {
      title: "Total Schools",
      value: (analytics.overview as any)?.totalSchools?.toString() || "0",
      change: "+23%",
      trend: "up",
      icon: Building2,
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: (analytics.overview as any)?.totalUsers?.toLocaleString() || "0",
      change: "+15%",
      trend: "up", 
      icon: Users,
      color: "text-green-600"
    },
    {
      title: "Monthly Revenue",
      value: `₹${(((analytics.overview as any)?.monthlyRevenue || 0) / 100000).toFixed(1)}L`,
      change: "+18%",
      trend: "up",
      icon: IndianRupee,
      color: "text-purple-600"
    },
    {
      title: "Platform Uptime",
      value: "99.9%",
      change: "+0.1%",
      trend: "up",
      icon: Activity,
      color: "text-orange-600"
    }
  ]

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Crown className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Platform Overview</h1>
          </div>
          <p className="text-gray-600 text-sm">Manage your entire EduVerse ecosystem</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50 h-9 px-3 text-sm">
            <Globe className="h-4 w-4 mr-2" />
            Analytics
          </Button>
          <Button 
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 h-9 px-3 text-sm mr-2"
            onClick={() => navigation.navigateToSchoolRegister()}
          >
            <School className="h-4 w-4 mr-2" />
            Register School
          </Button>
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-9 px-3 text-sm"
            onClick={() => navigation.navigateToAddSchool()}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Manage Schools
          </Button>
        </div>
      </div>

      {/* Compact Platform Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {platformStats.map((stat, index) => (
          <Card key={stat.title} className={`relative overflow-hidden border-0 shadow-lg ${
            index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' :
            index === 1 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' :
            index === 2 ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white' :
            'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
          }`}>
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-16 w-16 rounded-full bg-white/10"></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-6 w-6 text-white" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{stat.value}</div>
              <div className="flex items-center text-xs text-white/80">
                {stat.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 text-white mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 text-white mr-1" />
                )}
                <span className="text-white font-medium">
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Schools */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Recent Registrations</CardTitle>
            <CardDescription className="text-xs">Latest schools joined</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSchools.length > 0 ? (
              <div className="space-y-3">
                {recentSchools.slice(0, 4).map((school, index) => (
                  <div key={school.id || index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{school.name}</p>
                        <p className="text-xs text-gray-500">{school.location} • {school.students} students</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        school.status === 'Active' ? 'bg-green-100 text-green-800' :
                        school.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        school.status === 'Trial' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {school.selectedPackage || school.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No schools registered yet</p>
                <Button onClick={() => navigation.navigateToSchoolRegister()}>
                  Register First School
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Chart Placeholder */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Revenue Trends</CardTitle>
            <CardDescription className="text-xs">Monthly growth</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Revenue chart</p>
                <p className="text-xs text-gray-400">Coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Quick Actions */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Zap className="h-5 w-5 text-purple-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription className="text-xs">Platform administration</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-16 flex-col border-purple-200 hover:bg-purple-50 hover:border-purple-300 text-xs"
              onClick={() => navigation.navigateToSchools()}
            >
              <Building2 className="h-6 w-6 mb-1 text-purple-600" />
              <span className="font-medium">Schools</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col border-green-200 hover:bg-green-50 hover:border-green-300 text-xs">
              <Users className="h-6 w-6 mb-1 text-green-600" />
              <span className="font-medium">Users</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col border-blue-200 hover:bg-blue-50 hover:border-blue-300 text-xs">
              <IndianRupee className="h-6 w-6 mb-1 text-blue-600" />
              <span className="font-medium">Billing</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-xs">
              <Globe className="h-6 w-6 mb-1 text-orange-600" />
              <span className="font-medium">Health</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}