"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IndianRupee, TrendingUp, Calendar, Download, Filter, 
  CreditCard, Building2, Users, Receipt, AlertCircle,
  CheckCircle, Clock, XCircle, Eye, FileText, Send
} from "lucide-react"

interface BillingRecord {
  id: string
  schoolId: string
  schoolName: string
  plan: 'Basic' | 'Standard' | 'Premium'
  amount: number
  billingPeriod: string
  dueDate: string
  paidDate?: string
  status: 'Paid' | 'Pending' | 'Overdue' | 'Failed'
  paymentMethod: string
  invoiceNumber: string
  students: number
}

const mockBillingData: BillingRecord[] = [
  {
    id: '1',
    schoolId: '1',
    schoolName: 'Delhi Public School Mumbai',
    plan: 'Premium',
    amount: 125000,
    billingPeriod: 'January 2024',
    dueDate: '2024-01-31',
    paidDate: '2024-01-28',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2024-001',
    students: 2847
  },
  {
    id: '2',
    schoolId: '2',
    schoolName: 'Ryan International School Delhi',
    plan: 'Standard',
    amount: 85000,
    billingPeriod: 'January 2024',
    dueDate: '2024-01-31',
    status: 'Pending',
    paymentMethod: 'UPI',
    invoiceNumber: 'INV-2024-002',
    students: 1923
  },
  {
    id: '3',
    schoolId: '3',
    schoolName: 'Kendriya Vidyalaya Bangalore',
    plan: 'Premium',
    amount: 145000,
    billingPeriod: 'January 2024',
    dueDate: '2024-01-31',
    paidDate: '2024-01-30',
    status: 'Paid',
    paymentMethod: 'Credit Card',
    invoiceNumber: 'INV-2024-003',
    students: 3421
  },
  {
    id: '4',
    schoolId: '4',
    schoolName: 'DAV Public School Chennai',
    plan: 'Basic',
    amount: 45000,
    billingPeriod: 'January 2024',
    dueDate: '2024-01-25',
    status: 'Overdue',
    paymentMethod: 'Bank Transfer',
    invoiceNumber: 'INV-2024-004',
    students: 1567
  }
]

const revenueStats = {
  totalRevenue: 2400000,
  monthlyRevenue: 400000,
  pendingAmount: 130000,
  overdueAmount: 45000,
  paidInvoices: 1156,
  pendingInvoices: 67,
  overdueInvoices: 24
}

export default function SuperAdminBilling() {
  const [billingData, setBillingData] = useState<BillingRecord[]>(mockBillingData)
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord | null>(null)
  const [dateRange, setDateRange] = useState('current_month')

  const filteredData = billingData.filter(record => {
    const matchesStatus = filterStatus === 'all' || record.status === filterStatus
    const matchesPlan = filterPlan === 'all' || record.plan === filterPlan
    return matchesStatus && matchesPlan
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Overdue': return <AlertCircle className="h-4 w-4 text-red-600" />
      case 'Failed': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Overdue': return 'bg-red-100 text-red-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'Standard': return 'bg-blue-100 text-blue-800'
      case 'Basic': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportBillingData = () => {
    alert('Billing data exported successfully!')
  }

  const sendReminder = (recordId: string) => {
    alert(`Payment reminder sent for invoice ${recordId}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Billing & Revenue
          </h1>
          <p className="text-gray-600 text-lg">Manage platform billing and revenue tracking</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            This Month
          </Button>
          <Button onClick={exportBillingData}
                  className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Total Revenue</CardTitle>
            <IndianRupee className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(revenueStats.totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-white/80">All time revenue</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Monthly Revenue</CardTitle>
            <TrendingUp className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(revenueStats.monthlyRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-white/80">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Pending Amount</CardTitle>
            <Clock className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(revenueStats.pendingAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-white/80">{revenueStats.pendingInvoices} invoices</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white/90">Overdue Amount</CardTitle>
            <AlertCircle className="h-6 w-6 text-white" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₹{(revenueStats.overdueAmount / 1000).toFixed(0)}K</div>
            <p className="text-xs text-white/80">{revenueStats.overdueInvoices} invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Failed">Failed</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="last_3_months">Last 3 Months</option>
              <option value="last_6_months">Last 6 Months</option>
              <option value="current_year">Current Year</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Billing Table */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Records ({filteredData.length})</CardTitle>
          <CardDescription>Manage school billing and payment tracking</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">School</th>
                  <th className="text-left py-3 px-4">Plan</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Period</th>
                  <th className="text-left py-3 px-4">Due Date</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium">{record.schoolName}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {record.students.toLocaleString()} students
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(record.plan)}`}>
                        {record.plan}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-lg">₹{record.amount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">₹{Math.round(record.amount / record.students)} per student</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{record.billingPeriod}</div>
                      <div className="text-sm text-gray-500">{record.invoiceNumber}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-medium">{record.dueDate}</div>
                      {record.paidDate && (
                        <div className="text-sm text-green-600">Paid: {record.paidDate}</div>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(record.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRecord(record)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        {(record.status === 'Pending' || record.status === 'Overdue') && (
                          <Button variant="ghost" size="sm" onClick={() => sendReminder(record.id)}>
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue over time</CardDescription>
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
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Distribution of payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <span>Bank Transfer</span>
                </div>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span>UPI</span>
                </div>
                <span className="font-bold">35%</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <CreditCard className="h-4 w-4 text-purple-600" />
                  <span>Credit Card</span>
                </div>
                <span className="font-bold">20%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Billing Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Billing Details</h2>
              <Button variant="ghost" onClick={() => setSelectedRecord(null)}>
                ×
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">School Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">School:</span> {selectedRecord.schoolName}</div>
                    <div><span className="font-medium">Plan:</span> {selectedRecord.plan}</div>
                    <div><span className="font-medium">Students:</span> {selectedRecord.students.toLocaleString()}</div>
                    <div><span className="font-medium">Invoice:</span> {selectedRecord.invoiceNumber}</div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-3">Payment Information</h3>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Amount:</span> ₹{selectedRecord.amount.toLocaleString()}</div>
                    <div><span className="font-medium">Period:</span> {selectedRecord.billingPeriod}</div>
                    <div><span className="font-medium">Due Date:</span> {selectedRecord.dueDate}</div>
                    {selectedRecord.paidDate && (
                      <div><span className="font-medium">Paid Date:</span> {selectedRecord.paidDate}</div>
                    )}
                    <div><span className="font-medium">Method:</span> {selectedRecord.paymentMethod}</div>
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedRecord.status)}`}>
                        {selectedRecord.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedRecord(null)}>
                Close
              </Button>
              <Button variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Download Invoice
              </Button>
              {(selectedRecord.status === 'Pending' || selectedRecord.status === 'Overdue') && (
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                  <Send className="h-4 w-4 mr-2" />
                  Send Reminder
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}