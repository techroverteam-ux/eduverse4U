"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  BookOpen, Users, Plus, Edit, Trash2, 
  CheckCircle, Settings, MapPin
} from "lucide-react"

interface ClassData {
  id: string
  name: string
  sections: Section[]
  subjects: Subject[]
  maxStudents: number
  currentStudents: number
  classTeacher?: string
}

interface Section {
  id: string
  name: string
  maxStudents: number
  currentStudents: number
  classTeacher?: string
  room?: string
}

interface Subject {
  id: string
  name: string
  code: string
  teacher?: string
  periodsPerWeek: number
}

export default function ClassesManagementPage() {
  const [classes, setClasses] = useState<ClassData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const schoolId = localStorage.getItem('currentSchoolId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${schoolId}/classes`)
      
      if (response.ok) {
        const data = await response.json()
        setClasses(data)
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      // Mock data with Indian education system
      setClasses([
        {
          id: '1',
          name: 'Nursery',
          sections: [{ id: '1', name: 'A', maxStudents: 25, currentStudents: 20, room: 'Room 101' }],
          subjects: [
            { id: '1', name: 'English', code: 'ENG', periodsPerWeek: 5 },
            { id: '2', name: 'Hindi', code: 'HIN', periodsPerWeek: 4 },
            { id: '3', name: 'Mathematics', code: 'MAT', periodsPerWeek: 5 },
            { id: '4', name: 'EVS', code: 'EVS', periodsPerWeek: 3 }
          ],
          maxStudents: 25,
          currentStudents: 20
        },
        {
          id: '5',
          name: '5',
          sections: [
            { id: '5a', name: 'A', maxStudents: 40, currentStudents: 35, room: 'Room 201' },
            { id: '5b', name: 'B', maxStudents: 40, currentStudents: 38, room: 'Room 202' }
          ],
          subjects: [
            { id: '5-1', name: 'English', code: 'ENG', periodsPerWeek: 6 },
            { id: '5-2', name: 'Hindi', code: 'HIN', periodsPerWeek: 6 },
            { id: '5-3', name: 'Mathematics', code: 'MAT', periodsPerWeek: 7 },
            { id: '5-4', name: 'Science', code: 'SCI', periodsPerWeek: 6 },
            { id: '5-5', name: 'Social Science', code: 'SSC', periodsPerWeek: 5 },
            { id: '5-6', name: 'Computer Science', code: 'CS', periodsPerWeek: 2 }
          ],
          maxStudents: 80,
          currentStudents: 73
        },
        {
          id: '10',
          name: '10',
          sections: [
            { id: '10a', name: 'A', maxStudents: 35, currentStudents: 32, room: 'Room 301' },
            { id: '10b', name: 'B', maxStudents: 35, currentStudents: 30, room: 'Room 302' }
          ],
          subjects: [
            { id: '10-1', name: 'English', code: 'ENG', periodsPerWeek: 6 },
            { id: '10-2', name: 'Hindi', code: 'HIN', periodsPerWeek: 6 },
            { id: '10-3', name: 'Mathematics', code: 'MAT', periodsPerWeek: 7 },
            { id: '10-4', name: 'Science', code: 'SCI', periodsPerWeek: 7 },
            { id: '10-5', name: 'Social Science', code: 'SSC', periodsPerWeek: 6 }
          ],
          maxStudents: 70,
          currentStudents: 62
        },
        {
          id: '12',
          name: '12',
          sections: [
            { id: '12s', name: 'Science', maxStudents: 30, currentStudents: 28, room: 'Room 401' },
            { id: '12c', name: 'Commerce', maxStudents: 35, currentStudents: 32, room: 'Room 402' },
            { id: '12a', name: 'Arts', maxStudents: 25, currentStudents: 20, room: 'Room 403' }
          ],
          subjects: [
            { id: '12-1', name: 'English', code: 'ENG', periodsPerWeek: 5 },
            { id: '12-2', name: 'Physics', code: 'PHY', periodsPerWeek: 6 },
            { id: '12-3', name: 'Chemistry', code: 'CHE', periodsPerWeek: 6 },
            { id: '12-4', name: 'Mathematics', code: 'MAT', periodsPerWeek: 7 },
            { id: '12-5', name: 'Biology', code: 'BIO', periodsPerWeek: 6 }
          ],
          maxStudents: 90,
          currentStudents: 80
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const assignTeacher = async (classId: string, sectionId: string, teacherId: string) => {
    try {
      const schoolId = localStorage.getItem('currentSchoolId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${schoolId}/classes/${classId}/sections/${sectionId}/assign-teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      })

      if (response.ok) {
        fetchClasses()
        alert('Teacher assigned successfully!')
      }
    } catch (error) {
      console.error('Failed to assign teacher:', error)
    }
  }

  const mapSubjectToTeacher = async (classId: string, subjectId: string, teacherId: string) => {
    try {
      const schoolId = localStorage.getItem('currentSchoolId')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${schoolId}/classes/${classId}/subjects/${subjectId}/assign-teacher`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId })
      })

      if (response.ok) {
        fetchClasses()
        alert('Subject teacher assigned successfully!')
      }
    } catch (error) {
      console.error('Failed to assign subject teacher:', error)
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
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Classes Management</h1>
            <p className="text-gray-600 mt-2">Manage classes, sections, and subject mappings</p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New Class
          </Button>
        </div>

        {/* Classes Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((classData) => (
            <Card key={classData.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Class {classData.name}</span>
                  </span>
                  <Button size="sm" variant="outline" onClick={() => setSelectedClass(classData)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>
                  {classData.sections.length} sections • {classData.subjects.length} subjects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Student Count */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Students</span>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{classData.currentStudents}/{classData.maxStudents}</span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Sections</h4>
                    <div className="space-y-2">
                      {classData.sections.map((section) => (
                        <div key={section.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <div>
                            <span className="font-medium">Section {section.name}</span>
                            <p className="text-xs text-gray-500">
                              {section.currentStudents}/{section.maxStudents} students
                              {section.room && ` • ${section.room}`}
                            </p>
                          </div>
                          <div className="flex items-center space-x-1">
                            {section.classTeacher ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <Button size="sm" variant="outline" className="text-xs">
                                Assign Teacher
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Subjects Preview */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Subjects ({classData.subjects.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {classData.subjects.slice(0, 4).map((subject) => (
                        <span key={subject.id} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                          {subject.name}
                        </span>
                      ))}
                      {classData.subjects.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{classData.subjects.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Class Detail Modal */}
        {selectedClass && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Class {selectedClass.name} Details</h2>
                <Button variant="outline" onClick={() => setSelectedClass(null)}>
                  Close
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Sections Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>Sections</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedClass.sections.map((section) => (
                        <div key={section.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-medium">Section {section.name}</h4>
                              <p className="text-sm text-gray-600">
                                {section.currentStudents}/{section.maxStudents} students
                              </p>
                              {section.room && (
                                <p className="text-sm text-gray-600">{section.room}</p>
                              )}
                            </div>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium mb-2">Class Teacher</label>
                            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                              <option value="">Select Teacher</option>
                              <option value="teacher1">John Doe</option>
                              <option value="teacher2">Jane Smith</option>
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Subjects Management */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Subject-Teacher Mapping</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedClass.subjects.map((subject) => (
                        <div key={subject.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium">{subject.name}</h4>
                            <p className="text-sm text-gray-600">
                              {subject.code} • {subject.periodsPerWeek} periods/week
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {subject.teacher ? (
                              <span className="text-sm text-green-600 font-medium">
                                {subject.teacher}
                              </span>
                            ) : (
                              <select className="px-2 py-1 border border-gray-300 rounded text-sm">
                                <option value="">Assign Teacher</option>
                                <option value="teacher1">John Doe</option>
                                <option value="teacher2">Jane Smith</option>
                              </select>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setSelectedClass(null)}>
                  Cancel
                </Button>
                <Button>
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}