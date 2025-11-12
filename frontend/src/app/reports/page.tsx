'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import { FileText, Download, Calendar, Users, CreditCard } from "lucide-react"

export default function ReportsPage() {
  const [students, setStudents] = useState([])
  const [payments, setPayments] = useState([])
  const [selectedStudent, setSelectedStudent] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    try {
      const [studentsRes, paymentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/students`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/fees/payments`, { headers })
      ])

      setStudents(await studentsRes.json())
      setPayments(await paymentsRes.json())
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const generateReceipt = (paymentId: string) => {
    const token = localStorage.getItem('token')
    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/receipt/${paymentId}`
    window.open(url, '_blank')
  }

  const generateCertificate = (studentId: string) => {
    const token = localStorage.getItem('token')
    const url = `${process.env.NEXT_PUBLIC_API_URL}/reports/certificate/${studentId}`
    window.open(url, '_blank')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Documents</h1>
          <p className="text-gray-600">Generate certificates, receipts, and reports</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Fee Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {payments.slice(0, 10).map((payment: any) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {payment.student?.user?.firstName} {payment.student?.user?.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Receipt: {payment.receiptNumber} • ₹{payment.amount}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => generateReceipt(payment.id)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Receipt
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Choose a student</option>
                  {students.map((student: any) => (
                    <option key={student.id} value={student.id}>
                      {student.user?.firstName} {student.user?.lastName} - {student.admissionNumber}
                    </option>
                  ))}
                </select>

                <Button
                  className="w-full"
                  disabled={!selectedStudent}
                  onClick={() => selectedStudent && generateCertificate(selectedStudent)}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Certificate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  )
}