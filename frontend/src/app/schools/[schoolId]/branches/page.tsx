"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MapPin, Plus, Edit, Trash2, Phone, Mail, 
  User, Building2, CheckCircle, AlertCircle
} from "lucide-react"

interface Branch {
  id: string
  name: string
  code: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  principalName: string
  principalPhone: string
  principalEmail: string
  isMainBranch: boolean
  status: 'active' | 'inactive'
  students: number
  teachers: number
  createdAt: string
}

export default function BranchesPage({ params }: { params: { schoolId: string } }) {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
    email: '',
    principalName: '',
    principalPhone: '',
    principalEmail: '',
    isMainBranch: false
  })

  useEffect(() => {
    fetchBranches()
  }, [params.schoolId])

  const fetchBranches = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/branches`)
      
      if (response.ok) {
        const data = await response.json()
        setBranches(data)
      }
    } catch (error) {
      console.error('Failed to fetch branches:', error)
      // Mock data
      setBranches([
        {
          id: '1',
          name: 'Main Campus',
          code: 'MAIN',
          address: '123 Education Street, Sector 15',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110001',
          phone: '011-12345678',
          email: 'main@dpsdelhi.edu.in',
          principalName: 'Dr. Rajesh Kumar',
          principalPhone: '9876543210',
          principalEmail: 'principal.main@dpsdelhi.edu.in',
          isMainBranch: true,
          status: 'active',
          students: 850,
          teachers: 55,
          createdAt: '2024-01-15'
        },
        {
          id: '2',
          name: 'East Campus',
          code: 'EAST',
          address: '456 Learning Avenue, Sector 22',
          city: 'Delhi',
          state: 'Delhi',
          pincode: '110002',
          phone: '011-87654321',
          email: 'east@dpsdelhi.edu.in',
          principalName: 'Mrs. Priya Sharma',
          principalPhone: '9876543211',
          principalEmail: 'principal.east@dpsdelhi.edu.in',
          isMainBranch: false,
          status: 'active',
          students: 400,
          teachers: 30,
          createdAt: '2024-03-10'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const url = editingBranch 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/branches/${editingBranch.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/branches`
      
      const response = await fetch(url, {
        method: editingBranch ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert(editingBranch ? 'Branch updated successfully!' : 'Branch created successfully!')
        setShowModal(false)
        resetForm()
        fetchBranches()
      }
    } catch (error) {
      console.error('Failed to save branch:', error)
      alert('Failed to save branch')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this branch?')) return
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/branches/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        alert('Branch deleted successfully!')
        fetchBranches()
      }
    } catch (error) {
      console.error('Failed to delete branch:', error)
      alert('Failed to delete branch')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '', code: '', address: '', city: '', state: '', pincode: '',
      phone: '', email: '', principalName: '', principalPhone: '', principalEmail: '',
      isMainBranch: false
    })
    setEditingBranch(null)
  }

  const openEditModal = (branch: Branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      code: branch.code,
      address: branch.address,
      city: branch.city,
      state: branch.state,
      pincode: branch.pincode,
      phone: branch.phone,
      email: branch.email,
      principalName: branch.principalName,
      principalPhone: branch.principalPhone,
      principalEmail: branch.principalEmail,
      isMainBranch: branch.isMainBranch
    })
    setShowModal(true)
  }

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
            <div className="flex items-center space-x-3 mb-2">
              <Button variant="outline" asChild>
                <a href={`/schools/${params.schoolId}/manage`}>← Back</a>
              </Button>
              <h1 className="text-3xl font-bold">Branches Management</h1>
            </div>
            <p className="text-gray-600">Manage multiple school branches and locations</p>
          </div>
          <Button onClick={() => { resetForm(); setShowModal(true) }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
          </Button>
        </div>

        {/* Branches Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {branches.map((branch) => (
            <Card key={branch.id} className={`${branch.isMainBranch ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>{branch.name}</span>
                      {branch.isMainBranch && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          Main
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>Code: {branch.code}</CardDescription>
                  </div>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(branch)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    {!branch.isMainBranch && (
                      <Button size="sm" variant="outline" onClick={() => handleDelete(branch.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Address */}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <div className="text-sm">
                      <p>{branch.address}</p>
                      <p>{branch.city}, {branch.state} - {branch.pincode}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{branch.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{branch.email}</span>
                  </div>

                  {/* Principal */}
                  <div className="pt-3 border-t">
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">{branch.principalName}</span>
                    </div>
                    <p className="text-xs text-gray-600 ml-6">{branch.principalPhone}</p>
                    <p className="text-xs text-gray-600 ml-6">{branch.principalEmail}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{branch.students}</p>
                      <p className="text-xs text-gray-600">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-600">{branch.teachers}</p>
                      <p className="text-xs text-gray-600">Teachers</p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-center pt-2">
                    {branch.status === 'active' ? (
                      <div className="flex items-center space-x-1 text-green-600">
                        <CheckCircle className="h-4 w-4" />
                        <span className="text-sm">Active</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        <span className="text-sm">Inactive</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-6">
                {editingBranch ? 'Edit Branch' : 'Add New Branch'}
              </h2>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Branch Name</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Branch name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Branch Code</label>
                    <Input
                      value={formData.code}
                      onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Branch code"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <Input
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Complete address"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <Input
                      value={formData.state}
                      onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Pincode</label>
                    <Input
                      value={formData.pincode}
                      onChange={(e) => setFormData(prev => ({ ...prev, pincode: e.target.value }))}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone</label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Branch phone"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Branch email"
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="text-lg font-medium mb-4">Principal Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Input
                      value={formData.principalName}
                      onChange={(e) => setFormData(prev => ({ ...prev, principalName: e.target.value }))}
                      placeholder="Principal name"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        value={formData.principalPhone}
                        onChange={(e) => setFormData(prev => ({ ...prev, principalPhone: e.target.value }))}
                        placeholder="Principal phone"
                      />
                      <Input
                        type="email"
                        value={formData.principalEmail}
                        onChange={(e) => setFormData(prev => ({ ...prev, principalEmail: e.target.value }))}
                        placeholder="Principal email"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isMainBranch}
                    onChange={(e) => setFormData(prev => ({ ...prev, isMainBranch: e.target.checked }))}
                    disabled={editingBranch?.isMainBranch}
                  />
                  <label className="text-sm">Set as main branch</label>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSubmit} className="flex-1">
                  {editingBranch ? 'Update' : 'Create'} Branch
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}