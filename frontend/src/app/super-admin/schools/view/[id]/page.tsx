"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Building2, Users, Crown, Edit, FileText, Download } from "lucide-react"
import { superAdminAPI } from "@/lib/api/super-admin"
import { toast } from "@/components/ui/toast"
import { generatePDFReceipt } from "@/components/ui/pdf-receipt"

export default function ViewSchoolPage() {
  const params = useParams()
  const router = useRouter()
  const [school, setSchool] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchool()
  }, [params.id])

  const fetchSchool = async () => {
    try {
      setLoading(true)
      const data = await superAdminAPI.getSchool(params.id as string)
      setSchool(data)
    } catch (error) {
      console.error('Failed to fetch school:', error)
      toast.error('Failed to load school details')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading school details...</p>
        </div>
      </div>
    )
  }

  if (!school) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">School not found</p>
          <Button onClick={() => router.back()} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-4">
            <div>
              <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/20 mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Schools
              </Button>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center">
                  {school.logo ? (
                    <img 
                      src={school.logo} 
                      alt={`${school.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-white">{school.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{school.name}</h1>
                  <p className="text-purple-100 mt-1">School ID: {school.id}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20" 
              onClick={() => {
                generatePDFReceipt({
                  school: {
                    id: school.id,
                    name: school.name,
                    logo: school.logo,
                    email: school.email,
                    phone: school.phone,
                    location: school.location
                  },
                  receiptNumber: `REC-${Date.now()}`,
                  date: new Date().toLocaleDateString(),
                  amount: school.monthlyRevenue || 0,
                  plan: school.selectedPackage || 'Basic',
                  description: 'Monthly Subscription Fee',
                  status: 'Paid'
                })
                toast.success('Receipt Generated', 'PDF receipt has been downloaded')
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Receipt
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => window.print()}>
              <FileText className="h-4 w-4 mr-2" />
              Print
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={() => router.push(`/super-admin/schools/edit/${school.id}`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit School
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{school.students?.toLocaleString() || 0}</div>
            <div className="text-sm text-blue-700">Total Students</div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{school.teachers || 0}</div>
            <div className="text-sm text-green-700">Total Teachers</div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-6 text-center">
            <Crown className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">₹{((school.monthlyRevenue || 0) / 1000).toFixed(0)}k</div>
            <div className="text-sm text-purple-700">Monthly Revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* School Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building2 className="h-5 w-5 mr-2 text-blue-600" />
              School Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-600">School Name:</span></div>
              <div className="font-medium">{school.name}</div>
              
              <div><span className="font-medium text-gray-600">Location:</span></div>
              <div className="font-medium">{school.location}</div>
              
              <div><span className="font-medium text-gray-600">State:</span></div>
              <div className="font-medium">{school.state}</div>
              
              <div><span className="font-medium text-gray-600">Phone:</span></div>
              <div className="font-medium">{school.phone}</div>
              
              <div><span className="font-medium text-gray-600">Email:</span></div>
              <div className="font-medium">{school.email}</div>
              
              <div><span className="font-medium text-gray-600">Principal:</span></div>
              <div className="font-medium">{school.principal}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Crown className="h-5 w-5 mr-2 text-yellow-600" />
              Subscription Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-medium text-gray-600">Current Plan:</span></div>
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                  {school.selectedPackage || 'Basic'}
                </span>
              </div>
              
              <div><span className="font-medium text-gray-600">Status:</span></div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  school.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {school.status}
                </span>
              </div>
              
              <div><span className="font-medium text-gray-600">Monthly Revenue:</span></div>
              <div className="font-medium text-green-600">₹{(school.monthlyRevenue || 0).toLocaleString()}</div>
              
              <div><span className="font-medium text-gray-600">Joined Date:</span></div>
              <div className="font-medium">{new Date(school.joinedDate).toLocaleDateString()}</div>
              
              <div><span className="font-medium text-gray-600">Last Active:</span></div>
              <div className="font-medium">{school.lastActive ? new Date(school.lastActive).toLocaleDateString() : 'N/A'}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}