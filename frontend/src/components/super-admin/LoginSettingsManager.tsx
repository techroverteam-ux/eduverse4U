"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Shield, Key, Users, Settings, Eye, EyeOff, 
  Lock, Unlock, AlertTriangle, CheckCircle, 
  Clock, UserCheck, UserX, Smartphone, Mail
} from "lucide-react"
import { superAdminAuth } from '@/lib/auth/super-admin-auth'

interface LoginSettings {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    expiryDays: number
  }
  security: {
    maxLoginAttempts: number
    lockoutDuration: number
    sessionTimeout: number
    twoFactorRequired: boolean
    ipWhitelist: string[]
  }
  notifications: {
    loginAlerts: boolean
    failedLoginAlerts: boolean
    newDeviceAlerts: boolean
    passwordExpiryAlerts: boolean
  }
}

interface ActiveSession {
  id: string
  userId: string
  userEmail: string
  userRole: string
  ipAddress: string
  userAgent: string
  location: string
  loginTime: string
  lastActivity: string
  isCurrentSession: boolean
}

const mockSessions: ActiveSession[] = [
  {
    id: '1',
    userId: 'user1',
    userEmail: 'admin@eduverse.com',
    userRole: 'super_admin',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome 120.0.0.0',
    location: 'Mumbai, India',
    loginTime: '2024-01-15 09:30:00',
    lastActivity: '2024-01-15 14:25:00',
    isCurrentSession: true
  },
  {
    id: '2',
    userId: 'user2',
    userEmail: 'principal@dpsmumbai.edu.in',
    userRole: 'admin',
    ipAddress: '203.192.12.45',
    userAgent: 'Safari 17.2.1',
    location: 'Delhi, India',
    loginTime: '2024-01-15 08:15:00',
    lastActivity: '2024-01-15 14:20:00',
    isCurrentSession: false
  }
]

export default function LoginSettingsManager() {
  const [activeTab, setActiveTab] = useState('password-policy')
  const [settings, setSettings] = useState<LoginSettings>({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
      expiryDays: 90
    },
    security: {
      maxLoginAttempts: 5,
      lockoutDuration: 30,
      sessionTimeout: 60,
      twoFactorRequired: false,
      ipWhitelist: []
    },
    notifications: {
      loginAlerts: true,
      failedLoginAlerts: true,
      newDeviceAlerts: true,
      passwordExpiryAlerts: true
    }
  })
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>(mockSessions)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [twoFactorQR, setTwoFactorQR] = useState('')
  const [saving, setSaving] = useState(false)

  const tabs = [
    { id: 'password-policy', label: 'Password Policy', icon: Lock },
    { id: 'security', label: 'Security Settings', icon: Shield },
    { id: 'sessions', label: 'Active Sessions', icon: Users },
    { id: 'two-factor', label: 'Two-Factor Auth', icon: Smartphone },
    { id: 'notifications', label: 'Login Notifications', icon: Mail }
  ]

  const updatePasswordPolicy = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      passwordPolicy: {
        ...prev.passwordPolicy,
        [field]: value
      }
    }))
  }

  const updateSecurity = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value
      }
    }))
  }

  const updateNotifications = (field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value
      }
    }))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      // Save settings via API
      await new Promise(resolve => setTimeout(resolve, 2000))
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  const enableTwoFactor = async () => {
    try {
      const result = await superAdminAuth.enableTwoFactor()
      setTwoFactorQR(result.qrCode)
      setShowTwoFactorSetup(true)
    } catch (error) {
      alert('Failed to enable 2FA')
    }
  }

  const revokeSession = async (sessionId: string) => {
    if (confirm('Are you sure you want to revoke this session?')) {
      try {
        await superAdminAuth.revokeSession(sessionId)
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId))
        alert('Session revoked successfully')
      } catch (error) {
        alert('Failed to revoke session')
      }
    }
  }

  const revokeAllSessions = async () => {
    if (confirm('Are you sure you want to revoke all sessions? This will log out all users.')) {
      try {
        await superAdminAuth.revokeAllSessions()
        setActiveSessions([])
        alert('All sessions revoked successfully')
      } catch (error) {
        alert('Failed to revoke all sessions')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Login Settings Management
          </h1>
          <p className="text-gray-600 text-lg">Configure authentication, security, and session management</p>
        </div>
        <Button onClick={saveSettings} disabled={saving}
                className="bg-gradient-to-r from-purple-600 to-blue-600">
          {saving ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Password Policy */}
          {activeTab === 'password-policy' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Lock className="h-5 w-5" />
                  <span>Password Policy</span>
                </CardTitle>
                <CardDescription>Configure password requirements for all users</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Minimum Length</label>
                    <input
                      type="number"
                      value={settings.passwordPolicy.minLength}
                      onChange={(e) => updatePasswordPolicy('minLength', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password Expiry (days)</label>
                    <input
                      type="number"
                      value={settings.passwordPolicy.expiryDays}
                      onChange={(e) => updatePasswordPolicy('expiryDays', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Character Requirements</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { key: 'requireUppercase', label: 'Uppercase Letters' },
                      { key: 'requireLowercase', label: 'Lowercase Letters' },
                      { key: 'requireNumbers', label: 'Numbers' },
                      { key: 'requireSpecialChars', label: 'Special Characters' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={item.key}
                          checked={(settings.passwordPolicy as any)[item.key]}
                          onChange={(e) => updatePasswordPolicy(item.key, e.target.checked)}
                          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <label htmlFor={item.key} className="text-sm">{item.label}</label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Security Settings</span>
                </CardTitle>
                <CardDescription>Configure login security and access controls</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Login Attempts</label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => updateSecurity('maxLoginAttempts', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Lockout Duration (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.lockoutDuration}
                      onChange={(e) => updateSecurity('lockoutDuration', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeout}
                      onChange={(e) => updateSecurity('sessionTimeout', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="twoFactorRequired"
                    checked={settings.security.twoFactorRequired}
                    onChange={(e) => updateSecurity('twoFactorRequired', e.target.checked)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="twoFactorRequired" className="text-sm font-medium">
                    Require Two-Factor Authentication for all users
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Active Sessions */}
          {activeTab === 'sessions' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Active Sessions ({activeSessions.length})</span>
                  </div>
                  <Button variant="outline" onClick={revokeAllSessions} className="text-red-600 hover:text-red-700">
                    Revoke All Sessions
                  </Button>
                </CardTitle>
                <CardDescription>Monitor and manage active user sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activeSessions.map((session) => (
                    <div key={session.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <UserCheck className="h-4 w-4 text-green-600" />
                            <span className="font-medium">{session.userEmail}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {session.userRole}
                            </span>
                            {session.isCurrentSession && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Current Session
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                            <div>IP: {session.ipAddress}</div>
                            <div>Device: {session.userAgent}</div>
                            <div>Location: {session.location}</div>
                            <div>Login: {session.loginTime}</div>
                            <div>Last Activity: {session.lastActivity}</div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revokeSession(session.id)}
                          disabled={session.isCurrentSession}
                          className="text-red-600 hover:text-red-700"
                        >
                          <UserX className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Two-Factor Authentication */}
          {activeTab === 'two-factor' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Smartphone className="h-5 w-5" />
                  <span>Two-Factor Authentication</span>
                </CardTitle>
                <CardDescription>Configure 2FA settings for enhanced security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication Status</h3>
                    <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                  </div>
                  <Button onClick={enableTwoFactor} className="bg-gradient-to-r from-purple-600 to-blue-600">
                    Enable 2FA
                  </Button>
                </div>

                {showTwoFactorSetup && (
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium mb-4">Setup Two-Factor Authentication</h3>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                          <span className="text-gray-500">QR Code Placeholder</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Scan this QR code with your authenticator app
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Verification Code</label>
                        <input
                          type="text"
                          placeholder="Enter 6-digit code"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                          Verify & Enable
                        </Button>
                        <Button variant="outline" onClick={() => setShowTwoFactorSetup(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Login Notifications */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Login Notifications</span>
                </CardTitle>
                <CardDescription>Configure notification preferences for login events</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {Object.entries(settings.notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-medium">
                          {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {key === 'loginAlerts' && 'Get notified when users log in'}
                          {key === 'failedLoginAlerts' && 'Get notified about failed login attempts'}
                          {key === 'newDeviceAlerts' && 'Get notified when users log in from new devices'}
                          {key === 'passwordExpiryAlerts' && 'Get notified about upcoming password expiries'}
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => updateNotifications(key, e.target.checked)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
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