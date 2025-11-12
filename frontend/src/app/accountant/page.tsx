"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IndianRupee, TrendingUp, Users, Calendar, 
  CreditCard, AlertCircle, CheckCircle, Clock,
  FileText, BarChart3, Download, Filter
} from "lucide-react"

interface FinancialStats {
  totalRevenue: number
  monthlyRevenue: number
  pendingFees: number
  collectedToday: number
  totalStudents: number
  paidStudents: number
  pendingStudents: number
  overdueStudents: number
}

interface RecentTransaction {
  id: string
  studentName: string
  amount: number
  type: 'fee_payment' | 'refund' | 'adjustment'
  status: 'completed' | 'pending' | 'failed'
  date: string
  receiptNumber?: string
}

export default function AccountantDashboard() {
  const [stats, setStats] = useState<FinancialStats | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token')
      const [statsResponse, transactionsResponse] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/dashboard/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/transactions/recent`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }

      if (transactionsResponse.ok) {
        const transactionsData = await transactionsResponse.json()
        setRecentTransactions(transactionsData)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      // Mock data for demo
      setStats({
        totalRevenue: 2450000,
        monthlyRevenue: 185000,
        pendingFees: 125000,
        collectedToday: 15000,
        totalStudents: 850,
        paidStudents: 720,
        pendingStudents: 95,
        overdueStudents: 35
      })
      setRecentTransactions([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Accountant Dashboard</h1>
          <p className="text-muted-foreground">
            Financial overview and fee management
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <CreditCard className="mr-2 h-4 w-4" />
            Collect Fee
          </Button>
        </div>
      </div>

      {/* Financial Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Academic year 2024-25</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Collection</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.pendingFees.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{stats?.pendingStudents} students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Collection</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats?.collectedToday.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Collected today</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Payment Status */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Payment Status Overview</CardTitle>
            <CardDescription>Student fee payment distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm">Paid Students</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats?.paidStudents}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((stats?.paidStudents || 0) / (stats?.totalStudents || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm">Pending Students</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats?.pendingStudents}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((stats?.pendingStudents || 0) / (stats?.totalStudents || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm">Overdue Students</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">{stats?.overdueStudents}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({((stats?.overdueStudents || 0) / (stats?.totalStudents || 1) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common accounting tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <a href="/accountant/fee-collection">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Collect Fees
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/accountant/reports">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Reports
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/accountant/fee-structure">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  Manage Fee Structure
                </a>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <a href="/accountant/defaulters">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  View Defaulters
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest fee payments and transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{transaction.studentName}</p>
                      <p className="text-sm text-gray-500">
                        {transaction.receiptNumber && `Receipt: ${transaction.receiptNumber} • `}
                        {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">₹{transaction.amount.toLocaleString()}</p>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recent transactions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}