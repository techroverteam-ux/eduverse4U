"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, CreditCard, Calendar, BarChart3, Bell } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">EduVerse</span>
            </div>
            <div className="flex space-x-4">
              <Button variant="outline" onClick={() => window.location.href = '/login'}>Login</Button>
              <Button onClick={() => window.location.href = '/register'}>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            India's Most Advanced
            <span className="text-blue-600"> School Management</span> System
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Streamline admissions, fees, attendance, and communication with our NEP 2020 compliant ERP solution. 
            Built for Indian schools, colleges, and coaching institutes.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8" onClick={() => window.location.href = '/register'}>Start Free Trial</Button>
            <Button variant="outline" size="lg" onClick={() => alert('Demo coming soon!')}>Watch Demo</Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Everything Your School Needs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-600 mb-2" />
                <CardTitle>Student Management</CardTitle>
                <CardDescription>
                  Complete student lifecycle from admission to graduation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Digital admission process</li>
                  <li>• Student profiles & documents</li>
                  <li>• Parent communication portal</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CreditCard className="h-10 w-10 text-green-600 mb-2" />
                <CardTitle>Fee Management</CardTitle>
                <CardDescription>
                  Automated fee collection with UPI integration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Online fee payment</li>
                  <li>• Automated receipts</li>
                  <li>• Fee reminder system</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="h-10 w-10 text-purple-600 mb-2" />
                <CardTitle>Attendance & Timetable</CardTitle>
                <CardDescription>
                  Smart attendance tracking and scheduling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• RFID/Biometric support</li>
                  <li>• Automated timetable</li>
                  <li>• Real-time notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-orange-600 mb-2" />
                <CardTitle>Analytics & Reports</CardTitle>
                <CardDescription>
                  Data-driven insights for better decisions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Performance analytics</li>
                  <li>• Financial reports</li>
                  <li>• Attendance trends</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Bell className="h-10 w-10 text-red-600 mb-2" />
                <CardTitle>Communication Hub</CardTitle>
                <CardDescription>
                  Seamless school-parent-student communication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SMS & Email alerts</li>
                  <li>• Mobile app notifications</li>
                  <li>• Announcement system</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-indigo-600 mb-2" />
                <CardTitle>NEP 2020 Compliant</CardTitle>
                <CardDescription>
                  Aligned with National Education Policy
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Government reporting</li>
                  <li>• CBSE/ICSE formats</li>
                  <li>• Compliance tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 1000+ schools already using EduVerse ERP
          </p>
          <Button size="lg" variant="secondary" className="px-8" onClick={() => window.location.href = '/register'}>
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <GraduationCap className="h-6 w-6" />
                <span className="text-xl font-bold">EduVerse</span>
              </div>
              <p className="text-gray-400">
                Empowering education through technology
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white cursor-pointer">Features</a></li>
                <li><a href="/pricing" className="hover:text-white cursor-pointer">Pricing</a></li>
                <li><a href="#" onClick={() => alert('Demo coming soon!')} className="hover:text-white cursor-pointer">Demo</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/help" className="hover:text-white cursor-pointer">Help Center</a></li>
                <li><a href="mailto:support@eduverse.in" className="hover:text-white cursor-pointer">Contact Us</a></li>
                <li><a href="/training" className="hover:text-white cursor-pointer">Training</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white cursor-pointer">About</a></li>
                <li><a href="/careers" className="hover:text-white cursor-pointer">Careers</a></li>
                <li><a href="/privacy" className="hover:text-white cursor-pointer">Privacy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EduVerse ERP. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}