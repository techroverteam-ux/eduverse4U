"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, CreditCard, TrendingUp, TrendingDown, Filter,
  Calendar, User, IndianRupee, ArrowUpRight, ArrowDownLeft,
  Download, Eye, RefreshCw
} from "lucide-react"

interface Transaction {
  id: string
  type: 'fee_payment' | 'refund' | 'adjustment' | 'late_fee' | 'discount'
  amount: number
  description: string
  studentName: string
  admissionNumber: string
  class: string
  section: string
  paymentMethod?: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque'
  receiptNumber?: string
  referenceNumber?: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  createdAt: string
  processedBy: string
  remarks?: string
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    paymentMethod: 'all',
    dateRange: {
      startDate: '',
      endDate: ''
    }
  })
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalAmount: 0,
    todayTransactions: 0,
    todayAmount: 0
  })

  useEffect(() => {
    fetchTransactions()
    fetchStats()
  }, [])

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/transactions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTransactions(data)
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
      // Mock data
      setTransactions([
        {
          id: '1',
          type: 'fee_payment',
          amount: 15000,
          description: 'Quarterly tuition fee payment',
          studentName: 'Rahul Sharma',
          admissionNumber: 'STU001',
          class: '10',
          section: 'A',
          paymentMethod: 'upi',
          receiptNumber: 'RCP001',
          referenceNumber: 'UPI123456789',
          status: 'completed',
          createdAt: '2024-12-01T10:30:00Z',
          processedBy: 'John Doe',
          remarks: 'Payment received via UPI'
        },
        {
          id: '2',
          type: 'refund',
          amount: -2000,
          description: 'Transport fee refund',
          studentName: 'Priya Singh',
          admissionNumber: 'STU002',
          class: '9',
          section: 'B',
          paymentMethod: 'bank_transfer',
          referenceNumber: 'REF789012345',
          status: 'completed',
          createdAt: '2024-12-02T14:15:00Z',
          processedBy: 'Jane Smith',
          remarks: 'Refund for unused transport service'
        },
        {
          id: '3',
          type: 'late_fee',
          amount: 500,
          description: 'Late fee penalty',
          studentName: 'Amit Kumar',
          admissionNumber: 'STU003',
          class: '11',
          section: 'A',
          paymentMethod: 'cash',
          receiptNumber: 'RCP003',
          status: 'completed',
          createdAt: '2024-12-03T09:45:00Z',
          processedBy: 'John Doe',
          remarks: 'Late fee for overdue payment'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/transactions/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      // Mock stats
      setStats({
        totalTransactions: 156,
        totalAmount: 2450000,
        todayTransactions: 8,
        todayAmount: 45000
      })
    }
  }

  const exportTransactions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/transactions/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filters })
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `transactions_${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Export failed:', error)
      alert('Export failed')
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'fee_payment': return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case 'refund': return <ArrowDownLeft className="h-4 w-4 text-red-600" />
      case 'adjustment': return <RefreshCw className="h-4 w-4 text-blue-600" />
      case 'late_fee': return <TrendingUp className="h-4 w-4 text-orange-600" />
      case 'discount': return <TrendingDown className="h-4 w-4 text-purple-600" />
      default: return <CreditCard className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'fee_payment': return 'bg-green-100 text-green-800'
      case 'refund': return 'bg-red-100 text-red-800'
      case 'adjustment': return 'bg-blue-100 text-blue-800'
      case 'late_fee': return 'bg-orange-100 text-orange-800'
      case 'discount': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.referenceNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = filters.type === 'all' || transaction.type === filters.type
    const matchesStatus = filters.status === 'all' || transaction.status === filters.status
    const matchesPaymentMethod = filters.paymentMethod === 'all' || transaction.paymentMethod === filters.paymentMethod
    
    const matchesDate = 
      (!filters.dateRange.startDate || transaction.createdAt >= filters.dateRange.startDate) &&
      (!filters.dateRange.endDate || transaction.createdAt <= filters.dateRange.endDate)
    
    return matchesSearch && matchesType && matchesStatus && matchesPaymentMethod && matchesDate
  })

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
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">View and manage all financial transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={fetchTransactions}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <CreditCard className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Net amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Transactions</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayTransactions}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Amount</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.todayAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="fee_payment">Fee Payment</option>
              <option value="refund">Refund</option>
              <option value="adjustment">Adjustment</option>
              <option value="late_fee">Late Fee</option>
              <option value="discount">Discount</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            
            <Input
              type="date"
              value={filters.dateRange.startDate}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, startDate: e.target.value }
              }))}
              placeholder="Start Date"
            />
            
            <Input
              type="date"
              value={filters.dateRange.endDate}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                dateRange: { ...prev.dateRange, endDate: e.target.value }
              }))}
              placeholder="End Date"
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions List */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 rounded-full bg-gray-100">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{transaction.description}</h3>
                      <p className="text-sm text-gray-500">
                        {transaction.studentName} • {transaction.admissionNumber} • Class {transaction.class}-{transaction.section}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleString()} • Processed by {transaction.processedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      {transaction.paymentMethod && (
                        <span>Payment: {transaction.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                      )}
                      {transaction.receiptNumber && (
                        <span>Receipt: {transaction.receiptNumber}</span>
                      )}
                      {transaction.referenceNumber && (
                        <span>Ref: {transaction.referenceNumber}</span>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </Button>
                      {transaction.receiptNumber && (
                        <Button size="sm" variant="outline">
                          <Download className="mr-2 h-4 w-4" />
                          Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {transaction.remarks && (
                    <div className="mt-2 p-2 bg-gray-50 rounded text-sm">
                      <strong>Remarks:</strong> {transaction.remarks}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}