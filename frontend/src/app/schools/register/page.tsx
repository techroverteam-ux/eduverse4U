"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useNavigation } from "@/hooks/useNavigation"
import { api } from "@/lib/api"
import { 
  Building2, Users, MapPin, Phone, Mail, Calendar,
  CheckCircle, AlertCircle, Upload, FileText, Shield,
  GraduationCap, IndianRupee, Loader2, ArrowLeft, ArrowRight
} from "lucide-react"

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
]

const SCHOOL_TYPES = [
  { value: "primary", label: "Primary School (1-5)" },
  { value: "middle", label: "Middle School (6-8)" },
  { value: "secondary", label: "Secondary School (9-10)" },
  { value: "higher_secondary", label: "Higher Secondary (11-12)" },
  { value: "all_levels", label: "All Levels (1-12)" }
]

const BOARDS = [
  { value: "CBSE", label: "CBSE" },
  { value: "ICSE", label: "ICSE" },
  { value: "State_Board", label: "State Board" },
  { value: "IB", label: "International Baccalaureate" },
  { value: "Cambridge", label: "Cambridge" },
  { value: "Other", label: "Other" }
]

const MEDIUM_OPTIONS = [
  "English", "Hindi", "Bengali", "Tamil", "Telugu", "Marathi", 
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Urdu", "Other"
]

const CLASSES_OPTIONS = [
  "Pre-KG", "KG", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"
]

const PACKAGES = [
  {
    id: "basic",
    name: "Basic Plan",
    price: 2999,
    features: [
      "Up to 500 students",
      "Basic student management",
      "Attendance tracking",
      "Basic reports",
      "Email support"
    ]
  },
  {
    id: "standard",
    name: "Standard Plan", 
    price: 4999,
    features: [
      "Up to 1500 students",
      "Advanced student management",
      "Fee management",
      "Parent portal",
      "SMS notifications",
      "Priority support"
    ]
  },
  {
    id: "premium",
    name: "Premium Plan",
    price: 7999,
    features: [
      "Unlimited students",
      "Complete ERP solution",
      "Advanced analytics",
      "Mobile app",
      "Custom integrations",
      "24/7 dedicated support"
    ]
  }
]

interface SchoolFormData {
  // Basic Information
  schoolName: string
  schoolCode: string
  establishedYear: string
  schoolType: string
  board: string
  registrationNumber: string
  affiliationNumber: string
  
  // Address
  address: {
    street: string
    city: string
    state: string
    pincode: string
    district: string
    country: string
  }
  
  // Contact Information
  contact: {
    phone: string
    email: string
    website: string
  }
  
  // Principal Information
  principal: {
    name: string
    phone: string
    email: string
    qualification: string
    experience: string
  }
  
  // Admin Information
  admin: {
    name: string
    phone: string
    email: string
  }
  
  // School Details
  mediumOfInstruction: string[]
  classesOffered: string[]
  totalStudents: number
  totalTeachers: number
  totalStaff: number
  
  // Infrastructure
  totalClassrooms: number
  hasLibrary: boolean
  hasLaboratory: boolean
  hasComputerLab: boolean
  hasPlayground: boolean
  hasAuditorium: boolean
  hasMedicalRoom: boolean
  hasCanteen: boolean
  hasTransport: boolean
  
  // Package Selection
  selectedPackage: string
  
  // Documents
  documents: {
    logo?: File
    registrationCertificate?: File
    affiliationCertificate?: File
    noc?: File
  }
}

export default function SchoolRegistration() {
  const navigation = useNavigation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<SchoolFormData>({
    schoolName: '',
    schoolCode: '',
    establishedYear: '',
    schoolType: '',
    board: '',
    registrationNumber: '',
    affiliationNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      district: '',
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
      email: '',
      qualification: '',
      experience: ''
    },
    admin: {
      name: '',
      phone: '',
      email: ''
    },
    mediumOfInstruction: [],
    classesOffered: [],
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    totalClassrooms: 0,
    hasLibrary: false,
    hasLaboratory: false,
    hasComputerLab: false,
    hasPlayground: false,
    hasAuditorium: false,
    hasMedicalRoom: false,
    hasCanteen: false,
    hasTransport: false,
    selectedPackage: '',
    documents: {}
  })

  const updateFormData = (section: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof SchoolFormData],
        [field]: value
      }
    }))
  }

  const updateNestedFormData = (section: keyof SchoolFormData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }))
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1:
        if (!formData.schoolName) newErrors.schoolName = 'School name is required'
        if (!formData.schoolCode) newErrors.schoolCode = 'School code is required'
        if (!formData.establishedYear) newErrors.establishedYear = 'Established year is required'
        if (!formData.schoolType) newErrors.schoolType = 'School type is required'
        if (!formData.board) newErrors.board = 'Board is required'
        break
      case 2:
        if (!formData.address.street) newErrors.street = 'Address is required'
        if (!formData.address.city) newErrors.city = 'City is required'
        if (!formData.address.state) newErrors.state = 'State is required'
        if (!formData.address.pincode) newErrors.pincode = 'Pincode is required'
        if (!formData.contact.phone) newErrors.phone = 'Phone is required'
        if (!formData.contact.email) newErrors.email = 'Email is required'
        break
      case 3:
        if (!formData.principal.name) newErrors.principalName = 'Principal name is required'
        if (!formData.principal.email) newErrors.principalEmail = 'Principal email is required'
        if (!formData.principal.phone) newErrors.principalPhone = 'Principal phone is required'
        if (!formData.admin.name) newErrors.adminName = 'Admin name is required'
        if (!formData.admin.email) newErrors.adminEmail = 'Admin email is required'
        break
      case 4:
        if (formData.mediumOfInstruction.length === 0) newErrors.medium = 'Select at least one medium'
        if (formData.classesOffered.length === 0) newErrors.classes = 'Select at least one class'
        if (!formData.totalStudents) newErrors.students = 'Total students is required'
        if (!formData.totalTeachers) newErrors.teachers = 'Total teachers is required'
        break
      case 5:
        if (!formData.selectedPackage) newErrors.package = 'Please select a package'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 6))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(5)) return

    setIsSubmitting(true)
    try {
      const response = await api.post('/super-admin/schools', {
        schoolName: formData.schoolName,
        schoolCode: formData.schoolCode,
        subdomain: formData.schoolCode.toLowerCase(),
        registrationNumber: formData.registrationNumber,
        affiliationBoard: formData.board,
        principalName: formData.principal.name,
        principalEmail: formData.principal.email,
        principalPhone: formData.principal.phone,
        adminEmail: formData.admin.email,
        addressLine1: formData.address.street,
        city: formData.address.city,
        state: formData.address.state,
        pincode: formData.address.pincode,
        schoolType: formData.schoolType,
        totalStudents: formData.totalStudents,
        totalTeachers: formData.totalTeachers,
        establishmentYear: parseInt(formData.establishedYear),
        selectedPackage: formData.selectedPackage
      })

      setSubmitSuccess(true)
      setCurrentStep(6)
    } catch (error) {
      console.error('Registration failed:', error)
      setErrors({ submit: 'Registration failed. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Basic School Information</h2>
              <p className="text-gray-600">Tell us about your school</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="schoolName">School Name *</Label>
                <Input
                  id="schoolName"
                  value={formData.schoolName}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
                  placeholder="Enter school name"
                  className={errors.schoolName ? 'border-red-500' : ''}
                />
                {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
              </div>

              <div>
                <Label htmlFor="schoolCode">School Code *</Label>
                <Input
                  id="schoolCode"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolCode: e.target.value.toUpperCase() }))}
                  placeholder="e.g., DPS001"
                  className={errors.schoolCode ? 'border-red-500' : ''}
                />
                {errors.schoolCode && <p className="text-red-500 text-sm mt-1">{errors.schoolCode}</p>}
              </div>

              <div>
                <Label htmlFor="establishedYear">Established Year *</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
                  placeholder="e.g., 1995"
                  min="1800"
                  max={new Date().getFullYear()}
                  className={errors.establishedYear ? 'border-red-500' : ''}
                />
                {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <Label htmlFor="schoolType">School Type *</Label>
                <Select value={formData.schoolType} onValueChange={(value) => setFormData(prev => ({ ...prev, schoolType: value }))}>
                  <SelectTrigger className={errors.schoolType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select school type" />
                  </SelectTrigger>
                  <SelectContent>
                    {SCHOOL_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.schoolType && <p className="text-red-500 text-sm mt-1">{errors.schoolType}</p>}
              </div>

              <div>
                <Label htmlFor="board">Board *</Label>
                <Select value={formData.board} onValueChange={(value) => setFormData(prev => ({ ...prev, board: value }))}>
                  <SelectTrigger className={errors.board ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select board" />
                  </SelectTrigger>
                  <SelectContent>
                    {BOARDS.map(board => (
                      <SelectItem key={board.value} value={board.value}>{board.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.board && <p className="text-red-500 text-sm mt-1">{errors.board}</p>}
              </div>

              <div>
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                  placeholder="School registration number"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="affiliationNumber">Affiliation Number</Label>
                <Input
                  id="affiliationNumber"
                  value={formData.affiliationNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, affiliationNumber: e.target.value }))}
                  placeholder="Board affiliation number"
                />
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Address & Contact</h2>
              <p className="text-gray-600">Where is your school located?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="street">Address *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) => updateNestedFormData('address', 'street', e.target.value)}
                  placeholder="Street address"
                  className={errors.street ? 'border-red-500' : ''}
                />
                {errors.street && <p className="text-red-500 text-sm mt-1">{errors.street}</p>}
              </div>

              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) => updateNestedFormData('address', 'city', e.target.value)}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <Select value={formData.address.state} onValueChange={(value) => updateNestedFormData('address', 'state', value)}>
                  <SelectTrigger className={errors.state ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
              </div>

              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  value={formData.address.pincode}
                  onChange={(e) => updateNestedFormData('address', 'pincode', e.target.value)}
                  placeholder="Pincode"
                  className={errors.pincode ? 'border-red-500' : ''}
                />
                {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
              </div>

              <div>
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  value={formData.address.district}
                  onChange={(e) => updateNestedFormData('address', 'district', e.target.value)}
                  placeholder="District"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.contact.phone}
                  onChange={(e) => updateNestedFormData('contact', 'phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => updateNestedFormData('contact', 'email', e.target.value)}
                  placeholder="contact@school.edu.in"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.contact.website}
                  onChange={(e) => updateNestedFormData('contact', 'website', e.target.value)}
                  placeholder="www.school.edu.in"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Key Personnel</h2>
              <p className="text-gray-600">Principal and administrative contacts</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Principal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="principalName">Principal Name *</Label>
                      <Input
                        id="principalName"
                        value={formData.principal.name}
                        onChange={(e) => updateNestedFormData('principal', 'name', e.target.value)}
                        placeholder="Dr. John Doe"
                        className={errors.principalName ? 'border-red-500' : ''}
                      />
                      {errors.principalName && <p className="text-red-500 text-sm mt-1">{errors.principalName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="principalEmail">Principal Email *</Label>
                      <Input
                        id="principalEmail"
                        type="email"
                        value={formData.principal.email}
                        onChange={(e) => updateNestedFormData('principal', 'email', e.target.value)}
                        placeholder="principal@school.edu.in"
                        className={errors.principalEmail ? 'border-red-500' : ''}
                      />
                      {errors.principalEmail && <p className="text-red-500 text-sm mt-1">{errors.principalEmail}</p>}
                    </div>

                    <div>
                      <Label htmlFor="principalPhone">Principal Phone *</Label>
                      <Input
                        id="principalPhone"
                        value={formData.principal.phone}
                        onChange={(e) => updateNestedFormData('principal', 'phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={errors.principalPhone ? 'border-red-500' : ''}
                      />
                      {errors.principalPhone && <p className="text-red-500 text-sm mt-1">{errors.principalPhone}</p>}
                    </div>

                    <div>
                      <Label htmlFor="principalQualification">Qualification</Label>
                      <Input
                        id="principalQualification"
                        value={formData.principal.qualification}
                        onChange={(e) => updateNestedFormData('principal', 'qualification', e.target.value)}
                        placeholder="M.Ed, Ph.D"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label htmlFor="principalExperience">Experience (Years)</Label>
                      <Input
                        id="principalExperience"
                        value={formData.principal.experience}
                        onChange={(e) => updateNestedFormData('principal', 'experience', e.target.value)}
                        placeholder="15 years in education"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Administrative Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="adminName">Admin Name *</Label>
                      <Input
                        id="adminName"
                        value={formData.admin.name}
                        onChange={(e) => updateNestedFormData('admin', 'name', e.target.value)}
                        placeholder="Jane Smith"
                        className={errors.adminName ? 'border-red-500' : ''}
                      />
                      {errors.adminName && <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>}
                    </div>

                    <div>
                      <Label htmlFor="adminEmail">Admin Email *</Label>
                      <Input
                        id="adminEmail"
                        type="email"
                        value={formData.admin.email}
                        onChange={(e) => updateNestedFormData('admin', 'email', e.target.value)}
                        placeholder="admin@school.edu.in"
                        className={errors.adminEmail ? 'border-red-500' : ''}
                      />
                      {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                    </div>

                    <div>
                      <Label htmlFor="adminPhone">Admin Phone</Label>
                      <Input
                        id="adminPhone"
                        value={formData.admin.phone}
                        onChange={(e) => updateNestedFormData('admin', 'phone', e.target.value)}
                        placeholder="+91 98765 43211"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">School Details</h2>
              <p className="text-gray-600">Academic and infrastructure information</p>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Medium of Instruction *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {MEDIUM_OPTIONS.map(medium => (
                        <div key={medium} className="flex items-center space-x-2">
                          <Checkbox
                            id={`medium-${medium}`}
                            checked={formData.mediumOfInstruction.includes(medium)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  mediumOfInstruction: [...prev.mediumOfInstruction, medium]
                                }))
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  mediumOfInstruction: prev.mediumOfInstruction.filter(m => m !== medium)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`medium-${medium}`} className="text-sm">{medium}</Label>
                        </div>
                      ))}
                    </div>
                    {errors.medium && <p className="text-red-500 text-sm mt-1">{errors.medium}</p>}
                  </div>

                  <div>
                    <Label>Classes Offered *</Label>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-2">
                      {CLASSES_OPTIONS.map(cls => (
                        <div key={cls} className="flex items-center space-x-2">
                          <Checkbox
                            id={`class-${cls}`}
                            checked={formData.classesOffered.includes(cls)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  classesOffered: [...prev.classesOffered, cls]
                                }))
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  classesOffered: prev.classesOffered.filter(c => c !== cls)
                                }))
                              }
                            }}
                          />
                          <Label htmlFor={`class-${cls}`} className="text-sm">{cls}</Label>
                        </div>
                      ))}
                    </div>
                    {errors.classes && <p className="text-red-500 text-sm mt-1">{errors.classes}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="totalStudents">Total Students *</Label>
                      <Input
                        id="totalStudents"
                        type="number"
                        value={formData.totalStudents || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalStudents: parseInt(e.target.value) || 0 }))}
                        placeholder="500"
                        className={errors.students ? 'border-red-500' : ''}
                      />
                      {errors.students && <p className="text-red-500 text-sm mt-1">{errors.students}</p>}
                    </div>

                    <div>
                      <Label htmlFor="totalTeachers">Total Teachers *</Label>
                      <Input
                        id="totalTeachers"
                        type="number"
                        value={formData.totalTeachers || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalTeachers: parseInt(e.target.value) || 0 }))}
                        placeholder="50"
                        className={errors.teachers ? 'border-red-500' : ''}
                      />
                      {errors.teachers && <p className="text-red-500 text-sm mt-1">{errors.teachers}</p>}
                    </div>

                    <div>
                      <Label htmlFor="totalStaff">Total Staff</Label>
                      <Input
                        id="totalStaff"
                        type="number"
                        value={formData.totalStaff || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalStaff: parseInt(e.target.value) || 0 }))}
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <Label htmlFor="totalClassrooms">Total Classrooms</Label>
                      <Input
                        id="totalClassrooms"
                        type="number"
                        value={formData.totalClassrooms || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, totalClassrooms: parseInt(e.target.value) || 0 }))}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Infrastructure</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'hasLibrary', label: 'Library' },
                      { key: 'hasLaboratory', label: 'Laboratory' },
                      { key: 'hasComputerLab', label: 'Computer Lab' },
                      { key: 'hasPlayground', label: 'Playground' },
                      { key: 'hasAuditorium', label: 'Auditorium' },
                      { key: 'hasMedicalRoom', label: 'Medical Room' },
                      { key: 'hasCanteen', label: 'Canteen' },
                      { key: 'hasTransport', label: 'Transport' }
                    ].map(facility => (
                      <div key={facility.key} className="flex items-center space-x-2">
                        <Checkbox
                          id={facility.key}
                          checked={formData[facility.key as keyof SchoolFormData] as boolean}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, [facility.key]: checked }))}
                        />
                        <Label htmlFor={facility.key}>{facility.label}</Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <IndianRupee className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Choose Your Plan</h2>
              <p className="text-gray-600">Select the package that best fits your needs</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {PACKAGES.map(pkg => (
                <Card 
                  key={pkg.id} 
                  className={`cursor-pointer transition-all ${
                    formData.selectedPackage === pkg.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, selectedPackage: pkg.id }))}
                >
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{pkg.price.toLocaleString()}
                      <span className="text-sm text-gray-500">/month</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
            {errors.package && <p className="text-red-500 text-sm text-center">{errors.package}</p>}
          </div>
        )

      case 6:
        return (
          <div className="text-center space-y-6">
            {submitSuccess ? (
              <>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                <h2 className="text-3xl font-bold text-green-600">Registration Successful!</h2>
                <p className="text-gray-600 max-w-md mx-auto">
                  Your school registration has been submitted successfully. 
                  Our team will review your application and contact you within 24-48 hours.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg max-w-md mx-auto">
                  <p className="text-sm text-blue-800">
                    <strong>Registration ID:</strong> REG-{Date.now()}
                  </p>
                  <p className="text-sm text-blue-800 mt-1">
                    Please save this ID for future reference.
                  </p>
                </div>
                <Button 
                  onClick={() => navigation.navigateToSuperAdminDashboard()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Dashboard
                </Button>
              </>
            ) : (
              <>
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                <h2 className="text-3xl font-bold text-red-600">Registration Failed</h2>
                <p className="text-gray-600">
                  There was an error processing your registration. Please try again.
                </p>
                {errors.submit && <p className="text-red-500">{errors.submit}</p>}
                <Button onClick={() => setCurrentStep(5)} variant="outline">
                  Try Again
                </Button>
              </>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">School Registration</h1>
            <div className="text-sm text-gray-600">
              Step {currentStep} of 6
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {currentStep < 6 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === 5 ? (
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => navigation.navigateTo('/schools/register/branches')}
                  className="flex items-center"
                >
                  <Building2 className="h-4 w-4 mr-2" />
                  Manage Branches
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Registration
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <Button
                onClick={nextStep}
                className="bg-blue-600 hover:bg-blue-700 flex items-center"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}