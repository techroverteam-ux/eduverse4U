"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Users, Search, Plus, Edit, Eye, Trash2, Upload, Download, 
  Grid3X3, List, ChevronLeft, ChevronRight, X, Save, 
  Phone, Mail, MapPin, Calendar, User, BookOpen, Building2,
  FileText, Filter, RefreshCw
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"

interface Student {
  id: string
  rollNumber: string
  admissionNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: 'Male' | 'Female' | 'Other'
  fatherName: string
  motherName: string
  parentPhone: string
  parentEmail: string
  address: string
  admissionDate: string
  classId: string
  className: string
  academicYearId: string
  academicYearName: string
  branchId: string
  branchName: string
  schoolId: string
  schoolName: string
  status: 'Active' | 'Inactive' | 'Transferred' | 'Graduated'
  photoUrl?: string
  bloodGroup?: string
  religion?: string
  caste?: string
  category?: string
  aadharNumber?: string
  previousSchool?: string
  transportRequired?: boolean
  hostelRequired?: boolean
  medicalConditions?: string
  emergencyContact?: string
  guardianName?: string
  guardianPhone?: string
  guardianRelation?: string
}

export default function StudentsPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterBranch, setFilterBranch] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const { filters, loading: filtersLoading, getFilteredBranches, getFilteredClasses } = useFilters()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(15)
  const [selectedStudents, setSelectedStudents] = useState<string[]>([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)

  useEffect(() => {
    if (!filtersLoading && filters.schools.length > 0) {
      fetchStudents()
    }
  }, [searchTerm, filterClass, filterBranch, filterStatus, selectedSchool, filtersLoading, filters.schools])

  useEffect(() => {
    setFilterBranch('all')
    setFilterClass('all')
    if (selectedSchool !== 'all') {
      setFormData(prev => ({ ...prev, schoolId: selectedSchool }))
    }
  }, [selectedSchool])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const schoolId = selectedSchool !== 'all' ? selectedSchool : (localStorage.getItem('schoolId') || filters.schools[0]?.id)
      if (!schoolId) return
      
      const data = await masterAPI.getStudents(
        schoolId, 
        filterBranch !== 'all' ? filterBranch : undefined, 
        filterClass !== 'all' ? filterClass : undefined, 
        searchTerm
      )
      setStudents(data || [])
    } catch (error) {
      console.error('Failed to fetch students:', error)
      toast.error('Failed to load students', 'Please check your connection and try again')
      setStudents([])
    } finally {
      setLoading(false)
    }
  }

  const handleEditStudent = async (updatedData: any) => {
    try {
      if (!selectedStudent) return
      
      await masterAPI.updateStudent(selectedStudent.id, updatedData)
      toast.success('Student updated successfully', 'Student information has been updated')
      setShowEditModal(false)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to update student', 'Please check the details and try again')
    }
  }

  const handleDeleteStudent = async (id: string) => {
    if (confirm('Are you sure you want to delete this student? This action cannot be undone.')) {
      try {
        await masterAPI.deleteStudent(id)
        toast.success('Student deleted successfully', 'Student record has been removed')
        fetchStudents()
      } catch (error) {
        toast.error('Failed to delete student', 'Please try again later')
      }
    }
  }

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const schoolId = selectedSchool !== 'all' ? selectedSchool : localStorage.getItem('schoolId') || filters.schools[0]?.id
      if (!schoolId) {
        toast.error('No school selected', 'Please select a school first')
        return
      }

      await masterAPI.bulkUploadStudents(file, schoolId)
      toast.success('Students uploaded successfully', `${file.name} has been processed`)
      fetchStudents()
    } catch (error) {
      toast.error('Failed to upload students', 'Please check the file format and try again')
    }
    event.target.value = ''
  }

  const downloadTemplate = async () => {
    try {
      const blob = await masterAPI.getStudentsTemplate()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'students-template.xlsx'
      a.click()
      window.URL.revokeObjectURL(url)
      toast.success('Template downloaded', 'Excel template is ready for use')
    } catch (error) {
      toast.error('Failed to download template', 'Please try again later')
    }
  }

  const openEditModal = (student: Student) => {
    setSelectedStudent(student)
    setShowEditModal(true)
  }

  const openViewModal = (student: Student) => {
    setSelectedStudent(student)
    setShowViewModal(true)
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedStudents = filteredStudents.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Transferred': return 'bg-blue-100 text-blue-800'
      case 'Graduated': return 'bg-purple-100 text-purple-800'
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
              Students Management
            </h1>
            <p className="text-gray-600 mt-1">Manage student records and enrollment</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={downloadTemplate}>
              <Download className="h-4 w-4 mr-2" />
              Template
            </Button>
            <Button variant="outline" onClick={() => document.getElementById('bulk-upload')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
            <input
              id="bulk-upload"
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleBulkUpload}
            />
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600"
              onClick={() => router.push('/master/students/add')}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Student
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
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{students.length}</p>
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
                <p className="text-3xl font-bold">{students.filter(s => s.status === 'Active').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm">This Month</p>
                <p className="text-3xl font-bold">{students.filter(s => new Date(s.admissionDate).getMonth() === new Date().getMonth()).length}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Schools</p>
                <p className="text-3xl font-bold">{filters.schools.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-200" />
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
                placeholder="Search students by name, roll number, or admission number..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
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
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[150px]"
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                disabled={filtersLoading || selectedSchool === 'all'}
              >
                <option value="all">All Classes</option>
                {getFilteredClasses(selectedSchool).map(cls => (
                  <option key={cls.id} value={cls.id}>{cls.name}</option>
                ))}
              </select>
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[120px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Transferred">Transferred</option>
                <option value="Graduated">Graduated</option>
              </select>
              <Button variant="outline" onClick={fetchStudents}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Students Directory ({filteredStudents.length})</span>
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
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : viewMode === 'list' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Student</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Class & Branch</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Contact</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedStudents.map((student) => (
                    <tr key={student.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          {student.photoUrl ? (
                            <img 
                              src={student.photoUrl} 
                              alt={`${student.firstName} ${student.lastName}`}
                              className="w-10 h-10 rounded-full object-cover border-2 border-purple-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-semibold text-gray-900">{student.firstName} {student.lastName}</div>
                            <div className="text-sm text-gray-500">Roll: {student.rollNumber}</div>
                            <div className="text-xs text-gray-400">Adm: {student.admissionNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{student.className}</div>
                          <div className="text-gray-500">{student.branchName}</div>
                          <div className="text-xs text-gray-400">{student.schoolName}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-sm">
                          <div className="flex items-center text-gray-900">
                            <Phone className="h-3 w-3 mr-1" />
                            {student.parentPhone}
                          </div>
                          <div className="flex items-center text-gray-500 mt-1">
                            <Mail className="h-3 w-3 mr-1" />
                            {student.parentEmail}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => openViewModal(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => openEditModal(student)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {paginatedStudents.map((student) => (
                <Card key={student.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      {student.photoUrl ? (
                        <img 
                          src={student.photoUrl} 
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                          {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{student.firstName} {student.lastName}</h3>
                        <p className="text-sm text-gray-500">Roll: {student.rollNumber}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        {student.className}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Building2 className="h-4 w-4 mr-2" />
                        {student.branchName}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {student.parentPhone}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(student.status)}`}>
                        {student.status}
                      </span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openViewModal(student)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => openEditModal(student)}>
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => handleDeleteStudent(student.id)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredStudents.length)} of {filteredStudents.length}
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

      {/* Edit Student Modal */}
      {showEditModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Quick Edit Student</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEditModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">For detailed editing, please use the dedicated edit page.</p>
              <div className="flex space-x-3">
                <Button 
                  onClick={() => {
                    setShowEditModal(false)
                    router.push(`/master/students/edit/${selectedStudent.id}`)
                  }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Open Full Editor
                </Button>
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Student Modal */}
      {showViewModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-900">Student Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-6 mb-6">
                {selectedStudent.photoUrl ? (
                  <img 
                    src={selectedStudent.photoUrl} 
                    alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-200"
                  />
                ) : (
                  <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                    {selectedStudent.firstName.charAt(0)}{selectedStudent.lastName.charAt(0)}
                  </div>
                )}
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{selectedStudent.firstName} {selectedStudent.lastName}</h3>
                  <p className="text-gray-600">Roll Number: {selectedStudent.rollNumber}</p>
                  <p className="text-gray-600">Admission Number: {selectedStudent.admissionNumber}</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-2 ${getStatusColor(selectedStudent.status)}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Academic Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">School:</span> {selectedStudent.schoolName}</div>
                    <div><span className="font-medium">Branch:</span> {selectedStudent.branchName}</div>
                    <div><span className="font-medium">Class:</span> {selectedStudent.className}</div>
                    <div><span className="font-medium">Academic Year:</span> {selectedStudent.academicYearName}</div>
                    <div><span className="font-medium">Admission Date:</span> {new Date(selectedStudent.admissionDate).toLocaleDateString()}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Personal Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Date of Birth:</span> {new Date(selectedStudent.dateOfBirth).toLocaleDateString()}</div>
                    <div><span className="font-medium">Gender:</span> {selectedStudent.gender}</div>
                    <div><span className="font-medium">Blood Group:</span> {selectedStudent.bloodGroup || 'Not specified'}</div>
                    <div><span className="font-medium">Religion:</span> {selectedStudent.religion || 'Not specified'}</div>
                    <div><span className="font-medium">Category:</span> {selectedStudent.category || 'General'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Parent Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Father's Name:</span> {selectedStudent.fatherName}</div>
                    <div><span className="font-medium">Mother's Name:</span> {selectedStudent.motherName}</div>
                    <div><span className="font-medium">Phone:</span> {selectedStudent.parentPhone}</div>
                    <div><span className="font-medium">Email:</span> {selectedStudent.parentEmail}</div>
                    <div><span className="font-medium">Guardian:</span> {selectedStudent.guardianName || 'Not specified'}</div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Address:</span> {selectedStudent.address}</div>
                    <div><span className="font-medium">Emergency Contact:</span> {selectedStudent.emergencyContact || 'Not specified'}</div>
                    <div><span className="font-medium">Transport Required:</span> {selectedStudent.transportRequired ? 'Yes' : 'No'}</div>
                    <div><span className="font-medium">Hostel Required:</span> {selectedStudent.hostelRequired ? 'Yes' : 'No'}</div>
                  </div>
                </div>
              </div>

              {selectedStudent.medicalConditions && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Medical Information</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">{selectedStudent.medicalConditions}</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 p-6 border-t">
              <Button variant="outline" onClick={() => setShowViewModal(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setShowViewModal(false)
                openEditModal(selectedStudent)
              }} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Edit className="h-4 w-4 mr-2" />
                Edit Student
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}