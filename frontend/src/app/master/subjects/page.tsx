"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GraduationCap, Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"

interface Subject {
  id: string
  name: string
  code: string
  type: string
  description: string
  status: string
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  useEffect(() => {
    fetchSubjects()
  }, [searchTerm, filterType])

  const handleDeleteSubject = async (id: string) => {
    if (confirm('Are you sure you want to delete this subject?')) {
      try {
        await masterAPI.deleteSubject(id)
        toast.success('Subject deleted successfully')
        fetchSubjects()
      } catch (error) {
        toast.error('Failed to delete subject')
      }
    }
  }

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const schoolId = localStorage.getItem('schoolId') || 'default-school'
      const data = await masterAPI.getSubjects(schoolId)
      setSubjects(data || [])
    } catch (error) {
      console.error('Failed to fetch subjects:', error)
      toast.error('Failed to load subjects')
      setSubjects([])
    } finally {
      setLoading(false)
    }
  }

  const filteredSubjects = subjects.filter(subject => {
    const matchesSearch = subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subject.code.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || subject.type === filterType
    return matchesSearch && matchesType
  })

  const totalPages = Math.ceil(filteredSubjects.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSubjects = filteredSubjects.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Core': return 'bg-blue-100 text-blue-800'
      case 'Elective': return 'bg-green-100 text-green-800'
      case 'Optional': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Subjects Management
            </h1>
            <p className="text-gray-600 mt-1">Manage subjects and curriculum</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Subject
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Subjects</p>
                <p className="text-3xl font-bold">{subjects.length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Core Subjects</p>
                <p className="text-3xl font-bold">{subjects.filter(s => s.type === 'Core').length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Electives</p>
                <p className="text-3xl font-bold">{subjects.filter(s => s.type === 'Elective').length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Optional</p>
                <p className="text-3xl font-bold">{subjects.filter(s => s.type === 'Optional').length}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search subjects..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Core">Core</option>
              <option value="Elective">Elective</option>
              <option value="Optional">Optional</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedSubjects.map((subject) => (
          <Card key={subject.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{subject.name}</h3>
                  <p className="text-sm font-medium text-gray-600">Code: {subject.code}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(subject.type)}`}>
                  {subject.type}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{subject.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subject.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {subject.status}
                </span>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="px-2" onClick={() => handleDeleteSubject(subject.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSubjects.length)} of {filteredSubjects.length}
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  }
                  return null
                })}
                <Button variant="outline" size="sm" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}