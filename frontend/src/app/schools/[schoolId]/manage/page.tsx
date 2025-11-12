"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Building2, Calendar, BookOpen, Users, 
  IndianRupee, Settings, Database, MapPin,
  GraduationCap, FileText, Link2, Upload
} from "lucide-react"

interface SchoolInfo {
  id: string
  name: string
  code: string
  status: string
  branches: number
  academicYears: number
  classes: number
  subjects: number
  teachers: number
  students: number
}

export default function SchoolManagePage({ params }: { params: { schoolId: string } }) {
  const [schoolInfo, setSchoolInfo] = useState<SchoolInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSchoolInfo()
  }, [params.schoolId])

  const fetchSchoolInfo = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/info`)
      
      if (response.ok) {
        const data = await response.json()
        setSchoolInfo(data)
      }
    } catch (error) {
      console.error('Failed to fetch school info:', error)
      // Mock data
      setSchoolInfo({
        id: params.schoolId,
        name: 'Delhi Public School',
        code: 'DPS001',
        status: 'active',
        branches: 3,
        academicYears: 2,
        classes: 15,
        subjects: 13,
        teachers: 85,
        students: 1250
      })
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      title: 'School Registration',
      description: 'Update school information and settings',
      icon: Building2,
      href: `/schools/${params.schoolId}/registration`,
      color: 'bg-blue-50 border-blue-200',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Branches Management',
      description: 'Manage multiple school branches',
      icon: MapPin,
      href: `/schools/${params.schoolId}/branches`,
      color: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      count: schoolInfo?.branches
    },
    {
      title: 'Academic Years',
      description: 'Configure academic year periods',
      icon: Calendar,
      href: `/schools/${params.schoolId}/academic-years`,
      color: 'bg-purple-50 border-purple-200',
      iconColor: 'text-purple-600',
      count: schoolInfo?.academicYears
    },
    {
      title: 'Classes Management',
      description: 'Manage class structure and sections',
      icon: GraduationCap,
      href: `/schools/${params.schoolId}/classes`,
      color: 'bg-orange-50 border-orange-200',
      iconColor: 'text-orange-600',
      count: schoolInfo?.classes
    },
    {
      title: 'Subjects Management',
      description: 'Configure subjects and curriculum',
      icon: BookOpen,
      href: `/schools/${params.schoolId}/subjects`,
      color: 'bg-indigo-50 border-indigo-200',
      iconColor: 'text-indigo-600',
      count: schoolInfo?.subjects
    },
    {
      title: 'Class-Subject Mapping',
      description: 'Map subjects to classes and sections',
      icon: Link2,
      href: `/schools/${params.schoolId}/class-subject-mapping`,
      color: 'bg-pink-50 border-pink-200',
      iconColor: 'text-pink-600'
    },
    {
      title: 'Teachers Management',
      description: 'Add teachers (bulk/single entry)',
      icon: Users,
      href: `/schools/${params.schoolId}/teachers`,
      color: 'bg-teal-50 border-teal-200',
      iconColor: 'text-teal-600',
      count: schoolInfo?.teachers
    },
    {
      title: 'Students Management',
      description: 'Add students (bulk/single entry)',
      icon: Users,
      href: `/schools/${params.schoolId}/students`,
      color: 'bg-cyan-50 border-cyan-200',
      iconColor: 'text-cyan-600',
      count: schoolInfo?.students
    },
    {
      title: 'Fee Structure',
      description: 'Configure fee types and amounts',
      icon: IndianRupee,
      href: `/schools/${params.schoolId}/fee-structure`,
      color: 'bg-yellow-50 border-yellow-200',
      iconColor: 'text-yellow-600'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Button variant="outline" asChild>
              <a href="/schools">← Back to Schools</a>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{schoolInfo?.name}</h1>
              <p className="text-gray-600">School Code: {schoolInfo?.code}</p>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-5">
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{schoolInfo?.branches}</p>
                <p className="text-sm text-gray-600">Branches</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <GraduationCap className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{schoolInfo?.classes}</p>
                <p className="text-sm text-gray-600">Classes</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{schoolInfo?.subjects}</p>
                <p className="text-sm text-gray-600">Subjects</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">{schoolInfo?.teachers}</p>
                <p className="text-sm text-gray-600">Teachers</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                <p className="text-2xl font-bold">{schoolInfo?.students}</p>
                <p className="text-sm text-gray-600">Students</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Management Menu Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <Card key={index} className={`hover:shadow-lg transition-all cursor-pointer ${item.color}`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-white`}>
                      <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      {item.count !== undefined && (
                        <p className="text-sm text-gray-600">{item.count} configured</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="mb-4">{item.description}</CardDescription>
                <Button asChild className="w-full">
                  <a href={item.href}>
                    Manage
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks for school management</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href={`/schools/${params.schoolId}/teachers/upload`}>
                  <Upload className="h-6 w-6 mb-2" />
                  Upload Teachers
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href={`/schools/${params.schoolId}/students/upload`}>
                  <Upload className="h-6 w-6 mb-2" />
                  Upload Students
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href={`/schools/${params.schoolId}/reports`}>
                  <FileText className="h-6 w-6 mb-2" />
                  Generate Reports
                </a>
              </Button>
              <Button variant="outline" className="h-20 flex-col" asChild>
                <a href={`/schools/${params.schoolId}/settings`}>
                  <Settings className="h-6 w-6 mb-2" />
                  School Settings
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}