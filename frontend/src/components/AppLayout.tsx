"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { 
  GraduationCap, Users, CreditCard, Calendar, BarChart3, 
  Bell, Settings, BookOpen, Award, MessageSquare, 
  Menu, X, LogOut, User, Building2, Globe, IndianRupee,
  AlertCircle, FileText, Receipt, CheckCircle, TrendingUp, ChevronRight
} from 'lucide-react'
import { Toaster } from '@/components/ui/toast'

const sidebarItems = {
  super_admin: [
    { icon: BarChart3, label: 'Platform Overview', href: '/super-admin' },
    { icon: Building2, label: 'Schools', href: '/super-admin/schools' },
    { icon: Building2, label: 'Branches', href: '/super-admin/branches' },
    { icon: Users, label: 'All Users', href: '/super-admin/users' },
    { 
      icon: BookOpen, 
      label: 'Master Data', 
      href: '/super-admin/master',
      subItems: [
        { label: 'Academic Years', href: '/master/academic-years' },
        { label: 'Classes', href: '/master/classes' },
        { label: 'Subjects', href: '/master/subjects' },
        { label: 'Class-Subject Mapping', href: '/master/class-subject-mappings' },
        { label: 'Teachers', href: '/master/teachers' },
        { label: 'Students', href: '/master/students' },
        { label: 'Fee Structure', href: '/master/fee-structures' }
      ]
    },
    { icon: IndianRupee, label: 'Billing & Revenue', href: '/super-admin/billing' },
    { icon: Globe, label: 'Analytics', href: '/super-admin/analytics' },
    { icon: Settings, label: 'Platform Settings', href: '/super-admin/settings' },
  ],
  admin: [
    { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
    { 
      icon: BookOpen, 
      label: 'Master Data', 
      href: '/master',
      subItems: [
        { label: 'Academic Years', href: '/master/academic-years' },
        { label: 'Classes', href: '/master/classes' },
        { label: 'Subjects', href: '/master/subjects' },
        { label: 'Class-Subject Mapping', href: '/master/class-subject-mappings' },
        { label: 'Teachers', href: '/master/teachers' },
        { label: 'Students', href: '/master/students' },
        { label: 'Fee Structure', href: '/master/fee-structures' }
      ]
    },
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
  const [expandedMenus, setExpandedMenus] = useState<string[]>([])
  const pathname = usePathname()

  const toggleSubmenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }
  
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

      <div className={`fixed inset-y-0 left-0 z-50 w-56 ${theme.sidebar} shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
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

        <nav className="flex-1 px-3 py-4 overflow-hidden">
          <div className="space-y-1">
            {sidebarItems[currentUser.role as keyof typeof sidebarItems]?.map((item, index) => (
              <div key={item.href}>
                <a
                  href={(item as any).subItems ? '#' : item.href}
                  onClick={(item as any).subItems ? (e) => { e.preventDefault(); toggleSubmenu(item.label) } : undefined}
                  className={`flex items-center px-3 py-2 ${theme.sidebarText} rounded-lg ${theme.sidebarHover} transition-all duration-200 group ${
                    pathname === item.href ? 'bg-white/10' : ''
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-3 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {(item as any).subItems && (
                    <ChevronRight className={`h-3 w-3 transition-transform duration-200 ${
                      expandedMenus.includes(item.label) ? 'rotate-90' : ''
                    }`} />
                  )}
                </a>
                
                {(item as any).subItems && expandedMenus.includes(item.label) && (
                  <div className="ml-6 mt-1 space-y-1">
                    {(item as any).subItems.map((subItem: any) => (
                      <a
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center px-3 py-1.5 text-xs ${theme.sidebarText} rounded-md hover:bg-white/5 transition-all duration-200 ${
                          pathname === subItem.href ? 'bg-white/10 font-medium' : ''
                        }`}
                      >
                        <div className="w-1.5 h-1.5 bg-white/40 rounded-full mr-2"></div>
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>


      </div>

      <div className="lg:ml-56">
        <header className="sticky top-0 bg-white/95 backdrop-blur-md shadow-sm border-b h-14 flex items-center justify-between px-4 z-40">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-1.5 rounded hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="text-sm font-medium text-gray-600">
              {isSuperAdmin ? 'Platform Administrator' : 
               isAdmin ? 'School Administrator' : 
               currentUser.role === 'student' ? 'Student Portal' :
               currentUser.role === 'parent' ? 'Parent Portal' :
               currentUser.role === 'accountant' ? 'Finance & Accounts' :
               currentUser.role === 'teacher' ? 'Teaching Portal' :
               currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-1.5 rounded hover:bg-gray-100">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
            
            <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-50">
              <div className={`w-7 h-7 ${theme.badge} rounded-full flex items-center justify-center`}>
                <User className="h-3 w-3 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xs font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-500 uppercase">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
            
            <button 
              className="p-1.5 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-900"
              onClick={() => {
                localStorage.removeItem('user')
                localStorage.removeItem('token')
                window.location.href = '/login'
              }}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Global Toast Notifications */}
      <Toaster />
    </div>
  )
}