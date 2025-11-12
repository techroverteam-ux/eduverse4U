"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Search, Plus, Edit, Eye, Trash2, Users, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"

interface Class {
  id: string
  name: string
  section: string
  classTeacher: string
  maxStudents: number
  currentStudents: number
  branch: string
  academicYear: string
  status: string
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterYear, setFilterYear] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)

  useEffect(() => {
    fetchClasses()
  }, [searchTerm, filterBranch, filterYear])

  const handleDeleteClass = async (id: string) => {
    if (confirm('Are you sure you want to delete this class?')) {
      try {
        await masterAPI.deleteClass(id)
        toast.success('Class deleted successfully')
        fetchClasses()
      } catch (error) {
        toast.error('Failed to delete class')
      }
    }
  }

  const fetchClasses = async () => {
    try {
      setLoading(true)
      const schoolId = localStorage.getItem('schoolId') || 'default-school'
      const data = await masterAPI.getClasses(schoolId, filterBranch !== 'all' ? filterBranch : undefined, filterYear !== 'all' ? filterYear : undefined)
      setClasses(data || [])
    } catch (error) {
      console.error('Failed to fetch classes:', error)
      toast.error('Failed to load classes')
      setClasses([])
    } finally {
      setLoading(false)
    }
  }

  const filteredClasses = classes.filter(cls => {
    const matchesSearch = cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.section.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesBranch = filterBranch === 'all' || cls.branch === filterBranch
    const matchesYear = filterYear === 'all' || cls.academicYear === filterYear
    return matchesSearch && matchesBranch && matchesYear
  })

  const totalPages = Math.ceil(filteredClasses.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedClasses = filteredClasses.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Classes Management
            </h1>
            <p className="text-gray-600 mt-1">Setup classes and sections</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Class
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Classes</p>
                <p className="text-3xl font-bold">{classes.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Classes</p>
                <p className="text-3xl font-bold">{classes.filter(c => c.status === 'Active').length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{classes.reduce((sum, c) => sum + c.currentStudents, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Avg. Class Size</p>
                <p className="text-3xl font-bold">{Math.round(classes.reduce((sum, c) => sum + c.currentStudents, 0) / classes.length)}</p>
              </div>
              <Users className="h-8 w-8 text-orange-200" />
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
                placeholder="Search classes..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
              >
                <option value="all">All Branches</option>
                <option value="Main Campus">Main Campus</option>
                <option value="East Branch">East Branch</option>
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">All Years</option>
                <option value="2024-25">2024-25</option>
                <option value="2023-24">2023-24</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {paginatedClasses.map((cls) => (
          <Card key={cls.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{cls.name} - {cls.section}</h3>
                  <p className="text-sm text-gray-500">{cls.branch}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  cls.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {cls.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Class Teacher:</span>
                  <span className="font-medium">{cls.classTeacher}</span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Students:</span>
                  <span className="font-medium">{cls.currentStudents}/{cls.maxStudents}</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(cls.currentStudents / cls.maxStudents) * 100}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-500">
                  Academic Year: {cls.academicYear}
                </div>
              </div>
              
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="px-2" onClick={() => handleDeleteClass(cls.id)}>
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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredClasses.length)} of {filteredClasses.length}
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