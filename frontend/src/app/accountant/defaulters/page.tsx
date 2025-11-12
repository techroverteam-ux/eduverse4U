"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, AlertCircle, Phone, Mail, Calendar,
  Filter, Download, Send, User, IndianRupee
} from "lucide-react"

interface Defaulter {
  id: string
  student: {
    id: string
    admissionNumber: string
    user: {
      firstName: string
      lastName: string
      email: string
    }
    class: string
    section: string
  }
  parent: {
    firstName: string
    lastName: string
    phone: string
    email: string
  }
  feeDetails: {
    totalAmount: number
    paidAmount: number
    pendingAmount: number
    dueDate: string
    daysOverdue: number
    lastPaymentDate?: string
  }
  notices: {
    id: string
    type: 'email' | 'sms' | 'letter'
    sentDate: string
    status: 'sent' | 'delivered' | 'read'
  }[]
}

export default function DefaultersPage() {
  const [defaulters, setDefaulters] = useState<Defaulter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterDays, setFilterDays] = useState('all')
  const [selectedDefaulters, setSelectedDefaulters] = useState<string[]>([])
  const [showNoticeModal, setShowNoticeModal] = useState(false)
  const [noticeData, setNoticeData] = useState({
    type: 'email' as 'email' | 'sms' | 'letter',
    subject: '',
    message: '',
    recipients: [] as string[]
  })

  useEffect(() => {
    fetchDefaulters()
  }, [])

  const fetchDefaulters = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/defaulters`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setDefaulters(data)
      }
    } catch (error) {
      console.error('Failed to fetch defaulters:', error)
      // Mock data
      setDefaulters([
        {
          id: '1',
          student: {
            id: 'stu1',
            admissionNumber: 'STU001',
            user: { firstName: 'Rahul', lastName: 'Sharma', email: 'rahul@example.com' },
            class: '10',
            section: 'A'
          },
          parent: {
            firstName: 'Suresh',
            lastName: 'Sharma',
            phone: '9876543210',
            email: 'suresh@example.com'
          },
          feeDetails: {
            totalAmount: 25000,
            paidAmount: 10000,
            pendingAmount: 15000,
            dueDate: '2024-11-15',
            daysOverdue: 23,
            lastPaymentDate: '2024-10-01'
          },
          notices: [
            { id: 'n1', type: 'email', sentDate: '2024-11-20', status: 'read' },
            { id: 'n2', type: 'sms', sentDate: '2024-11-25', status: 'delivered' }
          ]
        },
        {
          id: '2',
          student: {
            id: 'stu2',
            admissionNumber: 'STU002',
            user: { firstName: 'Priya', lastName: 'Singh', email: 'priya@example.com' },
            class: '9',
            section: 'B'
          },
          parent: {
            firstName: 'Rajesh',
            lastName: 'Singh',
            phone: '9876543211',
            email: 'rajesh@example.com'
          },
          feeDetails: {
            totalAmount: 22000,
            paidAmount: 10000,
            pendingAmount: 12000,
            dueDate: '2024-11-20',
            daysOverdue: 18,
            lastPaymentDate: '2024-09-15'
          },
          notices: [
            { id: 'n3', type: 'email', sentDate: '2024-11-22', status: 'sent' }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const sendNotice = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/send-notice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...noticeData,
          recipients: selectedDefaulters
        })
      })
      
      if (response.ok) {
        alert('Notice sent successfully!')
        setShowNoticeModal(false)
        setNoticeData({ type: 'email', subject: '', message: '', recipients: [] })
        setSelectedDefaulters([])
        fetchDefaulters()
      } else {
        alert('Failed to send notice')
      }
    } catch (error) {
      console.error('Failed to send notice:', error)
      alert('Failed to send notice')
    }
  }

  const exportDefaulters = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/defaulters/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `defaulters_${new Date().toISOString().split('T')[0]}.xlsx`
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

  const getDaysOverdueColor = (days: number) => {
    if (days > 30) return 'bg-red-100 text-red-800'
    if (days > 15) return 'bg-orange-100 text-orange-800'
    return 'bg-yellow-100 text-yellow-800'
  }

  const getNoticeStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-blue-100 text-blue-800'
      case 'sent': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredDefaulters = defaulters.filter(defaulter => {
    const matchesSearch = 
      defaulter.student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defaulter.student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      defaulter.student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesDays = filterDays === 'all' || 
      (filterDays === '15' && defaulter.feeDetails.daysOverdue <= 15) ||
      (filterDays === '30' && defaulter.feeDetails.daysOverdue > 15 && defaulter.feeDetails.daysOverdue <= 30) ||
      (filterDays === '30+' && defaulter.feeDetails.daysOverdue > 30)
    
    return matchesSearch && matchesDays
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
          <h1 className="text-3xl font-bold tracking-tight">Fee Defaulters</h1>
          <p className="text-muted-foreground">
            Manage students with overdue fee payments
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={exportDefaulters}>
            <Download className="mr-2 h-4 w-4" />
            Export List
          </Button>
          <Button 
            onClick={() => setShowNoticeModal(true)}
            disabled={selectedDefaulters.length === 0}
          >
            <Send className="mr-2 h-4 w-4" />
            Send Notice ({selectedDefaulters.length})
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Defaulters</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{defaulters.length}</div>
            <p className="text-xs text-muted-foreground">Students with overdue fees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <IndianRupee className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{defaulters.reduce((sum, d) => sum + d.feeDetails.pendingAmount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Pending amount</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Cases</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaulters.filter(d => d.feeDetails.daysOverdue > 30).length}
            </div>
            <p className="text-xs text-muted-foreground">Over 30 days overdue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Notices Sent</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {defaulters.reduce((sum, d) => sum + d.notices.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
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
                placeholder="Search by name or admission number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterDays}
              onChange={(e) => setFilterDays(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Overdue</option>
              <option value="15">Up to 15 days</option>
              <option value="30">16-30 days</option>
              <option value="30+">Over 30 days</option>
            </select>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Defaulters List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Defaulters List ({filteredDefaulters.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedDefaulters.length === filteredDefaulters.length && filteredDefaulters.length > 0}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedDefaulters(filteredDefaulters.map(d => d.id))
                  } else {
                    setSelectedDefaulters([])
                  }
                }}
              />
              <span className="text-sm">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDefaulters.map((defaulter) => (
              <div key={defaulter.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedDefaulters.includes(defaulter.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedDefaulters(prev => [...prev, defaulter.id])
                        } else {
                          setSelectedDefaulters(prev => prev.filter(id => id !== defaulter.id))
                        }
                      }}
                      className="mt-1"
                    />
                    <User className="h-10 w-10 text-gray-400 mt-1" />
                    <div>
                      <h3 className="font-semibold">
                        {defaulter.student.user.firstName} {defaulter.student.user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {defaulter.student.admissionNumber} • Class {defaulter.student.class}-{defaulter.student.section}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Phone className="h-4 w-4" />
                          <span>{defaulter.parent.phone}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{defaulter.parent.email}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDaysOverdueColor(defaulter.feeDetails.daysOverdue)}`}>
                        {defaulter.feeDetails.daysOverdue} days overdue
                      </span>
                    </div>
                    <p className="text-lg font-bold text-red-600">
                      ₹{defaulter.feeDetails.pendingAmount.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-500">
                      Due: {new Date(defaulter.feeDetails.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-4 text-sm">
                      <span>Total: ₹{defaulter.feeDetails.totalAmount.toLocaleString()}</span>
                      <span>Paid: ₹{defaulter.feeDetails.paidAmount.toLocaleString()}</span>
                      {defaulter.feeDetails.lastPaymentDate && (
                        <span>Last Payment: {new Date(defaulter.feeDetails.lastPaymentDate).toLocaleDateString()}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {defaulter.notices.slice(-3).map((notice) => (
                          <span
                            key={notice.id}
                            className={`px-2 py-1 rounded text-xs ${getNoticeStatusColor(notice.status)}`}
                            title={`${notice.type} - ${new Date(notice.sentDate).toLocaleDateString()}`}
                          >
                            {notice.type}
                          </span>
                        ))}
                      </div>
                      
                      <Button size="sm" variant="outline">
                        <Phone className="mr-2 h-4 w-4" />
                        Call
                      </Button>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Send Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6">Send Notice to Defaulters</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Notice Type</label>
                <select
                  value={noticeData.type}
                  onChange={(e) => setNoticeData(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="letter">Letter</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <Input
                  value={noticeData.subject}
                  onChange={(e) => setNoticeData(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Fee payment reminder"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea
                  value={noticeData.message}
                  onChange={(e) => setNoticeData(prev => ({ ...prev, message: e.target.value }))}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="Dear Parent, This is to remind you that your ward's fee payment is overdue..."
                />
              </div>
              
              <div>
                <p className="text-sm text-gray-600">
                  This notice will be sent to {selectedDefaulters.length} defaulter(s)
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowNoticeModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={sendNotice} className="flex-1">
                <Send className="mr-2 h-4 w-4" />
                Send Notice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}