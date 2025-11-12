"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Users, Search, Filter, Plus, Edit, Trash2, Eye, 
  Shield, UserCheck, UserX, Crown, Building2, GraduationCap,
  BookOpen, Calculator, MessageSquare, Mail, Phone
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'accountant'
  school: string
  schoolId: string
  status: 'Active' | 'Inactive' | 'Suspended'
  lastLogin: string
  joinedDate: string
  avatar?: string
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@dpsmumbai.edu.in',
    phone: '+91 98765 43210',
    role: 'admin',
    school: 'Delhi Public School Mumbai',
    schoolId: '1',
    status: 'Active',
    lastLogin: '2024-01-15 09:30 AM',
    joinedDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Mrs. Priya Sharma',
    email: 'priya.sharma@ryandelhi.edu.in',
    phone: '+91 98765 43211',
    role: 'admin',
    school: 'Ryan International School Delhi',
    schoolId: '2',
    status: 'Active',
    lastLogin: '2024-01-14 02:15 PM',
    joinedDate: '2023-03-20'
  },
  {
    id: '3',
    name: 'Prof. Amit Verma',
    email: 'amit.verma@dpsmumbai.edu.in',
    phone: '+91 98765 43212',
    role: 'teacher',
    school: 'Delhi Public School Mumbai',
    schoolId: '1',
    status: 'Active',
    lastLogin: '2024-01-15 08:45 AM',
    joinedDate: '2023-02-10'
  },
  {
    id: '4',
    name: 'Rahul Patel',
    email: 'rahul.patel@student.dpsmumbai.edu.in',
    phone: '+91 98765 43213',
    role: 'student',
    school: 'Delhi Public School Mumbai',
    schoolId: '1',
    status: 'Active',
    lastLogin: '2024-01-15 07:20 AM',
    joinedDate: '2023-04-01'
  },
  {
    id: '5',
    name: 'Mrs. Sunita Patel',
    email: 'sunita.patel@parent.dpsmumbai.edu.in',
    phone: '+91 98765 43214',
    role: 'parent',
    school: 'Delhi Public School Mumbai',
    schoolId: '1',
    status: 'Active',
    lastLogin: '2024-01-14 06:30 PM',
    joinedDate: '2023-04-01'
  },
  {
    id: '6',
    name: 'Mr. Suresh Accountant',
    email: 'suresh.acc@ryandelhi.edu.in',
    phone: '+91 98765 43215',
    role: 'accountant',
    school: 'Ryan International School Delhi',
    schoolId: '2',
    status: 'Active',
    lastLogin: '2024-01-15 10:00 AM',
    joinedDate: '2023-05-15'
  }
]

const roleStats = {
  super_admin: 1,
  admin: 1247,
  teacher: 12456,
  student: 67890,
  parent: 45678,
  accountant: 1247
}

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterSchool, setFilterSchool] = useState<string>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.school.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'all' || user.role === filterRole
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus
    const matchesSchool = filterSchool === 'all' || user.schoolId === filterSchool
    
    return matchesSearch && matchesRole && matchesStatus && matchesSchool
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin': return <Crown className="h-4 w-4 text-purple-600" />
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />
      case 'teacher': return <GraduationCap className="h-4 w-4 text-green-600" />
      case 'student': return <BookOpen className="h-4 w-4 text-orange-600" />
      case 'parent': return <Users className="h-4 w-4 text-pink-600" />
      case 'accountant': return <Calculator className="h-4 w-4 text-indigo-600" />
      default: return <Users className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-purple-100 text-purple-800'
      case 'admin': return 'bg-blue-100 text-blue-800'
      case 'teacher': return 'bg-green-100 text-green-800'
      case 'student': return 'bg-orange-100 text-orange-800'
      case 'parent': return 'bg-pink-100 text-pink-800'
      case 'accountant': return 'bg-indigo-100 text-indigo-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      case 'Suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatRole = (role: string) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Users Management
          </h1>
          <p className="text-gray-600 text-lg">Manage all users across the platform</p>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {Object.entries(roleStats).map(([role, count]) => (
          <Card key={role}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {formatRole(role)}
                  </p>
                  <p className="text-2xl font-bold">{count.toLocaleString()}</p>
                </div>
                {getRoleIcon(role)}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search users by name, email, or school..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
              <option value="parent">Parent</option>
              <option value="accountant">Accountant</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Manage and monitor all platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">User</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">School</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Last Login</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-3 w-3 mr-1" />
                            {user.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        {getRoleIcon(user.role)}
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                          {formatRole(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{user.school}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">{user.lastLogin}</div>
                      <div className="text-xs text-gray-500">Joined: {user.joinedDate}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <UserX className="h-4 w-4" />
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

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">User Details</h2>
              <Button variant="ghost" onClick={() => setSelectedUser(null)}>
                ×
              </Button>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {selectedUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <div className="flex items-center space-x-2">
                  {getRoleIcon(selectedUser.role)}
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(selectedUser.role)}`}>
                    {formatRole(selectedUser.role)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Contact Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Email:</span> {selectedUser.email}</div>
                  <div><span className="font-medium">Phone:</span> {selectedUser.phone}</div>
                  <div><span className="font-medium">School:</span> {selectedUser.school}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Account Information</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="font-medium">Status:</span> 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedUser.status)}`}>
                      {selectedUser.status}
                    </span>
                  </div>
                  <div><span className="font-medium">Last Login:</span> {selectedUser.lastLogin}</div>
                  <div><span className="font-medium">Joined:</span> {selectedUser.joinedDate}</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
              <Button variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                Edit User
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}