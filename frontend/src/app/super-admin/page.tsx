"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, Users, IndianRupee, TrendingUp, 
  Globe, Activity, ArrowUp, ArrowDown, Crown, Zap 
} from "lucide-react"

const platformStats = [
  {
    title: "Total Schools",
    value: "1,247",
    change: "+23%",
    trend: "up",
    icon: Building2,
    color: "text-blue-600"
  },
  {
    title: "Active Users",
    value: "89,432",
    change: "+15%",
    trend: "up", 
    icon: Users,
    color: "text-green-600"
  },
  {
    title: "Monthly Revenue",
    value: "₹45.2L",
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

const recentSchools = [
  { name: "Delhi Public School", location: "Mumbai", students: 2847, status: "Active", plan: "Premium" },
  { name: "Ryan International", location: "Delhi", students: 1923, status: "Active", plan: "Standard" },
  { name: "Kendriya Vidyalaya", location: "Bangalore", students: 3421, status: "Active", plan: "Premium" },
  { name: "DAV Public School", location: "Chennai", students: 1567, status: "Trial", plan: "Trial" }
]

export default function SuperAdminDashboard() {
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
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 h-9 px-3 text-sm"
            onClick={() => window.location.href = '/super-admin/schools/add'}
          >
            <Building2 className="h-4 w-4 mr-2" />
            Add School
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
            <div className="space-y-3">
              {recentSchools.map((school, index) => (
                <div key={index} className="flex items-center justify-between">
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
                      school.status === 'Trial' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {school.plan}
                    </div>
                  </div>
                </div>
              ))}
            </div>
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
              onClick={() => window.location.href = '/super-admin/schools'}
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