"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  GraduationCap, Users, CreditCard, Calendar, BarChart3, 
  Bell, Settings, BookOpen, Award, MessageSquare, 
  Menu, X, LogOut, User, Building2, Globe, IndianRupee,
  AlertCircle, FileText, Receipt, CheckCircle, TrendingUp
} from 'lucide-react'

const sidebarItems = {
  super_admin: [
    { icon: BarChart3, label: 'Platform Overview', href: '/super-admin' },
    { icon: Building2, label: 'Schools Management', href: '/super-admin/schools' },
    { icon: Users, label: 'All Users', href: '/super-admin/users' },
    { icon: IndianRupee, label: 'Billing & Revenue', href: '/super-admin/billing' },
    { icon: Globe, label: 'Analytics', href: '/super-admin/analytics' },
    { icon: Settings, label: 'Platform Settings', href: '/super-admin/settings' },
  ],
  admin: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Students', href: '/dashboard/students' },
    { icon: BookOpen, label: 'Classes', href: '/dashboard/classes' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: CreditCard, label: 'Fees', href: '/dashboard/fees' },
    { icon: Award, label: 'Grades', href: '/dashboard/grades' },
    { icon: MessageSquare, label: 'Messages', href: '/dashboard/messages' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
  ],
  teacher: [
    { icon: BarChart3, label: 'Dashboard', href: '/teacher' },
    { icon: Calendar, label: 'Schedule', href: '/teacher/schedule' },
    { icon: CheckCircle, label: 'Attendance', href: '/teacher/attendance' },
    { icon: IndianRupee, label: 'Salary', href: '/teacher/salary' },
    { icon: TrendingUp, label: 'Performance', href: '/teacher/performance' },
    { icon: BookOpen, label: 'Classes', href: '/teacher/classes' },
  ],
  student: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: Award, label: 'Grades', href: '/dashboard/grades' },
    { icon: Calendar, label: 'Schedule', href: '/dashboard/schedule' },
    { icon: CreditCard, label: 'Fees', href: '/dashboard/fees' },
  ],
  parent: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { icon: Users, label: 'Children', href: '/dashboard/students' },
    { icon: CreditCard, label: 'Fees', href: '/dashboard/fees' },
    { icon: MessageSquare, label: 'Complaints', href: '/dashboard/complaints' },
    { icon: Bell, label: 'Notifications', href: '/dashboard/notifications' },
  ],
  accountant: [
    { icon: BarChart3, label: 'Dashboard', href: '/accountant' },
    { icon: CreditCard, label: 'Fee Collection', href: '/accountant/fee-collection' },
    { icon: IndianRupee, label: 'Fee Structure', href: '/accountant/fee-structure' },
    { icon: AlertCircle, label: 'Defaulters', href: '/accountant/defaulters' },
    { icon: FileText, label: 'Reports', href: '/accountant/reports' },
    { icon: Receipt, label: 'Receipts', href: '/accountant/receipts' },
    { icon: BarChart3, label: 'Transactions', href: '/accountant/transactions' },
  ]
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState({ role: 'admin' as any, name: 'Admin User', email: 'admin@school.edu' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user')
      if (user) {
        try {
          setCurrentUser(JSON.parse(user))
        } catch (error) {
          console.error('Error parsing user data:', error)
          // Set default user if parsing fails
          setCurrentUser({ role: 'admin', name: 'Admin User', email: 'admin@school.edu' })
        }
      } else {
        // Set default user if no user in localStorage
        setCurrentUser({ role: 'admin', name: 'Admin User', email: 'admin@school.edu' })
      }
    }
  }, [])
  
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/'
  
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  }
  
  if (isAuthPage) {
    return <>{children}</>
  }
  
  const isSuperAdmin = currentUser.role === 'super_admin'
  const isAdmin = currentUser.role === 'admin'
  
  const getTheme = () => {
    return {
      bg: 'bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100',
      sidebar: 'bg-gradient-to-b from-purple-900 via-blue-900 to-indigo-900',
      sidebarText: 'text-purple-100',
      sidebarHover: 'hover:bg-purple-700/50 hover:text-white',
      accent: 'text-purple-400',
      badge: 'bg-gradient-to-r from-purple-500 to-pink-500'
    }
  }
  
  const theme = getTheme()

  return (
    <div className={`min-h-screen ${theme.bg}`}>
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 ${theme.sidebar} shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-8 w-8 text-white" />
            <span className="text-xl font-bold text-white">EduVerse</span>
            {isSuperAdmin && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>SUPER</span>}
            {isAdmin && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>ADMIN</span>}
            {currentUser.role === 'student' && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>STUDENT</span>}
            {currentUser.role === 'parent' && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>PARENT</span>}
            {currentUser.role === 'accountant' && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>ACCOUNTANT</span>}
            {currentUser.role === 'teacher' && <span className={`text-xs ${theme.badge} text-white px-2 py-1 rounded-full font-bold`}>TEACHER</span>}
          </div>
          <button
            className="lg:hidden text-white hover:bg-white/10 p-2 rounded"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-6 px-3">
          {sidebarItems[currentUser.role as keyof typeof sidebarItems]?.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 ${theme.sidebarText} rounded-xl ${theme.sidebarHover} transition-all duration-200 mb-2 group relative overflow-hidden ${
                pathname === item.href ? 'bg-white/10' : ''
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <item.icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform relative z-10" />
              <span className="font-medium relative z-10">{item.label}</span>
              {pathname === item.href && <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>}
            </a>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <div className="flex items-center space-x-3 mb-3">
            <div className={`w-10 h-10 ${theme.badge} rounded-full flex items-center justify-center shadow-lg`}>
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{currentUser.name}</p>
              <p className="text-xs text-white/70">{currentUser.email}</p>
              <p className={`text-xs ${theme.accent} font-semibold uppercase tracking-wide`}>{currentUser.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button 
            className="w-full flex items-center justify-start px-3 py-2 text-white/80 hover:bg-white/10 hover:text-white rounded transition-colors"
            onClick={() => {
              localStorage.removeItem('user')
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>

      <div className="lg:ml-64">
        <header className="bg-white/80 backdrop-blur-md shadow-lg border-b h-16 flex items-center justify-between px-6">
          <button
            className="lg:hidden p-2 rounded hover:bg-gray-100"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-600">
              {isSuperAdmin ? 'Platform Administrator' : 
               isAdmin ? 'School Administrator' : 
               currentUser.role === 'student' ? 'Student Portal' :
               currentUser.role === 'parent' ? 'Parent Portal' :
               currentUser.role === 'accountant' ? 'Finance & Accounts' :
               currentUser.role === 'teacher' ? 'Teaching Portal' :
               currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </div>
            <button className="relative p-2 rounded hover:bg-gray-100">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}