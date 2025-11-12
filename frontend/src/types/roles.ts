export type UserRole = 'super_admin' | 'admin' | 'teacher' | 'student' | 'parent' | 'accountant'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
}

export const rolePermissions = {
  super_admin: ['platform_management', 'all_schools', 'billing', 'analytics'],
  admin: ['all'],
  teacher: ['students', 'classes', 'grades', 'attendance'],
  student: ['grades', 'schedule', 'fees'],
  parent: ['student_info', 'fees', 'messages'],
  accountant: ['fees', 'reports', 'students']
}