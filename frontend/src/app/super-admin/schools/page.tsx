"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigation } from "@/hooks/useNavigation"
import { 
  Building2, Users, Search, Filter, Plus, Edit, Trash2, 
  Eye, MapPin, Calendar, Crown, CheckCircle, XCircle, Clock,
  ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from "lucide-react"

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

const mockSchools: School[] = [
  {
    id: '1',
    name: 'Delhi Public School',
    location: 'Mumbai, Maharashtra',
    state: 'Maharashtra',
    principal: 'Dr. Rajesh Kumar',
    email: 'principal@dpsmumbai.edu.in',
    phone: '+91 98765 43210',
    students: 2847,
    teachers: 156,
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2023-01-15',
    lastActive: '2024-01-15',
    revenue: 125000
  },
  {
    id: '2',
    name: 'Ryan International School',
    location: 'Delhi, Delhi',
    state: 'Delhi',
    principal: 'Mrs. Priya Sharma',
    email: 'admin@ryandelhi.edu.in',
    phone: '+91 98765 43211',
    students: 1923,
    teachers: 98,
    plan: 'Standard',
    status: 'Active',
    joinedDate: '2023-03-20',
    lastActive: '2024-01-14',
    revenue: 85000
  },
  {
    id: '3',
    name: 'Kendriya Vidyalaya',
    location: 'Bangalore, Karnataka',
    state: 'Karnataka',
    principal: 'Mr. Suresh Reddy',
    email: 'kv.bangalore@gmail.com',
    phone: '+91 98765 43212',
    students: 3421,
    teachers: 187,
    plan: 'Premium',
    status: 'Active',
    joinedDate: '2022-11-10',
    lastActive: '2024-01-15',
    revenue: 145000
  },
  {
    id: '4',
    name: 'DAV Public School',
    location: 'Chennai, Tamil Nadu',
    state: 'Tamil Nadu',
    principal: 'Dr. Meera Nair',
    email: 'dav.chennai@edu.in',
    phone: '+91 98765 43213',
    students: 1567,
    teachers: 89,
    plan: 'Basic',
    status: 'Trial',
    joinedDate: '2024-01-01',
    lastActive: '2024-01-13',
    revenue: 0
  }
]

export default function SuperAdminSchools() {
  const navigation = useNavigation()
  const [schools, setSchools] = useState<School[]>(mockSchools)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterPlan, setFilterPlan] = useState<string>('all')
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         school.principal.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || school.status === filterStatus
    const matchesPlan = filterPlan === 'all' || school.plan === filterPlan
    
    return matchesSearch && matchesStatus && matchesPlan
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSchools.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + itemsPerPage)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
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

  return (
    <div className="space-y-4 p-4 max-w-7xl mx-auto">
      {/* Compact Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Schools Management
          </h1>
          <p className="text-gray-600 text-sm">Manage all schools on the platform</p>
        </div>
        <Button onClick={() => navigation.navigateToAddSchool()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-9 px-4">
          <Plus className="h-4 w-4 mr-2" />
          Add School
        </Button>
      </div>

      {/* Compact Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Total Schools</p>
                <p className="text-xl font-bold text-blue-600">{schools.length}</p>
              </div>
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Active</p>
                <p className="text-xl font-bold text-green-600">
                  {schools.filter(s => s.status === 'Active').length}
                </p>
              </div>
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Trial</p>
                <p className="text-xl font-bold text-yellow-600">
                  {schools.filter(s => s.status === 'Trial').length}
                </p>
              </div>
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">Students</p>
                <p className="text-xl font-bold text-purple-600">
                  {(schools.reduce((sum, s) => sum + s.students, 0) / 1000).toFixed(1)}k
                </p>
              </div>
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compact Filters */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search schools..."
                  className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
            >
              <option value="all">All Plans</option>
              <option value="Premium">Premium</option>
              <option value="Standard">Standard</option>
              <option value="Basic">Basic</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Compact Schools Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-lg">Schools ({filteredSchools.length})</CardTitle>
              <CardDescription className="text-xs">Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredSchools.length)} of {filteredSchools.length}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
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
                    <td className="py-3 px-3">
                      <div>
                        <div className="font-medium text-sm">{school.name}</div>
                        <div className="text-xs text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {school.location}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div>
                        <div className="font-medium text-sm">{school.principal}</div>
                        <div className="text-xs text-gray-500">{school.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-sm">{school.students.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{school.teachers} teachers</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(school.plan)}`}>
                        {school.plan}
                        {school.plan === 'Premium' && <Crown className="h-3 w-3 ml-1 inline" />}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(school.status)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                          {school.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="font-medium text-sm">₹{(school.revenue / 1000).toFixed(0)}k</div>
                      <div className="text-xs text-gray-500">Monthly</div>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => setSelectedSchool(school)}>
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600 hover:text-red-700">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t bg-gray-50">
              <div className="text-xs text-gray-600">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                >
                  <ChevronsLeft className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-3 w-3" />
                </Button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i;
                  if (pageNum <= totalPages) {
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "ghost"}
                        size="sm"
                        className="h-7 w-7 p-0 text-xs"
                        onClick={() => goToPage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  }
                  return null;
                })}
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronsRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* School Details Modal */}
      {selectedSchool && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">{selectedSchool.name}</h2>
              <Button variant="ghost" onClick={() => setSelectedSchool(null)}>
                <XCircle className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">School Information</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Location:</span> {selectedSchool.location}</div>
                  <div><span className="font-medium">Principal:</span> {selectedSchool.principal}</div>
                  <div><span className="font-medium">Email:</span> {selectedSchool.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedSchool.phone}</div>
                  <div><span className="font-medium">Joined:</span> {selectedSchool.joinedDate}</div>
                  <div><span className="font-medium">Last Active:</span> {selectedSchool.lastActive}</div>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3">Statistics</h3>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Students:</span> {selectedSchool.students.toLocaleString()}</div>
                  <div><span className="font-medium">Teachers:</span> {selectedSchool.teachers}</div>
                  <div><span className="font-medium">Plan:</span> {selectedSchool.plan}</div>
                  <div><span className="font-medium">Status:</span> {selectedSchool.status}</div>
                  <div><span className="font-medium">Monthly Revenue:</span> ₹{selectedSchool.revenue.toLocaleString()}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedSchool(null)}>
                Close
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                Edit School
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}