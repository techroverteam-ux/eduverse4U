'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/layout/sidebar"
import { Upload, Download, Users, FileText, CreditCard } from "lucide-react"

export default function BulkOperationsPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadType, setUploadType] = useState('students')
  const [processing, setProcessing] = useState(false)

  const handleFileUpload = async () => {
    if (!selectedFile) return

    setProcessing(true)
    
    // Simulate file processing
    setTimeout(() => {
      alert(`${selectedFile.name} processed successfully! ${uploadType} data imported.`)
      setProcessing(false)
      setSelectedFile(null)
    }, 2000)
  }

  const downloadTemplate = (type: string) => {
    const templates = {
      students: 'admission_number,first_name,last_name,class,section,parent_email\n2024001,John,Doe,10,A,parent@email.com',
      fees: 'student_admission_number,fee_type,amount,due_date\n2024001,Tuition Fee,5000,2024-01-05',
      attendance: 'admission_number,date,status\n2024001,2024-01-15,present'
    }

    const content = templates[type as keyof typeof templates]
    const blob = new Blob([content], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${type}_template.csv`
    a.click()
  }

  const bulkOperations = [
    {
      title: 'Student Import',
      description: 'Upload CSV file to add multiple students at once',
      icon: Users,
      type: 'students',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Fee Collection',
      description: 'Bulk fee payment processing from CSV',
      icon: CreditCard,
      type: 'fees',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Attendance Import',
      description: 'Import attendance data from external systems',
      icon: FileText,
      type: 'attendance',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Bulk Operations</h1>
            <p className="text-gray-600">Import and export data in bulk using CSV files</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {bulkOperations.map((operation, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${operation.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <operation.icon className={`h-6 w-6 ${operation.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{operation.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{operation.description}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadTemplate(operation.type)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="uploadType">Data Type</Label>
                  <select
                    id="uploadType"
                    value={uploadType}
                    onChange={(e) => setUploadType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="students">Students</option>
                    <option value="fees">Fee Payments</option>
                    <option value="attendance">Attendance</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">CSV File</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>

                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || processing}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {processing ? 'Processing...' : 'Upload & Process'}
                </Button>

                {selectedFile && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export All Students
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Fee Records
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Attendance Data
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export Parent Contacts
                  </Button>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Custom Export</h4>
                  <div className="space-y-2">
                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Select Class</option>
                      <option>Class 1</option>
                      <option>Class 2</option>
                      <option>Class 3</option>
                    </select>
                    <Button variant="outline" className="w-full">
                      Export Class Data
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}