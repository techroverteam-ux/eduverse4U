"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IndianRupee, Search, Plus, Edit, Eye, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"

interface FeeStructure {
  id: string
  feeName: string
  amount: number
  frequency: string
  category: string
  className: string
  academicYear: string
  isOptional: boolean
  dueDate: string
}

export default function FeeStructuresPage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [filterClass, setFilterClass] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const { filters, loading: filtersLoading, getFilteredClasses } = useFilters()

  useEffect(() => {
    if (!filtersLoading && filters.schools.length > 0) {
      fetchFeeStructures()
    }
  }, [selectedSchool, filterClass, filtersLoading, filters.schools])

  const fetchFeeStructures = async () => {
    try {
      setLoading(true)
      const schoolId = selectedSchool !== 'all' ? selectedSchool : (localStorage.getItem('schoolId') || filters.schools[0]?.id)
      if (!schoolId) return
      
      const data = await masterAPI.getFeeStructures(
        schoolId, 
        filterClass !== 'all' ? filterClass : undefined
      )
      setFeeStructures(data || [])
    } catch (error) {
      console.error('Failed to fetch fee structures:', error)
      toast.error('Failed to load fee structures')
      setFeeStructures([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this fee structure?')) {
      try {
        await masterAPI.deleteFeeStructure(id)
        toast.success('Fee structure deleted successfully')
        fetchFeeStructures()
      } catch (error) {
        toast.error('Failed to delete fee structure')
      }
    }
  }

  const filteredFees = feeStructures.filter(fee => {
    const matchesSearch = fee.feeName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || fee.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredFees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedFees = filteredFees.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'Tuition': 'bg-blue-100 text-blue-800',
      'Transport': 'bg-green-100 text-green-800',
      'Library': 'bg-purple-100 text-purple-800',
      'Laboratory': 'bg-orange-100 text-orange-800',
      'Sports': 'bg-red-100 text-red-800',
      'Examination': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Fee Structures
            </h1>
            <p className="text-gray-600 mt-1">Setup and manage fee structures</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Structure
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Fees</p>
                <p className="text-3xl font-bold">{feeStructures.length}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Tuition Fees</p>
                <p className="text-3xl font-bold">{feeStructures.filter(f => f.category === 'Tuition').length}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Optional Fees</p>
                <p className="text-3xl font-bold">{feeStructures.filter(f => f.isOptional).length}</p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Amount</p>
                <p className="text-3xl font-bold">₹{Math.round(feeStructures.reduce((sum, f) => sum + f.amount, 0) / 1000)}k</p>
              </div>
              <IndianRupee className="h-8 w-8 text-orange-200" />
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
                placeholder="Search fee structures..."
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
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Tuition">Tuition</option>
                <option value="Transport">Transport</option>
                <option value="Library">Library</option>
                <option value="Laboratory">Laboratory</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fee Structures Grid */}
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
        ) : paginatedFees.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <IndianRupee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No fee structures found</p>
          </div>
        ) : (
          paginatedFees.map((fee) => (
            <Card key={fee.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{fee.feeName}</h3>
                    <p className="text-sm text-gray-500">{fee.className}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(fee.category)}`}>
                    {fee.category}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="text-2xl font-bold text-green-600">₹{fee.amount.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{fee.frequency}</span>
                    {fee.isOptional && <span className="ml-2 px-1 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded">Optional</span>}
                  </div>
                  <div className="text-xs text-gray-500">Due: {new Date(fee.dueDate).toLocaleDateString()}</div>
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
                  <Button variant="outline" size="sm" className="px-2" onClick={() => handleDelete(fee.id)}>
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
                Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFees.length)} of {filteredFees.length}
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