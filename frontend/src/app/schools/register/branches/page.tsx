"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNavigation } from "@/hooks/useNavigation"
import { api } from "@/lib/api"
import { 
  Building2, Plus, Trash2, ArrowLeft, Save
} from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

interface Branch {
  name: string
  branchCode: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  email: string
  branchManager: string
  students: number
  teachers: number
  isMainBranch: boolean
}

export default function SchoolBranchesManagement() {
  const navigation = useNavigation()
  const [branches, setBranches] = useState<Branch[]>([
    {
      name: '',
      branchCode: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      branchManager: '',
      students: 0,
      teachers: 0,
      isMainBranch: true
    }
  ])
  const [loading, setLoading] = useState(false)

  const addBranch = () => {
    setBranches(prev => [...prev, {
      name: '',
      branchCode: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: '',
      email: '',
      branchManager: '',
      students: 0,
      teachers: 0,
      isMainBranch: false
    }])
  }

  const removeBranch = (index: number) => {
    if (branches.length > 1) {
      setBranches(prev => prev.filter((_, i) => i !== index))
    }
  }

  const updateBranch = (index: number, field: keyof Branch, value: any) => {
    setBranches(prev => prev.map((branch, i) => 
      i === index ? { ...branch, [field]: value } : branch
    ))
  }

  const setMainBranch = (index: number) => {
    setBranches(prev => prev.map((branch, i) => ({
      ...branch,
      isMainBranch: i === index
    })))
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      await api.post('/schools/branches', { branches })
      navigation.navigateToSuperAdminDashboard()
    } catch (error) {
      console.error('Failed to save branches:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigation.navigateTo('/schools/register')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Branch Management</h1>
                <p className="text-gray-600 text-sm">Configure your school branches</p>
              </div>
            </div>
            <Button onClick={addBranch} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Branch
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {branches.map((branch, index) => (
            <Card key={index} className={`shadow-lg ${branch.isMainBranch ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <span>
                      {branch.isMainBranch ? 'Main Branch' : `Branch ${index + 1}`}
                    </span>
                    {branch.isMainBranch && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Primary
                      </span>
                    )}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    {!branch.isMainBranch && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setMainBranch(index)}
                      >
                        Set as Main
                      </Button>
                    )}
                    {branches.length > 1 && !branch.isMainBranch && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeBranch(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Branch Name *</Label>
                    <Input
                      value={branch.name}
                      onChange={(e) => updateBranch(index, 'name', e.target.value)}
                      placeholder="Main Campus / North Branch"
                    />
                  </div>
                  <div>
                    <Label>Branch Code *</Label>
                    <Input
                      value={branch.branchCode}
                      onChange={(e) => updateBranch(index, 'branchCode', e.target.value.toUpperCase())}
                      placeholder="MAIN / NORTH"
                    />
                  </div>
                </div>

                <div>
                  <Label>Address *</Label>
                  <Input
                    value={branch.address}
                    onChange={(e) => updateBranch(index, 'address', e.target.value)}
                    placeholder="Street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>City *</Label>
                    <Input
                      value={branch.city}
                      onChange={(e) => updateBranch(index, 'city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label>State *</Label>
                    <Select 
                      value={branch.state} 
                      onValueChange={(value) => updateBranch(index, 'state', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {INDIAN_STATES.map(state => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Pincode</Label>
                    <Input
                      value={branch.pincode}
                      onChange={(e) => updateBranch(index, 'pincode', e.target.value)}
                      placeholder="Pincode"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone *</Label>
                    <Input
                      value={branch.phone}
                      onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div>
                    <Label>Email *</Label>
                    <Input
                      type="email"
                      value={branch.email}
                      onChange={(e) => updateBranch(index, 'email', e.target.value)}
                      placeholder="branch@school.edu.in"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Branch Manager</Label>
                    <Input
                      value={branch.branchManager}
                      onChange={(e) => updateBranch(index, 'branchManager', e.target.value)}
                      placeholder="Manager name"
                    />
                  </div>
                  <div>
                    <Label>Students</Label>
                    <Input
                      type="number"
                      value={branch.students || ''}
                      onChange={(e) => updateBranch(index, 'students', parseInt(e.target.value) || 0)}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label>Teachers</Label>
                    <Input
                      type="number"
                      value={branch.teachers || ''}
                      onChange={(e) => updateBranch(index, 'teachers', parseInt(e.target.value) || 0)}
                      placeholder="50"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => navigation.navigateTo('/schools/register')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Registration
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Branches
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}