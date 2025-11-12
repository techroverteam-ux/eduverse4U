"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast, Toaster } from "@/components/ui/toast"
import { validateStudent } from "@/lib/validation"
import { 
  Users, Search, Filter, Plus, Download, 
  Eye, Edit, Trash2, Mail, Phone, X, Save 
} from "lucide-react"

const initialStudents = [
  {
    id: 1,
    name: "Aarav Sharma",
    class: "10-A",
    rollNo: "001",
    email: "aarav@email.com",
    phone: "+91 98765 43210",
    status: "Active",
    fees: "Paid"
  },
  {
    id: 2,
    name: "Priya Patel",
    class: "9-B",
    rollNo: "045",
    email: "priya@email.com",
    phone: "+91 98765 43211",
    status: "Active",
    fees: "Pending"
  },
  {
    id: 3,
    name: "Rohit Kumar",
    class: "11-C",
    rollNo: "023",
    email: "rohit@email.com",
    phone: "+91 98765 43212",
    status: "Active",
    fees: "Paid"
  },
  {
    id: 4,
    name: "Ananya Singh",
    class: "8-A",
    rollNo: "067",
    email: "ananya@email.com",
    phone: "+91 98765 43213",
    status: "Inactive",
    fees: "Overdue"
  }
]

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState(initialStudents)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    class: '',
    rollNumber: '',
    address: '',
    gender: 'Male'
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  // Mock current user role - in real app, get from auth context
  const [currentUserRole] = useState('admin')
  
  const canCreate = ['admin', 'teacher'].includes(currentUserRole)
  const canEdit = ['admin', 'teacher'].includes(currentUserRole)
  const canDelete = ['admin'].includes(currentUserRole)
  const canViewDetails = ['admin', 'teacher', 'parent'].includes(currentUserRole)

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.rollNo.includes(searchTerm)
    const matchesClass = selectedClass === 'all' || student.class === selectedClass
    return matchesSearch && matchesClass
  })

  function handleInputChange(field: string, value: string) {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }
  
  function handleCloseModal() {
    setShowAddModal(false)
    setEditingStudent(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      class: '',
      rollNumber: '',
      address: '',
      gender: 'Male'
    })
    setErrors({})
  }
  
  function handleEdit(student: any) {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone,
      age: '16',
      class: student.class,
      rollNumber: student.rollNo,
      address: '',
      gender: 'Male'
    })
  }
  
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    const validation = validateStudent(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      toast.error('Validation Error', 'Please fix the errors and try again')
      return
    }
    
    setLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingStudent) {
        // Update existing student
        setStudents(prev => prev.map(s => 
          s.id === editingStudent.id 
            ? { ...s, name: formData.name, email: formData.email, class: formData.class, rollNo: formData.rollNumber }
            : s
        ))
        toast.success('Student Updated', 'Student information has been updated successfully')
      } else {
        // Add new student
        const newStudent = {
          id: Date.now(),
          name: formData.name,
          class: formData.class,
          rollNo: formData.rollNumber,
          email: formData.email,
          phone: formData.phone,
          status: 'Active',
          fees: 'Pending'
        }
        setStudents(prev => [...prev, newStudent])
        toast.success('Student Added', 'New student has been added successfully')
      }
      
      handleCloseModal()
    } catch (error) {
      toast.error('Error', 'Failed to save student. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  function handleView(student: any) {
    toast.info('Student Details', `Viewing details for ${student.name}`)
  }
  
  async function handleDelete(studentId: number) {
    if (!confirm('Are you sure you want to delete this student?')) return
    
    try {
      setStudents(prev => prev.filter(s => s.id !== studentId))
      toast.success('Student Deleted', 'Student has been removed successfully')
    } catch (error) {
      toast.error('Error', 'Failed to delete student')
    }
  }
  
  function handleSendMessage(student: any) {
    toast.info('Message Sent', `Message sent to ${student.name}`)
  }
  
  function handleExport() {
    toast.success('Export Started', 'Student data export has been initiated')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-600">Manage student information and records</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          {canCreate && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">96.0% active rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Paid</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.fees === 'Paid').length}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Pending</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.filter(s => s.fees !== 'Paid').length}</div>
            <p className="text-xs text-muted-foreground">Needs attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      <Card>
        <CardHeader>
          <CardTitle>Student Directory</CardTitle>
          <CardDescription>Search and filter students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name or roll number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Classes</option>
              <option value="8-A">Class 8-A</option>
              <option value="9-B">Class 9-B</option>
              <option value="10-A">Class 10-A</option>
              <option value="11-C">Class 11-C</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Student</th>
                  <th className="text-left py-3 px-4 font-medium">Class</th>
                  <th className="text-left py-3 px-4 font-medium">Roll No</th>
                  <th className="text-left py-3 px-4 font-medium">Contact</th>
                  <th className="text-left py-3 px-4 font-medium">Status</th>
                  <th className="text-left py-3 px-4 font-medium">Fees</th>
                  <th className="text-left py-3 px-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">{student.class}</td>
                    <td className="py-3 px-4">{student.rollNo}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{student.phone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        student.fees === 'Paid' 
                          ? 'bg-green-100 text-green-800' 
                          : student.fees === 'Pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {student.fees}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {canViewDetails && (
                          <Button variant="ghost" size="sm" onClick={() => handleView(student)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(student)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(student.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleSendMessage(student)}>
                          <Mail className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Student Modal */}
      {(showAddModal || editingStudent) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </h3>
              <Button variant="ghost" size="sm" onClick={handleCloseModal}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>
              
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="class">Class</Label>
                  <Input
                    id="class"
                    value={formData.class}
                    onChange={(e) => handleInputChange('class', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="rollNumber">Roll Number *</Label>
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                    className={errors.rollNumber ? 'border-red-500' : ''}
                  />
                  {errors.rollNumber && <p className="text-red-500 text-sm mt-1">{errors.rollNumber}</p>}
                </div>
              </div>
              
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                />
              </div>
              
              <div className="flex space-x-2 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : editingStudent ? 'Update' : 'Add Student'}
                </Button>
                <Button type="button" variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toaster />
    </div>
  )
}