"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, CreditCard, User, Calendar, IndianRupee,
  Receipt, CheckCircle, AlertCircle, Plus, Filter
} from "lucide-react"

interface Student {
  id: string
  admissionNumber: string
  user: {
    firstName: string
    lastName: string
  }
  class: string
  section: string
  feeStatus: {
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    dueDate: string
    status: 'paid' | 'partial' | 'pending' | 'overdue'
  }
  parent: {
    firstName: string
    lastName: string
    phone: string
  }
}

interface FeeStructure {
  id: string
  name: string
  amount: number
  type: 'monthly' | 'quarterly' | 'annual' | 'one_time'
  mandatory: boolean
}

export default function FeeCollectionPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [feeStructure, setFeeStructure] = useState<FeeStructure[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    remarks: '',
    feeTypes: [] as string[]
  })

  useEffect(() => {
    fetchStudents()
    fetchFeeStructure()
  }, [])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/students/fee-status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setStudents(data)
      }
    } catch (error) {
      console.error('Failed to fetch students:', error)
      // Mock data
      setStudents([
        {
          id: '1',
          admissionNumber: 'STU001',
          user: { firstName: 'Rahul', lastName: 'Sharma' },
          class: '10',
          section: 'A',
          feeStatus: {
            totalAmount: 25000,
            paidAmount: 15000,
            pendingAmount: 10000,
            dueDate: '2024-12-15',
            status: 'partial'
          },
          parent: { firstName: 'Suresh', lastName: 'Sharma', phone: '9876543210' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const fetchFeeStructure = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/fee-structure`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFeeStructure(data)
      }
    } catch (error) {
      console.error('Failed to fetch fee structure:', error)
      setFeeStructure([
        { id: '1', name: 'Tuition Fee', amount: 15000, type: 'quarterly', mandatory: true },
        { id: '2', name: 'Transport Fee', amount: 3000, type: 'quarterly', mandatory: false },
        { id: '3', name: 'Library Fee', amount: 1000, type: 'annual', mandatory: true }
      ])
    }
  }

  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/collect-fee`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          studentId: selectedStudent?.id,
          amount: parseFloat(paymentData.amount),
          paymentMethod: paymentData.paymentMethod,
          remarks: paymentData.remarks,
          feeTypes: paymentData.feeTypes
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`Payment collected successfully! Receipt: ${result.receiptNumber}`)
        setShowPaymentModal(false)
        setPaymentData({ amount: '', paymentMethod: 'cash', remarks: '', feeTypes: [] })
        fetchStudents()
      } else {
        alert('Failed to collect payment')
      }
    } catch (error) {
      console.error('Payment failed:', error)
      alert('Payment failed')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'partial': return 'bg-yellow-100 text-yellow-800'
      case 'pending': return 'bg-blue-100 text-blue-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredStudents = students.filter(student =>
    student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
          <h1 className="text-3xl font-bold tracking-tight">Fee Collection</h1>
          <p className="text-muted-foreground">Collect fees from students and generate receipts</p>
        </div>
        <Button onClick={() => window.location.href = '/accountant/receipts'}>
          <Receipt className="mr-2 h-4 w-4" />
          View Receipts
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Students List */}
      <Card>
        <CardHeader>
          <CardTitle>Students Fee Status ({filteredStudents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div key={student.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <User className="h-10 w-10 text-gray-400" />
                    <div>
                      <h3 className="font-semibold">
                        {student.user.firstName} {student.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {student.admissionNumber} • Class {student.class}-{student.section}
                      </p>
                      <p className="text-sm text-gray-500">
                        Parent: {student.parent.firstName} {student.parent.lastName} • {student.parent.phone}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.feeStatus.status)}`}>
                        {student.feeStatus.status}
                      </span>
                    </div>
                    <p className="text-sm">
                      <span className="font-medium">Pending: ₹{student.feeStatus.pendingAmount.toLocaleString()}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(student.feeStatus.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex space-x-4 text-sm">
                    <span>Total: ₹{student.feeStatus.totalAmount.toLocaleString()}</span>
                    <span>Paid: ₹{student.feeStatus.paidAmount.toLocaleString()}</span>
                    <span className="text-red-600">Pending: ₹{student.feeStatus.pendingAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.location.href = `/accountant/students/${student.id}/fee-history`}
                    >
                      View History
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student)
                        setPaymentData(prev => ({ ...prev, amount: student.feeStatus.pendingAmount.toString() }))
                        setShowPaymentModal(true)
                      }}
                      disabled={student.feeStatus.status === 'paid'}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Collect Fee
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      {showPaymentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Collect Fee Payment</h2>
            
            <div className="space-y-4">
              <div>
                <p className="font-medium">{selectedStudent.user.firstName} {selectedStudent.user.lastName}</p>
                <p className="text-sm text-gray-500">
                  {selectedStudent.admissionNumber} • Class {selectedStudent.class}-{selectedStudent.section}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <Input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="Enter amount"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select
                  value={paymentData.paymentMethod}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Fee Types</label>
                <div className="space-y-2">
                  {feeStructure.map((fee) => (
                    <label key={fee.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={paymentData.feeTypes.includes(fee.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPaymentData(prev => ({ ...prev, feeTypes: [...prev.feeTypes, fee.id] }))
                          } else {
                            setPaymentData(prev => ({ ...prev, feeTypes: prev.feeTypes.filter(id => id !== fee.id) }))
                          }
                        }}
                      />
                      <span className="text-sm">{fee.name} - ₹{fee.amount}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Remarks</label>
                <Input
                  value={paymentData.remarks}
                  onChange={(e) => setPaymentData(prev => ({ ...prev, remarks: e.target.value }))}
                  placeholder="Optional remarks"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowPaymentModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handlePayment} className="flex-1">
                Collect Payment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}