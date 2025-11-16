"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, BookOpen, Calendar, GraduationCap, 
  Clock, IndianRupee, Upload, Download, Plus 
} from "lucide-react"

const masterModules = [
  {
    title: 'Academic Years',
    description: 'Manage academic years and sessions',
    icon: Calendar,
    href: '/master/academic-years',
    color: 'from-blue-500 to-blue-600'
  },
  {
    title: 'Classes',
    description: 'Setup classes mapped to schools, branches & academic years',
    icon: BookOpen,
    href: '/master/classes',
    color: 'from-green-500 to-green-600'
  },
  {
    title: 'Subjects',
    description: 'Manage subjects and curriculum',
    icon: GraduationCap,
    href: '/master/subjects',
    color: 'from-purple-500 to-purple-600'
  },
  {
    title: 'Class-Subject Mapping',
    description: 'Map subjects to classes',
    icon: BookOpen,
    href: '/master/class-subject-mappings',
    color: 'from-teal-500 to-teal-600'
  },
  {
    title: 'Teachers',
    description: 'Teacher profiles and assignments',
    icon: Users,
    href: '/master/teachers',
    color: 'from-red-500 to-red-600'
  },
  {
    title: 'Students',
    description: 'Student records and enrollment',
    icon: Users,
    href: '/master/students',
    color: 'from-orange-500 to-orange-600'
  },
  {
    title: 'Fee Structure',
    description: 'Fee setup and management',
    icon: IndianRupee,
    href: '/master/fee-structures',
    color: 'from-yellow-500 to-yellow-600'
  }
]

export default function MasterDataPage() {
  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Master Data Management
            </h1>
            <p className="text-gray-600 mt-1">Configure and manage all school master data</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
              <Download className="h-4 w-4 mr-2" />
              Templates
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Students</p>
                <p className="text-3xl font-bold">1,245</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Total Teachers</p>
                <p className="text-3xl font-bold">85</p>
              </div>
              <Users className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Total Classes</p>
                <p className="text-3xl font-bold">42</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Total Subjects</p>
                <p className="text-3xl font-bold">28</p>
              </div>
              <GraduationCap className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Master Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {masterModules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group">
            <CardContent className="p-6">
              <div className={`w-12 h-12 bg-gradient-to-br ${module.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <module.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{module.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{module.description}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full group-hover:bg-gray-50"
                onClick={() => window.location.href = module.href}
              >
                <Plus className="h-3 w-3 mr-1" />
                Manage
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 h-12">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload Students
            </Button>
            <Button className="bg-gradient-to-r from-green-600 to-teal-600 h-12">
              <Upload className="h-4 w-4 mr-2" />
              Bulk Upload Teachers
            </Button>
            <Button className="bg-gradient-to-r from-orange-600 to-red-600 h-12">
              <Download className="h-4 w-4 mr-2" />
              Download Templates
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}