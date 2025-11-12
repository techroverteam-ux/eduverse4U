"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { useNavigation } from "@/hooks/useNavigation"
import { api } from "@/lib/api"
import { superAdminAPI } from "@/lib/api/super-admin"
import { 
  Building2, Users, MapPin, Phone, Mail, Calendar, Crown,
  CheckCircle, AlertCircle, Upload, FileText, Shield,
  GraduationCap, IndianRupee, Loader2, ArrowLeft, ArrowRight, Plus, Trash2
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

interface SubscriptionPlan {
  id: string
  name: string
  code: string
  monthlyPrice: number
  yearlyPrice: number
  maxStudents: number
  maxBranches: number
  features: string[]
}

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
  address: string
  city: string
  state: string
  pincode: string
  district: string
  country: string
  
  // Contact Information
  phone: string
  email: string
  website: string
  
  // Principal Information
  principalName: string
  principalPhone: string
  principalEmail: string
  principalQualification: string
  principalExperience: string
  
  // Admin Information
  adminName: string
  adminPhone: string
  adminEmail: string
  
  // Academic Information
  mediumOfInstruction: string[]
  classesOffered: string[]
  
  // Statistics
  totalStudents: number
  totalTeachers: number
  totalStaff: number
  totalClassrooms: number
  
  // Infrastructure
  hasLibrary: boolean
  hasLaboratory: boolean
  hasComputerLab: boolean
  hasPlayground: boolean
  hasAuditorium: boolean
  hasMedicalRoom: boolean
  hasCanteen: boolean
  hasTransport: boolean
  
  // Subscription
  subscriptionPlanId: string
  billingCycle: string
  
  // Documents
  logo?: File
}

export default function AddSchoolPage() {
  const navigation = useNavigation()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([])
  const generateRandomBranch = (isMain = false, index = 0) => {
    const cities = [{ city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }, { city: 'Delhi', state: 'Delhi', pincode: '110001' }]
    const managers = ['Rakesh Gupta', 'Sunita Verma', 'Amit Singh']
    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    const randomManager = managers[Math.floor(Math.random() * managers.length)]
    
    return {
      name: isMain ? 'Main Campus' : `Branch ${index + 1}`,
      branchCode: isMain ? 'MAIN' : `BR${index + 1}`,
      address: `${Math.floor(Math.random() * 999) + 1}, Campus Road, Sector ${Math.floor(Math.random() * 50) + 1}`,
      city: randomCity.city,
      state: randomCity.state,
      pincode: randomCity.pincode,
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `${isMain ? 'main' : 'branch' + (index + 1)}@school.edu.in`,
      branchManager: randomManager,
      students: Math.floor(Math.random() * 1000) + 100,
      teachers: Math.floor(Math.random() * 50) + 10,
      isMainBranch: isMain
    }
  }

  const [branches, setBranches] = useState<Branch[]>([generateRandomBranch(true)])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const generateRandomData = () => {
    const schools = ['Delhi Public School', 'Ryan International', 'Kendriya Vidyalaya', 'DAV Public School', 'St. Xavier\'s School']
    const cities = [{ city: 'Mumbai', state: 'Maharashtra', pincode: '400001' }, { city: 'Delhi', state: 'Delhi', pincode: '110001' }, { city: 'Bangalore', state: 'Karnataka', pincode: '560001' }]
    const principals = ['Dr. Rajesh Kumar', 'Mrs. Priya Sharma', 'Mr. Suresh Reddy', 'Dr. Meera Nair']
    const admins = ['Rakesh Gupta', 'Sunita Verma', 'Amit Singh', 'Kavita Joshi']
    
    const randomSchool = schools[Math.floor(Math.random() * schools.length)]
    const randomCity = cities[Math.floor(Math.random() * cities.length)]
    const randomPrincipal = principals[Math.floor(Math.random() * principals.length)]
    const randomAdmin = admins[Math.floor(Math.random() * admins.length)]
    const randomYear = 1990 + Math.floor(Math.random() * 30)
    const randomCode = randomSchool.split(' ').map(word => word.charAt(0)).join('').toUpperCase() + Math.floor(Math.random() * 100)
    
    return {
      schoolName: randomSchool,
      schoolCode: randomCode,
      establishedYear: randomYear.toString(),
      schoolType: SCHOOL_TYPES[Math.floor(Math.random() * SCHOOL_TYPES.length)].value,
      board: BOARDS[Math.floor(Math.random() * BOARDS.length)].value,
      registrationNumber: `REG${Math.floor(Math.random() * 900000) + 100000}`,
      affiliationNumber: `AFF${Math.floor(Math.random() * 900000) + 100000}`,
      address: `${Math.floor(Math.random() * 999) + 1}, ${randomSchool} Road, Sector ${Math.floor(Math.random() * 50) + 1}`,
      city: randomCity.city,
      state: randomCity.state,
      pincode: randomCity.pincode,
      district: randomCity.city + ' District',
      country: 'India',
      phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `contact@${randomCode.toLowerCase()}.edu.in`,
      website: `www.${randomCode.toLowerCase()}.edu.in`,
      principalName: randomPrincipal,
      principalPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      principalEmail: `principal@${randomCode.toLowerCase()}.edu.in`,
      principalQualification: 'M.Ed, Ph.D',
      principalExperience: `${Math.floor(Math.random() * 20) + 5} years in education`,
      adminName: randomAdmin,
      adminPhone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      adminEmail: `admin@${randomCode.toLowerCase()}.edu.in`,
      mediumOfInstruction: ['English', 'Hindi'],
      classesOffered: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
      totalStudents: Math.floor(Math.random() * 2000) + 100,
      totalTeachers: Math.floor(Math.random() * 100) + 20,
      totalStaff: Math.floor(Math.random() * 50) + 10,
      totalClassrooms: Math.floor(Math.random() * 50) + 10,
      hasLibrary: Math.random() > 0.5,
      hasLaboratory: Math.random() > 0.5,
      hasComputerLab: Math.random() > 0.5,
      hasPlayground: Math.random() > 0.5,
      hasAuditorium: Math.random() > 0.5,
      hasMedicalRoom: Math.random() > 0.5,
      hasCanteen: Math.random() > 0.5,
      hasTransport: Math.random() > 0.5,
      subscriptionPlanId: '',
      billingCycle: 'monthly'
    }
  }

  const [formData, setFormData] = useState<SchoolFormData>(generateRandomData)

  useEffect(() => {
    // Set fallback plans immediately
    setSubscriptionPlans([
      {
        id: 'basic',
        name: 'Basic Plan',
        code: 'BASIC',
        monthlyPrice: 2999,
        yearlyPrice: 29990,
        maxStudents: 500,
        maxBranches: 1,
        features: ['Up to 500 students', 'Single branch', 'Basic student management', 'Attendance tracking', 'Email support']
      },
      {
        id: 'standard',
        name: 'Standard Plan',
        code: 'STANDARD',
        monthlyPrice: 4999,
        yearlyPrice: 49990,
        maxStudents: 1500,
        maxBranches: 3,
        features: ['Up to 1500 students', 'Up to 3 branches', 'Advanced management', 'Fee management', 'Priority support']
      },
      {
        id: 'premium',
        name: 'Premium Plan',
        code: 'PREMIUM',
        monthlyPrice: 7999,
        yearlyPrice: 79990,
        maxStudents: -1,
        maxBranches: 10,
        features: ['Unlimited students', 'Up to 10 branches', 'Complete ERP solution', 'Advanced analytics', '24/7 support']
      }
    ])
  }, [])

  const updateFormData = (field: keyof SchoolFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

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
        if (!formData.address) newErrors.address = 'Address is required'
        if (!formData.city) newErrors.city = 'City is required'
        if (!formData.state) newErrors.state = 'State is required'
        if (!formData.phone) newErrors.phone = 'Phone is required'
        if (!formData.email) newErrors.email = 'Email is required'
        break
      case 3:
        if (!formData.principalName) newErrors.principalName = 'Principal name is required'
        if (!formData.principalEmail) newErrors.principalEmail = 'Principal email is required'
        if (!formData.adminName) newErrors.adminName = 'Admin name is required'
        if (!formData.adminEmail) newErrors.adminEmail = 'Admin email is required'
        break
      case 4:
        if (formData.mediumOfInstruction.length === 0) newErrors.medium = 'Select at least one medium'
        if (formData.classesOffered.length === 0) newErrors.classes = 'Select at least one class'
        break
      case 5:
        if (!formData.subscriptionPlanId) newErrors.subscription = 'Please select a subscription plan'
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
      const schoolData = {
        ...formData,
        branches: branches
      }
      
      const mappedData = {
        schoolName: formData.schoolName,
        schoolCode: formData.schoolCode,
        subdomain: formData.schoolCode.toLowerCase(),
        registrationNumber: formData.registrationNumber,
        affiliationBoard: formData.board,
        principalName: formData.principalName,
        principalEmail: formData.principalEmail,
        principalPhone: formData.principalPhone,
        adminEmail: formData.adminEmail,
        addressLine1: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        schoolType: formData.schoolType,
        totalStudents: formData.totalStudents,
        totalTeachers: formData.totalTeachers,
        establishmentYear: parseInt(formData.establishedYear),
        selectedPackage: formData.subscriptionPlanId
      }
      
      const response = await api.post('/super-admin/schools', mappedData)
      console.log('School created:', response)
      navigation.navigateToSchools()
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>School Name *</Label>
                <Input
                  value={formData.schoolName}
                  onChange={(e) => updateFormData('schoolName', e.target.value)}
                  placeholder="Enter school name"
                  className={errors.schoolName ? 'border-red-500' : ''}
                />
                {errors.schoolName && <p className="text-red-500 text-sm mt-1">{errors.schoolName}</p>}
              </div>

              <div>
                <Label>School Code *</Label>
                <Input
                  value={formData.schoolCode}
                  onChange={(e) => updateFormData('schoolCode', e.target.value.toUpperCase())}
                  placeholder="e.g., DPS001"
                  className={errors.schoolCode ? 'border-red-500' : ''}
                />
                {errors.schoolCode && <p className="text-red-500 text-sm mt-1">{errors.schoolCode}</p>}
              </div>

              <div>
                <Label>Established Year *</Label>
                <Input
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => updateFormData('establishedYear', e.target.value)}
                  placeholder="e.g., 1995"
                  min="1800"
                  max={new Date().getFullYear()}
                  className={errors.establishedYear ? 'border-red-500' : ''}
                />
                {errors.establishedYear && <p className="text-red-500 text-sm mt-1">{errors.establishedYear}</p>}
              </div>

              <div>
                <Label>School Type *</Label>
                <Select value={formData.schoolType} onValueChange={(value) => updateFormData('schoolType', value)}>
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
                <Label>Board *</Label>
                <Select value={formData.board} onValueChange={(value) => updateFormData('board', value)}>
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
                <Label>Registration Number</Label>
                <Input
                  value={formData.registrationNumber}
                  onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                  placeholder="School registration number"
                />
              </div>

              <div>
                <Label>Affiliation Number</Label>
                <Input
                  value={formData.affiliationNumber}
                  onChange={(e) => updateFormData('affiliationNumber', e.target.value)}
                  placeholder="Board affiliation number"
                />
              </div>

              <div>
                <Label>School Logo</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.logo ? formData.logo.name : 'Upload school logo'}
                  </p>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/gif"
                    className="hidden"
                    id="logo-upload"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        if (file.size > 2 * 1024 * 1024) {
                          setErrors(prev => ({ ...prev, logo: 'File size must be less than 2MB' }))
                          return
                        }
                        if (!file.type.startsWith('image/')) {
                          setErrors(prev => ({ ...prev, logo: 'Please select an image file' }))
                          return
                        }
                        setErrors(prev => ({ ...prev, logo: '' }))
                        updateFormData('logo', file)
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('logo-upload')?.click()}
                  >
                    {formData.logo ? 'Change File' : 'Choose File'}
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 2MB</p>
                  {errors.logo && <p className="text-red-500 text-xs mt-1">{errors.logo}</p>}
                </div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Address *</Label>
                <Textarea
                  value={formData.address}
                  onChange={(e) => updateFormData('address', e.target.value)}
                  placeholder="Complete address"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <Label>City *</Label>
                <Input
                  value={formData.city}
                  onChange={(e) => updateFormData('city', e.target.value)}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <Label>State *</Label>
                <Select value={formData.state} onValueChange={(value) => updateFormData('state', value)}>
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
                <Label>Pincode</Label>
                <Input
                  value={formData.pincode}
                  onChange={(e) => updateFormData('pincode', e.target.value)}
                  placeholder="Pincode"
                />
              </div>

              <div>
                <Label>District</Label>
                <Input
                  value={formData.district}
                  onChange={(e) => updateFormData('district', e.target.value)}
                  placeholder="District"
                />
              </div>

              <div>
                <Label>Phone Number *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => updateFormData('phone', e.target.value)}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="contact@school.edu.in"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  value={formData.website}
                  onChange={(e) => updateFormData('website', e.target.value)}
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
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Principal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Principal Name *</Label>
                      <Input
                        value={formData.principalName}
                        onChange={(e) => updateFormData('principalName', e.target.value)}
                        placeholder="Dr. John Doe"
                        className={errors.principalName ? 'border-red-500' : ''}
                      />
                      {errors.principalName && <p className="text-red-500 text-sm mt-1">{errors.principalName}</p>}
                    </div>

                    <div>
                      <Label>Principal Email *</Label>
                      <Input
                        type="email"
                        value={formData.principalEmail}
                        onChange={(e) => updateFormData('principalEmail', e.target.value)}
                        placeholder="principal@school.edu.in"
                        className={errors.principalEmail ? 'border-red-500' : ''}
                      />
                      {errors.principalEmail && <p className="text-red-500 text-sm mt-1">{errors.principalEmail}</p>}
                    </div>

                    <div>
                      <Label>Principal Phone</Label>
                      <Input
                        value={formData.principalPhone}
                        onChange={(e) => updateFormData('principalPhone', e.target.value)}
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <Label>Qualification</Label>
                      <Input
                        value={formData.principalQualification}
                        onChange={(e) => updateFormData('principalQualification', e.target.value)}
                        placeholder="M.Ed, Ph.D"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Experience</Label>
                      <Input
                        value={formData.principalExperience}
                        onChange={(e) => updateFormData('principalExperience', e.target.value)}
                        placeholder="15 years in education"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Administrative Contact</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Admin Name *</Label>
                      <Input
                        value={formData.adminName}
                        onChange={(e) => updateFormData('adminName', e.target.value)}
                        placeholder="Jane Smith"
                        className={errors.adminName ? 'border-red-500' : ''}
                      />
                      {errors.adminName && <p className="text-red-500 text-sm mt-1">{errors.adminName}</p>}
                    </div>

                    <div>
                      <Label>Admin Email *</Label>
                      <Input
                        type="email"
                        value={formData.adminEmail}
                        onChange={(e) => updateFormData('adminEmail', e.target.value)}
                        placeholder="admin@school.edu.in"
                        className={errors.adminEmail ? 'border-red-500' : ''}
                      />
                      {errors.adminEmail && <p className="text-red-500 text-sm mt-1">{errors.adminEmail}</p>}
                    </div>

                    <div>
                      <Label>Admin Phone</Label>
                      <Input
                        value={formData.adminPhone}
                        onChange={(e) => updateFormData('adminPhone', e.target.value)}
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
              <h2 className="text-2xl font-bold">Academic & Infrastructure</h2>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Academic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Medium of Instruction *</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                      {MEDIUM_OPTIONS.map(medium => (
                        <div key={medium} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.mediumOfInstruction.includes(medium)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData('mediumOfInstruction', [...formData.mediumOfInstruction, medium])
                              } else {
                                updateFormData('mediumOfInstruction', formData.mediumOfInstruction.filter(m => m !== medium))
                              }
                            }}
                          />
                          <Label className="text-sm">{medium}</Label>
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
                            checked={formData.classesOffered.includes(cls)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateFormData('classesOffered', [...formData.classesOffered, cls])
                              } else {
                                updateFormData('classesOffered', formData.classesOffered.filter(c => c !== cls))
                              }
                            }}
                          />
                          <Label className="text-sm">{cls}</Label>
                        </div>
                      ))}
                    </div>
                    {errors.classes && <p className="text-red-500 text-sm mt-1">{errors.classes}</p>}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Total Students</Label>
                      <Input
                        type="number"
                        value={formData.totalStudents || ''}
                        onChange={(e) => updateFormData('totalStudents', parseInt(e.target.value) || 0)}
                        placeholder="500"
                      />
                    </div>

                    <div>
                      <Label>Total Teachers</Label>
                      <Input
                        type="number"
                        value={formData.totalTeachers || ''}
                        onChange={(e) => updateFormData('totalTeachers', parseInt(e.target.value) || 0)}
                        placeholder="50"
                      />
                    </div>

                    <div>
                      <Label>Total Staff</Label>
                      <Input
                        type="number"
                        value={formData.totalStaff || ''}
                        onChange={(e) => updateFormData('totalStaff', parseInt(e.target.value) || 0)}
                        placeholder="25"
                      />
                    </div>

                    <div>
                      <Label>Total Classrooms</Label>
                      <Input
                        type="number"
                        value={formData.totalClassrooms || ''}
                        onChange={(e) => updateFormData('totalClassrooms', parseInt(e.target.value) || 0)}
                        placeholder="30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Infrastructure</CardTitle>
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
                          checked={formData[facility.key as keyof SchoolFormData] as boolean}
                          onCheckedChange={(checked) => updateFormData(facility.key as keyof SchoolFormData, checked)}
                        />
                        <Label>{facility.label}</Label>
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
              <h2 className="text-2xl font-bold">Subscription Plan</h2>
            </div>

            <div className="mb-6">
              <Label>Billing Cycle</Label>
              <Select value={formData.billingCycle} onValueChange={(value) => updateFormData('billingCycle', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly (Save 20%)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {subscriptionPlans.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading subscription plans...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subscriptionPlans.map(plan => (
                  <Card 
                    key={plan.id} 
                    className={`cursor-pointer transition-all border-2 ${
                      formData.subscriptionPlanId === plan.id 
                        ? 'border-blue-500 bg-blue-50 shadow-lg' 
                        : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                    }`}
                    onClick={() => updateFormData('subscriptionPlanId', plan.id)}
                  >
                  <CardHeader className="text-center">
                    {plan.code === 'PREMIUM' && (
                      <div className="flex justify-center mb-2">
                        <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                          <Crown className="h-3 w-3 mr-1" />
                          Popular
                        </span>
                      </div>
                    )}
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-600">
                      ₹{formData.billingCycle === 'yearly' ? plan.yearlyPrice.toLocaleString() : plan.monthlyPrice.toLocaleString()}
                      <span className="text-sm text-gray-500">/{formData.billingCycle === 'yearly' ? 'year' : 'month'}</span>
                    </div>
                    {formData.billingCycle === 'yearly' && (
                      <div className="text-sm text-green-600">Save 20%</div>
                    )}
                  </CardHeader>
                  <CardContent>
                    {formData.subscriptionPlanId === plan.id && (
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Selected
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-blue-500" />
                        {plan.maxStudents === -1 ? 'Unlimited' : plan.maxStudents} students
                      </div>
                      <div className="flex items-center text-sm">
                        <Building2 className="h-4 w-4 mr-2 text-green-500" />
                        {plan.maxBranches === -1 ? 'Unlimited' : plan.maxBranches} branches
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {plan.features.slice(0, 4).map((feature, index) => (
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
            )}
            {errors.subscription && <p className="text-red-500 text-sm text-center">{errors.subscription}</p>}
          </div>
        )

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h2 className="text-2xl font-bold">Branch Management</h2>
              <p className="text-gray-600">Configure school branches</p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">School Branches</h3>
              <Button onClick={addBranch} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Branch
              </Button>
            </div>

            <div className="space-y-4">
              {branches.map((branch, index) => (
                <Card key={index} className={branch.isMainBranch ? 'ring-2 ring-blue-500' : ''}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">
                          {branch.isMainBranch ? 'Main Branch' : `Branch ${index + 1}`}
                        </span>
                        {branch.isMainBranch && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Primary
                          </span>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        {!branch.isMainBranch && (
                          <Button variant="outline" size="sm" onClick={() => setMainBranch(index)}>
                            Set as Main
                          </Button>
                        )}
                        {branches.length > 1 && !branch.isMainBranch && (
                          <Button variant="outline" size="sm" onClick={() => removeBranch(index)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Branch Name</Label>
                        <Input
                          value={branch.name}
                          onChange={(e) => updateBranch(index, 'name', e.target.value)}
                          placeholder="Main Campus"
                        />
                      </div>
                      <div>
                        <Label>Branch Code</Label>
                        <Input
                          value={branch.branchCode}
                          onChange={(e) => updateBranch(index, 'branchCode', e.target.value.toUpperCase())}
                          placeholder="MAIN"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label>Address</Label>
                        <Input
                          value={branch.address}
                          onChange={(e) => updateBranch(index, 'address', e.target.value)}
                          placeholder="Branch address"
                        />
                      </div>
                      <div>
                        <Label>City</Label>
                        <Input
                          value={branch.city}
                          onChange={(e) => updateBranch(index, 'city', e.target.value)}
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <Label>State</Label>
                        <Select value={branch.state} onValueChange={(value) => updateBranch(index, 'state', value)}>
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
                        <Label>Phone</Label>
                        <Input
                          value={branch.phone}
                          onChange={(e) => updateBranch(index, 'phone', e.target.value)}
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input
                          value={branch.email}
                          onChange={(e) => updateBranch(index, 'email', e.target.value)}
                          placeholder="branch@school.edu.in"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigation.navigateToSchools()}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Schools
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add New School</h1>
                <p className="text-gray-600 text-sm">Complete school registration with all details</p>
              </div>
            </div>
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
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep === 6 ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating School...
                </>
              ) : (
                <>
                  Create School
                  <CheckCircle className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          ) : (
            <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{errors.submit}</p>
          </div>
        )}
      </div>
    </div>
  )
}