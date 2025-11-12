"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Filter, Download, TrendingUp, BookOpen } from "lucide-react"

interface Grade {
  id: string
  subject: string
  examType: string
  marksObtained: number
  totalMarks: number
  percentage: number
  grade: string
  academicYear: string
  term: string
  remarks?: string
  createdAt: string
}

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    subject: '',
    academicYear: '2024-25',
    term: ''
  })

  useEffect(() => {
    fetchGrades()
  }, [filters])

  const fetchGrades = async () => {
    try {
      const token = localStorage.getItem('token')
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      if (user.role === 'student') {
        const params = new URLSearchParams()
        if (filters.subject) params.append('subject', filters.subject)
        if (filters.academicYear) params.append('academicYear', filters.academicYear)
        if (filters.term) params.append('term', filters.term)

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/students/grades/me?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setGrades(data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch grades:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800'
      case 'A': return 'bg-green-100 text-green-700'
      case 'B+': return 'bg-blue-100 text-blue-800'
      case 'B': return 'bg-blue-100 text-blue-700'
      case 'C+': return 'bg-yellow-100 text-yellow-800'
      case 'C': return 'bg-yellow-100 text-yellow-700'
      case 'D': return 'bg-orange-100 text-orange-800'
      case 'F': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateOverallStats = () => {
    if (grades.length === 0) return { average: 0, totalSubjects: 0, highestGrade: 'N/A' }
    
    const totalPercentage = grades.reduce((sum, grade) => sum + grade.percentage, 0)
    const average = totalPercentage / grades.length
    const highestGrade = grades.reduce((highest, grade) => 
      grade.percentage > highest.percentage ? grade : highest
    )
    
    return {
      average: average.toFixed(1),
      totalSubjects: grades.length,
      highestGrade: highestGrade.grade
    }
  }

  const stats = calculateOverallStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading grades...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Grades</h1>
          <p className="text-muted-foreground">
            View your academic performance and exam results
          </p>
        </div>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.average}%</div>
            <p className="text-xs text-muted-foreground">
              Across all subjects
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSubjects}</div>
            <p className="text-xs text-muted-foreground">
              Graded this year
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Highest Grade</CardTitle>
            <Award className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.highestGrade}</div>
            <p className="text-xs text-muted-foreground">
              Best performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.subject}
              onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
            >
              <option value="">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="Social Studies">Social Studies</option>
              <option value="Hindi">Hindi</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.academicYear}
              onChange={(e) => setFilters(prev => ({ ...prev, academicYear: e.target.value }))}
            >
              <option value="2024-25">2024-25</option>
              <option value="2023-24">2023-24</option>
            </select>
            
            <select
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={filters.term}
              onChange={(e) => setFilters(prev => ({ ...prev, term: e.target.value }))}
            >
              <option value="">All Terms</option>
              <option value="Term 1">Term 1</option>
              <option value="Term 2">Term 2</option>
              <option value="Final">Final</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Grade Details</CardTitle>
          <CardDescription>Your exam results and performance</CardDescription>
        </CardHeader>
        <CardContent>
          {grades.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Subject</th>
                    <th className="text-left py-3 px-4">Exam Type</th>
                    <th className="text-left py-3 px-4">Marks</th>
                    <th className="text-left py-3 px-4">Percentage</th>
                    <th className="text-left py-3 px-4">Grade</th>
                    <th className="text-left py-3 px-4">Term</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((grade) => (
                    <tr key={grade.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{grade.subject}</td>
                      <td className="py-4 px-4">{grade.examType}</td>
                      <td className="py-4 px-4">
                        <span className="font-bold">{grade.marksObtained}</span>
                        <span className="text-gray-500">/{grade.totalMarks}</span>
                      </td>
                      <td className="py-4 px-4">{grade.percentage.toFixed(1)}%</td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(grade.grade)}`}>
                          {grade.grade}
                        </span>
                      </td>
                      <td className="py-4 px-4">{grade.term}</td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(grade.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No grades available</p>
              <p className="text-sm text-gray-500">Grades will appear here once published by your teachers</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}