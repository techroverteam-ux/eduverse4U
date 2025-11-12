"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Plus, Edit, Trash2, IndianRupee, Calendar,
  BookOpen, Bus, Utensils, Activity, Settings
} from "lucide-react"

interface FeeStructure {
  id: string
  name: string
  description: string
  amount: number
  type: 'monthly' | 'quarterly' | 'annual' | 'one_time'
  category: 'tuition' | 'transport' | 'hostel' | 'library' | 'lab' | 'sports' | 'other'
  mandatory: boolean
  applicableClasses: string[]
  dueDate: string
  lateFee: number
  createdAt: string
  updatedAt: string
}

export default function FeeStructurePage() {
  const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingFee, setEditingFee] = useState<FeeStructure | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    amount: '',
    type: 'quarterly' as 'monthly' | 'quarterly' | 'annual' | 'one_time',
    category: 'tuition' as 'tuition' | 'transport' | 'hostel' | 'library' | 'lab' | 'sports' | 'other',
    mandatory: true,
    applicableClasses: [] as string[],
    dueDate: '',
    lateFee: ''
  })

  const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const categories = [
    { value: 'tuition', label: 'Tuition', icon: BookOpen },
    { value: 'transport', label: 'Transport', icon: Bus },
    { value: 'hostel', label: 'Hostel', icon: Settings },
    { value: 'library', label: 'Library', icon: BookOpen },
    { value: 'lab', label: 'Laboratory', icon: Activity },
    { value: 'sports', label: 'Sports', icon: Activity },
    { value: 'other', label: 'Other', icon: Settings }
  ]

  useEffect(() => {
    fetchFeeStructures()
  }, [])

  const fetchFeeStructures = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/fee-structure`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        const data = await response.json()
        setFeeStructures(data)
      }
    } catch (error) {
      console.error('Failed to fetch fee structures:', error)
      // Mock data
      setFeeStructures([
        {
          id: '1',
          name: 'Tuition Fee',
          description: 'Quarterly tuition fee for academic instruction',
          amount: 15000,
          type: 'quarterly',
          category: 'tuition',
          mandatory: true,
          applicableClasses: ['9', '10', '11', '12'],
          dueDate: '2024-12-15',
          lateFee: 500,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        },
        {
          id: '2',
          name: 'Transport Fee',
          description: 'Monthly bus transportation fee',
          amount: 2500,
          type: 'monthly',
          category: 'transport',
          mandatory: false,
          applicableClasses: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
          dueDate: '2024-12-05',
          lateFee: 100,
          createdAt: '2024-01-01',
          updatedAt: '2024-01-01'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token')
      const url = editingFee 
        ? `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/fee-structure/${editingFee.id}`
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/fee-structure`
      
      const response = await fetch(url, {
        method: editingFee ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
          lateFee: parseFloat(formData.lateFee)
        })
      })
      
      if (response.ok) {
        alert(editingFee ? 'Fee structure updated successfully!' : 'Fee structure created successfully!')
        setShowModal(false)
        resetForm()
        fetchFeeStructures()
      } else {
        alert('Failed to save fee structure')
      }
    } catch (error) {
      console.error('Failed to save fee structure:', error)
      alert('Failed to save fee structure')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return
    
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/accountant/fee-structure/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (response.ok) {
        alert('Fee structure deleted successfully!')
        fetchFeeStructures()
      } else {
        alert('Failed to delete fee structure')
      }
    } catch (error) {
      console.error('Failed to delete fee structure:', error)
      alert('Failed to delete fee structure')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      amount: '',
      type: 'quarterly',
      category: 'tuition',
      mandatory: true,
      applicableClasses: [],
      dueDate: '',
      lateFee: ''
    })
    setEditingFee(null)
  }

  const openEditModal = (fee: FeeStructure) => {
    setEditingFee(fee)
    setFormData({
      name: fee.name,
      description: fee.description,
      amount: fee.amount.toString(),
      type: fee.type,
      category: fee.category,
      mandatory: fee.mandatory,
      applicableClasses: fee.applicableClasses,
      dueDate: fee.dueDate,
      lateFee: fee.lateFee.toString()
    })
    setShowModal(true)
  }

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find(c => c.value === category)
    const Icon = categoryData?.icon || Settings
    return <Icon className="h-4 w-4" />
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'monthly': return 'bg-blue-100 text-blue-800'
      case 'quarterly': return 'bg-green-100 text-green-800'
      case 'annual': return 'bg-purple-100 text-purple-800'
      case 'one_time': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fee Structure Management</h1>
          <p className="text-muted-foreground">Configure and manage school fee structures</p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true) }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Fee Structure
        </Button>
      </div>

      {/* Fee Structures Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feeStructures.map((fee) => (
          <Card key={fee.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getCategoryIcon(fee.category)}
                  <CardTitle className="text-lg">{fee.name}</CardTitle>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(fee.type)}`}>
                  {fee.type}
                </span>
              </div>
              <CardDescription>{fee.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-bold text-lg">₹{fee.amount.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Late Fee</span>
                  <span className="font-medium">₹{fee.lateFee.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Due Date</span>
                  <span className="text-sm">{new Date(fee.dueDate).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Mandatory</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${fee.mandatory ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                    {fee.mandatory ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div>
                  <span className="text-sm text-gray-600">Applicable Classes</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {fee.applicableClasses.map((cls) => (
                      <span key={cls} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Class {cls}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(fee)} className="flex-1">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(fee.id)} className="flex-1">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
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
              {editingFee ? 'Edit Fee Structure' : 'Add Fee Structure'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Fee Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Tuition Fee"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Input
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the fee"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                  <Input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    placeholder="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annual">Annual</option>
                    <option value="one_time">One Time</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Late Fee (₹)</label>
                  <Input
                    type="number"
                    value={formData.lateFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, lateFee: e.target.value }))}
                    placeholder="0"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Due Date</label>
                  <Input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Mandatory</label>
                  <select
                    value={formData.mandatory.toString()}
                    onChange={(e) => setFormData(prev => ({ ...prev, mandatory: e.target.value === 'true' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Applicable Classes</label>
                <div className="grid grid-cols-6 gap-2">
                  {classes.map((cls) => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.applicableClasses.includes(cls)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData(prev => ({ ...prev, applicableClasses: [...prev.applicableClasses, cls] }))
                          } else {
                            setFormData(prev => ({ ...prev, applicableClasses: prev.applicableClasses.filter(c => c !== cls) }))
                          }
                        }}
                      />
                      <span className="text-sm">Class {cls}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-1">
                {editingFee ? 'Update' : 'Create'} Fee Structure
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}