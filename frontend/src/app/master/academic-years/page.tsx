"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"
import { formatDate } from "@/lib/utils/dateFormat"
import { DateInput } from "@/components/ui/date-input"

interface AcademicYear {
  id: string
  name: string
  startDate: string
  endDate: string
  isActive: boolean
  isCurrent: boolean
  schoolId: string
  branchId?: string
  description?: string
  schoolName: string
  branchName?: string
}

export default function AcademicYearsPage() {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'view'>('add')
  const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null)
  const { filters, loading: filtersLoading, getFilteredBranches } = useFilters()

  useEffect(() => {
    fetchAcademicYears()
  }, [])

  // Refresh data when page loads (for navigation from add page)
  useEffect(() => {
    const handleFocus = () => fetchAcademicYears()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  useEffect(() => {
    if (selectedSchool !== 'all') {
      setSelectedBranch('all')
    }
  }, [selectedSchool])

  const fetchAcademicYears = async () => {
    try {
      setLoading(true)
      console.log('Fetching all academic years')
      const data = await masterAPI.getAllAcademicYears()
      console.log('API response:', data)
      setAcademicYears(data || [])
    } catch (error) {
      console.error('Failed to fetch academic years:', error)
      toast.error('Failed to load academic years')
      setAcademicYears([])
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (confirm('Are you sure you want to delete ALL academic years? This cannot be undone.')) {
      try {
        // Delete all academic years one by one
        for (const year of academicYears) {
          await masterAPI.deleteAcademicYear(year.id)
        }
        toast.success('All academic years deleted successfully')
        fetchAcademicYears()
      } catch (error) {
        toast.error('Failed to delete academic years')
      }
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

  const handleAdd = () => {
    setModalMode('add')
    setSelectedYear(null)
    setShowModal(true)
  }

  const handleEdit = (year: AcademicYear) => {
    window.location.href = `/master/academic-years/add?mode=edit&id=${year.id}`
  }

  const handleView = (year: AcademicYear) => {
    setModalMode('view')
    setSelectedYear(year)
    setShowModal(true)
  }

  const handleSave = async (formData: any) => {
    try {
      if (modalMode === 'add') {
        await masterAPI.createAcademicYear(formData)
        toast.success('Academic year created successfully')
      } else {
        await masterAPI.updateAcademicYear(selectedYear!.id, formData)
        toast.success('Academic year updated successfully')
      }
      setShowModal(false)
      fetchAcademicYears()
    } catch (error) {
      toast.error(`Failed to ${modalMode} academic year`)
    }
  }

  const filteredYears = academicYears.filter(year => {
    const matchesSearch = year.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = selectedSchool === 'all' || year.schoolId === selectedSchool
    const matchesBranch = selectedBranch === 'all' || year.branchId === selectedBranch
    return matchesSearch && matchesSchool && matchesBranch
  })

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
          <div className="flex gap-3">
            {academicYears.length > 0 && (
              <Button variant="outline" className="border-red-200 text-red-700 hover:bg-red-50" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600" onClick={() => window.location.href = '/master/academic-years/add'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Academic Year
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
            <select
              className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[200px]"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              disabled={filtersLoading}
            >
              <option value="all">All Branches</option>
              {(selectedSchool !== 'all' ? getFilteredBranches(selectedSchool) : filters.branches).map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Academic Years List */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : paginatedYears.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No academic years found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left p-4 font-medium text-gray-900">Academic Year</th>
                    <th className="text-left p-4 font-medium text-gray-900">School</th>
                    <th className="text-left p-4 font-medium text-gray-900">Branch</th>
                    <th className="text-left p-4 font-medium text-gray-900">Start Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">End Date</th>
                    <th className="text-left p-4 font-medium text-gray-900">Description</th>
                    <th className="text-left p-4 font-medium text-gray-900">Status</th>
                    <th className="text-right p-4 font-medium text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedYears.map((year, index) => (
                    <tr key={year.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">{year.name}</div>
                          {year.isCurrent && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                              Current
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600">{year.schoolName}</td>
                      <td className="p-4 text-gray-600">{year.branchName || 'All Branches'}</td>
                      <td className="p-4 text-gray-600">{formatDate(year.startDate)}</td>
                      <td className="p-4 text-gray-600">{formatDate(year.endDate)}</td>
                      <td className="p-4 text-gray-600">{year.description || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          year.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {year.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleView(year)}>
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleEdit(year)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(year.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

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

      {/* Modal for Add/Edit/View */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">
                  {modalMode === 'add' ? 'Add Academic Year' : 
                   modalMode === 'edit' ? 'Edit Academic Year' : 'View Academic Year'}
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowModal(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <AcademicYearForm
                mode={modalMode}
                data={selectedYear}
                schools={filters.schools}
                branches={filters.branches}
                onSave={handleSave}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Academic Year Form Component
function AcademicYearForm({ mode, data, schools, branches, onSave, onCancel }: {
  mode: 'add' | 'edit' | 'view'
  data: AcademicYear | null
  schools: any[]
  branches: any[]
  onSave: (data: any) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    startDate: data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : '',
    endDate: data?.endDate ? new Date(data.endDate).toISOString().split('T')[0] : '',
    schoolId: data?.schoolId || schools[0]?.id || '',
    branchId: data?.branchId || '',
    description: data?.description || '',
    isActive: data?.isActive ?? true,
    isCurrent: data?.isCurrent ?? false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filteredBranches, setFilteredBranches] = useState(branches.filter(b => b.schoolId === formData.schoolId))

  useEffect(() => {
    setFilteredBranches(branches.filter(b => b.schoolId === formData.schoolId))
  }, [formData.schoolId, branches])

  const validateAcademicYearName = (name: string): string | null => {
    if (!name.trim()) return 'Academic year name is required'
    
    // Check for YYYY-YY format
    const yearPattern = /^\d{4}-\d{2}$/
    if (!yearPattern.test(name)) {
      return 'Format should be YYYY-YY (e.g., 2024-25)'
    }
    
    const [startYear, endYearShort] = name.split('-')
    const startYearNum = parseInt(startYear)
    const endYearNum = parseInt('20' + endYearShort)
    
    if (endYearNum !== startYearNum + 1) {
      return 'End year should be exactly one year after start year'
    }
    
    const currentYear = new Date().getFullYear()
    if (startYearNum < currentYear - 5 || startYearNum > currentYear + 5) {
      return 'Academic year should be within 5 years of current year'
    }
    
    return null
  }

  const validateDates = (startDate: string, endDate: string): { startDate?: string; endDate?: string } => {
    const errors: { startDate?: string; endDate?: string } = {}
    
    if (!startDate) errors.startDate = 'Start date is required'
    if (!endDate) errors.endDate = 'End date is required'
    
    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (start >= end) {
        errors.endDate = 'End date must be after start date'
      }
      
      const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth())
      if (diffMonths < 10 || diffMonths > 14) {
        errors.endDate = 'Academic year should be 10-14 months long'
      }
    }
    
    return errors
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    // Validate academic year name
    const nameError = validateAcademicYearName(formData.name)
    if (nameError) newErrors.name = nameError
    
    // Validate dates
    const dateErrors = validateDates(formData.startDate, formData.endDate)
    Object.assign(newErrors, dateErrors)
    
    // Validate school selection
    if (!formData.schoolId) newErrors.schoolId = 'School selection is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode !== 'view' && validateForm()) {
      onSave(formData)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormData({...formData, name: value})
    
    // Clear error when user starts typing
    if (errors.name) {
      setErrors({...errors, name: ''})
    }
  }

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFormData({...formData, [field]: value})
    
    // Clear date errors when user changes dates
    if (errors[field]) {
      setErrors({...errors, [field]: ''})
    }
  }

  const isReadOnly = mode === 'view'

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Academic Year Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Academic Year Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 transition-colors ${
              errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="e.g., 2024-25"
            required
            readOnly={isReadOnly}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center">
              <span className="mr-1">⚠</span> {errors.name}
            </p>
          )}
          <p className="mt-1 text-xs text-gray-500">Format: YYYY-YY (e.g., 2024-25)</p>
        </div>
        
        {/* School and Branch Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.schoolId}
              onChange={(e) => setFormData({...formData, schoolId: e.target.value, branchId: ''})}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.schoolId ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
              disabled={isReadOnly}
            >
              <option value="">Select School</option>
              {schools.map(school => (
                <option key={school.id} value={school.id}>{school.name}</option>
              ))}
            </select>
            {errors.schoolId && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span> {errors.schoolId}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Branch (Optional)
            </label>
            <select
              value={formData.branchId}
              onChange={(e) => setFormData({...formData, branchId: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              disabled={isReadOnly || !formData.schoolId}
            >
              <option value="">All Branches</option>
              {filteredBranches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">Leave empty to apply to all branches</p>
          </div>
        </div>
        
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <DateInput
              value={formData.startDate}
              onChange={(value) => handleDateChange('startDate', value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
              readOnly={isReadOnly}
            />
            {errors.startDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span> {errors.startDate}
              </p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <DateInput
              value={formData.endDate}
              onChange={(value) => handleDateChange('endDate', value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 ${
                errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              required
              readOnly={isReadOnly}
            />
            {errors.endDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <span className="mr-1">⚠</span> {errors.endDate}
              </p>
            )}
          </div>
        </div>
        
        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description (Optional)
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
            placeholder="Brief description of the academic year..."
            readOnly={isReadOnly}
          />
        </div>
        
        {/* Status Options */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Status Options</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                disabled={isReadOnly}
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Active</span>
                <p className="text-xs text-gray-500">Academic year is available for use</p>
              </div>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({...formData, isCurrent: e.target.checked})}
                className="mr-3 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                disabled={isReadOnly}
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Current Year</span>
                <p className="text-xs text-gray-500">This is the currently active academic year</p>
              </div>
            </label>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {mode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {mode !== 'view' && (
            <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              {mode === 'add' ? 'Create Academic Year' : 'Update Academic Year'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}