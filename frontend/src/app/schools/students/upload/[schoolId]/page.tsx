"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Upload, Users, UserPlus, Download, 
  CheckCircle, AlertCircle, FileText
} from "lucide-react"

interface Student {
  firstName: string
  lastName: string
  fatherName: string
  motherName: string
  dateOfBirth: string
  gender: 'male' | 'female' | 'other'
  class: string
  section: string
  rollNumber: string
  admissionNumber: string
  admissionDate: string
  address: string
  parentPhone: string
  parentEmail: string
  bloodGroup: string
  religion: string
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'Other'
  previousSchool?: string
}

export default function StudentsUploadPage({ params }: { params: { schoolId: string } }) {
  const [uploadType, setUploadType] = useState<'single' | 'bulk'>('single')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  
  const [singleStudent, setSingleStudent] = useState<Student>({
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    gender: 'male',
    class: '',
    section: '',
    rollNumber: '',
    admissionNumber: '',
    admissionDate: '',
    address: '',
    parentPhone: '',
    parentEmail: '',
    bloodGroup: '',
    religion: '',
    category: 'General',
    previousSchool: ''
  })

  const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const sections = ['A', 'B', 'C', 'D', 'Science', 'Commerce', 'Arts']
  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

  const handleBulkUpload = async () => {
    if (!file) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('schoolId', params.schoolId)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/students/bulk-upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setResults(result)
        alert(`${result.successful} students uploaded successfully! Login credentials generated.`)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSingleUpload = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/students`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleStudent)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Student added! Username: ${result.username}, Password: ${result.password}`)
        setSingleStudent({
          firstName: '', lastName: '', fatherName: '', motherName: '', dateOfBirth: '',
          gender: 'male', class: '', section: '', rollNumber: '', admissionNumber: '',
          admissionDate: '', address: '', parentPhone: '', parentEmail: '',
          bloodGroup: '', religion: '', category: 'General', previousSchool: ''
        })
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed')
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent = `firstName,lastName,fatherName,motherName,dateOfBirth,gender,class,section,rollNumber,admissionNumber,admissionDate,address,parentPhone,parentEmail,bloodGroup,religion,category,previousSchool
Rahul,Sharma,Suresh Sharma,Sunita Sharma,2010-05-15,male,5,A,001,ADM001,2024-04-01,"123 Main St Delhi",9876543210,parent@email.com,B+,Hindu,General,ABC School
Priya,Singh,Rajesh Singh,Meera Singh,2011-03-20,female,4,B,002,ADM002,2024-04-01,"456 Park Ave Mumbai",9876543211,parent2@email.com,A+,Hindu,OBC,XYZ School`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'students_template.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Upload Students</h1>
          <p className="text-gray-600 mt-2">Add students individually or in bulk with automatic account generation</p>
        </div>

        {/* Upload Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Upload Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Button 
                variant={uploadType === 'single' ? 'default' : 'outline'}
                onClick={() => setUploadType('single')}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Single Student
              </Button>
              <Button 
                variant={uploadType === 'bulk' ? 'default' : 'outline'}
                onClick={() => setUploadType('bulk')}
              >
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </div>
          </CardContent>
        </Card>

        {uploadType === 'single' && (
          <Card>
            <CardHeader>
              <CardTitle>Add Single Student</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    placeholder="First Name"
                    value={singleStudent.firstName}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                  <Input
                    placeholder="Last Name"
                    value={singleStudent.lastName}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Date of Birth"
                    value={singleStudent.dateOfBirth}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                  />
                  <select
                    value={singleStudent.gender}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, gender: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={singleStudent.bloodGroup}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, bloodGroup: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Blood Group</option>
                    {bloodGroups.map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Religion"
                    value={singleStudent.religion}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, religion: e.target.value }))}
                  />
                </div>
              </div>

              {/* Family Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Family Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Father's Name"
                    value={singleStudent.fatherName}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, fatherName: e.target.value }))}
                  />
                  <Input
                    placeholder="Mother's Name"
                    value={singleStudent.motherName}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, motherName: e.target.value }))}
                  />
                  <Input
                    placeholder="Parent Phone"
                    value={singleStudent.parentPhone}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, parentPhone: e.target.value }))}
                  />
                  <Input
                    type="email"
                    placeholder="Parent Email"
                    value={singleStudent.parentEmail}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, parentEmail: e.target.value }))}
                  />
                </div>
                <Input
                  placeholder="Address"
                  value={singleStudent.address}
                  onChange={(e) => setSingleStudent(prev => ({ ...prev, address: e.target.value }))}
                  className="mt-4"
                />
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-medium mb-4">Academic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <select
                    value={singleStudent.class}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, class: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Class</option>
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                  <select
                    value={singleStudent.section}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, section: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">Select Section</option>
                    {sections.map(sec => (
                      <option key={sec} value={sec}>{sec}</option>
                    ))}
                  </select>
                  <Input
                    placeholder="Roll Number"
                    value={singleStudent.rollNumber}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, rollNumber: e.target.value }))}
                  />
                  <Input
                    placeholder="Admission Number"
                    value={singleStudent.admissionNumber}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, admissionNumber: e.target.value }))}
                  />
                  <Input
                    type="date"
                    placeholder="Admission Date"
                    value={singleStudent.admissionDate}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, admissionDate: e.target.value }))}
                  />
                  <select
                    value={singleStudent.category}
                    onChange={(e) => setSingleStudent(prev => ({ ...prev, category: e.target.value as any }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="General">General</option>
                    <option value="OBC">OBC</option>
                    <option value="SC">SC</option>
                    <option value="ST">ST</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <Input
                  placeholder="Previous School (Optional)"
                  value={singleStudent.previousSchool}
                  onChange={(e) => setSingleStudent(prev => ({ ...prev, previousSchool: e.target.value }))}
                  className="mt-4"
                />
              </div>

              <Button onClick={handleSingleUpload} disabled={loading} className="w-full">
                {loading ? 'Adding Student...' : 'Add Student'}
              </Button>
            </CardContent>
          </Card>
        )}

        {uploadType === 'bulk' && (
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Students</CardTitle>
              <CardDescription>Upload multiple students using CSV file with automatic account generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Choose CSV file or drag and drop
                    </span>
                    <input
                      type="file"
                      accept=".csv"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
                {file && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              <div className="flex space-x-4">
                <Button variant="outline" onClick={downloadTemplate}>
                  <Download className="mr-2 h-4 w-4" />
                  Download Template
                </Button>
                <Button onClick={handleBulkUpload} disabled={!file || loading}>
                  {loading ? 'Uploading...' : 'Upload Students'}
                </Button>
              </div>

              {results && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Upload Results</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Successfully uploaded: {results.successful} students
                  </p>
                  <p className="text-sm text-green-700">
                    Login credentials have been generated and sent to parent emails
                  </p>
                  {results.failed > 0 && (
                    <p className="text-sm text-red-700">
                      Failed: {results.failed} students
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}