"use client"

import { useState, useEffect } from 'react'
import { superAdminAPI } from '@/lib/api/super-admin'
import { masterAPI } from '@/lib/api/master'

export interface FilterOptions {
  schools: Array<{ id: string; name: string }>
  branches: Array<{ id: string; name: string; schoolId: string }>
  academicYears: Array<{ id: string; name: string; schoolId: string }>
  classes: Array<{ id: string; name: string; section: string; schoolId: string }>
}

export const useFilters = () => {
  const [filters, setFilters] = useState<FilterOptions>({
    schools: [],
    branches: [],
    academicYears: [],
    classes: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      setLoading(true)
      
      // Create default school if none exists
      let schools = await superAdminAPI.getAllSchools().catch(() => [])
      
      if (schools.length === 0) {
        // Create a default school for demo purposes
        schools = [{
          id: 'default-school-1',
          name: 'Demo Public School',
          address: 'Demo Address',
          phone: '+91-9876543210',
          email: 'demo@school.edu',
          principalName: 'Dr. Demo Principal'
        }]
        // Store the default school ID
        localStorage.setItem('schoolId', schools[0].id)
      }
      
      // Create default branches for each school
      let branches = []
      try {
        branches = await superAdminAPI.getAllBranches()
      } catch (error) {
        console.log('Failed to fetch branches, using default data')
      }
      
      if (branches.length === 0) {
        branches = schools.flatMap((school: any) => [
          {
            id: `${school.id}-branch-main`,
            name: 'Main Campus',
            schoolId: school.id,
            address: 'Main Campus Address',
            phone: '+91-9876543210',
            isActive: true
          },
          {
            id: `${school.id}-branch-secondary`,
            name: 'Secondary Campus',
            schoolId: school.id,
            address: 'Secondary Campus Address',
            phone: '+91-9876543211',
            isActive: true
          }
        ])
      }
      
      // Get current school ID from localStorage or use first school
      const currentSchoolId = localStorage.getItem('schoolId') || schools[0]?.id
      
      if (currentSchoolId) {
        // Fetch academic years and classes for current school
        const [academicYears, classes] = await Promise.all([
          masterAPI.getAcademicYears(currentSchoolId).catch(() => []),
          masterAPI.getClasses(currentSchoolId).catch(() => [])
        ])
        
        setFilters({
          schools: schools.map((s: any) => ({ id: s.id, name: s.name })),
          branches: branches.map((b: any) => ({ 
            id: b.id, 
            name: b.name, 
            schoolId: b.schoolId 
          })),
          academicYears: academicYears.map((ay: any) => ({ 
            id: ay.id, 
            name: ay.name, 
            schoolId: ay.schoolId || currentSchoolId
          })),
          classes: classes.map((c: any) => ({ 
            id: c.id, 
            name: c.section ? `${c.name} - ${c.section}` : c.name, 
            section: c.section || 'A',
            schoolId: c.schoolId || currentSchoolId
          }))
        })
      }
    } catch (error) {
      console.error('Failed to fetch filter options:', error)
      // Set default data even if API fails
      const defaultSchoolId = 'default-school-1'
      localStorage.setItem('schoolId', defaultSchoolId)
      
      setFilters({
        schools: [{ id: defaultSchoolId, name: 'Demo Public School' }],
        branches: [
          { id: `${defaultSchoolId}-branch-main`, name: 'Main Campus', schoolId: defaultSchoolId },
          { id: `${defaultSchoolId}-branch-secondary`, name: 'Secondary Campus', schoolId: defaultSchoolId },
          { id: `${defaultSchoolId}-branch-north`, name: 'North Branch', schoolId: defaultSchoolId }
        ],
        academicYears: [
          { id: 'ay-2023-24', name: '2023-24', schoolId: defaultSchoolId },
          { id: 'ay-2024-25', name: '2024-25', schoolId: defaultSchoolId },
          { id: 'ay-2022-23', name: '2022-23', schoolId: defaultSchoolId }
        ],
        classes: [
          { id: 'class-1a', name: 'Class 1 - A', section: 'A', schoolId: defaultSchoolId },
          { id: 'class-2a', name: 'Class 2 - A', section: 'A', schoolId: defaultSchoolId },
          { id: 'class-5a', name: 'Class 5 - A', section: 'A', schoolId: defaultSchoolId },
          { id: 'class-10a', name: 'Class 10 - A', section: 'A', schoolId: defaultSchoolId },
          { id: 'class-12a', name: 'Class 12 - Science', section: 'Science', schoolId: defaultSchoolId }
        ]
      })
    } finally {
      setLoading(false)
    }
  }

  const getFilteredBranches = (schoolId: string) => {
    return filters.branches.filter(branch => branch.schoolId === schoolId)
  }

  const getFilteredAcademicYears = (schoolId: string) => {
    return filters.academicYears.filter(ay => ay.schoolId === schoolId)
  }

  const getFilteredClasses = (schoolId: string) => {
    return filters.classes.filter(cls => cls.schoolId === schoolId)
  }

  return {
    filters,
    loading,
    refetch: fetchFilterOptions,
    getFilteredBranches,
    getFilteredAcademicYears,
    getFilteredClasses
  }
}