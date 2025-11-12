"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, Receipt, Download, Eye, Filter,
  Calendar, User, IndianRupee, FileText, Printer
} from "lucide-react"

interface ReceiptData {
  id: string
  receiptNumber: string
  studentName: string
  admissionNumber: string
  class: string
  section: string
  amount: number
  paymentMethod: 'cash' | 'card' | 'upi' | 'bank_transfer' | 'cheque'
  feeTypes: string[]
  paymentDate: string
  academicYear: string
  remarks?: string
  collectedBy: string
  status: 'active' | 'cancelled'
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<ReceiptData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  })
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptData | null>(null)
  const [showReceiptModal, setShowReceiptModal] = useState(false)

  useEffect(() => {
    fetchReceipts()
  }, [])

  const fetchReceipts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/receipts`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setReceipts(data)
      }
    } catch (error) {
      console.error('Failed to fetch receipts:', error)
      // Mock data
      setReceipts([
        {
          id: '1',
          receiptNumber: 'RCP001',
          studentName: 'Rahul Sharma',
          admissionNumber: 'STU001',
          class: '10',
          section: 'A',
          amount: 15000,
          paymentMethod: 'upi',
          feeTypes: ['Tuition Fee', 'Library Fee'],
          paymentDate: '2024-12-01',
          academicYear: '2024-25',
          remarks: 'Quarterly fee payment',
          collectedBy: 'John Doe',
          status: 'active'
        },
        {
          id: '2',
          receiptNumber: 'RCP002',
          studentName: 'Priya Singh',
          admissionNumber: 'STU002',
          class: '9',
          section: 'B',
          amount: 12000,
          paymentMethod: 'cash',
          feeTypes: ['Tuition Fee'],
          paymentDate: '2024-12-02',
          academicYear: '2024-25',
          collectedBy: 'Jane Smith',
          status: 'active'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const downloadReceipt = async (receiptId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/receipts/${receiptId}/download`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `receipt_${receiptId}.pdf`
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

  const printReceipt = (receipt: ReceiptData) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Receipt - ${receipt.receiptNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .receipt-details { margin-bottom: 20px; }
              .fee-details { border: 1px solid #ccc; padding: 15px; }
              .total { font-weight: bold; font-size: 18px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>EduVerse School</h1>
              <h2>Fee Receipt</h2>
            </div>
            <div class="receipt-details">
              <p><strong>Receipt No:</strong> ${receipt.receiptNumber}</p>
              <p><strong>Date:</strong> ${new Date(receipt.paymentDate).toLocaleDateString()}</p>
              <p><strong>Student:</strong> ${receipt.studentName}</p>
              <p><strong>Admission No:</strong> ${receipt.admissionNumber}</p>
              <p><strong>Class:</strong> ${receipt.class}-${receipt.section}</p>
              <p><strong>Academic Year:</strong> ${receipt.academicYear}</p>
            </div>
            <div class="fee-details">
              <h3>Fee Details</h3>
              <p><strong>Fee Types:</strong> ${receipt.feeTypes.join(', ')}</p>
              <p><strong>Payment Method:</strong> ${receipt.paymentMethod.toUpperCase()}</p>
              <p class="total"><strong>Amount Paid:</strong> ₹${receipt.amount.toLocaleString()}</p>
              ${receipt.remarks ? `<p><strong>Remarks:</strong> ${receipt.remarks}</p>` : ''}
            </div>
            <div style="margin-top: 30px;">
              <p><strong>Collected By:</strong> ${receipt.collectedBy}</p>
              <p><strong>Signature:</strong> _________________</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800'
      case 'card': return 'bg-blue-100 text-blue-800'
      case 'upi': return 'bg-purple-100 text-purple-800'
      case 'bank_transfer': return 'bg-orange-100 text-orange-800'
      case 'cheque': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredReceipts = receipts.filter(receipt => {
    const matchesSearch = 
      receipt.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDate = 
      (!dateFilter.startDate || receipt.paymentDate >= dateFilter.startDate) &&
      (!dateFilter.endDate || receipt.paymentDate <= dateFilter.endDate)
    
    return matchesSearch && matchesDate
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
          <h1 className="text-3xl font-bold tracking-tight">Fee Receipts</h1>
          <p className="text-muted-foreground">View and manage fee payment receipts</p>
        </div>
        <Button onClick={() => window.location.href = '/accountant/fee-collection'}>
          <Receipt className="mr-2 h-4 w-4" />
          Collect New Fee
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Receipts</CardTitle>
            <Receipt className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{receipts.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Receipts</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.paymentDate === new Date().toISOString().split('T')[0]).length}
            </div>
            <p className="text-xs text-muted-foreground">Generated today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <IndianRupee className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{receipts.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total collected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Receipts</CardTitle>
            <FileText className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {receipts.filter(r => r.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Valid receipts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by receipt number, student name, or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              type="date"
              value={dateFilter.startDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              placeholder="End Date"
            />
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Receipts List */}
      <Card>
        <CardHeader>
          <CardTitle>Receipts ({filteredReceipts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredReceipts.map((receipt) => (
              <div key={receipt.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Receipt className="h-10 w-10 text-blue-600" />
                    <div>
                      <h3 className="font-semibold">{receipt.receiptNumber}</h3>
                      <p className="text-sm text-gray-500">
                        {receipt.studentName} • {receipt.admissionNumber} • Class {receipt.class}-{receipt.section}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(receipt.paymentDate).toLocaleDateString()} • Collected by {receipt.collectedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-bold">₹{receipt.amount.toLocaleString()}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentMethodColor(receipt.paymentMethod)}`}>
                        {receipt.paymentMethod.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        receipt.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {receipt.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm text-gray-600">
                      <span>Fee Types: {receipt.feeTypes.join(', ')}</span>
                      {receipt.remarks && <span>Remarks: {receipt.remarks}</span>}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          setSelectedReceipt(receipt)
                          setShowReceiptModal(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => printReceipt(receipt)}
                      >
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => downloadReceipt(receipt.id)}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Receipt Detail Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Receipt Details</h2>
              <Button variant="outline" onClick={() => setShowReceiptModal(false)}>
                Close
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Receipt Header */}
              <div className="text-center border-b pb-4">
                <h3 className="text-xl font-bold">EduVerse School</h3>
                <p className="text-gray-600">Fee Payment Receipt</p>
              </div>
              
              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Receipt Number</label>
                  <p className="font-semibold">{selectedReceipt.receiptNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Date</label>
                  <p className="font-semibold">{new Date(selectedReceipt.paymentDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Student Name</label>
                  <p className="font-semibold">{selectedReceipt.studentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Admission Number</label>
                  <p className="font-semibold">{selectedReceipt.admissionNumber}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Class</label>
                  <p className="font-semibold">{selectedReceipt.class}-{selectedReceipt.section}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Academic Year</label>
                  <p className="font-semibold">{selectedReceipt.academicYear}</p>
                </div>
              </div>
              
              {/* Fee Details */}
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-3">Fee Details</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fee Types:</span>
                    <span>{selectedReceipt.feeTypes.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getPaymentMethodColor(selectedReceipt.paymentMethod)}`}>
                      {selectedReceipt.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>₹{selectedReceipt.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              {selectedReceipt.remarks && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Remarks</label>
                  <p className="mt-1">{selectedReceipt.remarks}</p>
                </div>
              )}
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">Collected by: {selectedReceipt.collectedBy}</p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => printReceipt(selectedReceipt)} className="flex-1">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button onClick={() => downloadReceipt(selectedReceipt.id)} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}