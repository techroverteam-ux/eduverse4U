"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, Plus, AlertCircle, CheckCircle, Clock, 
  User, Calendar, Filter, Search, Send, Eye
} from "lucide-react"

interface Complaint {
  id: string
  category: string
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  response?: string
  resolvedBy?: string
  resolvedAt?: string
  createdAt: string
  student: {
    id: string
    user: {
      firstName: string
      lastName: string
    }
    class: string
    section: string
  }
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState(true)
  const [showNewComplaint, setShowNewComplaint] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [children, setChildren] = useState<any[]>([])
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all'
  })

  const [newComplaint, setNewComplaint] = useState({
    studentId: '',
    category: 'academic',
    subject: '',
    description: '',
    priority: 'medium'
  })

  useEffect(() => {
    fetchComplaints()
    fetchChildren()
  }, [])

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // No token available, use empty array for demo
        setComplaints([])
        setLoading(false)
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/parents/complaints`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setComplaints(data)
      } else {
        setComplaints([])
      }
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
      // Use mock data if API fails
      setComplaints([])
    } finally {
      setLoading(false)
    }
  }

  const fetchChildren = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        // No token available, use empty array for demo
        setChildren([])
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/parents/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setChildren(data.children || [])
        if (data.children && data.children.length > 0) {
          setNewComplaint(prev => ({ ...prev, studentId: data.children[0].student.id }))
        }
      } else {
        setChildren([])
      }
    } catch (error) {
      console.error('Failed to fetch children:', error)
      setChildren([])
    }
  }

  const handleSubmitComplaint = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/parents/complaints`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newComplaint)
      })
      
      if (response.ok) {
        setShowNewComplaint(false)
        setNewComplaint({
          studentId: children[0]?.student.id || '',
          category: 'academic',
          subject: '',
          description: '',
          priority: 'medium'
        })
        fetchComplaints()
        alert('Complaint submitted successfully!')
      } else {
        alert('Failed to submit complaint')
      }
    } catch (error) {
      console.error('Failed to submit complaint:', error)
      alert('Failed to submit complaint')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'in_progress': return <Clock className="h-4 w-4 text-blue-600" />
      case 'open': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'closed': return <CheckCircle className="h-4 w-4 text-gray-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'open': return 'bg-yellow-100 text-yellow-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredComplaints = complaints.filter(complaint => {
    const matchesStatus = filters.status === 'all' || complaint.status === filters.status
    const matchesCategory = filters.category === 'all' || complaint.category === filters.category
    const matchesPriority = filters.priority === 'all' || complaint.priority === filters.priority
    return matchesStatus && matchesCategory && matchesPriority
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Complaint Management</h1>
          <p className="text-muted-foreground">
            File and track complaints about your children's school experience
          </p>
        </div>
        <Button onClick={() => setShowNewComplaint(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Complaint
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Complaints</CardTitle>
            <MessageSquare className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'open').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'in_progress').length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complaints.filter(c => c.status === 'resolved').length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">All Categories</option>
              <option value="academic">Academic</option>
              <option value="behavioral">Behavioral</option>
              <option value="financial">Financial</option>
              <option value="facility">Facility</option>
              <option value="other">Other</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Complaints List */}
      <Card>
        <CardHeader>
          <CardTitle>Complaints ({filteredComplaints.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredComplaints.length > 0 ? (
            <div className="space-y-4">
              {filteredComplaints.map((complaint) => (
                <div key={complaint.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        {getStatusIcon(complaint.status)}
                        <h3 className="font-semibold">{complaint.subject}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{complaint.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>Child: {complaint.student.user.firstName} {complaint.student.user.lastName}</span>
                        <span>Category: {complaint.category}</span>
                        <span>Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      </div>
                      {complaint.response && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">School Response:</p>
                          <p className="text-sm text-blue-700">{complaint.response}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status.replace('_', ' ')}
                      </span>
                      <Button variant="ghost" size="sm" onClick={() => setSelectedComplaint(complaint)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No complaints found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* New Complaint Modal */}
      {showNewComplaint && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">File New Complaint</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Child</label>
                <select
                  value={newComplaint.studentId}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, studentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  {children.map((child) => (
                    <option key={child.student.id} value={child.student.id}>
                      {child.student.user.firstName} {child.student.user.lastName} - Class {child.student.class}-{child.student.section}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="academic">Academic</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="financial">Financial</option>
                  <option value="facility">Facility</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={newComplaint.priority}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input
                  type="text"
                  value={newComplaint.subject}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, subject: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Brief description of the issue"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="Detailed description of the complaint..."
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowNewComplaint(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmitComplaint} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Submit Complaint
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}