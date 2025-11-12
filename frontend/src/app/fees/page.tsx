'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Sidebar from "@/components/layout/sidebar"
import { Plus, CreditCard, Receipt, Search } from "lucide-react"

export default function FeesPage() {
  const [activeTab, setActiveTab] = useState('collect')
  const [students, setStudents] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [payments, setPayments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/login'
      return
    }
    
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }

    try {
      const [studentsRes, structuresRes, paymentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/students`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/fees/structures`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/fees/payments`, { headers })
      ])

      setStudents(studentsRes.ok ? await studentsRes.json() : [])
      setFeeStructures(structuresRes.ok ? await structuresRes.json() : [])
      setPayments(paymentsRes.ok ? await paymentsRes.json() : [])
    } catch (error) {
      console.error('Error fetching data:', error)
      setStudents([])
      setFeeStructures([])
      setPayments([])
    }
  }

  const collectFee = async (studentId: string, feeStructureId: string, amount: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/fees/payments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          studentId,
          feeStructureId,
          amount,
          paymentMethod: 'cash'
        })
      })

      if (response.ok) {
        alert('Fee collected successfully!')
        fetchData()
      } else {
        const error = await response.json()
        alert(error.message || 'Error collecting fee')
      }
    } catch (error) {
      alert('Network error')
    }
  }

  const filteredStudents = students.filter((student: any) =>
    student.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.admissionNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fee Management</h1>
            <p className="text-gray-600">Collect fees and manage payment records</p>
          </div>
          <Button onClick={() => setActiveTab('structure')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Fee Structure
          </Button>
        </div>

        <div className="flex space-x-1 mb-6">
          <Button
            variant={activeTab === 'collect' ? 'default' : 'outline'}
            onClick={() => setActiveTab('collect')}
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Collect Fee
          </Button>
          <Button
            variant={activeTab === 'payments' ? 'default' : 'outline'}
            onClick={() => setActiveTab('payments')}
          >
            <Receipt className="h-4 w-4 mr-2" />
            Payment History
          </Button>
          <Button
            variant={activeTab === 'structure' ? 'default' : 'outline'}
            onClick={() => setActiveTab('structure')}
          >
            Fee Structures
          </Button>
        </div>

        {activeTab === 'collect' && (
          <Card>
            <CardHeader>
              <CardTitle>Collect Fee</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search student by name or admission number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredStudents.map((student: any) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">
                          {student.user?.firstName} {student.user?.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {student.admissionNumber} • Class {student.class} {student.section}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {feeStructures
                          .filter((fs: any) => fs.class === student.class)
                          .map((feeStructure: any) => (
                            <Button
                              key={feeStructure.id}
                              size="sm"
                              onClick={() => collectFee(student.id, feeStructure.id, feeStructure.amount)}
                            >
                              Collect ₹{feeStructure.amount} ({feeStructure.name})
                            </Button>
                          ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'payments' && (
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Receipt No.</th>
                      <th className="text-left py-3 px-4">Student</th>
                      <th className="text-left py-3 px-4">Amount</th>
                      <th className="text-left py-3 px-4">Method</th>
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment: any) => (
                      <tr key={payment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{payment.receiptNumber}</td>
                        <td className="py-3 px-4">
                          {payment.student?.user?.firstName} {payment.student?.user?.lastName}
                        </td>
                        <td className="py-3 px-4">₹{payment.amount}</td>
                        <td className="py-3 px-4 capitalize">{payment.paymentMethod}</td>
                        <td className="py-3 px-4">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline">
                            <Receipt className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'structure' && (
          <Card>
            <CardHeader>
              <CardTitle>Fee Structures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {feeStructures.map((structure: any) => (
                  <div key={structure.id} className="border rounded-lg p-4">
                    <h3 className="font-medium">{structure.name}</h3>
                    <p className="text-sm text-gray-600">Class {structure.class}</p>
                    <p className="text-lg font-bold text-green-600">₹{structure.amount}</p>
                    <p className="text-xs text-gray-500 capitalize">{structure.frequency}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      </div>
    </div>
  )
}