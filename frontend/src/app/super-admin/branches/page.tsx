"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, Users, Search, Plus, Edit, Eye, MapPin, User, Phone, Mail, Grid3X3, List, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Trash2, MoreVertical } from "lucide-react"
import { superAdminAPI } from "@/lib/api/super-admin"
import { toast } from "@/components/ui/toast"

interface Branch {
  id: string
  schoolId: string
  schoolName: string
  name: string
  address: string
  city: string
  state: string
  principal: string
  email: string
  phone: string
  students: number
  teachers: number
  status: 'Active' | 'Inactive'
}

export default function BranchesManagement() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [schools, setSchools] = useState<any[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [selectedBranches, setSelectedBranches] = useState<string[]>([])

  useEffect(() => {
    fetchBranches()
    fetchSchools()
  }, [])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const data = await superAdminAPI.getAllBranches()
      setBranches(data || [])
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      setBranches([])
      toast.error('Failed to load branches')
    } finally {
      setLoading(false)
    }
  }

  const fetchSchools = async () => {
    try {
      const data = await superAdminAPI.getAllSchools()
      setSchools(data || [])
    } catch (error) {
      console.error('Failed to fetch schools:', error)
      setSchools([])
    }
  }

  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSchool = selectedSchool === 'all' || branch.schoolId === selectedSchool
    return matchesSearch && matchesSchool
  })

  const totalPages = Math.ceil(filteredBranches.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBranches = filteredBranches.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const toggleBranchSelection = (branchId: string) => {
    setSelectedBranches(prev => 
      prev.includes(branchId) 
        ? prev.filter(id => id !== branchId)
        : [...prev, branchId]
    )
  }

  const selectAllBranches = () => {
    setSelectedBranches(paginatedBranches.map(b => b.id))
  }

  const clearSelection = () => {
    setSelectedBranches([])
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Branches Management
            </h1>
            <p className="text-gray-600 mt-1">Manage all school branches across the platform</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Branches</p>
                <p className="text-3xl font-bold">{branches.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Active Branches</p>
                <p className="text-3xl font-bold">{branches.filter(b => b.status === 'Active').length}</p>
              </div>
              <Building2 className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">{branches.reduce((sum, b) => sum + b.students, 0)}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Schools</p>
                <p className="text-3xl font-bold">{schools.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-orange-200" />
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
                placeholder="Search branches..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 min-w-[200px]"
                value={selectedSchool}
                onChange={(e) => setSelectedSchool(e.target.value)}
              >
                <option value="all">All Schools</option>
                {schools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
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
          {selectedBranches.length > 0 && (
            <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mt-4">
              <span className="text-sm text-blue-700">
                {selectedBranches.length} branch{selectedBranches.length > 1 ? 'es' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearSelection}>
                  Clear
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Branches Content */}
      <Card>
        <CardHeader className="pb-4 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Branches Directory</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBranches.length)} of {filteredBranches.length} branches
              </p>
            </div>
            {viewMode === 'list' && (
              <Button variant="outline" size="sm" onClick={selectAllBranches}>
                Select All
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading branches...</p>
            </div>
          ) : filteredBranches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No branches found</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {paginatedBranches.map((branch) => (
                <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{branch.name}</CardTitle>
                        <p className="text-sm text-gray-500">{branch.schoolName}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        branch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {branch.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{branch.address}, {branch.city}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="h-4 w-4 mr-2" />
                      <span>{branch.principal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {branch.students} students
                      </span>
                      <span>{branch.teachers} teachers</span>
                    </div>
                    <div className="flex space-x-2 pt-2">
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">
                      <input
                        type="checkbox"
                        checked={selectedBranches.length === paginatedBranches.length}
                        onChange={selectedBranches.length === paginatedBranches.length ? clearSelection : selectAllBranches}
                        className="rounded"
                      />
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Branch</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">School</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Principal</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Students</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedBranches.map((branch) => (
                    <tr key={branch.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedBranches.includes(branch.id)}
                          onChange={() => toggleBranchSelection(branch.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-semibold text-gray-900">{branch.name}</div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {branch.address}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-medium text-gray-900">{branch.schoolName}</div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{branch.principal}</div>
                          <div className="text-sm text-gray-500">{branch.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{branch.students}</div>
                        <div className="text-sm text-gray-500">{branch.teachers} teachers</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          branch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {branch.status}
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
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {filteredBranches.length > itemsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredBranches.length)} of {filteredBranches.length}
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                </select>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="outline" size="sm" onClick={() => goToPage(1)} disabled={currentPage === 1}>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
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
                <Button variant="outline" size="sm" onClick={() => goToPage(totalPages)} disabled={currentPage === totalPages}>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}