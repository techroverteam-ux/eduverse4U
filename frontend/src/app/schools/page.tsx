"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, Plus, Search, Eye, Settings, 
  Users, Calendar, BookOpen, Database
} from "lucide-react"

interface School {
  id: string
  name: string
  code: string
  type: string
  board: string
  city: string
  state: string
  status: 'active' | 'inactive' | 'setup_pending'
  branches: number
  students: number
  teachers: number
  createdAt: string
}

export default function SchoolsListPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setSchools(data)
      }
    } catch (error) {
      console.error('Failed to fetch schools:', error)
      // Mock data
      setSchools([
        {
          id: 'SCH001',
          name: 'Delhi Public School',
          code: 'DPS001',
          type: 'higher_secondary',
          board: 'CBSE',
          city: 'Delhi',
          state: 'Delhi',
          status: 'active',
          branches: 3,
          students: 1250,
          teachers: 85,
          createdAt: '2024-01-15'
        },
        {
          id: 'SCH002',
          name: 'St. Mary\'s Convent School',
          code: 'SMC001',
          type: 'secondary',
          board: 'ICSE',
          city: 'Mumbai',
          state: 'Maharashtra',
          status: 'active',
          branches: 1,
          students: 850,
          teachers: 45,
          createdAt: '2024-02-10'
        },
        {
          id: 'SCH003',
          name: 'Kendriya Vidyalaya',
          code: 'KV001',
          type: 'higher_secondary',
          board: 'CBSE',
          city: 'Bangalore',
          state: 'Karnataka',
          status: 'setup_pending',
          branches: 1,
          students: 0,
          teachers: 0,
          createdAt: '2024-12-01'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-red-100 text-red-800'
      case 'setup_pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.city.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">EduVerse Schools</h1>
            <p className="text-gray-600 mt-2">Manage all registered educational institutions</p>
          </div>
          <Button asChild>
            <a href="/schools/register">
              <Plus className="mr-2 h-4 w-4" />
              Register New School
            </a>
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search schools by name, code, or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Schools Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSchools.map((school) => (
            <Card key={school.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{school.name}</CardTitle>
                    <CardDescription>{school.code} • {school.board}</CardDescription>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(school.status)}`}>
                    {school.status.replace('_', ' ')}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Location</span>
                    <span className="font-medium">{school.city}, {school.state}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Type</span>
                    <span className="font-medium">{school.type.replace('_', ' ')}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Building2 className="h-4 w-4 text-blue-600" />
                      </div>
                      <p className="text-sm font-bold">{school.branches}</p>
                      <p className="text-xs text-gray-600">Branches</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <p className="text-sm font-bold">{school.students}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="h-4 w-4 text-purple-600" />
                      </div>
                      <p className="text-sm font-bold">{school.teachers}</p>
                      <p className="text-xs text-gray-600">Teachers</p>
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-3">
                    {school.status === 'setup_pending' ? (
                      <Button size="sm" className="flex-1" asChild>
                        <a href={`/schools/setup/${school.id}`}>
                          <Settings className="mr-2 h-4 w-4" />
                          Complete Setup
                        </a>
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" className="flex-1" asChild>
                          <a href={`/schools/${school.id}/dashboard`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </a>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <a href={`/schools/${school.id}/manage`}>
                            <Settings className="mr-2 h-4 w-4" />
                            Manage
                          </a>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredSchools.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No schools found</h3>
            <p className="text-gray-600 mb-4">Get started by registering your first school</p>
            <Button asChild>
              <a href="/schools/register">Register New School</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}