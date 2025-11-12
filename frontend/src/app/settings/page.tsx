'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Sidebar from "@/components/layout/sidebar"
import { Settings, Palette, Globe, Shield, Bell } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    schoolName: '',
    logo: '',
    themeColor: '#3B82F6',
    subdomain: '',
    customDomain: '',
    smsEnabled: false,
    emailEnabled: true,
    backupEnabled: true
  })

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.tenant) {
      setSettings({
        schoolName: user.tenant.name || '',
        logo: user.tenant.logoUrl || '',
        themeColor: user.tenant.themeColor || '#3B82F6',
        subdomain: user.tenant.subdomain || '',
        customDomain: user.tenant.customDomain || '',
        smsEnabled: false,
        emailEnabled: true,
        backupEnabled: true
      })
    }
  }, [])

  const saveSettings = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tenants/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        alert('Settings saved successfully!')
      }
    } catch (error) {
      alert('Error saving settings')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your school configuration and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    School Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      value={settings.schoolName}
                      onChange={(e) => setSettings({...settings, schoolName: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subdomain">School Code</Label>
                    <Input
                      id="subdomain"
                      value={settings.subdomain}
                      onChange={(e) => setSettings({...settings, subdomain: e.target.value})}
                      placeholder="your-school"
                    />
                    <p className="text-xs text-gray-500">
                      Students and parents will use this code to login
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customDomain">Custom Domain (Optional)</Label>
                    <Input
                      id="customDomain"
                      value={settings.customDomain}
                      onChange={(e) => setSettings({...settings, customDomain: e.target.value})}
                      placeholder="school.edu.in"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Branding & Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="themeColor">Theme Color</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="themeColor"
                        type="color"
                        value={settings.themeColor}
                        onChange={(e) => setSettings({...settings, themeColor: e.target.value})}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.themeColor}
                        onChange={(e) => setSettings({...settings, themeColor: e.target.value})}
                        placeholder="#3B82F6"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">School Logo URL</Label>
                    <Input
                      id="logo"
                      value={settings.logo}
                      onChange={(e) => setSettings({...settings, logo: e.target.value})}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-gray-500">Send SMS alerts to parents</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.smsEnabled}
                      onChange={(e) => setSettings({...settings, smsEnabled: e.target.checked})}
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Send email updates</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.emailEnabled}
                      onChange={(e) => setSettings({...settings, emailEnabled: e.target.checked})}
                      className="h-4 w-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Backup</Label>
                      <p className="text-sm text-gray-500">Daily data backup</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.backupEnabled}
                      onChange={(e) => setSettings({...settings, backupEnabled: e.target.checked})}
                      className="h-4 w-4"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg p-4" style={{ borderColor: settings.themeColor }}>
                    <div className="flex items-center space-x-2 mb-4">
                      {settings.logo && (
                        <img src={settings.logo} alt="Logo" className="h-8 w-8 rounded" />
                      )}
                      <span className="font-bold" style={{ color: settings.themeColor }}>
                        {settings.schoolName || 'Your School Name'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Login URL: {settings.subdomain}.eduverse.in</p>
                      {settings.customDomain && (
                        <p>Custom: {settings.customDomain}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full">
                    Change Password
                  </Button>
                  <Button variant="outline" className="w-full">
                    Two-Factor Auth
                  </Button>
                  <Button variant="outline" className="w-full">
                    API Keys
                  </Button>
                </CardContent>
              </Card>

              <div className="mt-6">
                <Button onClick={saveSettings} className="w-full">
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}