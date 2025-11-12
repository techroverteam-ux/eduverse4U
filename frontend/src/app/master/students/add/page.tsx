"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  ArrowLeft, Save, User, BookOpen, Phone, Mail, MapPin, 
  Calendar, Users, Building2, FileText, Heart, Shield
} from "lucide-react"
import { toast } from "@/components/ui/toast"
import { masterAPI } from "@/lib/api/master"
import { useFilters } from "@/hooks/useFilters"

interface StudentFormData {
  rollNumber: string
  admissionNumber: string
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  fatherName: string
  motherName: string
  parentPhone: string
  parentEmail: string
  address: string
  admissionDate: string
  classId: string
  academicYearId: string
  branchId: string
  schoolId: string
  bloodGroup: string
  religion: string
  caste: string
  category: string
  aadharNumber: string
  previousSchool: string
  transportRequired: boolean
  hostelRequired: boolean
  medicalConditions: string
  emergencyContact: string
  guardianName: string
  guardianPhone: string
  guardianRelation: string
  photo?: File | null
}

export default function AddStudentPage() {
  const router = useRouter()
  const { filters, loading: filtersLoading, getFilteredBranches, getFilteredClasses, getFilteredAcademicYears } = useFilters()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<StudentFormData>({
    rollNumber: '',
    admissionNumber: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    fatherName: '',
    motherName: '',
    parentPhone: '',
    parentEmail: '',
    address: '',
    admissionDate: new Date().toISOString().split('T')[0],
    classId: '',
    academicYearId: '',
    branchId: '',
    schoolId: '',
    bloodGroup: '',
    religion: '',
    caste: '',
    category: 'General',
    aadharNumber: '',
    previousSchool: '',
    transportRequired: false,
    hostelRequired: false,
    medicalConditions: '',
    emergencyContact: '',
    guardianName: '',
    guardianPhone: '',
    guardianRelation: '',
    photo: null
  })
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!filtersLoading && filters.schools.length > 0) {
      const defaultSchoolId = localStorage.getItem('schoolId') || filters.schools[0]?.id
      if (defaultSchoolId) {
        setFormData(prev => ({ 
          ...prev, 
          schoolId: defaultSchoolId,
          academicYearId: getFilteredAcademicYears(defaultSchoolId)[0]?.id || ''
        }))
        
        // Auto-select branch if school has only one branch
        const schoolBranches = getFilteredBranches(defaultSchoolId)
        if (schoolBranches.length === 1) {
          setFormData(prev => ({ ...prev, branchId: schoolBranches[0].id }))
        }
      }
    }
  }, [filtersLoading, filters.schools])

  useEffect(() => {
    // Reset dependent fields when school changes
    if (formData.schoolId) {
      const schoolBranches = getFilteredBranches(formData.schoolId)
      const schoolClasses = getFilteredClasses(formData.schoolId)
      const schoolAcademicYears = getFilteredAcademicYears(formData.schoolId)
      
      setFormData(prev => ({
        ...prev,
        branchId: schoolBranches.length === 1 ? schoolBranches[0].id : '',
        classId: '',
        academicYearId: schoolAcademicYears.length > 0 ? schoolAcademicYears[0].id : prev.academicYearId
      }))
    }
  }, [formData.schoolId])

  const generateRollNumber = () => {
    const year = new Date().getFullYear().toString().slice(-2)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${year}${random}`
  }

  const generateAdmissionNumber = () => {
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    return `ADM${year}${random}`
  }

  const fillSampleData = () => {
    const sampleNames = [
      { firstName: 'Aarav', lastName: 'Sharma', fatherName: 'Rajesh Sharma', motherName: 'Priya Sharma' },
      { firstName: 'Ananya', lastName: 'Patel', fatherName: 'Amit Patel', motherName: 'Kavita Patel' },
      { firstName: 'Arjun', lastName: 'Singh', fatherName: 'Vikram Singh', motherName: 'Sunita Singh' },
      { firstName: 'Diya', lastName: 'Gupta', fatherName: 'Rohit Gupta', motherName: 'Neha Gupta' },
      { firstName: 'Ishaan', lastName: 'Kumar', fatherName: 'Suresh Kumar', motherName: 'Meera Kumar' },
      { firstName: 'Kavya', lastName: 'Reddy', fatherName: 'Ravi Reddy', motherName: 'Lakshmi Reddy' },
      { firstName: 'Reyansh', lastName: 'Joshi', fatherName: 'Deepak Joshi', motherName: 'Pooja Joshi' },
      { firstName: 'Saanvi', lastName: 'Agarwal', fatherName: 'Manish Agarwal', motherName: 'Ritu Agarwal' }
    ]
    
    const sample = sampleNames[Math.floor(Math.random() * sampleNames.length)]
    const birthYear = 2008 + Math.floor(Math.random() * 5) // Ages 10-15
    const birthMonth = Math.floor(Math.random() * 12) + 1
    const birthDay = Math.floor(Math.random() * 28) + 1
    
    setFormData(prev => ({
      ...prev,
      rollNumber: generateRollNumber(),
      admissionNumber: generateAdmissionNumber(),
      firstName: sample.firstName,
      lastName: sample.lastName,
      dateOfBirth: `${birthYear}-${birthMonth.toString().padStart(2, '0')}-${birthDay.toString().padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'Male' : 'Female',
      fatherName: sample.fatherName,
      motherName: sample.motherName,
      parentPhone: `+91-98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`,
      parentEmail: `${sample.firstName.toLowerCase()}.parent@email.com`,
      address: `${Math.floor(Math.random() * 999) + 1} Sample Street, Demo City, State - ${Math.floor(Math.random() * 900000) + 100000}`,
      bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'][Math.floor(Math.random() * 8)],
      religion: ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist'][Math.floor(Math.random() * 5)],
      category: ['General', 'OBC', 'SC', 'ST', 'EWS'][Math.floor(Math.random() * 5)],
      emergencyContact: `+91-98765${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.firstName || !formData.lastName || !formData.rollNumber || !formData.schoolId) {
      toast.error('Required fields missing', 'Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      await masterAPI.createStudent(formData)
      toast.success('Student added successfully', 'New student has been enrolled')
      router.push('/master/students')
    } catch (error) {
      toast.error('Failed to add student', 'Please check the details and try again')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      admissionNumber: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: 'Male',
      fatherName: '',
      motherName: '',
      parentPhone: '',
      parentEmail: '',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0],
      classId: '',
      academicYearId: getFilteredAcademicYears(formData.schoolId)[0]?.id || '',
      branchId: getFilteredBranches(formData.schoolId).length === 1 ? getFilteredBranches(formData.schoolId)[0].id : '',
      schoolId: formData.schoolId,
      bloodGroup: '',
      religion: '',
      caste: '',
      category: 'General',
      aadharNumber: '',
      previousSchool: '',
      transportRequired: false,
      hostelRequired: false,
      medicalConditions: '',
      emergencyContact: '',
      guardianName: '',
      guardianPhone: '',
      guardianRelation: ''
    })
  }

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/master/students')}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Students</span>
            </Button>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Add New Student
              </h1>
              <p className="text-gray-600 mt-1">Enter student information for enrollment</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={fillSampleData}>
              Fill Sample Data
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Reset Form
            </Button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Enter last name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number *</Label>
                <div className="flex space-x-2">
                  <Input
                    id="rollNumber"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, rollNumber: e.target.value }))}
                    placeholder="Enter roll number"
                    required
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setFormData(prev => ({ ...prev, rollNumber: generateRollNumber() }))}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="admissionNumber">Admission Number</Label>
                <div className="flex space-x-2">
                  <Input
                    id="admissionNumber"
                    value={formData.admissionNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, admissionNumber: e.target.value }))}
                    placeholder="Enter admission number"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setFormData(prev => ({ ...prev, admissionNumber: generateAdmissionNumber() }))}
                  >
                    Generate
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.gender}
                  onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Academic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="schoolId">School *</Label>
                <select
                  id="schoolId"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.schoolId}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolId: e.target.value }))}
                  required
                >
                  <option value="">Select School</option>
                  {filters.schools.map(school => (
                    <option key={school.id} value={school.id}>{school.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="branchId">Branch *</Label>
                <select
                  id="branchId"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.branchId}
                  onChange={(e) => setFormData(prev => ({ ...prev, branchId: e.target.value }))}
                  disabled={!formData.schoolId}
                  required
                >
                  <option value="">Select Branch</option>
                  {getFilteredBranches(formData.schoolId).map(branch => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="classId">Class *</Label>
                <select
                  id="classId"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.classId}
                  onChange={(e) => setFormData(prev => ({ ...prev, classId: e.target.value }))}
                  disabled={!formData.schoolId}
                  required
                >
                  <option value="">Select Class</option>
                  {getFilteredClasses(formData.schoolId).map(cls => (
                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="academicYearId">Academic Year</Label>
                <select
                  id="academicYearId"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.academicYearId}
                  onChange={(e) => setFormData(prev => ({ ...prev, academicYearId: e.target.value }))}
                  disabled={!formData.schoolId}
                >
                  <option value="">Select Academic Year</option>
                  {getFilteredAcademicYears(formData.schoolId).map(ay => (
                    <option key={ay.id} value={ay.id}>{ay.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="admissionDate">Admission Date</Label>
                <Input
                  id="admissionDate"
                  type="date"
                  value={formData.admissionDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, admissionDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                  <option value="EWS">EWS</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Parent Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fatherName">Father's Name</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, fatherName: e.target.value }))}
                  placeholder="Enter father's name"
                />
              </div>
              <div>
                <Label htmlFor="motherName">Mother's Name</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) => setFormData(prev => ({ ...prev, motherName: e.target.value }))}
                  placeholder="Enter mother's name"
                />
              </div>
              <div>
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                  placeholder="Enter parent phone number"
                />
              </div>
              <div>
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input
                  id="parentEmail"
                  type="email"
                  value={formData.parentEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, parentEmail: e.target.value }))}
                  placeholder="Enter parent email"
                />
              </div>
              <div>
                <Label htmlFor="guardianName">Guardian Name</Label>
                <Input
                  id="guardianName"
                  value={formData.guardianName}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianName: e.target.value }))}
                  placeholder="Enter guardian name"
                />
              </div>
              <div>
                <Label htmlFor="guardianPhone">Guardian Phone</Label>
                <Input
                  id="guardianPhone"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, guardianPhone: e.target.value }))}
                  placeholder="Enter guardian phone"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Additional Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <select
                  id="bloodGroup"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData(prev => ({ ...prev, bloodGroup: e.target.value }))}
                >
                  <option value="">Select Blood Group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
              <div>
                <Label htmlFor="religion">Religion</Label>
                <Input
                  id="religion"
                  value={formData.religion}
                  onChange={(e) => setFormData(prev => ({ ...prev, religion: e.target.value }))}
                  placeholder="Enter religion"
                />
              </div>
              <div>
                <Label htmlFor="aadharNumber">Aadhar Number</Label>
                <Input
                  id="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, aadharNumber: e.target.value }))}
                  placeholder="Enter Aadhar number"
                />
              </div>
              <div>
                <Label htmlFor="previousSchool">Previous School</Label>
                <Input
                  id="previousSchool"
                  value={formData.previousSchool}
                  onChange={(e) => setFormData(prev => ({ ...prev, previousSchool: e.target.value }))}
                  placeholder="Enter previous school name"
                />
              </div>
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Enter emergency contact number"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <textarea
                  id="address"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter complete address"
                />
              </div>
              <div>
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <textarea
                  id="medicalConditions"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  rows={3}
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData(prev => ({ ...prev, medicalConditions: e.target.value }))}
                  placeholder="Enter any medical conditions or allergies"
                />
              </div>
            </div>

            <div>
              <Label>Services Required</Label>
              <div className="flex space-x-6 mt-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.transportRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, transportRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Transport Required</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.hostelRequired}
                    onChange={(e) => setFormData(prev => ({ ...prev, hostelRequired: e.target.checked }))}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Hostel Required</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/master/students')}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding Student...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Save className="h-4 w-4" />
                    <span>Add Student</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}