"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Download, FileText, BarChart3, Calendar, Filter,
  IndianRupee, TrendingUp, Users, PieChart
} from "lucide-react"

interface ReportData {
  totalCollection: number
  monthlyCollection: number
  pendingAmount: number
  collectionByClass: { class: string; amount: number }[]
  collectionByMonth: { month: string; amount: number }[]
  feeTypeBreakdown: { type: string; amount: number; percentage: number }[]
  defaultersList: { studentName: string; class: string; amount: number; daysOverdue: number }[]
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedReport, setSelectedReport] = useState('overview')

  useEffect(() => {
    fetchReportData()
  }, [dateRange])

  const fetchReportData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/reports?startDate=${dateRange.startDate}&endDate=${dateRange.endDate}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Failed to fetch report data:', error)
      // Mock data
      setReportData({
        totalCollection: 2450000,
        monthlyCollection: 185000,
        pendingAmount: 125000,
        collectionByClass: [
          { class: '10', amount: 450000 },
          { class: '9', amount: 420000 },
          { class: '11', amount: 380000 },
          { class: '12', amount: 350000 }
        ],
        collectionByMonth: [
          { month: 'Jan', amount: 200000 },
          { month: 'Feb', amount: 185000 },
          { month: 'Mar', amount: 220000 },
          { month: 'Apr', amount: 195000 }
        ],
        feeTypeBreakdown: [
          { type: 'Tuition Fee', amount: 1800000, percentage: 73.5 },
          { type: 'Transport Fee', amount: 400000, percentage: 16.3 },
          { type: 'Library Fee', amount: 150000, percentage: 6.1 },
          { type: 'Lab Fee', amount: 100000, percentage: 4.1 }
        ],
        defaultersList: [
          { studentName: 'Rahul Sharma', class: '10-A', amount: 15000, daysOverdue: 15 },
          { studentName: 'Priya Singh', class: '9-B', amount: 12000, daysOverdue: 8 },
          { studentName: 'Amit Kumar', class: '11-A', amount: 18000, daysOverdue: 22 }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/reports/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reportType: selectedReport,
          format,
          dateRange
        })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${selectedReport}_report_${new Date().toISOString().split('T')[0]}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to export report')
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed')
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
          <h1 className="text-3xl font-bold tracking-tight">Financial Reports</h1>
          <p className="text-muted-foreground">Generate and analyze financial reports</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="mr-2 h-4 w-4" />
            Export Excel
          </Button>
          <Button onClick={() => exportReport('pdf')}>
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div>
              <label className="block text-sm font-medium mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="overview">Overview</option>
                <option value="collection">Collection Report</option>
                <option value="defaulters">Defaulters Report</option>
                <option value="class_wise">Class-wise Report</option>
                <option value="fee_type">Fee Type Report</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <Input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">End Date</label>
              <Input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              />
            </div>
            
            <div className="flex items-end">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Apply Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collection</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData?.totalCollection.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData?.monthlyCollection.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{reportData?.pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Collection by Class */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Collection by Class</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.collectionByClass.map((item) => (
                <div key={item.class} className="flex items-center justify-between">
                  <span className="text-sm font-medium">Class {item.class}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(item.amount / (reportData?.totalCollection || 1)) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold">₹{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fee Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <PieChart className="h-5 w-5" />
              <span>Fee Type Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reportData?.feeTypeBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">{item.percentage}%</span>
                    <span className="text-sm font-bold">₹{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Collection Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Monthly Collection Trend</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {reportData?.collectionByMonth.map((item) => (
              <div key={item.month} className="text-center p-4 border rounded-lg">
                <p className="text-sm text-gray-600">{item.month}</p>
                <p className="text-lg font-bold">₹{item.amount.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Defaulters List */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Defaulters</CardTitle>
          <CardDescription>Students with overdue payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Student Name</th>
                  <th className="text-left py-3 px-4">Class</th>
                  <th className="text-left py-3 px-4">Pending Amount</th>
                  <th className="text-left py-3 px-4">Days Overdue</th>
                  <th className="text-left py-3 px-4">Action</th>
                </tr>
              </thead>
              <tbody>
                {reportData?.defaultersList.map((defaulter, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{defaulter.studentName}</td>
                    <td className="py-3 px-4">{defaulter.class}</td>
                    <td className="py-3 px-4 text-red-600 font-bold">₹{defaulter.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        defaulter.daysOverdue > 30 ? 'bg-red-100 text-red-800' :
                        defaulter.daysOverdue > 15 ? 'bg-orange-100 text-orange-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {defaulter.daysOverdue} days
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <Button size="sm" variant="outline">
                        Send Notice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}