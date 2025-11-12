"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Building2, Upload, FileText, MapPin, Users, 
  GraduationCap, IndianRupee, CheckCircle, Shield
} from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 'Free up to 150 students, then ₹5/student',
    features: ['Student Management', 'Basic Attendance', 'Fee Collection', 'Basic Reports']
  },
  {
    id: 'standard', 
    name: 'Standard Plan',
    price: '₹2,000/month + ₹3/student (200 free)',
    features: ['All Basic Features', 'Library Management', 'Exam Management', 'Advanced Reports', 'Parent Portal']
  },
  {
    id: 'premium',
    name: 'Premium Plan', 
    price: '₹5,000/month + ₹2/student (300 free)',
    features: ['All Standard Features', 'Accounting & Finance', 'HR Management', 'Transport', 'Hostel', 'Certification']
  }
]

export default function AddSchoolPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    subdomain: '',
    registrationNumber: '',
    affiliationBoard: '',
    principalName: '',
    principalEmail: '',
    principalPhone: '',
    adminEmail: '',
    addressLine1: '',
    city: '',
    state: '',
    pincode: '',
    schoolType: '',
    totalStudents: '',
    selectedPackage: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    switch (step) {
      case 1:
        if (!formData.schoolName) newErrors.schoolName = 'School name is required'
        if (!formData.schoolCode) newErrors.schoolCode = 'School code is required'
        if (!formData.subdomain) newErrors.subdomain = 'Subdomain is required'
        break
      case 2:
        if (!formData.principalName) newErrors.principalName = 'Principal name is required'
        if (!formData.principalEmail) newErrors.principalEmail = 'Principal email is required'
        break
      case 3:
        if (!formData.addressLine1) newErrors.addressLine1 = 'Address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.state) newErrors.state = 'State is required'
        break
      case 4:
        if (!formData.selectedPackage) newErrors.selectedPackage = 'Please select a package'
        break
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/super-admin/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        window.location.href = '/super-admin/schools/success'
      }
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { id: 1, title: 'Basic Info', icon: Building2 },
    { id: 2, title: 'Contact', icon: Users },
    { id: 3, title: 'Address', icon: MapPin },
    { id: 4, title: 'Package', icon: IndianRupee }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <div className="flex items-center space-x-3">
        <Building2 className="h-6 w-6 text-blue-600" />
        <div>
          <h1 className="text-2xl font-bold">Add New School</h1>
          <p className="text-gray-600 text-sm">Complete school registration and onboarding</p>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'border-gray-300 text-gray-400'
                }`}>
                  <step.icon className="h-4 w-4" />
                </div>
                <div className="ml-2 hidden sm:block">
                  <p className={`text-xs font-medium ${
                    currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 mx-2 sm:mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <steps[currentStep - 1].icon className="h-5 w-5" />
            <span>Step {currentStep}: {steps[currentStep - 1].title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="schoolName">School Name *</Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    placeholder="Enter school name"
                    className={errors.schoolName ? 'border-red-500' : ''}
                  />
                  {errors.schoolName && <p className="text-sm text-red-500">{errors.schoolName}</p>}
                </div>
                
                <div>
                  <Label htmlFor="schoolCode">School Code *</Label>
                  <Input
                    id="schoolCode"
                    value={formData.schoolCode}
                    onChange={(e) => handleInputChange('schoolCode', e.target.value.toUpperCase())}
                    placeholder="e.g., DPS001"
                    className={errors.schoolCode ? 'border-red-500' : ''}
                  />
                  {errors.schoolCode && <p className="text-sm text-red-500">{errors.schoolCode}</p>}
                </div>

                <div>
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) => handleInputChange('subdomain', e.target.value.toLowerCase())}
                      placeholder="school-name"
                      className={`rounded-r-none ${errors.subdomain ? 'border-red-500' : ''}`}
                    />
                    <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                      .eduverse.com
                    </div>
                  </div>
                  {errors.subdomain && <p className="text-sm text-red-500">{errors.subdomain}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="registrationNumber">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="School registration number"
                  />
                </div>

                <div>
                  <Label htmlFor="affiliationBoard">Affiliation Board</Label>
                  <Select value={formData.affiliationBoard} onValueChange={(value) => handleInputChange('affiliationBoard', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select affiliation board" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CBSE">CBSE</SelectItem>
                      <SelectItem value="ICSE">ICSE</SelectItem>
                      <SelectItem value="State Board">State Board</SelectItem>
                      <SelectItem value="IB">IB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="principalName">Principal Name *</Label>
                  <Input
                    id="principalName"
                    value={formData.principalName}
                    onChange={(e) => handleInputChange('principalName', e.target.value)}
                    placeholder="Principal's full name"
                    className={errors.principalName ? 'border-red-500' : ''}
                  />
                  {errors.principalName && <p className="text-sm text-red-500">{errors.principalName}</p>}
                </div>

                <div>
                  <Label htmlFor="principalEmail">Principal Email *</Label>
                  <Input
                    id="principalEmail"
                    type="email"
                    value={formData.principalEmail}
                    onChange={(e) => handleInputChange('principalEmail', e.target.value)}
                    placeholder="principal@school.com"
                    className={errors.principalEmail ? 'border-red-500' : ''}
                  />
                  {errors.principalEmail && <p className="text-sm text-red-500">{errors.principalEmail}</p>}
                </div>

                <div>
                  <Label htmlFor="principalPhone">Principal Phone</Label>
                  <Input
                    id="principalPhone"
                    value={formData.principalPhone}
                    onChange={(e) => handleInputChange('principalPhone', e.target.value)}
                    placeholder="+91-9876543210"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                    placeholder="admin@school.com"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="addressLine1">Address *</Label>
                  <Input
                    id="addressLine1"
                    value={formData.addressLine1}
                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                    placeholder="Street address"
                    className={errors.addressLine1 ? 'border-red-500' : ''}
                  />
                  {errors.addressLine1 && <p className="text-sm text-red-500">{errors.addressLine1}</p>}
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="City name"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>

                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => handleInputChange('state', value)}>
                    <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>

                <div>
                  <Label htmlFor="pincode">Pincode</Label>
                  <Input
                    id="pincode"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                    placeholder="6-digit pincode"
                    maxLength={6}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <Label>Select Package *</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  {PACKAGES.map(pkg => (
                    <Card 
                      key={pkg.id} 
                      className={`cursor-pointer transition-all ${
                        formData.selectedPackage === pkg.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => handleInputChange('selectedPackage', pkg.id)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{pkg.name}</CardTitle>
                        <CardDescription className="text-sm font-medium text-blue-600">
                          {pkg.price}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {pkg.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {errors.selectedPackage && <p className="text-sm text-red-500">{errors.selectedPackage}</p>}
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={prevStep}
              disabled={currentStep === 1}
              className="h-9"
            >
              Previous
            </Button>
            
            {currentStep < 4 ? (
              <Button onClick={nextStep} className="h-9">
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={loading} className="h-9">
                {loading ? 'Submitting...' : 'Submit Registration'}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}