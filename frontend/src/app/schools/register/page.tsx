"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, MapPin, Phone, Mail, User, 
  Calendar, GraduationCap, Save, Upload
} from "lucide-react"

interface SchoolRegistration {
  schoolName: string
  schoolCode: string
  establishedYear: string
  schoolType: 'primary' | 'secondary' | 'higher_secondary' | 'college' | 'university'
  board: 'CBSE' | 'ICSE' | 'State_Board' | 'IB' | 'Other'
  address: {
    street: string
    city: string
    state: string
    pincode: string
    country: string
  }
  contact: {
    phone: string
    email: string
    website?: string
  }
  principal: {
    name: string
    phone: string
    email: string
  }
  admin: {
    name: string
    phone: string
    email: string
  }
  affiliation: {
    number: string
    board: string
  }
  logo?: File
}

export default function SchoolRegistrationPage() {
  const [formData, setFormData] = useState<SchoolRegistration>({
    schoolName: '',
    schoolCode: '',
    establishedYear: '',
    schoolType: 'secondary',
    board: 'CBSE',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India'
    },
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    principal: {
      name: '',
      phone: '',
      email: ''
    },
    admin: {
      name: '',
      phone: '',
      email: ''
    },
    affiliation: {
      number: '',
      board: ''
    }
  })
  
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('schoolData', JSON.stringify(formData))
      if (formData.logo) {
        formDataToSend.append('logo', formData.logo)
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/register`, {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        const result = await response.json()
        alert(`School registered successfully! School ID: ${result.schoolId}`)
        window.location.href = `/schools/${result.schoolId}/setup`
      } else {
        alert('Registration failed')
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">School Registration</h1>
          <p className="text-gray-600 mt-2">Register your educational institution with EduVerse</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && <div className="w-16 h-1 bg-gray-300 mx-2"></div>}
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building2 className="h-5 w-5" />
                <span>School Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">School Name *</label>
                  <Input
                    value={formData.schoolName}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                    placeholder="Enter school name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">School Code *</label>
                  <Input
                    value={formData.schoolCode}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolCode: e.target.value }))}
                    placeholder="Unique school code"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Established Year *</label>
                  <Input
                    type="number"
                    value={formData.establishedYear}
                    onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                    placeholder="YYYY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">School Type *</label>
                  <select
                    value={formData.schoolType}
                    onChange={(e) => setFormData(prev => ({ ...prev, schoolType: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="primary">Primary School (1-5)</option>
                    <option value="secondary">Secondary School (1-10)</option>
                    <option value="higher_secondary">Higher Secondary (1-12)</option>
                    <option value="college">College</option>
                    <option value="university">University</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Board *</label>
                  <select
                    value={formData.board}
                    onChange={(e) => setFormData(prev => ({ ...prev, board: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="CBSE">CBSE</option>
                    <option value="ICSE">ICSE</option>
                    <option value="State_Board">State Board</option>
                    <option value="IB">International Baccalaureate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Affiliation Details</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.affiliation.number}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      affiliation: { ...prev.affiliation, number: e.target.value }
                    }))}
                    placeholder="Affiliation Number"
                  />
                  <Input
                    value={formData.affiliation.board}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      affiliation: { ...prev.affiliation, board: e.target.value }
                    }))}
                    placeholder="Affiliated Board"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">School Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.files?.[0] }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Address & Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Street Address *</label>
                <Input
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  placeholder="Complete address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <Input
                    value={formData.address.city}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, city: e.target.value }
                    }))}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State *</label>
                  <select
                    value={formData.address.state}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, state: e.target.value }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select State</option>
                    {indianStates.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Pincode *</label>
                  <Input
                    value={formData.address.pincode}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      address: { ...prev.address, pincode: e.target.value }
                    }))}
                    placeholder="Pincode"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <Input
                    value={formData.contact.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, phone: e.target.value }
                    }))}
                    placeholder="School phone number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <Input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, email: e.target.value }
                    }))}
                    placeholder="School email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Website</label>
                  <Input
                    value={formData.contact.website}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      contact: { ...prev.contact, website: e.target.value }
                    }))}
                    placeholder="School website"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Administrative Contacts</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Principal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={formData.principal.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      principal: { ...prev.principal, name: e.target.value }
                    }))}
                    placeholder="Principal Name *"
                  />
                  <Input
                    value={formData.principal.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      principal: { ...prev.principal, phone: e.target.value }
                    }))}
                    placeholder="Principal Phone *"
                  />
                  <Input
                    type="email"
                    value={formData.principal.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      principal: { ...prev.principal, email: e.target.value }
                    }))}
                    placeholder="Principal Email *"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">System Administrator</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    value={formData.admin.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      admin: { ...prev.admin, name: e.target.value }
                    }))}
                    placeholder="Admin Name *"
                  />
                  <Input
                    value={formData.admin.phone}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      admin: { ...prev.admin, phone: e.target.value }
                    }))}
                    placeholder="Admin Phone *"
                  />
                  <Input
                    type="email"
                    value={formData.admin.email}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      admin: { ...prev.admin, email: e.target.value }
                    }))}
                    placeholder="Admin Email *"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={() => setStep(step - 1)}
            disabled={step === 1}
          >
            Previous
          </Button>
          
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)}>
              Next
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? 'Registering...' : 'Register School'}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}