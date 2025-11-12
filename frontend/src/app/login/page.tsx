"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  GraduationCap, User, Lock, Building2, 
  Eye, EyeOff, AlertCircle
} from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    schoolCode: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-tenant': formData.schoolCode
        },
        body: JSON.stringify({ email: formData.email, password: formData.password })
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('schoolId', data.schoolId)
        
        // Redirect based on role
        const redirectPath = getRoleBasedRedirect(data.user.role, data.schoolId)
        window.location.href = redirectPath
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getRoleBasedRedirect = (role: string, schoolId: string) => {
    switch (role) {
      case 'super_admin': return '/schools'
      case 'admin': return `/schools/${schoolId}/manage`
      case 'teacher': return '/teacher'
      case 'student': return '/dashboard'
      case 'parent': return '/dashboard'
      case 'accountant': return '/accountant'
      default: return '/dashboard'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">EduVerse Login</CardTitle>
          <CardDescription>Access your school management system</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">School Code</label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  value={formData.schoolCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, schoolCode: e.target.value }))}
                  placeholder="Enter school code"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter password"
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a href="/register-school" className="text-blue-600 hover:underline">
                Register your school
              </a>
            </p>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Demo Accounts:</h4>
            <div className="text-xs text-gray-600 space-y-1">
              <p className="cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => setFormData({ email: 'superadmin@demo.com', password: 'admin123', schoolCode: 'platform' })}>Super Admin: superadmin@demo.com / admin123</p>
              <p className="cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => setFormData({ email: 'admin@demo.com', password: 'school123', schoolCode: 'DEMO001' })}>School Admin: admin@demo.com / school123</p>
              <p className="cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => setFormData({ email: 'teacher@demo.com', password: 'teacher123', schoolCode: 'DEMO001' })}>Teacher: teacher@demo.com / teacher123</p>
              <p className="cursor-pointer hover:bg-blue-50 p-1 rounded" onClick={() => setFormData({ email: 'student@demo.com', password: 'student123', schoolCode: 'DEMO001' })}>Student: student@demo.com / student123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}