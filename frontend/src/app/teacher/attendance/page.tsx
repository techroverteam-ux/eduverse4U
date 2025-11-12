"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  CheckCircle, XCircle, Clock, Users, Calendar,
  Search, Filter, Save, Upload, Download
} from "lucide-react"

interface Student {
  id: string
  admissionNumber: string
  user: {
    firstName: string
    lastName: string
  }
  rollNumber: string
  present: boolean
  late: boolean
  remarks?: string
}

interface ClassSession {
  id: string
  subject: string
  class: string
  section: string
  date: string
  startTime: string
  endTime: string
  totalStudents: number
  presentCount: number
  absentCount: number
  status: 'scheduled' | 'ongoing' | 'completed'
}

export default function TeacherAttendancePage() {
  const [sessions, setSessions] = useState<ClassSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [attendanceMarked, setAttendanceMarked] = useState(false)

  useEffect(() => {
    fetchSessions()
  }, [])

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/sessions/today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
        if (data.length > 0) {
          setSelectedSession(data[0])
          fetchStudents(data[0].id)
        }
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error)
      // Mock data
      setSessions([
        {
          id: '1',
          subject: 'Mathematics',
          class: '10',
          section: 'A',
          date: '2024-12-08',
          startTime: '09:00',
          endTime: '09:45',
          totalStudents: 35,
          presentCount: 32,
          absentCount: 3,
          status: 'ongoing'
        },
        {
          id: '2',
          subject: 'Physics',
          class: '11',
          section: 'B',
          date: '2024-12-08',
          startTime: '11:00',
          endTime: '11:45',
          totalStudents: 28,
          presentCount: 0,
          absentCount: 0,
          status: 'scheduled'
        }
      ])
      setSelectedSession({
        id: '1',
        subject: 'Mathematics',
        class: '10',
        section: 'A',
        date: '2024-12-08',
        startTime: '09:00',
        endTime: '09:45',
        totalStudents: 35,
        presentCount: 32,
        absentCount: 3,
        status: 'ongoing'
      })
      fetchStudents('1')
    } finally {
      setLoading(false)
    }
  }

  const fetchStudents = async (sessionId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/sessions/${sessionId}/students`, {
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
          rollNumber: '1',
          present: true,
          late: false
        },
        {
          id: '2',
          admissionNumber: 'STU002',
          user: { firstName: 'Priya', lastName: 'Singh' },
          rollNumber: '2',
          present: true,
          late: true,
          remarks: 'Came 10 minutes late'
        },
        {
          id: '3',
          admissionNumber: 'STU003',
          user: { firstName: 'Amit', lastName: 'Kumar' },
          rollNumber: '3',
          present: false,
          late: false,
          remarks: 'Sick leave'
        }
      ])
    }
  }

  const toggleAttendance = (studentId: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, present: !student.present, late: student.present ? false : student.late }
        : student
    ))
  }

  const toggleLate = (studentId: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId 
        ? { ...student, late: !student.late, present: student.late ? student.present : true }
        : student
    ))
  }

  const updateRemarks = (studentId: string, remarks: string) => {
    setStudents(prev => prev.map(student => 
      student.id === studentId ? { ...student, remarks } : student
    ))
  }

  const saveAttendance = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/teacher/attendance/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          sessionId: selectedSession?.id,
          attendance: students.map(s => ({
            studentId: s.id,
            present: s.present,
            late: s.late,
            remarks: s.remarks
          }))
        })
      })
      
      if (response.ok) {
        setAttendanceMarked(true)
        alert('Attendance saved successfully!')
        fetchSessions()
      }
    } catch (error) {
      console.error('Failed to save attendance:', error)
      alert('Failed to save attendance')
    }
  }

  const markAllPresent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: true, late: false })))
  }

  const markAllAbsent = () => {
    setStudents(prev => prev.map(student => ({ ...student, present: false, late: false })))
  }

  const filteredStudents = students.filter(student =>
    student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.rollNumber.includes(searchTerm) ||
    student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const presentCount = students.filter(s => s.present).length
  const absentCount = students.filter(s => !s.present).length
  const lateCount = students.filter(s => s.late).length

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
          <h1 className="text-3xl font-bold tracking-tight">Student Attendance</h1>
          <p className="text-muted-foreground">Mark attendance for your classes</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={saveAttendance} disabled={!selectedSession}>
            <Save className="mr-2 h-4 w-4" />
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Session Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Class Session</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedSession?.id === session.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => {
                  setSelectedSession(session)
                  fetchStudents(session.id)
                }}
              >
                <h3 className="font-semibold">{session.subject}</h3>
                <p className="text-sm text-gray-600">
                  Class {session.class}-{session.section}
                </p>
                <p className="text-sm text-gray-600">
                  {session.startTime} - {session.endTime}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    session.status === 'completed' ? 'bg-green-100 text-green-800' :
                    session.status === 'ongoing' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {session.status}
                  </span>
                  <span className="text-xs text-gray-500">
                    {session.presentCount}/{session.totalStudents} present
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedSession && (
        <>
          {/* Attendance Summary */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{students.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Present</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{presentCount}</div>
                <p className="text-xs text-muted-foreground">
                  {students.length > 0 ? ((presentCount / students.length) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Absent</CardTitle>
                <XCircle className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{absentCount}</div>
                <p className="text-xs text-muted-foreground">
                  {students.length > 0 ? ((absentCount / students.length) * 100).toFixed(1) : 0}%
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Late</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{lateCount}</div>
                <p className="text-xs text-muted-foreground">Late arrivals</p>
              </CardContent>
            </Card>
          </div>

          {/* Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div className="flex space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={markAllPresent}>
                    Mark All Present
                  </Button>
                  <Button variant="outline" size="sm" onClick={markAllAbsent}>
                    Mark All Absent
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Student List */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedSession.subject} - Class {selectedSession.class}-{selectedSession.section}
              </CardTitle>
              <CardDescription>
                {new Date(selectedSession.date).toLocaleDateString()} • {selectedSession.startTime} - {selectedSession.endTime}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <span className="font-medium w-8">{student.rollNumber}</span>
                      <div>
                        <p className="font-medium">
                          {student.user.firstName} {student.user.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Input
                        placeholder="Remarks (optional)"
                        value={student.remarks || ''}
                        onChange={(e) => updateRemarks(student.id, e.target.value)}
                        className="w-48"
                      />
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant={student.late ? "default" : "outline"}
                          onClick={() => toggleLate(student.id)}
                          className="w-16"
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          Late
                        </Button>
                        
                        <Button
                          size="sm"
                          variant={student.present ? "default" : "outline"}
                          onClick={() => toggleAttendance(student.id)}
                          className={`w-20 ${
                            student.present 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'border-red-300 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {student.present ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Present
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Absent
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}