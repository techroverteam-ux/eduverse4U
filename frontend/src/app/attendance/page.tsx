'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import { Calendar, Save, Users } from "lucide-react"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedSection, setSelectedSection] = useState('')
  const [students, setStudents] = useState<any[]>([])
  const [attendance, setAttendance] = useState<{[key: string]: string}>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedClass) {
      fetchStudents()
    }
  }, [selectedClass, selectedSection])

  const fetchStudents = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        window.location.href = '/login'
        return
      }
      
      const params = new URLSearchParams()
      if (selectedClass) params.append('class', selectedClass)
      if (selectedSection) params.append('section', selectedSection)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch students')
      }
      
      const data = await response.json()
      setStudents(Array.isArray(data) ? data : [])
      
      // Initialize attendance as present for all students
      const initialAttendance: {[key: string]: string} = {}
      data.forEach((student: any) => {
        initialAttendance[student.id] = 'present'
      })
      setAttendance(initialAttendance)
    } catch (error) {
      console.error('Error fetching students:', error)
      setStudents([])
    }
  }

  const markAttendance = (studentId: string, status: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  const submitAttendance = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const attendanceData = {
        class: selectedClass,
        section: selectedSection,
        date: selectedDate,
        attendance: Object.entries(attendance).map(([studentId, status]) => ({
          studentId,
          status
        }))
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/attendance/mark`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(attendanceData)
      })

      if (response.ok) {
        alert('Attendance marked successfully!')
      } else {
        const error = await response.json()
        alert(error.message || 'Error marking attendance')
      }
    } catch (error) {
      alert('Network error')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800 border-green-200'
      case 'absent': return 'bg-red-100 text-red-800 border-red-200'
      case 'late': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const presentCount = Object.values(attendance).filter(status => status === 'present').length
  const absentCount = Object.values(attendance).filter(status => status === 'absent').length
  const lateCount = Object.values(attendance).filter(status => status === 'late').length

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Attendance</h1>
            <p className="text-gray-600">Mark daily attendance for students</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">{selectedDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Select Class</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">Class</Label>
                  <select
                    id="class"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select Class</option>
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                    <option value="6">Class 6</option>
                    <option value="7">Class 7</option>
                    <option value="8">Class 8</option>
                    <option value="9">Class 9</option>
                    <option value="10">Class 10</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="section">Section</Label>
                  <select
                    id="section"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">All Sections</option>
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>

                {students.length > 0 && (
                  <div className="pt-4 border-t">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Students:</span>
                        <span className="font-medium">{students.length}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Present:</span>
                        <span className="font-medium">{presentCount}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Absent:</span>
                        <span className="font-medium">{absentCount}</span>
                      </div>
                      <div className="flex justify-between text-yellow-600">
                        <span>Late:</span>
                        <span className="font-medium">{lateCount}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>
                    <Users className="h-5 w-5 inline mr-2" />
                    Student List
                  </CardTitle>
                  {students.length > 0 && (
                    <Button onClick={submitAttendance} disabled={loading}>
                      <Save className="h-4 w-4 mr-2" />
                      {loading ? 'Saving...' : 'Save Attendance'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Select a class to view students
                  </div>
                ) : (
                  <div className="space-y-3">
                    {students.map((student: any) => (
                      <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {student.user?.firstName?.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium">
                              {student.user?.firstName} {student.user?.lastName}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Roll: {student.rollNumber || 'N/A'} • Admission: {student.admissionNumber}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          {['present', 'absent', 'late'].map((status) => (
                            <button
                              key={status}
                              onClick={() => markAttendance(student.id, status)}
                              className={`px-3 py-1 rounded-md text-sm font-medium border transition-colors ${
                                attendance[student.id] === status
                                  ? getStatusColor(status)
                                  : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}