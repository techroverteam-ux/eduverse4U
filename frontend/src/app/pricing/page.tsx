'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, ArrowLeft } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()

  const plans = [
    {
      name: "Starter",
      price: "₹2,999",
      period: "/month",
      students: "Up to 500 students",
      features: ["Student Management", "Fee Collection", "Attendance Tracking", "Basic Reports", "Email Support"]
    },
    {
      name: "Professional", 
      price: "₹5,999",
      period: "/month",
      students: "Up to 2,000 students",
      popular: true,
      features: ["Everything in Starter", "Advanced Analytics", "SMS Notifications", "Bulk Operations", "Priority Support", "Custom Branding"]
    },
    {
      name: "Enterprise",
      price: "₹12,999", 
      period: "/month",
      students: "Unlimited students",
      features: ["Everything in Professional", "Multi-branch Support", "API Access", "Custom Integrations", "Dedicated Support", "On-premise Option"]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Choose the perfect plan for your school. All plans include a 30-day free trial.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">Most Popular</span>
                </div>
              )}
              
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-blue-600">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                <p className="text-gray-600 mt-2">{plan.students}</p>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-3" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full" variant={plan.popular ? "default" : "outline"} onClick={() => router.push('/register')}>
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Need a Custom Solution?</h3>
          <p className="text-gray-600 mb-6">Contact us for enterprise pricing and custom features</p>
          <Button variant="outline" onClick={() => window.location.href = 'mailto:sales@eduverse.in'}>Contact Sales</Button>
        </div>
      </div>
    </div>
  )
}