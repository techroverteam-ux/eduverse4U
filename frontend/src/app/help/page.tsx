'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MessageCircle, Book, Phone } from "lucide-react"
import { useRouter } from 'next/navigation'

export default function HelpPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Button variant="ghost" onClick={() => router.back()} className="mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600">Get the support you need to succeed with EduVerse</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader className="text-center">
              <MessageCircle className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Live Chat</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Get instant help from our support team</p>
              <Button onClick={() => alert('Chat widget will open here')}>Start Chat</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Book className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Documentation</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Browse our comprehensive guides</p>
              <Button variant="outline" onClick={() => alert('Documentation coming soon')}>View Docs</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Phone Support</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-600 mb-4">Call us for immediate assistance</p>
              <Button variant="outline" onClick={() => window.location.href = 'tel:+91-9876543210'}>
                Call Now
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Still Need Help?</h3>
          <p className="text-gray-600 mb-6">Send us an email and we'll get back to you within 24 hours</p>
          <Button onClick={() => window.location.href = 'mailto:support@eduverse.in'}>
            Email Support
          </Button>
        </div>
      </div>
    </div>
  )
}