"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { superAdminAPI } from "@/lib/api/super-admin"
import { 
  Crown, Edit, Trash2, Plus, Users, Building2, CheckCircle
} from "lucide-react"

interface SubscriptionPlan {
  id: string
  name: string
  code: string
  monthlyPrice: number
  yearlyPrice: number
  maxStudents: number
  maxBranches: number
  features: string[]
  isActive: boolean
}

export default function SubscriptionPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data: any[] = [] // TODO: Add subscription plans API method
        setPlans(data)
      } catch (error) {
        console.error('Failed to fetch plans:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlans()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Subscription Plans</h1>
          <p className="text-gray-600">Manage pricing tiers and features</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            {plan.code === 'PREMIUM' && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                  <Crown className="h-3 w-3 mr-1" />
                  Popular
                </span>
              </div>
            )}
            <CardHeader className="text-center">
              <CardTitle className="text-xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold text-blue-600">
                ₹{plan.monthlyPrice.toLocaleString()}
                <span className="text-sm text-gray-500">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  {plan.maxStudents === -1 ? 'Unlimited' : plan.maxStudents} students
                </div>
                <div className="flex items-center text-sm">
                  <Building2 className="h-4 w-4 mr-2 text-green-500" />
                  {plan.maxBranches === -1 ? 'Unlimited' : plan.maxBranches} branches
                </div>
              </div>
              
              <ul className="space-y-2 mb-6">
                {plan.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}