"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"

interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  isCurrent: boolean
  schoolName: string
}

export default function AcademicYearsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { filters, loading: filtersLoading } = useFilters()

  useEffect(() => {
    if (!filtersLoading && filters.schools.length > 0) {
      fetchAcademicYears()
    }
  }, [selectedSchool, filtersLoading, filters.schools])

  const fetchAcademicYears = async () => {
    try {
      setLoading(true)
      const schoolId = selectedSchool !== 'all' ? selectedSchool : (localStorage.getItem('schoolId') || filters.schools[0]?.id)
      if (!schoolId) return
      
      const data = await masterAPI.getAcademicYears(schoolId)
      setAcademicYears(data || [])
    } catch (error) {
      console.error('Failed to fetch academic years:', error)
      toast.error('Failed to load academic years')
      setAcademicYears([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this academic year?')) {
      try {
        await masterAPI.deleteAcademicYear(id)
        toast.success('Academic year deleted successfully')
        fetchAcademicYears()
      } catch (error) {
        toast.error('Failed to delete academic year')
      }
    }
  }

  const filteredYears = academicYears.filter(year =>
    year.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalPages = Math.ceil(filteredYears.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedYears = filteredYears.slice(startIndex, startIndex + itemsPerPage)

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
              Academic Years
            </h1>
            <p className="text-gray-600 mt-1">Manage academic years and sessions</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Academic Year
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Years</p>
                <p className="text-3xl font-bold">{academicYears.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active</p>
                <p className="text-3xl font-bold">{academicYears.filter(y => y.isActive).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Current</p>
                <p className="text-3xl font-bold">{academicYears.filter(y => y.isCurrent).length}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Schools</p>
                <p className="text-3xl font-bold">{filters.schools.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search academic years..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[200px]"
              value={selectedSchool}
              onChange={(e) => setSelectedSchool(e.target.value)}
              disabled={filtersLoading}
            >
              <option value="all">All Schools</option>
              {filters.schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Academic Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </CardContent>
            </Card>
          ))
        ) : paginatedYears.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No academic years found</p>
          </div>
        ) : (
          paginatedYears.map((year) => (
            <Card key={year.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{year.name}</h3>
                    <p className="text-sm text-gray-500">{year.schoolName}</p>
                  </div>
                  <div className="flex gap-1">
                    {year.isCurrent && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                        Current
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      year.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {year.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div>Start: {new Date(year.startDate).toLocaleDateString()}</div>
                  <div>End: {new Date(year.endDate).toLocaleDateString()}</div>
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
                  <Button variant="outline" size="sm" className="px-2" onClick={() => handleDelete(year.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredYears.length)} of {filteredYears.length}
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