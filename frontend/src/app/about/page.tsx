'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Users, Target, Award } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About EduVerse</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming education through technology, one school at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">1000+ Schools</h3>
            <p className="text-gray-600">Trusted by educational institutions across India</p>
          </div>
          <div className="text-center">
            <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">NEP 2020 Compliant</h3>
            <p className="text-gray-600">Aligned with National Education Policy standards</p>
          </div>
          <div className="text-center">
            <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Award Winning</h3>
            <p className="text-gray-600">Recognized for innovation in education technology</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-4">
            To digitally transform India's education system by providing world-class, affordable school management solutions 
            that empower educators, engage parents, and enhance student success.
          </p>
          <p className="text-lg text-gray-700">
            Built specifically for the Indian education market, EduVerse ERP combines modern technology with deep understanding 
            of local requirements to deliver a comprehensive school management platform.
          </p>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h3>
          <Button onClick={() => router.push('/register')} size="lg">
            Start Your Free Trial
          </Button>
        </div>
      </div>
    </div>
  )
}