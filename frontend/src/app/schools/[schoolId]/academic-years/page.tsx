"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Calendar, Plus, Edit, Trash2, CheckCircle, 
  AlertCircle, Clock, Star
} from "lucide-react"

interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  isCurrent: boolean
  status: 'upcoming' | 'active' | 'completed'
  totalStudents: number
  totalTeachers: number
  createdAt: string
}

export default function AcademicYearsPage({ params }: { params: { schoolId: string } }) {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isActive: false
  })

  useEffect(() => {
    fetchAcademicYears()
  }, [params.schoolId])

  const fetchAcademicYears = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/academic-years`)
      
      if (response.ok) {
        const data = await response.json()
        setAcademicYears(data)
      }
    } catch (error) {
      console.error('Failed to fetch academic years:', error)
      // Mock data
      setAcademicYears([
        {
          id: '1',
          name: '2023-24',
          startDate: '2023-04-01',
          endDate: '2024-03-31',
          isActive: false,
          isCurrent: false,
          status: 'completed',
          totalStudents: 1200,
          totalTeachers: 80,
          createdAt: '2023-01-15'
        },
        {
          id: '2',
          name: '2024-25',
          startDate: '2024-04-01',
          endDate: '2025-03-31',
          isActive: true,
          isCurrent: true,
          status: 'active',
          totalStudents: 1250,
          totalTeachers: 85,
          createdAt: '2024-01-15'
        },
        {
          id: '3',
          name: '2025-26',
          startDate: '2025-04-01',
          endDate: '2026-03-31',
          isActive: false,
          isCurrent: false,
          status: 'upcoming',
          totalStudents: 0,
          totalTeachers: 0,
          createdAt: '2024-12-01'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingYear 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/academic-years/${editingYear.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/academic-years`
      
      const response = await fetch(url, {
        method: editingYear ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingYear ? 'Academic year updated successfully!' : 'Academic year created successfully!')
        setShowModal(false)
        resetForm()
        fetchAcademicYears()
      }
    } catch (error) {
      console.error('Failed to save academic year:', error)
      alert('Failed to save academic year')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this academic year?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/academic-years/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Academic year deleted successfully!')
        fetchAcademicYears()
      }
    } catch (error) {
      console.error('Failed to delete academic year:', error)
      alert('Failed to delete academic year')
    }
  }

  const setCurrentYear = async (id: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/academic-years/${id}/set-current`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('Current academic year updated successfully!')
        fetchAcademicYears()
      }
    } catch (error) {
      console.error('Failed to set current year:', error)
      alert('Failed to set current year')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      startDate: '',
      endDate: '',
      isActive: false
    })
    setEditingYear(null)
  }

  const openEditModal = (year: AcademicYear) => {
    setEditingYear(year)
    setFormData({
      name: year.name,
      startDate: year.startDate,
      endDate: year.endDate,
      isActive: year.isActive
    })
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'upcoming': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'completed': return <CheckCircle className="h-4 w-4 text-gray-600" />
      case 'upcoming': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <AlertCircle className="h-4 w-4 text-gray-600" />
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Button variant="outline" asChild>
                <a href={`/schools/${params.schoolId}/manage`}>← Back</a>
              </Button>
              <h1 className="text-3xl font-bold">Academic Years</h1>
            </div>
            <p className="text-gray-600">Manage academic year periods and sessions</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Academic Year
          </Button>
        </div>

        {/* Academic Years List */}
        <div className="space-y-4">
          {academicYears.map((year) => (
            <Card key={year.id} className={`${year.isCurrent ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-blue-600" />
                    <div>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{year.name}</span>
                        {year.isCurrent && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </CardTitle>
                      <CardDescription>
                        {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(year.status)}`}>
                      {getStatusIcon(year.status)}
                      <span className="ml-1">{year.status}</span>
                    </span>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => openEditModal(year)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      {!year.isCurrent && (
                        <Button size="sm" variant="outline" onClick={() => handleDelete(year.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {/* Duration */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Duration</h4>
                    <p className="text-sm">
                      {Math.ceil((new Date(year.endDate).getTime() - new Date(year.startDate).getTime()) / (1000 * 60 * 60 * 24))} days
                    </p>
                  </div>

                  {/* Students */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Students</h4>
                    <p className="text-2xl font-bold text-blue-600">{year.totalStudents}</p>
                  </div>

                  {/* Teachers */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Teachers</h4>
                    <p className="text-2xl font-bold text-green-600">{year.totalTeachers}</p>
                  </div>

                  {/* Actions */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Actions</h4>
                    <div className="space-y-2">
                      {!year.isCurrent && year.status !== 'completed' && (
                        <Button size="sm" variant="outline" onClick={() => setCurrentYear(year.id)}>
                          Set as Current
                        </Button>
                      )}
                      {year.isCurrent && (
                        <span className="text-sm text-green-600 font-medium">Current Year</span>
                      )}
                    </div>
                  </div>
                </div>

                {year.isCurrent && (
                  <div className="mt-4 pt-4 border-t bg-blue-50 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="text-sm font-medium">This is the current active academic year</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-6">
                {editingYear ? 'Edit Academic Year' : 'Add Academic Year'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Academic Year Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., 2024-25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <label className="text-sm">Set as active year</label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {editingYear ? 'Update' : 'Create'} Year
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Academic Year Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Indian Academic Calendar</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Academic year typically runs from April to March</li>
                  <li>• Summer vacation: May-June</li>
                  <li>• Winter break: December-January</li>
                  <li>• Board exams: February-March</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Only one academic year should be current at a time</li>
                  <li>• Plan next year in advance for smooth transition</li>
                  <li>• Ensure all data is backed up before year transition</li>
                  <li>• Complete all assessments before year end</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}