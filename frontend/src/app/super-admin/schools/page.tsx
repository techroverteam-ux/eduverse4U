"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/hooks/useNavigation"
import { 
  Building2, Users, Search, Filter, Plus, Edit, Trash2, 
  Eye, MapPin, Calendar, Crown, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, AlertCircle, FileText,
  Sparkles, TrendingUp, Award, Shield, User, X
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { useSchoolToast } from "@/hooks/useToast"
import { SchoolsLoadingState, EmptyState, ErrorState, LoadingSpinner } from "@/components/ui/loading-states"

interface School {
  id: string
  name: string
  location: string
  state: string
  principal: string
  email: string
  phone: string
  students: number
  teachers: number
  plan: 'Basic' | 'Standard' | 'Premium'
  status: 'Active' | 'Inactive' | 'Trial' | 'Suspended'
  joinedDate: string
  lastActive: string
  revenue: number
}

import { superAdminAPI } from "@/lib/api/super-admin"

export default function SuperAdminSchools() {
  const navigation = useNavigation()
  const schoolToast = useSchoolToast()
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [showBranches, setShowBranches] = useState(false)
  const [selectedSchoolForBranches, setSelectedSchoolForBranches] = useState<string | null>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [isExporting, setIsExporting] = useState(false)

  // Fetch schools data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const filters = {
          status: filterStatus !== 'all' ? filterStatus : undefined,
          plan: filterPlan !== 'all' ? filterPlan : undefined,
          search: searchTerm || undefined
        }
        
        const data = await superAdminAPI.getAllSchools(filters)
        setSchools(data)
        setTotalCount(data.length)
        
      } catch (err: any) {
        console.error('Failed to fetch schools:', err)
        setError('Failed to load schools data')
        setSchools([])
        setTotalCount(0)
      } finally {
        setLoading(false)
      }
    }

    const timeoutId = setTimeout(fetchSchools, searchTerm ? 500 : 0)
    return () => clearTimeout(timeoutId)
  }, [filterStatus, filterPlan, searchTerm])

  const handleDeleteSchool = async (schoolId: string) => {
    const school = schools.find(s => s.id === schoolId)
    if (!school) return

    if (confirm(`⚠️ Delete ${school.name}?\n\nThis will permanently remove:\n• All school data\n• Student records\n• Teacher accounts\n• Financial records\n\nThis action cannot be undone.`)) {
      const deletePromise = superAdminAPI.deleteSchool(schoolId)
      
      toast.promise(deletePromise, {
        loading: `Removing ${school.name} from platform...`,
        success: () => {
          setSchools(prev => prev.filter(s => s.id !== schoolId))
          return `${school.name} has been permanently removed`
        },
        error: (err) => `Failed to delete ${school.name}: ${err.message || 'Server error occurred'}`
      })
    }
  }

  const handleUpdateSchoolStatus = async (schoolId: string, newStatus: string) => {
    const school = schools.find(s => s.id === schoolId)
    if (!school) return

    const updatePromise = superAdminAPI.updateSchool(schoolId, { status: newStatus })
    
    toast.promise(updatePromise, {
      loading: `Updating ${school.name} status...`,
      success: () => {
        setSchools(prev => prev.map(s => 
          s.id === schoolId ? { ...s, status: newStatus as any } : s
        ))
        schoolToast.schoolStatusChanged(school.name, newStatus)
        return ''
      },
      error: (err) => `Status update failed: ${err.message || 'Please try again'}`
    })
  }

  const handleExportSchools = async (format: 'csv' | 'excel' | 'pdf' = 'csv') => {
    setIsExporting(true)
    
    try {
      // Simulate export process
      await new Promise(resolve => setTimeout(resolve, 2000))
      schoolToast.exportComplete(format, filteredSchools.length)
    } catch (error) {
      toast.error('Export Failed', 'Unable to export schools data. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const handleBulkStatusUpdate = async (schoolIds: string[], newStatus: string) => {
    const updatePromise = Promise.all(
      schoolIds.map(id => superAdminAPI.updateSchool(id, { status: newStatus }))
    )
    
    toast.promise(updatePromise, {
      loading: `Updating ${schoolIds.length} schools...`,
      success: () => {
        setSchools(prev => prev.map(school => 
          schoolIds.includes(school.id) ? { ...school, status: newStatus as any } : school
        ))
        schoolToast.bulkAction(`Status changed to ${newStatus}`, schoolIds.length)
        return ''
      },
      error: 'Bulk update failed. Some schools may not have been updated.'
    })
  }

  // Client-side pagination
  const totalPages = Math.ceil(totalCount / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSchools = schools.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages))
    setCurrentPage(newPage)
    toast.info(`Page ${newPage}`, `Viewing page ${newPage} of ${totalPages}`)
  }

  const fetchBranches = async (schoolId: string) => {
    try {
      const response = await superAdminAPI.getSchoolBranches(schoolId)
      setBranches(response || [])
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      setBranches([])
      toast.error('Failed to load branches', 'Unable to fetch school branches')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'Inactive': return <XCircle className="h-4 w-4 text-red-600" />
      case 'Trial': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'Suspended': return <XCircle className="h-4 w-4 text-red-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'Trial': return 'bg-yellow-100 text-yellow-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'Premium': return 'bg-purple-100 text-purple-800'
      case 'Standard': return 'bg-blue-100 text-blue-800'
      case 'Basic': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // Show full loading state on initial load
  if (loading && schools.length === 0) {
    return <SchoolsLoadingState />
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Enhanced Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Schools Management
            </h1>
            <p className="text-gray-600 mt-1">Manage and monitor all schools on the platform</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center">
                <Building2 className="h-4 w-4 mr-1" />
                {totalCount.toLocaleString()} Total Schools
              </span>
              <span className="flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {schools.reduce((sum, s) => sum + (s.students || 0), 0).toLocaleString()} Students
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="border-purple-200 text-purple-700 hover:bg-purple-50"
              onClick={() => handleExportSchools('csv')}
              disabled={isExporting}
            >
              {isExporting ? (
                <LoadingSpinner size="sm" color="purple" />
              ) : (
                <FileText className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button 
              onClick={() => {
                navigation.navigateToAddSchool()
                toast.info('🏫 New School Registration', 'Opening school registration form')
              }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Schools</p>
                <p className="text-3xl font-bold">{totalCount.toLocaleString()}</p>
                <p className="text-blue-100 text-xs mt-1">+12% from last month</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Building2 className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Active Schools</p>
                <p className="text-3xl font-bold">{schools.filter(s => s.status === 'Active').length}</p>
                <p className="text-green-100 text-xs mt-1">98.5% uptime</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-500 to-orange-500 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Trial Schools</p>
                <p className="text-3xl font-bold">{schools.filter(s => s.status === 'Trial' || s.status === 'Pending').length}</p>
                <p className="text-yellow-100 text-xs mt-1">85% conversion rate</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Clock className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Students</p>
                <p className="text-3xl font-bold">{(schools.reduce((sum, s) => sum + (s.students || 0), 0) / 1000).toFixed(1)}k</p>
                <p className="text-purple-100 text-xs mt-1">Across all schools</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Users className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Filters */}
      <Card className="bg-white border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search schools by name, location, or principal..."
                  className="w-full pl-12 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white transition-colors min-w-[120px]"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Pending">Pending</option>
                <option value="Inactive">Inactive</option>
              </select>
              <select
                className="px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white transition-colors min-w-[120px]"
                value={filterPlan}
                onChange={(e) => setFilterPlan(e.target.value)}
              >
                <option value="all">All Plans</option>
                <option value="premium">Premium</option>
                <option value="standard">Standard</option>
                <option value="basic">Basic</option>
              </select>
              <Button 
                variant="outline" 
                className="px-4 py-3 border-gray-200 hover:bg-gray-50"
                onClick={() => setShowBranches(true)}
              >
                <Building2 className="h-4 w-4 mr-2" />
                Branches
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Schools Table */}
      <Card className="bg-white border-0 shadow-lg">
        <CardHeader className="pb-4 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-semibold">Schools Directory</CardTitle>
              <CardDescription className="text-sm text-gray-600 mt-1">
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, totalCount)} of {totalCount.toLocaleString()} schools
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <LoadingSpinner size="lg" color="purple" />
                  <p className="mt-4 text-gray-600 font-medium">Loading schools data...</p>
                  <p className="text-sm text-gray-500 mt-1">Please wait while we fetch the latest information</p>
                </div>
              </div>
            ) : error ? (
              <ErrorState
                title="Failed to Load Schools"
                description={error}
                onRetry={() => {
                  setError(null)
                  setLoading(true)
                  // Trigger refetch
                  window.location.reload()
                }}
              />
            ) : paginatedSchools.length === 0 ? (
              <EmptyState
                icon={Building2}
                title={searchTerm || filterStatus !== 'all' || filterPlan !== 'all' ? 'No matching schools found' : 'No schools registered yet'}
                description={searchTerm || filterStatus !== 'all' || filterPlan !== 'all' 
                  ? 'Try adjusting your search criteria or filters to find schools.'
                  : 'Start by adding your first school to the platform.'}
                action={
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {(searchTerm || filterStatus !== 'all' || filterPlan !== 'all') && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setSearchTerm('')
                          setFilterStatus('all')
                          setFilterPlan('all')
                          toast.info('Filters Cleared', 'Showing all schools')
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button 
                      onClick={() => {
                        navigation.navigateToAddSchool()
                        toast.info('🏫 Add School', 'Opening school registration wizard')
                      }}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add First School
                    </Button>
                  </div>
                }
              />
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">School</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Principal</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Students</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Plan</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Status</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Revenue</th>
                    <th className="text-left py-2 px-3 text-xs font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedSchools.map((school) => (
                    <tr key={school.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                            {school.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{school.name}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <MapPin className="h-3 w-3 mr-1" />
                              {school.location}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{school.principal}</div>
                          <div className="text-sm text-gray-500">{school.email}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">{school.students?.toLocaleString() || 0}</div>
                        <div className="text-sm text-gray-500">{school.teachers || 0} teachers</div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(school.plan || school.selectedPackage)}`}>
                          {school.plan || school.selectedPackage}
                          {(school.plan === 'Premium' || school.selectedPackage === 'premium') && <Crown className="h-3 w-3 ml-1 inline" />}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(school.status)}
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(school.status)}`}>
                            {school.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900">₹{((school.revenue || school.monthlyRevenue || 0) / 1000).toFixed(0)}k</div>
                        <div className="text-sm text-gray-500">Monthly</div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex space-x-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 transform hover:scale-110 group" 
                            onClick={() => {
                              setSelectedSchool(school)
                              toast.info('📋 School Profile', `Opening detailed view for ${school.name}`, {
                                label: 'View Dashboard',
                                onClick: () => navigation.navigateTo(`/schools/${school.id}/dashboard`)
                              })
                            }}
                          >
                            <Eye className="h-4 w-4 group-hover:animate-pulse" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600 transition-all duration-200 transform hover:scale-110 group" 
                            onClick={() => {
                              navigation.navigateTo(`/super-admin/schools/edit/${school.id}`)
                              toast.info('✏️ Edit Mode', `Modifying ${school.name} settings and information`, {
                                label: 'Quick Edit',
                                onClick: () => toast.info('Quick Edit', 'Opening quick edit panel...')
                              })
                            }}
                          >
                            <Edit className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200 transform hover:scale-110 group"
                            onClick={() => {
                              setSelectedSchoolForBranches(school.id)
                              fetchBranches(school.id)
                              setShowBranches(true)
                            }}
                          >
                            <Building2 className="h-4 w-4 group-hover:rotate-12 transition-transform duration-200" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600 transition-all duration-200 transform hover:scale-110 group"
                            onClick={() => handleDeleteSchool(school.id)}
                          >
                            <Trash2 className="h-4 w-4 group-hover:animate-bounce" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          
          {/* Pagination */}
          {totalCount > 5 && (
            <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t bg-white">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="text-sm font-medium text-gray-700">
                  Showing <span className="font-semibold text-purple-600">{startIndex + 1}</span> to <span className="font-semibold text-purple-600">{Math.min(startIndex + itemsPerPage, totalCount)}</span> of <span className="font-semibold text-purple-600">{totalCount.toLocaleString()}</span> schools
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value))
                      setCurrentPage(1)
                    }}
                    className="text-sm border border-gray-300 rounded-lg px-3 py-1.5 bg-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1 mx-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (pageNum <= totalPages) {
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "ghost"}
                          size="sm"
                          className={`h-9 w-9 p-0 text-sm font-medium transition-all duration-200 ${
                            currentPage === pageNum 
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                              : 'hover:bg-purple-50 hover:text-purple-700 text-gray-700'
                          }`}
                          onClick={() => goToPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    }
                    return null
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-9 px-3 border-gray-300 hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced School Details Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold">{selectedSchool.name}</h2>
                  <p className="text-purple-100 mt-1">{selectedSchool.id}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => window.print()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Print
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={() => setSelectedSchool(null)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(95vh-180px)]">
              {/* Overview Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{selectedSchool.students?.toLocaleString()}</div>
                    <div className="text-sm text-blue-700">Total Students</div>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">{selectedSchool.teachers}</div>
                    <div className="text-sm text-green-700">Total Teachers</div>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4 text-center">
                    <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">₹{((selectedSchool.revenue || 0) / 1000).toFixed(0)}k</div>
                    <div className="text-sm text-purple-700">Monthly Revenue</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                      School Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium text-gray-600">School Name:</span></div>
                      <div className="font-medium">{selectedSchool.name}</div>
                      
                      <div><span className="font-medium text-gray-600">Location:</span></div>
                      <div className="font-medium">{selectedSchool.location}</div>
                      
                      <div><span className="font-medium text-gray-600">State:</span></div>
                      <div className="font-medium">{selectedSchool.state}</div>
                      
                      <div><span className="font-medium text-gray-600">Phone:</span></div>
                      <div className="font-medium">{selectedSchool.phone}</div>
                      
                      <div><span className="font-medium text-gray-600">Email:</span></div>
                      <div className="font-medium">{selectedSchool.email}</div>
                      
                      <div><span className="font-medium text-gray-600">Principal:</span></div>
                      <div className="font-medium">{selectedSchool.principal}</div>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription & Status */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                      Subscription Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="font-medium text-gray-600">Current Plan:</span></div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPlanColor(selectedSchool.plan)}`}>
                          {selectedSchool.plan}
                        </span>
                      </div>
                      
                      <div><span className="font-medium text-gray-600">Status:</span></div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedSchool.status)}`}>
                          {selectedSchool.status}
                        </span>
                      </div>
                      
                      <div><span className="font-medium text-gray-600">Monthly Revenue:</span></div>
                      <div className="font-medium text-green-600">₹{(selectedSchool.revenue || 0).toLocaleString()}</div>
                      
                      <div><span className="font-medium text-gray-600">Joined Date:</span></div>
                      <div className="font-medium">{selectedSchool.joinedDate}</div>
                      
                      <div><span className="font-medium text-gray-600">Last Active:</span></div>
                      <div className="font-medium">{selectedSchool.lastActive}</div>
                      
                      <div><span className="font-medium text-gray-600">Students:</span></div>
                      <div className="font-medium">{selectedSchool.students.toLocaleString()}</div>
                      
                      <div><span className="font-medium text-gray-600">Teachers:</span></div>
                      <div className="font-medium">{selectedSchool.teachers}</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Footer Actions */}
            <div className="border-t bg-gray-50 px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={() => setSelectedSchool(null)}>
                Close
              </Button>
              <div className="flex space-x-3">
                <Button variant="outline" onClick={() => window.print()}>
                  <FileText className="h-4 w-4 mr-2" />
                  Print Receipt
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600" onClick={() => navigation.navigateTo(`/super-admin/schools/edit/${selectedSchool.id}`)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit School
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Branches Modal */}
      {showBranches && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">School Branches</h2>
                  <p className="text-purple-100 mt-1">Manage all branches for this school</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-white hover:bg-white/20" 
                  onClick={() => setShowBranches(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              {branches.length === 0 ? (
                <div className="text-center py-8">
                  <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No branches found for this school</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Branch
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {branches.map((branch, index) => (
                    <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900">{branch.name || `Branch ${index + 1}`}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          branch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {branch.status || 'Active'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{branch.address || 'Address not provided'}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{branch.students || 0} students</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>{branch.principal || 'Principal not assigned'}</span>
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
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t bg-gray-50 px-6 py-4 flex justify-between">
              <Button variant="outline" onClick={() => setShowBranches(false)}>
                Close
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add New Branch
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}