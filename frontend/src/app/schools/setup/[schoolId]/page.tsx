"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Building2, Calendar, BookOpen, Users, 
  IndianRupee, CheckCircle, Settings, Database
} from "lucide-react"

const defaultClasses = [
  { name: 'Nursery', sections: ['A'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'] },
  { name: 'LKG', sections: ['A'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'] },
  { name: 'UKG', sections: ['A'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'] },
  { name: '1', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'] },
  { name: '2', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'] },
  { name: '3', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Art', 'Physical Education'] },
  { name: '4', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Art', 'Physical Education'] },
  { name: '5', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Art', 'Physical Education'] },
  { name: '6', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'] },
  { name: '7', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'] },
  { name: '8', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Art', 'Physical Education'] },
  { name: '9', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Sanskrit', 'Physical Education'] },
  { name: '10', sections: ['A', 'B'], subjects: ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Science', 'Physical Education'] },
  { name: '11', sections: ['Science', 'Commerce', 'Arts'], subjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'] },
  { name: '12', sections: ['Science', 'Commerce', 'Arts'], subjects: ['English', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Computer Science', 'Physical Education'] }
]

const defaultSubjects = [
  { name: 'English', code: 'ENG', type: 'core' },
  { name: 'Hindi', code: 'HIN', type: 'core' },
  { name: 'Mathematics', code: 'MAT', type: 'core' },
  { name: 'Science', code: 'SCI', type: 'core' },
  { name: 'Social Science', code: 'SSC', type: 'core' },
  { name: 'Physics', code: 'PHY', type: 'core' },
  { name: 'Chemistry', code: 'CHE', type: 'core' },
  { name: 'Biology', code: 'BIO', type: 'core' },
  { name: 'Computer Science', code: 'CS', type: 'elective' },
  { name: 'Sanskrit', code: 'SAN', type: 'language' },
  { name: 'Physical Education', code: 'PE', type: 'activity' },
  { name: 'Art', code: 'ART', type: 'activity' },
  { name: 'EVS', code: 'EVS', type: 'core' }
]

export default function SchoolSetupPage({ params }: { params: { schoolId: string } }) {
  const [loading, setLoading] = useState(false)

  const initializeSchool = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/schools/${params.schoolId}/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          classes: defaultClasses,
          subjects: defaultSubjects
        })
      })

      if (response.ok) {
        alert('School initialized successfully!')
      }
    } catch (error) {
      console.error('Initialization failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">School Setup</h1>
          <p className="text-gray-600 mt-2">Initialize your school with Indian education system</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="h-5 w-5" />
              <span>Database Initialization</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">This will create a dedicated database for your school with:</p>
            <ul className="list-disc list-inside space-y-2 mb-6">
              <li>15 Classes (Nursery to Class 12)</li>
              <li>13 Standard subjects</li>
              <li>Default fee structure</li>
              <li>Academic year setup</li>
            </ul>
            <Button onClick={initializeSchool} disabled={loading}>
              {loading ? 'Initializing...' : 'Initialize School Database'}
            </Button>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Upload Teachers</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href={`/schools/${params.schoolId}/teachers/upload`}>Upload Teachers Data</a>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Upload Students</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <a href={`/schools/${params.schoolId}/students/upload`}>Upload Students Data</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}