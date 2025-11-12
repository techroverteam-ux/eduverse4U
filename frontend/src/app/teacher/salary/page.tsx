"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  IndianRupee, Clock, TrendingUp, Calendar, 
  CheckCircle, AlertCircle, Download, Eye
} from "lucide-react"

interface SalaryData {
  basicSalary: number
  allowances: {
    hra: number
    da: number
    transport: number
    medical: number
    other: number
  }
  deductions: {
    pf: number
    esi: number
    tax: number
    other: number
  }
  performance: {
    bonus: number
    penalty: number
  }
  attendance: {
    totalDays: number
    presentDays: number
    absentDays: number
    leaveDays: number
    rate: number
  }
  classes: {
    scheduled: number
    completed: number
    missed: number
    ratePerClass: number
  }
  netSalary: number
  status: 'pending' | 'processed' | 'paid'
  payDate?: string
}

interface SalaryHistory {
  id: string
  month: string
  year: number
  netSalary: number
  status: 'paid' | 'pending'
  payDate?: string
}

export default function TeacherSalaryPage() {
  const [currentSalary, setCurrentSalary] = useState<SalaryData | null>(null)
  const [salaryHistory, setSalaryHistory] = useState<SalaryHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchSalaryData()
    fetchSalaryHistory()
  }, [selectedMonth, selectedYear])

  const fetchSalaryData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/salary/current?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCurrentSalary(data)
      }
    } catch (error) {
      console.error('Failed to fetch salary data:', error)
      // Mock data
      setCurrentSalary({
        basicSalary: 40000,
        allowances: {
          hra: 8000,
          da: 4000,
          transport: 2000,
          medical: 1500,
          other: 500
        },
        deductions: {
          pf: 4800,
          esi: 750,
          tax: 3200,
          other: 200
        },
        performance: {
          bonus: 2000,
          penalty: 0
        },
        attendance: {
          totalDays: 22,
          presentDays: 20,
          absentDays: 2,
          leaveDays: 0,
          rate: 90.9
        },
        classes: {
          scheduled: 88,
          completed: 82,
          missed: 6,
          ratePerClass: 500
        },
        netSalary: 45050,
        status: 'processed',
        payDate: '2024-12-05'
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchSalaryHistory = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/salary/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSalaryHistory(data)
      }
    } catch (error) {
      console.error('Failed to fetch salary history:', error)
      // Mock data
      setSalaryHistory([
        { id: '1', month: 'November', year: 2024, netSalary: 44500, status: 'paid', payDate: '2024-11-05' },
        { id: '2', month: 'October', year: 2024, netSalary: 43800, status: 'paid', payDate: '2024-10-05' },
        { id: '3', month: 'September', year: 2024, netSalary: 45200, status: 'paid', payDate: '2024-09-05' }
      ])
    }
  }

  const downloadPayslip = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/salary/payslip?month=${selectedMonth}&year=${selectedYear}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `payslip_${selectedMonth + 1}_${selectedYear}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Download failed:', error)
      alert('Download failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'processed': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

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
          <h1 className="text-3xl font-bold tracking-tight">Salary Management</h1>
          <p className="text-muted-foreground">View your salary details and payment history</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            {months.map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
          </select>
          <Button onClick={downloadPayslip}>
            <Download className="mr-2 h-4 w-4" />
            Download Payslip
          </Button>
        </div>
      </div>

      {currentSalary && (
        <>
          {/* Salary Overview */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
                <IndianRupee className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{currentSalary.netSalary.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {months[selectedMonth]} {selectedYear}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
                <CheckCircle className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{currentSalary.attendance.rate.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  {currentSalary.attendance.presentDays}/{currentSalary.attendance.totalDays} days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Classes Completed</CardTitle>
                <Clock className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {currentSalary.classes.completed}/{currentSalary.classes.scheduled}
                </div>
                <p className="text-xs text-muted-foreground">
                  {((currentSalary.classes.completed / currentSalary.classes.scheduled) * 100).toFixed(1)}% completion
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <AlertCircle className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className={`inline-flex px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(currentSalary.status)}`}>
                  {currentSalary.status}
                </div>
                {currentSalary.payDate && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Paid on {new Date(currentSalary.payDate).toLocaleDateString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Salary Breakdown */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Basic Salary</span>
                    <span className="font-medium">₹{currentSalary.basicSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HRA</span>
                    <span className="font-medium">₹{currentSalary.allowances.hra.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>DA</span>
                    <span className="font-medium">₹{currentSalary.allowances.da.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport Allowance</span>
                    <span className="font-medium">₹{currentSalary.allowances.transport.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Medical Allowance</span>
                    <span className="font-medium">₹{currentSalary.allowances.medical.toLocaleString()}</span>
                  </div>
                  {currentSalary.performance.bonus > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Performance Bonus</span>
                      <span className="font-medium">₹{currentSalary.performance.bonus.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Earnings</span>
                    <span>₹{(
                      currentSalary.basicSalary + 
                      Object.values(currentSalary.allowances).reduce((a, b) => a + b, 0) +
                      currentSalary.performance.bonus
                    ).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deductions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Provident Fund</span>
                    <span className="font-medium">₹{currentSalary.deductions.pf.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ESI</span>
                    <span className="font-medium">₹{currentSalary.deductions.esi.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Income Tax</span>
                    <span className="font-medium">₹{currentSalary.deductions.tax.toLocaleString()}</span>
                  </div>
                  {currentSalary.deductions.other > 0 && (
                    <div className="flex justify-between">
                      <span>Other Deductions</span>
                      <span className="font-medium">₹{currentSalary.deductions.other.toLocaleString()}</span>
                    </div>
                  )}
                  {currentSalary.performance.penalty > 0 && (
                    <div className="flex justify-between text-red-600">
                      <span>Penalty</span>
                      <span className="font-medium">₹{currentSalary.performance.penalty.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Deductions</span>
                    <span>₹{(
                      Object.values(currentSalary.deductions).reduce((a, b) => a + b, 0) +
                      currentSalary.performance.penalty
                    ).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Your performance indicators for salary calculation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div>
                  <h4 className="font-medium mb-3">Attendance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Present Days</span>
                      <span>{currentSalary.attendance.presentDays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Absent Days</span>
                      <span>{currentSalary.attendance.absentDays}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Leave Days</span>
                      <span>{currentSalary.attendance.leaveDays}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${currentSalary.attendance.rate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Classes</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Scheduled</span>
                      <span>{currentSalary.classes.scheduled}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Completed</span>
                      <span>{currentSalary.classes.completed}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Missed</span>
                      <span>{currentSalary.classes.missed}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(currentSalary.classes.completed / currentSalary.classes.scheduled) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Earnings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Rate per Class</span>
                      <span>₹{currentSalary.classes.ratePerClass}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Class Earnings</span>
                      <span>₹{(currentSalary.classes.completed * currentSalary.classes.ratePerClass).toLocaleString()}</span>
                    </div>
                    {currentSalary.performance.bonus > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Bonus</span>
                        <span>₹{currentSalary.performance.bonus.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Salary History */}
      <Card>
        <CardHeader>
          <CardTitle>Salary History</CardTitle>
          <CardDescription>Your previous salary payments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salaryHistory.map((salary) => (
              <div key={salary.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{salary.month} {salary.year}</p>
                  {salary.payDate && (
                    <p className="text-sm text-gray-500">
                      Paid on {new Date(salary.payDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-bold">₹{salary.netSalary.toLocaleString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(salary.status)}`}>
                    {salary.status}
                  </span>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}