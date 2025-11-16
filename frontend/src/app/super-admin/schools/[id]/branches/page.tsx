"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, Plus, Edit, Eye, Trash2, MapPin, Users, User } from "lucide-react"
import { superAdminAPI } from "@/lib/api/super-admin"
import { toast } from "@/components/ui/toast"

export default function SchoolBranchesPage() {
  const params = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<any>(null)
  const [branches, setBranches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchoolAndBranches()
  }, [params.id])

  const fetchSchoolAndBranches = async () => {
    try {
      setLoading(true)
      const [schoolData, branchesData] = await Promise.all([
        superAdminAPI.getSchool(params.id as string),
        superAdminAPI.getSchoolBranches(params.id as string)
      ])
      setSchool(schoolData)
      setBranches(branchesData || [])
    } catch (error) {
      console.error('Failed to fetch data:', error)
      toast.error('Failed to load school branches')
    } finally {
      setLoading(false)
    }
  }

  const handleAddBranch = () => {
    router.push(`/super-admin/schools/${params.id}/branches/add`)
  }

  const handleEditBranch = (branchId: string) => {
    router.push(`/super-admin/schools/${params.id}/branches/edit/${branchId}`)
  }

  const handleViewBranch = (branchId: string) => {
    router.push(`/super-admin/schools/${params.id}/branches/view/${branchId}`)
  }

  const handleDeleteBranch = async (branchId: string) => {
    if (confirm('Are you sure you want to delete this branch?')) {
      try {
        await superAdminAPI.deleteBranch(branchId)
        setBranches(prev => prev.filter(b => b.id !== branchId))
        toast.success('Branch deleted successfully')
      } catch (error) {
        toast.error('Failed to delete branch')
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading branches...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div>
            <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Schools
            </Button>
            <h1 className="text-3xl font-bold">School Branches</h1>
            <p className="text-purple-100 mt-1">{school?.name}</p>
          </div>
          <Button 
            onClick={handleAddBranch}
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Branch
          </Button>
        </div>
      </div>

      {/* Branches List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              Branches ({branches.length})
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {branches.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No branches found for this school</p>
              <Button onClick={handleAddBranch} className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Add First Branch
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {branches.map((branch) => (
                <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{branch.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        branch.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {branch.status || 'Active'}
                      </span>
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{branch.address || 'Address not provided'}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{branch.students || 0} students</span>
                      </div>
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{branch.branchManager || 'Manager not assigned'}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleViewBranch(branch.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={() => handleEditBranch(branch.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleDeleteBranch(branch.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}