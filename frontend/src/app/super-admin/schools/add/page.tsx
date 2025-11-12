"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AddSchoolPage() {
  const [formData, setFormData] = useState({
    schoolName: '',
    schoolCode: '',
    principalName: '',
    principalEmail: ''
  })

  const handleSubmit = () => {
    console.log('Submitting:', formData)
    window.location.href = '/super-admin/schools/success'
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      <div>
        <h1 className="text-2xl font-bold">Add New School</h1>
        <p className="text-gray-600 text-sm">Complete school registration</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="schoolName">School Name</Label>
            <Input
              id="schoolName"
              value={formData.schoolName}
              onChange={(e) => setFormData(prev => ({ ...prev, schoolName: e.target.value }))}
              placeholder="Enter school name"
            />
          </div>
          
          <div>
            <Label htmlFor="schoolCode">School Code</Label>
            <Input
              id="schoolCode"
              value={formData.schoolCode}
              onChange={(e) => setFormData(prev => ({ ...prev, schoolCode: e.target.value }))}
              placeholder="e.g., DPS001"
            />
          </div>

          <div>
            <Label htmlFor="principalName">Principal Name</Label>
            <Input
              id="principalName"
              value={formData.principalName}
              onChange={(e) => setFormData(prev => ({ ...prev, principalName: e.target.value }))}
              placeholder="Principal's name"
            />
          </div>

          <div>
            <Label htmlFor="principalEmail">Principal Email</Label>
            <Input
              id="principalEmail"
              type="email"
              value={formData.principalEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, principalEmail: e.target.value }))}
              placeholder="principal@school.com"
            />
          </div>

          <Button onClick={handleSubmit} className="w-full">
            Submit Registration
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}