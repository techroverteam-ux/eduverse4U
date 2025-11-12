"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, Search, Plus, Edit, Eye, Trash2, Upload, Download, Grid3X3, List, ChevronLeft, ChevronRight, Phone, Mail } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { useFilters } from "@/hooks/useFilters"

interface Teacher {
  id: string
  employeeId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  subjects: string[]
  branch: string
  experience: string
  status: string
}

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const { filters, loading: filtersLoading, getFilteredBranches } = useFilters()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)

  useEffect(() => {
    fetchTeachers()
  }, [])

  const fetchTeachers = async () => {
    try {
      setLoading(true)
      // Mock data
      const mockTeachers = Array.from({ length: 30 }, (_, i) => ({
        id: `teacher-${i + 1}`,
        employeeId: `EMP${(i + 1).toString().padStart(3, '0')}`,
        firstName: `Teacher${i + 1}`,
        lastName: 'Smith',
        email: `teacher${i + 1}@school.edu`,
        phone: `+91-98765432${i.toString().padStart(2, '0')}`,
        subjects: i % 3 === 0 ? ['Mathematics', 'Physics'] : i % 3 === 1 ? ['English', 'History'] : ['Chemistry', 'Biology'],
        branch: i % 2 === 0 ? 'Main Campus' : 'East Branch',
        experience: `${Math.floor(Math.random() * 15) + 1} years`,
        status: i % 8 === 0 ? 'On Leave' : 'Active'
      }))
      setTeachers(mockTeachers)
    } catch (error) {
      toast.error('Failed to load teachers')
    } finally {
      setLoading(false)
    }
  }

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teacher.employeeId.includes(searchTerm)
    const matchesBranch = filterBranch === 'all' || teacher.branch === filterBranch
    const matchesStatus = filterStatus === 'all' || teacher.status === filterStatus
    return matchesSearch && matchesBranch && matchesStatus
  })

  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTeachers = filteredTeachers.slice(startIndex, startIndex + itemsPerPage)

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
              Teachers Management
            </h1>
            <p className="text-gray-600 mt-1">Manage teacher profiles and assignments</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Teacher
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold">{teachers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active</p>
                <p className="text-3xl font-bold">{teachers.filter(t => t.status === 'Active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">Main Campus</p>
                <p className="text-3xl font-bold">{teachers.filter(t => t.branch === 'Main Campus').length}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">On Leave</p>
                <p className="text-3xl font-bold">{teachers.filter(t => t.status === 'On Leave').length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
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
                placeholder="Search teachers..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
                disabled={filtersLoading}
              >
                <option value="all">All Schools</option>
                {filters.schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                value={filterBranch}
                onChange={(e) => setFilterBranch(e.target.value)}
                disabled={filtersLoading || selectedSchool === 'all'}
              >
                <option value="all">All Branches</option>
                {getFilteredBranches(selectedSchool).map(branch => (
                  <option key={branch.id} value={branch.id}>{branch.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[120px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
              <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none border-0"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  className="rounded-none border-0"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Teachers Content */}
      <Card>
        <CardHeader>
          <CardTitle>Teachers Directory</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Employee ID</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Teacher</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Subjects</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Branch</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedTeachers.map((teacher) => (
                    <tr key={teacher.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-medium">{teacher.employeeId}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold">{teacher.firstName} {teacher.lastName}</div>
                          <div className="text-sm text-gray-500">{teacher.experience}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {teacher.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3 w-3 mr-1" />
                            {teacher.phone}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {teacher.subjects.map((subject, idx) => (
                            <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-4 px-4">{teacher.branch}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {paginatedTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{teacher.firstName} {teacher.lastName}</h3>
                        <p className="text-sm text-gray-500">{teacher.employeeId}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        teacher.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {teacher.status}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Mail className="h-3 w-3 mr-2" />
                        {teacher.email}
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-3 w-3 mr-2" />
                        {teacher.phone}
                      </div>
                      <div>Branch: {teacher.branch}</div>
                      <div>Experience: {teacher.experience}</div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {teacher.subjects.map((subject, idx) => (
                          <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                            {subject}
                          </span>
                        ))}
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredTeachers.length)} of {filteredTeachers.length}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}