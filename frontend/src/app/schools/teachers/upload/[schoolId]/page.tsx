"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Upload, Users, UserPlus, Download, 
  CheckCircle, AlertCircle, FileText
} from "lucide-react"

interface Teacher {
  firstName: string
  lastName: string
  email: string
  phone: string
  employeeId: string
  subjects: string[]
  classes: string[]
  qualification: string
  experience: number
  joiningDate: string
  salary: number
}

export default function TeachersUploadPage({ params }: { params: { schoolId: string } }) {
  const [uploadType, setUploadType] = useState<'single' | 'bulk'>('single')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<any>(null)
  
  const [singleTeacher, setSingleTeacher] = useState<Teacher>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    subjects: [],
    classes: [],
    qualification: '',
    experience: 0,
    joiningDate: '',
    salary: 0
  })

  const subjects = ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Physics', 'Chemistry', 'Biology', 'Computer Science', 'Sanskrit', 'Physical Education', 'Art', 'EVS']
  const classes = ['Nursery', 'LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']

  const handleBulkUpload = async () => {
    if (!file) return
    
    setLoading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('schoolId', params.schoolId)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/teachers/bulk-upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setResults(result)
        alert(`${result.successful} teachers uploaded successfully!`)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/teachers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(singleTeacher)
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Teacher added! Username: ${result.username}, Password: ${result.password}`)
        setSingleTeacher({
          firstName: '', lastName: '', email: '', phone: '', employeeId: '',
          subjects: [], classes: [], qualification: '', experience: 0, joiningDate: '', salary: 0
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
    const csvContent = `firstName,lastName,email,phone,employeeId,subjects,classes,qualification,experience,joiningDate,salary
John,Doe,john.doe@email.com,9876543210,EMP001,"English,Mathematics","1,2,3",M.Ed,5,2024-01-15,45000
Jane,Smith,jane.smith@email.com,9876543211,EMP002,"Science,Physics","9,10,11",M.Sc,8,2024-01-15,50000`
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'teachers_template.csv'
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">Upload Teachers</h1>
          <p className="text-gray-600 mt-2">Add teachers individually or in bulk</p>
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
                Single Teacher
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
              <CardTitle>Add Single Teacher</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={singleTeacher.firstName}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, firstName: e.target.value }))}
                />
                <Input
                  placeholder="Last Name"
                  value={singleTeacher.lastName}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, lastName: e.target.value }))}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={singleTeacher.email}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, email: e.target.value }))}
                />
                <Input
                  placeholder="Phone"
                  value={singleTeacher.phone}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, phone: e.target.value }))}
                />
                <Input
                  placeholder="Employee ID"
                  value={singleTeacher.employeeId}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, employeeId: e.target.value }))}
                />
                <Input
                  placeholder="Qualification"
                  value={singleTeacher.qualification}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, qualification: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Experience (years)"
                  value={singleTeacher.experience}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, experience: parseInt(e.target.value) }))}
                />
                <Input
                  type="date"
                  placeholder="Joining Date"
                  value={singleTeacher.joiningDate}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, joiningDate: e.target.value }))}
                />
                <Input
                  type="number"
                  placeholder="Salary"
                  value={singleTeacher.salary}
                  onChange={(e) => setSingleTeacher(prev => ({ ...prev, salary: parseInt(e.target.value) }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Subjects</label>
                <div className="grid grid-cols-3 gap-2">
                  {subjects.map(subject => (
                    <label key={subject} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={singleTeacher.subjects.includes(subject)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSingleTeacher(prev => ({ ...prev, subjects: [...prev.subjects, subject] }))
                          } else {
                            setSingleTeacher(prev => ({ ...prev, subjects: prev.subjects.filter(s => s !== subject) }))
                          }
                        }}
                      />
                      <span className="text-sm">{subject}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Classes</label>
                <div className="grid grid-cols-6 gap-2">
                  {classes.map(cls => (
                    <label key={cls} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={singleTeacher.classes.includes(cls)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSingleTeacher(prev => ({ ...prev, classes: [...prev.classes, cls] }))
                          } else {
                            setSingleTeacher(prev => ({ ...prev, classes: prev.classes.filter(c => c !== cls) }))
                          }
                        }}
                      />
                      <span className="text-sm">{cls}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button onClick={handleSingleUpload} disabled={loading} className="w-full">
                {loading ? 'Adding Teacher...' : 'Add Teacher'}
              </Button>
            </CardContent>
          </Card>
        )}

        {uploadType === 'bulk' && (
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Teachers</CardTitle>
              <CardDescription>Upload multiple teachers using CSV file</CardDescription>
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
                  {loading ? 'Uploading...' : 'Upload Teachers'}
                </Button>
              </div>

              {results && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-800">Upload Results</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Successfully uploaded: {results.successful} teachers
                  </p>
                  {results.failed > 0 && (
                    <p className="text-sm text-red-700">
                      Failed: {results.failed} teachers
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