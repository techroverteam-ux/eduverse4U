"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  CreditCard, Download, Calendar, CheckCircle, 
  Clock, AlertCircle, IndianRupee, Receipt, User, Users
} from "lucide-react"

interface FeeRecord {
  id: string
  feeType: string
  amount: number
  dueDate: string
  paidDate?: string
  status: 'paid' | 'pending' | 'overdue'
  academicYear: string
  term: string
  paymentMethod?: string
  transactionId?: string
}

const mockFeeRecords: FeeRecord[] = [
  {
    id: '1',
    feeType: 'Tuition Fee',
    amount: 15000,
    dueDate: '2024-01-15',
    paidDate: '2024-01-10',
    status: 'paid',
    academicYear: '2024-25',
    term: 'Term 1',
    paymentMethod: 'Online',
    transactionId: 'TXN123456789'
  },
  {
    id: '2',
    feeType: 'Library Fee',
    amount: 2000,
    dueDate: '2024-01-15',
    paidDate: '2024-01-10',
    status: 'paid',
    academicYear: '2024-25',
    term: 'Term 1',
    paymentMethod: 'Cash',
    transactionId: 'TXN123456790'
  },
  {
    id: '3',
    feeType: 'Sports Fee',
    amount: 3000,
    dueDate: '2024-02-15',
    status: 'pending',
    academicYear: '2024-25',
    term: 'Term 2'
  },
  {
    id: '4',
    feeType: 'Lab Fee',
    amount: 2500,
    dueDate: '2024-01-30',
    status: 'overdue',
    academicYear: '2024-25',
    term: 'Term 1'
  }
]

export default function FeesPage() {
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(mockFeeRecords)
  const [loading, setLoading] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<FeeRecord | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [children, setChildren] = useState<any[]>([])
  const [selectedChild, setSelectedChild] = useState<string>('')

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      const userData = JSON.parse(user)
      setCurrentUser(userData)
      
      if (userData.role === 'parent') {
        fetchParentData()
      }
    }
  }, [])

  const fetchParentData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/parents/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || [])
        if (data.children && data.children.length > 0) {
          setSelectedChild(data.children[0].student.id)
          fetchChildFees(data.children[0].student.id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch parent data:', error)
      setChildren([])
    }
  }

  const fetchChildFees = async (childId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/parents/children/${childId}/fees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFeeRecords(data)
      } else {
        // Use mock data if API fails
        setFeeRecords(mockFeeRecords)
      }
    } catch (error) {
      console.error('Failed to fetch child fees:', error)
      setFeeRecords(mockFeeRecords)
    }
  }

  const handleChildChange = (childId: string) => {
    setSelectedChild(childId)
    fetchChildFees(childId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'overdue': return <AlertCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateTotals = () => {
    const totalAmount = feeRecords.reduce((sum, record) => sum + record.amount, 0)
    const paidAmount = feeRecords
      .filter(record => record.status === 'paid')
      .reduce((sum, record) => sum + record.amount, 0)
    const pendingAmount = totalAmount - paidAmount
    
    return { totalAmount, paidAmount, pendingAmount }
  }

  const { totalAmount, paidAmount, pendingAmount } = calculateTotals()

  const handlePayment = (recordId: string) => {
    // Simulate payment process
    setFeeRecords(prev => 
      prev.map(record => 
        record.id === recordId 
          ? { 
              ...record, 
              status: 'paid' as const, 
              paidDate: new Date().toISOString().split('T')[0],
              paymentMethod: 'Online',
              transactionId: `TXN${Date.now()}`
            }
          : record
      )
    )
    alert('Payment successful!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {currentUser?.role === 'parent' ? 'Children Fee Management' : 'Fee Management'}
          </h1>
          <p className="text-muted-foreground">
            {currentUser?.role === 'parent' ? 
              'Monitor and manage your children\'s fee payments' : 
              'View and manage your fee payments'
            }
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Receipt
        </Button>
      </div>

      {/* Child Selection for Parents */}
      {currentUser?.role === 'parent' && children.length > 1 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex space-x-2">
              {children.map((child) => (
                <Button
                  key={child.student.id}
                  variant={selectedChild === child.student.id ? "default" : "outline"}
                  onClick={() => handleChildChange(child.student.id)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {child.student.user.firstName} {child.student.user.lastName}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Fee Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
            <IndianRupee className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Academic Year 2024-25
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₹{paidAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {((paidAmount / totalAmount) * 100).toFixed(1)}% completed
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Amount</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">₹{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {feeRecords.filter(r => r.status !== 'paid').length} pending payments
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Fee Records */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Details</CardTitle>
          <CardDescription>All fee payments and pending amounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeRecords.map((record) => (
              <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(record.status)}
                  <div>
                    <h3 className="font-semibold">{record.feeType}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>₹{record.amount.toLocaleString()}</span>
                      <span>•</span>
                      <span>{record.term}</span>
                      <span>•</span>
                      <span>Due: {new Date(record.dueDate).toLocaleDateString()}</span>
                      {record.paidDate && (
                        <>
                          <span>•</span>
                          <span>Paid: {new Date(record.paidDate).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                    {record.transactionId && (
                      <div className="text-xs text-gray-500 mt-1">
                        Transaction ID: {record.transactionId}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                    {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                  </span>
                  {record.status === 'paid' ? (
                    <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                      <Receipt className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handlePayment(record.id)}>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Pay Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Available payment options</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-semibold">Online Payment</h3>
                <p className="text-sm text-gray-600">Credit/Debit Card, UPI, Net Banking</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <IndianRupee className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-semibold">Cash Payment</h3>
                <p className="text-sm text-gray-600">Pay at school office</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <Receipt className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-semibold">Bank Transfer</h3>
                <p className="text-sm text-gray-600">Direct bank transfer</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center mb-6">
              <Receipt className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Payment Receipt</h2>
            </div>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Fee Type:</span>
                <span>{selectedRecord.feeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span>₹{selectedRecord.amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Date:</span>
                <span>{selectedRecord.paidDate ? new Date(selectedRecord.paidDate).toLocaleDateString() : 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{selectedRecord.paymentMethod || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Transaction ID:</span>
                <span>{selectedRecord.transactionId || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Academic Year:</span>
                <span>{selectedRecord.academicYear}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Term:</span>
                <span>{selectedRecord.term}</span>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedRecord(null)} className="flex-1">
                Close
              </Button>
              <Button className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}