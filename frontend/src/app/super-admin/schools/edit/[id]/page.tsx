"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useNavigation } from "@/hooks/useNavigation"
import { superAdminAPI } from "@/lib/api/super-admin"
import { toast } from "@/components/ui/toast"
import { 
  Building2, Users, MapPin, Save, ArrowLeft, Loader2, AlertCircle, Upload
} from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

interface SchoolData {
  id: string
  name: string
  schoolCode: string
  location: string
  state: string
  city: string
  pincode: string
  phone: string
  email: string
  principal: string
  principalEmail: string
  principalPhone: string
  students: number
  teachers: number
  selectedPackage: string
  status: string
  logo?: File
}

export default function EditSchoolPage({ params }: { params: { id: string } }) {
  const navigation = useNavigation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [schoolData, setSchoolData] = useState<SchoolData | null>(null)

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        setLoading(true)
        const data = await superAdminAPI.getSchoolById(params.id)
        setSchoolData(data)
        setError(null)
      } catch (err) {
        console.error('Failed to fetch school:', err)
        setError('Failed to load school data')
      } finally {
        setLoading(false)
      }
    }

    fetchSchool()
  }, [params.id])

  const handleSave = async () => {
    if (!schoolData) return

    setSaving(true)
    try {
      // Convert logo to base64 if it's a new file
      let logoData = (schoolData as any).logo
      if (schoolData.logo instanceof File) {
        const reader = new FileReader()
        logoData = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result)
          reader.readAsDataURL(schoolData.logo!)
        })
      }

      const updateData = {
        name: schoolData.name,
        schoolCode: schoolData.schoolCode,
        location: schoolData.location,
        state: schoolData.state,
        city: schoolData.city,
        pincode: schoolData.pincode,
        phone: schoolData.phone,
        email: schoolData.email,
        principal: schoolData.principal,
        principalEmail: schoolData.principalEmail,
        principalPhone: schoolData.principalPhone,
        students: schoolData.students,
        teachers: schoolData.teachers,
        selectedPackage: schoolData.selectedPackage,
        status: schoolData.status,
        logo: logoData
      }
      
      await superAdminAPI.updateSchool(params.id, updateData)
      toast.success('School Updated', `${schoolData.name} has been updated successfully`)
      navigation.navigateToSchools()
    } catch (err) {
      console.error('Failed to update school:', err)
      setError('Failed to update school')
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof SchoolData, value: any) => {
    setSchoolData(prev => prev ? { ...prev, [field]: value } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading school data...</span>
      </div>
    )
  }

  if (error || !schoolData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error || 'School not found'}</p>
          <Button onClick={() => navigation.navigateToSchools()} variant="outline">
            Back to Schools
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => navigation.navigateToSchools()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-bold">Edit School</h1>
              <p className="text-sm text-gray-600">{schoolData.name}</p>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving} className="bg-green-600 hover:bg-green-700">
            {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Building2 className="h-4 w-4 mr-2" />
                Basic Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div>
                <Label className="text-xs">School Name</Label>
                <Input value={schoolData.name} onChange={(e) => updateField('name', e.target.value)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">School Code</Label>
                <Input value={schoolData.schoolCode} onChange={(e) => updateField('schoolCode', e.target.value)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Principal</Label>
                <Input value={schoolData.principal} onChange={(e) => updateField('principal', e.target.value)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Logo</Label>
                <div className="space-y-2">
                  {/* Current Logo Display */}
                  <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-lg overflow-hidden border border-gray-200">
                    {(schoolData as any).logo && typeof (schoolData as any).logo === 'string' ? (
                      <img 
                        src={(schoolData as any).logo} 
                        alt="Current logo"
                        className="w-full h-full object-cover"
                      />
                    ) : schoolData.logo instanceof File ? (
                      <img 
                        src={URL.createObjectURL(schoolData.logo)} 
                        alt="New logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                        {schoolData.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  {/* Upload Button */}
                  <div className="text-center">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          // Validate file size (max 2MB)
                          if (file.size > 2 * 1024 * 1024) {
                            setError('Logo file size must be less than 2MB')
                            toast.error('File too large', 'Logo file size must be less than 2MB')
                            return
                          }
                          updateField('logo', file)
                          setError(null)
                          toast.success('Logo Selected', `${file.name} has been selected as new logo`)
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="h-3 w-3 mr-1" />
                      {(schoolData as any).logo ? 'Change' : 'Upload'}
                    </Button>
                    {schoolData.logo instanceof File && (
                      <p className="text-xs text-green-600 mt-1">{schoolData.logo.name}</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div>
                <Label className="text-xs">Address</Label>
                <Textarea value={schoolData.location} onChange={(e) => updateField('location', e.target.value)} className="min-h-[60px]" />
              </div>
              <div>
                <Label className="text-xs">City</Label>
                <Input value={schoolData.city || ''} onChange={(e) => updateField('city', e.target.value)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">State</Label>
                <Select value={schoolData.state} onValueChange={(value) => updateField('state', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Phone</Label>
                <Input value={schoolData.phone} onChange={(e) => updateField('phone', e.target.value)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Email</Label>
                <Input type="email" value={schoolData.email} onChange={(e) => updateField('email', e.target.value)} className="h-8" />
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Stats & Plan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div>
                <Label className="text-xs">Students</Label>
                <Input type="number" value={schoolData.students} onChange={(e) => updateField('students', parseInt(e.target.value) || 0)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Teachers</Label>
                <Input type="number" value={schoolData.teachers} onChange={(e) => updateField('teachers', parseInt(e.target.value) || 0)} className="h-8" />
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={schoolData.status} onValueChange={(value) => updateField('status', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    <SelectItem value="Trial">Trial</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Plan</Label>
                <Select value={schoolData.selectedPackage} onValueChange={(value) => updateField('selectedPackage', value)}>
                  <SelectTrigger className="h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic Plan</SelectItem>
                    <SelectItem value="standard">Standard Plan</SelectItem>
                    <SelectItem value="premium">Premium Plan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}